<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Grade extends Model
{
    use BelongsToTenant;
    use HasFactory;

    protected $with = ['student'];

    protected $fillable = [
        'tenant_id',
        'exam_id',
        'student_id',
        'marks_obtained',
        'remarks',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
