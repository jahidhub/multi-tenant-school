<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Student;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_teacher_can_view_students_but_not_delete()
    {
        $tenant = Tenant::create(['name' => 'Test School', 'slug' => 'test-school', 'plan' => 'basic']);
        
        $teacher = User::factory()->create(['tenant_id' => $tenant->id]);
        
        setPermissionsTeamId($tenant->id);
        $teacher->assignRole('Teacher');

        $student = Student::create([
            'tenant_id' => $tenant->id,
            'name' => 'John Doe',
            'class' => '10A',
            'roll_number' => '1',
        ]);

        $this->actingAs($teacher);
        app()->instance('tenant', $tenant);

        // Can view (has teachers.view implicitly from Teacher role - wait, does Teacher have students.view? yes)
        $this->assertTrue($teacher->can('view', $student));
        
        // Cannot delete
        $this->assertFalse($teacher->can('delete', $student));
    }

    public function test_super_admin_can_do_anything()
    {
        $superAdmin = User::factory()->create(['role' => 'super-admin']);

        $tenant = Tenant::create(['name' => 'Test School', 'slug' => 'test-school', 'plan' => 'basic']);
        
        $student = Student::create([
            'tenant_id' => $tenant->id,
            'name' => 'Jane Doe',
            'class' => '10A',
        ]);

        $this->actingAs($superAdmin);

        $this->assertTrue($superAdmin->can('delete', $student));
    }
}
