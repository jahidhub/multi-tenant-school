<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Teacher;
use App\Models\TimetableSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TimetableController extends Controller
{
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;
        $userRole = Auth::user()->role;
        
        $query = TimetableSlot::query()
            ->where('tenant_id', $tenant_id)
            ->with(['course', 'teacher']);
            
        // If it's a teacher, only show their timetable
        if ($userRole === 'teacher') {
            $teacher = Teacher::where('user_id', Auth::id())->first();
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            }
        }

        $slots = $query->get();
        $courses = Course::where('tenant_id', $tenant_id)->get();
        $teachers = Teacher::where('tenant_id', $tenant_id)->get();

        return Inertia::render('timetable/index', [
            'slots' => $slots,
            'courses' => $courses,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'teacher_id' => [
                'required',
                Rule::exists('teachers', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
        ]);

        // Conflict validation
        $conflict = TimetableSlot::query()
            ->where('tenant_id', $tenant_id)
            ->where('day_of_week', $validated['day_of_week'])
            ->where(function ($q) use ($validated) {
                $q->where(function ($q2) use ($validated) {
                    // Check for overlapping time
                    $q2->where('start_time', '<', $validated['end_time'])
                       ->where('end_time', '>', $validated['start_time']);
                });
            })
            ->where(function ($q) use ($validated) {
                $q->where('teacher_id', $validated['teacher_id']);
                if (!empty($validated['room'])) {
                    $q->orWhere('room', $validated['room']);
                }
            })
            ->first();

        if ($conflict) {
            return back()->with([
                'type' => 'error',
                'message' => 'Conflict detected: The teacher or room is already booked at this time.',
            ]);
        }

        $validated['tenant_id'] = $tenant_id;
        TimetableSlot::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Timetable slot created successfully',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $slot = TimetableSlot::where('tenant_id', $tenant_id)->findOrFail($id);

        $validated = $request->validate([
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'teacher_id' => [
                'required',
                Rule::exists('teachers', 'id')->where(function ($query) use ($tenant_id) {
                    $query->where('tenant_id', $tenant_id);
                }),
            ],
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
        ]);

        // Conflict validation (excluding current slot)
        $conflict = TimetableSlot::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', '!=', $slot->id)
            ->where('day_of_week', $validated['day_of_week'])
            ->where(function ($q) use ($validated) {
                $q->where(function ($q2) use ($validated) {
                    $q2->where('start_time', '<', $validated['end_time'])
                       ->where('end_time', '>', $validated['start_time']);
                });
            })
            ->where(function ($q) use ($validated) {
                $q->where('teacher_id', $validated['teacher_id']);
                if (!empty($validated['room'])) {
                    $q->orWhere('room', $validated['room']);
                }
            })
            ->first();

        if ($conflict) {
            return back()->with([
                'type' => 'error',
                'message' => 'Conflict detected: The teacher or room is already booked at this time.',
            ]);
        }

        $slot->update($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Timetable slot updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;
        TimetableSlot::where('tenant_id', $tenant_id)->where('id', $id)->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Timetable slot deleted successfully',
        ]);
    }
}
