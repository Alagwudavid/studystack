"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, AudioWaveform, HelpCircle, CircleEllipsis, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname();
    const menuItems = [
        {
            id: "Home",
            label: "Home",
            icon: <svg className="shrink-0 size-6 group-hover/sidebar:scale-110 group-hover/sidebar:-rotate-12 duration-500 ease-in-out" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39747 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z" fill="currentColor" />
            </svg>,
            href: "/home"
        },
        {
            id: "explore",
            label: "Explore",
            icon: <Search className="shrink-0 size-6" />,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "messages",
            label: "Messages",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.33008 14.49L9.71008 11.4C10.0501 10.96 10.6801 10.88 11.1201 11.22L12.9501 12.66C13.3901 13 14.0201 12.92 14.3601 12.49L16.6701 9.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "notifications",
            label: "Activities",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeWidth="round" />
            </svg>,
            href: "/activities",
            disabled: false,
        },
        {
            id: "events",
            label: "Events",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10.75C22.41 10.75 22.75 10.41 22.75 10V9C22.75 4.59 21.41 3.25 17 3.25H10.75V5.5C10.75 5.91 10.41 6.25 10 6.25C9.59 6.25 9.25 5.91 9.25 5.5V3.25H7C2.59 3.25 1.25 4.59 1.25 9V9.5C1.25 9.91 1.59 10.25 2 10.25C2.96 10.25 3.75 11.04 3.75 12C3.75 12.96 2.96 13.75 2 13.75C1.59 13.75 1.25 14.09 1.25 14.5V15C1.25 19.41 2.59 20.75 7 20.75H9.25V18.5C9.25 18.09 9.59 17.75 10 17.75C10.41 17.75 10.75 18.09 10.75 18.5V20.75H17C21.41 20.75 22.75 19.41 22.75 15C22.75 14.59 22.41 14.25 22 14.25C21.04 14.25 20.25 13.46 20.25 12.5C20.25 11.54 21.04 10.75 22 10.75ZM10.75 14.17C10.75 14.58 10.41 14.92 10 14.92C9.59 14.92 9.25 14.58 9.25 14.17V9.83C9.25 9.42 9.59 9.08 10 9.08C10.41 9.08 10.75 9.42 10.75 9.83V14.17Z" fill="currentColor" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "beet",
            label: "Beet Ai",
            icon: <AudioWaveform className="shrink-0 size-6" />,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "community",
            label: "Communities",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6C9 7.65685 10.3431 9 12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6Z" fill="currentColor" />
                <path d="M2.5 18C2.5 19.6569 3.84315 21 5.5 21C7.15685 21 8.5 19.6569 8.5 18C8.5 16.3431 7.15685 15 5.5 15C3.84315 15 2.5 16.3431 2.5 18Z" fill="currentColor" />
                <path d="M18.5 21C16.8431 21 15.5 19.6569 15.5 18C15.5 16.3431 16.8431 15 18.5 15C20.1569 15 21.5 16.3431 21.5 18C21.5 19.6569 20.1569 21 18.5 21Z" fill="currentColor" />
                <path d="M7.20468 7.56231C7.51523 7.28821 7.54478 6.81426 7.27069 6.5037C6.99659 6.19315 6.52264 6.1636 6.21208 6.43769C4.39676 8.03991 3.25 10.3865 3.25 13C3.25 13.4142 3.58579 13.75 4 13.75C4.41421 13.75 4.75 13.4142 4.75 13C4.75 10.8347 5.69828 8.89187 7.20468 7.56231Z" fill="currentColor" />
                <path d="M17.7879 6.43769C17.4774 6.1636 17.0034 6.19315 16.7293 6.5037C16.4552 6.81426 16.4848 7.28821 16.7953 7.56231C18.3017 8.89187 19.25 10.8347 19.25 13C19.25 13.4142 19.5858 13.75 20 13.75C20.4142 13.75 20.75 13.4142 20.75 13C20.75 10.3865 19.6032 8.03991 17.7879 6.43769Z" fill="currentColor" />
                <path d="M10.1869 20.0217C9.7858 19.9184 9.37692 20.1599 9.27367 20.561C9.17043 20.9622 9.41192 21.3711 9.81306 21.4743C10.5129 21.6544 11.2458 21.75 12 21.75C12.7542 21.75 13.4871 21.6544 14.1869 21.4743C14.5881 21.3711 14.8296 20.9622 14.7263 20.561C14.6231 20.1599 14.2142 19.9184 13.8131 20.0217C13.2344 20.1706 12.627 20.25 12 20.25C11.373 20.25 10.7656 20.1706 10.1869 20.0217Z" fill="currentColor" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "study-groups",
            label: "Study groups",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.6 3H8.4A2.4 2.4 0 0 0 6 5.4v11.2A2.4 2.4 0 0 0 8.4 19h11.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 19.6 3ZM9 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1Zm1 2a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-8Zm-1 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Z" fill="currentColor" /><path d="M4 5a1 1 0 0 0-2 0v11.6C2 20.132 4.868 23 8.4 23H20a1 1 0 1 0 0-2H8.4A4.403 4.403 0 0 1 4 16.6V5Z" fill="currentColor" /></svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "learn",
            label: "Learn",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.5 16V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15H19.5C20.05 15 20.5 15.45 20.5 16Z" fill="currentColor" />
                <path d="M15.5 2H8.5C4.5 2 3.5 3 3.5 7V14.58C4.26 13.91 5.26 13.5 6.35 13.5H19.5C20.05 13.5 20.5 13.05 20.5 12.5V7C20.5 3 19.5 2 15.5 2ZM13 10.75H8C7.59 10.75 7.25 10.41 7.25 10C7.25 9.59 7.59 9.25 8 9.25H13C13.41 9.25 13.75 9.59 13.75 10C13.75 10.41 13.41 10.75 13 10.75ZM16 7.25H8C7.59 7.25 7.25 6.91 7.25 6.5C7.25 6.09 7.59 5.75 8 5.75H16C16.41 5.75 16.75 6.09 16.75 6.5C16.75 6.91 16.41 7.25 16 7.25Z" fill="currentColor" />
            </svg>,
            href: "/learn",
            disabled: false,
        },
        {
            id: "challenges",
            label: "Challenges",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 18.2509H9C7.9 18.2509 7 19.1509 7 20.2509V20.5009H6C5.59 20.5009 5.25 20.8409 5.25 21.2509C5.25 21.6609 5.59 22.0009 6 22.0009H18C18.41 22.0009 18.75 21.6609 18.75 21.2509C18.75 20.8409 18.41 20.5009 18 20.5009H17V20.2509C17 19.1509 16.1 18.2509 15 18.2509H12.75V15.9609C12.5 15.9909 12.25 16.0009 12 16.0009C11.75 16.0009 11.5 15.9909 11.25 15.9609V18.2509Z" fill="currentColor" />
                <path d="M18.4793 11.64C19.1393 11.39 19.7193 10.98 20.1793 10.52C21.1093 9.49 21.7193 8.26 21.7193 6.82C21.7193 5.38 20.5893 4.25 19.1493 4.25H18.5893C17.9393 2.92 16.5793 2 14.9993 2H8.9993C7.4193 2 6.0593 2.92 5.4093 4.25H4.8493C3.4093 4.25 2.2793 5.38 2.2793 6.82C2.2793 8.26 2.8893 9.49 3.8193 10.52C4.2793 10.98 4.8593 11.39 5.5193 11.64C6.5593 14.2 9.0593 16 11.9993 16C14.9393 16 17.4393 14.2 18.4793 11.64ZM14.8393 8.45L14.2193 9.21C14.1193 9.32 14.0493 9.54 14.0593 9.69L14.1193 10.67C14.1593 11.27 13.7293 11.58 13.1693 11.36L12.2593 11C12.1193 10.95 11.8793 10.95 11.7393 11L10.8293 11.36C10.2693 11.58 9.8393 11.27 9.8793 10.67L9.9393 9.69C9.9493 9.54 9.8793 9.32 9.7793 9.21L9.1593 8.45C8.7693 7.99 8.9393 7.48 9.5193 7.33L10.4693 7.09C10.6193 7.05 10.7993 6.91 10.8793 6.78L11.4093 5.96C11.7393 5.45 12.2593 5.45 12.5893 5.96L13.1193 6.78C13.1993 6.91 13.3793 7.05 13.5293 7.09L14.4793 7.33C15.0593 7.48 15.2293 7.99 14.8393 8.45Z" fill="currentColor" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "courses",
            label: "Courses",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.15 6.17C20.74 5.95 19.88 5.72 18.71 6.54L17.24 7.58C17.13 4.47 15.78 3.25 12.5 3.25H6.5C3.08 3.25 1.75 4.58 1.75 8V16C1.75 18.3 3 20.75 6.5 20.75H12.5C15.78 20.75 17.13 19.53 17.24 16.42L18.71 17.46C19.33 17.9 19.87 18.04 20.3 18.04C20.67 18.04 20.96 17.93 21.15 17.83C21.56 17.62 22.25 17.05 22.25 15.62V8.38C22.25 6.95 21.56 6.38 21.15 6.17ZM11 11.38C9.97 11.38 9.12 10.54 9.12 9.5C9.12 8.46 9.97 7.62 11 7.62C12.03 7.62 12.88 8.46 12.88 9.5C12.88 10.54 12.03 11.38 11 11.38Z" fill="currentColor" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
        {
            id: "spark",
            label: "Get spark",
            icon: <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.66953 9.91436L8.73167 5.77133C10.711 3.09327 11.7007 1.75425 12.6241 2.03721C13.5474 2.32018 13.5474 3.96249 13.5474 7.24712V7.55682C13.5474 8.74151 13.5474 9.33386 13.926 9.70541L13.946 9.72466C14.3327 10.0884 14.9492 10.0884 16.1822 10.0884C18.4011 10.0884 19.5106 10.0884 19.8855 10.7613C19.8917 10.7724 19.8977 10.7837 19.9036 10.795C20.2576 11.4784 19.6152 12.3475 18.3304 14.0857L15.2683 18.2287C13.2889 20.9067 12.2992 22.2458 11.3758 21.9628C10.4525 21.6798 10.4525 20.0375 10.4525 16.7528L10.4526 16.4433C10.4526 15.2585 10.4526 14.6662 10.074 14.2946L10.054 14.2754C9.6673 13.9117 9.05079 13.9117 7.81775 13.9117C5.59888 13.9117 4.48945 13.9117 4.1145 13.2387C4.10829 13.2276 4.10225 13.2164 4.09639 13.205C3.74244 12.5217 4.3848 11.6526 5.66953 9.91436Z" fill="currentColor" />
            </svg>,
            href: "/coming-soon",
            disabled: true,
        },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-screen overflow-hidden overflow-y-auto w-80 bg-[#000a14] text-white z-50 transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-0">
                    <div className="flex items-center gap-2 text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2.86 3.11"
                            className="!size-7"
                            style={{
                                shapeRendering: "geometricPrecision",
                                textRendering: "geometricPrecision",
                                imageRendering: "optimizeQuality",
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                            }}
                        >
                            <path
                                fill="currentColor"
                                d="M0.43 2.2l-0.06 0c0,-0.46 0.23,-0.79 0.68,-0.79l0 0.06c-0.39,0.01 -0.62,0.33 -0.62,0.73zm0.95 -2.2l0.09 0c0.12,0.03 0.22,0.19 0.22,0.47 0.01,0 0.59,-0.47 0.59,0 0,0.34 -0.44,0.51 -0.53,0.59 0.48,0 0.72,0.12 0.92,0.4 0.17,0.26 0.25,0.68 0.13,1.05 -0.25,0.74 -1.18,0.59 -1.78,0.58 -0.36,-0.01 -0.83,-0.14 -0.97,-0.6 -0.11,-0.37 -0.03,-0.79 0.15,-1.05 0.2,-0.27 0.44,-0.38 0.91,-0.38 -0.03,-0.03 0,-0.01 -0.05,-0.04l-0.14 -0.08c-0.13,-0.08 -0.34,-0.27 -0.34,-0.44 0,-0.51 0.55,-0.06 0.58,-0.03 0,-0.28 0.11,-0.44 0.22,-0.47zm-0.22 2.57c0.02,0 0.04,-0.02 0.06,-0.03 0.11,-0.04 0.24,-0.06 0.34,-0.02 0.03,0.01 0.04,0.02 0.06,0.03 0.02,0.01 0.04,0.02 0.05,0.03 -0.01,0.03 -0.06,0.06 -0.1,0.08 -0.1,0.04 -0.21,0.03 -0.3,-0.01 -0.03,-0.01 -0.04,-0.02 -0.06,-0.03 -0.02,-0.02 -0.04,-0.03 -0.05,-0.05zm-0.01 -0.29c-0.04,0 -0.14,0 -0.18,0.01 -0.07,0.01 0,0.23 0.13,0.34 0.29,0.24 0.73,0.07 0.79,-0.25 0.01,-0.05 0.02,-0.09 -0.04,-0.1 -0.11,-0.01 -0.24,0 -0.35,0 -0.12,0 -0.24,0 -0.35,0z"
                            />
                        </svg>
                        <span className="text-lg font-medium">
                            Bitroot
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:bg-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Menu Items */}
                        <div className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const showNotificationBadge = item.id === "notifications"; // Show badge on notifications

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-lg relative",
                                            isActive
                                                ? "bg-gray-800 text-white"
                                                : "text-white hover:bg-gray-800"
                                        )}
                                    >
                                        <div className="relative">
                                            {item.icon}
                                            {showNotificationBadge && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                        {item.disabled ? <span className="text-red-500 font-normal text-xs">Not available</span> : ""}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
                {/* Post Button */}
                <div className="px-4">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg">
                        Post
                    </Button>
                </div>
                {/* Settings */}
                <div className="p-4">
                    <div className="mt-2">
                        <div className="flex items-center gap-4 mt-2">
                            <Link href="/accessibility/about-us" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                About
                            </Link>
                            <Link href="/settings/about-us" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                <HelpCircle className="size-3 shrink-0" />
                                Help center
                            </Link>
                            <Link href="/settings/about-us" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                Advertising
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <Link href="/legal/" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                Privacy and terms
                            </Link>
                            <Link href="/settings/ad-preferences" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                Ad Preferences
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <Link href="/ad/" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                Become a partner
                            </Link>
                            <Link href="/settings/about-us" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                Get our app
                            </Link>
                            <Link href="/accessibility/" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1">
                                <CircleEllipsis className="size-3 shrink-0" />
                                More
                            </Link>
                        </div>
                        <div className="px-3 py-2 text-xs text-center font-semibold capitalize tracking-wide">
                            Bitroot corporation © 2025
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
