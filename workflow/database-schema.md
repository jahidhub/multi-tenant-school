# Database Schema Reference — Sehrix EduCloud

Source of truth: live MySQL database (`sehrixedu_db`). Regenerate with `php artisan schema:dump` or the list script.

## Core tenancy
### tenants
- id
- institute_name
- slug
- owner_name
- domain
- status
- address
- plan
- settings
- created_at, updated_at

## Users & auth
### users
- id
- tenant_id
- name
- email
- email_verified_at
- password
- two_factor_secret
- two_factor_recovery_codes
- two_factor_confirmed_at
- role
- status (pending/active/rejected)
- approved_by
- approved_at
- remember_token
- created_at, updated_at

### password_reset_tokens
- email, token, created_at

### sessions
- id, user_id, ip_address, user_agent, payload, last_activity

### passkeys
- id, user_id, name, credential_id, credential, last_used_at, created_at, updated_at

## Roles & permissions (Spatie, team-scoped by tenant_id)
### roles
- id, tenant_id, name, guard_name, created_at, updated_at

### permissions
- id, name, guard_name, created_at, updated_at

### model_has_roles
- role_id, model_type, model_id, tenant_id

### model_has_permissions
- permission_id, model_type, model_id, tenant_id

### role_has_permissions
- permission_id, role_id

## Academic
### students
- id, tenant_id, admission_no, name, dob, gender, guardian_name, guardian_phone, class, roll_number, status, profile_photo_path, address, created_at, updated_at, deleted_at

### teachers
- id, tenant_id, user_id, name, email, phone, subject_specialty, address, joining_date, status, profile_photo_path, created_at, updated_at, deleted_at

### courses
- id, tenant_id, teacher_id, name, code, credit_hours, academic_year, capacity, status, created_at, updated_at, deleted_at

### course_teacher (pivot)
- id, course_id, teacher_id, created_at, updated_at

### enrollments
- id, tenant_id, student_id, course_id, enrollment_date, status, created_at, updated_at

### timetable_slots
- id, tenant_id, course_id, teacher_id, day_of_week, start_time, end_time, room, created_at, updated_at

### exams
- id, tenant_id, course_id, name, exam_date, max_marks, created_at, updated_at

### grades
- id, tenant_id, exam_id, student_id, marks_obtained, remarks, created_at, updated_at

### grading_scales
- id, tenant_id, grade, min_percentage, max_percentage, gpa_point, created_at, updated_at

### attendance_records
- id, tenant_id, student_id, course_id, date, status, marked_by, created_at, updated_at

## Fees
### fee_structures
- id, tenant_id, class, term, amount, due_date, created_at, updated_at

### invoices
- id, tenant_id, student_id, fee_structure_id, amount_due, amount_paid, status, due_date, created_at, updated_at

### payments
- id, tenant_id, invoice_id, amount, method, paid_at, reference_no, created_at, updated_at

## Audit / infra (Laravel framework)
### activity_log
- id, tenant_id, log_name, description, subject_type, subject_id, event, causer_type, causer_id, attribute_changes, properties, created_at, updated_at

### cache, cache_locks, jobs, job_batches, failed_jobs, migrations
- Laravel framework-managed tables.

## Notes
- Multi-tenancy via `tenant_id` foreign key + `TenantScope` global scope.
- `tenants.name` was removed; use `institute_name`.
- Approval workflow adds `status`, `approved_by`, `approved_at` on `users`.
