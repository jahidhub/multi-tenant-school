<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_view_tenants()
    {
        $this->withoutVite();
        $superAdmin = User::factory()->create(['role' => 'super-admin']);
        
        $this->actingAs($superAdmin)
             ->get('/admin/tenants')
             ->assertStatus(200);
    }

    public function test_super_admin_can_create_tenant()
    {
        $this->withoutVite();
        $superAdmin = User::factory()->create(['role' => 'super-admin']);

        $response = $this->actingAs($superAdmin)
            ->post('/admin/tenants', [
                'name' => 'Greenwood High',
                'slug' => 'greenwood-high',
                'plan' => 'premium',
                'admin_name' => 'Admin User',
                'admin_email' => 'admin@greenwood.test',
                'admin_password' => 'password123',
            ]);

        $response->assertRedirect('/admin/tenants');
        
        $this->assertDatabaseHas('tenants', [
            'institute_name' => 'Greenwood High',
            'slug' => 'greenwood-high',
            'plan' => 'premium',
        ]);
    }
}


