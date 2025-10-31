"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SessionManager } from "@/components/SessionManager";
import {
    Monitor,
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

interface SessionsSettingsClientProps {
    serverUser: User;
}

export default function SessionsSettingsClient({ serverUser }: SessionsSettingsClientProps) {
    const { setServerUser } = useAuth();

    useEffect(() => {
        if (serverUser && setServerUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

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
                    <Monitor className="w-8 h-8" />
                    Sessions
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    View and manage your active device sessions for security
                </p>
            </div>

            {/* Sessions Manager */}
            <SessionManager />
        </div>
    );
}
