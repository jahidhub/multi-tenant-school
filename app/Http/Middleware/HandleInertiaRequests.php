<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $tenant = app()->bound('tenant') ? app('tenant') : null;

        return [
            ...parent::share($request),
            'name' => $tenant?->institute_name ?? config('app.name'),
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'institute_name' => $tenant->institute_name,
                'owner_name' => $tenant->owner_name,
                'slug' => $tenant->slug,
                'domain' => $tenant->domain,
                'logo_path' => $tenant->logo_path ?? null,
                'primary_color' => $tenant->primary_color ?? null,
                'tagline' => $tenant->tagline ?? null,
            ] : null,
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user() ? $request->user()->getRoleNames() : [],
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
                'is_impersonating' => $request->session()->has('impersonate.original_user_id'),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'type' => $request->session()->get('type') ?? ($request->session()->has('success') ? 'success' : ($request->session()->has('error') ? 'error' : null)),
                'message' => $request->session()->get('message') ?? $request->session()->get('success') ?? $request->session()->get('error'),
            ],
        ];
    }
}
