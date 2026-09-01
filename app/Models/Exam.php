<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Exam extends Model
{
    use BelongsToTenant;
    use HasFactory;

    protected $with = ['course'];

    protected $fillable = [
        'tenant_id',
        'course_id',
        'name',
        'exam_date',
        'max_marks',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'exam_id');
    }
}
