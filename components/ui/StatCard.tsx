import React from 'react'
interface StatCardProps {
  title: string
  value: string
}
export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-muted p-6 rounded-lg shadow-sm">
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <p className="text-3xl font-medium text-muted-foreground">{value}</p>
    </div>
  )
}
