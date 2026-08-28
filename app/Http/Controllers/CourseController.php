<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;
        $courses = Course::query()
            ->where('tenant_id', $tenant_id)
            ->with('teacher')
            ->paginate(5);
            
        $teachers = Teacher::query()
            ->where('tenant_id', $tenant_id)
            ->get();

        return Inertia::render(
            'course/index',
            [
                'courses' => $courses,
                'teachers' => $teachers,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        
        $validated = $request->validate([
            "course_name" => "required|string|max:100",
            "teacher_id" => [
                "nullable",
                Rule::exists('teachers', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                })
            ],
        ]);

        $validated['tenant_id'] = $tenant_id;

        Course::create($validated);

        return to_route('course.index')->with([
            'type' => 'success',
            'message' => 'Course created successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;
        
        $validated = $request->validate([
            "course_name" => "required|string|max:100",
            "teacher_id" => [
                "nullable",
                Rule::exists('teachers', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                })
            ],
        ]);

        Course::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->update($validated);

        return to_route('course.index')->with([
            'type' => 'success',
            'message' => 'Course updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        Course::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('course.index')->with([
            'type' => 'success',
            'message' => 'Course deleted successfully',
        ]);
    }
}
