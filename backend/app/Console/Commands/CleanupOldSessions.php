<?php

namespace App\Console\Commands;

use App\Models\UserSession;
use Illuminate\Console\Command;

class CleanupOldSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:cleanup-old {--days=30 : Number of days to consider sessions as old}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old sessions that are older than specified days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        
        $this->info("Cleaning up sessions older than {$days} days...");
        
        $cleanedCount = UserSession::cleanupOldSessions($days);
        
        $this->info("Cleaned up {$cleanedCount} old sessions.");
        
        return 0;
    }
} 