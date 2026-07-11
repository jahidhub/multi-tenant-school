<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => \App\Models\Tenant::factory(),
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'subject' => $this->faker->randomElement(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Botany']),
        ];
    }
}
