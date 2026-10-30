# Workflow: Automatic Tenant Sites via Slug (Subdomain)

## Goal
Make every approved tenant's site instantly reachable at `https://{slug}.sehrixedu.test` with no per-tenant setup.

## One-time infrastructure (do once)

- [ ] **Wildcard DNS** — add one record: `*.sehrixedu.test  A  127.0.0.1` (local) or `*.yourdomain.com  A  <server-ip>` (production).
- [ ] **Wildcard vhost** — point `*.sehrixedu.test` → `F:\EnvKit\projects\sehrixedu\public` (EnvKit site with host `*.sehrixedu.test`, or nginx `server_name *.sehrixedu.test;`).
- [ ] **`.env`** — set `SESSION_DOMAIN=.sehrixedu.test` → run `php artisan optimize:clear`.

## Code (already implemented)

- [x] `ResolveTenant` resolves tenant by subdomain `{slug}.sehrixedu.test` and custom domain.
- [x] `CreateNewUser` / `RegistrationController` create tenant + slug on approval.
- [x] Branding shared via Inertia (name, logo, color, tagline).
- [x] `HandleInertiaRequests` sets page title to institute name.
- [x] `app.blade.php` uses tenant name for title/og tags.

## Local dev without wildcard DNS (no hosts file edits)

- [ ] Use query-param fallback: `https://sehrixedu.test/login?tenant=akij-collage`
- [ ] Or use a wildcard DNS service: `http://akij-collage.127.0.0.1.nip.io`

## Per-tenant (automatic after approval — nothing to do)

- [x] Super admin approves registration → tenant + slug created.
- [x] Site instantly reachable at `https://{slug}.sehrixedu.test`.

## Steps to configure (detailed)

### 1. Hosts file (Windows, as Administrator)
Open Notepad as Administrator → open `C:\Windows\System32\drivers\etc\hosts` → add:
```
127.0.0.1    akij-collage.sehrixedu.test
```
(One line per tenant slug; Windows hosts doesn't support wildcards.)

### 2. Web server vhost
- **EnvKit:** Sites → Create site → Host: `*.sehrixedu.test` → Root: `F:\EnvKit\projects\sehrixedu\public` → select PHP version → Save.
- **nginx:** `server_name *.sehrixedu.test;` pointing to the same `public` root, then `nginx -s reload`.

### 3. Session domain
```
SESSION_DOMAIN=.sehrixedu.test
```
Run `php artisan optimize:clear`.

### 4. Test
Open `http://akij-collage.sehrixedu.test/login` → log in → URL stays on the subdomain.

## Troubleshooting

| Problem | Fix |
|---|---|
| `ERR_NAME_NOT_RESOLVED` | Hosts file entry missing or not saved |
| 404 / blank page | Vhost root not pointing to `public/` |
| Login redirects to apex domain | `SESSION_DOMAIN` not set |
| SSL/cert warnings | Use `http://` for local dev |

## Optional enhancement

- [ ] **Post-login redirect to subdomain** — so the browser URL switches to `{slug}.sehrixedu.test` automatically after a tenant user logs in. Implement in `FortifyServiceProvider` / `LoginResponse` (~10 lines).

## Related files
- `app/Http/Middleware/ResolveTenant.php` — subdomain/domain resolution
- `app/Http/Middleware/HandleInertiaRequests.php` — tenant prop sharing
- `app/Actions/Fortify/CreateNewUser.php` — tenant + slug creation
- `resources/js/pages/auth/login.tsx` — tenant-aware auth branding
- `resources/views/app.blade.php` — dynamic title/og tags
