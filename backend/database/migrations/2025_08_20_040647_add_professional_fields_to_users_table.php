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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_professional')) {
                $table->boolean('is_professional')->default(false)->after('last_activity_date');
            }
            if (!Schema::hasColumn('users', 'professional_category')) {
                $table->string('professional_category')->nullable()->after('is_professional');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_professional')) {
                $table->dropColumn('is_professional');
            }
            if (Schema::hasColumn('users', 'professional_category')) {
                $table->dropColumn('professional_category');
            }
        });
    }
};
