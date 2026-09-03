<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        
        $query = Course::query()
            ->withTrashed()
            ->where('tenant_id', $tenant_id)
            ->withCount('enrollments')
            ->with('teacher'); // Teacher relationship defined in Model

        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('academic_year') && $request->academic_year != '') {
            $query->where('academic_year', $request->academic_year);
        }
        
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $courses = $query->latest()->paginate(10)->withQueryString();
        
        $teachers = Teacher::query()->where('tenant_id', $tenant_id)->get(['id', 'name']);
        
        $academicYears = Course::query()->where('tenant_id', $tenant_id)->distinct()->pluck('academic_year');

        // Only active students
        $students = \App\Models\Student::query()->where('tenant_id', $tenant_id)->where('status', 'active')->get(['id', 'name', 'admission_no', 'class']);

        return Inertia::render('course/index', [
            'courses' => $courses,
            'teachers' => $teachers,
            'academicYears' => $academicYears,
            'students' => $students,
            'filters' => $request->only(['search', 'academic_year', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            "name" => "required|string|max:100",
            "code" => [
                "required",
                "string",
                "max:50",
                Rule::unique('courses')->where(function ($query) use ($tenant_id, $request) {
                    return $query->where('tenant_id', $tenant_id)
                                 ->where('academic_year', $request->academic_year);
                })
            ],
            "credit_hours" => "required|integer|min:0",
            "academic_year" => "required|string|max:50",
            "capacity" => "required|integer|min:1",
            "status" => "required|string|in:active,archived",
            "teacher_id" => "nullable|exists:teachers,id",
        ]);

        $validated['tenant_id'] = $tenant_id;
        
        Course::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Course created successfully',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;
        $course = Course::query()->where('tenant_id', $tenant_id)->findOrFail($id);

        $validated = $request->validate([
            "name" => "required|string|max:100",
            "code" => [
                "required",
                "string",
                "max:50",
                Rule::unique('courses')->where(function ($query) use ($tenant_id, $request) {
                    return $query->where('tenant_id', $tenant_id)
                                 ->where('academic_year', $request->academic_year);
                })->ignore($id)
            ],
            "credit_hours" => "required|integer|min:0",
            "academic_year" => "required|string|max:50",
            "capacity" => "required|integer|min:1",
            "status" => "required|string|in:active,archived",
            "teacher_id" => "nullable|exists:teachers,id",
        ]);

        $course->fill($validated)->save();

        return back()->with([
            'type' => 'success',
            'message' => 'Course updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        Course::query()->where('tenant_id', Auth::user()->tenant_id)->where('id', $id)->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Course archived successfully',
        ]);
    }

    public function restore(string $id)
    {
        Course::withTrashed()->where('tenant_id', Auth::user()->tenant_id)->where('id', $id)->restore();

        return back()->with([
            'type' => 'success',
            'message' => 'Course restored successfully',
        ]);
    }

    public function forceDestroy(string $id)
    {
        Course::withTrashed()->where('tenant_id', Auth::user()->tenant_id)->where('id', $id)->forceDelete();

        return back()->with([
            'type' => 'success',
            'message' => 'Course permanently deleted',
        ]);
    }

    public function duplicate(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;
        $course = Course::query()->where('tenant_id', $tenant_id)->findOrFail($id);

        $request->validate([
            'academic_year' => [
                'required',
                'string',
                'max:50',
                Rule::unique('courses')->where(function ($query) use ($tenant_id, $course) {
                    return $query->where('tenant_id', $tenant_id)
                                 ->where('code', $course->code);
                })
            ],
        ], [
            'academic_year.unique' => "The course '{$course->code}' already exists in this academic year."
        ]);

        $newCourse = $course->replicate();
        $newCourse->academic_year = $request->academic_year;
        $newCourse->save();

        return back()->with([
            'type' => 'success',
            'message' => 'Course duplicated successfully to new term.',
        ]);
    }
}
