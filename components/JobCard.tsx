import { StarIcon } from 'lucide-react'
import React from 'react'
interface JobCardProps {
  logo: string
  logoBackground: string
  companyName: string
  jobCount: number
  description: string
  image: string
}
const JobCard = ({
  logo,
  logoBackground,
  companyName,
  jobCount,
  description,
  image,
}: JobCardProps) => {
  return (
    <div className="bg-muted rounded-lg overflow-hidden shadow-sm border flex flex-row">
      <div className="relative p-4">
        <div className="flex">
          <div
            className={`${logoBackground} w-10 h-10 rounded flex items-center justify-center overflow-hidden`}
          >
            <img
              src={image}
              alt={companyName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-xs text-card-foreground p-2 bg-card rounded">
            {jobCount} Job Vacancies
          </span>
          <span className="text-xs text-foreground p-2 bg-purple-500 rounded flex items-center gap-1">
            <StarIcon className='size-4' />
            Featured
          </span>
        </div>
        <h3 className="font-bold mb-2">{companyName}</h3>
        <p className="text-sm text-card-foreground mb-2">{description} <a href="#" className="text-sm text-blue-600 font-medium">Read More</a></p>
        <button className="w-full mt-4 border border-primary rounded-md py-2 text-sm hover:bg-card">
          Browse Jobs
        </button>
      </div>
    </div>
  )
}
export default JobCard
