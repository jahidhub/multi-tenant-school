<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;


class Enrollment extends Model
{
    use BelongsToTenant;
    protected $with = ['student', 'course'];

    protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',
        'enrollment_date',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
