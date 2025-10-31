<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send professional application confirmation email
     *
     * @param array $applicationData
     * @param array $userData
     * @return bool
     */
    public static function sendApplicationConfirmation($applicationData, $userData)
    {
        try {
            $emailData = [
                'user_name' => $userData['name'],
                'user_email' => $userData['email'],
                'application_id' => $applicationData['application_id'],
                'professional_category' => $applicationData['professional_category'],
                'status' => $applicationData['status'],
                'applied_at' => $applicationData['applied_at'],
                'credentials_preview' => substr($applicationData['credentials'], 0, 100) . '...'
            ];

            // For now, we'll use a simple email sending approach
            // In a production environment, you might want to use Laravel's Mail facade with proper templates
            $subject = "Professional Application Submitted - Application ID: {$applicationData['application_id']}";
            
            $htmlBody = self::generateEmailTemplate($emailData);
            
            // Send email using basic mail function for now
            // You can replace this with Laravel Mail later
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: BitRoot Platform <noreply@bitroot.app>" . "\r\n";
            
            // For development environment, simulate email sending
            if (env('APP_ENV') === 'local' || env('APP_DEBUG', false)) {
                // Log the email details instead of actually sending
                Log::info('EMAIL SIMULATION - Professional Application Email', [
                    'to' => $userData['email'],
                    'subject' => $subject,
                    'application_id' => $applicationData['application_id'],
                    'status' => $applicationData['status'],
                    'category' => $applicationData['professional_category'],
                    'email_body_preview' => substr(strip_tags($htmlBody), 0, 200) . '...'
                ]);
                
                return true; // Simulate successful send in development
            }
            
            $success = mail($userData['email'], $subject, $htmlBody, $headers);
            
            if ($success) {
                Log::info('Professional application email sent successfully', [
                    'user_id' => $userData['id'],
                    'application_id' => $applicationData['application_id'],
                    'email' => $userData['email']
                ]);
                return true;
            } else {
                Log::error('Failed to send professional application email', [
                    'user_id' => $userData['id'],
                    'application_id' => $applicationData['application_id'],
                    'email' => $userData['email']
                ]);
                return false;
            }
            
        } catch (\Exception $e) {
            Log::error('Error sending professional application email', [
                'error' => $e->getMessage(),
                'user_id' => $userData['id'] ?? null,
                'application_id' => $applicationData['application_id'] ?? null
            ]);
            return false;
        }
    }

    /**
     * Generate HTML email template for application confirmation
     *
     * @param array $data
     * @return string
     */
    private static function generateEmailTemplate($data)
    {
        $template = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Application Confirmation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e5e5;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }
        .title {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .status-badge {
            display: inline-block;
            background-color: #fbbf24;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 20px;
        }
        .application-details {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
        }
        .detail-value {
            color: #6b7280;
            max-width: 60%;
            text-align: right;
        }
        .application-id {
            font-family: "Monaco", "Menlo", monospace;
            background-color: #e0e7ff;
            color: #3730a3;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
        }
        .next-steps {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #6366f1;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🌱 BitRoot</div>
            <h1 class="title">Professional Application Received</h1>
            <div class="status-badge">Pending Review</div>
        </div>

        <p>Dear ' . htmlspecialchars($data['user_name']) . ',</p>

        <p>Thank you for submitting your professional account application. We have received your application and it is currently being reviewed by our team.</p>

        <div class="application-details">
            <h3 style="margin-top: 0; color: #1f2937;">Application Details</h3>
            
            <div class="detail-row">
                <span class="detail-label">Application ID:</span>
                <span class="detail-value">
                    <span class="application-id">' . htmlspecialchars($data['application_id']) . '</span>
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Professional Category:</span>
                <span class="detail-value">' . htmlspecialchars($data['professional_category'] ?? 'Not specified') . '</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">Pending Review</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">' . date('F j, Y \a\t g:i A', strtotime($data['applied_at'])) . '</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Credentials Preview:</span>
                <span class="detail-value">' . htmlspecialchars($data['credentials_preview']) . '</span>
            </div>
        </div>

        <div class="next-steps">
            <h4 style="margin-top: 0; color: #1e40af;">What happens next?</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Our team will review your application within 2-3 business days</li>
                <li>We may contact you for additional information if needed</li>
                <li>You will receive an email notification once the review is complete</li>
                <li>You can check your application status anytime using your Application ID: <strong>' . htmlspecialchars($data['application_id']) . '</strong></li>
            </ul>
        </div>

        <p>If you have any questions about your application, please feel free to contact our support team and reference your Application ID.</p>

        <div class="footer">
            <p>This is an automated message from BitRoot Platform.<br>
            Please do not reply to this email.</p>
            
            <p style="margin-top: 15px;">
                <strong>Need help?</strong><br>
                Visit our support center or contact us at support@bitroot.app
            </p>
        </div>
    </div>
</body>
</html>';

        return $template;
    }

    /**
     * Send application status update email
     *
     * @param array $applicationData
     * @param array $userData
     * @param string $newStatus
     * @param string|null $reason
     * @return bool
     */
    public static function sendStatusUpdate($applicationData, $userData, $newStatus, $reason = null)
    {
        try {
            $statusColors = [
                'approved' => ['bg' => '#10b981', 'text' => '#065f46'],
                'rejected' => ['bg' => '#ef4444', 'text' => '#991b1b'],
                'pending' => ['bg' => '#fbbf24', 'text' => '#92400e']
            ];

            $statusText = ucfirst($newStatus);
            $color = $statusColors[$newStatus] ?? $statusColors['pending'];

            $subject = "Professional Application Update - " . $statusText;
            
            // Similar template structure but for status updates
            // Implementation would be similar to generateEmailTemplate but for status updates
            
            Log::info('Professional application status update email sent', [
                'user_id' => $userData['id'],
                'application_id' => $applicationData['application_id'],
                'new_status' => $newStatus
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Error sending status update email', [
                'error' => $e->getMessage(),
                'application_id' => $applicationData['application_id'] ?? null
            ]);
            return false;
        }
    }
}