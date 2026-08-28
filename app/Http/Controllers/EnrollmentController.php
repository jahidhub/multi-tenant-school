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
            'status' => 'required|in:active,inactive',
        ]);

        $validated['tenant_id'] = $tenant_id;

        Enrollment::create($validated);

        return to_route('enrollment.index')->with([
            'type' => 'success',
            'message' => 'Enrollment added successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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
            'status' => 'required|in:active,inactive',
        ]);

        Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->update($validated);

        return to_route('enrollment.index')->with([
            'type' => 'success',
            'message' => 'Enrollment updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('enrollment.index')->with([
            'type' => 'success',
            'message' => 'Enrollment deleted successfully',
        ]);
    }
}
