# Sehrix EduCloud — Complete User & Administrator Guide

Welcome to **Sehrix EduCloud** (Education Management System), an enterprise-grade, multi-tenant school and institute management platform built on Laravel, Inertia.js, React, and TypeScript.

This document contains full instructions on **how to start and log in**, an exhaustive **breakdown of every feature**, and **step-by-step workflows** on how to operate the platform.

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [How to Start & Access the System](#2-how-to-start--access-the-system)
3. [How to Log In (Roles & Credentials)](#3-how-to-log-in-roles--credentials)
4. [Comprehensive Feature Breakdown](#4-comprehensive-feature-breakdown)
   - [Super Admin Console & Tenant Management](#super-admin-console--tenant-management)
   - [Dashboard & Analytics](#dashboard--analytics)
   - [Students Information System (SIS)](#students-information-system-sis)
   - [Teachers & Faculty Management](#teachers--faculty-management)
   - [Courses & Curriculum](#courses--curriculum)
   - [Course Enrollments](#course-enrollments)
   - [Timetable & Scheduling (Conflict-Free)](#timetable--scheduling-conflict-free)
   - [Attendance Tracking & Monthly Reports](#attendance-tracking--monthly-reports)
   - [Exams & Bulk Marks Entry](#exams--bulk-marks-entry)
   - [Grading Scales & GPA Computation](#grading-scales--gpa-computation)
   - [Automated PDF Report Cards](#automated-pdf-report-cards)
   - [Fee Structures & Automatic Batch Invoicing](#fee-structures--automatic-batch-invoicing)
   - [Invoices, Fee Collections & PDF Receipts](#invoices-fee-collections--pdf-receipts)
   - [Settings, Security & Profile Management](#settings-security--profile-management)
5. [Step-by-Step Usage Workflows](#5-step-by-step-usage-workflows)
   - [Workflow A: Onboarding a New School / Campus](#workflow-a-onboarding-a-new-school--campus)
   - [Workflow B: Academic Term Setup (Courses, Teachers, Timetable)](#workflow-b-academic-term-setup-courses-teachers-timetable)
   - [Workflow C: Adding & Bulk Importing Students](#workflow-c-adding--bulk-importing-students)
   - [Workflow D: Daily Attendance Routine](#workflow-d-daily-attendance-routine)
   - [Workflow E: Running Exams & Issuing Report Cards](#workflow-e-running-exams--issuing-report-cards)
   - [Workflow F: Fee Collection & Receipt Issuance](#workflow-f-fee-collection--receipt-issuance)
6. [Administrator Tips & Troubleshooting](#6-administrator-tips--troubleshooting)

---

## 1. System Overview & Architecture

Sehrix EduCloud is built on a **multi-tenant architecture**. This means:
- **Tenant Isolation**: Every school operates in complete isolation. Data such as students, teachers, grades, invoices, and timetables are scoped to the authenticated tenant.
- **Super-Admin Control**: Platform operators can manage all schools, set subscription plans (`basic`, `premium`, `enterprise`), activate/suspend institutions, and impersonate any school with a single click.
- **Tech Stack**:
  - **Backend**: Laravel 13, Laravel Fortify (Auth & 2FA), Spatie Permission, Barryvdh DomPDF.
  - **Frontend**: React 19, TypeScript, Inertia.js, Tailwind CSS, Lucide Icons, Shadcn UI.
  - **Database**: MySQL / MariaDB with automatic tenant global scopes.

---

## 2. How to Start & Access the System

### Starting the Application Locally

1. Open a terminal / PowerShell in the project directory (`e:\Envkit\projects\sehrixedu`).
2. Run the full development environment with one command:
   ```bash
   composer run dev
   ```
   *(This concurrently runs `php artisan serve`, `php artisan queue:listen`, and `npm run dev`.)*

   *Alternatively, you can run them in separate terminals:*
   - Terminal 1 (PHP Server):
     ```bash
     php artisan serve
     ```
   - Terminal 2 (Vite Assets):
     ```bash
     npm run dev
     ```

3. Open your browser and navigate to:
   - **Local Server**: [http://127.0.0.1:8000](http://127.0.0.1:8000) or [http://localhost:8000](http://localhost:8000)
   - **Virtual Host (if configured)**: [https://sehrixedu.test](https://sehrixedu.test)

---

## 3. How to Log In (Roles & Credentials)

Navigate to `/login` or click the **Log in** button on the top right of the landing page.

### 1. Super Administrator Account
Super Admins oversee the entire multi-school network, manage subscriptions, and audit schools.
- **URL**: `http://127.0.0.1:8000/login`
- **Email**: `super@test.com`
- **Password**: `616726`
- **Console Command to create or update Super Admin**:
  - Interactive prompt (prompts for Email, Name, and Password):
    ```bash
    php artisan create:super-admin
    ```
  - Or directly via command arguments:
    ```bash
    php artisan create:super-admin admin@example.com --name="Super Admin" --password="YourPasswordHere"
    ```
- **Redirects to**: `/admin/dashboard`

### 2. School / Institute Administrator Account
School Admins have full operational control over their specific institution.
- **Example Pre-configured School**: Sheikh Akij Uddin High School
- **Email**: `akij@test.com`
- **Accessing via Impersonation (Recommended for Super Admin)**:
  1. Log in as Super Admin (`super@test.com`).
  2. Go to **Schools** (`/admin/tenants`).
  3. Click the **Impersonate** button next to any school.
  4. You will instantly enter the school's admin dashboard without needing the school's password!
  5. When finished, click **Leave Impersonation** at the top banner to return to the Super Admin panel.
- **Resetting a School Admin Password**:
  - As Super Admin, navigate to `/admin/tenants`, click **Edit** on the school, type a new password in the **Admin Password** field, and click **Save**.

### 3. Log Out
Click on your user avatar at the bottom-left sidebar menu and choose **Log Out**.

---

## 4. Comprehensive Feature Breakdown

### Super Admin Console & Tenant Management
- **Central Dashboard (`/admin/dashboard`)**: High-level platform statistics, total schools, active tenants, and system activity logs.
- **School Onboarding (`/admin/tenants/create`)**:
  - Name, URL Slug, Custom Domain.
  - Plan Selection: `Basic`, `Premium`, `Enterprise`.
  - Admin Profile: Sets up the initial school administrator account (name, email, secure password).
- **Tenant Management (`/admin/tenants`)**:
  - View paginated list of all onboarded schools.
  - Update status between **Active** and **Suspended** (suspending immediately revokes access for all school users and blocks login).
  - One-click **Impersonation**: Safely logs into active tenant accounts to assist clients or inspect issues (blocked for suspended schools until activated).
  - **Permanently Delete Schools**: Delete an entire school along with all its users, teachers, students, enrollments, exams, and invoices directly from the schools list or edit page with confirmation.

---

### Dashboard & Analytics
- **Live Statistics Cards**:
  - **Total Enrolled Students**
  - **Total Active Teachers**
  - **Total Courses Offered**
  - **Total Overdue Fee Amount**
- **Overdue Invoices Alert Board**: Displays real-time lists of outstanding payments with direct links to take payment action.

---

### Students Information System (SIS)
- **Auto-Generated Admission Numbers**: Every new student receives a standardized ID (e.g. `GH-2026-0001`).
- **Student Profile Creation**:
  - Full Name, Class, Roll Number, Date of Birth, Gender, Guardian Name, Guardian Contact Phone, Home Address, and Profile Picture upload.
- **360° Comprehensive Student Profile (`/student/{id}`)**:
  - View personal details and photo.
  - Active course enrollments with ability to enroll into new courses instantly.
  - Academic exam grades, scores, and calculated GPA.
  - Fee history: Invoices, outstanding balances, and logged payment transactions.
- **Search & Filter**: Search instantaneously by student name or admission number, and filter by class.
- **Data Safety & Lifecycle**:
  - **Soft Deletion / Archive**: Archived students can be filtered and restored at any time.
  - **Permanent Delete**: Permanently removes student records.
- **Bulk Operations**:
  - **Bulk Archive / Delete**: Select multiple students via checkboxes and archive in one action.
  - **Bulk Restore**: Recover multiple archived students simultaneously.
  - **Bulk Permanent Delete**: Purge selected deleted students.
  - **Bulk Export to CSV**: Export selected students into an Excel-ready `.csv` file.
  - **Bulk Class Promotion**: Select students and promote them to the next class (e.g., Class 9 to Class 10) in one click.
  - **Bulk CSV Import**: Upload a CSV file of students to import hundreds of admissions in seconds.

---

### Teachers & Faculty Management
- **Teacher Directory (`/teachers`)**:
  - View all instructors with photo, subject specialty, contact phone, and assigned courses.
- **Add & Edit Faculty**:
  - Name, Email, Phone, Subject Specialty, Joining Date, Residential Address, and Profile Image.
  - Assign to one or multiple courses.
- **Archive & Restore**: Soft-delete departing faculty while preserving their historical teaching records.

---

### Courses & Curriculum
- **Course Catalog (`/courses`)**:
  - Course Name, Course Code (e.g., `MATH101`), Credit Hours, Academic Year (e.g. `2026-2027`), Maximum Student Capacity, and Assigned Instructor.
  - Enrollment count progress bar against capacity.
- **Duplicate Course Feature**:
  - Duplicate an existing course syllabus to a new academic year with 1 click.

---

### Course Enrollments
- **Enrollment Directory (`/enrollments`)**:
  - Map students to active courses.
  - Track enrollment status: `Active`, `Completed`, `Withdrawn`.
  - Prevent over-enrollment beyond course capacity limits.

---

### Timetable & Scheduling (Conflict-Free)
- **Weekly Schedule Matrix (`/timetable`)**:
  - Organize slots by Day of the Week (Monday to Sunday), Start Time, End Time, Course, Teacher, and Classroom / Room Number.
- **Smart Conflict Detection Engine**:
  - Automatically verifies in real-time whether a **Teacher** is already booked at that time or if a **Room** is occupied. Displays a clear alert if a clash occurs.
- **Role Scoping**: Teachers only see their own assigned timetable slots.

---

### Attendance Tracking & Monthly Reports
- **Daily Attendance Taking (`/attendance`)**:
  - Select Course and Date.
  - Students list loads with statuses: `Present`, `Absent`, `Late`, `Excused`.
  - Pre-fills to "Present" for swift marking.
  - High-performance database upsert.
- **Monthly Attendance Reports (`/attendance/report`)**:
  - Filter by Course, Start Date, and End Date.
  - Computes Total School Days, Total Present, Late, Absent, Excused, and **Attendance Percentage (%)** per student.

---

### Exams & Bulk Marks Entry
- **Exam Management (`/exams`)**:
  - Schedule exams tied to specific courses, set Exam Date and Maximum Marks (e.g. 100).
- **Spreadsheet-style Bulk Marks Entry (`/exams/{id}/marks`)**:
  - Loads all enrolled students in a convenient gradebook table.
  - Quickly type marks obtained and optional remarks.
  - Saves all grades simultaneously with server-side validation against `max_marks`.

---

### Grading Scales & GPA Computation
- **Grading Scale Builder (`/grading-scales`)**:
  - Fully customizable grading tiers per school (e.g., A+, A, A-, B, C, D, F).
  - Configure Minimum Percentage, Maximum Percentage, and Grade Point Average (GPA Point, e.g. 5.0, 4.0, 3.5).
  - Used across the entire application to calculate student letter grades and GPAs automatically.

---

### Automated PDF Report Cards
- **Report Card Hub (`/report-cards`)**:
  - Aggregates all marks across all course examinations taken by each student.
  - Dynamically computes Overall GPA and Final Grade.
- **One-Click PDF Download (`/students/{id}/report-card`)**:
  - Generates a branded, print-ready official PDF Report Card via DomPDF.
  - Includes school header, student info, courses, exam breakdowns, marks obtained, percentage, letter grades, and final GPA.

---

### Fee Structures & Automatic Batch Invoicing
- **Fee Structures (`/fee-structures`)**:
  - Define recurring or term fees: Class, Term Name (e.g., `Term 1 Tuition 2026`), Amount, and Due Date.
- **Batch Invoice Generation**:
  - Click **Generate Invoices** on any fee structure: automatically generates individual invoices for every active student in that class!

---

### Invoices, Fee Collections & PDF Receipts
- **Invoice Register (`/invoices`)**:
  - Filter by status: `Unpaid`, `Partially Paid`, `Paid`, `Overdue`.
  - Search by student name or roll number.
  - Dynamic status recalculation (flags invoices as `overdue` when past due date).
- **Payment Collection Modal**:
  - Record payments against invoices: Payment Amount, Payment Method (`Cash`, `Bank Transfer`, `Card`, `Mobile Banking / bKash / Nagad`), Transaction Reference No., and Date.
  - Auto-updates invoice `amount_paid` and status.
- **Official PDF Payment Receipt (`/payments/{id}/receipt`)**:
  - Download official payment receipts with receipt number, payer details, breakdown, and remaining balance.

---

### Settings, Security & Profile Management
- **Profile (`/settings/profile`)**: Update name and email address.
- **Security (`/settings/security`)**: Change account password and configure Two-Factor Authentication (2FA) with recovery codes.
- **School Branding (`/settings/school`)**: Update School Name, Domain, Address, and Contact details.
- **Appearance (`/settings/appearance`)**: Toggle between Light, Dark, or System themes.

---

## 5. Step-by-Step Usage Workflows

### Workflow A: Onboarding a New School / Campus
*(Performed by Super Administrator)*
1. Log in with `super@test.com` at `/login`.
2. Navigate to **Schools** (`/admin/tenants`) in the sidebar.
3. Click **Add New School** (`/admin/tenants/create`).
4. Enter:
   - School Name (e.g., *Greenwood International Academy*).
   - Plan (*Basic*, *Premium*, or *Enterprise*).
   - School Admin Name, Admin Email, and Password.
5. Click **Create School**.
6. The school is immediately live! You can click **Impersonate** to enter and set it up, or give the login credentials to the school principal.

---

### Workflow B: Academic Term Setup (Courses, Teachers, Timetable)
*(Performed by School Administrator)*
1. **Add Teachers**:
   - Go to **Teachers** (`/teachers`) -> Click **Add Teacher**.
   - Fill in contact details and subject specialties.
2. **Add Courses**:
   - Go to **Courses** (`/courses`) -> Click **Add Course**.
   - Set Course Name (*e.g., English Literature*), Code (*ENG-101*), Academic Year (*2026-2027*), and assign the instructor.
3. **Build Timetable**:
   - Go to **Timetable** (`/timetable`) -> Click **Add Slot**.
   - Select Day, Start Time, End Time, Course, Teacher, and Room.
   - The system validates that neither the teacher nor the room is double-booked.

---

### Workflow C: Adding & Bulk Importing Students
1. **Manual Entry**:
   - Go to **Students** (`/students`) -> Click **Add Student**.
   - Enter name, class, guardian info, and upload photo.
2. **Bulk CSV Import**:
   - In **Students**, click **Import Students**.
   - Upload a CSV containing columns: `name`, `class`, `roll_number`, `dob`, `gender`, `guardian_name`, `guardian_phone`.
   - The system automatically registers all students and generates consecutive admission IDs.

---

### Workflow D: Daily Attendance Routine
1. In the sidebar, select **Mark Attendance** (`/attendance`).
2. Choose the **Course** and **Date**.
3. All enrolled students are displayed, pre-selected as **Present**.
4. Toggle any absent or late students to **Absent** or **Late**.
5. Click **Save Attendance**.
6. To inspect attendance trends, visit **Attendance Report** (`/attendance/report`) and select a date range.

---

### Workflow E: Running Exams & Issuing Report Cards
1. **Set Up Grading Scales**:
   - Visit **Grading Scales** (`/grading-scales`) to verify your percentage ranges (e.g. 80-100% = A+, 70-79% = A).
2. **Create Exam**:
   - Go to **Exams** (`/exams`) -> Click **Add Exam**.
   - Choose Course, Name (*Midterm Exam 2026*), Max Marks (*100*), and Date.
3. **Enter Marks**:
   - In the Exams list, click the **Marks** action button on your exam.
   - Enter obtained marks for each student and save.
4. **Generate Report Card**:
   - Go to **Report Cards** (`/report-cards`).
   - View student GPAs and letter grades.
   - Click **Download PDF** to download the student's official Report Card.

---

### Workflow F: Fee Collection & Receipt Issuance
1. **Define Fees**:
   - Go to **Fee Structures** (`/fee-structures`) -> Click **Add Fee Structure**.
   - Enter Class (*Class 10*), Term (*Annual Term 2026*), Amount (*$500.00*), and Due Date.
2. **Generate Invoices**:
   - Click **Generate Invoices** on the fee structure.
   - Invoices are automatically generated for all students in that class.
3. **Record Payments**:
   - Go to **Invoices** (`/invoices`).
   - Click **Record Payment** on any student's invoice.
   - Enter payment amount, payment method (Cash/Bank/Card), and reference ID.
4. **Download Receipt**:
   - View the student's profile or payments history and click **Download Receipt (PDF)**.

---

## 6. Administrator Tips & Troubleshooting

- **Forgot School Admin Password?**
  - Log in as Super Admin (`super@test.com`), open `/admin/tenants`, click **Edit** on that school, type a new password, and submit.
- **Timetable Conflict Error:**
  - If you receive *"Conflict detected: The teacher or room is already booked at this time"*, check the weekly timetable matrix for existing bookings on that day and hour.
- **Cache Clearing Commands:**
  ```bash
  php artisan optimize:clear
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  ```
- **File Storage Linking (for Photos & PDFs):**
  - Ensure public storage is linked:
    ```bash
    php artisan storage:link
    ```
