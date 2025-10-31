"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { formData } from "@/types/contact-form";
import contactFormSchema from "@/app/api/validation/contact-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/env";

export default function ContactFormClient() {
    const [messageLength, setMessageLength] = useState(0);
    const MAX_MESSAGE_LENGTH = 1200;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        clearErrors,
        setError,
        watch
    } = useForm<formData>({
        resolver: zodResolver(contactFormSchema)
    });

    // Watch the message field to update character count
    const messageValue = watch("message", "");

    // Update character count when message changes
    useEffect(() => {
        setMessageLength(messageValue?.length || 0);
    }, [messageValue]);

    const onSubmit = async (formData: formData) => {
        try {
            // Clear any previous errors
            clearErrors();

            // Show loading toast
            const loadingToast = toast.loading("Sending your message...");

            // Call the API directly
            const response = await fetch(getApiUrl('/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (result.success) {
                // Show success toast
                toast.success(result.message, {
                    icon: <CheckCircle className="w-4 h-4" />,
                    duration: 5000,
                });

                // Reset form on success
                reset();
                setMessageLength(0);
            } else {
                // Show error toast
                toast.error(result.message, {
                    icon: <AlertCircle className="w-4 h-4" />,
                    duration: 6000,
                });

                // Handle validation errors from server
                if (result.errors && Array.isArray(result.errors)) {
                    result.errors.forEach((error: any) => {
                        if (error.path && error.path[0]) {
                            setError(error.path[0] as keyof formData, {
                                type: "server",
                                message: error.message
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An unexpected error occurred. Please try again.", {
                icon: <AlertCircle className="w-4 h-4" />,
                duration: 5000,
            });
        }
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </Link>

                    <div className="text-center mb-8">
                        {/* <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Contact Us
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p> */}
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    {/* Contact Form */}
                    <div className="">
                        <Card className="shadow-lg max-w-xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-xl">Send us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Name and Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                {...register("name")}
                                                className={`transition-colors focus:border-blue-500 ${errors.name ? 'border-red-500 focus:border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.name && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.name.message}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email address"
                                                {...register("email")}
                                                className={`transition-colors focus:border-blue-500 ${errors.email ? 'border-red-500 focus:border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.email && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.email.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            placeholder="What is this regarding?"
                                            {...register("subject")}
                                            className={`transition-colors focus:border-blue-500 ${errors.subject ? 'border-red-500 focus:border-red-500' : ''
                                                }`}
                                        />
                                        {errors.subject && (
                                            <div className="text-red-500 text-sm flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.subject.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            {...register("message")}
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                            className={`transition-colors focus:border-blue-500 resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : ''
                                                }`}
                                        />
                                        <div className="flex justify-between items-center">
                                            {errors.message ? (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.message.message}
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                            <p className={`text-sm ${messageLength > MAX_MESSAGE_LENGTH
                                                    ? 'text-red-500'
                                                    : messageLength > MAX_MESSAGE_LENGTH * 0.9
                                                        ? 'text-orange-500 dark:text-orange-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {messageLength}/{MAX_MESSAGE_LENGTH} characters
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
