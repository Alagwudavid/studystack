import React from 'react'
import { CourseCard } from './ui/CourseCard'
import { ChevronRightIcon } from 'lucide-react'
export function CoursesList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-muted-foreground">Your Courses</h2>
        <a href="#" className="text-blue-600 flex items-center text-sm">
          See all <ChevronRightIcon className="h-4 w-4 ml-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CourseCard
          image="https://uploadthingy.s3.us-west-1.amazonaws.com/bgDSWax2PHki2NTCyyWjDF/e807c79d103d87b9d021cc009c23f8c0.jpg"
          courseCode="DP203"
          courseName="Frameworks in Design"
          professor="Prof. Sasha Grand"
          credits={3}
        />
        <CourseCard
          image="https://images.unsplash.com/photo-1535813547-99c456a41d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          courseCode="DS202"
          courseName="Ergonomics in Design"
          professor="Prof. Garmin Van Doe"
          credits={3}
        />
        <CourseCard
          image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          courseCode="TR231"
          courseName="Tinkering Lab"
          professor="Prof. Clark Kent"
          credits={4}
        />
        <CourseCard
          image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          courseCode="DP203"
          courseName="Design Systems"
          professor="Prof. Rina Roy"
          credits={3}
        />
      </div>
    </div>
  )
}
