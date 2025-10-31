'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Users,
    MessageCircle,
    Trophy,
    Globe,
    Zap,
    Heart,
    Star,
    Target,
    Mail,
    AtSign,
    MessageCircleDashed,
    Gamepad,
    UserCheck,
    Gauge
} from "lucide-react";
import { WaitlistModal } from '@/components/waitlist-modal'
import { getWaitlistCount } from '@/lib/waitlist'
import { toast } from 'react-hot-toast'

const featureGroups = {
    general: [
        {
            icon: UserCheck,
            label: "Profile Customization",
            status: "ready to ship"
        },
        {
            icon: MessageCircle,
            label: "Live Chat App",
            status: "started"
        },
        {
            icon: Heart,
            label: "Personalized Path",
            status: "started"
        },
        {
            icon: Target,
            label: "Goal Tracking",
            status: "not-started"
        },
        {
            icon: Trophy,
            label: "Achievements",
            status: "not-started"
        }
    ],
    creators: [
        {
            icon: Globe,
            label: "Global Community/Channel",
            status: "started"
        },
        {
            icon: Star,
            label: "Expert Services",
            status: "not-started"
        },
        {
            icon: Gauge,
            label: "Dashboard & Analytics",
            status: "not-started"
        },
    ],
    learners: [
        {
            icon: Gamepad,
            label: "Gamified learning paths",
            status: "started"
        },
        {
            icon: Users,
            label: "Study Groups",
            status: "not-started"
        },
        {
            icon: Zap,
            label: "AI-Powered Learning/Assistant",
            status: "not-started"
        }
    ]
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "launched":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        case "ready to ship":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        case "started":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "not-started":
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
};

export default function ComingSoonPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [waitlistCount, setWaitlistCount] = useState(0) // Default count
    const [isLoading, setIsLoading] = useState(false)

    // Fetch initial waitlist count
    useEffect(() => {
        fetchWaitlistCount()
    }, [])

    const fetchWaitlistCount = async () => {
        try {
            const count = await getWaitlistCount()
            setWaitlistCount(count || 0) // Fallback to 0 if no count
        } catch (error) {
            console.error('Error fetching waitlist count:', error)
            // Keep default count on error
        }
    }

    const handleJoinWaitlist = () => {
        setIsModalOpen(true)
    }

    const handleWaitlistSuccess = () => {
        // Refresh the count after successful signup
        fetchWaitlistCount()
        toast.success('Welcome to the waitlist!')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Emoji Icon */}
                <img src="/gif/hot.gif" alt="Fire" className="size-20 mb-4 mx-auto" />

                {/* Header */}
                <div className="space-y-2 font-mono">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        WE'RE STILL
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#C51E3A]">
                        Cooking Our Website.
                    </h1>
                    <div className="space-y-2">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            We will be launching Very Soon.
                        </p>
                    </div>
                </div>

                {/* Notify Me Button */}
                <div className="flex flex-col justify-center space-y-3">
                    <Button
                        size="lg"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full text-foreground font-mono font-medium transition-colors duration-200 shadow-lg hover:shadow-xl w-fit mx-auto"
                        onClick={handleJoinWaitlist}
                        disabled={isLoading}
                    >
                        <svg
                            className="size-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        Join the waitlist.
                    </Button>
                    <span className="text-muted-foreground">
                        <span className="text-primary text-lg font-bold">
                            {waitlistCount.toLocaleString()}
                        </span> are waiting with you!
                    </span>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-6 pb-8">
                    <a
                        href="#mailto:support@bitroot.com"
                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    >
                        <Mail className="size-5 text-gray-600 dark:text-gray-400" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    >
                        <AtSign className="size-5 text-gray-600 dark:text-gray-400" />
                    </a>
                    <a
                        href="/contact-us"
                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    >
                        <MessageCircleDashed className="size-5 text-gray-600 dark:text-gray-400" />
                    </a>
                </div>

                {/* About the Project */}
                <div className="max-w-3xl mx-auto my-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-4">
                        About the Project
                    </h2>
                    <div className="space-y-2 mb-8">
                        <p className="text-muted-foreground text-sm text-justify">This is a project aimed at bringing Africa's diverse cultures and stories to a global audience through an African owned media space.</p>
                        <p className="text-muted-foreground text-sm text-justify">With the rise of social media spaces owned by foreign entities, it is crucial to create platforms that amplify African voices and narratives.</p>
                        <p className="text-muted-foreground text-sm text-justify">These foreign entities try to push their own narratives into our media space and marginalize authentic African stories for their own massive gain. At the same time limiting the visibility of these stories in the global media landscape.</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-4">
                        Our Motivation
                    </h2>
                    <div className="space-y-2 mb-8">
                        <p className="text-muted-foreground text-sm text-justify">With the aim of fostering a deeper understanding and appreciation of African cultures, we are committed to creating a platform that showcases the richness and diversity of the continent's stories.</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
                        Our Aim
                    </h2>
                    <div className="space-y-2 mb-8">
                        <p className="text-muted-foreground text-sm text-justify">We aim to bring a media space that does not only amplify African voices but also provides a platform for authentic storytelling and learning to amplify educational topics and discussions. Also, we aim at bringing important informations to your doorstep with no distractions and providing a personalized experience without limitations.</p>
                    </div>
                </div>


                {/* Features Status List */}
                <div className="max-w-3xl mx-auto my-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-mono">
                        Development Status
                    </h2>

                    {/* General Features */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 font-mono">
                            General Features
                        </h3>
                        <div className="space-y-2 border rounded-3xl p-3">
                            {featureGroups.general.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div
                                        key={`general-${index}`}
                                        className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white font-mono">
                                                {feature.label}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(feature.status)}`}>
                                            {feature.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Creators/Professional Features */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 font-mono">
                            Creators & Professional Features
                        </h3>
                        <div className="space-y-2 border rounded-3xl p-3">
                            {featureGroups.creators.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div
                                        key={`creators-${index}`}
                                        className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white font-mono">
                                                {feature.label}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(feature.status)}`}>
                                            {feature.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Learners Features */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 font-mono">
                            Learning Features
                        </h3>
                        <div className="space-y-2 border rounded-3xl p-3">
                            {featureGroups.learners.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div
                                        key={`learners-${index}`}
                                        className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white font-mono">
                                                {feature.label}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(feature.status)}`}>
                                            {feature.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Waitlist Modal */}
            <WaitlistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleWaitlistSuccess}
            />
        </div>
    );
}
