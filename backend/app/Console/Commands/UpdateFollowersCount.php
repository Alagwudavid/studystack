<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateFollowersCount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'followers:update-count';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update followers count for all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating followers count for all users...');

        $users = User::all();
        $bar = $this->output->createProgressBar($users->count());

        foreach ($users as $user) {
            $user->updateFollowersCount();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Followers count updated successfully for all users!');

        return 0;
    }
}
