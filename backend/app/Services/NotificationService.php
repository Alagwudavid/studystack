<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create a new notification with enhanced security validation
     */
    public function createNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        array $data = [],
        string $channel = 'in_app'
    ): int {
        // Security validation
        if ($userId <= 0) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        // Sanitize and validate inputs
        $type = trim(strip_tags($type));
        $title = trim(strip_tags($title));
        $message = trim(strip_tags($message));
        $channel = trim(strip_tags($channel));

        // Security: Limit content length to prevent DoS
        if (strlen($title) > 255) {
            $title = substr($title, 0, 255);
        }

        if (strlen($message) > 1000) {
            $message = substr($message, 0, 1000);
        }

        // Validate allowed types and channels
        $allowedTypes = ['login_alert', 'welcome', 'security_alert', 'system', 'test'];
        $allowedChannels = ['in_app', 'email', 'both'];

        if (!in_array($type, $allowedTypes)) {
            throw new \InvalidArgumentException('Invalid notification type');
        }

        if (!in_array($channel, $allowedChannels)) {
            throw new \InvalidArgumentException('Invalid notification channel');
        }

        // Security: Validate and sanitize data array
        $data = $this->sanitizeNotificationData($data);

        return DB::table('notifications')->insertGetId([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => json_encode($data),
            'channel' => $channel,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Sanitize notification data array to prevent XSS and injection
     */
    private function sanitizeNotificationData(array $data): array {
        $sanitized = [];

        foreach ($data as $key => $value) {
            // Sanitize key
            $key = preg_replace('/[^a-zA-Z0-9_-]/', '', $key);

            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeNotificationData($value);
            } elseif (is_string($value)) {
                // Remove scripts and sanitize HTML
                $value = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $value);
                $sanitized[$key] = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
            } elseif (is_numeric($value) || is_bool($value)) {
                $sanitized[$key] = $value;
            }
            // Ignore other data types for security
        }

        return $sanitized;
    }

    /**
     * Send login alert notification
     */
    public function sendLoginAlert(int $userId, array $sessionData): bool
    {
        try {
            $user = DB::table('users')->where('id', $userId)->first();
            if (!$user) {
                return false;
            }

            // Create in-app notification
            $title = 'New Login Detected';
            $message = sprintf(
                'New login from %s %s on %s at %s',
                $sessionData['browser'] ?? 'Unknown Browser',
                $sessionData['operating_system'] ?? 'Unknown OS',
                $sessionData['device_type'] ?? 'Unknown Device',
                now()->format('M d, Y \a\t g:i A')
            );

            $data = [
                'session_id' => $sessionData['id'] ?? null,
                'ip_address' => $sessionData['ip_address'] ?? null,
                'location' => $sessionData['location'] ?? null,
                'device_info' => [
                    'browser' => $sessionData['browser'] ?? null,
                    'operating_system' => $sessionData['operating_system'] ?? null,
                    'device_type' => $sessionData['device_type'] ?? null,
                ],
                'logged_in_at' => $sessionData['logged_in_at'] ?? now(),
            ];

            // Create in-app notification
            $notificationId = $this->createNotification(
                $userId,
                'login_alert',
                $title,
                $message,
                $data,
                'in_app'
            );

            // Mark in-app notification as sent
            $this->markNotificationAsSent($notificationId);

            // Send email notification
            $this->sendLoginAlertEmail($user, $sessionData);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send login alert', [
                'user_id' => $userId,
                'session_data' => $sessionData,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Send welcome email for new users
     */
    public function sendWelcomeNotification(int $userId): bool
    {
        try {
            $user = DB::table('users')->where('id', $userId)->first();
            if (!$user) {
                return false;
            }

            // Create in-app notification
            $title = 'Welcome to Bitroot!';
            $message = 'Welcome to Bitroot! We\'re excited to have you join our learning community. Start exploring courses, connect with other learners, and begin your learning journey today.';

            $data = [
                'welcome_tips' => [
                    'Complete your profile to get personalized recommendations',
                    'Explore our learning paths to find courses that interest you',
                    'Join study groups to connect with other learners',
                    'Set learning goals to track your progress',
                ],
                'getting_started_url' => '/learn/getting-started',
                'profile_setup_url' => '/profile/setup',
            ];

            // Create in-app notification
            $notificationId = $this->createNotification(
                $userId,
                'welcome',
                $title,
                $message,
                $data,
                'in_app'
            );

            // Mark in-app notification as sent
            $this->markNotificationAsSent($notificationId);

            // Send welcome email
            $this->sendWelcomeEmail($user);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send welcome notification', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Send email notification for new login
     */
    private function sendLoginAlertEmail($user, array $sessionData): void
    {
        try {
            $emailData = [
                'user_name' => $user->name,
                'user_email' => $user->email,
                'login_time' => now()->format('M d, Y \a\t g:i A T'),
                'device_info' => [
                    'browser' => $sessionData['browser'] ?? 'Unknown Browser',
                    'operating_system' => $sessionData['operating_system'] ?? 'Unknown OS',
                    'device_type' => $sessionData['device_type'] ?? 'Unknown Device',
                ],
                'ip_address' => $sessionData['ip_address'] ?? 'Unknown IP',
                'location' => $sessionData['location'] ?? 'Unknown Location',
            ];

            $subject = 'New Login to Your Bitroot Account';

            $htmlContent = $this->generateLoginAlertEmailTemplate($emailData);
            $textContent = $this->generateLoginAlertTextContent($emailData);

            Mail::raw($textContent, function ($message) use ($user, $subject, $htmlContent) {
                $message->to($user->email, $user->name)
                    ->subject($subject)
                    ->html($htmlContent);
            });

            Log::info('Login alert email sent successfully', [
                'user_id' => $user->id,
                'user_email' => $user->email
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send login alert email', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send welcome email for new users
     */
    private function sendWelcomeEmail($user): void
    {
        try {
            $emailData = [
                'user_name' => $user->name,
                'user_email' => $user->email,
                'join_date' => $user->created_at,
                'app_url' => env('APP_URL', 'https://bitroot.com'),
            ];

            $subject = 'Welcome to Bitroot - Start Your Learning Journey!';

            $htmlContent = $this->generateWelcomeEmailTemplate($emailData);
            $textContent = $this->generateWelcomeTextContent($emailData);

            Mail::raw($textContent, function ($message) use ($user, $subject, $htmlContent) {
                $message->to($user->email, $user->name)
                    ->subject($subject)
                    ->html($htmlContent);
            });

            Log::info('Welcome email sent successfully', [
                'user_id' => $user->id,
                'user_email' => $user->email
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Generate HTML template for login alert email
     */
    private function generateLoginAlertEmailTemplate(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"utf-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>New Login Alert - Bitroot</title>
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
                        <div style=\"color: #6b7280; line-height: 1.7; font-size: 16px;\">
                            <h3 style=\"color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;\">New Login Alert</h3>
                            <p style=\"margin: 10px 0;\">Hi <strong>{$data['user_name']}</strong>,</p>
                            <p style=\"margin: 10px 0;\">We detected a new login to your Bitroot account with the following details:</p>

                            <div style=\"background: #ffffff; border-radius: 8px; padding: 16px; margin: 16px 0;\">
                                <p style=\"margin: 5px 0;\"><strong>Time:</strong> {$data['login_time']}</p>
                                <p style=\"margin: 5px 0;\"><strong>Device:</strong> {$data['device_info']['device_type']}</p>
                                <p style=\"margin: 5px 0;\"><strong>Browser:</strong> {$data['device_info']['browser']}</p>
                                <p style=\"margin: 5px 0;\"><strong>Operating System:</strong> {$data['device_info']['operating_system']}</p>
                                <p style=\"margin: 5px 0;\"><strong>IP Address:</strong> {$data['ip_address']}</p>
                                <p style=\"margin: 5px 0;\"><strong>Location:</strong> {$data['location']}</p>
                            </div>

                            <div style=\"background: #e8f5e8; border-radius: 8px; padding: 16px; margin: 16px 0;\">
                                <h4 style=\"color: #495057; margin: 0 0 8px 0; font-size: 16px;\">Was this you?</h4>
                                <p style=\"margin: 5px 0;\">If you recognize this login, no action is needed.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style=\"text-align: center;\">
                        <div style=\"margin: 20px 0;\">
                            <p style=\"color: #dc2626; margin: 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;\">The Bitroot Security Team</p>
                            <div style=\"width: 40px; height: 2px; background: #dc2626; margin: 8px auto; border-radius: 1px;\"></div>
                        </div>
                        <p style=\"color: #6c757d; font-size: 14px; margin: 10px 0;\">This is an automated security notification from Bitroot.</p>
                        <p style=\"color: #6c757d; font-size: 14px; margin: 10px 0;\">If you didn't request this, please contact support immediately.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Generate text content for login alert email
     */
    private function generateLoginAlertTextContent(array $data): string
    {
        return "
SECURITY ALERT: New Login to Your Bitroot Account

Hi {$data['user_name']},

We detected a new login to your Bitroot account with the following details:

LOGIN DETAILS:
- Time: {$data['login_time']}
- Device: {$data['device_info']['device_type']}
- Browser: {$data['device_info']['browser']}
- Operating System: {$data['device_info']['operating_system']}
- IP Address: {$data['ip_address']}
- Location: {$data['location']}

WAS THIS YOU?
If you recognize this login, no action is needed. If you don't recognize this activity:
- Change your password immediately
- Review your account security settings
- Contact our support team if you need assistance

If you have any concerns about your account security, please contact our support team immediately.

Best regards,
The Bitroot Security Team

---
This is an automated security notification from Bitroot.
If you didn't request this, please contact support immediately.
© " . date('Y') . " Bitroot. All rights reserved.";
    }

    /**
     * Generate HTML template for welcome email
     */
    private function generateWelcomeEmailTemplate(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"utf-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>Welcome to Bitroot!</title>
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
                            <h3 style=\"color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;\">🎉 Welcome to Bitroot!</h3>
                            <p style=\"margin: 10px 0; font-size: 18px;\">Hi <strong>{$data['user_name']}</strong>! 👋</p>
                            <p style=\"margin: 10px 0;\">We're thrilled to have you join our vibrant learning community. Get ready to unlock your potential and achieve your learning goals!</p>

                            <div style=\"background: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left;\">
                                <h4 style=\"color: #495057; margin: 0 0 12px 0; font-size: 18px; text-align: center;\">🚀 What you can do with Bitroot:</h4>
                                <div style=\"margin: 12px 0;\">
                                    <p style=\"margin: 8px 0;\"><strong>📚 Explore Courses:</strong> Discover thousands of courses across various subjects and skill levels.</p>
                                    <p style=\"margin: 8px 0;\"><strong>👥 Join Study Groups:</strong> Connect with fellow learners and study together in collaborative groups.</p>
                                    <p style=\"margin: 8px 0;\"><strong>🎯 Track Progress:</strong> Set goals, track your learning progress, and earn achievements.</p>
                                    <p style=\"margin: 8px 0;\"><strong>💬 Get Support:</strong> Access mentors and expert guidance whenever you need help.</p>
                                </div>
                            </div>

                            <div style=\"margin: 20px 0;\">
                                <h4 style=\"color: #495057; margin: 0 0 12px 0; font-size: 16px;\">Ready to get started?</h4>
                                <div style=\"margin: 12px 0;\">
                                    <a href=\"{$data['app_url']}/learn\" style=\"display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 4px;\">🎓 Browse Courses</a>
                                    <a href=\"{$data['app_url']}/profile/setup\" style=\"display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 4px;\">⚙️ Complete Profile</a>
                                </div>
                            </div>

                            <div style=\"background: #e8f5e8; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: left;\">
                                <h4 style=\"color: #495057; margin: 0 0 8px 0; font-size: 16px;\">💡 Pro Tips for Success:</h4>
                                <ul style=\"margin: 8px 0; padding-left: 20px;\">
                                    <li>Complete your profile to get personalized recommendations</li>
                                    <li>Set learning goals to stay motivated and focused</li>
                                    <li>Join communities that match your interests</li>
                                    <li>Engage actively by asking questions and sharing knowledge</li>
                                    <li>Practice regularly to build consistent learning habits</li>
                                </ul>
                            </div>

                            <p style=\"margin: 16px 0; font-size: 14px;\">Need help getting started? Our <a href=\"{$data['app_url']}/support\" style=\"color: #dc2626; text-decoration: none;\">support team</a> is here to help!</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style=\"text-align: center;\">
                        <div style=\"margin: 20px 0;\">
                            <p style=\"color: #dc2626; margin: 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;\">The Bitroot Team 🌟</p>
                            <div style=\"width: 40px; height: 2px; background: #dc2626; margin: 8px auto; border-radius: 1px;\"></div>
                        </div>
                        <p style=\"color: #6c757d; font-size: 14px; margin: 10px 0;\">Welcome to the Bitroot learning community!</p>
                        <p style=\"color: #6c757d; font-size: 14px; margin: 10px 0;\">Follow us on social media for tips, updates, and inspiration.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Generate text content for welcome email
     */
    private function generateWelcomeTextContent(array $data): string
    {
        return "
🎉 WELCOME TO BITROOT!

Hi {$data['user_name']}!

We're thrilled to have you join our vibrant learning community. Get ready to unlock your potential and achieve your learning goals!

🚀 WHAT YOU CAN DO WITH BITROOT:

📚 Explore Courses
Discover thousands of courses across various subjects and skill levels.

👥 Join Study Groups
Connect with fellow learners and study together in collaborative groups.

🎯 Track Progress
Set goals, track your learning progress, and earn achievements.

💬 Get Support
Access mentors and expert guidance whenever you need help.

READY TO GET STARTED?
- Browse Courses: {$data['app_url']}/learn
- Complete Profile: {$data['app_url']}/profile/setup

💡 PRO TIPS FOR SUCCESS:
• Complete your profile to get personalized recommendations
• Set learning goals to stay motivated and focused
• Join communities that match your interests
• Engage actively by asking questions and sharing knowledge
• Practice regularly to build consistent learning habits

Need help getting started? Our support team is here to help: {$data['app_url']}/support

Once again, welcome to Bitroot! We can't wait to see what you'll achieve.

Happy learning!
The Bitroot Team 🌟

---
Welcome to the Bitroot learning community!
© " . date('Y') . " Bitroot. All rights reserved.";
    }

    /**
     * Mark notification as sent
     */
    public function markNotificationAsSent(int $notificationId): bool
    {
        return DB::table('notifications')
            ->where('id', $notificationId)
            ->update([
                'status' => 'sent',
                'sent_at' => now(),
                'updated_at' => now(),
            ]) > 0;
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(int $notificationId): bool
    {
        return DB::table('notifications')
            ->where('id', $notificationId)
            ->update([
                'status' => 'read',
                'read_at' => now(),
                'updated_at' => now(),
            ]) > 0;
    }

    /**
     * Get user notifications with enhanced security validation
     */
    public function getUserNotifications(int $userId, int $limit = 20, int $offset = 0): array
    {
        // Security validation
        if ($userId <= 0) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        // Security: Strict limits to prevent resource exhaustion
        $limit = min(max($limit, 1), 50); // Between 1-50
        $offset = max($offset, 0); // Non-negative only

        // Security: Validate user exists before querying notifications
        $userExists = DB::table('users')->where('id', $userId)->exists();
        if (!$userExists) {
            return [];
        }

        $notifications = DB::table('notifications')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->offset($offset)
            ->get();

        return $notifications->map(function ($notification) {
            // Security: Validate and sanitize notification data before returning
            $data = null;
            if (!empty($notification->data)) {
                $decodedData = json_decode($notification->data, true);
                $data = is_array($decodedData) ? $this->sanitizeNotificationData($decodedData) : null;
            }

            return [
                'id' => (int) $notification->id,
                'type' => htmlspecialchars($notification->type, ENT_QUOTES, 'UTF-8'),
                'title' => htmlspecialchars($notification->title, ENT_QUOTES, 'UTF-8'),
                'message' => htmlspecialchars($notification->message, ENT_QUOTES, 'UTF-8'),
                'data' => $data,
                'status' => htmlspecialchars($notification->status, ENT_QUOTES, 'UTF-8'),
                'sent_at' => $notification->sent_at,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        })->toArray();
    }

    /**
     * Get only unread notifications for initial load (prevent old notifications showing as new)
     */
    public function getUnreadNotifications(int $userId, int $limit = 20): array
    {
        // Security validation
        if ($userId <= 0) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        // Security: Strict limits to prevent resource exhaustion
        $limit = min(max($limit, 1), 50); // Between 1-50

        // Security: Validate user exists before querying notifications
        $userExists = DB::table('users')->where('id', $userId)->exists();
        if (!$userExists) {
            return [];
        }

        $notifications = DB::table('notifications')
            ->where('user_id', $userId)
            ->where('status', '!=', 'read')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $notifications->map(function ($notification) {
            // Security: Validate and sanitize notification data before returning
            $data = null;
            if (!empty($notification->data)) {
                $decodedData = json_decode($notification->data, true);
                $data = is_array($decodedData) ? $this->sanitizeNotificationData($decodedData) : null;
            }

            return [
                'id' => (int) $notification->id,
                'type' => htmlspecialchars($notification->type, ENT_QUOTES, 'UTF-8'),
                'title' => htmlspecialchars($notification->title, ENT_QUOTES, 'UTF-8'),
                'message' => htmlspecialchars($notification->message, ENT_QUOTES, 'UTF-8'),
                'data' => $data,
                'status' => htmlspecialchars($notification->status, ENT_QUOTES, 'UTF-8'),
                'sent_at' => $notification->sent_at,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        })->toArray();
    }

    /**
     * Get notifications created since a specific timestamp
     */
    public function getNotificationsSince(int $userId, string $timestamp, int $limit = 20): array
    {
        // Security validation
        if ($userId <= 0) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        // Security: Strict limits to prevent resource exhaustion
        $limit = min(max($limit, 1), 50); // Between 1-50

        // Security: Validate user exists before querying notifications
        $userExists = DB::table('users')->where('id', $userId)->exists();
        if (!$userExists) {
            return [];
        }

        $notifications = DB::table('notifications')
            ->where('user_id', $userId)
            ->where('created_at', '>', $timestamp)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $notifications->map(function ($notification) {
            // Security: Validate and sanitize notification data before returning
            $data = null;
            if (!empty($notification->data)) {
                $decodedData = json_decode($notification->data, true);
                $data = is_array($decodedData) ? $this->sanitizeNotificationData($decodedData) : null;
            }

            return [
                'id' => (int) $notification->id,
                'type' => htmlspecialchars($notification->type, ENT_QUOTES, 'UTF-8'),
                'title' => htmlspecialchars($notification->title, ENT_QUOTES, 'UTF-8'),
                'message' => htmlspecialchars($notification->message, ENT_QUOTES, 'UTF-8'),
                'data' => $data,
                'status' => htmlspecialchars($notification->status, ENT_QUOTES, 'UTF-8'),
                'sent_at' => $notification->sent_at,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        })->toArray();
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadNotificationsCount(int $userId): int
    {
        return DB::table('notifications')
            ->where('user_id', $userId)
            ->where('status', '!=', 'read')
            ->count();
    }
}
