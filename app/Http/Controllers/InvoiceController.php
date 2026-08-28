<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use App\Models\FeeStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Invoice::query()
            ->where('tenant_id', $tenant_id)
            ->with(['student', 'feeStructure']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('roll_number', 'like', "%{$search}%");
            });
        }

        $invoices = $query->latest()->paginate(5)->withQueryString();

        $students = Student::where('tenant_id', $tenant_id)->get();
        $feeStructures = FeeStructure::where('tenant_id', $tenant_id)->get();

        return Inertia::render('invoice/index', [
            'invoices' => $invoices,
            'students' => $students,
            'feeStructures' => $feeStructures,
            'filters' => [
                'status' => $status ?? '',
                'search' => $search ?? '',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_structure_id' => 'required|exists:fee_structures,id',
        ]);

        $feeStructure = FeeStructure::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $validated['fee_structure_id'])
            ->firstOrFail();

        $student = Student::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $validated['student_id'])
            ->firstOrFail();

        $isOverdue = Carbon::parse($feeStructure->due_date)->isPast();

        Invoice::create([
            'tenant_id' => $tenant_id,
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'amount_due' => $feeStructure->amount,
            'amount_paid' => 0.00,
            'status' => $isOverdue ? 'overdue' : 'unpaid',
            'due_date' => $feeStructure->due_date,
        ]);

        return to_route('invoice.index')->with([
            'type' => 'success',
            'message' => 'Invoice created successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        Invoice::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->delete();

        return to_route('invoice.index')->with([
            'type' => 'success',
            'message' => 'Invoice deleted successfully',
        ]);
    }

    /**
     * Record a payment for the invoice.
     */
    public function recordPayment(Request $request, string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $invoice = Invoice::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->firstOrFail();

        $maxAllowed = (float) $invoice->amount_due - (float) $invoice->amount_paid;

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $maxAllowed,
            'method' => 'required|string|max:50',
            'paid_at' => 'required|date',
            'reference_no' => 'nullable|string|max:100',
        ]);

        // Record the payment log
        Payment::create([
            'tenant_id' => $tenant_id,
            'invoice_id' => $invoice->id,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'paid_at' => $validated['paid_at'],
            'reference_no' => $validated['reference_no'] ?? null,
        ]);

        // Update the invoice amount_paid
        $invoice->amount_paid = (float) $invoice->amount_paid + (float) $validated['amount'];
        $invoice->recalculateStatus();

        return to_route('invoice.index')->with([
            'type' => 'success',
            'message' => 'Payment registered and invoice updated successfully',
        ]);
    }
}
