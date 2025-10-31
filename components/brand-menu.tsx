"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, BookOpen, Bot, LayoutDashboard, HelpCircle, MessageCircleDashed, CircleEllipsis } from "lucide-react";
import { Audiowide } from "next/font/google"
const audiowide_regular = Audiowide({
    subsets: ['latin'],
    weight: '400'
});


interface BrandMenuProps {
    className?: string;
}

interface Route {
    name: string;
    path: string;
}

export function BrandMenu({ className }: BrandMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const routes: Route[] = [
        { name: "Bitroot", path: "/home"},
        { name: "Learn", path: "/learn"},
        { name: "AI", path: "/beet"},
        { name: "Creator Dashboard", path: "/creator/" },
        { name: "My activity", path: "/settings/activity" },
    ];

    const getCurrentRoute = () => {
        const currentRoute = routes.find(route => pathname.startsWith(route.path));
        return currentRoute || routes[0];
    };

    const currentRoute = getCurrentRoute();

    return (
        <div className={`flex items-center ${className || ""}`}>
                <div>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 p-2 h-10 rounded-lg hover:bg-transparent dark:hover:bg-transparent border-0 border-none dark:border-none bg-transparent dark:bg-transparent"
                    >
                        {/* Brand Logo */}
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl text-foreground font-semibold ${audiowide_regular.className}`}>
                                {currentRoute.name}
                            </span>
                        </div>
                    </Button>
                </div>
        </div>
    );
}
