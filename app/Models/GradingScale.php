<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'grade',
        'min_percentage',
        'max_percentage',
        'gpa_point',
    ];

    /**
     * Helper method to get grade details for a given percentage and tenant.
     * Fallbacks to standard scale if no tenant scale is configured.
     */
    public static function getGradeForPercentage($tenant_id, $percentage)
    {
        $scale = self::where('tenant_id', $tenant_id)
            ->where('min_percentage', '<=', $percentage)
            ->where('max_percentage', '>=', $percentage)
            ->first();

        if ($scale) {
            return $scale;
        }

        // Return a default scale fallback if the database has not been seeded yet
        if ($percentage >= 80) {
            return (object) ['grade' => 'A+', 'gpa_point' => 5.00];
        } elseif ($percentage >= 70) {
            return (object) ['grade' => 'A', 'gpa_point' => 4.00];
        } elseif ($percentage >= 60) {
            return (object) ['grade' => 'A-', 'gpa_point' => 3.50];
        } elseif ($percentage >= 50) {
            return (object) ['grade' => 'B', 'gpa_point' => 3.00];
        } elseif ($percentage >= 40) {
            return (object) ['grade' => 'C', 'gpa_point' => 2.00];
        } elseif ($percentage >= 33) {
            return (object) ['grade' => 'D', 'gpa_point' => 1.00];
        } else {
            return (object) ['grade' => 'F', 'gpa_point' => 0.00];
        }
    }
}
