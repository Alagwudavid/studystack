"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    User,
    Bell,
    Shield,
    BookOpen,
    Database,
    Monitor,
    ChevronRight,
} from "lucide-react";

const settingsSections = [
    {
        href: '/settings/account',
        icon: User,
        title: 'Account Settings',
        description: 'Manage your profile information and security settings',
    },
    {
        href: '/settings/sessions',
        icon: Monitor,
        title: 'Sessions',
        description: 'View and manage your active device sessions',
    },
    {
        href: '/settings/notifications',
        icon: Bell,
        title: 'Notifications',
        description: 'Configure your notification preferences and alerts',
    },
    {
        href: '/settings/privacy',
        icon: Shield,
        title: 'Privacy',
        description: 'Control your privacy settings and data visibility',
    },
    {
        href: '/settings/learning',
        icon: BookOpen,
        title: 'Learning Preferences',
        description: 'Customize your learning experience and goals',
    },
    {
        href: '/settings/data',
        icon: Database,
        title: 'Data & Support',
        description: 'Export data, get help, and manage your account',
    },
];

export default function SettingsNavigation() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-[#fafafa] mb-2">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Manage your account and learning preferences
                </p>
            </div>

            {/* Settings Navigation */}
            <div className="grid gap-4">
                {settingsSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                        <Link key={section.href} href={section.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <IconComponent className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-[#fafafa]">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
