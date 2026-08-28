<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\GradingScale;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportCardController extends Controller
{
    /**
     * Display a listing of students to select for report cards.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;
        $students = Student::query()
            ->where('tenant_id', $tenant_id)
            ->paginate(5);

        // Map through the items to calculate GPA and grade dynamically
        $students->getCollection()->transform(function ($student) use ($tenant_id) {
            $enrollments = Enrollment::query()
                ->where('tenant_id', $tenant_id)
                ->where('student_id', $student->id)
                ->get();

            $grades = Grade::query()
                ->where('tenant_id', $tenant_id)
                ->where('student_id', $student->id)
                ->with(['exam'])
                ->get();

            $totalGpaPoints = 0;
            $totalExamsWithGrades = 0;

            foreach ($enrollments as $enrollment) {
                $courseGrades = $grades->filter(function ($grade) use ($enrollment) {
                    return $grade->exam && $grade->exam->course_id === $enrollment->course_id;
                });

                foreach ($courseGrades as $grade) {
                    $exam = $grade->exam;
                    if (!$exam) continue;

                    $percentage = $exam->max_marks > 0 
                        ? round(($grade->marks_obtained / $exam->max_marks) * 100) 
                        : 0;

                    $scale = GradingScale::getGradeForPercentage($tenant_id, $percentage);

                    $totalGpaPoints += $scale->gpa_point;
                    $totalExamsWithGrades++;
                }
            }

            $overallGpa = $totalExamsWithGrades > 0 
                ? round($totalGpaPoints / $totalExamsWithGrades, 2) 
                : 0.00;

            $overallPercentage = $overallGpa * 20;
            $overallScale = GradingScale::getGradeForPercentage($tenant_id, $overallPercentage);

            $student->gpa = $totalExamsWithGrades > 0 ? number_format($overallGpa, 2) : 'N/A';
            $student->grade = $totalExamsWithGrades > 0 ? $overallScale->grade : 'N/A';

            return $student;
        });

        return Inertia::render('report-card/index', [
            'students' => $students,
        ]);
    }

    /**
     * Download the report card as a PDF.
     */
    public function download(string $student_id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $student = Student::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $student_id)
            ->firstOrFail();

        $tenant = Tenant::findOrFail($tenant_id);

        // Fetch all course enrollments for the student
        $enrollments = Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->where('student_id', $student_id)
            ->with('course')
            ->get();

        // Fetch all grades for this student across all courses
        $grades = Grade::query()
            ->where('tenant_id', $tenant_id)
            ->where('student_id', $student_id)
            ->with(['exam'])
            ->get();

        // Calculate and structure report data per course
        $reportData = [];
        $totalGpaPoints = 0;
        $totalExamsWithGrades = 0;

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (!$course) continue;

            // Get grades related to this course's exams
            $courseGrades = $grades->filter(function ($grade) use ($course) {
                return $grade->exam && $grade->exam->course_id === $course->id;
            });

            $examsData = [];
            foreach ($courseGrades as $grade) {
                $exam = $grade->exam;
                if (!$exam) continue;

                $percentage = $exam->max_marks > 0 
                    ? round(($grade->marks_obtained / $exam->max_marks) * 100) 
                    : 0;

                $scale = GradingScale::getGradeForPercentage($tenant_id, $percentage);

                $examsData[] = [
                    'exam_name' => $exam->name,
                    'max_marks' => $exam->max_marks,
                    'marks_obtained' => $grade->marks_obtained,
                    'percentage' => $percentage,
                    'letter_grade' => $scale->grade,
                    'gpa_point' => $scale->gpa_point,
                    'remarks' => $grade->remarks,
                ];

                $totalGpaPoints += $scale->gpa_point;
                $totalExamsWithGrades++;
            }

            $reportData[] = [
                'course_name' => $course->course_name,
                'exams' => $examsData,
            ];
        }

        $overallGpa = $totalExamsWithGrades > 0 
            ? round($totalGpaPoints / $totalExamsWithGrades, 2) 
            : 0.00;

        // Overall letter grade mapped: e.g. GPA point mapped to percentage: (overallGpa / 5.00) * 100
        $overallPercentage = $overallGpa * 20;
        $overallScale = GradingScale::getGradeForPercentage($tenant_id, $overallPercentage);

        $data = [
            'student' => $student,
            'tenant' => $tenant,
            'reportData' => $reportData,
            'overallGpa' => $overallGpa,
            'overallGrade' => $overallScale->grade,
            'dateGenerated' => now()->format('Y-m-d'),
        ];

        $pdf = Pdf::loadView('pdf.report_card', $data);

        return $pdf->download("report_card_{$student->name}.pdf");
    }
}
