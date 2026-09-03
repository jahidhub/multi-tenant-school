<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        $enrollments = Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->with(['student', 'course'])
            ->paginate(5);

        $students = Student::query()
            ->where('tenant_id', $tenant_id)
            ->get();

        $courses = Course::query()
            ->where('tenant_id', $tenant_id)
            ->where('status', 'active')
            ->get();

        return Inertia::render('enrollment/index', [
            'enrollments' => $enrollments,
            'students' => $students,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        // Support for single student enrollment from legacy/scaffolded forms
        if ($request->has('student_id') && !$request->has('student_ids')) {
            $request->merge([
                'student_ids' => (array) $request->input('student_id')
            ]);
        }

        $validated = $request->validate([
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => [
                Rule::exists('students', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'enrollment_date' => 'nullable|date',
            'status' => 'nullable|in:active,withdrawn,completed,inactive',
        ]);

        $course = Course::query()->where('tenant_id', $tenant_id)->findOrFail($validated['course_id']);
        $currentEnrollments = Enrollment::query()->where('tenant_id', $tenant_id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->count('id');

        $studentsToEnroll = array_unique($validated['student_ids']);

        // Check if any students are already enrolled to prevent duplicates manually
        $alreadyEnrolled = Enrollment::query()->where('tenant_id', $tenant_id)
            ->where('course_id', $course->id)
            ->whereIn('student_id', $studentsToEnroll, 'and', false)
            ->where('status', 'active')
            ->pluck('student_id')
            ->toArray();

        $newStudents = array_diff($studentsToEnroll, $alreadyEnrolled);

        if (empty($newStudents)) {
            return back()->with([
                'type' => 'error',
                'message' => 'All selected students are already enrolled in this course.',
            ]);
        }

        if (($currentEnrollments + count($newStudents)) > $course->capacity) {
            return back()->with([
                'type' => 'error',
                'message' => "Cannot enroll. Course capacity ($course->capacity) will be exceeded. Current active enrollments: $currentEnrollments.",
            ]);
        }

        $now = now();
        $enrollment_date = $validated['enrollment_date'] ?? $now->toDateString();
        $status = $validated['status'] ?? 'active';
        $insertData = [];
        foreach ($newStudents as $student_id) {
            $insertData[] = [
                'tenant_id' => $tenant_id,
                'student_id' => $student_id,
                'course_id' => $course->id,
                'enrollment_date' => $enrollment_date,
                'status' => $status,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Use upsert to handle the unique constraint gracefully if they were previously withdrawn
        Enrollment::query()->upsert($insertData, ['tenant_id', 'student_id', 'course_id'], ['status', 'enrollment_date', 'updated_at']);

        return back()->with([
            'type' => 'success',
            'message' => count($newStudents) . ' student(s) successfully enrolled.',
        ]);
    }

    public function withdraw(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $enrollment = Enrollment::query()->where('tenant_id', $tenant_id)->findOrFail($id);
        $enrollment->fill(['status' => 'withdrawn'])->save();

        return back()->with([
            'type' => 'success',
            'message' => 'Student successfully withdrawn from the course.',
        ]);
    }

    // Keep existing update and destroy if they are needed by the scaffold index, or just for completeness
    public function update(Request $request, string $id)
    {
        // Not strictly needed for the plan, but kept for scaffold compatibility
        $tenant_id = Auth::user()->tenant_id;
        $validated = $request->validate([
            'student_id' => [
                'required',
                Rule::exists('students', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,withdrawn,completed,inactive',
        ]);

        Enrollment::query()->where('tenant_id', $tenant_id)->where('id', $id)->update($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Enrollment status updated.',
        ]);
    }

    public function destroy(string $id)
    {
        Enrollment::query()->where('tenant_id', Auth::user()->tenant_id)->where('id', $id)->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Enrollment deleted successfully.',
        ]);
    }
}
