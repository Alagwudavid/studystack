"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Monitor } from "lucide-react"

interface ThemePreviewToastProps {
  theme: string | null
}

export function ThemePreviewToast({ theme }: ThemePreviewToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (theme) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [theme])

  if (!isVisible || !theme) return null

  const getThemeInfo = () => {
    switch (theme) {
      case "light":
        return { icon: Sun, label: "Light Mode Preview", color: "text-yellow-600" }
      case "dark":
        return { icon: Moon, label: "Dark Mode Preview", color: "text-purple-600" }
      case "system":
        return { icon: Monitor, label: "System Mode Preview", color: "text-blue-600" }
      default:
        return { icon: Sun, label: "Preview", color: "text-gray-600" }
    }
  }

  const { icon: Icon, label, color } = getThemeInfo()

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-300">
      <Card className="px-4 py-2 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-sm border shadow-lg">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-gray-800 dark:text-[#fafafa]">{label}</span>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60"></div>
        </div>
      </Card>
    </div>
  )
}
