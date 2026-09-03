<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradingScaleController;
use App\Http\Controllers\ReportCardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Auth;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Super-Admin routes
    Route::middleware([\App\Http\Middleware\SuperAdmin::class])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'index'])->name('tenants.index');
        Route::get('/tenants/create', [\App\Http\Controllers\Admin\TenantController::class, 'create'])->name('tenants.create');
        Route::post('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'store'])->name('tenants.store');
        Route::get('/tenants/{tenant}/edit', [\App\Http\Controllers\Admin\TenantController::class, 'edit'])->name('tenants.edit');
        Route::put('/tenants/{tenant}', [\App\Http\Controllers\Admin\TenantController::class, 'update'])->name('tenants.update');
        Route::post('/tenants/{tenant}/impersonate', [\App\Http\Controllers\Admin\TenantController::class, 'impersonate'])->name('tenants.impersonate');
    });

    Route::post('/impersonation/leave', [\App\Http\Controllers\Admin\TenantController::class, 'leaveImpersonation'])->name('impersonation.leave');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (Auth::user()->role === 'super-admin') {
            return redirect()->route('admin.dashboard');
        }
        
        $tenant_id = Auth::user()->tenant_id;
        
        $totalStudents = \App\Models\Student::query()->where('tenant_id', '=', $tenant_id)->count('*');
        $totalTeachers = \App\Models\Teacher::query()->where('tenant_id', '=', $tenant_id)->count('*');
        $totalCourses = \App\Models\Course::query()->where('tenant_id', '=', $tenant_id)->count('*');

        // Query overdue invoices
        $overdueInvoices = \App\Models\Invoice::query()
            ->where('tenant_id', $tenant_id)
            ->where('status', 'overdue')
            ->with('student')
            ->get();

        $totalOverdueAmount = $overdueInvoices->sum(fn($invoice) => (float)$invoice->amount_due - (float)$invoice->amount_paid);

        return \Inertia\Inertia::render('dashboard', [
            'stats' => [
                'students' => $totalStudents,
                'teachers' => $totalTeachers,
                'courses' => $totalCourses,
                'overdueAmount' => number_format($totalOverdueAmount, 2),
            ],
            'overdueInvoices' => $overdueInvoices,
        ]);
    })->name('dashboard');

    Route::GET('/teachers', [TeacherController::class, 'index'])->name('teacher.index');
    Route::GET('/teacher/create', [TeacherController::class, 'create'])->name('teacher.create');
    Route::POST('/teacher/store', [TeacherController::class, 'store'])->name('teacher.store');
    Route::GET('/edit/teacher/{id}', [TeacherController::class, 'edit'])->name('teacher.edit');
    Route::PUT('/teacher/{id}', [TeacherController::class, 'update'])->name('teacher.update');
    Route::delete('/teacher/{id}', [TeacherController::class, 'destroy'])->name('teacher.delete');
    Route::post('/teacher/{id}/restore', [TeacherController::class, 'restore'])->name('teacher.restore');
    Route::delete('/teacher/{id}/force', [TeacherController::class, 'forceDestroy'])->name('teacher.force-delete');

    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::post('/student/store', [StudentController::class, 'store'])->name('student.store');
    Route::get('/student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::get('/edit/student/{id}', [StudentController::class, 'edit'])->name('student.edit');
    Route::PUT('/student/{id}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.delete');
    Route::post('/student/{id}/restore', [StudentController::class, 'restore'])->name('student.restore');
    Route::delete('/student/{id}/force', [StudentController::class, 'forceDestroy'])->name('student.force-delete');
    Route::delete('/students/bulk', [StudentController::class, 'bulkDestroy'])->name('student.bulk-delete');
    Route::delete('/students/bulk/force', [StudentController::class, 'bulkForceDestroy'])->name('student.bulk-force-delete');
    Route::post('/students/bulk/restore', [StudentController::class, 'bulkRestore'])->name('student.bulk-restore');
    Route::get('/students/bulk/export', [StudentController::class, 'bulkExport'])->name('student.bulk-export');
    Route::post('/students/import', [StudentController::class, 'import'])->name('student.import');
    Route::post('/students/promote', [StudentController::class, 'promote'])->name('student.promote');

    Route::get('/courses', [App\Http\Controllers\CourseController::class, 'index'])->name('course.index');
    Route::post('/courses', [App\Http\Controllers\CourseController::class, 'store'])->name('course.store');
    Route::put('/course/{id}', [App\Http\Controllers\CourseController::class, 'update'])->name('course.update');
    Route::delete('/course/{id}', [App\Http\Controllers\CourseController::class, 'destroy'])->name('course.destroy');
    Route::post('/course/{id}/restore', [App\Http\Controllers\CourseController::class, 'restore'])->name('course.restore');
    Route::delete('/course/{id}/force', [App\Http\Controllers\CourseController::class, 'forceDestroy'])->name('course.force-delete');
    Route::post('/course/{id}/duplicate', [App\Http\Controllers\CourseController::class, 'duplicate'])->name('course.duplicate');

    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/enrollment/store', [EnrollmentController::class, 'store'])->name('enrollment.store');
    Route::put('/enrollment/{id}', [EnrollmentController::class, 'update'])->name('enrollment.update');
    Route::delete('/enrollment/{id}', [EnrollmentController::class, 'destroy'])->name('enrollment.destroy');
    Route::post('/enrollment/{id}/withdraw', [EnrollmentController::class, 'withdraw'])->name('enrollment.withdraw');

    Route::get('/exams', [ExamController::class, 'index'])->name('exam.index');
    Route::post('/exam/store', [ExamController::class, 'store'])->name('exam.store');
    Route::put('/exam/{id}', [ExamController::class, 'update'])->name('exam.update');
    Route::delete('/exam/{id}', [ExamController::class, 'destroy'])->name('exam.destroy');
    Route::get('/exams/{exam}/marks', [ExamController::class, 'editMarks'])->name('exam.marks.edit');
    Route::post('/exams/{exam}/marks', [ExamController::class, 'storeMarks'])->name('exam.marks.store');

    Route::get('/grades', [GradeController::class, 'index'])->name('grade.index');
    Route::put('/grade/{id}', [GradeController::class, 'update'])->name('grade.update');
    Route::delete('/grade/{id}', [GradeController::class, 'destroy'])->name('grade.destroy');

    Route::get('/grading-scales', [GradingScaleController::class, 'index'])->name('grading_scale.index');
    Route::post('/grading-scale/store', [GradingScaleController::class, 'store'])->name('grading_scale.store');
    Route::put('/grading-scale/{id}', [GradingScaleController::class, 'update'])->name('grading_scale.update');
    Route::delete('/grading-scale/{id}', [GradingScaleController::class, 'destroy'])->name('grading_scale.destroy');

    Route::get('/report-cards', [ReportCardController::class, 'index'])->name('report_card.index');
    Route::get('/students/{student}/report-card', [ReportCardController::class, 'download'])->name('report_card.download');
    Route::delete('/students/{student}/report-card', [ReportCardController::class, 'destroy'])->name('report_card.destroy');

    Route::get('/fee-structures', [FeeStructureController::class, 'index'])->name('fee_structure.index');
    Route::post('/fee-structure/store', [FeeStructureController::class, 'store'])->name('fee_structure.store');
    Route::put('/fee-structure/{id}', [FeeStructureController::class, 'update'])->name('fee_structure.update');
    Route::delete('/fee-structure/{id}', [FeeStructureController::class, 'destroy'])->name('fee_structure.destroy');
    Route::post('/fee-structure/{id}/generate-invoices', [FeeStructureController::class, 'generateInvoices'])->name('fee_structure.generate_invoices');

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoice.index');
    Route::post('/invoice/store', [InvoiceController::class, 'store'])->name('invoice.store');
    Route::delete('/invoice/{id}', [InvoiceController::class, 'destroy'])->name('invoice.destroy');
    Route::post('/invoice/{id}/record-payment', [InvoiceController::class, 'recordPayment'])->name('invoice.record_payment');

    Route::get('/payments/{id}/receipt', [PaymentController::class, 'downloadReceipt'])->name('payment.receipt');

    Route::get('/timetable', [TimetableController::class, 'index'])->name('timetable.index');
    Route::post('/timetable', [TimetableController::class, 'store'])->name('timetable.store');
    Route::put('/timetable/{id}', [TimetableController::class, 'update'])->name('timetable.update');
    Route::delete('/timetable/{id}', [TimetableController::class, 'destroy'])->name('timetable.destroy');

    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
    Route::get('/attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
});

require __DIR__ . '/settings.php';
