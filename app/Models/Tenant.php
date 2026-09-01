<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function adminUser()
    {
        return $this->hasOne(User::class)->whereIn('role', ['admin', 'school-admin']);
    }

    public function getPlanCapAttribute()
    {
        return match ($this->plan) {
            'basic' => 200,
            'premium' => 500,
            'enterprise' => 'Unlimited',
            default => 200,
        };
    }
}
