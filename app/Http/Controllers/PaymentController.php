<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    /**
     * Download the payment transaction receipt as a PDF.
     */
    public function downloadReceipt(string $id)
    {
        $tenant_id = Auth::user()->tenant_id;

        $payment = Payment::query()
            ->where('tenant_id', $tenant_id)
            ->where('id', $id)
            ->with(['invoice.student', 'invoice.feeStructure'])
            ->firstOrFail();

        $tenant = Auth::user()->tenant;

        $data = [
            'payment' => $payment,
            'tenant' => $tenant,
            'dateGenerated' => now()->format('Y-m-d H:i:s'),
        ];

        $pdf = Pdf::loadView('pdf.payment_receipt', $data);

        return $pdf->download("payment_receipt_{$payment->id}.pdf");
    }
}
