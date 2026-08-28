<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class FeeStructureController extends Controller
{
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        $feeStructures = FeeStructure::query()
            ->where('tenant_id', $tenant_id)
            ->paginate(5);

        return Inertia::render('fee-structure/index', [
            'feeStructures' => $feeStructures,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class' => 'required|string|max:20',
            'term' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        FeeStructure::create($validated);

        return to_route('fee_structure.index')->with([
            'type' => 'success',
            'message' => 'Fee structure defined successfully',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $feeStructure = FeeStructure::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'class' => 'required|string|max:20',
            'term' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
        ]);

        $feeStructure->update($validated);

        return to_route('fee_structure.index')->with([
            'type' => 'success',
            'message' => 'Fee structure updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        FeeStructure::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('fee_structure.index')->with([
            'type' => 'success',
            'message' => 'Fee structure deleted successfully',
        ]);
    }

    /**
     * Generate invoices for all active students enrolled in the matching class.
     */
    public function generateInvoices(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $feeStructure = FeeStructure::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        // Get all students matching this class
        $students = Student::query()
            ->where('tenant_id', $tenant_id)
            ->where('class', $feeStructure->class)
            ->get();

        if ($students->isEmpty()) {
            return to_route('fee_structure.index')->with([
                'type' => 'error',
                'message' => 'No active students found in Class ' . $feeStructure->class,
            ]);
        }

        $generatedCount = 0;
        $isOverdue = Carbon::parse($feeStructure->due_date)->isPast();

        foreach ($students as $student) {
            $invoice = Invoice::firstOrCreate(
                [
                    'tenant_id' => $tenant_id,
                    'student_id' => $student->id,
                    'fee_structure_id' => $feeStructure->id,
                ],
                [
                    'amount_due' => $feeStructure->amount,
                    'amount_paid' => 0.00,
                    'status' => $isOverdue ? 'overdue' : 'unpaid',
                    'due_date' => $feeStructure->due_date,
                ]
            );

            if ($invoice->wasRecentlyCreated) {
                $generatedCount++;
            }
        }

        return to_route('fee_structure.index')->with([
            'type' => 'success',
            'message' => "Successfully generated {$generatedCount} new invoices for Class {$feeStructure->class}",
        ]);
    }
}
