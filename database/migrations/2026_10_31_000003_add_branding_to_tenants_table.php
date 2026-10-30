<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            if (!Schema::hasColumn('tenants', 'address')) {
                $table->string('address', 200)->nullable()->after('domain');
            }
            if (!Schema::hasColumn('tenants', 'logo_path')) {
                $table->string('logo_path', 500)->nullable()->after('domain');
            }
            if (!Schema::hasColumn('tenants', 'primary_color')) {
                $table->string('primary_color', 7)->nullable()->after('logo_path');
            }
            if (!Schema::hasColumn('tenants', 'tagline')) {
                $table->string('tagline', 200)->nullable()->after('primary_color');
            }

            // Unique index on domain (nullable; MySQL allows multiple NULLs)
            $indexes = collect(Schema::getIndexes('tenants'))->pluck('name')->all();
            if (!in_array('tenants_domain_unique', $indexes)) {
                $table->unique('domain');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropUnique(['domain']);
            $table->dropColumn(['logo_path', 'primary_color', 'tagline']);
        });
    }
};
