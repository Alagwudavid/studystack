"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

interface ThemeTransitionOverlayProps {
  isTransitioning: boolean
  targetTheme: string | null
}

export function ThemeTransitionOverlay({ isTransitioning, targetTheme }: ThemeTransitionOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (isTransitioning) {
      setShowOverlay(true)
      const timer = setTimeout(() => {
        setShowOverlay(false)
      }, 500) // Match CSS animation duration
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  if (!showOverlay) return null

  const getThemeIcon = () => {
    switch (targetTheme) {
      case "light":
        return <Sun className="w-12 h-12 text-yellow-500" />
      case "dark":
        return <Moon className="w-12 h-12 text-purple-400" />
      case "system":
        return <Monitor className="w-12 h-12 text-blue-400" />
      default:
        return <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
    }
  }

  return (
    <>
      {/* Main transition overlay */}
      <div className="theme-transition-overlay" />

      {/* Loading indicator */}
      <div className="theme-loading">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="theme-loading-spinner" />
            <div className="absolute inset-0 flex items-center justify-center">{getThemeIcon()}</div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Switching to {targetTheme} mode...
          </div>
        </div>
      </div>
    </>
  )
}
