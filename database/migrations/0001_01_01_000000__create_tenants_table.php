<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();

            // Institute identity
            $table->string('institute_name', 150);
            $table->string('slug')->unique();          // derived from institute_name

            // Owner / contact
            $table->string('owner_name', 150)->nullable();
            $table->string('domain')->nullable();

            // Plan & status
            $table->string('status')->default('active');   // active | suspended
            $table->string('plan')->default('basic');      // basic | premium | enterprise

            // Flexible settings (JSON)
            $table->json('settings')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};