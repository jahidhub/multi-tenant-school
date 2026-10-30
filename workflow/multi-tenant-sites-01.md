# Feature: Multi-Tenant Site Resolution & Per-Tenant Branding

## Problem
All tenant "sites" currently show the same app name / branding, and data isolation depends only on the logged-in user's `tenant_id`. There is no host/domain-based tenant resolution, so visiting different tenant URLs does not change the site name or scoped data for public pages.

## Goal
Make each tenant feel like its own site (distinct name, branding, scoped data) while keeping the existing single-database, tenant_id-scoped architecture. Optionally support custom domains / subdomains per tenant.

## Architecture decision
- **Recommended: keep single database + tenant_id scoping (Option A).** Standard for SaaS with many small tenants; simplest ops, backups, and cross-tenant admin queries.
- **Not recommended now: database-per-tenant (Option B).** Only consider for enterprise/compliance or very large tenants; adds connection switching, per-DB migrations, and ops complexity.
- **Not applicable: schema-per-tenant (Option C)** requires Postgres; project uses MySQL.

## Database
- [x] `tenants` already has `domain` (nullable, unique) and `slug`.
- [ ] (Optional) Add branding columns to `tenants`: `logo_path`, `primary_color`, `tagline`.
- [ ] Ensure `tenants.slug` is unique and indexed (for subdomain resolution).

## Auth / Middleware
- [ ] Update `ResolveTenant` middleware:
  - If `auth()->check()` and user has `tenant_id` -> resolve by user's tenant (current behavior).
  - Else resolve by request host:
    - Match `tenants.domain` exactly (custom domain).
    - Or match subdomain `{slug}.base-domain` and resolve by `slug`.
  - Bind resolved tenant to container (`app()->instance('tenant', $tenant)`) so `TenantScope` and `BelongsToTenant` keep working.
  - If no tenant resolved and route requires one -> 404 / redirect to marketing page.
- [ ] Configure `SESSION_DOMAIN` (e.g. `.sehrixedu.test`) so cookies work across subdomains.
- [ ] Wildcard DNS + vhost/nginx config for `*.sehrixedu.test` -> app.

## Branding / UI
- [ ] Share resolved tenant in `HandleInertiaRequests`:
  - Add `tenant` prop (institute_name, slug, domain, logo_path, primary_color) when a tenant is bound.
- [ ] Use tenant name for page title in `resources/views/app.blade.php` (fallback to `config('app.name')`).
- [ ] Login / register pages: show tenant-specific branding when tenant resolved by host; otherwise global branding.
- [ ] (Optional) Apply `primary_color` to theme via CSS variables.

## Tenant settings
- [ ] `Settings\TenantController` already updates `name` (institute_name); extend to update domain, logo, color.
- [ ] Validate domain uniqueness and DNS ownership before saving.

## Super-Admin
- [ ] Tenant list shows resolved domain/subdomain link for quick access.
- [ ] Impersonation continues to bind tenant via user.

## Recovery / Safety
- [ ] Keep single DB backups simple (one mysqldump).
- [ ] If moving to DB-per-tenant later, store `db_name` on tenant and switch connection in middleware; defer.

## Phases
1. Branding per tenant (share tenant prop + title).
2. Domain/subdomain resolution in `ResolveTenant`.
3. DNS/vhost + session domain config.
4. Optional branding fields (logo/color).

## Out of scope (later)
- Database-per-tenant isolation.
- Schema-per-tenant (requires Postgres).
- Email notifications for tenant activation.

## Open decisions
- Domain convention: subdomain (`school1.sehrixedu.test`) vs custom domain (`school1.com`) vs both (recommend both, custom domain optional).
- Should public marketing/landing page exist when no tenant resolved? (Recommend yes.)
- Should tenant be selectable by slug in URL path (`/t/{slug}`) as a fallback for local dev? (Recommend yes for dev convenience.)
