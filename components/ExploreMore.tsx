import React from 'react'
export function ExploreMore() {
  return (
    <div>
      <h2 className="text-xl font-medium text-muted-foreground mb-4">
        Explore More Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course thumbnails would go here, but they're cut off in the image */}
        <div className="bg-card rounded-lg h-32"></div>
        <div className="bg-card rounded-lg h-32"></div>
        <div className="bg-card rounded-lg h-32"></div>
        <div className="bg-card rounded-lg h-32"></div>
      </div>
    </div>
  )
}
