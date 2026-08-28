<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;
        $students = Student::query()->where('tenant_id', $tenant_id)->paginate(5);
        return Inertia::render(
            'student/index',
            [
                'students' => $students
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
            "roll_number" => "nullable|string|max:20",
            "date_of_birth" => "nullable|date",
            "gender" => "nullable|string|max:10",
            "father_name" => "nullable|string|max:50",
            "guardian_phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:100",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        Student::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Student added successfully',
        ]);
    }

    public function show(string $id)
    {
        //
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
            "roll_number" => "nullable|string|max:20",
            "date_of_birth" => "nullable|date",
            "gender" => "nullable|string|max:10",
            "father_name" => "nullable|string|max:50",
            "guardian_phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:100",
        ]);

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
            'message' => 'Student deleted successfully',
        ]);
    }
}
