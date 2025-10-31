"use client";

import { useState } from "react";
import { Search, X, Filter, Clock, User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchSidePanel({ isOpen, onClose }: SearchSidePanelProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const recentSearches = [
        "wadada dang dance wallpa...",
        "xiami live wallpaper",
        "tutorial xiaomi super wallpa...",
        "kingplays sofia skin iferg to...",
        "kingplays iferg tournament"
    ];

    const suggestedUsers = [
        { name: "John Doe", username: "@johndoe", avatar: "/placeholder-user1.png" },
        { name: "Jane Smith", username: "@janesmith", avatar: "/placeholder-user2.png" },
        { name: "Alex Johnson", username: "@alexj", avatar: "/placeholder-user3.png" }
    ];

    return (
        <>
            {/* Backdrop - positioned to not cover the sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 left-[400px] lg:left-[400px]"
                    onClick={onClose}
                />
            )}

            {/* Side Panel */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed top-0 h-screen w-80 bg-background text-foreground border-r border-gray-300 dark:border-gray-700 z-40",
                        "left-20 lg:left-20" // Always position beside collapsed sidebar
                    )}
                >
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground" />
                            <Input
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#EEEDEC] dark:bg-[#2a2a2a] border-gray-600 text-foreground placeholder-gray-400 rounded-full"
                            />
                        </div>
                        {/* <Button variant="cool" size="sm" onClick={onClose} className="text-foreground hover:text-white">
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {!searchQuery ? (
                            <div className="space-y-6">
                                {/* Recent Searches */}
                                <div className="px-4">
                                    <h3 className="text-sm font-medium text-foreground mb-3">Recent searches</h3>
                                    <div className="space-y-2">
                                        {recentSearches.map((search, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                                onClick={() => setSearchQuery(search)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-4 w-4 text-foreground" />
                                                    <span className="text-sm text-foreground">{search}</span>
                                                </div>
                                                <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="text-foreground text-sm mt-3 hover:text-gray-300 transition-colors underline">
                                        See more
                                    </button>
                                </div>

                                {/* Suggested Users */}
                                <div className="px-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Suggested Users</h3>
                                    <div className="space-y-3">
                                        {suggestedUsers.map((user, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white text-sm font-semibold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4">
                                <p className="text-sm text-muted-foreground">
                                    Search results for "{searchQuery}" would appear here...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
