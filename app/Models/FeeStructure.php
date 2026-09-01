<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class FeeStructure extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'tenant_id',
        'class',
        'term',
        'amount',
        'due_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    /**
     * Get the tenant that owns the fee structure.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get the invoices generated for this fee structure.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
