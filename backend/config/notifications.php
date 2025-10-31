<?php

return [
    
    /*
    |--------------------------------------------------------------------------
    | Notification Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains security settings for the notification system
    |
    */
    
    // Rate limiting settings
    'rate_limits' => [
        'notifications_per_minute' => 30,
        'test_notifications_per_hour' => 10,
        'bulk_operations_per_hour' => 5,
    ],
    
    // Content limits
    'content_limits' => [
        'title_max_length' => 255,
        'message_max_length' => 1000,
        'data_max_size' => 2048, // bytes
        'max_notifications_per_request' => 50,
    ],
    
    // Allowed notification types
    'allowed_types' => [
        'login_alert',
        'welcome',
        'security_alert',
        'system',
        'test',
    ],
    
    // Allowed notification channels
    'allowed_channels' => [
        'in_app',
        'email',
        'both',
    ],
    
    // Security settings
    'security' => [
        'jwt_max_age_hours' => 24,
        'require_csrf_protection' => false, // For API endpoints
        'enable_audit_logging' => true,
        'sanitize_html_content' => true,
        'max_failed_attempts' => 5,
    ],
    
    // Development/testing settings
    'development' => [
        'allow_test_endpoints' => env('APP_ENV') === 'local',
        'verbose_error_messages' => env('APP_DEBUG', false),
        'log_all_requests' => env('APP_ENV') === 'local',
    ],
    
];
