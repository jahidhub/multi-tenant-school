<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // $tenant = Tenant::firstOrCreate(
        //     ['id' => 1],
        //     [
        //         'school_name' => 'Default School',
        //         'address' => 'Default Address'
        //     ]
        // );

        // User::factory()->create([
        //     'tenant_id' => $tenant->id,
        //     'name' => 'Admin',
        //     'email' => 'admin@test.com',
        //     'password' => '12345678'
        // ]);

        // Teacher::factory()->create([
        //     'tenant_id' => 1,
        //     'name' => 'Jahid Hassan',
        //     'phone' => '01989619006',
        //     'address' => 'Default Address',
        //     'subject' => 'Botany',

        // ]);

        // $this->call([
        //     TeacherSeeder::class,
        // ]);
    }
}
