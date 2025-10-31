"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    User,
    Bell,
    Shield,
    BookOpen,
    Database,
    Monitor,
    Settings,
} from "lucide-react";

const settingsLinks = [
    { href: '/settings', icon: Settings, label: 'Overview' },
    { href: '/settings/account', icon: User, label: 'Account' },
    { href: '/settings/sessions', icon: Monitor, label: 'Sessions' },
    { href: '/settings/notifications', icon: Bell, label: 'Notifications' },
    { href: '/settings/privacy', icon: Shield, label: 'Privacy' },
    { href: '/settings/learning', icon: BookOpen, label: 'Learning' },
    { href: '/settings/data', icon: Database, label: 'Data' },
];

export default function SettingsHeader() {
    const pathname = usePathname();

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold">Settings</h2>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        {settingsLinks.map((link) => {
                            const IconComponent = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <Button
                                    key={link.href}
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={link.href} className="flex items-center gap-2">
                                        <IconComponent className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                    <div className="md:hidden">
                        {/* Mobile menu can be added here if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
}
