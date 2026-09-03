<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        $course_id = $request->input('course_id');
        $date = $request->input('date', Carbon::today()->toDateString());

        $courses = Course::query()->where('tenant_id', $tenant_id)->where('status', 'active')->get();
        $students = [];
        $existingRecords = [];

        if ($course_id) {
            // Get enrolled students for the course
            $enrolledStudents = Enrollment::query()
                ->where('tenant_id', $tenant_id)
                ->where('course_id', $course_id)
                ->where('status', 'active')
                ->with('student')
                ->get()
                ->map(fn($enrollment) => $enrollment->student)
                ->filter();

            // Get existing attendance for this date
            $existingRecords = AttendanceRecord::query()
                ->where('tenant_id', $tenant_id)
                ->where('course_id', $course_id)
                ->where('date', $date)
                ->get()
                ->keyBy('student_id');

            // Merge data
            $students = $enrolledStudents->map(function ($student) use ($existingRecords) {
                $record = $existingRecords->get($student->id);
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'roll_number' => $student->roll_number,
                    'class' => $student->class,
                    // Default to 'present' if not marked yet to save time
                    'status' => $record ? $record->status : 'present', 
                ];
            })->values();
        }

        return Inertia::render('attendance/index', [
            'courses' => $courses,
            'students' => $students,
            'filters' => [
                'course_id' => $course_id,
                'date' => $date,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        $user_id = Auth::id();

        $validated = $request->validate([
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => [
                'required',
                Rule::exists('students', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'attendance.*.status' => 'required|in:present,absent,late,excused',
        ]);

        $course_id = $validated['course_id'];
        $date = $validated['date'];

        $upsertData = [];
        $now = now();

        foreach ($validated['attendance'] as $record) {
            $upsertData[] = [
                'tenant_id' => $tenant_id,
                'student_id' => $record['student_id'],
                'course_id' => $course_id,
                'date' => $date,
                'status' => $record['status'],
                'marked_by' => $user_id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($upsertData)) {
            AttendanceRecord::upsert(
                $upsertData,
                ['tenant_id', 'student_id', 'course_id', 'date'],
                ['status', 'marked_by', 'updated_at']
            );
        }

        return back()->with([
            'type' => 'success',
            'message' => 'Attendance saved successfully.',
        ]);
    }

    public function report(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        $course_id = $request->input('course_id');
        $start_date = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $end_date = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $courses = Course::query()->where('tenant_id', $tenant_id)->where('status', 'active')->get();
        $reportData = [];

        if ($course_id) {
            // Get enrolled students
            $enrolledStudents = Enrollment::query()
                ->where('tenant_id', $tenant_id)
                ->where('course_id', $course_id)
                ->where('status', 'active')
                ->with('student')
                ->get()
                ->map(fn($enrollment) => $enrollment->student)
                ->filter();

            // Get attendance records in range
            $records = AttendanceRecord::query()
                ->where('tenant_id', $tenant_id)
                ->where('course_id', $course_id)
                ->whereBetween('date', [$start_date, $end_date])
                ->get()
                ->groupBy('student_id');

            foreach ($enrolledStudents as $student) {
                $studentRecords = $records->get($student->id, collect());
                $totalDays = $studentRecords->count();
                
                $present = $studentRecords->where('status', 'present')->count();
                $late = $studentRecords->where('status', 'late')->count();
                $absent = $studentRecords->where('status', 'absent')->count();
                $excused = $studentRecords->where('status', 'excused')->count();

                // Compute percentage (Present and Late are often considered attended, but late might be partial. Here, Present + Late + Excused = attended for basic metric, or just Present)
                // Let's use (Present + Late) / Total
                $percentage = $totalDays > 0 ? round((($present + $late) / $totalDays) * 100, 2) : 0;

                $reportData[] = [
                    'student' => $student,
                    'total_days' => $totalDays,
                    'present' => $present,
                    'late' => $late,
                    'absent' => $absent,
                    'excused' => $excused,
                    'percentage' => $percentage,
                ];
            }
        }

        return Inertia::render('attendance/report', [
            'courses' => $courses,
            'reportData' => $reportData,
            'filters' => [
                'course_id' => $course_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
            ]
        ]);
    }
}
