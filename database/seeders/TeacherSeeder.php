<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure a default tenant exists


        // Create specific teacher
        Teacher::factory()->create([
            'tenant_id' => 1,
            'name' => 'Jahid Hassan',
            'phone' => '01989619006',
            'subject' => 'Botany'
        ]);

        // Create some random teachers

        // Teacher::factory(5)->create([
        //     'tenant_id' => $tenant->id,
        // ]);
    }
}
