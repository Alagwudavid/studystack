"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Banner = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex shrink-0 overflow-hidden rounded-lg",
            className
        )}
        {...props}
    />
))
Banner.displayName = "Banner"

const BannerImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
    <img
        ref={ref}
        className={cn("h-full w-full object-cover", className)}
        {...props}
    />
))
BannerImage.displayName = "BannerImage"

const BannerFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-r from-muted/50 to-muted",
            className
        )}
        {...props}
    />
))
BannerFallback.displayName = "BannerFallback"

export { Banner, BannerImage, BannerFallback }