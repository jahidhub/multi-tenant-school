<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantScopeTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_user_can_only_see_their_own_tenant_records()
    {
        $tenant1 = Tenant::create(['institute_name' => 'Tenant 1', 'slug' => 'tenant-1', 'plan' => 'basic']);
        $tenant2 = Tenant::create(['institute_name' => 'Tenant 2', 'slug' => 'tenant-2', 'plan' => 'basic']);

        // Since we mock tenant resolution by acting as a user:
        $user1 = User::factory()->create(['tenant_id' => $tenant1->id]);
        $user2 = User::factory()->create(['tenant_id' => $tenant2->id]);

        // Mock the resolved tenant in the container as the middleware would do
        app()->instance('tenant', $tenant1);

        Student::create(['tenant_id' => $tenant1->id, 'name' => 'Student One', 'admission_no' => 'A001', 'class' => '10A', 'roll_number' => 'A001', 'dob' => '2010-01-01', 'gender' => 'Male']);
        
        // Temporarily clear tenant scope to create another tenant's record, or just create without scope using DB facade
        app()->forgetInstance('tenant');
        Student::create(['tenant_id' => $tenant2->id, 'name' => 'Student Two', 'admission_no' => 'A002', 'class' => '10B', 'roll_number' => 'A002', 'dob' => '2010-01-01', 'gender' => 'Male']);

        // Authenticate User 1, bind tenant1
        $this->actingAs($user1);
        app()->instance('tenant', $tenant1);

        $students = Student::all();

        $this->assertCount(1, $students);
        $this->assertEquals('Student One', $students->first()->name);
    }
}



