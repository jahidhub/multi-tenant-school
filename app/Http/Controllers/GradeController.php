<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    /**
     * Display a listing of all student grades under this tenant.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        $grades = Grade::query()
            ->where('tenant_id', $tenant_id)
            ->with(['student', 'exam.course'])
            ->paginate(5);

        return \Inertia\Inertia::render('grade/index', [
            'grades' => $grades,
        ]);
    }

    /**
     * Update a specific student's marks/remarks.
     */
    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $grade = Grade::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        $exam = $grade->exam;
        $maxMarks = $exam ? $exam->max_marks : 100;

        $validated = $request->validate([
            'marks_obtained' => 'nullable|integer|min:0|max:' . $maxMarks,
            'remarks' => 'nullable|string|max:255',
        ]);

        $grade->update([
            'marks_obtained' => $validated['marks_obtained'] === '' ? null : $validated['marks_obtained'],
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return to_route('grade.index')->with([
            'type' => 'success',
            'message' => 'Grade updated successfully',
        ]);
    }

    /**
     * Delete a grade record.
     */
    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        Grade::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('grade.index')->with([
            'type' => 'success',
            'message' => 'Grade deleted successfully',
        ]);
    }
}
