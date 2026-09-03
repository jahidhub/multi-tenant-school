<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::first();
Auth::login($user);

$exam = App\Models\Exam::first();
$student = App\Models\Student::first();

$request = Illuminate\Http\Request::create('/exams/' . $exam->id . '/marks', 'POST', [
    'marks' => [
        [
            'student_id' => $student->id,
            'marks_obtained' => 50,
            'remarks' => 'Good'
        ]
    ]
]);

$controller = new App\Http\Controllers\ExamController();
try {
    $response = $controller->storeMarks($request, $exam);
    echo "Success!\n";
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation failed: \n";
    print_r($e->errors());
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
echo "Count: " . App\Models\Grade::count() . "\n";
