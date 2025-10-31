"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Dot } from "@/components/ui/dot";
import { Badge } from "@/components/ui/badge";
import {
    BotMessageSquare,
    ChevronLeft,
    Eye,
    UsersRound,
    CheckCircle,
    Circle,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getLanguageSections, getUnitsBySection } from "@/data/learn";

const mascotUrl = "/images/mascot.png"; // Replace with your mascot image if available

// Helper function to sanitize URLs
function sanitizeUrl(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .trim();
}

const LearnLanguageClient = ({ params }: { params: { language: string } }) => {
    const { language } = useParams();
    const router = useRouter();
    const lang = (language as string)?.toLowerCase();
    const Sections = getLanguageSections(lang);

    const handleSectionClick = (Section: any) => {
        if (!Section.locked) {
            router.push(`/learn/${lang}/${sanitizeUrl(Section.title)}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center md:items-start justify-between max-w-7xl mx-auto w-full md:gap-5 gap-0 mb-10">
                <div className="flex-1 justify-center items-center w-full my-4">
                    <div className="rounded-3xl bg-[#fdf6fa] dark:bg-[#23263a] flex items-center justify-center w-full overflow-hidden relative">
                        <img
                            src={"/placeholder-banner.png"}
                            alt="Most Viewed Playlist"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-start gap-2 w-full">
                    <Link href={"/learn"} className="flex items-center justify-center capitalize text-3xl font-bold">
                        <ChevronLeft className="mr-2 !size-8" /> {lang}
                    </Link>
                    <div className="flex items-center space-x-2 mb-1 text-gray-500 dark:text-[#fafafa]/60">
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-[#fafafa]/60">
                            <span className="text-foreground line-clamp-1">25/25</span>
                        </div>
                        <Dot />
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex items-center space-x-1 text-[#ffc600] dark:text-[#8ddeed]">
                                <span className="text-foreground font-medium">
                                    100%
                                </span>
                            </div>
                        </div>
                        <Dot />
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-[#fafafa]/60">
                            <span>103 Units</span>
                        </div>
                        <Dot />
                        <div className="flex items-center gap-2 text-gray-500 dark:text-[#fafafa]/60">
                            <svg
                                className="size-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>Ai agent</title>
                                <g
                                    id="页面-1"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    <g
                                        id="Media"
                                        transform="translate(-960.000000, -96.000000)"
                                        fillRule="nonzero"
                                    >
                                        <g
                                            id="voice_line"
                                            transform="translate(960.000000, 96.000000)"
                                        >
                                            <path
                                                d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                                                id="MingCute"
                                                fillRule="nonzero"
                                            ></path>
                                            <path
                                                d="M12,3 C12.51285,3 12.9355092,3.38604429 12.9932725,3.88337975 L13,4 L13,20 C13,20.5523 12.5523,21 12,21 C11.48715,21 11.0644908,20.613973 11.0067275,20.1166239 L11,20 L11,4 C11,3.44772 11.4477,3 12,3 Z M8,6 C8.55228,6 9,6.44772 9,7 L9,17 C9,17.5523 8.55228,18 8,18 C7.44772,18 7,17.5523 7,17 L7,7 C7,6.44772 7.44772,6 8,6 Z M16,6 C16.5523,6 17,6.44772 17,7 L17,17 C17,17.5523 16.5523,18 16,18 C15.4477,18 15,17.5523 15,17 L15,7 C15,6.44772 15.4477,6 16,6 Z M4,9 C4.55228,9 5,9.44772 5,10 L5,14 C5,14.5523 4.55228,15 4,15 C3.44772,15 3,14.5523 3,14 L3,10 C3,9.44772 3.44772,9 4,9 Z M20,9 C20.51285,9 20.9355092,9.38604429 20.9932725,9.88337975 L21,10 L21,14 C21,14.5523 20.5523,15 20,15 C19.48715,15 19.0644908,14.613973 19.0067275,14.1166239 L19,14 L19,10 C19,9.44772 19.4477,9 20,9 Z"
                                                id="形状"
                                                fill="currentColor"
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <span>AI assisted</span>
                        </div>
                    </div>
                    <div className="">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci,
                        cumque eligendi ipsa illum nesciunt animi, in placeat assumenda
                        dolores inventore dolore nisi exercitationem quibusdam hic
                        consectetur repellat nihil. Ducimus, id.
                    </div>
                    <p className="text-sm uppercase font-bold text-[#8A2BE2]/70">
                        Rewards
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-16 h-16">
                            <img
                                src={`/stickers/bookie.png`}
                                alt={`Bitroot logo`}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                        <div className="w-16 h-16">
                            <img
                                src={`/stickers/earlyBurner.png`}
                                alt={`Bitroot logo`}
                                className="w-full h-full object-cover rounded grayscale"
                            />
                        </div>
                        <div className="w-16 h-16">
                            <img
                                src={`/stickers/fighter.png`}
                                alt={`Bitroot logo`}
                                className="w-full h-full object-cover rounded grayscale"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Sections.map((Section, idx) => {
                    // Find first unmarked unit
                    return (
                        <Card
                            key={Section.id}
                            onClick={() => router.push(`/learn/${lang}/${sanitizeUrl(Section.title)}`)}
                            className={`relative overflow-hidden flex flex-col justify-between mb-6 p-6 bg-gradient-to-br rounded-lg ${Section.status === "completed"
                                ? "from-gray-800 to-gray-900"
                                : "from-gray-900 to-gray-800"
                                } border-none relative hover:scale-105 duration-500 ease-in ${Section.locked
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-blue-400 font-bold">
                                        {Section.level} • SECTION {Section.id}{" "}
                                        {Section.status === "locked" && "• LOCKED"}
                                    </span>
                                    <div
                                        className="text-2xl font-bold text-white mt-1"
                                    >
                                        {Section.title}
                                    </div>
                                </div>
                            </div>
                            {Section.status !== "locked" && (
                                <>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm uppercase text-white font-bold font-mono">
                                            {Section.progress} / {Section.totalUnit} Units
                                        </span>
                                    </div>
                                    {Section.status === "completed" ? (
                                        <svg
                                            className="size-52 absolute -right-14 top-0 rotate-12 text-[#FFD700]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10.5766 8.70419C11.2099 7.56806 11.5266 7 12 7C12.4734 7 12.7901 7.56806 13.4234 8.70419L13.5873 8.99812C13.7672 9.32097 13.8572 9.48239 13.9975 9.5889C14.1378 9.69541 14.3126 9.73495 14.6621 9.81402L14.9802 9.88601C16.2101 10.1643 16.825 10.3034 16.9713 10.7739C17.1176 11.2443 16.6984 11.7345 15.86 12.715L15.643 12.9686C15.4048 13.2472 15.2857 13.3865 15.2321 13.5589C15.1785 13.7312 15.1965 13.9171 15.2325 14.2888L15.2653 14.6272C15.3921 15.9353 15.4554 16.5894 15.0724 16.8801C14.6894 17.1709 14.1137 16.9058 12.9622 16.3756L12.6643 16.2384C12.337 16.0878 12.1734 16.0124 12 16.0124C11.8266 16.0124 11.663 16.0878 11.3357 16.2384L11.0378 16.3756C9.88634 16.9058 9.31059 17.1709 8.92757 16.8801C8.54456 16.5894 8.60794 15.9353 8.7347 14.6272L8.76749 14.2888C8.80351 13.9171 8.82152 13.7312 8.76793 13.5589C8.71434 13.3865 8.59521 13.2472 8.35696 12.9686L8.14005 12.715C7.30162 11.7345 6.88241 11.2443 7.02871 10.7739C7.17501 10.3034 7.78993 10.1643 9.01977 9.88601L9.33794 9.81402C9.68743 9.73495 9.86217 9.69541 10.0025 9.5889C10.1428 9.48239 10.2328 9.32097 10.4127 8.99812L10.5766 8.70419Z" fill="currentColor" />
                                            <path opacity="0.8" fillRule="evenodd" clipRule="evenodd" d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z" fill="currentColor" />
                                            <g opacity="0.5">
                                                <path d="M18.5304 5.46967C18.8233 5.76256 18.8233 6.23744 18.5304 6.53033L18.1872 6.87359C17.8943 7.16648 17.4194 7.16648 17.1265 6.87359C16.8336 6.5807 16.8336 6.10583 17.1265 5.81293L17.4698 5.46967C17.7627 5.17678 18.2376 5.17678 18.5304 5.46967Z" fill="currentColor" />
                                                <path d="M5.46967 5.46979C5.76256 5.17689 6.23744 5.17689 6.53033 5.46979L6.87359 5.81305C7.16648 6.10594 7.16648 6.58081 6.87359 6.87371C6.5807 7.1666 6.10583 7.1666 5.81293 6.87371L5.46967 6.53045C5.17678 6.23755 5.17678 5.76268 5.46967 5.46979Z" fill="currentColor" />
                                                <path d="M6.87348 17.1266C7.16637 17.4195 7.16637 17.8944 6.87348 18.1873L6.53043 18.5303C6.23754 18.8232 5.76266 18.8232 5.46977 18.5303C5.17688 18.2375 5.17688 17.7626 5.46977 17.4697L5.81282 17.1266C6.10571 16.8337 6.58058 16.8337 6.87348 17.1266Z" fill="currentColor" />
                                                <path d="M17.1265 17.1269C17.4194 16.834 17.8943 16.834 18.1872 17.1269L18.5302 17.4699C18.8231 17.7628 18.8231 18.2377 18.5302 18.5306C18.2373 18.8235 17.7624 18.8235 17.4695 18.5306L17.1265 18.1875C16.8336 17.8946 16.8336 17.4198 17.1265 17.1269Z" fill="currentColor" />
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="size-52 absolute -right-14 top-0 rotate-12 text-[#8A2BE2]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M18.4834 16.7674C17.8471 16.9195 17.1829 17 16.5 17C11.8056 17 8 13.1944 8 8.50001C8 8.01653 8.04036 7.54249 8.11791 7.08105C8.08172 7.11586 8.04432 7.14792 8.00494 7.17781C7.72433 7.39083 7.37485 7.46991 6.67589 7.62806L6.03954 7.77204C3.57986 8.32856 2.35002 8.60682 2.05742 9.54774C1.76482 10.4887 2.60325 11.4691 4.2801 13.4299L4.71392 13.9372C5.19042 14.4944 5.42868 14.773 5.53586 15.1177C5.64305 15.4624 5.60703 15.8341 5.53498 16.5776L5.4694 17.2544C5.21588 19.8706 5.08912 21.1787 5.85515 21.7602C6.62117 22.3417 7.77267 21.8116 10.0757 20.7512L10.6715 20.4768C11.3259 20.1755 11.6531 20.0249 12 20.0249C12.3469 20.0249 12.6741 20.1755 13.3285 20.4768L13.9243 20.7512C16.2273 21.8116 17.3788 22.3417 18.1449 21.7602C18.9109 21.1787 18.7841 19.8706 18.5306 17.2544L18.4834 16.7674Z" fill="currentColor" />
                                            <path opacity="0.5" d="M9.15302 5.40838L8.82532 5.99623C8.46538 6.64194 8.28541 6.96479 8.0048 7.17781C8.04418 7.14791 8.08158 7.11586 8.11777 7.08105C8.04022 7.54249 7.99986 8.01653 7.99986 8.50001C7.99986 13.1944 11.8054 17 16.4999 17C17.1828 17 17.8469 16.9195 18.4833 16.7674L18.4649 16.5776C18.3928 15.8341 18.3568 15.4624 18.464 15.1177C18.5712 14.773 18.8094 14.4944 19.2859 13.9372L19.7198 13.4299C21.3966 11.4691 22.235 10.4886 21.9424 9.54773C21.6498 8.60682 20.42 8.32856 17.9603 7.77203L17.324 7.62805C16.625 7.4699 16.2755 7.39083 15.9949 7.17781C15.7143 6.96479 15.5343 6.64194 15.1744 5.99624L14.8467 5.40837C13.58 3.13612 12.9467 2 11.9999 2C11.053 2 10.4197 3.13613 9.15302 5.40838Z" fill="currentColor" />
                                        </svg>)}
                                </>
                            )}
                            {Section.status === "locked" && (
                                <>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm uppercase text-gray-400 font-bold font-mono">
                                            {Section.progress} / {Section.totalUnit} Units
                                        </span>
                                    </div>
                                    <svg
                                        className="size-52 absolute -right-14 top-0 rotate-12 text-[#9d9d9d]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M7 10.0737C7.47142 10.0449 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10.0449 17 10.0737M7 10.0737C6.41168 10.1096 5.99429 10.1904 5.63803 10.3719C5.07354 10.6595 4.6146 11.1185 4.32698 11.683C4 12.3247 4 13.1648 4 14.8449V16.2449C4 17.9251 4 18.7652 4.32698 19.4069C4.6146 19.9714 5.07354 20.4303 5.63803 20.7179C6.27976 21.0449 7.11984 21.0449 8.8 21.0449H15.2C16.8802 21.0449 17.7202 21.0449 18.362 20.7179C18.9265 20.4303 19.3854 19.9714 19.673 19.4069C20 18.7652 20 17.9251 20 16.2449V14.8449C20 13.1648 20 12.3247 19.673 11.683C19.3854 11.1185 18.9265 10.6595 18.362 10.3719C18.0057 10.1904 17.5883 10.1096 17 10.0737M7 10.0737V8.04492C7 5.2835 9.23858 3.04492 12 3.04492C14.7614 3.04492 17 5.2835 17 8.04492V10.0737M10 18L10.2857 17M14 18L13.7143 17M10.2857 17L10.8308 15.0922C11.1799 13.8702 11.3545 13.2592 11.6244 13.1058C11.8573 12.9733 12.1427 12.9733 12.3756 13.1058C12.6455 13.2592 12.8201 13.8702 13.1692 15.0922L13.7143 17M10.2857 17H13.7143" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </Card>
                    );
                })}
                {Sections.length === 0 && (
                    <div className="text-center text-gray-400">
                        No Sections available for this language yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnLanguageClient;
