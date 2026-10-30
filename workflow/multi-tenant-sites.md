
---

## Guide / Important Info / Safety

### How tenant resolution works (runtime)
1. Authenticated user with `tenant_id` -> tenant resolved from user (admin/school users).
2. Unauthenticated request -> host matched against `tenants.domain` (custom domain) or subdomain `{slug}.base-domain`.
3. Local dev only -> `?tenant=slug` query param (gated by `app()->isLocal()`).
4. No match -> no tenant bound; marketing/global pages render.

### Important configuration
- `.env`: `APP_URL=https://sehrixedu.test/`, `SESSION_DOMAIN=.sehrixedu.test` (leading dot shares session across subdomains).
- Wildcard DNS/vhost: `*.sehrixedu.test` -> app `public/` (EnvKit site or nginx).
- Run `php artisan storage:link` so tenant logos resolve under `/storage/`.
- Branding columns: `logo_path`, `primary_color`, `tagline` on `tenants`.

### Safety checklist
- `?tenant=slug` is gated to local env only (prevents prod tenant spoofing).
- Logo uploads use `store()` with strict MIME validation (`png,jpg,svg`, max 512KB) — no path traversal.
- `primary_color` validated with strict hex regex `/^#[0-9A-Fa-f]{6}$/` (prevents XSS in blade).
- Domain uniqueness enforced via DB unique index + validation.
- Session cookie scoped via `SESSION_DOMAIN` to avoid cross-tenant leakage.
- Super-admin queries use `withoutGlobalScope(TenantScope::class)` (already in place).
- Tenant scoping via `tenant_id` + `TenantScope` global scope on all tenant-owned models.
- Backups remain simple: single DB dump (no per-tenant DB complexity).

### Testing (local)
```
# No DNS changes needed:
http://sehrixedu.test/login?tenant=your-school-slug

# After wildcard vhost configured:
http://your-school-slug.sehrixedu.test/login
```
Verify: page title shows institute name, sidebar shows school name, logo swaps when uploaded.

### Rollback
- Revert middleware to previous version; remove branding columns via migration `down()`.
- `.env` SESSION_DOMAIN can be set back to `null`.
