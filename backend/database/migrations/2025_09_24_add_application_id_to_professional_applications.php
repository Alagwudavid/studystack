<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('professional_applications', function (Blueprint $table) {
            $table->string('application_id', 20)->unique()->after('user_id')->nullable();
        });

        // Update existing records to have application IDs
        $existingApplications = DB::table('professional_applications')->whereNull('application_id')->get();

        foreach ($existingApplications as $application) {
            $applicationId = '#' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4)) . '-' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4));

            DB::table('professional_applications')
                ->where('id', $application->id)
                ->update(['application_id' => $applicationId]);
        }

        // Make application_id NOT NULL after populating existing records
        Schema::table('professional_applications', function (Blueprint $table) {
            $table->string('application_id', 20)->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('professional_applications', function (Blueprint $table) {
            $table->dropColumn('application_id');
        });
    }
};
