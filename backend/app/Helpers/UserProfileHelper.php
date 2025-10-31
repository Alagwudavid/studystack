<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

if (!function_exists('generateUniqueUserUUID')) {
    function generateUniqueUserUUID() {
        do {
            // Generate a new UUID
            $uuid = (string) Str::uuid();
        } while (DB::table('users')->where('uuid', $uuid)->exists());
        
        return $uuid;
    }
}

if (!function_exists('generateUniqueUsername')) {
    function generateUniqueUsername($email = null, $name = null) {
        $baseUsername = 'user';
        
        // Try to create a meaningful username from email or name
        if ($email) {
            $emailPrefix = explode('@', $email)[0];
            $baseUsername = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($emailPrefix));
        } elseif ($name) {
            $baseUsername = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($name));
        }
        
        // Ensure base username is not empty and has minimum length
        if (empty($baseUsername) || strlen($baseUsername) < 3) {
            $baseUsername = 'user';
        }
        
        // Generate unique username with random suffix
        $maxAttempts = 100;
        $attempt = 0;
        
        do {
            if ($attempt === 0) {
                // First try without suffix
                $username = $baseUsername;
            } else {
                // Add random suffix
                $randomSuffix = strtolower(Str::random(6));
                $username = $baseUsername . '-' . $randomSuffix;
            }
            $attempt++;
        } while (DB::table('users')->where('username', $username)->exists() && $attempt < $maxAttempts);
        
        // Fallback to completely random username if all attempts failed
        if ($attempt >= $maxAttempts) {
            do {
                $username = 'user-' . strtolower(Str::random(8));
            } while (DB::table('users')->where('username', $username)->exists());
        }
        
        return $username;
    }
}

// Legacy functions for backward compatibility
if (!function_exists('generateUserUUID')) {
    function generateUserUUID() {
        return generateUniqueUserUUID();
    }
}

if (!function_exists('generateUsername')) {
    function generateUsername($email = null) {
        return generateUniqueUsername($email);
    }
}
