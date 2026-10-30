<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('create:super-admin {email?} {--name=Super Admin} {--password=}')]
#[Description('Create or update a super admin user')]
class CreateSuperAdmin extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?: $this->ask('Email');

        while (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Please provide a valid email address.');
            $email = $this->ask('Email');
        }

        $password = $this->option('password') ?: $this->ask('Password');

        while (empty($password)) {
            $this->error('Password cannot be empty.');
            $password = $this->ask('Password');
        }

        $name = $this->option('name') ?: 'Super Admin';
        if ($this->hasOption('name') && $this->option('name') === 'Super Admin' && !$this->argument('email')) {
            $askName = $this->ask('Name', 'Super Admin');
            if (!empty($askName)) {
                $name = $askName;
            }
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'super-admin',
                'tenant_id' => null,
            ]
        );

        $this->info("Super admin [{$user->email}] created successfully.");
    }
}
