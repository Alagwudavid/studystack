import { NextRequest, NextResponse } from 'next/server';
import nodemailer from "nodemailer";
import contactFormSchema from "@/app/api/validation/contact-form";
import { z } from "zod";

// Rate limiting map (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function rateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

// Sanitize input to prevent XSS and injection attacks
function sanitizeInput(input: any): any {
    if (typeof input === 'string') {
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .trim();
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = sanitizeInput(value);
        }
        return sanitized;
    }
    return input;
}

export async function POST(request: NextRequest) {
    try {
        // Security headers
        const responseHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'",
        };

        // Get client IP for rate limiting
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

        // Apply rate limiting
        if (!rateLimit(ip)) {
            return NextResponse.json({
                success: false,
                message: "Too many requests. Please try again later.",
            }, {
                status: 429,
                headers: responseHeaders
            });
        }

        // Validate Content-Type
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return NextResponse.json({
                success: false,
                message: "Invalid content type. Expected application/json.",
            }, {
                status: 400,
                headers: responseHeaders
            });
        }

        // Check request size (prevent large payloads)
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 10000) { // 10KB limit
            return NextResponse.json({
                success: false,
                message: "Request payload too large.",
            }, {
                status: 413,
                headers: responseHeaders
            });
        }

        // Parse and sanitize the request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid JSON format.",
            }, {
                status: 400,
                headers: responseHeaders
            });
        }

        // Sanitize input data
        const sanitizedBody = sanitizeInput(body);

        // Validate form data
        const validatedData = contactFormSchema.parse(sanitizedBody);

        // Check if required environment variables are set
        if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD || !process.env.MAIL_RECEIVER_ADDRESS) {
            console.error("Missing required environment variables for email configuration");
            return NextResponse.json({
                success: false,
                message: "Email service is not configured properly. Please try again later.",
            }, {
                status: 500,
                headers: responseHeaders
            });
        }

        // Validate email domains (optional: restrict to certain domains)
        const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || [];
        if (allowedDomains.length > 0) {
            const emailDomain = validatedData.email.split('@')[1]?.toLowerCase();
            if (!allowedDomains.some(domain => emailDomain?.endsWith(domain.toLowerCase()))) {
                return NextResponse.json({
                    success: false,
                    message: "Email domain not allowed.",
                }, {
                    status: 403,
                    headers: responseHeaders
                });
            }
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
            // Security options
            secure: true,
            requireTLS: true,
        });

        // Verify transporter configuration
        await transporter.verify();

        const mailOptions = {
            from: process.env.SMTP_USERNAME, // Use authenticated email as sender
            to: process.env.MAIL_RECEIVER_ADDRESS,
            replyTo: validatedData.email, // Set reply-to as the form submitter's email
            subject: `Contact Form: ${validatedData.subject}`,
            text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}

Message:
${validatedData.message}
            `,
            html: `
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contact form email</title>
            </head>

            <body
                style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); line-height: 1.6;">
                <div
                    style="max-width: 720px; margin: 40px auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <!-- Main Content -->
                    <!-- Improved spacing, typography, and visual elements -->
                    <div style="padding: 24px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="display: flex; margin: 0px auto;width: fit-content;"><img
                                    src="https://public-109242794412.s3-accesspoint.us-east-2.amazonaws.com/assets/test_logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIARS33AYGWNQWKJMSE%2F20250905%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250905T211302Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBUaCXVzLWVhc3QtMiJHMEUCIQDDJmh0kI%2FJ8HpypllwhurmTBWS4OKNdSFtCva6dTzH8AIgSc7pzI9PbyMMnMgBUioO8wCiAckTPfBwxDnjtoY0%2B9Qq2gIIfhAAGgwxMDkyNDI3OTQ0MTIiDCqmzV0v5miIkX7uJiq3AhVwHLN6CHFctRwGnuxj%2B%2BxoVxBUEUXCfa9tpRG%2BMgIM0ZDwEnHK4vmbZmPRu7laV1HaNfqSVkpgn%2FZllCPLvLQmUZVsT9GVIyodRNiuFxl3oQ1RlP8d10GYAlHCiOZO0lKwI2AEmSmPNg2ijRIubSfRFQ8%2B2l4ggy6%2BmnktlRz%2BbyzP1vdkcmM1iVWUR7O447gQaS36At5ebDRysXw0nqDtbGL%2FihDdLYoC9PBxACLnu5pSY%2FxvCV7bdVYdNxrLKJdbLWxavAUK8EqoPAi7PgZbQFIdhKRjrc5dn%2BHMaxnhPHMJs25LcAUIXyW1xtGv1F1U8FXMdcLn%2BhHp98%2BpDvzCNghodGq43uyBBSO3JlfK2S54%2FwfYN8i6HvdOhfEIAsV%2F16rJm3QUU2tFTtVIzz3GCoyrPvGnMJ6X7cUGOq0CFY712PIHiJhXaxvupEgC3HFBNSe2K3B9UzT5AYT9bZ%2BNkuvtVLnipu32h%2BNYyPsZSxknRtKE61VqVy7m7006ayJPSEI%2Be0tCX%2BOBCCb2xVH3%2FYrCDOEY%2F6NGvKt3DdJfpy3a4Nct%2BTAPvJHs4BE0lh%2BnDiGuaDvM67B4ry5YdRTHT%2BSh54gKtO2ADKEEjg3YJkV1bZppq%2BJtc%2FUJ47SAFGKto%2Btn1nFjckKImiUWDcrrXZlrrqBCYjLrO8JuOMAVUUXjnz%2FU85c3ZQ5tZm9CyNdaOg2N%2Bnkp3in4Vq%2BzfhQ92D3DDrAfeTgeoa8%2FcD6rAEyHIAA%2FxTu0tOHufPFv103Umkk0aGii2J3kbmA7bsIwncglsLMoqiu8bsPMhM3z5WCivaXT%2BYNhtqeP5w%3D%3D&X-Amz-Signature=3add0d330d9e241037b06b5abc54622bc8181e29055f953e3ba2eb48238467c0&X-Amz-SignedHeaders=host&response-content-disposition=inline" alt="Bitroot Logo"
                                    style="width: 40px; height: 40px; margin-right: 12px;" />
                                <h2
                                    style="color: #1f2937; margin: 0 0 15px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    Bitroot contact-form.</h2>
                            </div>
                            <div
                                style="width: 60px; height: 4px; background: linear-gradient(90deg, #dc2626, #f59e0b); margin: 0 auto; border-radius: 2px;">
                            </div>
                        </div>

                        <!-- Enhanced info box with better styling and icons -->
                        <div
                            style="background: linear-gradient(135deg, #fef7f0 0%, #fef3ec 100%); border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;">
                            <div style="color: #6b7280; line-height: 1.7; font-size: 16px;">
                                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 8px;">
                                    <p style="margin: 10px 0;"><strong>Name:</strong> ${validatedData.name}</p>
                                    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                                    <p style="margin: 10px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
                                </div>
                                <div style="display: flex; align-items: flex-start;">
                                    <h3 style="color: #495057; margin-top: 0;">Message:</h3>
                                    <p style="color: #6c757d; white-space: pre-wrap;">${validatedData.message}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <!-- Enhanced footer with better typography and spacing -->
                        <div style="text-align: center;">
                            <div style="margin: 20px 0;">
                                <p style="color: #dc2626; margin: 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
                                    The Bitroot Team
                                </p>
                                <div style="width: 40px; height: 2px; background: #dc2626; margin: 8px auto; border-radius: 1px;">
                                </div>
                            </div>
                        </div>
                    </div>
            </body>
            </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Thank you! Your message has been sent successfully. We'll get back to you soon."
        }, {
            status: 200,
            headers: responseHeaders
        });

    } catch (error) {
        console.error("Error sending email:", error);

        const responseHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'",
        };

        // Handle specific error types
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Please check your form inputs and try again.",
                errors: error.errors
            }, {
                status: 400,
                headers: responseHeaders
            });
        }

        if (error instanceof Error) {
            // Handle specific nodemailer errors
            if (error.message.includes('authentication') || error.message.includes('auth')) {
                return NextResponse.json({
                    success: false,
                    message: "Email service authentication failed. Please try again later.",
                }, {
                    status: 500,
                    headers: responseHeaders
                });
            }

            if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
                return NextResponse.json({
                    success: false,
                    message: "Network error occurred. Please check your connection and try again.",
                }, {
                    status: 500,
                    headers: responseHeaders
                });
            }

            if (error.message.includes('timeout')) {
                return NextResponse.json({
                    success: false,
                    message: "Request timed out. Please try again.",
                }, {
                    status: 408,
                    headers: responseHeaders
                });
            }
        }

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred while sending your message. Please try again later.",
        }, {
            status: 500,
            headers: responseHeaders
        });
    }
}

// Handle other HTTP methods
export async function GET() {
    const responseHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'",
    };

    return NextResponse.json({
        message: "Contact API endpoint. Use POST method to send contact form data."
    }, {
        status: 405,
        headers: responseHeaders
    });
}
