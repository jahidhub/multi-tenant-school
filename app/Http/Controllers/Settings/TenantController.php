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
        if (!Auth::user()->tenant_id) {
            abort(403, 'Only school administrators can access this page.');
        }

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
        if (!Auth::user()->tenant_id) {
            abort(403, 'Only school administrators can update this page.');
        }

        $tenant = Tenant::findOrFail(Auth::user()->tenant_id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'nullable|string|max:200',
        ]);

        $tenant->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('School settings updated successfully.')]);

        return to_route('tenant.edit')->with('status', 'school-updated');
    }
}
