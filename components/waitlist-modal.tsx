'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface WaitlistModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function WaitlistModal({ isOpen, onClose, onSuccess }: WaitlistModalProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('Email is required')
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Check if email already exists
            const { data: existingEntry, error: checkError } = await supabase
                .from('waitlist')
                .select('email')
                .eq('email', email.toLowerCase())
                .single()

            if (checkError && checkError.code !== 'PGRST116') {
                // PGRST116 = "The result contains 0 rows" which is expected for new emails
                console.error('Database check error:', checkError)
                throw new Error(`Database error: ${checkError.message}`)
            }

            if (existingEntry) {
                setError('This email is already on the waitlist!')
                setIsLoading(false)
                return
            }

            // Add to waitlist
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert([
                    {
                        email: email.toLowerCase(),
                        status: 'pending',
                        ip_address: await getClientIP(),
                        user_agent: navigator.userAgent
                    }
                ])

            if (insertError) {
                console.error('Insert error:', insertError)
                throw new Error(`Failed to save to waitlist: ${insertError.message}`)
            }

            // Send confirmation email (optional - don't fail signup if email fails)
            let emailSent = false
            try {
                const emailResponse = await fetch('/api/send-confirmation-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                })

                if (emailResponse.ok) {
                    emailSent = true
                    console.log('✅ Confirmation email sent successfully')
                } else {
                    console.log('❌ Email sending failed:', await emailResponse.text())
                }
            } catch (emailError) {
                console.log('❌ Email sending failed:', emailError)
                // Don't fail the whole process if email fails
            }

            setIsSuccess(true)
            if (emailSent) {
                toast.success('Successfully joined the waitlist! Check your email for confirmation.')
            } else {
                toast.success('Successfully joined the waitlist! (Email confirmation temporarily unavailable)')
            }

            setTimeout(() => {
                onSuccess()
                handleClose()
            }, 2000)

        } catch (error: any) {
            console.error('Error adding to waitlist:', error)

            // Show specific error messages based on the error type
            let errorMessage = 'Failed to join waitlist. Please try again.'

            if (error.message) {
                if (error.message.includes('relation "waitlist" does not exist')) {
                    errorMessage = 'Database not set up. Please contact support.'
                } else if (error.message.includes('permission denied')) {
                    errorMessage = 'Database permission error. Please contact support.'
                } else if (error.message.includes('connection')) {
                    errorMessage = 'Connection error. Please check your internet and try again.'
                } else {
                    errorMessage = `Error: ${error.message}`
                }
            }

            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setError('')
        setIsSuccess(false)
        onClose()
    }

    const getClientIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return data.ip
        } catch {
            return null
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-mono">
                        {isSuccess ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Welcome to the Waitlist!
                            </>
                        ) : (
                            <>
                                <Mail className="h-5 w-5" />
                                Join Our Waitlist
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {isSuccess ? (
                            "You've been successfully added to our waitlist. We'll notify you when we launch!"
                        ) : (
                            "Early access is limited. Join our waitlist to be the first to know when we launch."
                        )}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">You're in!</h3>
                            <p className="text-sm text-muted-foreground">
                                Check your email for confirmation details.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address • Device Information</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError('')
                                }}
                                disabled={isLoading}
                                className={error ? 'border-red-500' : ''}
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isLoading || !email.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Waitlist'
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="text-center text-xs text-muted-foreground">
                    We respect your privacy. No spam, unsubscribe anytime.
                </div>
            </DialogContent>
        </Dialog>
    )
}