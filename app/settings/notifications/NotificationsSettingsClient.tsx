"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Bell,
    ArrowLeft,
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

interface NotificationsSettingsClientProps {
    serverUser: User;
}

export default function NotificationsSettingsClient({ serverUser }: NotificationsSettingsClientProps) {
    const { setServerUser } = useAuth();
    const [notifications, setNotifications] = useState({
        dailyReminder: true,
        streakReminder: true,
        achievementAlerts: true,
        weeklyProgress: false,
        friendActivity: true,
        emailUpdates: false,
        pushNotifications: true,
        loginAlerts: true,
        securityAlerts: true,
        newFollowers: true,
        mentions: true,
        directMessages: true,
    });

    useEffect(() => {
        if (serverUser && setServerUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    const handleSaveSettings = () => {
        // TODO: Save notification settings to backend
        console.log('Saving notification settings:', notifications);
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
                    <Bell className="w-8 h-8" />
                    Notification Settings
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Configure how and when you receive notifications
                </p>
            </div>

            <div className="space-y-6">
                {/* Learning Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Learning Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Daily Reminder</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Get reminded to complete your daily lessons
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.dailyReminder}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, dailyReminder: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Streak Reminder</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Don't break your learning streak
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.streakReminder}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, streakReminder: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Achievement Alerts</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Celebrate your learning milestones
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.achievementAlerts}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, achievementAlerts: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Weekly Progress</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Weekly summary of your learning progress
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.weeklyProgress}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, weeklyProgress: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Friend Activity</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Get notified when friends complete lessons
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.friendActivity}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, friendActivity: checked })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Communication Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Communication Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-foreground">Email Updates</Label>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Receive updates and tips via email
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailUpdates}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, emailUpdates: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-foreground">Push Notifications</Label>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Receive push notifications on your device
                                </p>
                            </div>
                            <Switch
                                checked={notifications.pushNotifications}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, pushNotifications: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Privacy Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Security & Privacy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Login Alerts</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Get notified when someone logs into your account
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.loginAlerts}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, loginAlerts: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Security Alerts</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Important security updates and alerts
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.securityAlerts}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, securityAlerts: checked })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Social Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">New Followers</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Get notified when someone follows you
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.newFollowers}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, newFollowers: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Mentions</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        When someone mentions you in a post or comment
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.mentions}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, mentions: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Direct Messages</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Get notified of new direct messages
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.directMessages}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, directMessages: checked })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} size="lg">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
