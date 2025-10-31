import ContactForm from "./contactForm";
import { formData } from "@/types/contact-form";
import nodemailer from "nodemailer";
import contactFormSchema from "@/app/api/validation/contact-form";
import { z } from "zod";

export default function ContactUsPage() {
    const sendMail = async (formData: formData) => {
        "use server";

        try {
            // Validate form data
            const validatedData = contactFormSchema.parse(formData);

            // Check if required environment variables are set
            if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD || !process.env.MAIL_RECEIVER_ADDRESS) {
                console.error("Missing required environment variables for email configuration");
                return {
                    success: false,
                    message: "Email service is not configured properly. Please try again later.",
                };
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
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
                    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 10px 0;"><strong>Name:</strong> ${validatedData.name}</p>
                            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                            <p style="margin: 10px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
                        </div>
                        <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
                            <h3 style="color: #495057; margin-top: 0;">Message:</h3>
                            <p style="color: #6c757d; white-space: pre-wrap;">${validatedData.message}</p>
                        </div>
                        <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px; text-align: center;">
                            <small style="color: #6c757d;">This message was sent from the Bitroot contact form</small>
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            
            return { 
                success: true, 
                message: "Thank you! Your message has been sent successfully. We'll get back to you soon." 
            };
        } catch (error) {
            console.error("Error sending email:", error);
            
            // Handle specific error types
            if (error instanceof z.ZodError) {
                return {
                    success: false,
                    message: "Please check your form inputs and try again.",
                    errors: error.errors
                };
            }
            
            if (error instanceof Error) {
                // Handle specific nodemailer errors
                if (error.message.includes('authentication') || error.message.includes('auth')) {
                    return {
                        success: false,
                        message: "Email service authentication failed. Please try again later.",
                    };
                }
                
                if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
                    return {
                        success: false,
                        message: "Network error occurred. Please check your connection and try again.",
                    };
                }
                
                if (error.message.includes('timeout')) {
                    return {
                        success: false,
                        message: "Request timed out. Please try again.",
                    };
                }
            }
            
            return {
                success: false,
                message: "An unexpected error occurred while sending your message. Please try again later.",
            };
        }
    }

    return (
        <ContactForm sendMail={sendMail} />
    );
}
