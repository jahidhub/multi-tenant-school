<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::GET('/teachers', [TeacherController::class, 'index'])->name('teacher.index');
    Route::GET('/teacher/create', [TeacherController::class, 'create'])->name('teacher.create');
    Route::POST('/teacher/store', [TeacherController::class, 'store'])->name('teacher.store');
    Route::GET('/edit/teacher/{id}', [TeacherController::class, 'edit'])->name('teacher.edit');
    Route::PUT('/teacher/{id}', [TeacherController::class, 'update'])->name('teacher.update');
    Route::delete('/teacher/{id}', [TeacherController::class, 'destroy'])->name('teacher.delete');



    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::post('/student/store', [StudentController::class, 'store'])->name('student.store');
    Route::put('/student/{id}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.destroy');

    Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
    Route::post('/course/store', [CourseController::class, 'store'])->name('course.store');
    Route::put('/course/{id}', [CourseController::class, 'update'])->name('course.update');
    Route::delete('/course/{id}', [CourseController::class, 'destroy'])->name('course.destroy');

    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/enrollment/store', [EnrollmentController::class, 'store'])->name('enrollment.store');
    Route::put('/enrollment/{id}', [EnrollmentController::class, 'update'])->name('enrollment.update');
    Route::delete('/enrollment/{id}', [EnrollmentController::class, 'destroy'])->name('enrollment.destroy');
});

require __DIR__ . '/settings.php';
