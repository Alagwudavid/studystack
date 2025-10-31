<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateExistingUsersUuidUsername extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-uuid-username {--dry-run : Show what would be updated without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing users with unique UUID and username';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        require_once app_path('Helpers/UserProfileHelper.php');
        
        $isDryRun = $this->option('dry-run');
        
        if ($isDryRun) {
            $this->info('DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Get users without UUID or username
        $usersToUpdate = DB::table('users')
            ->where(function ($query) {
                $query->whereNull('uuid')
                      ->orWhereNull('username')
                      ->orWhere('uuid', '')
                      ->orWhere('username', '');
            })
            ->get();

        if ($usersToUpdate->isEmpty()) {
            $this->info('No users need to be updated.');
            return Command::SUCCESS;
        }

        $this->info("Found {$usersToUpdate->count()} users to update:");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($usersToUpdate->count());
        $progressBar->start();

        $updateCount = 0;
        $errorCount = 0;

        foreach ($usersToUpdate as $user) {
            try {
                $updates = [];
                
                // Generate UUID if missing
                if (empty($user->uuid)) {
                    $updates['uuid'] = generateUniqueUserUUID();
                }
                
                // Generate username if missing
                if (empty($user->username)) {
                    $updates['username'] = generateUniqueUsername($user->email, $user->name);
                }

                if (!empty($updates)) {
                    if (!$isDryRun) {
                        $updates['updated_at'] = now();
                        DB::table('users')
                            ->where('id', $user->id)
                            ->update($updates);
                    }
                    
                    $updateCount++;
                    
                    if ($this->getOutput()->isVerbose()) {
                        $this->newLine();
                        $this->line("User ID {$user->id} ({$user->email}):");
                        if (isset($updates['uuid'])) {
                            $this->line("  UUID: {$updates['uuid']}");
                        }
                        if (isset($updates['username'])) {
                            $this->line("  Username: {$updates['username']}");
                        }
                    }
                }
                
            } catch (\Exception $e) {
                $errorCount++;
                if ($this->getOutput()->isVerbose()) {
                    $this->newLine();
                    $this->error("Error updating user ID {$user->id}: " . $e->getMessage());
                }
            }
            
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        if ($isDryRun) {
            $this->info("DRY RUN COMPLETE");
            $this->info("Would update {$updateCount} users");
        } else {
            $this->info("Successfully updated {$updateCount} users");
        }
        
        if ($errorCount > 0) {
            $this->warn("Encountered {$errorCount} errors");
        }

        return Command::SUCCESS;
    }
}
