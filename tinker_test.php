<?php
$exam = App\Models\Exam::first();
if (!$exam) { echo "No exam"; exit; }
$student = App\Models\Student::first();
if (!$student) { echo "No student"; exit; }

$request = Illuminate\Http\Request::create('/exams/' . $exam->id . '/marks', 'POST', [
    'marks' => [
        [
            'student_id' => $student->id,
            'marks_obtained' => 50,
            'remarks' => 'Good'
        ]
    ]
]);

$user = App\Models\User::first();
$request->setUserResolver(function () use ($user) { return $user; });

$controller = new App\Http\Controllers\ExamController();
try {
    $response = $controller->storeMarks($request, $exam);
    echo "Success!\n";
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation failed:\n";
    print_r($e->errors());
} catch (\Exception $e) {
    echo "Exception:\n" . $e->getMessage();
}
echo "\nGrades count: " . App\Models\Grade::count();
