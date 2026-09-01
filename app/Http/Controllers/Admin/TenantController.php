<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::with('users')->latest()->paginate(10);
        
        $tenants->getCollection()->transform(function ($tenant) {
            $tenant->admin_email = $tenant->users->first()?->email ?? 'N/A';
            return $tenant;
        });

        return Inertia::render('admin/tenant/Index', [
            'tenants' => $tenants,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/tenant/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:tenants,slug',
            'domain' => 'nullable|string|max:100|unique:tenants,domain',
            'plan' => 'required|string|in:basic,premium,enterprise',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['status'] = 'active';

        DB::transaction(function () use ($validated) {
            $tenant = Tenant::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'domain' => $validated['domain'] ?? null,
                'plan' => $validated['plan'],
                'status' => $validated['status'],
            ]);

            // Ensure the BelongsToTenant trait doesn't override this by running without scope if needed, 
            // but setting tenant_id explicitly should work.
            $user = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'tenant_id' => $tenant->id,
                'role' => 'admin', // assuming you have an admin role
            ]);
            
            // If using Spatie permissions, assign role here:
            // $user->assignRole('admin');
        });

        return redirect()->route('admin.tenants.index')->with('success', 'School onboarded successfully.');
    }

    public function edit(Tenant $tenant)
    {
        $adminUser = User::query()->where('tenant_id', '=', $tenant->id)->first();

        return Inertia::render('admin/tenant/Edit', [
            'tenant' => $tenant,
            'adminUser' => $adminUser,
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $adminUser = User::query()->where('tenant_id', '=', $tenant->id)->first();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:tenants,slug,' . $tenant->id,
            'domain' => 'nullable|string|max:100|unique:tenants,domain,' . $tenant->id,
            'status' => 'required|string|in:active,suspended',
            'plan' => 'required|string|in:basic,premium,enterprise',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email' . ($adminUser ? ',' . $adminUser->id : ''),
            'admin_password' => $adminUser ? 'nullable|string|min:8' : 'required|string|min:8',
        ]);

        DB::transaction(function () use ($validated, $tenant, $adminUser) {
            $tenant->fill([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'domain' => $validated['domain'],
                'status' => $validated['status'],
                'plan' => $validated['plan'],
            ])->save();

            if ($adminUser) {
                $adminUser->name = $validated['admin_name'];
                $adminUser->email = $validated['admin_email'];
                if (!empty($validated['admin_password'])) {
                    $adminUser->password = Hash::make($validated['admin_password']);
                }
                $adminUser->save();
            } else {
                User::create([
                    'name' => $validated['admin_name'],
                    'email' => $validated['admin_email'],
                    'password' => Hash::make($validated['admin_password']),
                    'tenant_id' => $tenant->id,
                    'role' => 'admin',
                ]);
            }
        });

        return back()->with('success', 'School updated successfully.');
    }

    public function impersonate(Tenant $tenant)
    {
        $adminUser = User::query()->where('tenant_id', '=', $tenant->id)->first();
        if ($adminUser) {
            $superAdminId = \Illuminate\Support\Facades\Auth::id();
            
            \Illuminate\Support\Facades\Log::info("Impersonate START: Original ID = {$superAdminId}, Target Tenant ID = {$tenant->id}");
            
            // Log the impersonation activity
            activity()->log('Impersonated school: ' . $tenant->name);
            
            \Illuminate\Support\Facades\Auth::login($adminUser);
            
            // Store the super admin ID in session AFTER login
            session()->put('impersonate.original_user_id', $superAdminId);
            session()->save();
            
            \Illuminate\Support\Facades\Log::info("Impersonate END: Session has ID? " . session()->get('impersonate.original_user_id'));
            
            return redirect()->route('dashboard');
        }
        return back()->with('error', 'No admin user found for this school.');
    }

    public function leaveImpersonation()
    {
        $originalUserId = session()->get('impersonate.original_user_id');
        
        \Illuminate\Support\Facades\Log::info("Leave Impersonate START: Retrieved Original ID = " . ($originalUserId ?: 'NULL'));
        
        if ($originalUserId) {
            $user = User::withoutGlobalScope(\App\Models\Scopes\TenantScope::class)->find($originalUserId, ['*']);
            if ($user) {
                \Illuminate\Support\Facades\Auth::login($user);
                session()->forget('impersonate.original_user_id');
                activity()->log('Left school impersonation');
                \Illuminate\Support\Facades\Log::info("Leave Impersonate SUCCESS: Logged in as {$user->id}, redirecting to admin.dashboard");
                return redirect()->route('admin.dashboard');
            }
            \Illuminate\Support\Facades\Log::info("Leave Impersonate FAIL: User not found for ID {$originalUserId}");
        }
        
        \Illuminate\Support\Facades\Log::info("Leave Impersonate FALLBACK: Redirecting to home");
        return redirect()->route('home');
    }
}
