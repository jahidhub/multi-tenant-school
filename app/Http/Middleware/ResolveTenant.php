<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->tenant_id) {
            $tenant = Tenant::find(auth()->user()->tenant_id);
            $isImpersonating = session()->has('impersonate.original_user_id');

            // If tenant was deleted or is suspended (and not currently impersonated by super-admin)
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

            if ($tenant) {
                app()->instance('tenant', $tenant);
                setPermissionsTeamId($tenant->id);
            }
        }

        return $next($request);
    }
}
