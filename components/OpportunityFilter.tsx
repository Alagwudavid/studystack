import React from 'react'
import { ChevronDownIcon } from 'lucide-react'
const CompanyFilter = () => {
  return (
    <div className="bg-muted rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">Filter Search</h3>
        <button className="text-blue-600 text-sm font-medium">Clear All</button>
      </div>
      <div className="space-y-5">
        <FilterSection title="Location" />
        <FilterSection title="Sallary Estimate" />
        <FilterSection title="Work Experience" />
        <FilterSection title="Job Type" />
      </div>
    </div>
  )
}
interface FilterSectionProps {
  title: string
}
const FilterSection = ({ title }: FilterSectionProps) => {
  return (
    <div className="pb-5">
      <button className="flex justify-between items-center w-full">
        <span className="font-medium">{title}</span>
        <ChevronDownIcon size={20} />
      </button>
    </div>
  )
}
export default CompanyFilter
