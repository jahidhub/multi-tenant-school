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
        $students = Student::query()->where('tenant_id', Auth::user()->tenant_id)->get();
        return Inertia::render('student/index', [
            'students' => $students
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "email" => "required|email|max:50",
            "date_of_birth" => "required|date",
            "gender" => "required|string|max:10",
            "class" => "required|string|max:20",
            "section" => "required|string|max:10",
            "roll_number" => "required|string|max:20",
            "father_name" => "required|string|max:50",
            "mother_name" => "required|string|max:50",
            "phone_number" => "required|string|max:50",
            "address" => "required|string|max:100",
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
            "email" => "required|email|max:50",
            "date_of_birth" => "required|date",
            "gender" => "required|string|max:10",
            "class" => "required|string|max:20",
            "section" => "required|string|max:10",
            "roll_number" => "required|string|max:20",
            "father_name" => "required|string|max:50",
            "mother_name" => "required|string|max:50",
            "phone_number" => "required|string|max:50",
            "address" => "required|string|max:100",
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
