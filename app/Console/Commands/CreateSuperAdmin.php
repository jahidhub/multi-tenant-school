<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('create:super-admin')]
#[Description('Create super admin')]

class CreateSuperAdmin extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->ask('Email');
        $password = $this->ask('Password');
        
        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'password' => Hash::make($password),
                'role' => 'super-admin', 
                'tenant_id' => null,
            ]
        );
        
        $this->info('Super admin created.');
    }
}
