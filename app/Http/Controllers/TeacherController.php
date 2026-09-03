<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $query = Teacher::query()->withTrashed()->where('tenant_id', $tenant_id)->with('courses');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('subject_specialty')) {
            $query->where('subject_specialty', $request->subject_specialty);
        }

        $teachers = $query->paginate(10);
        $courses = \App\Models\Course::query()->where('tenant_id', $tenant_id)->get();

        return Inertia::render('teacher/index', [
            'teachers' => $teachers,
            'courses' => $courses,
            'filters' => $request->only(['search', 'subject_specialty'])
        ]);
    }

    public function create()
    {
        // Not used, handled by modal
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "email" => "nullable|email|max:100",
            "phone" => "required|string|max:20",
            "subject_specialty" => "required|string|max:50",
            "address" => "required|string|max:100",
            "joining_date" => "nullable|date",
            "status" => "required|string|in:active,inactive",
            "courses" => "nullable|array",
            "courses.*" => "exists:courses,id",
            "profile_photo" => "nullable|image|max:2048",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('teachers/photos', 'public');
            $validated['profile_photo_path'] = $path;
        }

        $teacher = Teacher::create([
            'tenant_id' => $validated['tenant_id'],
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'subject_specialty' => $validated['subject_specialty'],
            'address' => $validated['address'],
            'joining_date' => $validated['joining_date'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'profile_photo_path' => $validated['profile_photo_path'] ?? null,
        ]);

        if (!empty($validated['courses'])) {
            $teacher->courses()->sync($validated['courses']);
        }

        return back()->with([
            'type' => 'success',
            'message' => 'Teacher added successfully',
        ]);
    }

    public function show(string $id) {}

    public function edit(string $id)
    {
        // Not used, handled by modal
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name" => "required|string|max:50",
            "email" => "nullable|email|max:100",
            "phone" => "required|string|max:20",
            "subject_specialty" => "required|string|max:50",
            "address" => "required|string|max:100",
            "joining_date" => "nullable|date",
            "status" => "required|string|in:active,inactive",
            "courses" => "nullable|array",
            "courses.*" => "exists:courses,id",
            "profile_photo" => "nullable|image|max:2048",
        ]);

        $teacher = Teacher::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('teachers/photos', 'public');
            $validated['profile_photo_path'] = $path;
        }

        $updateData = [
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'subject_specialty' => $validated['subject_specialty'],
            'address' => $validated['address'],
            'status' => $validated['status'],
        ];

        if (array_key_exists('email', $validated)) {
            $updateData['email'] = $validated['email'];
        }
        if (array_key_exists('joining_date', $validated)) {
            $updateData['joining_date'] = $validated['joining_date'];
        }
        if (isset($validated['profile_photo_path'])) {
            $updateData['profile_photo_path'] = $validated['profile_photo_path'];
        }

        $teacher->update($updateData);

        if (isset($validated['courses'])) {
            $teacher->courses()->sync($validated['courses']);
        }

        return back()->with([
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

        return back()->with([
            'type' => 'success',
            'message' => 'Teacher deleted successfully',
        ]);
    }

    public function restore(string $id)
    {
        Teacher::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->restore();

        return back()->with([
            'type' => 'success',
            'message' => 'Teacher restored successfully',
        ]);
    }

    public function forceDestroy(string $id)
    {
        Teacher::withTrashed()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('id', $id)
            ->forceDelete();

        return back()->with([
            'type' => 'success',
            'message' => 'Teacher permanently deleted',
        ]);
    }
}
