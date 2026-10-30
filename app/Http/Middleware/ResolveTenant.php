<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        if (auth()->check() && auth()->user()->tenant_id) {
            $tenant = Tenant::find(auth()->user()->tenant_id);
            $isImpersonating = session()->has('impersonate.original_user_id');

            if (!$tenant || ($tenant->status === 'suspended' && !$isImpersonating)) {
                $message = !$tenant
                    ? 'This school account is no longer available.'
                    : 'This school account has been suspended. Please contact support.';

                auth()->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->withErrors([
                    'email' => $message,
                ])->with([
                    'type' => 'error',
                    'message' => $message,
                ]);
            }
        } else {
            $tenant = $this->resolveByHost($request);
        }

        if ($tenant) {
            app()->instance('tenant', $tenant);
            setPermissionsTeamId($tenant->id);
        }

        return $next($request);
    }

    protected function resolveByHost(Request $request): ?Tenant
    {
        $host = $request->getHost();

        $tenant = Tenant::where('domain', $host)->first();
        if ($tenant) {
            return $tenant;
        }

        $parts = explode('.', $host);
        if (count($parts) >= 3) {
            $slug = $parts[0];
            if ($slug !== 'www') {
                $tenant = Tenant::where('slug', $slug)->first();
                if ($tenant) {
                    return $tenant;
                }
            }
        }

        if (app()->isLocal() && $request->has('tenant')) {
            return Tenant::where('slug', $request->query('tenant'))->first();
        }

        return null;
    }
}
