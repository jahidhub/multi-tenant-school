<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::query()->where('tenant_id', Auth::user()->tenant_id)->get();
        return Inertia::render('teacher/index', [
            'teachers' => $teachers
        ]);
    }

    public function create()
    {
        return inertia::render('teacher/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "phone" => "required|regex:/^\+?[0-9\s\(\)\-]+$/",
            "subject" => "required|string|max:50",
            "address" => "required|string|max:100",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        Teacher::query()->create([
            'tenant_id' => $validated['tenant_id'],
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'subject' => $validated['subject'],
            'address' => $validated['address'],
        ]);
        return to_route('teacher.index')->with([
            'type' => 'success',
            'message' => 'Teacher added successfully',
        ]);
    }

    public function show(string $id) {}

    public function edit(string $id)
    {
        $teacher = Teacher::query()->where('tenant_id',  Auth::user()->tenant_id)->where('id', $id)->firstOrFail();

        return Inertia::render('teacher/edit', [
            'teacher' => $teacher->toArray(),
            'id' => $id
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "phone" => "required|regex:/^\+?[0-9\s\(\)\-]+$/",
            "subject" => "required|string|max:50",
            "address" => "required|string|max:100",
        ]);

        Teacher::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->update($validated);

        return to_route('teacher.index')->with([
            'type' => 'success',
            'message' => 'Teacher updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        Teacher::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('teacher.index')->with([
            'type' => 'success',
            'message' => 'Teacher deleted successfully',
        ]);
    }
}
