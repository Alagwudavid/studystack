"use client";

import Link from "next/link";
const BrandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 !size-6" {...props}>
        <path d="M18,22H7a4,4,0,0,1-4-4V6A4,4,0,0,1,7,2H20a1,1,0,0,1,0,2H7A2,2,0,0,0,5,6V18a2,2,0,0,0,2,2H18a1,1,0,0,0,1-1V7a1,1,0,0,1,2,0V19A3,3,0,0,1,18,22Z"/>
        <path d="M20,8H7A1,1,0,0,1,7,6H20a1,1,0,0,1,0,2Z"/>
        <path d="M15,13H9a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Z"/>
        <path d="M14,17H10a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"/>
    </svg>
);
export function BrandComp({ className }: { className?: string }) {
    return (
        <div className={`flex items-center select-none gap-2 ${className || ""}`}>
            <svg className="!size-8" viewBox="0 0 0.61 0.55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect fill="#D10B2C" width="0.61" height="0.55" rx="0.1" ry="0.1"/>
              <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.37,0.12 0.37,0.21 0.27,0.21 0.27,0.43 0.07,0.43 0.07,0.34 0.18,0.34 0.18,0.12 "/>
              <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.47,0.12 0.47,0.2 0.53,0.2 0.53,0.28 0.47,0.28 0.47,0.36 0.54,0.36 0.54,0.44 0.39,0.44 0.39,0.12 "/>
            </g>
            </svg>
            <span className="text-xl font-mono font-bold text-foreground select-none hidden sm:flex">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            {/* <span className="text-xl font-mono font-bold text-foreground select-none hidden md:flex">studentstack</span> */}
        </div>
    );
}
