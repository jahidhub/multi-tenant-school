<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
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

    public function update(Request $request): RedirectResponse
    {
        if (!Auth::user()->tenant_id) {
            abort(403, 'Only school administrators can update this page.');
        }

        $tenant = Tenant::findOrFail(Auth::user()->tenant_id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'nullable|string|max:200',
            'tagline' => 'nullable|string|max:200',
            'primary_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'logo' => 'nullable|image|mimes:png,jpg,svg|max:512',
            'domain' => [
                'nullable', 'string', 'max:253',
                Rule::unique('tenants', 'domain')->ignore($tenant->id),
            ],
        ]);

        if ($request->hasFile('logo')) {
            if ($tenant->logo_path) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $tenant->logo_path));
            }
            $path = $request->file('logo')->store("tenants/{$tenant->slug}/logo", 'public');
            $tenant->logo_path = Storage::url($path);
        }

        $tenant->update([
            'institute_name' => $validated['name'],
            'address' => $validated['address'] ?? null,
            'tagline' => $validated['tagline'] ?? null,
            'primary_color' => $validated['primary_color'] ?? null,
            'domain' => $validated['domain'] ?? null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('School settings updated.')]);

        return to_route('tenant.edit')->with('status', 'school-updated');
    }
}
