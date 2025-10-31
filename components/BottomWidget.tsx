"use client";

import { useState, useEffect } from "react";
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

interface DeviceDetails {
    ip: string;
    location: string;
    loading: boolean;
}

export function BottomWidget({ className }: BottomWidgetProps) {
    const [deviceDetails, setDeviceDetails] = useState<DeviceDetails>({
        ip: '',
        location: '',
        loading: true
    });

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            try {
                // Fetch IP address
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();

                // Fetch location based on IP
                const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                const locationData = await locationResponse.json();

                setDeviceDetails({
                    ip: ipData.ip,
                    location: `${locationData.city}, ${locationData.country_name}`,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching device details:', error);
                setDeviceDetails({
                    ip: 'Unavailable',
                    location: 'Unavailable',
                    loading: false
                });
            }
        };

        fetchDeviceDetails();
    }, []);

    return (
        <>
            {/* More Information */}
            <div className={cn("px-4 flex flex-row items-center justify-center w-full h-10 space-x-3", className)}>
                <div className="text-sm text-start font-semibold capitalize tracking-wide flex items-center gap-2 flex-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 26.07 26.07"
                    >
                        <path
                            fill="currentColor"
                            d="M13.03 0c7.2,0 13.04,5.83 13.04,13.03 0,7.2 -5.84,13.04 -13.04,13.04 -7.2,0 -13.03,-5.84 -13.03,-13.04 0,-7.2 5.83,-13.03 13.03,-13.03zm1.73 9.63c-0.47,-0.32 -0.71,-0.71 -1.74,-1.33 -1.76,-1.06 -3.4,-1.03 -5.03,0.19 -0.43,0.32 -0.81,0.71 -1.13,1.14 -1.75,2.32 -0.28,5.71 -0.28,7.79 0,0.57 0.03,1.01 -0.23,1.53 -0.24,0.49 -0.47,0.47 -0.47,0.83 0,0.2 0.18,0.35 0.38,0.35 0.35,0 0.54,-0.74 1.98,-0.74 0.91,0 1.78,0.18 2.58,0.31 2.25,0.38 4.37,0.69 6.12,-1.06 2.25,-2.26 1.81,-4.65 -0.14,-6.89 -0.09,-0.1 -0.32,-0.34 -0.35,-0.43 0.09,-0.04 0.57,-0.08 0.71,-0.11 1.21,-0.2 2.07,-0.51 3.15,-1.04 0.24,-0.12 0.94,-0.46 0.94,-0.76 0,-0.24 -0.09,-0.42 -0.39,-0.42 -0.12,0 -0.78,0.43 -1.06,0.57 -1.06,0.53 -1.91,0.76 -3.11,0.94l-0.77 0.08 0.59 -0.68c0.67,-0.66 1.33,-1.21 2.11,-1.73 0.78,-0.52 1.71,-0.98 2.63,-1.22 0.39,-0.11 0.81,-0.09 0.81,-0.53 0,-0.63 -1.06,-0.22 -1.35,-0.12 -0.34,0.11 -0.59,0.21 -0.9,0.34 -0.3,0.13 -0.56,0.26 -0.82,0.41 -0.9,0.52 -1.51,0.93 -2.33,1.65l-1.12 1.1c0.01,-0.53 0.63,-2.31 0.82,-2.77 0.26,-0.65 0.55,-1.23 0.88,-1.83 0.08,-0.15 0.31,-0.46 0.31,-0.62 0,-0.2 -0.19,-0.38 -0.39,-0.38 -0.27,0 -0.39,0.27 -0.5,0.45 -0.12,0.2 -0.24,0.43 -0.35,0.64 -0.22,0.44 -0.44,0.87 -0.63,1.34 -0.28,0.72 -0.54,1.45 -0.73,2.2 -0.04,0.18 -0.13,0.68 -0.19,0.8z"
                        />
                    </svg>
                    &copy;{new Date().getFullYear()} Bitroot, llc
                </div>
                <div className="flex items-center space-x-3">
                    <Tooltip text="Got a request?" side="top">
                        <Link href="/contact-us" className="text-foreground font-semibold text-primary flex items-center gap-1">
                            Feedback •
                        </Link>
                    </Tooltip>
                    <Tooltip text="Made with love by reliable developers" side="top">
                        <Link href="/status" className="text-foreground font-semibold text-red-500 dark:text-red-400 flex items-center gap-1">
                            <Heart className="size-5" /> •
                        </Link>
                    </Tooltip>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="text-foreground font-semibold flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Info className="size-5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" side="top" align="end">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Platform Availability</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Check out Bitroot on different platforms
                                    </p>
                                </div>
                                <div className="flex items-center justify-center space-x-4">
                                    <Tooltip text="Web app • Available" side="top">
                                        <a href="https://www.bitroot.com" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold text-green-400 hover:text-green-600 flex items-center gap-1 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                            </svg>
                                        </a>
                                    </Tooltip>
                                    <Tooltip text="Mobile app • Coming-soon" side="top">
                                        <Link href="#" className="text-foreground font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-not-allowed transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                            </svg>
                                        </Link>
                                    </Tooltip>
                                    <Tooltip text="Desktop app • Coming-soon" side="top">
                                        <Link href="#" aria-disabled className="text-foreground font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-not-allowed transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                            </svg>
                                        </Link>
                                    </Tooltip>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">IP Address</span>
                                        <span className="text-blue-500 font-medium">
                                            {deviceDetails.loading ? 'Loading...' : deviceDetails.ip}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Location</span>
                                        <span className="text-green-500 font-medium">
                                            {deviceDetails.loading ? 'Loading...' : deviceDetails.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </>
    );
}
