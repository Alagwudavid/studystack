"use client";

import { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    User,
    Settings,
    CreditCard,
    Bell,
    Plug,
    Shield,
    HelpCircle,
    LogOut,
    Settings2,
} from "lucide-react";

interface SettingsTab {
    id: string;
    label: string;
    icon: any;
    href: string;
}

// Create a context for user data within settings
interface SettingsContextType {
    user: any;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsContext must be used within TabbedSettingsLayout');
    }
    return context;
};

const settingsTabs: SettingsTab[] = [
    {
        id: 'account',
        label: 'Account',
        icon: User,
        href: '/settings/account'
    },
    {
        id: 'customization',
        label: 'Customization',
        icon: Settings,
        href: '/settings/customization'
    },
    {
        id: 'billing',
        label: 'Billing & monetization',
        icon: CreditCard,
        href: '/settings/billing'
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        href: '/settings/notifications'
    },
    {
        id: 'integrations',
        label: 'Integrations',
        icon: Plug,
        href: '/settings/integrations'
    },
    {
        id: 'security',
        label: 'Security',
        icon: Shield,
        href: '/settings/security'
    },
    {
        id: 'support',
        label: 'Support',
        icon: HelpCircle,
        href: '/settings/support'
    },
    {
        id: 'logout',
        label: 'Logout',
        icon: LogOut,
        href: '/settings/logout'
    },
];

interface TabbedSettingsLayoutProps {
    children: React.ReactNode;
    user?: any;
}

export default function TabbedSettingsLayout({ children, user }: TabbedSettingsLayoutProps) {
    const pathname = usePathname();

    const getActiveTab = () => {
        const currentPath = pathname.split('/').pop();
        return settingsTabs.find(tab => tab.id === currentPath)?.id || 'account';
    };

    const activeTab = getActiveTab();

    return (
        <SettingsContext.Provider value={{ user }}>
            <div className="min-h-screen bg-background">
                <div className="flex">
                    {/* Left Sidebar Navigation */}
                    <div className="w-64 border-r border-border">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>
                            <nav className="space-y-1">
                                {settingsTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;

                                    return (
                                        <Link
                                            key={tab.id}
                                            href={tab.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </SettingsContext.Provider>
    );
}