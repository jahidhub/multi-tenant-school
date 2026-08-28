<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $with = ['teacher'];

    protected $fillable = [
        'tenant_id',
        'teacher_id',
        'course_name',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
