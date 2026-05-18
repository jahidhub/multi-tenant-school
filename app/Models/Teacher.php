<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{

    public $timestamps = false;        

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',                  
        'subject',                    
    ];
}
