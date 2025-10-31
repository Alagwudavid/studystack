"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
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

interface PrivacySettingsClientProps {
    serverUser: User;
}

export default function PrivacySettingsClient({ serverUser }: PrivacySettingsClientProps) {
    const { setServerUser } = useAuth();
    const [privacy, setPrivacy] = useState({
        profileVisibility: "public",
        showProgress: true,
        showStreak: true,
        showFriends: true,
        allowFriendRequests: true,
        showOnLeaderboard: true,
    });

    useEffect(() => {
        if (serverUser && setServerUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    const handleSaveSettings = () => {
        // TODO: Save privacy settings to backend
        console.log('Saving privacy settings:', privacy);
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
                    <Shield className="w-8 h-8" />
                    Privacy Settings
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Control your privacy settings and data visibility
                </p>
            </div>

            <div className="space-y-6">
                {/* Privacy Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Privacy Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Profile Visibility</Label>
                                <Select
                                    value={privacy.profileVisibility}
                                    onValueChange={(value) =>
                                        setPrivacy({ ...privacy, profileVisibility: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public - Anyone can view your profile</SelectItem>
                                        <SelectItem value="friends">Friends Only - Only friends can view</SelectItem>
                                        <SelectItem value="private">Private - Only you can view</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Show Learning Progress</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Display your progress on your profile
                                    </p>
                                </div>
                                <Switch
                                    checked={privacy.showProgress}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, showProgress: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Show Learning Streak</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Display your current learning streak
                                    </p>
                                </div>
                                <Switch
                                    checked={privacy.showStreak}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, showStreak: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Show Friends List</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Allow others to see your friends
                                    </p>
                                </div>
                                <Switch
                                    checked={privacy.showFriends}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, showFriends: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Allow Friend Requests</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Let others send you friend requests
                                    </p>
                                </div>
                                <Switch
                                    checked={privacy.allowFriendRequests}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, allowFriendRequests: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Show on Leaderboard</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Appear on community leaderboards
                                    </p>
                                </div>
                                <Switch
                                    checked={privacy.showOnLeaderboard}
                                    onCheckedChange={(checked) =>
                                        setPrivacy({ ...privacy, showOnLeaderboard: checked })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Privacy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Your Data Rights
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                You have the right to access, update, or delete your personal data at any time.
                            </p>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Download My Data
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Request Data Deletion
                                </Button>
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
