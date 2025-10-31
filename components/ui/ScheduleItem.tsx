import React from 'react'
interface ScheduleItemProps {
  courseCode: string
  courseName: string
  bgColor: string
}
export function ScheduleItem({
  courseCode,
  courseName,
  bgColor,
}: ScheduleItemProps) {
  return (
    <div className={`${bgColor} rounded-md p-2 h-full flex items-center gap-2`}>
      <p className="text-sm font-medium">{courseCode}</p>
      <p className="text-sm">{courseName}</p>
    </div>
  )
}
