"use client";
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import Link from "next/link";
const SkeletonLoader = styled.div`
    --base-color: #6b7280; /* gray-500 */
    --highlight-color: #ffffff; /* white */
    --spread: 25px;
    
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-repeat: no-repeat;
    background-image: 
        linear-gradient(90deg, 
            transparent calc(50% - var(--spread)), 
            var(--highlight-color), 
            transparent calc(50% + var(--spread))
        ),
        linear-gradient(var(--base-color), var(--base-color));
    background-size: 300% 100%, auto;
    animation: slide 4s linear infinite;
`;

export default function Loader({ className }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center ${className || ""}`}>
            <SkeletonLoader className="text-3xl/10 font-mono font-bold select-none animate-pulse">
                <svg className="!size-8" viewBox="0 0 0.61 0.55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                <rect fill="#D10B2C" width="0.61" height="0.55" rx="0.1" ry="0.1"/>
                <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.37,0.12 0.37,0.21 0.27,0.21 0.27,0.43 0.07,0.43 0.07,0.34 0.18,0.34 0.18,0.12 "/>
                <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.47,0.12 0.47,0.2 0.53,0.2 0.53,0.28 0.47,0.28 0.47,0.36 0.54,0.36 0.54,0.44 0.39,0.44 0.39,0.12 "/>
                </g>
                </svg>
            </SkeletonLoader>
        </div>
    );
}