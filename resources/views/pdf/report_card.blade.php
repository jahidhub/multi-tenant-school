<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Academic Report Card</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            line-height: 1.4;
            font-size: 13px;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            margin: 0 auto;
            padding: 10px;
        }

        /* School Header styling */
        .header-table {
            width: 100%;
            border-bottom: 2px solid #16a34a;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header-logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
            text-transform: uppercase;
            margin: 0;
        }
        .header-subtext {
            font-size: 12px;
            color: #666666;
            margin: 2px 0 0 0;
        }
        .header-right {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            color: #444444;
        }

        /* Student Info box */
        .info-table {
            width: 100%;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .info-table td {
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
        }
        .info-label {
            font-weight: bold;
            color: #555555;
            width: 15%;
        }
        .info-value {
            color: #111111;
            width: 35%;
        }

        /* Grades Table styling */
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .grades-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
            text-align: left;
            padding: 10px;
            border: 1px solid #cbd5e1;
            font-size: 12px;
            text-transform: uppercase;
        }
        .grades-table td {
            padding: 10px;
            border: 1px solid #e2e8f0;
            font-size: 12px;
        }
        .course-row {
            background-color: #f8fafc;
            font-weight: bold;
            color: #1e293b;
        }
        .exam-indent {
            padding-left: 24px !important;
        }

        /* Overall Performance card */
        .summary-table {
            width: 45%;
            margin-left: auto;
            border-collapse: collapse;
            border: 1px solid #cbd5e1;
            margin-bottom: 40px;
        }
        .summary-table td {
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
        }
        .summary-label {
            font-weight: bold;
            background-color: #f8fafc;
            color: #475569;
        }
        .summary-value {
            font-weight: bold;
            font-size: 15px;
            color: #16a34a;
            text-align: center;
        }

        /* Signatures block */
        .signature-table {
            width: 100%;
            margin-top: 50px;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
        }
        .signature-line {
            width: 200px;
            border-bottom: 1px solid #94a3b8;
            margin: 0 auto 5px auto;
        }
        .signature-title {
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- School Header -->
        <table class="header-table">
            <tr>
                <td>
                    <div class="header-logo-text">{{ $tenant->school_name }}</div>
                    <div class="header-subtext">{{ $tenant->address ?? 'Primary & Secondary Education' }}</div>
                </td>
                <td class="header-right">
                    ACADEMIC REPORT CARD<br>
                    <span style="font-size: 10px; font-weight: normal; color: #666666;">Date Generated: {{ $dateGenerated }}</span>
                </td>
            </tr>
        </table>

        <!-- Student Details -->
        <table class="info-table">
            <tr>
                <td class="info-label">Student Name:</td>
                <td class="info-value"><strong>{{ $student->name }}</strong></td>
                <td class="info-label">Roll Number:</td>
                <td class="info-value">{{ $student->roll_number }}</td>
            </tr>
            <tr>
                <td class="info-label">Class:</td>
                <td class="info-value">{{ $student->class }}</td>
                <td class="info-label">Contact:</td>
                <td class="info-value">{{ $student->guardian_phone }}</td>
            </tr>
        </table>

        <!-- Course & Exam Marks Details -->
        <table class="grades-table">
            <thead>
                <tr>
                    <th style="width: 35%;">Subject / Assessment</th>
                    <th style="width: 15%;">Max Marks</th>
                    <th style="width: 15%;">Marks Obtained</th>
                    <th style="width: 10%;">Grade</th>
                    <th style="width: 10%;">GPA</th>
                    <th style="width: 15%;">Remarks</th>
                </tr>
            </thead>
            <tbody>
                @if(count($reportData) === 0)
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 20px; color: #666666;">
                            No academic records found for this student.
                        </td>
                    </tr>
                @else
                    @foreach($reportData as $dataItem)
                        <!-- Subject Title Row -->
                        <tr class="course-row">
                            <td colspan="6">{{ $dataItem['course_name'] }}</td>
                        </tr>

                        <!-- Exam Rows for this Course -->
                        @if(count($dataItem['exams']) === 0)
                            <tr>
                                <td class="exam-indent" colspan="6" style="color: #888888; font-style: italic;">
                                    No marks recorded for this course.
                                </td>
                            </tr>
                        @else
                            @foreach($dataItem['exams'] as $exam)
                                <tr>
                                    <td class="exam-indent">{{ $exam['exam_name'] }}</td>
                                    <td>{{ $exam['max_marks'] }}</td>
                                    <td>{{ $exam['marks_obtained'] ?? 'N/A' }}</td>
                                    <td style="font-weight: bold;">{{ $exam['letter_grade'] }}</td>
                                    <td>{{ number_format((float)$exam['gpa_point'], 2) }}</td>
                                    <td style="color: #555555; font-size: 11px;">{{ $exam['remarks'] ?? '-' }}</td>
                                </tr>
                            @endforeach
                        @endif
                    @endforeach
                @endif
            </tbody>
        </table>

        <!-- Overall Summary Table -->
        <table class="summary-table">
            <tr>
                <td class="summary-label">Cumulative GPA:</td>
                <td class="summary-value">{{ number_format($overallGpa, 2) }} / 5.00</td>
            </tr>
            <tr>
                <td class="summary-label">Overall Grade:</td>
                <td class="summary-value" style="color: #16a34a; font-size: 18px;">{{ $overallGrade }}</td>
            </tr>
        </table>

        <!-- Signatures -->
        <table class="signature-table">
            <tr>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-title">Class Teacher</div>
                </td>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-title">School Principal</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
