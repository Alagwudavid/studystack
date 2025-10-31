"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Heart,
    Search,
    Menu,
    PanelLeftClose,
    PlusSquare,
    MoreHorizontal,
    PanelLeftOpen,
    HelpCircle,
    CircleEllipsis,
    Info,
    Signal,
} from "lucide-react";
import { Audiowide } from "next/font/google";
import { Tooltip } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });

interface BottomWidgetProps {
    className?: string;
}


export function BottomWidget({ className }: BottomWidgetProps) {

    return (
        <>
            <div className={cn("px-4 flex flex-row items-center justify-between w-full h-10 bg-muted/50", className)}>
                
            </div>
        </>
    );
}
