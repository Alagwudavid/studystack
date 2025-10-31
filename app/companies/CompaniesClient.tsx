import React from 'react'
import Header from '@/components/BreadCrumb'
import CompanySearch from '@/components/CompanySearch'
import JobCard from '@/components/JobCard'
import FilterSidebar from '@/components/CompanyFilter'
export function CompaniesClient() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <CompanySearch />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid- gap-6">
              <JobCard
                logo="I"
                logoBackground="bg-blue-900"
                companyName="ICEYE Company"
                jobCount={8}
                description="ICEYE is building the world's largest synthetic aperture radar constellation."
                image="https://uploadthingy.s3.us-west-1.amazonaws.com/hJ1VXGMo4jw7yPWYKXFqyz/original-29d260fa5e291782de817cfb6a48333a.jpg"
              />
              <JobCard
                logo="S"
                logoBackground="bg-purple-700"
                companyName="Supercell Company"
                jobCount={8}
                description="Supercell is an exciting and dynamic gaming studio that creates captivating experiences."
                image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              />
              <JobCard
                logo="R"
                logoBackground="bg-green-600"
                companyName="Reaktor Company"
                jobCount={16}
                description="Reaktor is a modern technology-focused creative management platform."
                image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              />
              <JobCard
                logo="G"
                logoBackground="bg-yellow-600"
                companyName="Gofore Company"
                jobCount={11}
                description="Gofore aims to help businesses transform digitally with innovative solutions."
                image="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              />
              <JobCard
                logo="F"
                logoBackground="bg-black"
                companyName="Frantic Company"
                jobCount={3}
                description="Frantic is a company engaged in IT as a digital solutions provider."
                image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              />
              <JobCard
                logo="Y"
                logoBackground="bg-blue-500"
                companyName="Yousician Company"
                jobCount={9}
                description="Yousician is a company engaged in IT as a music learning platform."
                image="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              />
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <FilterSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompaniesClient
