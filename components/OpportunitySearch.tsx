import React from 'react'
import { SearchIcon, MapPinIcon, TagIcon } from 'lucide-react'
const CompanySearch = () => {
  return (
    <div className="bg-background">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-card-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search company..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="relative flex-1">
          <MapPinIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-card-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Location..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="relative flex-1">
          <TagIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-card-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Category..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
export default CompanySearch
