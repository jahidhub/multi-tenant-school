<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'school_name' => ['required', 'string', 'max:100'],
        ])->validate();

        return DB::transaction(function () use ($input) {
            $slug = Str::slug($input['school_name']);
            // Make slug unique if it already exists
            $originalSlug = $slug;
            $counter = 1;
            while (Tenant::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $tenant = Tenant::create([
                'name' => $input['school_name'],
                'slug' => $slug,
                'status' => 'active',
            ]);

            // Seed default grading scales for this new tenant
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
                \App\Models\GradingScale::create($scale);
            }

            return User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'tenant_id' => $tenant->id,
                'role' => 'school-admin',
            ]);
        });
    }
}
