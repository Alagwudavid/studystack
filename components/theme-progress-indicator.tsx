"use client"

import { useEffect, useState } from "react"

interface ThemeProgressIndicatorProps {
  isTransitioning: boolean
  duration?: number
}

export function ThemeProgressIndicator({ isTransitioning, duration = 500 }: ThemeProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isTransitioning) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 100 / (duration / 50) // Update every 50ms
        })
      }, 50)

      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isTransitioning, duration])

  if (!isTransitioning) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
