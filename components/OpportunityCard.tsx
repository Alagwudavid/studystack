import { StarIcon, MapPinIcon, ClockIcon, GraduationCapIcon, DollarSignIcon, X } from 'lucide-react'
import React from 'react'

interface OpportunityCardProps {
  logo: string
  logoBackground: string
  title: string
  type: 'scholarship' | 'internship'
  funding?: string
  level?: string
  location: string
  duration: string
  deadline: string
  appliedCount?: number
  isApplied?: boolean
  isFeatured?: boolean
  description: string
  image: string
  authorName: string
  authorImage: string
  authorType: 'company' | 'user'
}

const OpportunityCard = ({
  logo,
  logoBackground,
  title,
  type,
  funding,
  level,
  location,
  duration,
  deadline,
  appliedCount,
  isApplied = false,
  isFeatured = false,
  description,
  image,
  authorName,
  authorImage,
  authorType,
}: OpportunityCardProps) => {
  return (
    <div className="bg-muted rounded-lg overflow-hidden shadow-sm border">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex justify-between w-full pr-6">
          <div
            className={`${logoBackground} text-foreground w-10 h-10 rounded overflow-hidden flex items-center justify-center font-bold`}
          >
            <img
              src={authorImage}
              alt={authorName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <button className="absolute top-3 right-3 flex justify-between">
          <X className='size-6 text-destructive' />
        </button>
      </div>
      <div className="p-4">
        <div className="flex gap-2 items-center mb-3 flex-wrap">
          <span className="text-xs text-card-foreground capitalize">
            {type}
          </span>
          {appliedCount && (
            <>
              <span className="text-xs text-card-foreground">
                •
              </span>
              <span className="text-xs text-card-foreground">
                {appliedCount} people applied
              </span>
            </>
          )}
          {isFeatured && (
            <>
              <span className="text-xs text-card-foreground">
                •
              </span>
              <span className="text-xs text-foreground flex items-center gap-1">
                <StarIcon className='size-4' />
                Featured
              </span>
            </>
          )}
        </div>

        <h3 className="font-bold mb-2 text-lg leading-tight">{title}</h3>
{/* 
        <div className="flex items-center gap-2 mb-3-lg">
          <img
            src={authorImage}
            alt={authorName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{authorName}</p>
            <p className="text-xs text-muted-foreground capitalize">{authorType}</p>
          </div>
        </div> */}

        <div className="space-y-2 mb-3">
          {funding && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSignIcon className="size-4" />
              <span>{funding}</span>
            </div>
          )}
          {level && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCapIcon className="size-4" />
              <span>{level}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="size-4" />
            <span>{duration}</span>
          </div>
        </div>

        {/* <p className="text-sm text-card-foreground mb-3">{description} <a href="#" className="text-sm text-blue-600 font-medium">Read More</a></p> */}

        <div className="w-full mt-4 flex items-center justify-between">
          <div className="flex items-center bg-destructive text-destructive-foreground rounded-full px-3 py-1">
            <div className="flex items-center gap-1 text-sm text-destructive-foreground font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-4' viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"></path></g></svg>
              Deadline:
            </div>
            <span className="text-sm text-foreground font-medium ml-1">{deadline}</span>
          </div>

          {/* <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isApplied
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            disabled={isApplied}
          >
            {isApplied ? 'Applied' : 'Apply'}
          </button> */}
        </div>
      </div>
    </div>
  )
}
export default OpportunityCard
