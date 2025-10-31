import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create transporter using environment variables
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // Use Gmail service instead of manual config
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed certificates
        },
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 60000, // 60 seconds
    })
}

// Email template
const createEmailTemplate = (email: string) => {
    return {
        subject: 'You are on the Waitlist!',
        html: `
            <!DOCTYPE html>
                <html>

                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Bitroot</title>
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
                                        Bitroot Beta.</h2>
                                </div>
                                <div
                                    style="width: 60px; height: 4px; background: linear-gradient(90deg, #dc2626, #f59e0b); margin: 0 auto; border-radius: 2px;">
                                </div>
                            </div>

                            <p style="color: #4b5563; line-height: 1.7; margin: 0 0 24px 0; font-size: 17px; text-align: center;">
                                Thank you for joining our exclusive waitlist. You're now part of a movement that will revolutionize how
                                African stories and cultures are shared with the world.
                            </p>

                            <!-- Enhanced info box with better styling and icons -->
                            <div
                                style="background: linear-gradient(135deg, #fef7f0 0%, #fef3ec 100%); border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;">
                                <h3
                                    style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                                    What's Next?
                                </h3>
                                <div style="color: #6b7280; line-height: 1.7; font-size: 16px;">
                                    <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                        <span style="color: #dc2626; margin-right: 12px; font-weight: bold;">•</span>
                                        <span>We're working hard to bring you an amazing platform</span>
                                    </div>
                                    <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                        <span style="color: #dc2626; margin-right: 12px; font-weight: bold;">•</span>
                                        <span>You'll be among the first to get early access</span>
                                    </div>
                                    <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                        <span style="color: #dc2626; margin-right: 12px; font-weight: bold;">•</span>
                                        <span>Expect exclusive updates and behind-the-scenes content</span>
                                    </div>
                                    <div style="display: flex; align-items: flex-start;">
                                        <span style="color: #dc2626; margin-right: 12px; font-weight: bold;">•</span>
                                        <span>No spam, just meaningful updates about our progress</span>
                                    </div>
                                </div>
                            </div>

                            <p
                                style="color: #4b5563; line-height: 1.7; margin: 24px 0; font-size: 16px; text-align: center; padding: 0 20px;">
                                Our mission is to create an African-owned social space that showcases the richness and diversity of our
                                continent's stories, providing authentic storytelling and educational content without limitations.
                            </p>
                            
                            <!-- Call to Action -->
                            <!-- Enhanced CTA button with better styling and hover effects -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://bitroot.com.ng"
                                    style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.1); transition: all 0.3s ease; border: 2px solid transparent;">
                                    Visit Our Website
                                </a>
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
        text: `
        Welcome to Bitroot! 🔥

        Thank you for joining our waitlist. You're now part of an exclusive group that will be the first to experience our platform.

        What's Next?
        - We're working hard to bring you an amazing platform
        - You'll be among the first to get early access  
        - Expect exclusive updates and behind-the-scenes content
        - No spam, just meaningful updates about our progress

        Our mission is to create an African-owned media space that showcases the richness and diversity of our continent's stories.

        Stay tuned for updates!

        Best regards,
        The Bitroot Team

        ---
        You received this email because you joined the Bitroot waitlist.
        If you no longer wish to receive updates, you can unsubscribe at any time.
    `
    }
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Create transporter
        const transporter = createTransporter()

        // Verify SMTP connection with detailed logging
        try {
            console.log('🔍 Testing SMTP connection...')
            console.log('SMTP Config:', {
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                user: process.env.SMTP_USERNAME ? 'configured' : 'missing',
                pass: process.env.SMTP_PASSWORD ? 'configured' : 'missing'
            })

            await transporter.verify()
            console.log('✅ SMTP connection verified successfully')
        } catch (verifyError: any) {
            console.error('❌ SMTP verification failed:', {
                code: verifyError.code,
                errno: verifyError.errno,
                syscall: verifyError.syscall,
                address: verifyError.address,
                port: verifyError.port,
                command: verifyError.command
            })

            // For now, don't fail completely - try to send anyway
            console.log('⚠️ Skipping verification, attempting to send email directly...')

            // Uncomment this line if you want to fail completely on verification error
            // return NextResponse.json({ error: 'Email service temporarily unavailable' }, { status: 503 })
        }

        // Create email content
        const emailTemplate = createEmailTemplate(email)

        // Send email
        const mailOptions = {
            from: {
                name: 'Bitroot Team',
                address: process.env.SMTP_USERNAME || 'noreply@bitroot.com'
            },
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
        }

        const info = await transporter.sendMail(mailOptions)

        console.log('✅ Confirmation email sent successfully to:', email)
        console.log('Message ID:', info.messageId)

        return NextResponse.json(
            {
                message: 'Confirmation email sent successfully',
                messageId: info.messageId
            },
            { status: 200 }
        )

    } catch (error: any) {
        console.error('❌ Error sending confirmation email:', error)

        // Return different errors based on the type
        if (error.code === 'EAUTH') {
            return NextResponse.json(
                { error: 'Email authentication failed' },
                { status: 500 }
            )
        } else if (error.code === 'ECONNECTION') {
            return NextResponse.json(
                { error: 'Cannot connect to email server' },
                { status: 503 }
            )
        } else {
            return NextResponse.json(
                { error: 'Failed to send confirmation email' },
                { status: 500 }
            )
        }
    }
}