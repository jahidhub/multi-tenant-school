<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Receipt #{{ $payment->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #333333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header-logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
        }
        .header-subtext {
            font-size: 11px;
            color: #555555;
            margin-top: 5px;
        }
        .header-right {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            color: #333333;
        }
        .info-table {
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 6px 10px;
            vertical-align: top;
        }
        .info-label {
            font-weight: bold;
            color: #555555;
            width: 18%;
        }
        .info-value {
            color: #111111;
            width: 32%;
        }
        .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .receipt-table th {
            background-color: #f3f4f6;
            color: #1e293b;
            font-weight: bold;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .receipt-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .summary-table {
            width: 40%;
            margin-left: 60%;
            margin-bottom: 40px;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 8px 10px;
        }
        .summary-label {
            font-weight: bold;
            color: #555555;
            text-align: right;
            width: 60%;
        }
        .summary-value {
            text-align: right;
            font-weight: bold;
            color: #111111;
            width: 40%;
        }
        .signature-table {
            width: 100%;
            margin-top: 50px;
            text-align: center;
        }
        .signature-table td {
            width: 50%;
            padding: 0 50px;
        }
        .signature-line {
            border-top: 1px solid #999999;
            margin-bottom: 5px;
        }
        .signature-title {
            font-size: 11px;
            color: #555555;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- School Header -->
        <table class="header-table">
            <tr>
                <td>
                    <div class="header-logo-text">{{ $tenant->name }}</div>
                    <div class="header-subtext">{{ $tenant->address ?? 'Primary & Secondary Education' }}</div>
                </td>
                <td class="header-right">
                    PAYMENT RECEIPT<br>
                    <span style="font-size: 10px; font-weight: normal; color: #666666;">Receipt ID: #REC-{{ str_pad($payment->id, 5, '0', STR_PAD_LEFT) }}</span>
                </td>
            </tr>
        </table>

        <!-- Payment Details -->
        <table class="info-table">
            <tr>
                <td class="info-label">Student Name:</td>
                <td class="info-value"><strong>{{ $payment->invoice->student->name }}</strong></td>
                <td class="info-label">Payment Date:</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($payment->paid_at)->format('Y-m-d') }}</td>
            </tr>
            <tr>
                <td class="info-label">Class:</td>
                <td class="info-value">{{ $payment->invoice->student->class }}</td>
                <td class="info-label">Payment Method:</td>
                <td class="info-value">{{ $payment->method }}</td>
            </tr>
            <tr>
                <td class="info-label">Roll Number:</td>
                <td class="info-value">{{ $payment->invoice->student->roll_number ?? 'N/A' }}</td>
                <td class="info-label">Reference No:</td>
                <td class="info-value">{{ $payment->reference_no ?? 'N/A' }}</td>
            </tr>
        </table>

        <!-- Receipt Table -->
        <table class="receipt-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Description</th>
                    <th style="width: 25%;">Total Invoice Due</th>
                    <th style="width: 25%;">Amount Paid</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>{{ $payment->invoice->feeStructure->term }}</strong><br>
                        <span style="font-size: 11px; color: #666666;">Class Fee target: {{ $payment->invoice->feeStructure->class }}</span>
                    </td>
                    <td>${{ number_format($payment->invoice->amount_due, 2) }}</td>
                    <td style="color: #16a34a; font-weight: bold;">${{ number_format($payment->amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Overall Summary Table -->
        <table class="summary-table">
            <tr>
                <td class="summary-label">Transaction Amount:</td>
                <td class="summary-value" style="color: #16a34a; font-size: 15px;">${{ number_format($payment->amount, 2) }}</td>
            </tr>
            <tr>
                <td class="summary-label">Invoice Balance:</td>
                <td class="summary-value">
                    ${{ number_format($payment->invoice->amount_due - $payment->invoice->amount_paid, 2) }}
                </td>
            </tr>
            <tr>
                <td class="summary-label">Invoice Status:</td>
                <td class="summary-value">
                    @if($payment->invoice->status === 'paid')
                        <span class="status-badge" style="background-color: #16a34a;">PAID</span>
                    @elseif($payment->invoice->status === 'partial')
                        <span class="status-badge" style="background-color: #ea580c;">PARTIAL</span>
                    @else
                        <span class="status-badge" style="background-color: #dc2626;">OVERDUE</span>
                    @endif
                </td>
            </tr>
        </table>

        <!-- Signatures -->
        <table class="signature-table">
            <tr>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-title">Received By (Accountant)</div>
                </td>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-title">Authorized Seal / Signature</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
