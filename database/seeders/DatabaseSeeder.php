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
        $tenant = Tenant::query()->find(1);
        if ($tenant) {
            $defaults = [
                ['grade' => 'A+', 'min_percentage' => 80, 'max_percentage' => 100, 'gpa_point' => 5.00],
                ['grade' => 'A', 'min_percentage' => 70, 'max_percentage' => 79, 'gpa_point' => 4.00],
                ['grade' => 'A-', 'min_percentage' => 60, 'max_percentage' => 69, 'gpa_point' => 3.50],
                ['grade' => 'B', 'min_percentage' => 50, 'max_percentage' => 59, 'gpa_point' => 3.00],
                ['grade' => 'C', 'min_percentage' => 40, 'max_percentage' => 49, 'gpa_point' => 2.00],
                ['grade' => 'D', 'min_percentage' => 33, 'max_percentage' => 39, 'gpa_point' => 1.00],
                ['grade' => 'F', 'min_percentage' => 0, 'max_percentage' => 32, 'gpa_point' => 0.00],
            ];

            foreach ($defaults as $scale) {
                $scale['tenant_id'] = $tenant->id;
                \App\Models\GradingScale::query()->firstOrCreate(
                    [
                        'tenant_id' => $tenant->id,
                        'grade' => $scale['grade']
                    ],
                    $scale
                );
            }
        }
    }
}
