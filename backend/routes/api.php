<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Api\UserController;
use App\Services\SessionService;
use App\Services\NotificationService;
use App\Models\User;
use App\Models\Onboarding;
use App\Models\Interest;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CSRF Protection Helper Function
function validateCSRFHeaders(Request $request): bool {
    $csrfHeader = $request->header('X-Requested-With');
    $csrfProtection = $request->header('X-CSRF-Protection');

    // Check for CSRF protection headers
    if ($csrfHeader !== 'XMLHttpRequest' || $csrfProtection !== '1') {
        return false;
    }

    return true;
}

// JWT Helper Functions
function generateJWTToken(array $payload, int $ttlMinutes = 60): string {
    $key = env('JWT_SECRET', 'bitroot-default-secret-key-change-in-production');

    // Use current timestamp instead of Carbon to avoid any time discrepancies
    $now = time();
    $expiration = $now + ($ttlMinutes * 60);

    $tokenPayload = array_merge($payload, [
        'iat' => $now,
        'exp' => $expiration,
        'iss' => 'bitroot-api',
    ]);

    return JWT::encode($tokenPayload, $key, 'HS256');
}

function validateJWTToken(string $token): ?array {
    try {
        Log::info('JWT validation started', ['token_length' => strlen($token)]);

        // Security: Validate token format before processing
        if (empty($token) || strlen($token) > 1000) {
            Log::warning('JWT validation failed: invalid format');
            return null;
        }

        // Check for basic JWT structure (3 parts separated by dots)
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            Log::warning('JWT validation failed: not 3 parts');
            return null;
        }

        $key = env('JWT_SECRET', 'bitroot-default-secret-key-change-in-production');

        // Security: Ensure JWT secret is properly configured
        if ($key === 'bitroot-default-secret-key-change-in-production') {
            Log::warning('JWT using default secret key - security risk in production');
        }

        // Set leeway for clock skew (60 seconds)
        JWT::$leeway = 60;

        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        $payload = (array) $decoded;

        Log::info('JWT decoded successfully', ['payload' => $payload]);

        // Enhanced payload validation
        if (!isset($payload['exp']) || !isset($payload['iat'])) {
            Log::warning('JWT validation failed: missing required fields');
            return null;
        }

        // Check for magic auth tokens (different validation)
        if (isset($payload['type']) && $payload['type'] === 'magic_auth') {
            if (!isset($payload['email']) || !isset($payload['code'])) {
                Log::warning('JWT validation failed: missing magic auth fields');
                return null;
            }
        } else {
            // Regular auth tokens need user_id
            if (!isset($payload['user_id'])) {
                Log::warning('JWT validation failed: missing user_id for regular auth');
                return null;
            }
        }

        // Security: Additional expiration check
        if ($payload['exp'] < time()) {
            Log::warning('JWT validation failed: token expired', ['exp' => $payload['exp'], 'now' => time()]);
            return null;
        }

        // Security: Check token age (not too old)
        // Allow longer token age for "keep signed in" tokens (30 days)
        $maxAge = isset($payload['exp']) && ($payload['exp'] - $payload['iat']) > 86400 ? 2592000 : 86400; // 30 days vs 24 hours
        if (isset($payload['iat']) && (time() - $payload['iat']) > $maxAge) {
            Log::warning('JWT validation failed: token too old');
            return null;
        }

        Log::info('JWT validation successful');
        return $payload;
    } catch (\Exception $e) {
        // Security: Log suspicious token attempts
        Log::warning('JWT validation failed', ['error' => $e->getMessage()]);
        return null;
    }
}

function refreshJWTToken(string $token): ?string {
    $payload = validateJWTToken($token);

    if (!$payload) {
        return null;
    }

    // Remove old timestamps
    unset($payload['iat'], $payload['exp']);

    return generateJWTToken($payload);
}

function getLocationFromIP(?string $ip): string {
    if (!$ip || $ip === '127.0.0.1' || $ip === 'localhost') {
        return 'Local/Unknown Location';
    }

    // Get IP using ipify.org and location using ipapi.co
    try {
        // If IP is not provided or is local, get public IP using ipify.org
        $publicIp = $ip;
        if (!$ip || $ip === '127.0.0.1' || $ip === 'localhost' || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            $ipifyResponse = @file_get_contents('https://api.ipify.org?format=json');
            if ($ipifyResponse) {
                $ipifyData = json_decode($ipifyResponse, true);
                if ($ipifyData && isset($ipifyData['ip'])) {
                    $publicIp = $ipifyData['ip'];
                }
            }
        }

        // Get location data using ipapi.co
        if ($publicIp && $publicIp !== '127.0.0.1' && $publicIp !== 'localhost') {
            $locationResponse = @file_get_contents("https://ipapi.co/{$publicIp}/json/");
            if ($locationResponse) {
                $locationData = json_decode($locationResponse, true);
                if ($locationData && !isset($locationData['error'])) {
                    $city = $locationData['city'] ?? '';
                    $region = $locationData['region'] ?? '';
                    $country = $locationData['country_name'] ?? '';

                    if ($city && $region && $country) {
                        return "{$city}, {$region}, {$country}";
                    } elseif ($region && $country) {
                        return "{$region}, {$country}";
                    } elseif ($country) {
                        return $country;
                    }
                }
            }
        }
    } catch (\Exception $e) {
        // Log error but continue with fallback
        Log::warning('Location detection failed', ['ip' => $ip, 'error' => $e->getMessage()]);
    }

    return "Unknown Location ({$ip})";
}

// Email template generator for verification codes
function generateVerificationCodeEmailTemplate(string $code, string $timeRemaining, string $magicLinkUrl, bool $isReused): string
{
    $title = $isReused ? 'Your Bitroot Verification Code (Resent)' : 'Your Bitroot Verification Code';
    $message = $isReused ?
        "Code was resent<br>This code is still valid and will expire in {$timeRemaining}." :
        "This code will expire in {$timeRemaining}.";

    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"utf-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>{$title}</title>
    </head>
    <body style=\"margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); line-height: 1.6;\">
        <div style=\"max-width: 720px; margin: 40px auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\">
            <!-- Main Content -->
            <div style=\"padding: 24px;\">
                <!-- Header -->
                <div style=\"text-align: center; margin-bottom: 40px;\">
                    <div style=\"display: flex; margin: 0px auto;width: fit-content;\">
                        <img src=\"https://assets.bitroot.com.ng/v1/logo_512.png\" alt=\"Bitroot Logo\" style=\"width: 40px; height: 40px; margin-right: 12px;\" />
                        <h2 style=\"color: #1f2937; margin: 0 0 15px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;\">Bitroot</h2>
                    </div>
                    <div style=\"width: 60px; height: 4px; background: linear-gradient(90deg, #dc2626, #f59e0b); margin: 0 auto; border-radius: 2px;\"></div>
                </div>

                <!-- Enhanced info box with better styling -->
                <div style=\"background: linear-gradient(135deg, #fef7f0 0%, #fef3ec 100%); border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;\">
                    <div style=\"color: #6b7280; line-height: 1.7; font-size: 16px; text-align: center;\">
                        <h3 style=\"color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;\">Verification Code</h3>
                        <p style=\"margin: 10px 0; font-size: 18px;\">{$message}</p>

                        <div style=\"background: #ffffff; border: 2px solid #dc2626; border-radius: 8px; padding: 12px; margin: 20px 0; display: inline-block;\">
                            <div style=\"font-size: 24px; font-weight: bold; color: #dc2626; letter-spacing: 8px; font-family: 'Sans Serif', monospace;\">{$code}</div>
                        </div>
                        <div style=\"margin: 20px 0;\">
                            <a href=\"{$magicLinkUrl}\" style=\"display: inline-block; background: #dc2626; color: white; padding: 8px 12px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background-color 0.2s;\">Verify</a>
                        </div>

                        <p style=\"margin: 16px 0; font-size: 14px; color: #9ca3af;\">If you didn't request this code, please ignore this email.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style=\"text-align: center;\">
                    <div style=\"margin: 20px 0;\">
                        <p style=\"color: #dc2626; margin: 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;\">The Bitroot Team</p>
                        <div style=\"width: 40px; height: 2px; background: #dc2626; margin: 8px auto; border-radius: 1px;\"></div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>";
}

// Simple test route (development only)
Route::get('/simple-test', function () {
    if (env('APP_ENV') !== 'local') {
        return response()->json(['error' => 'Test endpoint only available in local environment'], 403);
    }
    return response()->json(['message' => 'Simple test working']);
});

// CORS test endpoint - available in all environments for debugging
Route::get('/cors-test', function (Request $request) {
    return response()->json([
        'message' => 'CORS test successful',
        'origin' => $request->header('Origin'),
        'host' => $request->header('Host'),
        'method' => $request->method(),
        'timestamp' => now(),
        'environment' => env('APP_ENV'),
        'app_url' => env('APP_URL'),
        'frontend_url' => env('FRONTEND_URL'),
        'cors_config' => [
            'allowed_origins' => config('cors.allowed_origins'),
            'allowed_patterns' => config('cors.allowed_origins_patterns'),
            'supports_credentials' => config('cors.supports_credentials'),
        ]
    ]);
});

Route::options('/cors-test', function () {
    return response('', 200);
});

// Test session creation route (mock) - development only
Route::post('/test-session-create-mock', function () {
    if (env('APP_ENV') !== 'local') {
        return response()->json(['error' => 'Test endpoint only available in local environment'], 403);
    }

    $request = request();

    // Simulate session creation without database
    $sessionToken = 'mock_session_' . uniqid() . '_' . time();

    return response()->json([
        'success' => true,
        'message' => 'Mock session created successfully',
        'session_id' => rand(1000, 9999),
        'session_token' => $sessionToken,
        'note' => 'This is a mock session - database connection unavailable'
    ]);
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now(),
        'service' => 'Bitroot API',
    ]);
});

// Auth routes with rate limiting and security
Route::prefix('auth')->middleware(['throttle:60,1'])->group(function () {
    // Request verification code (with database integration and rate limiting)
    Route::post('/request-code', function (Request $request) {
        // CSRF Protection
        if (!validateCSRFHeaders($request)) {
            return response()->json([
                'success' => false,
                'message' => 'CSRF validation failed',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email format',
                'errors' => $validator->errors()
            ], 422);
        }

        // Sanitize and validate email input
        $email = filter_var(trim($request->email), FILTER_SANITIZE_EMAIL);
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);

        if (!$email) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email address',
            ], 422);
        }

        // Check for existing valid codes for this email first
        $existingCode = DB::table('verification_codes')
            ->where('email', $email)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->first();

        $code = null;
        $isReused = false;

        if ($existingCode) {
            // Reuse existing valid code
            $code = $existingCode->code;
            $isReused = true;
            $expiresAt = $existingCode->expires_at;
        } else {
            // Delete any existing expired codes for this email using raw SQL
            DB::table('verification_codes')
                ->where('email', $email)
                ->whereNull('used_at')
                ->delete();

            // Generate new verification code
            $code = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6);
            $expiresAt = now()->addMinutes(10);

            // Create verification code record using raw SQL
            DB::table('verification_codes')->insert([
                'email' => $email,
                'code' => $code,
                'expires_at' => $expiresAt,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Send email with verification code
        $emailSent = false;
        $emailError = null;
        $magicToken = null;

        // Generate secure magic link token for this verification
        if ($code) {
            // Create a secure, signed JWT token for magic authentication
            $magicPayload = [
                'email' => $email,
                'code' => $code,
                'type' => 'magic_auth',
                'nonce' => uniqid('', true), // Unique identifier for one-time use
            ];

            $magicToken = generateJWTToken($magicPayload, 30); // 30 minutes for testing

            // Store magic token in database for one-time use validation
            DB::table('magic_tokens')->insert([
                'token' => hash('sha256', $magicToken), // Store hash for security
                'email' => $email,
                'code' => $code,
                'used_at' => null,
                'expires_at' => now()->addMinutes(30),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        try {
            $emailSubject = $isReused ? 'Your Bitroot Verification Code (Resent)' : 'Your Bitroot Verification Code';
            $timeRemaining = $isReused ?
                now()->diffInMinutes($expiresAt) . ' minutes' :
                '10 minutes';

            // Create secure magic link URL (no email or code exposed)
            $protocol = env('APP_ENV', 'local') === 'production' ? 'https' : 'http';
            $frontendUrl = env('FRONTEND_URL', $protocol . '://localhost:3000');
            $magicLinkUrl = $frontendUrl . "/auth/magic?token=" . urlencode($magicToken);

            $emailBody = $isReused ?
                "Your existing Bitroot verification code is: {$code}\n\nThis code is still valid and will expire in {$timeRemaining}.\n\nOr click the link below to sign in:\n{$magicLinkUrl}\n\nIf you didn't request this code, please ignore this email." :
                "Your Bitroot verification code is: {$code}\n\nThis code will expire in {$timeRemaining}.\n\nOr click the link below to sign in:\n{$magicLinkUrl}\n\nIf you didn't request this code, please ignore this email.";

            $htmlContent = generateVerificationCodeEmailTemplate($code, $timeRemaining, $magicLinkUrl, $isReused);

            Mail::raw($emailBody, function ($message) use ($email, $emailSubject, $htmlContent) {
                $message->to($email)
                        ->subject($emailSubject)
                        ->html($htmlContent);
            });
            $emailSent = true;
        } catch (\Exception $e) {
            $emailError = $e->getMessage();
        }

        // Response based on email success and environment
        if ($emailSent) {
            $message = $isReused ?
                'Your existing verification code has been resent to your email' :
                'Verification code sent to your email';

            return response()->json([
                'success' => true,
                'message' => $message,
                'code_reused' => $isReused,
                'expires_at' => $expiresAt,
                'magic_token' => $magicToken,
            ]);
        } else {
            // In development, return the code if email fails
            if (env('APP_ENV') === 'local' || env('APP_DEBUG') === true) {
                return response()->json([
                    'success' => true,
                    'message' => 'Verification code generated (email sending failed)',
                    'code_reused' => $isReused,
                    'magic_token' => $magicToken,
                    'debug' => [
                        'email' => $email,
                        'code' => $code,
                        'expires_at' => $expiresAt,
                        'email_error' => $emailError,
                        'magic_link' => env('FRONTEND_URL', 'http://localhost:3000') . "/auth/magic?token=" . urlencode($magicToken),
                        'note' => 'Code provided for development - in production, only email would be sent'
                    ],
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send verification code. Please try again.',
                ], 500);
            }
        }
    });

    // Verify code (with database integration)
    Route::post('/verify-code', function (Request $request) {
        // CSRF Protection
        if (!validateCSRFHeaders($request)) {
            return response()->json([
                'success' => false,
                'message' => 'CSRF validation failed',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'keepSignedIn' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        // Sanitize and validate inputs
        $email = filter_var(trim($request->email), FILTER_SANITIZE_EMAIL);
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        $code = strtoupper(trim(preg_replace('/[^A-Z0-9]/', '', $request->code)));

        if (!$email || strlen($code) !== 6) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or verification code format',
            ], 422);
        }

        // Find valid verification code using raw SQL
        $verificationCode = DB::table('verification_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->whereNull('used_at')
            ->first();

        if (!$verificationCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code',
            ], 401);
        }

        // Mark code as used
        DB::table('verification_codes')
            ->where('id', $verificationCode->id)
            ->update([
                'used_at' => now(),
                'updated_at' => now(),
            ]);

        // Find or create user using raw SQL
        $user = DB::table('users')->where('email', $email)->first();
        $isNewUser = false;

        if (!$user) {
            // Load helper functions
            require_once app_path('Helpers/UserProfileHelper.php');

            // Generate unique UUID and username for new user
            $uuid = generateUniqueUserUUID();
            $username = generateUniqueUsername($email, explode('@', $email)[0]);

            // Create new user if doesn't exist
            $userId = DB::table('users')->insertGetId([
                'name' => explode('@', $email)[0], // Use email prefix as default name
                'email' => $email,
                'uuid' => $uuid,
                'username' => $username,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $user = DB::table('users')->where('id', $userId)->first();
            $isNewUser = true;
        } else {
            // Update email verification if not already verified
            if (!$user->email_verified_at) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'email_verified_at' => now(),
                        'updated_at' => now(),
                    ]);

                $user = DB::table('users')->where('id', $user->id)->first();
            }
        }

        // Associate verification code with user
        DB::table('verification_codes')
            ->where('id', $verificationCode->id)
            ->update([
                'user_id' => $user->id,
                'updated_at' => now(),
            ]);

        // Create user session with enhanced device fingerprinting
        require_once app_path('Helpers/DatabaseDeviceSessionManager.php');
        $sessionResult = DatabaseDeviceSessionManager::createSession($request, $user->id);

        $sessionData = $sessionResult['session_data'];
        $sessionId = $sessionResult['session_id'];
        $deviceManagement = $sessionResult['device_management'];

        // Determine token duration based on keepSignedIn preference
        $keepSignedIn = $request->input('keepSignedIn', false);
        $tokenDuration = $keepSignedIn ? 43200 : 60; // 30 days vs 1 hour (in minutes)

        // Generate JWT token with session token
        $jwtToken = generateJWTToken([
            'user_id' => $user->id,
            'email' => $user->email,
            'session_token' => $sessionData['session_token'],
        ], $tokenDuration);

        // Send notifications asynchronously
        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();

        // Send welcome notification for new users
        if ($isNewUser) {
            $notificationService->sendWelcomeNotification($user->id);
        }

        // Send login alert notification
        $notificationSessionData = [
            'id' => $sessionId,
            'session_token' => $sessionData['session_token'],
            'device_type' => $sessionData['device_characteristics']['device_type'],
            'device_name' => $sessionData['device_characteristics']['device_name'],
            'browser' => $sessionData['device_characteristics']['browser'],
            'operating_system' => $sessionData['device_characteristics']['operating_system'],
            'ip_address' => $sessionData['ip_address'],
            'location' => $sessionData['device_characteristics']['location'],
            'logged_in_at' => now(),
        ];

        $notificationService->sendLoginAlert($user->id, $notificationSessionData);

        // Create response with user data only (token managed via HttpOnly cookies)
        $response = response()->json([
            'success' => true,
            'message' => 'Authentication successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'uuid' => $user->uuid ?? null,
                    'username' => $user->username ?? null,
                    'email_verified_at' => $user->email_verified_at,
                    'profile_image' => $user->profile_image,
                    'bio' => $user->bio,
                    'points' => $user->points ?? 0,
                    'level' => $user->level ?? 1,
                    'streak_count' => $user->streak_count ?? 0,
                    'last_activity_date' => $user->last_activity_date,
                    'is_professional' => $user->is_professional ?? false,
                    'professional_category' => $user->professional_category,
                    'is_onboarded_status' => $user->is_onboarded_status ?? 'incomplete',
                    'date_of_birth' => $user->date_of_birth,
                    'location' => $user->location,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'is_new_user' => $isNewUser,
                ],
                'token' => $jwtToken, // Include token for server action to set cookie manually
                'session' => [
                    'id' => $sessionId,
                    'device_type' => $sessionData['device_characteristics']['device_type'],
                    'browser' => $sessionData['device_characteristics']['browser'],
                    'operating_system' => $sessionData['device_characteristics']['operating_system'],
                ],
                'notifications' => [
                    'welcome_sent' => $isNewUser,
                    'login_alert_sent' => true,
                ],
                'redirect_to' => $isNewUser && $user->username ? '/@' . $user->username : '/home',
            ],
        ]);

        // Set HttpOnly authentication cookie and client-accessible token for API calls
        $maxAge = $keepSignedIn ? (60 * 60 * 24 * 30) : (60 * 60 * 24 * 7); // 30 days vs 7 days
        $isSecure = env('APP_ENV') === 'production';

        // Set HTTP-only cookie for server-side authentication
        $response->cookie('auth_token', $jwtToken, $maxAge, '/', null, $isSecure, true, false, 'lax');

        // Also set client-accessible token for API calls
        $response->cookie('client_auth_token', $jwtToken, $maxAge, '/', null, $isSecure, false, false, 'lax');

        return $response;
    });

    // Secure Magic Link Authentication (GET endpoint for direct link access)
    Route::get('/magic/{token}', function (Request $request, $token) {
        try {
            Log::info('Magic link authentication attempt', [
                'token_preview' => substr($token, 0, 20) . '...',
                'token_length' => strlen($token),
                'full_token' => $token
            ]);

            // Validate JWT magic token
            $payload = validateJWTToken($token);
            Log::info('Magic token validation result', ['payload' => $payload]);

            if (!$payload || !isset($payload['type']) || $payload['type'] !== 'magic_auth') {
                Log::warning('Invalid magic token payload', ['payload' => $payload]);
                return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/auth?error=invalid_token');
            }

            // Check if magic token has been used (one-time use protection)
            $tokenHash = hash('sha256', $token);
            $magicToken = DB::table('magic_tokens')
                ->where('token', $tokenHash)
                ->where('expires_at', '>', now())
                ->whereNull('used_at')
                ->first();

            if (!$magicToken) {
                Log::warning('Magic token not found or already used');
                return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/auth?error=token_expired');
            }

            // Mark token as used (one-time use)
            DB::table('magic_tokens')
                ->where('id', $magicToken->id)
                ->update([
                    'used_at' => now(),
                    'updated_at' => now(),
                ]);

            $email = $payload['email'];
            $code = $payload['code'];

            // Validate verification code exists and is unused
            $verificationCode = DB::table('verification_codes')
                ->where('email', $email)
                ->where('code', $code)
                ->where('expires_at', '>', now())
                ->whereNull('used_at')
                ->first();

            if (!$verificationCode) {
                Log::warning('Verification code not found or expired for magic auth');
                return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/auth?error=code_expired');
            }

            // Mark verification code as used
            DB::table('verification_codes')
                ->where('id', $verificationCode->id)
                ->update([
                    'used_at' => now(),
                    'updated_at' => now(),
                ]);

            // Find or create user
            $user = DB::table('users')->where('email', $email)->first();
            $isNewUser = false;

            if (!$user) {
                require_once app_path('Helpers/UserProfileHelper.php');

                $uuid = generateUniqueUserUUID();
                $username = generateUniqueUsername($email, explode('@', $email)[0]);

                $userId = DB::table('users')->insertGetId([
                    'name' => explode('@', $email)[0],
                    'email' => $email,
                    'uuid' => $uuid,
                    'username' => $username,
                    'email_verified_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $user = DB::table('users')->where('id', $userId)->first();
                $isNewUser = true;
            } else if (!$user->email_verified_at) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'email_verified_at' => now(),
                        'updated_at' => now(),
                    ]);
                $user = DB::table('users')->where('id', $user->id)->first();
            }

            // Create user session with enhanced device fingerprinting
            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');
            $sessionResult = DatabaseDeviceSessionManager::createSession($request, $user->id);

            $sessionData = $sessionResult['session_data'];
            $sessionId = $sessionResult['session_id'];
            $sessionToken = $sessionData['session_token'];

            // Generate JWT token with long expiration for magic login
            $jwtToken = generateJWTToken([
                'user_id' => $user->id,
                'email' => $user->email,
                'session_token' => $sessionToken,
            ], 43200); // 30 days for magic login (convenience)

            // Send notifications
            require_once app_path('Services/NotificationService.php');
            $notificationService = new \App\Services\NotificationService();

            if ($isNewUser) {
                $notificationService->sendWelcomeNotification($user->id);
            }

            $sessionDataForNotification = [
                'id' => $sessionId,
                'session_token' => $sessionToken,
                'device_type' => $sessionData['device_characteristics']['device_type'],
                'device_name' => $sessionData['device_characteristics']['device_name'],
                'browser' => $sessionData['device_characteristics']['browser'],
                'operating_system' => $sessionData['device_characteristics']['operating_system'],
                'ip_address' => $request->ip() ?? '127.0.0.1',
                'logged_in_at' => now(),
                'location' => $sessionData['device_characteristics']['location'] ?? getLocationFromIP($request->ip()),
            ];

            $notificationService->sendLoginAlert($user->id, $sessionDataForNotification);

            // Set auth cookies and redirect
            $protocol = env('APP_ENV', 'local') === 'production' ? 'https' : 'http';
            $frontendUrl = env('FRONTEND_URL', $protocol . '://localhost:3000');
            $response = redirect($isNewUser && $user->username ?
                $frontendUrl . '/@' . $user->username :
                $frontendUrl . '/home'
            );

            // Set secure HttpOnly cookie and client-accessible token
            $maxAge = 60 * 60 * 24 * 30; // 30 days
            $isSecure = env('APP_ENV') === 'production';

            // For local development, don't set domain so cookies work across localhost ports
            $cookieDomain = env('APP_ENV') === 'production' ? '.bitroot.com' : null;

            $response->cookie('auth_token', $jwtToken, $maxAge, '/', $cookieDomain,
                $isSecure, true, false, 'lax');

            // Also set client-accessible token for API calls
            $response->cookie('client_auth_token', $jwtToken, $maxAge, '/', $cookieDomain,
                $isSecure, false, false, 'lax');

            Log::info('Magic link authentication successful', [
                'user_id' => $user->id,
                'jwt_token_length' => strlen($jwtToken),
                'is_secure' => $isSecure,
                'max_age' => $maxAge,
                'cookie_domain' => $cookieDomain,
                'setting_cookies' => [
                    'auth_token' => 'httpOnly=true',
                    'client_auth_token' => 'httpOnly=false'
                ]
            ]);
            return $response;

        } catch (\Exception $e) {
            Log::error('Magic link authentication error', ['error' => $e->getMessage()]);
            $protocol = env('APP_ENV', 'local') === 'production' ? 'https' : 'http';
            $frontendUrl = env('FRONTEND_URL', $protocol . '://localhost:3000');
            return redirect($frontendUrl . '/auth?error=auth_failed');
        }
    });

    // Magic link authentication
    Route::post('/magic-login', function (Request $request) {
        // CSRF Protection
        if (!validateCSRFHeaders($request)) {
            return response()->json([
                'success' => false,
                'message' => 'CSRF validation failed',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'auth_token' => 'required|string',
            'session_id' => 'sometimes|string',
            'keepSignedIn' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        // Sanitize and validate inputs
        $email = filter_var(trim($request->email), FILTER_SANITIZE_EMAIL);
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        $code = strtoupper(trim(preg_replace('/[^A-Z0-9]/', '', $request->code)));
        $authToken = trim($request->auth_token);

        if (!$email || strlen($code) !== 6 || !$authToken) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email, verification code format, or auth token',
            ], 422);
        }

        // Validate magic token format and extract data
        if (!str_starts_with($authToken, 'magic_')) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid magic link token',
            ], 401);
        }

        // Extract and validate token data
        $tokenData = substr($authToken, 6); // Remove 'magic_' prefix
        $tokenParts = explode('_', $tokenData);
        if (count($tokenParts) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid magic link token format',
            ], 401);
        }

        $encodedData = $tokenParts[0];
        $decodedData = base64_decode($encodedData);
        if (!$decodedData) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid magic link token encoding',
            ], 401);
        }

        $dataParts = explode('|', $decodedData);
        if (count($dataParts) !== 3) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid magic link token data',
            ], 401);
        }

        [$tokenEmail, $tokenCode, $tokenTimestamp] = $dataParts;

        // Validate token matches request
        if ($tokenEmail !== $email || $tokenCode !== $code) {
            return response()->json([
                'success' => false,
                'message' => 'Magic link token does not match request data',
            ], 401);
        }

        // Check if token is not too old (60 minutes)
        $tokenAge = time() - (int)$tokenTimestamp;
        if ($tokenAge > 3600) {
            return response()->json([
                'success' => false,
                'message' => 'Magic link has expired',
            ], 401);
        }

        // Find valid verification code using raw SQL
        $verificationCode = DB::table('verification_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->whereNull('used_at')
            ->first();

        if (!$verificationCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code',
            ], 401);
        }

        // Mark code as used
        DB::table('verification_codes')
            ->where('id', $verificationCode->id)
            ->update([
                'used_at' => now(),
                'updated_at' => now(),
            ]);

        // Find or create user using raw SQL (same logic as verify-code)
        $user = DB::table('users')->where('email', $email)->first();
        $isNewUser = false;

        if (!$user) {
            // Load helper functions
            require_once app_path('Helpers/UserProfileHelper.php');

            // Generate unique UUID and username for new user
            $uuid = generateUniqueUserUUID();
            $username = generateUniqueUsername($email, explode('@', $email)[0]);

            // Create new user if doesn't exist
            $userId = DB::table('users')->insertGetId([
                'name' => explode('@', $email)[0], // Use email prefix as default name
                'email' => $email,
                'uuid' => $uuid,
                'username' => $username,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $user = DB::table('users')->where('id', $userId)->first();
            $isNewUser = true;
        } else {
            // Update email verification if not already verified
            if (!$user->email_verified_at) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'email_verified_at' => now(),
                        'updated_at' => now(),
                    ]);

                $user = DB::table('users')->where('id', $user->id)->first();
            }
        }

        // Associate verification code with user
        DB::table('verification_codes')
            ->where('id', $verificationCode->id)
            ->update([
                'user_id' => $user->id,
                'updated_at' => now(),
            ]);

        // Create user session with enhanced device fingerprinting
        require_once app_path('Helpers/DatabaseDeviceSessionManager.php');
        $sessionResult = DatabaseDeviceSessionManager::createSession($request, $user->id);

        $sessionData = $sessionResult['session_data'];
        $sessionId = $sessionResult['session_id'];
        $sessionToken = $sessionData['session_token'];

        // Determine token duration based on keepSignedIn preference
        $keepSignedIn = $request->input('keepSignedIn', false);
        $tokenDuration = $keepSignedIn ? 43200 : 60; // 30 days vs 1 hour (in minutes)

        // Generate JWT token with session token
        $jwtToken = generateJWTToken([
            'user_id' => $user->id,
            'email' => $user->email,
            'session_token' => $sessionToken,
        ], $tokenDuration);

        // Send notifications asynchronously
        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();

        // Send welcome notification for new users
        if ($isNewUser) {
            $notificationService->sendWelcomeNotification($user->id);
        }

        // Send login alert notification
        $sessionDataForNotification = [
            'id' => $sessionId,
            'session_token' => $sessionToken,
            'device_type' => $sessionData['device_characteristics']['device_type'],
            'device_name' => $sessionData['device_characteristics']['device_name'],
            'browser' => $sessionData['device_characteristics']['browser'],
            'operating_system' => $sessionData['device_characteristics']['operating_system'],
            'ip_address' => $request->ip() ?? '127.0.0.1',
            'logged_in_at' => now(),
            'location' => $sessionData['device_characteristics']['location'] ?? getLocationFromIP($request->ip()),
        ];

        $notificationService->sendLoginAlert($user->id, $sessionDataForNotification);

        return response()->json([
            'success' => true,
            'message' => 'Magic link authentication successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'uuid' => $user->uuid ?? null,
                    'username' => $user->username ?? null,
                    'email_verified_at' => $user->email_verified_at,
                    'is_onboarded_status' => $user->is_onboarded_status ?? 'incomplete',
                    'is_new_user' => $isNewUser,
                ],
                'token' => $jwtToken,
                'token_type' => 'bearer',
                'expires_in' => $keepSignedIn ? 2592000 : 3600, // 30 days vs 1 hour (in seconds)
                'session' => [
                    'id' => $sessionId,
                    'session_token' => $sessionToken,
                    'device_type' => $sessionData['device_characteristics']['device_type'],
                    'browser' => $sessionData['device_characteristics']['browser'],
                    'operating_system' => $sessionData['device_characteristics']['operating_system'],
                ],
                'notifications' => [
                    'welcome_sent' => $isNewUser,
                    'login_alert_sent' => true,
                ],
                'magic_login' => true,
            ],
        ]);
    });

    // Get profile (with JWT validation)
    Route::get('/profile', function (Request $request) {
        try {
            $token = null;
            $payload = null;

            // Try to extract JWT token from Authorization header first
            $authHeader = $request->header('Authorization');
            Log::info('Profile endpoint accessed', [
                'auth_header_present' => !empty($authHeader),
                'cookies_present' => !empty($request->cookies->all())
            ]);

            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7); // Remove "Bearer " prefix
                Log::info('Profile endpoint: Token extracted from header', ['token_length' => strlen($token)]);
                $payload = validateJWTToken($token);
            }

            // Fallback: Try to get token from cookies if no valid Bearer token
            if (!$payload) {
                // Check client_auth_token cookie (client-accessible)
                $cookieToken = $request->cookie('client_auth_token') ?? $request->cookie('auth_token');

                if ($cookieToken) {
                    Log::info('Profile endpoint: Token extracted from cookie', ['token_length' => strlen($cookieToken)]);
                    $payload = validateJWTToken($cookieToken);
                    $token = $cookieToken;
                }
            }

            if (!$payload) {
                Log::warning('Profile endpoint: No valid token found');
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required - no valid token found',
                ], 401);
            }

            Log::info('Profile endpoint: Token validated', ['user_id' => $payload['user_id']]);

            // Try to get user from database
            try {
                $user = DB::table('users')->where('id', $payload['user_id'])->first();
                Log::info('Profile endpoint: User lookup', ['user_found' => !empty($user), 'user_id' => $payload['user_id']]);

                if (!$user) {
                    // Create a mock user response to unblock the flow when user doesn't exist
                    Log::warning('Profile endpoint: User not found, creating mock response');
                    return response()->json([
                        'success' => true,
                        'message' => 'Profile retrieved successfully (mock)',
                        'data' => [
                            'id' => $payload['user_id'],
                            'name' => 'Test User',
                            'email' => $payload['email'] ?? 'test@example.com',
                            'email_verified_at' => now(),
                            'profile_completion_status' => 'incomplete',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Profile retrieved successfully',
                    'data' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                        'username' => $user->username ?? null,
                        'bio' => $user->bio ?? null,
                        'profile_image' => $user->profile_image ?? null,
                        'banner_image' => $user->banner_image ?? null,
                        'date_of_birth' => $user->date_of_birth ?? null,
                        'location' => $user->location ?? null,
                        'profile_completion_status' => $user->profile_completion_status ?? 'incomplete',
                        'is_onboarded_status' => $user->is_onboarded_status ?? 'incomplete',
                        'is_professional' => $user->is_professional ?? false,
                        'professional_category' => $user->professional_category ?? null,
                        'points' => $user->points ?? 0,
                        'level' => $user->level ?? 1,
                        'streak_count' => $user->streak_count ?? 0,
                        'followers_count' => $user->followers_count ?? 0,
                        'last_activity_date' => $user->last_activity_date ?? null,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                ]);
            } catch (\Exception $dbError) {
                Log::error('Profile endpoint: Database error', ['error' => $dbError->getMessage()]);
                // Return mock user when DB is down
                return response()->json([
                    'success' => true,
                    'message' => 'Profile retrieved successfully (mock - DB error)',
                    'data' => [
                        'id' => $payload['user_id'],
                        'name' => 'Test User',
                        'email' => $payload['email'] ?? 'test@example.com',
                        'email_verified_at' => now(),
                        'profile_completion_status' => 'incomplete',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Profile endpoint error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
            ], 500);
        }
    });

    // Test route to generate JWT token (for debugging) - development only
    Route::post('/generate-token-test', function (Request $request) {
        if (env('APP_ENV') !== 'local') {
            return response()->json(['error' => 'Test endpoint only available in local environment'], 403);
        }

        $userId = $request->input('user_id', 1);
        $email = $request->input('email', 'test@example.com');

        $payload = [
            'user_id' => $userId,
            'email' => $email
        ];

        $token = generateJWTToken($payload);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user_id' => $userId,
            'email' => $email
        ]);
    });

    // Logout - Comprehensive session and token cleanup
    Route::post('/logout', function (Request $request) {
        try {
            $userId = null;
            $sessionToken = null;
            $jwtToken = null;

            // Extract JWT token from Authorization header
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $jwtToken = substr($authHeader, 7);
                $payload = validateJWTToken($jwtToken);

                if ($payload) {
                    $userId = $payload['user_id'] ?? null;
                    $sessionToken = $payload['session_token'] ?? null;
                }
            }

            // If we have session data, terminate all user sessions to ensure complete logout
            if ($userId) {
                // Mark all active sessions for this user as inactive and offline
                DB::table('user_sessions')
                    ->where('user_id', $userId)
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'status' => 'offline',
                        'logged_out_at' => now(),
                        'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                        'updated_at' => now(),
                    ]);

                // Clear any stored CSRF tokens for this user (if you're storing them)
                // You can add CSRF token cleanup logic here if needed

                // Optional: Invalidate all verification codes for this user's email
                $user = DB::table('users')->where('id', $userId)->first();
                if ($user && $user->email) {
                    DB::table('verification_codes')
                        ->where('email', $user->email)
                        ->whereNull('used_at')
                        ->update(['used_at' => now()]);
                }

                Log::info('User logged out successfully', [
                    'user_id' => $userId,
                    'session_token' => $sessionToken,
                    'logout_time' => now(),
                ]);
            }

            // Create response that clears all auth-related cookies
            $response = response()->json([
                'success' => true,
                'message' => 'Successfully logged out and all sessions terminated',
                'data' => [
                    'sessions_terminated' => true,
                    'tokens_cleared' => true,
                    'redirect_to' => '/auth'
                ]
            ]);

            // Clear authentication cookie
            $response->cookie('auth_token', '', -1, '/', null, false, true);
            $response->cookie('session_token', '', -1, '/', null, false, true);
            $response->cookie('csrf_token', '', -1, '/', null, false, false);

            return $response;

        } catch (Exception $e) {
            Log::error('Logout error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Even if there's an error, clear cookies and return success
            // to ensure user is logged out on frontend
            $response = response()->json([
                'success' => true,
                'message' => 'Logged out (with cleanup errors)',
                'data' => [
                    'sessions_terminated' => false,
                    'tokens_cleared' => true,
                    'redirect_to' => '/auth'
                ]
            ]);

            // Clear cookies even on error
            $response->cookie('auth_token', '', -1, '/', null, false, true);
            $response->cookie('session_token', '', -1, '/', null, false, true);
            $response->cookie('csrf_token', '', -1, '/', null, false, false);

            return $response;
        }
    });

    // Refresh JWT token
    Route::post('/refresh', function (Request $request) {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $newToken = refreshJWTToken($token);

        if (!$newToken) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => 3600,
            ],
        ]);
    });

    // Sync authentication tokens between httpOnly and client-accessible cookies
    Route::post('/sync-token', function (Request $request) {
        try {
            Log::info('Sync-token endpoint called', [
                'cookies' => $request->cookies->all(),
                'headers' => $request->headers->all()
            ]);

            // Try to get the auth token from httpOnly cookie
            $authToken = $request->cookie('auth_token');

            Log::info('Sync-token: auth_token from cookie', [
                'has_token' => !empty($authToken),
                'token_length' => $authToken ? strlen($authToken) : 0
            ]);

            if (!$authToken) {
                Log::warning('Sync-token: No auth_token cookie found');
                return response()->json([
                    'success' => false,
                    'message' => 'No authentication token found',
                ], 401);
            }

            // Validate the token
            $payload = validateJWTToken($authToken);
            Log::info('Sync-token: token validation result', [
                'valid' => !empty($payload),
                'payload' => $payload
            ]);

            if (!$payload) {
                Log::warning('Sync-token: Token validation failed');
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token',
                ], 401);
            }

            // Set the client-accessible token cookie so JavaScript can access it for API calls
            $maxAge = 60 * 60 * 24 * 30; // 30 days to match the original token
            $isSecure = env('APP_ENV') === 'production';

            $response = response()->json([
                'success' => true,
                'message' => 'Token synchronized successfully',
            ]);

            // Set client-accessible token for API calls
            $response->cookie('client_auth_token', $authToken, $maxAge, '/', null,
                $isSecure, false, false, 'lax');

            Log::info('Sync-token: Successfully set client_auth_token cookie');
            return $response;

        } catch (\Exception $e) {
            Log::error('Token sync error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync token',
            ], 500);
        }
    });
});

// Profile management routes
Route::prefix('profile')->middleware(['throttle:30,1'])->group(function () {
    // Check username availability
    Route::get('/check-username', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:30|regex:/^[a-zA-Z0-9_-]+$/|not_regex:/^[_-]/|not_regex:/[_-]$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username format',
                'errors' => $validator->errors()
            ], 422);
        }

        $username = $request->username;

        // Check if username exists (case-insensitive)
        $exists = DB::table('users')
            ->whereRaw('LOWER(username) = ?', [strtolower($username)])
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'username' => $username,
                'available' => !$exists,
                'message' => $exists ? 'Username is already taken' : 'Username is available'
            ]
        ]);
    });
    // Update user profile
    Route::put('/update', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:50|unique:users,username,' . $payload['user_id'],
            'bio' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|before:today',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];

            if ($request->has('name') && $request->name !== null) {
                $updateData['name'] = $request->name;
            }

            if ($request->has('username') && $request->username !== null) {
                $updateData['username'] = $request->username;
            }

            if ($request->has('bio') && $request->bio !== null) {
                $updateData['bio'] = $request->bio;
            }

            if ($request->has('date_of_birth') && $request->date_of_birth !== null) {
                $updateData['date_of_birth'] = $request->date_of_birth;
            }

            if ($request->has('location') && $request->location !== null) {
                $updateData['location'] = $request->location;
            }

            if (!empty($updateData)) {
                $updateData['updated_at'] = now();

                DB::table('users')
                    ->where('id', $payload['user_id'])
                    ->update($updateData);

                // Check if profile is now complete and update status if needed
                $user = DB::table('users')->where('id', $payload['user_id'])->first();

                // Auto-update profile completion status if profile is complete
                $hasUsername = !empty($user->username);
                $optionalFieldsCount = 0;

                if (!empty($user->profile_image)) $optionalFieldsCount++;
                if (!empty($user->bio)) $optionalFieldsCount++;
                if (!empty($user->date_of_birth)) $optionalFieldsCount++;
                if (!empty($user->location)) $optionalFieldsCount++;

                if ($hasUsername && $optionalFieldsCount >= 2 && $user->profile_completion_status === 'incomplete') {
                    DB::table('users')
                        ->where('id', $payload['user_id'])
                        ->update(['profile_completion_status' => 'completed']);
                }
            }

            // Get updated user data
            $user = DB::table('users')->where('id', $payload['user_id'])->first();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username ?? null,
                    'bio' => $user->bio ?? null,
                    'date_of_birth' => $user->date_of_birth ?? null,
                    'location' => $user->location ?? null,
                    'profile_image' => $user->profile_image ?? null,
                    'profile_completion_status' => $user->profile_completion_status ?? 'incomplete',
                    'updated_at' => $user->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
            ], 500);
        }
    });

    // Upload profile image
    Route::post('/upload-image', function (Request $request) {
        $token = null;
        $payload = null;

        // Try to extract JWT token from Authorization header first
        $authHeader = $request->header('Authorization');
        Log::info('Upload image endpoint accessed', [
            'auth_header_present' => !empty($authHeader),
            'cookies_present' => !empty($request->cookies->all())
        ]);

        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            Log::info('Upload endpoint: Token extracted from header', ['token_length' => strlen($token)]);
            $payload = validateJWTToken($token);
        }

        // Fallback: Try to get token from cookies if no valid Bearer token
        if (!$payload) {
            // Check client_auth_token cookie (client-accessible)
            $cookieToken = $request->cookie('client_auth_token') ?? $request->cookie('auth_token');

            if ($cookieToken) {
                Log::info('Upload endpoint: Token extracted from cookie', ['token_length' => strlen($cookieToken)]);
                $payload = validateJWTToken($cookieToken);
                $token = $cookieToken;
            }
        }

        if (!$payload) {
            Log::warning('Upload endpoint: No valid token found');
            return response()->json([
                'success' => false,
                'message' => 'Authentication required - no valid token found',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            $filename = 'profile-images/' . \Illuminate\Support\Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Use the configured uploads disk
            $disk = config('filesystems.uploads');
            $path = \Illuminate\Support\Facades\Storage::disk($disk)->put($filename, file_get_contents($image));

            // Generate URL using disk configuration
            $diskConfig = config("filesystems.disks.{$disk}");
            $url = rtrim($diskConfig['url'], '/') . '/' . $filename;

            // Update user profile image
            DB::table('users')
                ->where('id', $payload['user_id'])
                ->update([
                    'profile_image' => $url,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile image uploaded successfully',
                'data' => [
                    'url' => $url,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Profile image upload error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    });

    // Upload banner image
    Route::post('/upload-banner', function (Request $request) {
        $token = null;
        $payload = null;

        // Try to extract JWT token from Authorization header first
        $authHeader = $request->header('Authorization');
        Log::info('Upload banner endpoint accessed', [
            'auth_header_present' => !empty($authHeader),
            'cookies_present' => !empty($request->cookies->all())
        ]);

        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            Log::info('Upload banner endpoint: Token extracted from header', ['token_length' => strlen($token)]);
            $payload = validateJWTToken($token);
        }

        // Fallback: Try to get token from cookies if no valid Bearer token
        if (!$payload) {
            // Check client_auth_token cookie (client-accessible)
            $cookieToken = $request->cookie('client_auth_token') ?? $request->cookie('auth_token');

            if ($cookieToken) {
                Log::info('Upload banner endpoint: Token extracted from cookie', ['token_length' => strlen($cookieToken)]);
                $payload = validateJWTToken($cookieToken);
                $token = $cookieToken;
            }
        }

        if (!$payload) {
            Log::warning('Upload banner endpoint: No valid token found');
            return response()->json([
                'success' => false,
                'message' => 'Authentication required - no valid token found',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max for banners
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid banner image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('banner');
            $filename = 'profile-banners/' . \Illuminate\Support\Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Use the configured uploads disk
            $disk = config('filesystems.uploads');
            $path = \Illuminate\Support\Facades\Storage::disk($disk)->put($filename, file_get_contents($image));

            // Generate URL using disk configuration
            $diskConfig = config("filesystems.disks.{$disk}");
            $url = rtrim($diskConfig['url'], '/') . '/' . $filename;

            // Update users record with banner image URL
            $userId = $payload['user_id'];
            DB::table('users')
                ->where('id', $userId)
                ->update([
                    'banner_image' => $url,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Banner image uploaded successfully',
                'data' => [
                    'url' => $url,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Banner image upload error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    });

    // Update profile completion status
    Route::put('/completion-status', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:completed,incomplete,hidden',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status value',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::table('users')
                ->where('id', $payload['user_id'])
                ->update([
                    'profile_completion_status' => $request->status,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile completion status updated successfully',
                'data' => [
                    'status' => $request->status,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Profile completion status update error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile completion status',
            ], 500);
        }
    });
});

// Notification management routes with enhanced security
Route::prefix('notifications')->middleware(['throttle:30,1'])->group(function () {
    // Get user notifications
    Route::get('/', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Enhanced input validation
        $limit = (int) $request->query('limit', 20);
        $offset = (int) $request->query('offset', 0);

        // Security: Strict limits to prevent resource exhaustion
        $limit = min(max($limit, 1), 50); // Between 1-50 notifications per request
        $offset = max($offset, 0); // Non-negative offset only

        // Validate user_id exists and is positive integer
        if (!isset($payload['user_id']) || !is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user context',
            ], 401);
        }

        // Manual instantiation due to autoload issues
        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $notifications = $notificationService->getUserNotifications($payload['user_id'], $limit, $offset);
        $unreadCount = $notificationService->getUnreadNotificationsCount($payload['user_id']);

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
                'total_fetched' => count($notifications),
                'limit' => $limit,
                'offset' => $offset,
            ]
        ]);
    });

    // Mark notification as read
    Route::patch('/{notificationId}/read', function (Request $request, $notificationId) {
        // Enhanced input validation for notification ID
        if (!is_numeric($notificationId) || $notificationId <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid notification ID',
            ], 400);
        }

        $notificationId = (int) $notificationId;

        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Validate user_id from token
        if (!isset($payload['user_id']) || !is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user context',
            ], 401);
        }

        // Check if notification belongs to user - Enhanced security check
        $notification = DB::table('notifications')
            ->where('id', $notificationId)
            ->where('user_id', (int) $payload['user_id'])
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found or access denied',
            ], 404);
        }

        // Additional security: Check if notification is already deleted or invalid
        if (isset($notification->deleted_at) && $notification->deleted_at !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Notification no longer available',
            ], 410);
        }

        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $success = $notificationService->markNotificationAsRead($notificationId);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Notification marked as read' : 'Failed to mark notification as read',
        ]);
    });

    // Mark all notifications as read
    Route::patch('/read-all', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $updatedCount = DB::table('notifications')
            ->where('user_id', $payload['user_id'])
            ->where('status', '!=', 'read')
            ->update([
                'status' => 'read',
                'read_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'updated_count' => $updatedCount,
        ]);
    });

    // Get unread notifications count
    Route::get('/unread-count', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $unreadCount = $notificationService->getUnreadNotificationsCount($payload['user_id']);

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $unreadCount,
            ]
        ]);
    });

    // Test notification creation (development only)
    Route::post('/test', function (Request $request) {
        if (env('APP_ENV') !== 'local') {
            return response()->json(['error' => 'Test endpoint only available in local environment'], 403);
        }

        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();

        $type = $request->input('type', 'test');
        $title = $request->input('title', 'Test Notification');
        $message = $request->input('message', 'This is a test notification created from the API.');

        $notificationId = $notificationService->createNotification(
            $payload['user_id'],
            $type,
            $title,
            $message,
            ['test' => true, 'created_at' => now()],
            'in_app'
        );

        $notificationService->markNotificationAsSent($notificationId);

        return response()->json([
            'success' => true,
            'message' => 'Test notification created',
            'notification_id' => $notificationId,
        ]);
    });

    // Get only unread notifications (for initial WebSocket load)
    Route::get('/unread', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Enhanced input validation
        $limit = (int) $request->query('limit', 20);
        $limit = min(max($limit, 1), 50); // Between 1-50 notifications per request

        // Validate user_id exists and is positive integer
        if (!isset($payload['user_id']) || !is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user context',
            ], 401);
        }

        // Manual instantiation due to autoload issues
        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $notifications = $notificationService->getUnreadNotifications($payload['user_id'], $limit);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    });

    // Get unread notifications count (separate endpoint)
    Route::get('/unread/count', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Validate user_id exists and is positive integer
        if (!isset($payload['user_id']) || !is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user context',
            ], 401);
        }

        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $unreadCount = $notificationService->getUnreadNotificationsCount($payload['user_id']);

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $unreadCount,
            ]
        ]);
    });

    // Get notifications since a specific timestamp
    Route::get('/since', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Validate timestamp parameter
        $timestamp = $request->query('timestamp');
        if (!$timestamp) {
            return response()->json([
                'success' => false,
                'message' => 'Timestamp parameter is required',
            ], 400);
        }

        // Enhanced input validation
        $limit = (int) $request->query('limit', 20);
        $limit = min(max($limit, 1), 50); // Between 1-50 notifications per request

        // Validate user_id exists and is positive integer
        if (!isset($payload['user_id']) || !is_numeric($payload['user_id']) || $payload['user_id'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user context',
            ], 401);
        }

        // Manual instantiation due to autoload issues
        require_once app_path('Services/NotificationService.php');
        $notificationService = new \App\Services\NotificationService();
        $notifications = $notificationService->getNotificationsSince($payload['user_id'], $timestamp, $limit);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    });
});

// Session management routes (with database fallback)
Route::prefix('sessions')->group(function () {
    Route::get('/statistics', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            // Get session statistics using DB
            $userId = $payload['user_id'];
            $sessions = DB::table('user_sessions')->where('user_id', $userId)->get();

            $stats = [
                'total_sessions' => $sessions->count(),
                'active_sessions' => $sessions->where('is_active', true)->count(),
                'online_sessions' => $sessions->where('status', 'online')->count(),
                'total_session_time' => $sessions->sum('session_duration'),
                'average_session_time' => $sessions->where('session_duration', '>', 0)->avg('session_duration') ?? 0,
                'last_activity' => $sessions->where('is_active', true)->max('last_activity_at'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            // Fallback when database is unavailable
            return response()->json([
                'success' => true,
                'data' => [
                    'total_sessions' => 1,
                    'active_sessions' => 1,
                    'online_sessions' => 1,
                    'total_session_time' => 0,
                    'average_session_time' => 0,
                    'last_activity' => now(),
                    'note' => 'Database unavailable - using fallback data'
                ]
            ]);
        }
    });

    Route::get('/active', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Get active sessions using DB
        $userId = $payload['user_id'];
        $sessions = DB::table('user_sessions')
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->where('status', '!=', 'offline')
            ->get();

        $sessionData = $sessions->map(function ($session) use ($payload) {
            return [
                'id' => $session->id,
                'device_type' => $session->device_type,
                'device_name' => $session->device_name,
                'browser' => $session->browser,
                'operating_system' => $session->operating_system,
                'ip_address' => $session->ip_address,
                'status' => $session->status,
                'last_activity_at' => $session->last_activity_at,
                'logged_in_at' => $session->logged_in_at,
                'is_current' => isset($payload['session_token']) && $session->session_token === $payload['session_token'],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'sessions' => $sessionData,
                'total_count' => $sessions->count(),
            ]
        ]);
    });

    Route::delete('/{sessionId}', function ($sessionId) {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Find and deactivate session using DB
        $session = DB::table('user_sessions')
            ->where('id', $sessionId)
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        // Deactivate session
        DB::table('user_sessions')
            ->where('id', $sessionId)
            ->update([
                'is_active' => false,
                'status' => 'offline',
                'logged_out_at' => now(),
                'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Session terminated successfully'
        ]);
    });

    Route::get('/current', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // First try to find a session by JWT session_token if available
        $currentSession = null;
        if (isset($payload['session_token'])) {
            $currentSession = DB::table('user_sessions')
                ->where('session_token', $payload['session_token'])
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->first();
        }

        // If no match by session token, find by user IP and user agent similarity
        if (!$currentSession) {
            $userIp = $request->ip() ?? '127.0.0.1';
            $userAgent = $request->header('User-Agent') ?? '';

            // Try to find a session for this user from the same IP
            $currentSession = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('ip_address', $userIp)
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->first();
        }

        // If still no match, get the most recent active session for the user
        if (!$currentSession) {
            $currentSession = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->first();
        }

        // If still no session found, create a new one for this request
        if (!$currentSession) {
            $userAgent = $request->header('User-Agent') ?? '';
            $sessionToken = 'session_' . uniqid() . '_' . time();

            // Basic device detection
            $deviceType = 'desktop';
            $browser = 'Unknown';
            $os = 'Unknown';

            if (preg_match('/Mobile|Android|iPhone|iPad/', $userAgent)) {
                $deviceType = 'mobile';
            } elseif (preg_match('/Tablet|iPad/', $userAgent)) {
                $deviceType = 'tablet';
            }

            if (preg_match('/Chrome/', $userAgent)) $browser = 'Chrome';
            elseif (preg_match('/Firefox/', $userAgent)) $browser = 'Firefox';
            elseif (preg_match('/Safari/', $userAgent)) $browser = 'Safari';
            elseif (preg_match('/Edge/', $userAgent)) $browser = 'Edge';

            if (preg_match('/Windows/', $userAgent)) $os = 'Windows';
            elseif (preg_match('/Mac/', $userAgent)) $os = 'macOS';
            elseif (preg_match('/Linux/', $userAgent)) $os = 'Linux';
            elseif (preg_match('/Android/', $userAgent)) $os = 'Android';
            elseif (preg_match('/iOS/', $userAgent)) $os = 'iOS';

            $sessionId = DB::table('user_sessions')->insertGetId([
                'user_id' => $payload['user_id'],
                'session_token' => $sessionToken,
                'device_type' => $deviceType,
                'browser' => $browser,
                'operating_system' => $os,
                'ip_address' => $request->ip() ?? '127.0.0.1',
                'user_agent' => $userAgent,
                'status' => 'online',
                'is_active' => true,
                'logged_in_at' => now(),
                'last_activity_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $currentSession = DB::table('user_sessions')->where('id', $sessionId)->first();
        }

        $sessionData = [
            'id' => $currentSession->id,
            'device_type' => $currentSession->device_type,
            'device_name' => $currentSession->device_name,
            'browser' => $currentSession->browser,
            'operating_system' => $currentSession->operating_system,
            'ip_address' => $currentSession->ip_address,
            'status' => $currentSession->status,
            'last_activity_at' => $currentSession->last_activity_at,
            'logged_in_at' => $currentSession->logged_in_at,
            'is_current' => true,
        ];

        return response()->json([
            'success' => true,
            'data' => $sessionData
        ]);
    });

    Route::put('/status', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $status = $request->input('status');
        if (!in_array($status, ['online', 'away'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status. Must be "online" or "away"',
            ], 422);
        }

        // Try to update specific session first if session_token is available
        $updated = 0;
        if (isset($payload['session_token'])) {
            $updated = DB::table('user_sessions')
                ->where('session_token', $payload['session_token'])
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->update([
                    'status' => $status,
                    'last_activity_at' => $status === 'online' ? now() : DB::raw('last_activity_at'),
                    'updated_at' => now(),
                ]);
        }

        // If no specific session was updated, update the most recent session for this user from this IP
        if ($updated === 0) {
            $userIp = $request->ip() ?? '127.0.0.1';
            $updated = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('ip_address', $userIp)
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->limit(1)
                ->update([
                    'status' => $status,
                    'last_activity_at' => $status === 'online' ? now() : DB::raw('last_activity_at'),
                    'updated_at' => now(),
                ]);
        }

        // If still no session was updated, update the most recent active session for the user
        if ($updated === 0) {
            $updated = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->limit(1)
                ->update([
                    'status' => $status,
                    'last_activity_at' => $status === 'online' ? now() : DB::raw('last_activity_at'),
                    'updated_at' => now(),
                ]);
        }

        if ($updated > 0) {
            return response()->json([
                'success' => true,
                'message' => 'Session status updated successfully',
                'updated_sessions' => $updated
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No active session found to update'
            ], 404);
        }
    });

    Route::post('/heartbeat', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Update last activity for all active sessions
        $updated = DB::table('user_sessions')
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true)
            ->update([
                'last_activity_at' => now(),
                'status' => 'online',
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Heartbeat received',
            'updated_sessions' => $updated
        ]);
    });

    Route::post('/offline', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Mark sessions as offline
        $updated = DB::table('user_sessions')
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true)
            ->update([
                'status' => 'offline',
                'logged_out_at' => now(),
                'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Sessions marked as offline',
            'updated_sessions' => $updated
        ]);
    });

    Route::delete('/', function () {
        // JWT Authentication for terminating other sessions
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Find all sessions except current one
        $currentSessionToken = $payload['session_token'] ?? null;
        $query = DB::table('user_sessions')
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true);

        if ($currentSessionToken) {
            $query->where('session_token', '!=', $currentSessionToken);
        }

        $sessionsToTerminate = $query->get();
        $terminatedCount = 0;

        foreach ($sessionsToTerminate as $session) {
            DB::table('user_sessions')
                ->where('id', $session->id)
                ->update([
                    'is_active' => false,
                    'status' => 'offline',
                    'logged_out_at' => now(),
                    'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                    'updated_at' => now(),
                ]);
            $terminatedCount++;
        }

        return response()->json([
            'success' => true,
            'message' => 'Other sessions terminated successfully',
            'terminated_count' => $terminatedCount
        ]);
    });

    Route::get('/current', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Get current session using session token if available
        $sessionToken = $payload['session_token'] ?? null;
        $session = null;

        if ($sessionToken) {
            $session = DB::table('user_sessions')
                ->where('session_token', $sessionToken)
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->first();
        }

        // If no session found by token, get the most recent active session
        if (!$session) {
            $session = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->first();
        }

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'No active session found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $session->id,
                'device_type' => $session->device_type,
                'device_name' => $session->device_name,
                'browser' => $session->browser,
                'operating_system' => $session->operating_system,
                'ip_address' => $session->ip_address,
                'status' => $session->status,
                'last_activity_at' => $session->last_activity_at,
                'logged_in_at' => $session->logged_in_at,
                'is_current' => true,
            ]
        ]);
    });

    Route::put('/status', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $status = $request->input('status');
        if (!in_array($status, ['online', 'away', 'offline'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status. Must be online, away, or offline',
            ], 422);
        }

        // Update session status
        $sessionToken = $payload['session_token'] ?? null;
        $updated = false;

        if ($sessionToken) {
            $affectedRows = DB::table('user_sessions')
                ->where('session_token', $sessionToken)
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->update([
                    'status' => $status,
                    'last_activity_at' => now(),
                    'updated_at' => now(),
                ]);
            $updated = $affectedRows > 0;
        }

        // If no session found by token, update the most recent active session
        if (!$updated) {
            $affectedRows = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->limit(1)
                ->update([
                    'status' => $status,
                    'last_activity_at' => now(),
                    'updated_at' => now(),
                ]);
            $updated = $affectedRows > 0;
        }

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'No active session found to update',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Session status updated successfully',
        ]);
    });

    Route::post('/heartbeat', function () {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Update last activity for current session
        $sessionToken = $payload['session_token'] ?? null;
        $updated = false;

        if ($sessionToken) {
            $affectedRows = DB::table('user_sessions')
                ->where('session_token', $sessionToken)
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->update([
                    'last_activity_at' => now(),
                    'status' => 'online',
                    'updated_at' => now(),
                ]);
            $updated = $affectedRows > 0;
        }

        // If no session found by token, update the most recent active session
        if (!$updated) {
            $affectedRows = DB::table('user_sessions')
                ->where('user_id', $payload['user_id'])
                ->where('is_active', true)
                ->orderBy('last_activity_at', 'desc')
                ->limit(1)
                ->update([
                    'last_activity_at' => now(),
                    'status' => 'online',
                    'updated_at' => now(),
                ]);
            $updated = $affectedRows > 0;
        }

        return response()->json([
            'success' => true,
            'message' => 'Heartbeat received',
            'updated' => $updated,
        ]);
    });

    Route::post('/offline', function () {
        // JWT Authentication (optional for this endpoint as it might be called during logout)
        $request = request();
        $authHeader = $request->header('Authorization');

        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $payload = validateJWTToken($token);

            if ($payload) {
                // Mark session as offline
                $sessionToken = $payload['session_token'] ?? null;

                if ($sessionToken) {
                    DB::table('user_sessions')
                        ->where('session_token', $sessionToken)
                        ->where('user_id', $payload['user_id'])
                        ->where('is_active', true)
                        ->update([
                            'status' => 'offline',
                            'logged_out_at' => now(),
                            'is_active' => false,
                            'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                            'updated_at' => now(),
                        ]);
                } else {
                    // Mark all active sessions for user as offline
                    DB::table('user_sessions')
                        ->where('user_id', $payload['user_id'])
                        ->where('is_active', true)
                        ->update([
                            'status' => 'offline',
                            'logged_out_at' => now(),
                            'is_active' => false,
                            'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                            'updated_at' => now(),
                        ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Session marked as offline',
        ]);
    });

    Route::delete('/', function () {
        // Terminate all other sessions except current
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $sessionToken = $payload['session_token'] ?? null;
        $query = DB::table('user_sessions')
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true);

        if ($sessionToken) {
            $query->where('session_token', '!=', $sessionToken);
        }

        $otherSessions = $query->get();

        $query->update([
            'is_active' => false,
            'status' => 'offline',
            'logged_out_at' => now(),
            'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Other sessions terminated successfully',
            'terminated_count' => $otherSessions->count(),
        ]);
    });

    Route::get('/statistics-no-auth', function () {
        try {
            // Test using DB directly
            $userCount = DB::table('users')->count();
            $sessionCount = DB::table('user_sessions')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'user_count' => $userCount,
                    'session_count' => $sessionCount,
                    'message' => 'Database queries work without model autoloading'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    });
});

// Simple test route to check if UserSession model works
Route::get('/test-jwt-validation', function () {
    $request = request();
    $authHeader = $request->header('Authorization');

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        return response()->json([
            'success' => false,
            'message' => 'Authorization header missing or invalid format',
            'received_header' => $authHeader
        ], 400);
    }

    $token = substr($authHeader, 7);
    $payload = validateJWTToken($token);

    return response()->json([
        'success' => $payload ? true : false,
        'payload' => $payload,
        'token_length' => strlen($token),
        'token_preview' => substr($token, 0, 50) . '...'
    ]);
});

Route::get('/get-test-jwt-token', function () {
    // Create a test JWT token for user ID 1
    $jwtToken = generateJWTToken([
        'user_id' => 1,
        'email' => 'test@example.com',
        'session_token' => 'test-session-token-123',
    ]);

    return response()->json([
        'success' => true,
        'jwt_token' => $jwtToken
    ]);
});

Route::get('/test-user-session-basic', function () {
    try {
        // Test basic database query instead of model
        $sessionCount = DB::table('user_sessions')->count();
        return response()->json([
            'success' => true,
            'message' => 'Database query works without models',
            'session_count' => $sessionCount
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Database query error',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Simple test route to check if we can create a session manually
Route::post('/test-create-session-manual', function (Request $request) {
    try {
        // Create a test user if it doesn't exist
        $user = DB::table('users')->where('email', 'test@example.com')->first();

        if (!$user) {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $user = DB::table('users')->where('id', $userId)->first();
        }

        // Create session manually using DB
        $sessionId = DB::table('user_sessions')->insertGetId([
            'user_id' => $user->id,
            'session_token' => \Illuminate\Support\Str::random(64),
            'device_type' => 'desktop',
            'browser' => 'Chrome',
            'operating_system' => 'Windows',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'online',
            'last_activity_at' => now(),
            'logged_in_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $session = DB::table('user_sessions')->where('id', $sessionId)->first();

        return response()->json([
            'success' => true,
            'message' => 'Session created manually using DB',
            'data' => $session
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create session manually',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Test session creation route
Route::post('/test-session', function (Request $request) {
    try {
        // Create a test user if it doesn't exist
        $user = DB::table('users')->where('email', 'test@example.com')->first();

        if (!$user) {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $user = DB::table('users')->where('id', $userId)->first();
        }

        // $sessionService = app(SessionService::class);
        // $userModel = User::find($user->id);
        // $session = $sessionService->createLoginSession($userModel, $request);

        return response()->json([
            'success' => true,
            'message' => 'Test session creation disabled - SessionService temporarily disabled',
            'data' => [
                // 'session_id' => $session->id,
                // 'session_token' => $session->session_token,
                // 'user_id' => $session->user_id,
                // 'status' => $session->status,
                // 'device_type' => $session->device_type,
                // 'browser' => $session->browser,
                // 'ip_address' => $session->ip_address,
                // 'logged_in_at' => $session->logged_in_at,
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create session',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Debug endpoint to get verification codes (development only)
Route::get('/debug-codes', function () {
    if (env('APP_ENV') !== 'local') {
        return response()->json(['error' => 'Debug endpoint only available in local environment'], 403);
    }

    try {
        $codes = DB::table('verification_codes')
            ->where('used_at', null)
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['email', 'code', 'expires_at', 'created_at']);

        return response()->json([
            'success' => true,
            'codes' => $codes
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// Professional Profile Application endpoint
Route::post('/apply-professional-profile', function (Request $request) {
    try {
        // Validate CSRF protection
        if (!validateCSRFHeaders($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request headers'
            ], 400);
        }

        $token = null;
        $payload = null;

        // Try to extract JWT token from Authorization header first
        $authHeader = $request->header('Authorization');
        Log::info('Apply professional profile endpoint accessed', [
            'auth_header_present' => !empty($authHeader),
            'cookies_present' => !empty($request->cookies->all())
        ]);

        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            Log::info('Apply professional: Token extracted from header', ['token_length' => strlen($token)]);
            $payload = validateJWTToken($token);
        }

        // Fallback: Try to get token from cookies if no valid Bearer token
        if (!$payload) {
            // Check client_auth_token cookie (client-accessible)
            $cookieToken = $request->cookie('client_auth_token') ?? $request->cookie('auth_token');

            if ($cookieToken) {
                Log::info('Apply professional: Token extracted from cookie', ['token_length' => strlen($cookieToken)]);
                $payload = validateJWTToken($cookieToken);
                $token = $cookieToken;
            }
        }

        if (!$payload) {
            Log::warning('Apply professional: No valid token found');
            return response()->json([
                'success' => false,
                'message' => 'Authorization token required'
            ], 401);
        }

        $userId = $payload['user_id'];
        Log::info('Apply professional: Token validated', ['user_id' => $userId]);

        // Enhanced validation with sanitization
        $validator = Validator::make($request->all(), [
            'credentials' => [
                'required',
                'string',
                'min:50',
                'max:2000',
                'regex:/^[\p{L}\p{N}\s\.,!?\-\(\)\[\]\/\+\*\=\:\;\"\'\_\&\@\#\$\%]+$/u', // Allow letters, numbers, common punctuation
            ],
            'switch_to_professional' => 'required|boolean',
            'professional_category' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[\p{L}\p{N}\s\/\-\(\)\.]+$/u', // Allow letters, numbers, spaces, common separators
            ]
        ], [
            'credentials.regex' => 'Credentials contain invalid characters. Please use only letters, numbers, and standard punctuation.',
            'professional_category.regex' => 'Professional category contains invalid characters.',
            'credentials.min' => 'Credentials must be at least 50 characters long.',
            'credentials.max' => 'Credentials cannot exceed 2000 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Sanitize input data
        $credentials = trim(strip_tags($request->input('credentials')));
        $switchToProfessional = (bool) $request->input('switch_to_professional');
        $professionalCategory = $request->input('professional_category')
            ? trim(strip_tags($request->input('professional_category')))
            : null;

        // Additional security: Remove any potential script tags or dangerous content
        $credentials = preg_replace('/[<>]/', '', $credentials);
        if ($professionalCategory) {
            $professionalCategory = preg_replace('/[<>]/', '', $professionalCategory);
        }

        // Validate professional category against allowed list
        $allowedCategories = [
            // Education & Teaching
            'Teacher / Tutor', 'Language Instructor', 'Academic Researcher', 'Coach / Mentor',
            // Learning & Content
            'Student / Learner', 'Content Creator', 'Author / Writer', 'Course Creator',
            // Culture & Community
            'Cultural Expert', 'Historian / Anthropologist', 'Community Leader', 'Non-profit / NGO',
            'Cultural Institution (Museum / Library / Arts)', 'Community Organization',
            // Professional Skills
            'Business Professional', 'Freelancer', 'Consultant', 'Entrepreneur / Startup Founder',
            // Education (Institutional)
            'School (Primary / Secondary)', 'University / College', 'Training Center / Academy', 'Online Learning Platform',
            // Professional & Corporate
            'Business / Company', 'Research Institute', 'Government / Public Sector', 'Language Center'
        ];

        if ($professionalCategory && !in_array($professionalCategory, $allowedCategories)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid professional category selected'
            ], 422);
        }

        // If switching to professional, category is required
        if ($switchToProfessional && empty($professionalCategory)) {
            return response()->json([
                'success' => false,
                'message' => 'Professional category is required when switching to professional account'
            ], 422);
        }

        // Get user
        $user = DB::table('users')->where('id', $userId)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Check if user is already professional
        if ($user->is_professional && $switchToProfessional) {
            return response()->json([
                'success' => false,
                'message' => 'User is already a professional account'
            ], 400);
        }

        // Check if user already has a pending application
        $existingApplication = DB::table('professional_applications')
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a pending professional application. Application ID: ' . $existingApplication->application_id,
                'application_id' => $existingApplication->application_id
            ], 400);
        }

        // Generate application ID (format: #4-4 like #A1B2-C3D4)
        $applicationId = '#' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4)) . '-' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4));

        // All applications are now pending by default - no auto-approval
        // Professional status will only be granted after manual admin review

        // Log the professional application for admin review
        $applicationData = [
            'user_id' => $userId,
            'application_id' => $applicationId,
            'credentials' => $credentials,
            'professional_category' => $professionalCategory,
            'status' => 'pending', // Always pending now
            'applied_at' => now(),
            'approved_at' => null, // Will be set when admin approves
            'created_at' => now(),
            'updated_at' => now()
        ];

        DB::table('professional_applications')->insert($applicationData);

        // Send confirmation email to user
        try {
            // Include the EmailService
            require_once app_path('Services/EmailService.php');

            $emailSent = \App\Services\EmailService::sendApplicationConfirmation(
                $applicationData,
                [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ]
            );

            if ($emailSent) {
                Log::info('Professional application confirmation email sent', [
                    'user_id' => $userId,
                    'application_id' => $applicationId,
                    'email' => $user->email
                ]);
            }
        } catch (\Exception $emailError) {
            // Don't fail the application if email fails
            Log::error('Failed to send application confirmation email', [
                'user_id' => $userId,
                'application_id' => $applicationId,
                'error' => $emailError->getMessage()
            ]);
        }

        // Get updated user data (user remains non-professional until approved)
        $updatedUser = DB::table('users')->where('id', $userId)->first();

        return response()->json([
            'success' => true,
            'message' => 'Professional application submitted for review. A confirmation email has been sent to your registered email address.',
            'application_id' => $applicationId,
            'status' => 'pending',
            'user' => $updatedUser
        ]);

    } catch (\Exception $e) {
        Log::error('Professional application error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'user_id' => $userId ?? null
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An error occurred while processing your application. Please try again.',
            'error' => env('APP_DEBUG') ? $e->getMessage() : null
        ], 500);
    }
});

// Test email endpoint (for development/testing only)
Route::post('/test-professional-email', function (Request $request) {
    if (!env('APP_DEBUG', false)) {
        return response()->json(['message' => 'Not available in production'], 403);
    }

    try {
        require_once app_path('Services/EmailService.php');

        $testApplicationData = [
            'application_id' => '#TEST-1234',
            'professional_category' => 'Teacher / Tutor',
            'status' => 'pending',
            'applied_at' => now(),
            'credentials' => 'This is a test application with sample credentials to demonstrate the email functionality.'
        ];

        $testUserData = [
            'id' => 999,
            'name' => 'Test User',
            'email' => $request->input('email', 'test@example.com')
        ];

        $emailSent = \App\Services\EmailService::sendApplicationConfirmation(
            $testApplicationData,
            $testUserData
        );

        return response()->json([
            'success' => $emailSent,
            'message' => $emailSent ? 'Test email sent successfully' : 'Failed to send test email'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
});

// Check Professional Application Status endpoint
Route::get('/professional-application-status', function (Request $request) {
    try {
        // Get JWT token from Authorization header
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization token required'
            ], 401);
        }

        $token = substr($authHeader, 7);

        // Verify and decode JWT token
        try {
            $decoded = validateJWTToken($token);
            if (!$decoded) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token'
                ], 401);
            }
            $userId = $decoded['user_id'];
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        // Get latest professional application for user
        $application = DB::table('professional_applications')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$application) {
            return response()->json([
                'success' => true,
                'has_application' => false,
                'application' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'has_application' => true,
            'application' => [
                'application_id' => $application->application_id,
                'status' => $application->status,
                'professional_category' => $application->professional_category,
                'applied_at' => $application->applied_at,
                'approved_at' => $application->approved_at
            ]
        ]);

    } catch (\Exception $e) {
        Log::error('Professional application status check error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'user_id' => $userId ?? null
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An error occurred while checking application status.'
        ], 500);
    }
});

// Settings - Sessions with JWT authentication and device fingerprinting
Route::middleware(['api', 'throttle:60,1'])->group(function () {
    Route::get('/settings/sessions', function (Request $request) {
        try {
            // Extract JWT token from Authorization header
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No token provided'], 401);
            }

            $token = substr($authHeader, 7);

            // Verify JWT token (basic verification - you might want to use a proper JWT library)
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 401);
            }

            // For demo purposes, we'll extract user ID from token payload
            // In production, use proper JWT verification
            $payload = json_decode(base64_decode($parts[1]), true);
            $userId = $payload['user_id'] ?? null;

            if (!$userId) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            // Include the DatabaseDeviceSessionManager
            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');

            // Get grouped sessions using the new database system
            $groupedSessions = DatabaseDeviceSessionManager::getGroupedSessions($userId);

            // Get device analytics
            $analytics = DatabaseDeviceSessionManager::getDeviceAnalytics($userId);

            // Check for suspicious activity
            $suspiciousActivity = DatabaseDeviceSessionManager::checkSuspiciousActivity($userId);

            return response()->json([
                'success' => true,
                'user_id' => $userId,
                'grouped_sessions' => $groupedSessions,
                'analytics' => $analytics,
                'suspicious_activity' => $suspiciousActivity,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch sessions: ' . $e->getMessage()
            ], 500);
        }
    });

    // Terminate a specific session
    Route::delete('/settings/sessions/{sessionId}', function (Request $request, $sessionId) {
        try {
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No token provided'], 401);
            }

            $token = substr($authHeader, 7);
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 401);
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            $userId = $payload['user_id'] ?? null;

            if (!$userId) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');

            $terminated = DatabaseDeviceSessionManager::terminateSession($userId, (int)$sessionId);

            if ($terminated) {
                return response()->json([
                    'success' => true,
                    'message' => 'Session terminated successfully',
                    'session_id' => $sessionId
                ]);
            } else {
                return response()->json([
                    'error' => 'Session not found or already terminated'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to terminate session: ' . $e->getMessage()
            ], 500);
        }
    });

    // Terminate all sessions for a device
    Route::delete('/settings/devices/{deviceId}/sessions', function (Request $request, $deviceId) {
        try {
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No token provided'], 401);
            }

            $token = substr($authHeader, 7);
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 401);
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            $userId = $payload['user_id'] ?? null;

            if (!$userId) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');

            $terminatedCount = DatabaseDeviceSessionManager::terminateDeviceSessions($userId, $deviceId);

            return response()->json([
                'success' => true,
                'message' => "Terminated {$terminatedCount} sessions",
                'device_id' => $deviceId,
                'terminated_count' => $terminatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to terminate device sessions: ' . $e->getMessage()
            ], 500);
        }
    });

    // Trust/untrust a device
    Route::patch('/settings/devices/{deviceId}/trust', function (Request $request, $deviceId) {
        try {
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No token provided'], 401);
            }

            $token = substr($authHeader, 7);
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 401);
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            $userId = $payload['user_id'] ?? null;

            if (!$userId) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $trusted = $request->input('trusted', true);

            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');

            if ($trusted) {
                $result = DatabaseDeviceSessionManager::trustDevice($userId, $deviceId);
                $action = 'trusted';
            } else {
                $result = DatabaseDeviceSessionManager::untrustDevice($userId, $deviceId);
                $action = 'untrusted';
            }

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => "Device {$action} successfully",
                    'device_id' => $deviceId,
                    'trusted' => $trusted
                ]);
            } else {
                return response()->json([
                    'error' => 'Device not found'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update device trust: ' . $e->getMessage()
            ], 500);
        }
    });

    // Get device security events
    Route::get('/settings/devices/{deviceId}/events', function (Request $request, $deviceId) {
        try {
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No token provided'], 401);
            }

            $token = substr($authHeader, 7);
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 401);
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            $userId = $payload['user_id'] ?? null;

            if (!$userId) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $limit = $request->input('limit', 50);

            require_once app_path('Helpers/DatabaseDeviceSessionManager.php');

            $events = DatabaseDeviceSessionManager::getDeviceSecurityEvents($userId, $deviceId, $limit);

            return response()->json([
                'success' => true,
                'device_id' => $deviceId,
                'events' => $events,
                'count' => count($events)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch device events: ' . $e->getMessage()
            ], 500);
        }
    });
});

// Settings routes with authentication
Route::prefix('settings')->group(function () {
    // Get user sessions for settings page
    Route::get('/sessions', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            $userId = $payload['user_id'];

            // Get all sessions for the user (active and inactive)
            $sessions = DB::table('user_sessions')
                ->where('user_id', $userId)
                ->orderBy('last_activity_at', 'desc')
                ->get();

            // Get current session token for comparison
            $currentSessionToken = $payload['session_token'] ?? null;

            // Format sessions for display
            $formattedSessions = $sessions->map(function ($session) use ($currentSessionToken) {
                return [
                    'id' => $session->id,
                    'device_type' => $session->device_type,
                    'device_name' => $session->device_name ?? generateDeviceName($session),
                    'browser' => $session->browser,
                    'browser_version' => $session->browser_version,
                    'operating_system' => $session->operating_system,
                    'os_version' => $session->os_version,
                    'ip_address' => $session->ip_address,
                    'location' => $session->location ?? 'Unknown Location',
                    'status' => $session->status,
                    'is_active' => $session->is_active,
                    'is_current' => $currentSessionToken && $session->session_token === $currentSessionToken,
                    'logged_in_at' => $session->logged_in_at,
                    'last_activity_at' => $session->last_activity_at,
                    'logged_out_at' => $session->logged_out_at,
                    'session_duration' => $session->session_duration,
                    'created_at' => $session->created_at,
                ];
            });

            // Group sessions by device characteristics for better UX
            $groupedSessions = [];
            foreach ($formattedSessions as $session) {
                $deviceKey = $session['device_type'] . '_' . $session['browser'] . '_' . $session['operating_system'];
                if (!isset($groupedSessions[$deviceKey])) {
                    $groupedSessions[$deviceKey] = [
                        'device_info' => [
                            'device_type' => $session['device_type'],
                            'device_name' => $session['device_name'],
                            'browser' => $session['browser'],
                            'operating_system' => $session['operating_system'],
                        ],
                        'sessions' => [],
                        'active_count' => 0,
                        'last_activity' => null,
                    ];
                }

                $groupedSessions[$deviceKey]['sessions'][] = $session;
                if ($session['is_active']) {
                    $groupedSessions[$deviceKey]['active_count']++;
                }

                if (!$groupedSessions[$deviceKey]['last_activity'] ||
                    $session['last_activity_at'] > $groupedSessions[$deviceKey]['last_activity']) {
                    $groupedSessions[$deviceKey]['last_activity'] = $session['last_activity_at'];
                }
            }

            // Convert to indexed array
            $deviceGroups = array_values($groupedSessions);

            return response()->json([
                'success' => true,
                'data' => [
                    'sessions' => $formattedSessions,
                    'grouped_by_device' => $deviceGroups,
                    'statistics' => [
                        'total_sessions' => $sessions->count(),
                        'active_sessions' => $sessions->where('is_active', true)->count(),
                        'online_sessions' => $sessions->where('status', 'online')->count(),
                        'unique_devices' => count($deviceGroups),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Settings sessions error', [
                'error' => $e->getMessage(),
                'user_id' => $userId ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sessions',
            ], 500);
        }
    });

    // Terminate a specific session
    Route::delete('/sessions/{sessionId}', function ($sessionId, Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            $userId = $payload['user_id'];

            // Find the session and verify it belongs to the user
            $session = DB::table('user_sessions')
                ->where('id', $sessionId)
                ->where('user_id', $userId)
                ->first();

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found',
                ], 404);
            }

            // Terminate the session
            DB::table('user_sessions')
                ->where('id', $sessionId)
                ->update([
                    'is_active' => false,
                    'status' => 'offline',
                    'logged_out_at' => now(),
                    'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Session terminated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Session termination error', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'user_id' => $userId ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to terminate session',
            ], 500);
        }
    });

    // Terminate all other sessions except current
    Route::delete('/sessions', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            $userId = $payload['user_id'];
            $currentSessionToken = $payload['session_token'] ?? null;

            // Find all active sessions except current
            $query = DB::table('user_sessions')
                ->where('user_id', $userId)
                ->where('is_active', true);

            if ($currentSessionToken) {
                $query->where('session_token', '!=', $currentSessionToken);
            }

            $sessionsToTerminate = $query->get();
            $terminatedCount = 0;

            foreach ($sessionsToTerminate as $session) {
                DB::table('user_sessions')
                    ->where('id', $session->id)
                    ->update([
                        'is_active' => false,
                        'status' => 'offline',
                        'logged_out_at' => now(),
                        'session_duration' => DB::raw('COALESCE(session_duration, TIMESTAMPDIFF(SECOND, logged_in_at, NOW()))'),
                        'updated_at' => now(),
                    ]);
                $terminatedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => 'Other sessions terminated successfully',
                'terminated_count' => $terminatedCount,
            ]);

        } catch (\Exception $e) {
            Log::error('Bulk session termination error', [
                'error' => $e->getMessage(),
                'user_id' => $userId ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to terminate sessions',
            ], 500);
        }
    });
});

// Onboarding management routes
Route::prefix('onboarding')->middleware(['throttle:30,1'])->group(function () {
    // Get onboarding data for a user
    Route::get('/', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            // Get onboarding data
            $onboardingData = DB::table('onboarding')
                ->where('user_id', $payload['user_id'])
                ->first();

            // Get user data for banner_image and website
            $userData = DB::table('users')
                ->select('banner_image', 'website')
                ->where('id', $payload['user_id'])
                ->first();

            if (!$onboardingData) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'banner_image' => $userData ? $userData->banner_image : null,
                        'website' => $userData ? $userData->website : null,
                    ],
                    'message' => 'No onboarding data found'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $onboardingData->id,
                    'user_id' => $onboardingData->user_id,
                    'account_type' => $onboardingData->account_type,
                    'preferences' => $onboardingData->preferences ? json_decode($onboardingData->preferences) : null,
                    'is_completed' => $onboardingData->is_completed,
                    'completed_at' => $onboardingData->completed_at,
                    'completion_step' => $onboardingData->completion_step,
                    'selected_interests' => $onboardingData->selected_interests ? json_decode($onboardingData->selected_interests) : null,
                    'organization' => $onboardingData->organization,
                    'credentials' => $onboardingData->credentials,
                    'professional_category' => $onboardingData->professional_category,
                    'created_at' => $onboardingData->created_at,
                    'updated_at' => $onboardingData->updated_at,
                    // Fields from users table
                    'banner_image' => $userData ? $userData->banner_image : null,
                    'website' => $userData ? $userData->website : null,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get onboarding data error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve onboarding data',
            ], 500);
        }
    });

    // Create or update onboarding data
    Route::put('/', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'account_type' => 'nullable|string|in:personal,business',
            'preferences' => 'nullable|array',
            'selected_interests' => 'nullable|array',
            'selected_interests.*' => 'string|max:50',
            'is_completed' => 'nullable|boolean',
            'completion_step' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'credentials' => 'nullable|string|max:500',
            'professional_category' => 'nullable|string|max:100',
            // Fields for users table
            'banner_image' => 'nullable|string|url',
            'website' => 'nullable|string|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $payload['user_id'];
            $onboardingData = [];
            $userData = [];

            // Handle onboarding table fields
            if ($request->has('account_type')) {
                $onboardingData['account_type'] = $request->account_type;
            }

            if ($request->has('preferences')) {
                $onboardingData['preferences'] = json_encode($request->preferences);
            }

            // Handle completion fields
            if ($request->has('is_completed')) {
                $onboardingData['is_completed'] = $request->is_completed;
                if ($request->is_completed) {
                    $onboardingData['completed_at'] = now();
                    $onboardingData['completion_step'] = $request->completion_step ?? 'completed';
                }
            }

            if ($request->has('selected_interests')) {
                $onboardingData['selected_interests'] = json_encode($request->selected_interests);
            }

            if ($request->has('organization')) {
                $onboardingData['organization'] = $request->organization;
            }

            if ($request->has('credentials')) {
                $onboardingData['credentials'] = $request->credentials;
            }

            if ($request->has('professional_category')) {
                $onboardingData['professional_category'] = $request->professional_category;
            }

            // Handle users table fields
            if ($request->has('banner_image')) {
                $userData['banner_image'] = $request->banner_image;
            }

            if ($request->has('website')) {
                $userData['website'] = $request->website;
            }

            // Update onboarding data if there are changes
            if (!empty($onboardingData)) {
                $onboardingData['updated_at'] = now();

                // Try to update existing record
                $updated = DB::table('onboarding')
                    ->where('user_id', $userId)
                    ->update($onboardingData);

                if (!$updated) {
                    // Create new record if none exists
                    $onboardingData['user_id'] = $userId;
                    $onboardingData['created_at'] = now();

                    $onboardingId = DB::table('onboarding')->insertGetId($onboardingData);
                } else {
                    // Get the existing onboarding record ID
                    $onboardingRecord = DB::table('onboarding')
                        ->where('user_id', $userId)
                        ->first();
                    $onboardingId = $onboardingRecord->id;
                }

                // If onboarding is completed, update user's onboarding_id and status
                if (isset($onboardingData['is_completed']) && $onboardingData['is_completed']) {
                    $userData['onboarding_id'] = $onboardingId;
                    $userData['is_onboarded_status'] = 'complete';
                }
            }

            // Update users table if there are changes
            if (!empty($userData)) {
                $userData['updated_at'] = now();
                DB::table('users')
                    ->where('id', $userId)
                    ->update($userData);
            }

            // Get the updated/created onboarding data and user data
            $onboardingData = DB::table('onboarding')
                ->where('user_id', $userId)
                ->first();

            $userData = DB::table('users')
                ->select('banner_image', 'website')
                ->where('id', $userId)
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Onboarding data updated successfully',
                'data' => [
                    'id' => $onboardingData ? $onboardingData->id : null,
                    'user_id' => $userId,
                    'account_type' => $onboardingData ? $onboardingData->account_type : null,
                    'preferences' => $onboardingData && $onboardingData->preferences ? json_decode($onboardingData->preferences) : null,
                    'selected_interests' => $onboardingData && $onboardingData->selected_interests ? json_decode($onboardingData->selected_interests) : null,
                    'is_completed' => $onboardingData ? $onboardingData->is_completed : false,
                    'completed_at' => $onboardingData ? $onboardingData->completed_at : null,
                    'completion_step' => $onboardingData ? $onboardingData->completion_step : null,
                    'organization' => $onboardingData ? $onboardingData->organization : null,
                    'credentials' => $onboardingData ? $onboardingData->credentials : null,
                    'professional_category' => $onboardingData ? $onboardingData->professional_category : null,
                    'created_at' => $onboardingData ? $onboardingData->created_at : null,
                    'updated_at' => $onboardingData ? $onboardingData->updated_at : null,
                    // Fields from users table
                    'banner_image' => $userData ? $userData->banner_image : null,
                    'website' => $userData ? $userData->website : null,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Update onboarding data error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update onboarding data',
            ], 500);
        }
    });

    // Upload banner image for business onboarding
    Route::post('/upload-banner', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid banner image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('banner');
            $filename = 'profile-banners/' . \Illuminate\Support\Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Upload to assets subdomain storage
            $path = \Illuminate\Support\Facades\Storage::disk('assets')->put($filename, file_get_contents($image));
            $url = config('app.assets_url', 'https://assets.bitroot.com.ng') . '/' . $filename;

            // Update users record with banner image URL
            $userId = $payload['user_id'];
            DB::table('users')
                ->where('id', $userId)
                ->update([
                    'banner_image' => $url,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Banner image uploaded successfully',
                'data' => [
                    'url' => $url,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Banner image upload error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    });
});

// Public Interests routes (no authentication required)
Route::prefix('interests')->middleware(['throttle:60,1'])->group(function () {
    // Get all interests (both default and user-added) - PUBLIC
    Route::get('/', function (Request $request) {
        try {
            $query = DB::table('interests');

            // Filter by search term if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where('label', 'ILIKE', '%' . $searchTerm . '%'); // Use ILIKE for case-insensitive search in PostgreSQL
            }

            // Filter by type if provided
            if ($request->has('type')) {
                if ($request->type === 'default') {
                    $query->where('is_added_by_user', false);
                } elseif ($request->type === 'user_added') {
                    $query->where('is_added_by_user', true);
                } elseif ($request->type === 'suggested') {
                    // Return only suggested default interests (can be customized)
                    $suggestedIds = ['programming', 'spanish', 'music', 'fitness', 'cooking', 'travel', 'reading'];
                    $query->where('is_added_by_user', false)
                          ->whereIn('real_id', $suggestedIds);
                }
            }

            // Order by created_at for consistent results
            $interests = $query->orderBy('label')->get();

            return response()->json([
                'success' => true,
                'data' => $interests,
                'message' => 'Interests retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Get interests error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve interests',
            ], 500);
        }
    });

    // Get suggested interests (most popular default interests) - PUBLIC
    Route::get('/suggested', function (Request $request) {
        try {
            $suggestedIds = ['programming', 'spanish', 'music', 'fitness', 'cooking', 'travel', 'reading'];

            $interests = DB::table('interests')
                ->where('is_added_by_user', false)
                ->whereIn('real_id', $suggestedIds)
                ->orderByRaw("array_position(array['" . implode("','", $suggestedIds) . "'], real_id)")
                ->get();

            return response()->json([
                'success' => true,
                'data' => $interests,
                'message' => 'Suggested interests retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Get suggested interests error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve suggested interests',
            ], 500);
        }
    });
});

// Protected Interests routes (authentication required)
Route::prefix('interests')->middleware(['throttle:60,1'])->group(function () {
    // Add a new custom interest (requires authentication)
    Route::post('/', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:100|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $payload['user_id'];
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $label = trim($request->label);

            // Check if interest already exists (case-insensitive)
            $existingInterest = DB::table('interests')->whereRaw('LOWER(label) = LOWER(?)', [$label])->first();

            if ($existingInterest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Interest already exists',
                    'data' => $existingInterest
                ], 409);
            }

            // Create new custom interest
            $realId = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 6));
            while (DB::table('interests')->where('real_id', $realId)->exists()) {
                $realId = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 6));
            }

            $interestId = DB::table('interests')->insertGetId([
                'real_id' => $realId,
                'label' => $label,
                'user_id' => $userId,
                'username' => $user->username ?? $user->name ?? 'Unknown',
                'is_added_by_user' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $interest = DB::table('interests')->where('id', $interestId)->first();

            return response()->json([
                'success' => true,
                'data' => $interest,
                'message' => 'Custom interest created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create interest error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id'] ?? 'unknown']);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create interest',
            ], 500);
        }
    });

    // Get user's selected interests (requires authentication)
    Route::get('/user-selected', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        try {
            $userId = $payload['user_id'];
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $selectedInterests = $user->interests()->get();

            return response()->json([
                'success' => true,
                'data' => $selectedInterests,
                'message' => 'User selected interests retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Get user interests error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id'] ?? 'unknown']);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user interests',
            ], 500);
        }
    });

    // Update user's selected interests (requires authentication)
    Route::post('/user-selected', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'interest_ids' => 'required|array',
            'interest_ids.*' => 'integer|exists:interests,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $payload['user_id'];
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            // Sync user's interests (this will remove old ones and add new ones)
            $user->interests()->sync($request->interest_ids);

            // Get the updated interests
            $selectedInterests = $user->interests()->get();

            return response()->json([
                'success' => true,
                'data' => $selectedInterests,
                'message' => 'User interests updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update user interests error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id'] ?? 'unknown']);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user interests',
            ], 500);
        }
    });
});

// User onboarding status management routes
Route::prefix('user')->middleware(['throttle:30,1'])->group(function () {
    // Update user onboarding status
    Route::put('/onboarding-status', function (Request $request) {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'is_onboarded_status' => 'required|string|in:complete,incomplete,skipped',
            'onboarding_id' => 'nullable|integer|exists:onboarding,id',
            'is_professional' => 'nullable|boolean',
            'profile_completion_status' => 'nullable|string|in:complete,incomplete',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::find($payload['user_id']);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            // Use the appropriate model method based on onboarding status
            if ($request->is_onboarded_status === 'complete') {
                $user->completeOnboarding(
                    $request->onboarding_id,
                    $request->is_professional ?? false,
                    $request->profile_completion_status ?? 'complete'
                );
            } elseif ($request->is_onboarded_status === 'skipped') {
                $user->skipOnboarding($request->onboarding_id);
            } else {
                // For incomplete status, just update the basic fields
                $user->update([
                    'is_onboarded_status' => $request->is_onboarded_status,
                    'onboarding_id' => $request->onboarding_id,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Onboarding status updated successfully',
                'data' => [
                    'is_onboarded_status' => $user->is_onboarded_status,
                    'onboarding_id' => $user->onboarding_id,
                    'is_professional' => $user->is_professional,
                    'profile_completion_status' => $user->profile_completion_status,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Update onboarding status error', ['error' => $e->getMessage(), 'user_id' => $payload['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update onboarding status',
            ], 500);
        }
    });
});

// User routes for public profile access
Route::get('/test-simple/{username}', function($username) {
    return response()->json([
        'message' => 'Simple test working',
        'username' => $username,
        'timestamp' => now()->toISOString()
    ]);
});

Route::get('/test-db', function() {
    try {
        $users = DB::table('users')->limit(1)->get();
        return response()->json([
            'message' => 'Database connection works',
            'user_count' => DB::table('users')->count(),
            'sample_user' => $users->first()
        ]);
    } catch (Exception $e) {
        return response()->json([
            'error' => 'Database connection failed',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Follow/unfollow routes using closure implementation due to controller loading issues
Route::middleware(['throttle:30,1'])->group(function () {
    Route::post('/users/{username}/follow', function(Request $request, string $username) {
        try {
            // Extract JWT token from Authorization header
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            $payload = validateJWTToken($token);
            if (!$payload) {
                return response()->json(['message' => 'Invalid or expired token'], 401);
            }

            $authUserId = $payload['user_id'];
            $userToFollow = DB::table('users')->where('username', $username)->first();

            if (!$userToFollow) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Check if trying to follow self
            if ($userToFollow->id === $authUserId) {
                return response()->json(['message' => 'You cannot follow yourself'], 400);
            }

            // Check if already following
            $existingFollow = DB::table('followers')
                ->where('user_id', $userToFollow->id)
                ->where('follower_id', $authUserId)
                ->where('is_active', true)
                ->first();

            if ($existingFollow) {
                return response()->json(['message' => 'Already following this user'], 400);
            }

            // Follow the user
            DB::table('followers')->updateOrInsert(
                [
                    'user_id' => $userToFollow->id,
                    'follower_id' => $authUserId,
                ],
                [
                    'is_active' => true,
                    'date_followed' => now(),
                    'date_unfollowed' => null,
                    'follower_action' => 'default',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            // Get updated followers count
            $followersCount = DB::table('followers')
                ->where('user_id', $userToFollow->id)
                ->where('is_active', true)
                ->count();

            return response()->json([
                'success' => true,
                'message' => "Successfully followed @{$username}",
                'user' => [
                    'id' => $userToFollow->id,
                    'username' => $userToFollow->username,
                    'name' => $userToFollow->name,
                    'is_following' => true,
                ],
                'followers_count' => $followersCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Follow error: ' . $e->getMessage());
            return response()->json(['message' => 'Error following user'], 500);
        }
    });

    Route::delete('/users/{username}/follow', function(Request $request, string $username) {
        try {
            // Extract JWT token from Authorization header
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            $payload = validateJWTToken($token);
            if (!$payload) {
                return response()->json(['message' => 'Invalid or expired token'], 401);
            }

            $authUserId = $payload['user_id'];
            $userToUnfollow = DB::table('users')->where('username', $username)->first();

            if (!$userToUnfollow) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Check if actually following
            $existingFollow = DB::table('followers')
                ->where('user_id', $userToUnfollow->id)
                ->where('follower_id', $authUserId)
                ->where('is_active', true)
                ->first();

            if (!$existingFollow) {
                return response()->json(['message' => 'You are not following this user'], 400);
            }

            // Unfollow the user
            DB::table('followers')
                ->where('user_id', $userToUnfollow->id)
                ->where('follower_id', $authUserId)
                ->update([
                    'is_active' => false,
                    'date_unfollowed' => now(),
                    'updated_at' => now(),
                ]);

            // Get updated followers count
            $followersCount = DB::table('followers')
                ->where('user_id', $userToUnfollow->id)
                ->where('is_active', true)
                ->count();

            return response()->json([
                'success' => true,
                'message' => "Successfully unfollowed @{$username}",
                'user' => [
                    'id' => $userToUnfollow->id,
                    'username' => $userToUnfollow->username,
                    'name' => $userToUnfollow->name,
                    'is_following' => false,
                ],
                'followers_count' => $followersCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Unfollow error: ' . $e->getMessage());
            return response()->json(['message' => 'Error unfollowing user'], 500);
        }
    });
    // Suggested users route moved to avoid conflicts with dynamic user routes
    Route::get('/suggested/users', function(Request $request) {
        try {
            $limit = min((int) $request->get('limit', 10), 50); // Cap at 50 users

            // Simple test - get 10 random users
            $users = DB::table('users')
                ->select(['id', 'username', 'name', 'profile_image', 'bio'])
                ->whereNotNull('username')
                ->where('username', '!=', '')
                ->inRandomOrder()
                ->limit($limit)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'name' => $user->name,
                        'avatar' => $user->profile_image ?? '/placeholder-user.jpg',
                        'bio' => $user->bio,
                        'is_professional' => false,
                        'is_following' => false,
                        'followers_count' => 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching suggested users', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching suggested users',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    });
});

Route::get('/users/{username}', function(Request $request, $username) {
    try {
        // Use DB query instead of Eloquent model
        $user = DB::table('users')->where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Get followers count
        $followersCount = DB::table('followers')
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Check if current user is following this user (if authenticated)
        $isFollowing = false;
        $authHeader = $request->header('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            try {
                $token = substr($authHeader, 7);
                $payload = validateJWTToken($token);
                if ($payload && isset($payload['user_id'])) {
                    $authUserId = $payload['user_id'];
                    $existingFollow = DB::table('followers')
                        ->where('user_id', $user->id)
                        ->where('follower_id', $authUserId)
                        ->where('is_active', true)
                        ->exists();
                    $isFollowing = $existingFollow;
                }
            } catch (\Exception $e) {
                // If token validation fails, just continue with isFollowing = false
            }
        }

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'email' => $user->email ?? null,
            'bio' => $user->bio,
            'profile_image' => $user->profile_image,
            'banner_url' => $user->banner_image, // Map banner_image to banner_url for frontend
            'banner_image' => $user->banner_image, // Keep both for compatibility
            'location' => $user->location,
            'website' => $user->website ?? null,
            'date_of_birth' => $user->date_of_birth ?? null,
            'is_professional' => $user->is_professional ?? false,
            'professional_category' => $user->professional_category ?? null,
            'points' => $user->points ?? 0,
            'level' => $user->level ?? 1,
            'streak_count' => $user->streak_count ?? 0,
            'followers_count' => $followersCount,
            'is_following' => $isFollowing,
            'profile_completion_status' => $user->profile_completion_status ?? 'incomplete',
            'is_onboarded_status' => $user->is_onboarded_status ?? 'incomplete',
            'email_verified_at' => $user->email_verified_at,
            'last_activity_date' => $user->last_activity_date,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    } catch (Exception $e) {
        return response()->json([
            'error' => 'Database error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});

// Test route for debugging user profile pages
Route::get('/test-user/{username}', function($username) {
    return response()->json([
        'id' => 1,
        'username' => $username,
        'name' => 'Test User ' . ucfirst($username),
        'bio' => 'This is a test user for debugging purposes.',
        'avatar_url' => null,
        'location' => 'Test Location',
        'is_professional' => false,
        'professional_category' => null,
        'points' => 100,
        'level' => 5,
        'streak_count' => 7,
        'created_at' => now()->toISOString(),
    ]);
});

// Helper function to generate device name
if (!function_exists('generateDeviceName')) {
    function generateDeviceName($session) {
        $deviceType = ucfirst($session->device_type ?? 'Unknown');
        $os = $session->operating_system ?? 'Unknown';
        $browser = $session->browser ?? 'Unknown';

        return "{$os} {$deviceType} ({$browser})";
    }
}
