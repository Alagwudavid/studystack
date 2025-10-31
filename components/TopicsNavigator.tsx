"use client";

import React, { useEffect, useState, useRef } from 'react'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
interface Topic {
  id: string
  name: string
  Members: string
  replies: number
  image?: string
  isLive?: boolean
  active?: boolean
}
interface TopicsNavigatorProps {
  topics: Topic[]
  activeTopic?: string
  onTopicChange?: (topicId: string) => void
  className?: string
}
const TopicsNavigator = ({
  topics,
  activeTopic = 'mesa',
  onTopicChange,
  className,
}: TopicsNavigatorProps) => {
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // Handle scroll event for topics container
  useEffect(() => {
    const container = scrollContainerRef.current
    const handleScroll = () => {
      if (container) {
        // Check if scrolled to the left end
        setShowLeftButton(container.scrollLeft > 10)
        // Check if scrolled to the right end
        const isAtRightEnd =
          Math.abs(
            container.scrollWidth -
              container.clientWidth -
              container.scrollLeft,
          ) < 10
        setShowRightButton(!isAtRightEnd)
      }
    }
    // Initial check
    if (container) {
      handleScroll()
      container.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [topics])
  // Handle smooth scrolling
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isTransitioning) return
    setIsTransitioning(true)
    const container = scrollContainerRef.current
    const scrollAmount = 300 // Adjust scroll distance as needed
    const targetScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
    // Reset transitioning state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }
  // Handle topic selection
  const handleTopicClick = (topicId: string) => {
    if (onTopicChange) {
      onTopicChange(topicId)
    }
  }
  return (
    <div
      className={cn(
        'relative flex-1 mb-6',
        className,
      )}
    >
      <div className="flex justify-between items-center px-4 pb-2">
        <h2 className="text-lg font-bold">Trending spaces</h2>
        <div className="flex space-x-2">
          <button
            className={cn(
              'rounded-full p-1 hover:bg-gray-800',
              !showLeftButton && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => handleScroll('left')}
            disabled={!showLeftButton || isTransitioning}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className={cn(
              'rounded-full p-1 hover:bg-gray-800',
              !showRightButton && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => handleScroll('right')}
            disabled={!showRightButton || isTransitioning}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pt-2 pb-4 px-4 flex-1 max-w-[80vw] md:max-w-[calc(60vw-80px)]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className={cn(
              'flex-shrink-0 w-80 border rounded-lg transition-all duration-200 cursor-pointer',
              activeTopic === topic.id
                ? 'ring-2 ring-green-500'
                : 'hover:bg-gray-800',
            )}
          >
            <div className="bg-base rounded-lg h-full overflow-hidden">
              <div className="flex items-center">
                {topic.image && (
                  <div className="w-24 h-24 overflow-hidden">
                    <img
                      src={topic.image}
                      alt={topic.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold line-clamp-1">{topic.name}</h3>
                    {topic.isLive && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-base-foreground text-sm">
                    Members: {topic.Members}
                  </p>
                  <p className="text-base-foreground text-sm">
                    replies: {topic.replies}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TopicsNavigator
