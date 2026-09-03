<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        
        $query = Student::query()->withTrashed()->where('tenant_id', $tenant_id);

        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('admission_no', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('class') && $request->class != '') {
            $query->where('class', $request->class);
        }

        $students = $query->latest()->paginate(10)->withQueryString();
        
        return Inertia::render(
            'student/index',
            [
                'students' => $students,
                'filters' => $request->only(['search', 'class'])
            ]
        );
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "class" => "required|string|max:20",
            "dob" => "nullable|date",
            "gender" => "nullable|string|max:10",
            "guardian_name" => "nullable|string|max:50",
            "guardian_phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:100",
            "status" => "nullable|string|max:20",
            "profile_photo" => "nullable|image|max:2048",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        
        // Auto-generate admission_no
        $year = date('Y');
        $count = Student::where('tenant_id', $validated['tenant_id'])->withTrashed()->count() + 1;
        $validated['admission_no'] = sprintf('GH-%s-%04d', $year, $count);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo_path'] = $request->file('profile_photo')->store('students/photos', 'public');
        }
        
        unset($validated['profile_photo']);

        Student::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Student added successfully',
        ]);
    }

    public function show(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $student = Student::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        $enrollments = \App\Models\Enrollment::query()
            ->where('tenant_id', $tenant_id)
            ->where('student_id', $id)
            ->with('course')
            ->get();

        $grades = \App\Models\Grade::query()
            ->where('tenant_id', $tenant_id)
            ->where('student_id', $id)
            ->with(['exam.course'])
            ->get();

        $invoices = Invoice::query()
            ->where('tenant_id', $tenant_id)
            ->where('student_id', $id)
            ->with(['feeStructure'])
            ->get();

        $payments = Payment::query()
            ->where('tenant_id', $tenant_id)
            ->whereHas('invoice', function ($q) use ($id) {
                $q->where('student_id', $id);
            })
            ->with(['invoice.feeStructure'])
            ->latest()
            ->get();

        return Inertia::render('student/show', [
            'student' => $student,
            'enrollments' => $enrollments,
            'grades' => $grades,
            'invoices' => $invoices,
            'payments' => $payments,
        ]);
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "class" => "required|string|max:20",
            "dob" => "nullable|date",
            "gender" => "nullable|string|max:10",
            "guardian_name" => "nullable|string|max:50",
            "guardian_phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:100",
            "status" => "nullable|string|max:20",
            "profile_photo" => "nullable|image|max:2048",
        ]);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo_path'] = $request->file('profile_photo')->store('students/photos', 'public');
        }
        
        unset($validated['profile_photo']);

        Student::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->update($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Student updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        Student::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Student archived successfully',
        ]);
    }

    public function restore(string $id)
    {
        Student::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->restore();

        return back()->with([
            'type' => 'success',
            'message' => 'Student restored successfully',
        ]);
    }

    public function forceDestroy(string $id)
    {
        Student::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->forceDelete();

        return back()->with([
            'type' => 'success',
            'message' => 'Student permanently deleted',
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'integer',
        ]);

        $deleted = Student::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->whereIn('id', $request->student_ids)
            ->delete();

        return back()->with([
            'type' => 'success',
            'message' => "Successfully archived $deleted students",
        ]);
    }

    public function bulkForceDestroy(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'integer',
        ]);

        $deleted = Student::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->whereIn('id', $request->student_ids)
            ->forceDelete();

        return back()->with([
            'type' => 'success',
            'message' => "Successfully permanently deleted $deleted students",
        ]);
    }

    public function bulkRestore(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'integer',
        ]);

        $restored = Student::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->whereIn('id', $request->student_ids)
            ->restore();

        return back()->with([
            'type' => 'success',
            'message' => "Successfully restored $restored students",
        ]);
    }

    public function bulkExport(Request $request)
    {
        $ids = explode(',', $request->query('ids', ''));
        $ids = array_filter(array_map('intval', $ids));

        if (empty($ids)) {
            return back()->with(['type' => 'error', 'message' => 'No valid students selected for export']);
        }

        $students = Student::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->whereIn('id', $ids)
            ->get();

        $filename = "students_export_" . date('Y-m-d_His') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Admission No', 'Name', 'Class', 'DOB', 'Gender', 'Guardian Name', 'Guardian Phone', 'Status', 'Archived'];

        $callback = function () use ($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($students as $student) {
                fputcsv($file, [
                    $student->id,
                    $student->admission_no,
                    $student->name,
                    $student->class,
                    $student->dob,
                    $student->gender,
                    $student->guardian_name,
                    $student->guardian_phone,
                    $student->status,
                    $student->trashed() ? 'Yes' : 'No'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), "r");
        $header = fgetcsv($handle, 1000, ","); // Assumes first row is header

        $tenant_id = Auth::user()->tenant_id;
        $year = date('Y');
        $count = Student::where('tenant_id', $tenant_id)->withTrashed()->count();

        $imported = 0;
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if (count($header) == count($data)) {
                $row = array_combine($header, $data);
                
                $count++;
                $admission_no = sprintf('GH-%s-%04d', $year, $count);

                Student::create([
                    'tenant_id' => $tenant_id,
                    'admission_no' => $admission_no,
                    'name' => $row['name'] ?? 'Unknown',
                    'class' => $row['class'] ?? 'N/A',
                    'dob' => !empty($row['dob']) ? date('Y-m-d', strtotime($row['dob'])) : null,
                    'gender' => $row['gender'] ?? null,
                    'guardian_name' => $row['guardian_name'] ?? null,
                    'guardian_phone' => $row['guardian_phone'] ?? null,
                    'status' => 'active'
                ]);
                $imported++;
            }
        }
        fclose($handle);

        return back()->with([
            'type' => 'success',
            'message' => "$imported students imported successfully",
        ]);
    }

    public function promote(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'integer',
            'to_class' => 'required|string',
        ]);

        $updated = Student::where('tenant_id', Auth::user()->tenant_id)
            ->whereIn('id', $request->student_ids)
            ->update(['class' => $request->to_class]);

        return back()->with([
            'type' => 'success',
            'message' => "Successfully promoted $updated students to " . $request->to_class,
        ]);
    }
}
