import React from 'react'
import { Overview } from '@/components/Overview'
import { TodaySchedule } from '@/components/TodaySchedule'
import { CoursesList } from '@/components/CoursesList'
import { ExploreMore } from '@/components/ExploreMore'
export default function ClassroomClient() {
  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Overview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TodaySchedule />
          <div className="space-y-8">
            <CoursesList />
            <ExploreMore />
          </div>
        </div>
      </div>
    </div>
  )
}
