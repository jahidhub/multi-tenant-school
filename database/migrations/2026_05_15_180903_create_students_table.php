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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();   
            $table->string('admission_no', 30);
            $table->string('name', 50);             
            $table->date('dob')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('guardian_name', 50)->nullable();
            $table->string('guardian_phone', 20)->nullable(); 
            $table->string('class', 20); // Class/Grade
            $table->string('status', 20)->default('active'); // active, inactive
            $table->string('profile_photo_path', 255)->nullable();
            $table->string('address', 100)->nullable(); 
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'admission_no']);
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
