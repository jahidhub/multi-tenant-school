<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Student;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSchools = Tenant::query()->count('*');
        $totalStudents = Student::query()->count('*');
        $totalSchoolAdmins = User::query()->whereIn('role', ['admin', 'school-admin'], 'and', false)->count('*');
        
        $activeSchools = Tenant::query()->where('status', '=', 'active')->count('*');
        $suspendedSchools = Tenant::query()->where('status', '=', 'suspended')->count('*');

        $studentsCountByTenant = Student::query()->selectRaw('tenant_id, count(*) as count')
            ->groupBy('tenant_id')
            ->pluck('count', 'tenant_id');

        $schools = Tenant::query()->with('adminUser')->get()->map(function ($tenant) use ($studentsCountByTenant) {
            $admin = $tenant->adminUser;
            return [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'plan' => $tenant->plan,
                'plan_cap' => $tenant->plan_cap,
                'status' => $tenant->status,
                'admin_email' => $admin ? $admin->email : 'N/A',
                'student_count' => $studentsCountByTenant->get($tenant->id, 0),
            ];
        });

        $registrations = Tenant::query()
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($tenant) {
                return $tenant->created_at ? $tenant->created_at->format('M Y') : 'Unknown';
            })
            ->map(function ($group, $month) {
                return [
                    'name' => $month,
                    'total' => $group->count(),
                ];
            })
            ->values();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'schools' => $totalSchools,
                'students' => $totalStudents,
                'schoolAdmins' => $totalSchoolAdmins,
                'activeSchools' => $activeSchools,
                'suspendedSchools' => $suspendedSchools,
            ],
            'schoolsData' => $schools,
            'registrationsChart' => $registrations,
        ]);
    }
}
