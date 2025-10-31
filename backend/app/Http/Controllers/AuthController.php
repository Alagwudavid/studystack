<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Request verification code for email
     */
    public function requestCode(Request $request)
    {
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

        $email = $request->email;

        // Delete any existing unused codes for this email
        VerificationCode::where('email', $email)
            ->whereNull('used_at')
            ->delete();

        // Generate new verification code
        $code = VerificationCode::generateCode(6);
        $expiresAt = Carbon::now()->addMinutes(10); // Code expires in 10 minutes

        // Create verification code record
        $verificationCode = VerificationCode::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => $expiresAt,
        ]);

        // Send email with verification code
        try {
            $htmlContent = $this->generateVerificationCodeEmailTemplate($code);

            Mail::raw("Your Bitroot verification code is: {$code}\n\nThis code will expire in 10 minutes.", function ($message) use ($email, $htmlContent) {
                $message->to($email)
                        ->subject('Your Bitroot Verification Code')
                        ->html($htmlContent);
            });

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your email',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify code and authenticate user (simplified without JWT for now)
     */
    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $code = strtoupper($request->code);

        // Find valid verification code
        $verificationCode = VerificationCode::where('email', $email)
            ->where('code', $code)
            ->valid()
            ->first();

        if (!$verificationCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code',
            ], 401);
        }

        // Mark code as used
        $verificationCode->markAsUsed();

        // Find or create user
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Create new user if doesn't exist
            $user = User::create([
                'name' => explode('@', $email)[0], // Use email prefix as default name
                'email' => $email,
                'email_verified_at' => now(),
            ]);
        } else {
            // Update email verification if not already verified
            if (!$user->email_verified_at) {
                $user->update(['email_verified_at' => now()]);
            }
        }

        // Associate verification code with user
        $verificationCode->update(['user_id' => $user->id]);

        // For now, return a simple token (we'll add JWT later)
        $simpleToken = base64_encode($user->id . ':' . now()->timestamp);

        return response()->json([
            'success' => true,
            'message' => 'Authentication successful',
            'data' => [
                'user' => $user,
                'token' => $simpleToken,
                'token_type' => 'bearer',
                'expires_in' => 3600, // 1 hour
            ],
        ]);
    }

    /**
     * Get authenticated user profile (simplified)
     */
    public function profile(Request $request)
    {
        // Simple token validation for now
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile endpoint working (simplified)',
            'data' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => 'test@example.com',
            ],
        ]);
    }

    /**
     * Logout user (simplified)
     */
    public function logout()
    {
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Generate HTML template for verification code email
     */
    private function generateVerificationCodeEmailTemplate(string $code): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"utf-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>Your Bitroot Verification Code</title>
        </head>
        <body style=\"margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); line-height: 1.6;\">
            <div style=\"max-width: 720px; margin: 40px auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\">
                <!-- Main Content -->
                <div style=\"padding: 24px;\">
                    <!-- Header -->
                    <div style=\"text-align: center; margin-bottom: 40px;\">
                        <div style=\"display: flex; margin: 0px auto;width: fit-content;\">
                            <img src=\"https://public-109242794412.s3-accesspoint.us-east-2.amazonaws.com/assets/test_logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIARS33AYGWNQWKJMSE%2F20250905%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250905T211302Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBUaCXVzLWVhc3QtMiJHMEUCIQDDJmh0kI%2FJ8HpypllwhurmTBWS4OKNdSFtCva6dTzH8AIgSc7pzI9PbyMMnMgBUioO8wCiAckTPfBwxDnjtoY0%2B9Qq2gIIfhAAGgwxMDkyNDI3OTQ0MTIiDCqmzV0v5miIkX7uJiq3AhVwHLN6CHFctRwGnuxj%2B%2BxoVxBUEUXCfa9tpRG%2BMgIM0ZDwEnHK4vmbZmPRu7laV1HaNfqSVkpgn%2FZllCPLvLQmUZVsT9GVIyodRNiuFxl3oQ1RlP8d10GYAlHCiOZO0lKwI2AEmSmPNg2ijRIubSfRFQ8%2B2l4ggy6%2BmnktlRz%2BbyzP1vdkcmM1iVWUR7O447gQaS36At5ebDRysXw0nqDtbGL%2FihDdLYoC9PBxACLnu5pSY%2FxvCV7bdVYdNxrLKJdbLWxavAUK8EqoPAi7PgZbQFIdhKRjrc5dn%2BHMaxnhPHMJs25LcAUIXyW1xtGv1F1U8FXMdcLn%2BhHp98%2BpDvzCNghodGq43uyBBSO3JlfK2S54%2FwfYN8i6HvdOhfEIAsV%2F16rJm3QUU2tFTtVIzz3GCoyrPvGnMJ6X7cUGOq0CFY712PIHiJhXaxvupEgC3HFBNSe2K3B9UzT5AYT9bZ%2BNkuvtVLnipu32h%2BNYyPsZSxknRtKE61VqVy7m7006ayJPSEI%2Be0tCX%2BOBCCb2xVH3%2FYrCDOEY%2F6NGvKt3DdJfpy3a4Nct%2BTAPvJHs4BE0lh%2BnDiGuaDvM67B4ry5YdRTHT%2BSh54gKtO2ADKEEjg3YJkV1bZppq%2BJtc%2FUJ47SAFGKto%2Btn1nFjckKImiUWDcrrXZlrrqBCYjLrO8JuOMAVUUXjnz%2FU85c3ZQ5tZm9CyNdaOg2N%2Bnkp3in4Vq%2BzfhQ92D3DDrAfeTgeoa8%2FcD6rAEyHIAA%2FxTu0tOHufPFv103Umkk0aGii2J3kbmA7bsIwncglsLMoqiu8bsPMhM3z5WCivaXT%2BYNhtqeP5w%3D%3D&X-Amz-Signature=3add0d330d9e241037b06b5abc54622bc8181e29055f953e3ba2eb48238467c0&X-Amz-SignedHeaders=host&response-content-disposition=inline\" alt=\"Bitroot Logo\" style=\"width: 40px; height: 40px; margin-right: 12px;\" />
                            <h2 style=\"color: #1f2937; margin: 0 0 15px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;\">Bitroot</h2>
                        </div>
                        <div style=\"width: 60px; height: 4px; background: linear-gradient(90deg, #dc2626, #f59e0b); margin: 0 auto; border-radius: 2px;\"></div>
                    </div>

                    <!-- Enhanced info box with better styling -->
                    <div style=\"background: linear-gradient(135deg, #fef7f0 0%, #fef3ec 100%); border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;\">
                        <div style=\"color: #6b7280; line-height: 1.7; font-size: 16px; text-align: center;\">
                            <h3 style=\"color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;\">Verification Code</h3>
                            <p style=\"margin: 10px 0; font-size: 18px;\">Your verification code is: </p>

                            <div style=\"background: #ffffff; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;\">
                                <div style=\"font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', monospace;\">{$code}</div>
                            </div>

                            <p style=\"margin: 16px 0; color: #6b7280;\">This code will expire in 10 minutes.</p>
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
}
