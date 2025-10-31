import React from 'react'
import { ScheduleItem } from './ui/ScheduleItem'
export function TodaySchedule() {
  return (
    <div className="bg-muted rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-medium text-muted-foreground mb-4">
        Today's Schedule
      </h2>
      <div className="relative">
        {/* Timeline with hours */}
        <div className="flex">
          <div className="w-16 flex-shrink-0">
            {[
              '08:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '17:00',
            ].map((time) => (
              <div key={time} className="h-16 text-sm text-muted-foreground">
                {time}
              </div>
            ))}
          </div>
          <div className="flex-grow relative">
            {/* Current time indicator */}
            <div className="absolute top-[96px] left-0 right-0 h-0.5 bg-red-500 z-10"></div>
            {/* Schedule items */}
            <div className="absolute top-0 left-0 right-0 h-[112px] pl-2">
              <ScheduleItem
                courseCode="DP203"
                courseName="Frameworks in Design"
                bgColor="bg-blue-100/50"
              />
            </div>
            <div className="absolute top-[112px] left-0 right-0 h-[40px] pl-2">
              <ScheduleItem
                courseCode="DS202"
                courseName="Ergonomics in Design"
                bgColor="bg-blue-200/30"
              />
            </div>
            <div className="absolute top-[208px] left-0 right-0 h-[56px] pl-2">
              <ScheduleItem
                courseCode="TR231"
                courseName="Tinkering Lab"
                bgColor="bg-blue-100/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
