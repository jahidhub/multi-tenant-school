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
            $table->string('name', 50);
            $table->string('email', 50);
            $table->date('date_of_birth');
            $table->string('gender', 10);
            $table->string('class', 20);
            $table->string('section', 10);
            $table->string('roll_number', 20);
            $table->string('father_name', 50);
            $table->string('mother_name', 50);
            $table->string('phone_number', 50);
            $table->string('address', 100);
            $table->timestamps();
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
