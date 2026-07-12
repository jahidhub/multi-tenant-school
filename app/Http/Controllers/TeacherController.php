<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::query()->where('tenant_id', Auth::user()->tenant_id)->paginate(5);
        return Inertia::render('teacher/index', [
            'teachers' => $teachers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia::render('teacher/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "phone" => "required|regex:/^\+?[0-9\s\(\)\-]+$/",
            "subject" => "required|string|max:50",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        Teacher::query()->create([
            'tenant_id' => $validated['tenant_id'],
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'subject' => $validated['subject'],
        ]);
        return to_route('teacher.index')->with([
            'type' => 'success',
            'message' => 'Teacher added successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        $teacher = Teacher::query()->where('tenant_id',  Auth::user()->tenant_id)->where('id', $id)->firstOrFail();

        return Inertia::render('teacher/edit', [
            'teacher' => $teacher->toArray(),
            'id' => $id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "phone" => "required|regex:/^\+?[0-9\s\(\)\-]+$/",
            "subject" => "required|string|max:50",
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

    /**
     * Remove the specified resource from storage.
     */
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
