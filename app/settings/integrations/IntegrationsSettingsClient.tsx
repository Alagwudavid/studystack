"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    Puzzle,
    ExternalLink,
    Calendar,
    Slack,
    Mail,
    Globe,
    Smartphone,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface IntegrationsSettingsClientProps {
    serverUser?: User;
}

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: any;
    connected: boolean;
    comingSoon?: boolean;
}

export default function IntegrationsSettingsClient({
    serverUser,
}: IntegrationsSettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: "google-calendar",
            name: "Google Calendar",
            description: "Sync your learning schedule with Google Calendar",
            icon: Calendar,
            connected: false,
            comingSoon: true,
        },
        {
            id: "slack",
            name: "Slack",
            description: "Get learning notifications in your Slack workspace",
            icon: Slack,
            connected: false,
            comingSoon: true,
        },
        {
            id: "email",
            name: "Email Integration",
            description: "Enhanced email notifications and reminders",
            icon: Mail,
            connected: true,
        },
        {
            id: "mobile-app",
            name: "Mobile App Sync",
            description: "Sync progress with the Bitroot mobile app",
            icon: Smartphone,
            connected: false,
            comingSoon: true,
        },
        {
            id: "webhooks",
            name: "Webhooks",
            description: "Send learning events to external services",
            icon: Globe,
            connected: false,
            comingSoon: true,
        },
    ]);

    const toggleIntegration = (id: string) => {
        setIntegrations(prev =>
            prev.map(integration =>
                integration.id === id
                    ? { ...integration, connected: !integration.connected }
                    : integration
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Integrations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Connect Bitroot with your favorite apps and services
                </p>
            </div>

            {/* Connected Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Connected Services
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {integrations.filter(integration => integration.connected).length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No integrations connected yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {integrations
                                .filter(integration => integration.connected)
                                .map((integration) => {
                                    const Icon = integration.icon;
                                    return (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium">{integration.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {integration.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleIntegration(integration.id)}
                                            >
                                                Disconnect
                                            </Button>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Available Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Puzzle className="w-5 h-5" />
                        Available Integrations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {integrations
                            .filter(integration => !integration.connected)
                            .map((integration) => {
                                const Icon = integration.icon;
                                return (
                                    <div
                                        key={integration.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium">{integration.name}</h4>
                                                    {integration.comingSoon && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Coming Soon
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {integration.description}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={integration.comingSoon}
                                            onClick={() => toggleIntegration(integration.id)}
                                        >
                                            {integration.comingSoon ? "Coming Soon" : "Connect"}
                                        </Button>
                                    </div>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>

            {/* API Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        API & Developer Settings
                        <Badge variant="secondary">Coming Soon</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 opacity-60">
                    <p className="text-sm text-muted-foreground">
                        Advanced integration options for developers will be available soon.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>API Key Management</Label>
                                <p className="text-sm text-muted-foreground">
                                    Generate and manage API keys for custom integrations
                                </p>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                                Manage Keys
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Webhook Endpoints</Label>
                                <p className="text-sm text-muted-foreground">
                                    Configure webhooks for real-time event notifications
                                </p>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                                Configure
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}