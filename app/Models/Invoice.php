<?php

namespace App\Models;

use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;


class Invoice extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'tenant_id',
        'student_id',
        'fee_structure_id',
        'amount_due',
        'amount_paid',
        'status',
        'due_date',
    ];

    protected $casts = [
        'amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'due_date' => 'date',
    ];

    // Eager load relations for easy rendering
    protected $with = ['student', 'feeStructure'];

    /**
     * Get the tenant that owns the invoice.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get the student associated with the invoice.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the fee structure template for this invoice.
     */
    public function feeStructure(): BelongsTo
    {
        return $this->belongsTo(FeeStructure::class);
    }

    /**
     * Get the payments registered to this invoice.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Helper to automatically update status based on payments and due date.
     */
    public function recalculateStatus(): void
    {
        $paid = (float) $this->amount_paid;
        $due = (float) $this->amount_due;
        $isPastDue = $this->due_date && Carbon::parse($this->due_date)->isPast();

        if ($paid >= $due) {
            $this->status = 'paid';
        } elseif ($paid > 0) {
            $this->status = $isPastDue ? 'overdue' : 'partial';
        } else {
            $this->status = $isPastDue ? 'overdue' : 'unpaid';
        }

        $this->save();
    }
}
