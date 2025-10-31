"use client";

import React, { useState, useEffect } from "react";
import { serverLogin, serverRequestCode } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Shield } from "lucide-react";

interface PasswordlessLoginProps {
  onSuccess?: () => void;
}

export function PasswordlessLogin({ onSuccess }: PasswordlessLoginProps) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [codeReused, setCodeReused] = useState(false);
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

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const result = await serverRequestCode(sanitizedEmail);
      if (result.success) {
        // Check if the code was reused from backend response
        const isReused = result.code_reused || false;
        setCodeReused(isReused);

        const baseMessage = result.message || "Verification code sent! Check your email.";

        if (isReused) {
          setSuccess(baseMessage + " (Using your previous unexpired code)");
        } else {
          setSuccess(baseMessage);
        }

        // Set expiration time (60 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);
        setCodeExpiresAt(expiresAt);

        // Start resend timer (30 seconds)
        setResendTimer(30);

        setStep("code");
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

    // Sanitize code input - only allow alphanumeric characters
    const sanitizedCode = code.replace(/[^A-Z0-9]/g, "").toUpperCase();

    if (!sanitizedCode || sanitizedCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      setIsLoading(false);
      return;
    }

    try {
      // Server action will handle authentication and redirect immediately
      const result = await serverLogin(
        email.trim().toLowerCase(),
        sanitizedCode,
        keepSignedIn
      );

      // If we get a result back, it means the login failed
      // Successful login would have redirected and we wouldn't reach this point
      if (result && !result.success) {
        setError(result.message || "Invalid verification code");
      } else {
        // This shouldn't happen in normal flow, but just in case
        setError("Invalid verification code");
      }
    } catch (err: any) {
      // In Next.js app router, successful redirects throw a special error
      // Check if this is a redirect error (which means success)
      if (err?.digest?.includes("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
        // This is actually success - show the loader and success message
        console.log("Login successful, redirecting...");
        setIsRedirecting(true);
        setError("");
        setSuccess("Login successful! Redirecting to dashboard...");
        // Don't set isLoading to false, keep showing the success state
        return; // Early return, don't set error or loading state
      }

      // For other errors, show the error message
      console.error("Login error:", err);
      setError("Invalid verification code");
    } finally {
      // Only set loading to false if we're not redirecting
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
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const result = await serverRequestCode(email.trim().toLowerCase());
      if (result.success) {
        // Check if the code was reused from backend response
        const isReused = result.code_reused || false;
        setCodeReused(isReused);

        const baseMessage = result.message || "Verification code sent! Check your email.";

        if (isReused) {
          setSuccess(baseMessage + " (Using your previous unexpired code)");
        } else {
          setSuccess(baseMessage);
        }

        // Set expiration time (60 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);
        setCodeExpiresAt(expiresAt);

        // Start resend timer (30 seconds)
        setResendTimer(30);
      } else {
        setError(result.message || "Failed to resend verification code");
      }
    } catch (err) {
      setError("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border">
      <CardHeader className="text-center">
        {/* <CardTitle className="flex items-center justify-center gap-2">
          {step === "email" ? "" : <Shield className="h-5 w-5" />}
          {step === "email" ? "Get started" : "Enter Verification Code"}
        </CardTitle> */}
        <CardDescription>
          {step === "email"
            ? "Enter your email to receive a verification code"
            : `We sent a 6-digit code to ${email}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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

        {step === "email" ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoFocus
              className="px-4 py-2 h-14 rounded-lg text-foreground"
            />

            <Button
              type="submit"
              className="w-full py-2 h-14 rounded-lg text-foreground"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={isLoading || isRedirecting}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isRedirecting || code.length !== 6}
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
            <div className="flex items-center space-x-2">
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

            <Button
              type="button"
              variant="cool"
              className="w-full py-2 h-14 rounded-lg text-foreground"
              onClick={handleBackToEmail}
              disabled={isLoading || isRedirecting}
            >
              Back to Email
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground">
          {step === "code" && (
            <div className="space-y-2">
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
              {codeExpiresAt && (
                <p className="text-xs text-gray-500">
                  Code expires at {codeExpiresAt.toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
