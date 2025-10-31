"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Database,
    HelpCircle,
    Download,
    Upload,
    AlertTriangle,
    Trash2,
    ArrowLeft,
    FileText,
    Shield,
    Users,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image: string | null;
    bio: string | null;
    points: number;
    level: number;
    streak_count: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

interface DataSettingsClientProps {
    serverUser: User;
}

export default function DataSettingsClient({ serverUser }: DataSettingsClientProps) {
    const { setServerUser } = useAuth();

    useEffect(() => {
        if (serverUser && setServerUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    const handleExportData = () => {
        // TODO: Implement data export functionality
        console.log('Exporting user data...');
    };

    const handleImportData = () => {
        // TODO: Implement data import functionality
        console.log('Importing user data...');
    };

    const handleDeleteAccount = () => {
        // TODO: Implement account deletion with confirmation
        const confirmed = window.confirm(
            'Are you absolutely sure? This action cannot be undone. Your account and all data will be permanently deleted.'
        );
        if (confirmed) {
            console.log('Deleting account...');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/settings">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Settings
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-[#fafafa] mb-2 flex items-center gap-3">
                    <Database className="w-8 h-8" />
                    Data & Support
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Export data, get help, and manage your account
                </p>
            </div>

            <div className="space-y-6">
                {/* Data Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Data Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label className="text-foreground font-semibold">Export Data</Label>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Download all your learning data and progress in JSON format
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={handleExportData}
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label className="text-foreground font-semibold">Import Data</Label>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Import learning data from another platform
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={handleImportData}
                            >
                                <Upload className="w-4 h-4" />
                                Import
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Support & Help */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Support & Help
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/contact-us">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Contact Support
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4 mr-2" />
                                Help Center
                            </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <Users className="w-4 h-4 mr-2" />
                                Community Guidelines
                            </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <Shield className="w-4 h-4 mr-2" />
                                Privacy Policy
                            </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4 mr-2" />
                                Terms of Service
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600 dark:text-[#fafafa]/70">Member since</Label>
                                <p className="font-semibold">
                                    {new Date(serverUser.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600 dark:text-[#fafafa]/70">Email verified</Label>
                                <p className="font-semibold">
                                    {serverUser.email_verified_at ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600 dark:text-[#fafafa]/70">Total points earned</Label>
                                <p className="font-semibold">{serverUser.points.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600 dark:text-[#fafafa]/70">Current level</Label>
                                <p className="font-semibold">Level {serverUser.level}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-destructive/10 rounded-lg">
                            <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
                            <p className="text-sm text-gray-600 dark:text-[#fafafa]/70 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                                All your learning progress, friends, and data will be permanently removed.
                            </p>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2"
                                onClick={handleDeleteAccount}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
