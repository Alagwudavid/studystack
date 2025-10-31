import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
interface CourseCardProps {
  image: string
  title: string
  instructor: string
  duration: string
  progress: number
  language: string
}
export function CourseCard({
  image,
  title,
  instructor,
  duration,
  progress,
  language,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-xs">U</span>
          </div>
          <span className="text-xs text-white font-bold bg-black/50 px-1 rounded">
            ORIGINAL
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white">
          {language}
        </div>
        <button className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white">
          <MoreVerticalIcon size={16} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-xs mb-2">{instructor}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">{duration}</span>
          <span className="text-gray-600 text-xs">{progress}%</span>
        </div>
        <div className="mt-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
