<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;


use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use BelongsToTenant, SoftDeletes;
    protected $guarded = [];

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
