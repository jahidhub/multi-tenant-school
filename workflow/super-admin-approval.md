# Feature: Super-Admin Approval Gate for Registration

## Goal
When no super admin exists, public registration/login is disabled. New registrations require super-admin approval before access is granted.

## Database
- [ ] Add `status` column to `users`: enum('pending','active','rejected'), default `pending` for new registrations.
- [ ] Add `approved_by` (nullable FK to users) and `approved_at` timestamps.
- [ ] Super-admin users created via `create:super-admin` are auto `active`.

## Auth / Middleware
- [ ] Middleware: if zero super-admin users exist -> block `/login` and `/register` (show "Setup required" page).
- [ ] On registration: create user with `status = pending`, do NOT auto-login.
- [ ] Login check: reject login if `status != active` (show "Awaiting approval" message).
- [ ] Prevent privilege escalation: web registration can never assign `role = super-admin`.

## Super-Admin Dashboard
- [ ] New page `/admin/registrations` listing pending users (name, email, date).
- [ ] Actions: Approve (sets `active`, optionally assign role/tenant) / Reject (sets `rejected`).
- [ ] Sidebar link visible only to super admins.

## Recovery / Safety
- [ ] Keep `php artisan create:super-admin` as the only way to bootstrap the first super admin.
- [ ] Guard against deleting the last super admin (prevent lockout).

## Out of scope (later)
- Email notifications.

## Open decisions
- Approved registrations become: (a) regular users, (b) school admins with new tenant, or (c) super admins? (Recommendation: never super admins via web.)
- Should "no super admin -> no login" block all users or only new registrations?
