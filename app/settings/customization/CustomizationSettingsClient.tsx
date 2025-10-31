"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    Settings,
    Globe,
    Moon,
    Sun,
    Monitor,
    Volume2,
    Headphones,
    Play,
    Settings2,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface CustomizationSettingsClientProps {
    serverUser?: User;
}

export default function CustomizationSettingsClient({
    serverUser,
}: CustomizationSettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;

    // General settings state
    const [language, setLanguage] = useState("en");
    const [timezone, setTimezone] = useState("GMT-5");
    const [theme, setTheme] = useState("system");
    const [autoSave, setAutoSave] = useState(true);
    const [showTips, setShowTips] = useState(true);

    // Sound settings state
    const [masterVolume, setMasterVolume] = useState([75]);
    const [effectsVolume, setEffectsVolume] = useState([65]);
    const [musicVolume, setMusicVolume] = useState([80]);
    const [voiceVolume, setVoiceVolume] = useState([85]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [voiceFeedback, setVoiceFeedback] = useState(true);
    const [audioQuality, setAudioQuality] = useState("high");
    const [autoplay, setAutoplay] = useState(true);

    const playTestSound = () => {
        // Placeholder for test sound functionality
        console.log("Playing test sound...");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Customization</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Personalize your experience with language, appearance, and audio settings
                </p>
            </div>

            {/* Language & Region */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Language & Region
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="language">Display Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="pt">Português</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GMT-12">GMT-12 (Baker Island)</SelectItem>
                                <SelectItem value="GMT-8">GMT-8 (Pacific Time)</SelectItem>
                                <SelectItem value="GMT-5">GMT-5 (Eastern Time)</SelectItem>
                                <SelectItem value="GMT+0">GMT+0 (Greenwich Mean Time)</SelectItem>
                                <SelectItem value="GMT+1">GMT+1 (Central European Time)</SelectItem>
                                <SelectItem value="GMT+8">GMT+8 (China Standard Time)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Appearance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun className="w-4 h-4" />
                                        Light
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon className="w-4 h-4" />
                                        Dark
                                    </div>
                                </SelectItem>
                                <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4" />
                                        System
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Volume Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        Audio & Sound
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="master-volume">Master Volume</Label>
                                <span className="text-sm text-muted-foreground">{masterVolume[0]}%</span>
                            </div>
                            <Slider
                                id="master-volume"
                                min={0}
                                max={100}
                                step={1}
                                value={masterVolume}
                                onValueChange={setMasterVolume}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="effects-volume">Sound Effects</Label>
                                <span className="text-sm text-muted-foreground">{effectsVolume[0]}%</span>
                            </div>
                            <Slider
                                id="effects-volume"
                                min={0}
                                max={100}
                                step={1}
                                value={effectsVolume}
                                onValueChange={setEffectsVolume}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="music-volume">Background Music</Label>
                                <span className="text-sm text-muted-foreground">{musicVolume[0]}%</span>
                            </div>
                            <Slider
                                id="music-volume"
                                min={0}
                                max={100}
                                step={1}
                                value={musicVolume}
                                onValueChange={setMusicVolume}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="voice-volume">Voice & Speech</Label>
                                <span className="text-sm text-muted-foreground">{voiceVolume[0]}%</span>
                            </div>
                            <Slider
                                id="voice-volume"
                                min={0}
                                max={100}
                                step={1}
                                value={voiceVolume}
                                onValueChange={setVoiceVolume}
                                className="w-full"
                            />
                        </div>

                        <Button
                            onClick={playTestSound}
                            variant="outline"
                            className="w-full flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Test Sound
                        </Button>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="sound-enabled">Enable Sound Effects</Label>
                                <p className="text-sm text-muted-foreground">
                                    Play sound effects for interactions and feedback
                                </p>
                            </div>
                            <Switch
                                id="sound-enabled"
                                checked={soundEnabled}
                                onCheckedChange={setSoundEnabled}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="music-enabled">Background Music</Label>
                                <p className="text-sm text-muted-foreground">
                                    Play background music during lessons
                                </p>
                            </div>
                            <Switch
                                id="music-enabled"
                                checked={musicEnabled}
                                onCheckedChange={setMusicEnabled}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="voice-feedback">Voice Feedback</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable spoken pronunciation feedback
                                </p>
                            </div>
                            <Switch
                                id="voice-feedback"
                                checked={voiceFeedback}
                                onCheckedChange={setVoiceFeedback}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="audio-quality">Audio Quality</Label>
                            <Select value={audioQuality} onValueChange={setAudioQuality}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low (Faster loading)</SelectItem>
                                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                                    <SelectItem value="high">High (Best quality)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="autoplay">Auto-play Audio</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically play audio clips in lessons
                                </p>
                            </div>
                            <Switch
                                id="autoplay"
                                checked={autoplay}
                                onCheckedChange={setAutoplay}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Learning Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5" />
                        Learning Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="auto-save">Auto-save Progress</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically save your learning progress
                            </p>
                        </div>
                        <Switch
                            id="auto-save"
                            checked={autoSave}
                            onCheckedChange={setAutoSave}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="show-tips">Show Learning Tips</Label>
                            <p className="text-sm text-muted-foreground">
                                Display helpful tips during lessons
                            </p>
                        </div>
                        <Switch
                            id="show-tips"
                            checked={showTips}
                            onCheckedChange={setShowTips}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}