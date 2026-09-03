<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',
        'date',
        'status',
        'marked_by',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function marker()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
