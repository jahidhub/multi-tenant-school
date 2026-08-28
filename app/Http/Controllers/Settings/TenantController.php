<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Show the school/tenant settings page.
     */
    public function edit(): Response
    {
        $tenant = Tenant::findOrFail(Auth::user()->tenant_id);

        return Inertia::render('settings/tenant', [
            'tenant' => $tenant,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the school/tenant settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $tenant = Tenant::findOrFail(Auth::user()->tenant_id);

        $validated = $request->validate([
            'school_name' => 'required|string|max:100',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('tenants', 'slug')->ignore($tenant->id),
            ],
            'status' => 'required|string|in:active,inactive',
            'address' => 'nullable|string|max:200',
        ]);

        $tenant->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('School settings updated successfully.')]);

        return to_route('tenant.edit');
    }
}
