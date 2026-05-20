<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::GET('/teachers', [TeacherController::class, 'index'])->name('teacher.index');
    Route::GET('teacher/create', [TeacherController::class, 'create'])->name('teacher.create');
    Route::post('teacher/store', [TeacherController::class, 'store'])->name('teacher.store');
    Route::GET('teacher/{id}/edit', [TeacherController::class, 'edit'])->name('teacher.edit');
    Route::POST('teacher/{id}', [TeacherController::class, 'update'])->name('teacher.update');
});

require __DIR__ . '/settings.php';
