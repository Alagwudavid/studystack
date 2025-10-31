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
        // First, add banner_image and website to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'banner_image')) {
                $table->string('banner_image')->nullable()->after('profile_image');
            }
            if (!Schema::hasColumn('users', 'website')) {
                $table->string('website')->nullable()->after('banner_image');
            }
        });

        // Move data from onboarding to users if onboarding table exists
        if (Schema::hasTable('onboarding')) {
            // Copy banner_image and website from onboarding to users (PostgreSQL syntax)
            DB::statement('
                UPDATE users
                SET banner_image = COALESCE(o.banner_image, users.banner_image),
                    website = COALESCE(o.website, users.website)
                FROM onboarding o
                WHERE users.id = o.user_id
                AND (o.banner_image IS NOT NULL OR o.website IS NOT NULL)
            ');

            // PostgreSQL doesn't need foreign key checks to be disabled

            // Store existing onboarding data before dropping
            $existingData = DB::table('onboarding')->get();

            // Drop the onboarding table
            Schema::dropIfExists('onboarding');

            // Recreate onboarding table with reduced fields
            Schema::create('onboarding', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
                $table->enum('account_type', ['personal', 'business'])->nullable();
                $table->longText('preferences')->nullable();
                $table->timestamps();
                $table->boolean('is_completed')->default(false);
                $table->timestamp('completed_at')->nullable();
                $table->string('completion_step')->nullable();
                $table->longText('selected_interests')->nullable();
                $table->string('organization')->nullable();
                $table->string('credentials')->nullable();
                $table->string('professional_category')->nullable();
            });

            // Restore the relevant data to the new onboarding table
            foreach ($existingData as $data) {
                DB::table('onboarding')->insert([
                    'id' => $data->id,
                    'user_id' => $data->user_id,
                    'account_type' => $data->account_type,
                    'preferences' => $data->preferences,
                    'created_at' => $data->created_at,
                    'updated_at' => $data->updated_at,
                    'is_completed' => $data->is_completed ?? false,
                    'completed_at' => $data->completed_at,
                    'completion_step' => $data->completion_step,
                    'selected_interests' => $data->selected_interests,
                    'organization' => $data->organization,
                    'credentials' => $data->credentials,
                    'professional_category' => $data->professional_category,
                ]);
            }

            // PostgreSQL handles foreign keys automatically
        } else {
            // Create onboarding table if it doesn't exist
            Schema::create('onboarding', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
                $table->enum('account_type', ['personal', 'business'])->nullable();
                $table->longText('preferences')->nullable();
                $table->timestamps();
                $table->boolean('is_completed')->default(false);
                $table->timestamp('completed_at')->nullable();
                $table->string('completion_step')->nullable();
                $table->longText('selected_interests')->nullable();
                $table->string('organization')->nullable();
                $table->string('credentials')->nullable();
                $table->string('professional_category')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the old onboarding table with all fields
        Schema::dropIfExists('onboarding');

        Schema::create('onboarding', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->enum('account_type', ['personal', 'business'])->nullable();
            $table->json('tags')->nullable();
            $table->string('banner_url')->nullable();
            $table->text('bio')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();

            // Fields from second migration
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->string('completion_step')->nullable();
            $table->json('selected_interests')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('location')->nullable();
            $table->string('organization')->nullable();
            $table->string('website')->nullable();
            $table->string('credentials')->nullable();
            $table->string('professional_category')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('banner_image')->nullable();
        });

        // Move data back from users to onboarding
        DB::statement('
            INSERT INTO onboarding (user_id, banner_image, website, created_at, updated_at)
            SELECT id, banner_image, website, NOW(), NOW()
            FROM users
            WHERE banner_image IS NOT NULL OR website IS NOT NULL
        ');

        // Re-add the onboarding_id foreign key to users table if it doesn't exist
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'onboarding_id')) {
                $table->unsignedBigInteger('onboarding_id')->nullable()->after('id');
                $table->foreign('onboarding_id')->references('id')->on('onboarding')->onDelete('set null');
            }
        });

        // Remove banner_image and website from users table
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'banner_image')) {
                $table->dropColumn('banner_image');
            }
            if (Schema::hasColumn('users', 'website')) {
                $table->dropColumn('website');
            }
        });
    }
};
