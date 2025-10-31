"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { serverLogout } from "@/lib/auth-actions";
import { clearNavigationHistory } from "@/lib/navigation-utils";
import {
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Languages,
  Flame,
  Compass,
  UsersRound,
  Headphones,
  Trophy,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Inbox,
  PencilRuler,
  AlignRight,
  AlignLeft,
  UserCircle,
  InboxIcon,
  X,
  Info,
  BookmarkIcon,
  Clock,
  EllipsisVertical,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import NotificationBadge from "@/components/NotificationBadge";



interface MainMenuProps {
  className?: string;
  showText?: boolean;
  avatarSize?: string;
}

export function MainMenu({ className, showText, avatarSize = "h-10 w-10" }: MainMenuProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useLayoutContext();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState("us");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { unreadCount } = useWebSocketContext();
  
  const UserProfile = () => (
    <Avatar className={avatarSize}>
      <AvatarImage src={user?.profile_image || undefined} alt="User Profile" />
      <AvatarFallback className="bg-card text-foreground font-semibold">
        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
      </AvatarFallback>
    </Avatar>
  );
  const SparkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      className={cn("shrink-0 size-6", props.className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M5.66953 9.91436L8.73167 5.77133C10.711 3.09327 11.7007 1.75425 12.6241 2.03721C13.5474 2.32018 13.5474 3.96249 13.5474 7.24712V7.55682C13.5474 8.74151 13.5474 9.33386 13.926 9.70541L13.946 9.72466C14.3327 10.0884 14.9492 10.0884 16.1822 10.0884C18.4011 10.0884 19.5106 10.0884 19.8855 10.7613C19.8917 10.7724 19.8977 10.7837 19.9036 10.795C20.2576 11.4784 19.6152 12.3475 18.3304 14.0857L15.2683 18.2287C13.2889 20.9067 12.2992 22.2458 11.3758 21.9628C10.4525 21.6798 10.4525 20.0375 10.4525 16.7528L10.4526 16.4433C10.4526 15.2585 10.4526 14.6662 10.074 14.2946L10.054 14.2754C9.6673 13.9117 9.05079 13.9117 7.81775 13.9117C5.59888 13.9117 4.48945 13.9117 4.1145 13.2387C4.10829 13.2276 4.10225 13.2164 4.09639 13.205C3.74244 12.5217 4.3848 11.6526 5.66953 9.91436Z" fill="currentColor" />
    </svg>
  );
  const ActivitiesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 4.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.471 9.406c.029.884.029 1.906.029 3.094c0 4.243 0 6.364-1.318 7.682S15.742 21.5 11.5 21.5s-6.364 0-7.682-1.318S2.5 16.742 2.5 12.5s0-6.364 1.318-7.682S7.258 3.5 11.5 3.5c1.188 0 2.21 0 3.094.029" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 12.5H8l2-4l3 8l2-4h2.5" /></g></svg>
  );
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      // Clear client-side state first
      localStorage.removeItem("auth_token");
      localStorage.clear(); // Clear all localStorage for complete cleanup

      // Clear navigation history to force fresh start on next visit
      clearNavigationHistory();

      // Call server logout for backend session termination
      try {
        await serverLogout();
      } catch (error) {
        console.error("Server logout error:", error);
        // If server logout fails, force hot refresh to auth page
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect to auth with hot refresh even if logout fails
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
    }
  };

  // const languages = [
  //   { id: 0, label: "Local", flag: "ea" },
  //   { id: 1, label: "English", flag: "us" },
  //   { id: 2, label: "Swahili", flag: "tz" },
  //   { id: 3, label: "Yoruba", flag: "ng" },
  //   { id: 4, label: "Amharic", flag: "et" },
  //   { id: 5, label: "Hausa", flag: "ng" },
  //   { id: 6, label: "Igbo", flag: "ng" },
  //   { id: 7, label: "Zulu", flag: "za" },
  //   { id: 8, label: "French", flag: "fr" },
  // ];

  const moreMenuOptions = [
    {
      label: "Study Groups",
      icon: <UsersRound className="!size-5" />,
      value: "study-groups",
      href: "/study-groups",
    },
    {
      label: "Learning Paths",
      icon: <PencilRuler className="!size-5" />,
      value: "learning-paths",
      href: "/learning-paths",
    },
    {
      label: "Mentorship",
      icon: <User className="!size-5" />,
      value: "mentorship",
      href: "/mentorship",
    },
    {
      label: "Achievements",
      icon: <Trophy className="!size-5" />,
      value: "achievements",
      href: "/achievements",
    },
    {
      label: "Leaderboard",
      icon: <Trophy className="!size-5" />,
      value: "leaderboard",
      href: "/leaderboard",
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, setTheme]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (languageFlag: string) => {
    setCurrentLanguage(languageFlag);
    setIsLanguageDropdownOpen(false);
  };

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const ClassRoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-5" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.15V10q0-.8.588-1.35t1.387-.5q1.975.3 3.763 1.163T12 11.55q1.475-1.375 3.263-2.238t3.762-1.162q.8-.05 1.388.5T21 10v7.15q0 .8-.525 1.363t-1.325.612q-1.6.25-3.1.825t-2.8 1.525q-.275.225-.587.337t-.663.113t-.663-.112t-.587-.338q-1.3-.95-2.8-1.525t-3.1-.825q-.8-.05-1.325-.612T3 17.15m9 2.75q1.575-1.175 3.35-1.875T19 17.1v-6.9q-1.825.325-3.588 1.313T12 14.15q-1.65-1.65-3.412-2.637T5 10.2v6.9q1.875.225 3.65.925T12 19.9M12 9q-1.65 0-2.825-1.175T8 5t1.175-2.825T12 1t2.825 1.175T16 5t-1.175 2.825T12 9m0-2q.825 0 1.413-.587T14 5t-.587-1.412T12 3t-1.412.588T10 5t.588 1.413T12 7m0 7.15" /></svg>
  );

  return (
    <>
      {user ? (<DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="cool"
            className={cn(
              "relative rounded-xl hover:bg-card",
              showText ? "h-auto w-full justify-start gap-3 p-2" : "h-10 w-10 p-0",
              className
            )}
          >
            <div className={`flex items-center gap-3 w-full ${showText ? "justify-between" : "justify-center"}`}>
              <div className="flex-shrink-0 relative">
                <Avatar className={`${avatarSize} border-card border-2`}>
                  <AvatarImage src={user?.profile_image || undefined} alt="User Profile" />
                  <AvatarFallback className="bg-card text-foreground font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              {!showText && (
                <div className="absolute -bottom-1 right-0 z-10 rounded bg-card text-muted-foreground border-2 border-card w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><rect width={18} height={18} x={3} y={3} rx={2}></rect><path d="M7 8h10M7 12h10M7 16h10"></path></g></svg>
                </div>
              )}
              </div>
              {showText && (
                <span className="flex-1 text-lg text-start capitalize text-foreground hover:!text-foreground animate-in fade-in-0 slide-in-from-left-2 duration-200">
                  {user?.name || "Guest"}
                </span>
              )}
              {showText && (
                <EllipsisVertical />
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-screen rounded-lg p-0 border-2 shadow-lg bg-muted w-80 overflow-y-auto scrollbar-custom relative z-[60]"
          side="right"
          align="start"
          sideOffset={8}
        >
          <div className="order-1 lg:order-2">
            <div className="space-y-1 p-2">
                <div
                  // onClick={() => router.push(`/@${user?.username || "user"}`)}
                  className="flex items-center gap-2 p-2 text-foreground"
                >
                  <Avatar className={`${avatarSize} border-card border-2`}>
                    <AvatarImage src={user?.profile_image || undefined} alt="User Profile" />
                    <AvatarFallback className="bg-card text-foreground font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="capitalize font-medium">{user?.name || "Guest"}</span>
                    <div className="text-base text-muted-foreground">@{user?.username || "user"}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 p-2 rounded-lg text-card-foreground bg-card/70 hover:bg-card cursor-pointer"
                >
                  <SparkIcon className="!size-5" />
                  <span className="text-base">Get verified</span>
                </div>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.992 17h3m3 0h-3m0 0v-3m0 3v3"></path><path d="M4 9.4V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm0 10v-4.8a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm10-10V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6h-4.8a.6.6 0 0 1-.6-.6Z"></path></g></svg>
                  <span className="text-base">Business</span>
                </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2">
                <span className="text-sm text-muted-foreground font-semibold">You</span>
                <DropdownMenuItem
                  onClick={() => router.push(`/@${user?.username || "user"}`)}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
                  </svg>
                  <span className="text-base">Your profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/activities")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  <span className="text-base">My activity</span>
                  <NotificationBadge className="text-xs" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 16 16"><path fill="currentColor" d="M5.5 5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m0 5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m-1-8A1.5 1.5 0 0 0 3 3.5v10a.5.5 0 0 0 .5.5h2.796a3.3 3.3 0 0 1-.273-1H4V3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v2.187c.31-.12.647-.187 1-.187v-2A1.5 1.5 0 0 0 8.5 2zm3 3a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1M6 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m5.75 1.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0m3.5.5a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M13 12.6c0 1.184-.8 2.4-3 2.4s-3-1.216-3-2.4A1.6 1.6 0 0 1 8.6 11h2.8a1.6 1.6 0 0 1 1.6 1.6m.704 1.4h.046c1.65 0 2.25-.912 2.25-1.8a1.2 1.2 0 0 0-1.2-1.2h-1.35c.345.441.55.997.55 1.6c0 .462-.09.946-.296 1.4"></path></svg>
                  <span className="text-base">Network</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 32 32"><path fill="currentColor" d="M4 8.5V11h6.464a1.5 1.5 0 0 0 1.061-.44l2.06-2.06l-2.06-2.06a1.5 1.5 0 0 0-1.06-.44H6.5A2.5 2.5 0 0 0 4 8.5m-2 0A4.5 4.5 0 0 1 6.5 4h3.964a3.5 3.5 0 0 1 2.475 1.025L15.414 7.5H25.5A4.5 4.5 0 0 1 30 12v4.292a9 9 0 0 0-2-1.357V12a2.5 2.5 0 0 0-2.5-2.5H15.414l-2.475 2.475A3.5 3.5 0 0 1 10.464 13H4v10.5A2.5 2.5 0 0 0 6.5 26h9.012c.252.712.59 1.383 1.003 2H6.5A4.5 4.5 0 0 1 2 23.5zm22 22a7.5 7.5 0 1 0 0-15a7.5 7.5 0 0 0 0 15m1-12.25V22h3.75a.75.75 0 0 1 0 1.5H25v3.75a.75.75 0 0 1-1.5 0V23.5h-3.75a.75.75 0 0 1 0-1.5h3.75v-3.75a.75.75 0 0 1 1.5 0"></path></svg>
                  <span className="text-base">Resources</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.652 14.714V9.78m3.18 2.07l4.049 2.667a4 4 0 0 0 4.402 0l4.049-2.668m-12.5 0L3.099 10.05a.99.99 0 0 1-.45-.815m3.183 2.616v5.061c0 .495.119.987.44 1.364c.747.877 2.514 2.39 5.81 2.39s5.063-1.513 5.81-2.39c.32-.377.44-.869.44-1.364V11.85m0 0l2.48-1.634a1.2 1.2 0 0 0 0-2.004l-6.53-4.302a4 4 0 0 0-4.401 0L3.099 8.379a.99.99 0 0 0-.45.855m0 0v.547"></path></svg>
                  <span className="text-base">Your courses</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <Clock className="!size-5" />
                  <span className="text-base">History</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <BookmarkIcon className="!size-5"/>
                  <span className="text-base">Bookmark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="!size-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z" /></svg>
                  <span className="text-base">Read later</span>
                </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2">
                <span className="text-sm text-muted-foreground font-semibold">Theme</span>
                <div className="flex items-center gap-1 p-2 bg-card rounded-lg">
                  <Button
                    variant={theme === "light" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex-1 h-8 text-sm gap-1",
                      theme === "light" && "bg-muted shadow-sm text-black dark:text-white dark:hover:!text-white"
                    )}
                  >
                    <Sun className="h-3 w-3" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex-1 h-8 text-sm gap-1",
                      theme === "dark" && "bg-card shadow-sm text-black dark:text-white dark:hover:!text-white"
                    )}
                  >
                    <Moon className="h-3 w-3" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "flex-1 h-8 text-sm gap-1",
                      theme === "system" && "bg-card shadow-sm text-black dark:text-white dark:hover:!text-white"
                    )}
                  >
                    <Monitor className="h-3 w-3" />
                    Auto
                  </Button>
                </div>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2">
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <Settings className="!size-5" />
                  <span className="text-base">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <HelpCircle className="!size-5" />
                  <span className="text-base">Help center</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/#")}
                  className="flex items-center gap-2 p-2 rounded-lg text-foreground hover:!text-foreground hover:bg-card cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="text-base">Legal / Documentation</span>
                </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <DropdownMenuItem
                className="flex items-center gap-2 p-2 rounded-lg text-destructive-foreground hover:!text-destructive-foreground bg-destructive/70 hover:bg-destructive cursor-pointer"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="!size-5" />
                <span className="text-base">
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </span>
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>)
        : (
          <Button
            variant="cool"
            className={cn(
              "relative rounded-xl hover:bg-card",
              showText ? "h-auto w-full justify-start gap-3 p-2" : "h-8 w-8 p-0",
              className
            )}
            onClick={() => router.push(`/auth`)}
          >
            <div className="flex items-center gap-3 w-fit">
              <div className="flex-shrink-0">
                <Avatar className={avatarSize}>
                  <AvatarImage src={"/user-placeholder.png"} alt="User Profile" />
                  <AvatarFallback className="bg-card text-foreground font-semibold">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
              {showText && (
                <span className="text-lg text-foreground hover:!text-foreground animate-in fade-in-0 slide-in-from-left-2 duration-200">
                  Login
                </span>
              )}
            </div>
          </Button>
        )
      }
    </>
  );
}
