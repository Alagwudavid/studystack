"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    BookOpen,
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

interface LearningSettingsClientProps {
    serverUser: User;
}

export default function LearningSettingsClient({ serverUser }: LearningSettingsClientProps) {
    const { setServerUser } = useAuth();
    const [learning, setLearning] = useState({
        dailyGoal: "20",
        reminderTime: "19:00",
        difficulty: "intermediate",
        autoplay: true,
        soundEffects: true,
        hapticFeedback: true,
    });

    useEffect(() => {
        if (serverUser && setServerUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    const handleSaveSettings = () => {
        // TODO: Save learning settings to backend
        console.log('Saving learning settings:', learning);
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
                    <BookOpen className="w-8 h-8" />
                    Learning Preferences
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Customize your learning experience and goals
                </p>
            </div>

            <div className="space-y-6">
                {/* Learning Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Learning Goals & Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Daily Learning Goal</Label>
                                <Select
                                    value={learning.dailyGoal}
                                    onValueChange={(value) =>
                                        setLearning({ ...learning, dailyGoal: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 minutes - Casual</SelectItem>
                                        <SelectItem value="10">10 minutes - Regular</SelectItem>
                                        <SelectItem value="15">15 minutes - Serious</SelectItem>
                                        <SelectItem value="20">20 minutes - Intense</SelectItem>
                                        <SelectItem value="30">30 minutes - Insane</SelectItem>
                                        <SelectItem value="60">1 hour - Legendary</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Set your daily learning time goal
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Reminder Time</Label>
                                <Input
                                    type="time"
                                    value={learning.reminderTime}
                                    onChange={(e) =>
                                        setLearning({ ...learning, reminderTime: e.target.value })
                                    }
                                />
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    When should we remind you to practice?
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty Level</Label>
                                <Select
                                    value={learning.difficulty}
                                    onValueChange={(value) =>
                                        setLearning({ ...learning, difficulty: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner - Take it slow</SelectItem>
                                        <SelectItem value="intermediate">Intermediate - Regular pace</SelectItem>
                                        <SelectItem value="advanced">Advanced - Challenge me</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                    Choose your learning difficulty
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Experience */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Autoplay Audio</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Automatically play pronunciation audio
                                    </p>
                                </div>
                                <Switch
                                    checked={learning.autoplay}
                                    onCheckedChange={(checked) =>
                                        setLearning({ ...learning, autoplay: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Sound Effects</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Play sounds for correct/incorrect answers
                                    </p>
                                </div>
                                <Switch
                                    checked={learning.soundEffects}
                                    onCheckedChange={(checked) =>
                                        setLearning({ ...learning, soundEffects: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-foreground">Haptic Feedback</Label>
                                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                        Vibrate on correct/incorrect answers (mobile)
                                    </p>
                                </div>
                                <Switch
                                    checked={learning.hapticFeedback}
                                    onCheckedChange={(checked) =>
                                        setLearning({ ...learning, hapticFeedback: checked })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Learning Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {serverUser.points}
                                </div>
                                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                                    Total Points
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {serverUser.level}
                                </div>
                                <div className="text-sm text-green-600/70 dark:text-green-400/70">
                                    Current Level
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {serverUser.streak_count}
                                </div>
                                <div className="text-sm text-orange-600/70 dark:text-orange-400/70">
                                    Day Streak
                                </div>
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
