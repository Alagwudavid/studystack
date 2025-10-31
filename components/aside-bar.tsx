"use client";

import { usePathname } from "next/navigation";
import { useIsTablet } from "@/components/ui/use-tablet";
import { SkeletonAside } from "@/components/ui/skeleton-aside";
import { ArrowUpFromDot, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useScreenSize } from "@/hooks/use-screen-size";

export function AsideBar() {
  const { isTablet, isMobile } = useScreenSize();
  const pathname = usePathname();

  // const hideAsideBar = ["/beet", "/settings", "/home", "/"].includes(pathname);
  const hideAsideBar =
    ["/beet", "/settings", "/reels"].includes(pathname) ||
    ["/learn", "/community"].some((route) => pathname.startsWith(route));

  // Hide on mobile/tablet or specific routes
  if (isMobile || isTablet || hideAsideBar) {
    return null;
  }

  return (
    <>
      <aside className="bg-background flex flex-col justify-between h-full w-80 pt-16 pr-2 p-0 font-mono theme-aware shrink-0">
        {isTablet === undefined ? (
          <SkeletonAside />
        ) : (
          <div className="grid grid-cols-1 w-full gap-4">
            <div className="relative overflow-hidden bg-background flex flex-row items-center justify-between h-40 w-full p-5 font-mono rounded-3xl theme-aware border border-gray-300 dark:border-gray-700">
              <div className="flex flex-col items-start justify-center h-full">
                <p className="text-foreground font-semibold">
                  Your Streak
                </p>
                <p className="text-7xl font-semibold">
                  20
                </p>
                <p className="text-foreground font-semibold">
                  days streak.
                </p>
              </div>
              <svg
                className="size-20 text-[#FF2400]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M3.31307 14.6996C3.4791 14.3201 3.92132 14.147 4.3008 14.3131L9.3008 16.5006C9.68029 16.6666 9.85333 17.1088 9.68731 17.4883C9.52128 17.8678 9.07906 18.0408 8.69957 17.8748L3.69958 15.6873C3.32009 15.5213 3.14705 15.0791 3.31307 14.6996ZM20.6873 14.6996C20.8533 15.0791 20.6803 15.5213 20.3008 15.6873L4.3008 22.6873C3.92132 22.8533 3.4791 22.6803 3.31307 22.3008C3.14705 21.9213 3.32009 21.4791 3.69958 21.3131L19.6996 14.3131C20.0791 14.147 20.5213 14.3201 20.6873 14.6996ZM13.8131 19.2933C13.9791 18.9138 14.4213 18.7408 14.8008 18.9068L20.3008 21.3131C20.6803 21.4791 20.8533 21.9213 20.6873 22.3008C20.5213 22.6803 20.0791 22.8533 19.6996 22.6873L14.1996 20.2811C13.8201 20.115 13.647 19.6728 13.8131 19.2933Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.6 15C13.7333 15 18 13.7615 18 8.80745C18 5.776 16.1512 3.5774 14.4009 2.2646C13.503 1.59108 12.3529 2.28965 12.3529 3.38896C12.3529 4.13169 12.1424 5.36614 11.5596 6.27998C10.8777 7.34944 9.75127 6.421 9.57296 5.17624C9.48354 4.55201 8.79638 4.29388 8.26099 4.65274C7.20839 5.35826 6 6.71017 6 8.80745C6 13.7615 9.73333 15 11.6 15ZM15.2155 9.28163C15.6123 9.40065 15.8374 9.81877 15.7184 10.2155C15.4495 11.1119 14.3344 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C13.5056 11.25 14.1505 10.2215 14.2816 9.78449C14.4007 9.38774 14.8188 9.16261 15.2155 9.28163Z" fill="currentColor" />
              </svg>
            </div>
            <div className="relative overflow-hidden bg-background flex flex-col items-start justify-start w-full p-5 font-mono rounded-3xl theme-aware border border-gray-300 dark:border-gray-700">
              <p className="text-foreground font-semibold">
                Today&#39;s Milestone
              </p>
              <div className="mt-4 flex flex-row justify-between gap-2 w-full">
                <img src="/placeholder-user.jpg" alt="Mascot" className="w-14 h-14 rounded-lg bg-[#23263a] border-2" />
                <img src="/placeholder-user.jpg" alt="Mascot" className="w-14 h-14 rounded-lg bg-[#23263a] border-2" />
                <img src="/placeholder-user.jpg" alt="Mascot" className="w-14 h-14 rounded-lg bg-[#23263a] border-2" />
                <img src="/placeholder-user.jpg" alt="Mascot" className="w-14 h-14 rounded-lg bg-[#23263a] border-2" />
              </div>
              <Link href="/premium" className="w-full bg-white rounded-2xl flex items-center justify-center text-[#000000] hover:underline mt-4 py-3 px-5 font-semibold">
                View all
              </Link>
            </div>
            <div className="relative overflow-hidden bg-[#8A2BE2] text-white flex flex-col justify-between h-52 w-full p-5 font-mono rounded-3xl theme-aware">
              <p className="text-xl uppercase font-bold">
                Get Spark!
              </p>
              <p className="text-foreground font-semibold">
                Access our Spark features, Courses, Ai and more.
              </p>
              <Link href="/premium" className="bg-white rounded-2xl flex items-center justify-center text-[#8A2BE2] hover:underline mt-2 py-3 px-5 font-semibold">
                Upgrade Now <ArrowUpFromDot className="inline-block w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="relative overflow-hidden bg-background flex flex-col w-full p-5 font-mono rounded-3xl theme-aware border border-gray-300 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <p className="text-foreground font-semibold">
                  Add friends
                </p>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                Add friends to see their progress and compete with them.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/placeholder-user1.png" alt="Mascot" className="w-10 h-10 rounded-lg bg-[#23263a]" />
                  <p className="text-foreground font-semibold">
                    Louis N.
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/placeholder-user.jpg" alt="Mascot" className="w-10 h-10 rounded-lg bg-[#23263a]" />
                  <p className="text-foreground font-semibold">
                    Unknown N.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/placeholder-user1.png" alt="Mascot" className="w-10 h-10 rounded-lg bg-[#23263a]" />
                  <p className="text-foreground font-semibold">
                    Mark D.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
