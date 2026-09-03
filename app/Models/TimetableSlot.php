<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class TimetableSlot extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'course_id',
        'teacher_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
