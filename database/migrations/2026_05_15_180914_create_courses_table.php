<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete(); // Primary teacher
            $table->string('name', 100);
            $table->string('code', 50);
            $table->integer('credit_hours')->default(3);
            $table->string('academic_year', 50);
            $table->integer('capacity')->default(30);
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['tenant_id', 'code', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
