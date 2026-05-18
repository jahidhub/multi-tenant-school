<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/teachers', [TeacherController::class, 'index'])->name('teacher.index');
    Route::get('teacher/create', [TeacherController::class, 'create'])->name('teacher/create');
});

require __DIR__ . '/settings.php';
