<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SessionService;

class CleanupExpiredSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:cleanup {--minutes=60 : Number of minutes after which sessions are considered expired}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired user sessions';

    protected $sessionService;

    public function __construct(SessionService $sessionService)
    {
        parent::__construct();
        $this->sessionService = $sessionService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $minutes = (int) $this->option('minutes');
        
        $this->info("Cleaning up sessions inactive for more than {$minutes} minutes...");
        
        $cleanedCount = $this->sessionService->cleanupExpiredSessions($minutes);
        
        $this->info("Successfully cleaned up {$cleanedCount} expired sessions.");
        
        // Also clean up old sessions (for "keep signed in" users)
        $this->info("Cleaning up old sessions (keep signed in)...");
        $oldCleanedCount = \App\Models\UserSession::cleanupOldSessions(30);
        $this->info("Successfully cleaned up {$oldCleanedCount} old sessions.");
        
        return 0;
    }
}
