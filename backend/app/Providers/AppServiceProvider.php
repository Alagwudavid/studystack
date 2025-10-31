<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SessionService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(SessionService::class, function ($app) {
            return new SessionService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
