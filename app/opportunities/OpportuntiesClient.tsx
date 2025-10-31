import React from 'react'
import Header from '@/components/BreadCrumb'
import OpportunitySearch from '@/components/OpportunitySearch'
import OpportunityCard from '@/components/OpportunityCard'
import FilterSidebar from '@/components/OpportunityFilter'
import type { User } from "@/types/user";

// Mock data for opportunities
const mockOpportunities = [
  {
    logo: "EF",
    logoBackground: "bg-blue-600",
    title: "Fully Funded 2026 France Government Eiffel Scholarship Program",
    type: "scholarship" as const,
    funding: "Fully Funded",
    level: "Doctorate, Masters",
    location: "France",
    duration: "6 months",
    deadline: "6th, Jan 2026",
    appliedCount: 150,
    isApplied: false,
    isFeatured: true,
    description: "The Eiffel Excellence Scholarship Program is designed to enable French higher education institutions to attract top foreign students to enroll in their master's and PhD programs.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    authorName: "French Government",
    authorImage: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  },
  {
    logo: "GT",
    logoBackground: "bg-green-600",
    title: "Software Development Internship Program at Google",
    type: "internship" as const,
    location: "Mountain View, CA",
    duration: "3 months",
    deadline: "15th, Dec 2025",
    appliedCount: 300,
    isApplied: true,
    isFeatured: false,
    description: "Join Google's summer internship program for computer science students. Work on real projects with mentorship from senior engineers.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    authorName: "Google Inc.",
    authorImage: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  },
  {
    logo: "MS",
    logoBackground: "bg-purple-600",
    title: "Microsoft Azure Cloud Computing Scholarship",
    type: "scholarship" as const,
    funding: "Partially Funded",
    level: "Bachelor, Masters",
    location: "Online/Global",
    duration: "12 months",
    deadline: "20th, Nov 2025",
    appliedCount: 89,
    isApplied: false,
    isFeatured: true,
    description: "Learn cloud computing fundamentals and advanced Azure services with this comprehensive scholarship program including certification preparation.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    authorName: "Microsoft Corporation",
    authorImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  },
  {
    logo: "UN",
    logoBackground: "bg-blue-500",
    title: "United Nations Development Programme Internship",
    type: "internship" as const,
    location: "New York, NY",
    duration: "6 months",
    deadline: "10th, Jan 2026",
    appliedCount: 45,
    isApplied: false,
    isFeatured: false,
    description: "Contribute to global development initiatives while gaining experience in international relations and sustainable development programs.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    authorName: "United Nations",
    authorImage: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  },
  {
    logo: "CH",
    logoBackground: "bg-red-600",
    title: "Swiss Government Excellence Scholarship Program",
    type: "scholarship" as const,
    funding: "Fully Funded",
    level: "Masters, PhD",
    location: "Switzerland",
    duration: "24 months",
    deadline: "1st, Feb 2026",
    appliedCount: 120,
    isApplied: false,
    isFeatured: true,
    description: "Excellence scholarships for foreign scholars and artists for research or study at Swiss higher education institutions.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    authorName: "Swiss Government",
    authorImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  },
  {
    logo: "AM",
    logoBackground: "bg-orange-600",
    title: "Amazon Web Services Cloud Architecture Internship",
    type: "internship" as const,
    location: "Seattle, WA",
    duration: "4 months",
    deadline: "25th, Mar 2026",
    appliedCount: 200,
    isApplied: false,
    isFeatured: false,
    description: "Design and implement cloud solutions while learning from AWS architects and engineers in this hands-on internship program.",
    image: "https://uploadthingy.s3.us-west-1.amazonaws.com/hJ1VXGMo4jw7yPWYKXFqyz/original-29d260fa5e291782de817cfb6a48333a.jpg",
    authorName: "Amazon Web Services",
    authorImage: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    authorType: "company" as const
  }
];

interface OpportuntiesClientProps {
  serverUser?: User | null;
}

export function OpportuntiesClient({ serverUser }: OpportuntiesClientProps) {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <OpportunitySearch />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockOpportunities.map((opportunity, index) => (
                <OpportunityCard
                  key={index}
                  logo={opportunity.logo}
                  logoBackground={opportunity.logoBackground}
                  title={opportunity.title}
                  type={opportunity.type}
                  funding={opportunity.funding}
                  level={opportunity.level}
                  location={opportunity.location}
                  duration={opportunity.duration}
                  deadline={opportunity.deadline}
                  appliedCount={opportunity.appliedCount}
                  isApplied={opportunity.isApplied}
                  isFeatured={opportunity.isFeatured}
                  description={opportunity.description}
                  image={opportunity.image}
                  authorName={opportunity.authorName}
                  authorImage={opportunity.authorImage}
                  authorType={opportunity.authorType}
                />
              ))}
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

export default OpportuntiesClient
