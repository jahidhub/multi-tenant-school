<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Teacher extends Model
{
    use BelongsToTenant, \Illuminate\Database\Eloquent\SoftDeletes;

    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'name',
        'email',
        'phone',
        'subject_specialty',
        'address',
        'joining_date',
        'status',
        'profile_photo_path'
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }
}
