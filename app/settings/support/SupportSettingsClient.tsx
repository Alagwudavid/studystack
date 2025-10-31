"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    HelpCircle,
    MessageSquare,
    Book,
    Mail,
    ExternalLink,
    Send,
    Phone,
    Clock,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface SupportSettingsClientProps {
    serverUser?: User;
}

export default function SupportSettingsClient({
    serverUser,
}: SupportSettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;

    const [contactForm, setContactForm] = useState({
        subject: "",
        category: "",
        priority: "",
        message: "",
    });

    const handleFormChange = (field: string, value: string) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitTicket = () => {
        console.log("Submitting support ticket:", contactForm);
        // Handle ticket submission
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Support</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Get help, access resources, and contact our support team
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Book className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-medium">Help Center</h3>
                                <p className="text-sm text-muted-foreground">Browse articles & guides</p>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-medium">Live Chat</h3>
                                <p className="text-sm text-muted-foreground">Chat with support</p>
                            </div>
                            <div className="ml-auto">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-medium">FAQ</h3>
                                <p className="text-sm text-muted-foreground">Common questions</p>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Contact Support
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={contactForm.category}
                                onValueChange={(value) => handleFormChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technical">Technical Issue</SelectItem>
                                    <SelectItem value="billing">Billing & Payments</SelectItem>
                                    <SelectItem value="account">Account & Profile</SelectItem>
                                    <SelectItem value="learning">Learning Content</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={contactForm.priority}
                                onValueChange={(value) => handleFormChange("priority", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="Brief description of your issue"
                            value={contactForm.subject}
                            onChange={(e) => handleFormChange("subject", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Please describe your issue in detail..."
                            rows={5}
                            value={contactForm.message}
                            onChange={(e) => handleFormChange("message", e.target.value)}
                        />
                    </div>

                    <Button onClick={handleSubmitTicket} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Support Ticket
                    </Button>
                </CardContent>
            </Card>

            {/* Support Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Monday - Friday</p>
                            <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM PST</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Emergency Support</p>
                            <p className="text-sm text-muted-foreground">24/7 for critical issues</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Email Response</p>
                            <p className="text-sm text-muted-foreground">Within 24 hours</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">User ID:</span>
                            <span>{user?.id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Browser:</span>
                            <span>{typeof window !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">App Version:</span>
                            <span>1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}