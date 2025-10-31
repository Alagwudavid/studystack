"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    Shield,
    Lock,
    Key,
    Smartphone,
    Eye,
    EyeOff,
    AlertTriangle,
    CheckCircle,
    Monitor,
    Globe,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface SecuritySettingsClientProps {
    serverUser?: User;
}

export default function SecuritySettingsClient({
    serverUser,
}: SecuritySettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState(true);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account security and privacy settings
                </p>
            </div>

            {/* Password Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Password
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full">Update Password</Button>

                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>Password requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>At least 8 characters long</li>
                            <li>Include uppercase and lowercase letters</li>
                            <li>Include at least one number</li>
                            <li>Include at least one special character</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Two-Factor Authentication
                        </div>
                        <Badge variant={twoFactorEnabled ? "sky" : "secondary"}>
                            {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <Switch
                            id="two-factor"
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                        />
                    </div>

                    {twoFactorEnabled && (
                        <div className="space-y-3 p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">Two-Factor Authentication is enabled</span>
                            </div>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm">
                                    View Recovery Codes
                                </Button>
                                <Button variant="outline" size="sm">
                                    Reset Authenticator App
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Login & Session Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Login & Session Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="login-alerts">Login Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when someone logs into your account
                            </p>
                        </div>
                        <Switch
                            id="login-alerts"
                            checked={loginAlerts}
                            onCheckedChange={setLoginAlerts}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="session-timeout">Automatic Session Timeout</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically log out after periods of inactivity
                            </p>
                        </div>
                        <Switch
                            id="session-timeout"
                            checked={sessionTimeout}
                            onCheckedChange={setSessionTimeout}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="font-medium">Active Sessions</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-4 h-4" />
                                    <div>
                                        <p className="font-medium">Current Session</p>
                                        <p className="text-sm text-muted-foreground">
                                            Windows • Chrome • Just now
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="sky">Current</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4" />
                                    <div>
                                        <p className="font-medium">Mobile App</p>
                                        <p className="text-sm text-muted-foreground">
                                            iPhone • 2 hours ago
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Revoke
                                </Button>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full">
                            View All Sessions
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                        <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
                            Delete Account
                        </h4>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                            Once you delete your account, there is no going back. This action cannot be undone.
                        </p>
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}