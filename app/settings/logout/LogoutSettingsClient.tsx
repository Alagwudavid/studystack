"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    LogOut,
    Shield,
    Trash2,
    AlertTriangle,
    Check,
    Smartphone,
    Monitor,
    Globe,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface LogoutSettingsClientProps {
    serverUser?: User;
}

export default function LogoutSettingsClient({
    serverUser,
}: LogoutSettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;
    const router = useRouter();

    const [clearData, setClearData] = useState(false);
    const [clearCache, setClearCache] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Simulate logout process
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (clearData) {
                localStorage.clear();
                sessionStorage.clear();
            }

            if (clearCache) {
                // Clear application cache
                console.log("Clearing cache...");
            }

            // Redirect to auth page (not login since there's no separate login page)
            router.push("/auth");
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        console.log("Logging out from all devices...");
        // Handle logout from all devices
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Logout & Security</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your session and logout preferences
                </p>
            </div>

            {/* Current Session */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Current Session
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium">Desktop - Chrome</p>
                                <p className="text-sm text-muted-foreground">
                                    {user?.email || 'user@example.com'} • Active now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">Current</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium">Other Active Sessions</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Mobile - Safari</p>
                                        <p className="text-sm text-muted-foreground">iPhone • 2 hours ago</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    End Session
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Web - Firefox</p>
                                        <p className="text-sm text-muted-foreground">Windows • 1 day ago</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    End Session
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogoutAllDevices}
                        variant="outline"
                        className="w-full"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout from All Devices
                    </Button>
                </CardContent>
            </Card>

            {/* Logout Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LogOut className="w-5 h-5" />
                        Logout Options
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="clear-cache">Clear Browser Cache</Label>
                            <p className="text-sm text-muted-foreground">
                                Remove temporary files and cached data
                            </p>
                        </div>
                        <Switch
                            id="clear-cache"
                            checked={clearCache}
                            onCheckedChange={setClearCache}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="clear-data">Clear Local Data</Label>
                            <p className="text-sm text-muted-foreground">
                                Remove saved preferences and offline data
                            </p>
                        </div>
                        <Switch
                            id="clear-data"
                            checked={clearData}
                            onCheckedChange={setClearData}
                        />
                    </div>

                    {clearData && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                    Warning: This action cannot be undone
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Your saved preferences, offline lessons, and cached progress will be permanently deleted.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Logout Button */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Ready to logout?</h3>
                            <p className="text-sm text-muted-foreground">
                                You can always sign back in to continue your learning
                            </p>
                        </div>

                        <Button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            size="lg"
                            className="w-full max-w-sm"
                        >
                            {isLoggingOut ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Logging out...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </div>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Account Deletion */}
            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}