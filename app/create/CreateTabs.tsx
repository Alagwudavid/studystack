"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import CreatePostPage from "./post/CreatePostPage";
import CreateQuestionPage from "./question/CreateQuestionPage";
import CreateLinkPage from "./link/CreateLinkPage";
import CreateEventPage from "./event/CreateEventPage";
import CreatePollPage from "./poll/CreatePollPage";

interface CreateTabsProps {
    children: React.ReactNode;
    user: {
        name: string;
        profile_image?: string | null;
    };
}

const tabs = [
    {
        id: "post",
        label: "Post",
        href: "/create/post",
        description: "Share updates, thoughts, or general content",
        component: CreatePostPage
    },
    {
        id: "question",
        label: "Question",
        href: "/create/question",
        description: "Ask for help or clarification",
        component: CreateQuestionPage
    },
    {
        id: "link",
        label: "Share a link",
        href: "/create/link",
        description: "Share educational resources or interesting links",
        component: CreateLinkPage
    },
    {
        id: "event",
        label: "Event",
        href: "/create/event",
        description: "Create study sessions or events",
        component: CreateEventPage
    },
    {
        id: "poll",
        label: "Poll",
        href: "/create/poll",
        description: "Ask the community for opinions",
        component: CreatePollPage
    },
];

export default function CreateTabs({ children, user }: CreateTabsProps) {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = tabs.find(tab => pathname === tab.href);

    // Render the appropriate component based on the current path
    const renderCurrentPage = () => {
        if (activeTab) {
            const Component = activeTab.component;
            return <Component user={user} />;
        }
        return children;
    };

    return (
        <div className="max-w-2xl mx-auto border min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
                <div className="max-w-2xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => router.back()} className="p-1.5 bg-card/50 border-2 text-foreground rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"></path></svg>
                        </button>
                        <h1 className="text-lg font-semibold">Create {activeTab?.label}</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;

                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto">
                {renderCurrentPage()}
            </div>
        </div>
    );
}