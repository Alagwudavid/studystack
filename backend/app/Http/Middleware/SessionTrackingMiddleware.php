<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\SessionService;
use Illuminate\Support\Facades\Auth;

class SessionTrackingMiddleware
{
    protected $sessionService;

    public function __construct(SessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only track authenticated users
        if (Auth::check()) {
            $sessionToken = $request->header('X-Session-Token') ?? $request->bearerToken();
            
            if ($sessionToken) {
                // Update session activity
                $this->sessionService->updateSessionActivity($sessionToken);
            }
        }

        return $next($request);
    }
}
