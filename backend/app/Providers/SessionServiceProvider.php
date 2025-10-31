<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SessionService;

class SessionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SessionService::class, function ($app) {
            return new SessionService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
