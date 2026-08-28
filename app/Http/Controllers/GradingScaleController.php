<?php

namespace App\Http\Controllers;

use App\Models\GradingScale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradingScaleController extends Controller
{
    /**
     * Display the grading scales list.
     */
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        // Auto-seed default grading scales if none exist for this tenant
        if (GradingScale::where('tenant_id', $tenant_id)->count() === 0) {
            $defaults = [
                ['grade' => 'A+', 'min_percentage' => 80, 'max_percentage' => 100, 'gpa_point' => 5.00],
                ['grade' => 'A', 'min_percentage' => 70, 'max_percentage' => 79, 'gpa_point' => 4.00],
                ['grade' => 'A-', 'min_percentage' => 60, 'max_percentage' => 69, 'gpa_point' => 3.50],
                ['grade' => 'B', 'min_percentage' => 50, 'max_percentage' => 59, 'gpa_point' => 3.00],
                ['grade' => 'C', 'min_percentage' => 40, 'max_percentage' => 49, 'gpa_point' => 2.00],
                ['grade' => 'D', 'min_percentage' => 33, 'max_percentage' => 39, 'gpa_point' => 1.00],
                ['grade' => 'F', 'min_percentage' => 0, 'max_percentage' => 32, 'gpa_point' => 0.00],
            ];

            foreach ($defaults as $scale) {
                $scale['tenant_id'] = $tenant_id;
                GradingScale::create($scale);
            }
        }

        $scales = GradingScale::query()
            ->where('tenant_id', $tenant_id)
            ->orderBy('min_percentage', 'desc')
            ->get();

        return Inertia::render('grading-scale/index', [
            'scales' => $scales,
        ]);
    }

    /**
     * Store a newly created grading scale.
     */
    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'grade' => 'required|string|max:10',
            'min_percentage' => 'required|integer|min:0|max:100',
            'max_percentage' => 'required|integer|min:0|max:100|gte:min_percentage',
            'gpa_point' => 'required|numeric|min:0|max:10.00',
        ]);

        $validated['tenant_id'] = $tenant_id;

        GradingScale::create($validated);

        return to_route('grading_scale.index')->with([
            'type' => 'success',
            'message' => 'Grading scale rule added successfully',
        ]);
    }

    /**
     * Update the specified grading scale.
     */
    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'grade' => 'required|string|max:10',
            'min_percentage' => 'required|integer|min:0|max:100',
            'max_percentage' => 'required|integer|min:0|max:100|gte:min_percentage',
            'gpa_point' => 'required|numeric|min:0|max:10.00',
        ]);

        GradingScale::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->update($validated);

        return to_route('grading_scale.index')->with([
            'type' => 'success',
            'message' => 'Grading scale rule updated successfully',
        ]);
    }

    /**
     * Remove the specified grading scale.
     */
    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        GradingScale::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('grading_scale.index')->with([
            'type' => 'success',
            'message' => 'Grading scale rule deleted successfully',
        ]);
    }
}
