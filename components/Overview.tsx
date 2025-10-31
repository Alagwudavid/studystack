import React from 'react'
import { StatCard } from './ui/StatCard'
export function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-medium text-muted-foreground mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Assignments" value="02/05" />
        <StatCard title="Ongoing Courses" value="06" />
        <StatCard title="Courses Completed" value="12" />
        <StatCard title="Credits Completed" value="28/40" />
      </div>
    </div>
  )
}
