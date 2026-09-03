<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::first();
if (!$user) {
    echo "No user\n";
    exit;
}
Auth::login($user);

$exam = App\Models\Exam::first();
if (!$exam) {
    echo "No exam\n";
    exit;
}

$student = App\Models\Student::first();
if (!$student) {
    echo "No student\n";
    exit;
}

$request = Illuminate\Http\Request::create('/exams/' . $exam->id . '/marks', 'POST', [
    'marks' => [
        [
            'student_id' => $student->id,
            'marks_obtained' => 50,
            'remarks' => 'Good'
        ]
    ]
]);

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
if ($response->getStatusCode() === 302) {
    echo "Redirect: " . $response->headers->get('Location') . "\n";
    echo "Session Errors: " . json_encode(session()->get('errors')?->getBag('default')->getMessages()) . "\n";
}
