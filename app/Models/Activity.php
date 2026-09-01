<?php

namespace App\Models;

use Spatie\Activitylog\Models\Activity as SpatieActivity;
use App\Traits\BelongsToTenant;

class Activity extends SpatieActivity
{
    use BelongsToTenant;
}
