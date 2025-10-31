"use client";

import React, { useState, useEffect } from "react";
import { serverLogin, serverRequestCode } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Inbox, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExternalLogin } from "./ExternalLogin";
import Link from "next/link";

interface StepBasedAuthProps {
    initialStep?: "email" | "code";
    initialEmail?: string | null;
    onSuccess?: () => void;
}

export function StepBasedAuth({
    initialStep = "email",
    initialEmail = null,
    onSuccess
}: StepBasedAuthProps) {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "code">(initialStep);
    const [email, setEmail] = useState(initialEmail || "");
    const [code, setCode] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);

    // Timer effect for resend countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Update URL when step changes
    const updateURL = (newStep: string, params: Record<string, string> = {}) => {
        const url = new URL(window.location.href);
        url.searchParams.set('step', newStep);

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });

        // Use router.replace to avoid adding to history
        router.replace(url.pathname + url.search, { scroll: false });
    };

    const handleMagicLinkAuth = async () => {
        // This function is no longer needed - magic links are handled by /auth/magic route
    };

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const sanitizedEmail = email.trim().toLowerCase();

        if (!sanitizedEmail) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
            const result = await serverRequestCode(sanitizedEmail);
            if (result.success) {
                const isReused = result.code_reused || false;
                const baseMessage = result.message || "Verification code sent! Check your email.";

                if (isReused) {
                    setSuccess(baseMessage + " (Using your previous unexpired code)");
                } else {
                    setSuccess(baseMessage);
                }

                // Set expiration time (60 minutes from now in UTC)
                const expiresAt = new Date();
                expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 60);
                setCodeExpiresAt(expiresAt);

                // Start resend timer (30 seconds)
                setResendTimer(30);

                setStep("code");
                updateURL("code", { email: sanitizedEmail });

                // Note: Magic links are now handled via direct email links to /auth/magic route
            } else {
                setError(result.message || "Failed to send verification code");
            }
        } catch (err) {
            setError("Failed to send verification code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const sanitizedCode = code.replace(/[^A-Z0-9]/g, "").toUpperCase();

        if (!sanitizedCode || sanitizedCode.length !== 6) {
            setError("Please enter the 6-digit verification code");
            setIsLoading(false);
            return;
        }

        try {
            const result = await serverLogin(
                email.trim().toLowerCase(),
                sanitizedCode,
                keepSignedIn
            );

            if (result && !result.success) {
                setError(result.message || "Invalid verification code");
            } else {
                setError("Invalid verification code");
            }
        } catch (err: any) {
            if (err?.digest?.includes("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
                console.log("Login successful, redirecting...");
                setIsRedirecting(true);
                setError("");
                setSuccess("Login successful! Redirecting to dashboard...");
                return;
            }

            console.error("Login error:", err);
            setError("Invalid verification code");
        } finally {
            if (!isRedirecting) {
                setIsLoading(false);
            }
        }
    };

    const handleBackToEmail = () => {
        setStep("email");
        setCode("");
        setError("");
        setSuccess("");
        setIsRedirecting(false);
        setResendTimer(0);
        setCodeExpiresAt(null);
        updateURL("email");
    };

    const handleResendCode = async () => {
        if (resendTimer > 0 || isResending) return;

        setError("");
        setSuccess("");
        setIsResending(true);

        try {
            const result = await serverRequestCode(email.trim().toLowerCase());
            if (result.success) {
                const isReused = result.code_reused || false;
                const baseMessage = result.message || "Verification code sent! Check your email.";

                if (isReused) {
                    setSuccess(baseMessage + " (Using your previous unexpired code)");
                } else {
                    setSuccess(baseMessage);
                }

                const expiresAt = new Date();
                expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 60);
                setCodeExpiresAt(expiresAt);

                setResendTimer(30);

                // Note: Magic links are now handled via direct email links to /auth/magic route
            } else {
                setError(result.message || "Failed to resend verification code");
            }
        } catch (err) {
            setError("Failed to resend verification code");
        } finally {
            setIsResending(false);
        }
    };

    // Magic links are now handled directly via email links to /auth/magic route

    const getStepDescription = () => {
        switch (step) {
            case "email":
                return "Enter your email to receive a verification code";
            case "code":
                return (
                    <button
                        type="button"
                        onClick={handleBackToEmail}
                        disabled={isLoading || isRedirecting}
                        className="flex items-center mx-auto gap-1 text-primary hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {email} <PencilLine className="h-4 w-4" />
                    </button>
                );
            default:
                return "Enter your email to get started";
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case "email":
                return "Welcome back";
            case "code":
                return "Check your inbox";
            default:
                return "Authentication";
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Title */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    {getStepTitle()}
                </h1>
                <p className="text-muted-foreground">
                    {step === "email" ? "Enter your email to receive a verification code" : (
                        <button
                            type="button"
                            onClick={handleBackToEmail}
                            disabled={isLoading || isRedirecting}
                            className="flex items-center mx-auto gap-1 text-primary hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {email} <PencilLine className="h-4 w-4" />
                        </button>
                    )}
                </p>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Main Form Content */}
            {step === "email" ? (
                <div className="space-y-6">
                    {/* Email Input and Continue Button */}
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                            className="px-4 py-3 rounded-lg text-foreground h-12 border-2"
                        />

                        <Button
                            type="submit"
                            className="w-full py-3 rounded-lg h-12 text-white font-medium"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                "Continue with Email"
                            )}
                        </Button>
                    </form>

                    {/* OR Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* External Logins */}
                    <ExternalLogin disabled={isLoading} />
                </div>
            ) : step === "code" ? (
                <div className="space-y-6">
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={setCode}
                                disabled={isLoading || isRedirecting}
                            >
                                <InputOTPGroup className="flex items-center space-x-3">
                                    <InputOTPSlot index={0} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                    <InputOTPSlot index={1} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                    <InputOTPSlot index={2} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                    <span className="h-1 w-3 flex items-center justify-center bg-muted-foreground rounded-lg"></span>
                                    <InputOTPSlot index={3} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                    <InputOTPSlot index={4} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                    <InputOTPSlot index={5} className="h-12 w-12 rounded-lg border-2 bg-background" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 rounded-lg h-12 text-white font-medium"
                            disabled={isRedirecting || isLoading || code.length !== 6}
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Redirecting...
                                </>
                            ) : isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Sign In"
                            )}
                        </Button>

                        {/* Keep me signed in checkbox */}
                        <div className="flex items-center justify-center space-x-2">
                            <Checkbox
                                id="keep-signed-in"
                                checked={keepSignedIn}
                                onCheckedChange={(checked) =>
                                    setKeepSignedIn(checked as boolean)
                                }
                                disabled={isLoading || isRedirecting}
                            />
                            <label
                                htmlFor="keep-signed-in"
                                className="text-sm text-muted-foreground cursor-pointer"
                            >
                                Keep me signed in for 30 days
                            </label>
                        </div>
                    </form>

                    {/* Resend Code */}
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendTimer > 0 || isResending || isRedirecting}
                                className={`${resendTimer > 0 || isResending || isRedirecting
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-primary hover:underline"
                                    }`}
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                                        Sending...
                                    </>
                                ) : resendTimer > 0 ? (
                                    `Resend code (${resendTimer}s)`
                                ) : (
                                    "Resend code"
                                )}
                            </button>
                        </p>
                    </div>
                </div>
            ) : (
                // Magic link authentication step
                <div className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Authenticating with your magic link...
                    </p>
                    {isLoading && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBackToEmail}
                            disabled={isLoading}
                        >
                            Cancel & Start Over
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
