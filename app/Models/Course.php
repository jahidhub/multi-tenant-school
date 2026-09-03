<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;


use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use BelongsToTenant, SoftDeletes;
    protected $with = ['teacher'];

    protected $guarded = [];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
