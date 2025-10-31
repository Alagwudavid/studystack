<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;

class JWTService
{
    private static function getKey(): string
    {
        return env('JWT_SECRET', 'bitroot-default-secret-key-change-in-production');
    }

    public static function generateToken(array $payload, int $ttlMinutes = 60): string
    {
        $now = Carbon::now();
        
        // For very long durations (like 30 days), use days instead of minutes
        $expiration = $ttlMinutes > 1440 ? $now->addDays($ttlMinutes / 1440) : $now->addMinutes($ttlMinutes);
        
        $tokenPayload = array_merge($payload, [
            'iat' => $now->timestamp,
            'exp' => $expiration->timestamp,
            'iss' => 'bitroot-api',
        ]);

        return JWT::encode($tokenPayload, self::getKey(), 'HS256');
    }

    public static function validateToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key(self::getKey(), 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function refreshToken(string $token): ?string
    {
        $payload = self::validateToken($token);
        
        if (!$payload) {
            return null;
        }

        // Remove old timestamps
        unset($payload['iat'], $payload['exp']);

        return self::generateToken($payload);
    }
}
