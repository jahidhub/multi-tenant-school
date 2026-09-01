<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions don't necessarily need to be bound to a team if they are global application permissions.
        // If team_id is enforced, we need to temporarily disable it or assign them to team null.
        // Spatie allows permissions to be team-agnostic.
        $permissions = [
            'teachers.view', 'teachers.create', 'teachers.update', 'teachers.delete',
            'students.view', 'students.create', 'students.update', 'students.delete',
            'courses.view', 'courses.create', 'courses.update', 'courses.delete',
            'enrollments.view', 'enrollments.create', 'enrollments.update', 'enrollments.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Roles need to be created per-tenant or as global if you disable teams temporarily.
        // Wait, if 'teams' => true in config, Spatie expects roles to have a team_id,
        // unless you configure it to allow global roles. 
        // For standard seeding, we can create a "School-Admin" role globally (team_id = null)
        // or just create it when a tenant is created. Let's create global templates.
        
        // Actually, if teams are enabled, Spatie will use the current team id. We should clear it.
        setPermissionsTeamId(null);
        
        $schoolAdmin = Role::firstOrCreate(['name' => 'School-Admin']);
        $schoolAdmin->syncPermissions(Permission::all());

        $teacherRole = Role::firstOrCreate(['name' => 'Teacher']);
        $teacherRole->syncPermissions([
            'students.view',
            'courses.view',
            'enrollments.view'
        ]);
    }
}
