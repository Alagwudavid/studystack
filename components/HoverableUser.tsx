"use client"

import React, { useState, useRef, useEffect } from "react"
import { UserHoverCard } from "./UserHoverCard"

interface HoverableUserProps {
    user: {
        id: string | number
        username?: string
        displayName: string
        avatar: string
        bio?: string
        verified?: boolean
        type?: "plus" | "founder" | "expert" | "institution" | "user" | "creator" | "instructor"
        location?: string
        joinDate?: string
        followers?: number
        following?: number
        level?: number
        xp?: number
        streak?: {
            current: number
        }
    }
    children: React.ReactNode
    isFollowing?: boolean
    onFollowClick?: () => void
    delayEnter?: number
    delayLeave?: number
}

export function HoverableUser({
    user,
    children,
    isFollowing = false,
    onFollowClick,
    delayEnter = 300,
    delayLeave = 150,
}: HoverableUserProps) {
    const [showCard, setShowCard] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
            leaveTimeoutRef.current = null
        }

        const rect = e.currentTarget.getBoundingClientRect()
        const cardWidth = 320
        const cardHeight = 280
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let x = rect.left + rect.width / 2 - cardWidth / 2
        let y = rect.bottom + 5

        if (x + cardWidth > viewportWidth - 20) {
            x = viewportWidth - cardWidth - 20
        }
        if (x < 20) {
            x = 20
        }
        if (y + cardHeight > viewportHeight - 20) {
            y = rect.top - cardHeight - 5
        }

        setPosition({ x, y })

        enterTimeoutRef.current = setTimeout(() => {
            setShowCard(true)
        }, delayEnter)
    }

    const handleMouseLeave = () => {
        if (enterTimeoutRef.current) {
            clearTimeout(enterTimeoutRef.current)
            enterTimeoutRef.current = null
        }

        leaveTimeoutRef.current = setTimeout(() => {
            setShowCard(false)
        }, delayLeave)
    }

    useEffect(() => {
        return () => {
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
        }
    }, [])

    return (
        <div className="relative inline-block" ref={containerRef}>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block cursor-pointer hover:bg-muted/10 rounded-sm transition-colors"
            >
                {children}
            </div>

            {showCard && (
                <div
                    className="fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ left: `${position.x}px`, top: `${position.y}px` }}
                    onMouseEnter={() => {
                        if (leaveTimeoutRef.current) {
                            clearTimeout(leaveTimeoutRef.current)
                            leaveTimeoutRef.current = null
                        }
                    }}
                    onMouseLeave={handleMouseLeave}
                >
                    <UserHoverCard
                        user={user}
                        isFollowing={isFollowing}
                        onFollowClick={onFollowClick}
                    />
                </div>
            )}
        </div>
    )
}
