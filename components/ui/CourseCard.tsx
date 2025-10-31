import React from 'react'
interface CourseCardProps {
  image: string
  courseCode: string
  courseName: string
  professor: string
  credits: number
}
export function CourseCard({
  image,
  courseCode,
  courseName,
  professor,
  credits,
}: CourseCardProps) {
  return (
    <div className="bg-muted rounded-lg overflow-hidden shadow-sm">
      <div className="h-40 overflow-hidden">
        <img
          src={image}
          alt={courseName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-muted-foreground text-sm">{courseCode}</p>
          <p className="text-muted-foreground text-sm">{credits} credits</p>
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-1">{courseName}</h3>
        <p className="text-muted-foreground text-sm">by {professor}</p>
      </div>
    </div>
  )
}
