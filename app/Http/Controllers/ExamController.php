<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Exam;
use App\Models\Enrollment;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the exams.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        $exams = Exam::query()
            ->where('tenant_id', $tenant_id)
            ->with('course')
            ->paginate(5);

        $courses = Course::query()
            ->where('tenant_id', $tenant_id)
            ->where('status', 'active')
            ->get();

        return Inertia::render('exam/index', [
            'exams' => $exams,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created exam.
     */
    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'exam_date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
        ]);

        $validated['tenant_id'] = $tenant_id;

        Exam::create($validated);

        return to_route('exam.index')->with([
            'type' => 'success',
            'message' => 'Exam created successfully',
        ]);
    }

    /**
     * Update the specified exam.
     */
    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'exam_date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
        ]);

        Exam::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->update($validated);

        return to_route('exam.index')->with([
            'type' => 'success',
            'message' => 'Exam updated successfully',
        ]);
    }

    /**
     * Remove the specified exam.
     */
    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        Exam::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('exam.index')->with([
            'type' => 'success',
            'message' => 'Exam deleted successfully',
        ]);
    }

    /**
     * Show the bulk marks-entry screen.
     */
    public function editMarks(Exam $exam)
    {
        $tenant_id = Auth::user()->tenant_id;

        // Ensure the exam belongs to the active tenant
        if ($exam->tenant_id !== $tenant_id) {
            abort(403);
        }

        // Fetch all students enrolled in the exam's course
        $enrolledStudents = Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->where('course_id', $exam->course_id)
            ->where('status', 'active')
            ->with('student')
            ->get()
            ->map(fn($enrollment) => $enrollment->student)
            ->filter();

        // Load existing grades for this exam
        $existingGrades = Grade::query()
            ->where('tenant_id', $tenant_id)
            ->where('exam_id', $exam->id)
            ->get()
            ->keyBy('student_id');

        // Merge existing marks into the students data structure
        $students = $enrolledStudents->map(function ($student) use ($existingGrades) {
            $grade = $existingGrades->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->name,
                'roll_number' => $student->roll_number,
                'class' => $student->class,
                'marks_obtained' => $grade ? $grade->marks_obtained : '',
                'remarks' => $grade ? $grade->remarks : '',
            ];
        })->values();

        return Inertia::render('exam/marks', [
            'exam' => $exam,
            'students' => $students,
        ]);
    }

    /**
     * Store bulk marks.
     */
    public function storeMarks(Request $request, Exam $exam)
    {
        $tenant_id = Auth::user()->tenant_id;

        if ($exam->tenant_id !== $tenant_id) {
            abort(403);
        }

        \Illuminate\Support\Facades\Log::info('storeMarks called', $request->all());

        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => [
                'required',
                Rule::exists('students', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'marks.*.marks_obtained' => 'nullable|integer|min:0|max:' . $exam->max_marks,
            'marks.*.remarks' => 'nullable|string|max:255',
        ]);

        foreach ($validated['marks'] as $markData) {
            \Illuminate\Support\Facades\Log::info('saving grade', $markData);
            Grade::updateOrCreate(
                [
                    'tenant_id' => $tenant_id,
                    'exam_id' => $exam->id,
                    'student_id' => $markData['student_id'],
                ],
                [
                    'marks_obtained' => (isset($markData['marks_obtained']) && $markData['marks_obtained'] !== '') ? $markData['marks_obtained'] : null,
                    'remarks' => $markData['remarks'] ?? null,
                ]
            );
        }

        return to_route('exam.index')->with([
            'type' => 'success',
            'message' => 'Exam marks saved successfully',
        ]);
    }
}
