"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    CalendarDays,
    ArrowLeft,
    MoreHorizontal,
    Plus,
    Camera,
    Bell,
    EllipsisVertical,
    PencilLine,
    BriefcaseBusiness,
    LayoutDashboard,
    Clock,
    Info,
    BarChart3,
    Users,
    CircleFadingPlus,
    LinkIcon,
    Globe2Icon,
} from "lucide-react";
import { VerifiedBadge } from "@/components/verified-badge";
import { ProfileCompletionModal } from "@/components/ProfileCompletionModal";
import { ProfessionalProfileModal } from "@/components/ProfessionalProfileModal";
import FollowButton from "@/components/FollowButton";
import { shouldShowProfileCompletion } from "@/lib/profile-utils";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types/user";
import { Tooltip } from "@/components/ui/tooltip";

interface ProfessionalApplication {
    application_id: string;
    status: 'pending' | 'approved' | 'rejected';
    professional_category: string;
    applied_at: string;
    approved_at: string | null;
}

interface ProfileHeaderProps {
    user: User;
    username: string;
}

export default function ProfileHeader({ user, username }: ProfileHeaderProps) {
    const [showProfileCompletion, setShowProfileCompletion] = useState(false);
    const [showProfessionalModal, setShowProfessionalModal] = useState(false);
    const [professionalApplication, setProfessionalApplication] = useState<ProfessionalApplication | null>(null);
    const [isLoadingApplication, setIsLoadingApplication] = useState(false);
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const { toast } = useToast();
    const { user: authUser, updateUser } = useAuth();
    const iconSize = 24;
    // Determine if this is the user's own profile
    const isOwnProfile = authUser?.username === username;

    // Use the profile being viewed (user prop) for display
    const profileUser = user;

    // Initialize followers count from user data
    useEffect(() => {
        if (profileUser?.followers_count !== undefined) {
            const count = typeof profileUser.followers_count === 'string'
                ? parseInt(profileUser.followers_count, 10)
                : profileUser.followers_count;
            setFollowersCount(isNaN(count) ? 0 : count);
        }

        // Initialize follow status if user data includes it
        if (profileUser && 'is_following' in profileUser) {
            setIsFollowing(!!(profileUser as any).is_following);
        } else if (!isOwnProfile && authUser) {
            // Fallback: fetch follow status from API if not provided by server
            fetchFollowStatus();
        }
    }, [profileUser?.followers_count, profileUser, isOwnProfile, authUser]);

    const fetchFollowStatus = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${backendUrl}/users/${encodeURIComponent(username)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData && 'is_following' in userData) {
                    setIsFollowing(!!userData.is_following);
                }
            }
        } catch (error) {
            console.log('Could not fetch follow status:', error);
        }
    };

    // Check if profile completion modal should be shown (only for own profile)
    useEffect(() => {
        if (isOwnProfile && authUser) {
            const shouldShow = shouldShowProfileCompletion(authUser);
            setShowProfileCompletion(shouldShow);
        }
    }, [isOwnProfile, authUser]);

    // Check for professional application status with proper auth handling
    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (isOwnProfile && !profileUser?.is_professional) {
                setIsLoadingApplication(true);
                try {
                    const response = await apiClient.getProfessionalApplicationStatus();
                    if (response.success && response.has_application) {
                        setProfessionalApplication(response.application);
                    }
                } catch (error: any) {
                    // Only log error if it's not an authentication issue for new accounts
                    if (!error.message?.includes('Authentication required')) {
                        console.error('Failed to check application status:', error);
                    } else {
                        console.log('Skipping professional status check - authentication still syncing');
                    }
                } finally {
                    setIsLoadingApplication(false);
                }
            }
        };

        // Only run for own profile
        if (isOwnProfile && authUser) {
            checkApplicationStatus();
        }
    }, [isOwnProfile, profileUser?.is_professional]);

    const handlePendingApplicationClick = () => {
        if (professionalApplication) {
            toast({
                title: "Application Status",
                description: `Your professional application ${professionalApplication.application_id} is still being reviewed. We'll notify you once it's processed.`,
            });
        }
    };

    const handleProfileCompletionComplete = () => {
        setShowProfileCompletion(false);
    };

    const handleProfessionalProfileSuccess = (updatedUser: User) => {
        // Update both local state and auth context
        updateUser(updatedUser);
    };

    const handleApplicationSubmitted = () => {
        // Refresh application status after submission
        const checkApplicationStatus = async () => {
            try {
                const response = await apiClient.getProfessionalApplicationStatus();
                if (response.success && response.has_application) {
                    setProfessionalApplication(response.application);
                }
            } catch (error) {
                console.error('Failed to check application status:', error);
            }
        };
        checkApplicationStatus();
    };

    const handleFollowChange = (newIsFollowing: boolean, newFollowersCount: number) => {
        setFollowersCount(newFollowersCount);
        setIsFollowing(newIsFollowing);
    };

    const stories = [
        {
            image:
                'https://uploadthingy.s3.us-west-1.amazonaws.com/7b8SDfzdY5YHxmmFvKrYkw/image.png',
            name: 'GALATASARAY',
        },
        {
            image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            name: 'Mazi us',
        },
        {
            image:
                'https://images.unsplash.com/photo-1618886487805-744c5f9c6c69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbiUyMHdpdGglMjBzdW5nbGFzc2VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
            name: 'King Tunde us',
        },
        {
            image:
                'https://images.unsplash.com/photo-1590411506193-00ed62f2d5d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlZCUyMGNhcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
            name: 'Tunde Ednut',
        },
    ]



    if (isMobile === undefined) return null;

    const baseUrl = `/@${username}`;
    const currentTab = pathname === baseUrl ? 'profile' :
        pathname === `${baseUrl}/posts` ? 'posts' :
            pathname === `${baseUrl}/replies` ? 'replies' :
                pathname === `${baseUrl}/media` ? 'media' :
                    pathname === `${baseUrl}/notes` ? 'notes' :
                        pathname === `${baseUrl}/store` ? 'store' : 'profile';

    return (
        <div className="bg-background text-foreground max-w-2xl mx-auto relative space-y-4">
            <div className="flex flex-row items-center gap-2 mt-4">
                <button onClick={() => router.back()} className="p-1.5 bg-card/50 border-2 text-foreground rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"></path></svg>
                </button>
            </div>

            <div className="w-full mx-auto overflow-hidden">
                {/* Banner Image */}
                <div className="max-h-40 relative">
                    <Banner className="w-full bg-card rounded-xl border-2">
                        {profileUser?.banner_url && (<BannerImage
                            src={profileUser.banner_url}
                            alt={`${profileUser?.name || username}'s banner`}
                            className="h-36 object-cover"
                        />)}
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                className="bg-black/50 border-white/30 text-white hover:bg-black/70 p-2 text-sm rounded-full h-10 absolute bottom-2 right-2"
                                onClick={() => setShowProfileCompletion(true)}
                            >
                                <Camera className="!size-6 shrink-0" />
                            </Button>
                        )}
                        {!profileUser?.banner_url && (<BannerFallback className="w-full h-24 bg-base flex items-center justify-center text-muted-foreground" />)}
                    </Banner>
                    {/* Profile icon/logo */}
                    <div className="absolute -bottom-8 left-4 bg-muted h-24 w-24 rounded-lg overflow-hidden flex items-center justify-center text-black text-xl font-bold">
                        <Avatar className="w-full h-full border-2">
                            <AvatarImage
                                src={profileUser?.profile_image || undefined}
                                alt={profileUser?.name || "User"}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-card text-primary text-3xl font-bold">
                                {(profileUser?.name || "U")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <div className="h-12 grid grid-cols-2 pt-2">
                    <div />
                    <div className="flex items-center justify-end gap-2 px-2">
                        {!isOwnProfile ? (
                            <FollowButton
                                userId={profileUser?.id}
                                username={username}
                                initialIsFollowing={isFollowing}
                                initialFollowersCount={followersCount}
                                onFollowChange={handleFollowChange}
                                variant="default"
                                size="sm"
                                showText={true}
                            />
                        ) : (
                            <Button
                                variant="outline"
                                className="bg-transparent px-6 py-1 text-sm rounded-full hover:text-muted-foreground"
                                onClick={() => setShowProfileCompletion(true)}
                            >
                                <PencilLine className="!size-4 shrink-0" />
                                Edit
                            </Button>
                        )}
                        {isOwnProfile && (
                            profileUser?.is_professional ? (
                                <Link href="#" className="bg-primary text-primary-foreground font-medium px-3 py-2 text-sm rounded-full flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                                    </svg>
                                    Analytics
                                </Link>
                            ) : professionalApplication?.status === 'pending' ? (
                                <Button
                                    onClick={handlePendingApplicationClick}
                                    className="bg-orange-600 text-white hover:bg-orange-700 font-medium px-3 py-1 text-sm rounded-full flex items-center gap-2"
                                >
                                    <Clock className="w-4 h-4" />
                                    Application Pending
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setShowProfessionalModal(true)}
                                    className="bg-white text-black hover:bg-gray-200 font-medium px-3 py-1 text-sm rounded-full flex items-center gap-2"
                                    disabled={isLoadingApplication}
                                >
                                    <BriefcaseBusiness className="w-4 h-4" />
                                    {isLoadingApplication ? "Loading..." : "Switch to Pro"}
                                </Button>
                            )
                        )}
                    </div>
                </div>
                {/* Profile Content */}
                <div className="px-4">
                    {/* Title and Description */}
                    <div className="mb-3">
                        <Tooltip text="Account is verified" side="bottom">
                            <span className="text-xl md:text-2xl capitalize font-bold text-foreground flex items-center gap-1 cursor-pointer">
                                {profileUser?.name || "Anonymous User"}
                                <VerifiedBadge accountType={profileUser?.is_professional ? "instructor" : "user"} className="mt-1" />
                            </span>
                        </Tooltip>
                        <p className="text-muted-foreground text-base leading-relaxed mb-2 flex">
                            @{profileUser?.username || username} 
                            {profileUser?.is_professional && profileUser?.professional_category ? (
                                <>
                                    <div className="flex items-center space-x-2 ml-2">
                                        <div className="bg-card w-px h-5" />
                                        <BriefcaseBusiness className="w-4 h-4 text-primary" />
                                        <p className="text-primary text-sm font-medium">
                                            {profileUser.professional_category}
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </p>
                        <p className="text-foreground text-base leading-relaxed line-clamp-2 mb-2">
                            {profileUser?.bio || "No bio available."} <Link href="#" className="text-blue-400 hover:underline">more</Link>
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.2 254.2 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.2 254.2 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118" /></svg>
                                <span className="text-muted-foreground">
                                    {profileUser?.location || "Not-available"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M8 13.885q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23m4 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23m4 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23M5.616 21q-.691 0-1.153-.462T4 19.385V6.615q0-.69.463-1.152T5.616 5h1.769V3.308q0-.233.153-.386t.385-.153t.386.153t.153.386V5h7.154V3.27q0-.214.143-.358t.357-.143t.356.143t.144.357V5h1.769q.69 0 1.153.463T20 6.616v12.769q0 .69-.462 1.153T18.384 21zm0-1h12.769q.23 0 .423-.192t.192-.424v-8.768H5v8.769q0 .23.192.423t.423.192M5 9.615h14v-3q0-.23-.192-.423T18.384 6H5.616q-.231 0-.424.192T5 6.616zm0 0V6z" /></svg>                                <span className="text-muted-foreground">
                                    Joined {profileUser?.created_at &&
                                        new Date(profileUser.created_at).toLocaleDateString(undefined, {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            {/* <Users size={16} className="text-muted-foreground" /> */}
                            <span className="font-medium">{profileUser?.followers_count || 0}</span>
                            <span className="">Following</span>
                        </div>
                        <>•</>
                        <div className="flex items-center gap-1">
                            {/* <BarChart3 size={16} className="text-muted-foreground" /> */}
                            <span className="font-medium">{profileUser?.points || 0}</span>
                            <span className="">Points</span>
                        </div>
                    </div>
                    {/* {profileUser?.website && (
                        <div className="mb-4 flex items-center gap-4 text-sm">
                            <a
                                href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 text-sm hover:text-blue-300 hover:underline transition-colors"
                            >
                                {profileUser.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )} */}
                    {/* Profile links */}
                    <div className="flex flex-row items-center flex-wrap gap-4">
                        <Link href="/" className="p-1 px-1.5 rounded-full bg-card dark:bg-muted flex items-center flex-row gap-2">
                            <Globe2Icon className="size-5" />
                            <span className="">Commerce</span>
                        </Link>
                        <Link href="/" className="p-1 px-1.5 rounded-full bg-card dark:bg-muted flex items-center flex-row gap-2">
                            <Globe2Icon className="size-5" />
                            <span className="">🔗 Our website</span>
                        </Link>
                        <Tooltip text="Add link" side="bottom">
                            <a href="#" className="text-muted-foreground">
                                <CircleFadingPlus className="size-5" />
                            </a>
                        </Tooltip>

                    </div>
                </div>
            </div>

            <div className="w-full mx-auto flex items-center justify-between border-b">
                <div className="flex items-center justify-between">
                    <Link
                        href={baseUrl}
                        className={`flex items-center justify-center w-full px-4 py-2 text-foreground font-medium transition-colors relative ${currentTab === 'profile'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Activity
                        {currentTab === 'profile' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                    <Link
                        href={`${baseUrl}/posts`}
                        className={`flex items-center justify-center w-full px-4 py-2 text-foreground font-medium transition-colors relative ${currentTab === 'posts'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Posts
                        {currentTab === 'posts' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                    <Link
                        href={`${baseUrl}/replies`}
                        className={`flex items-center justify-center w-full px-4 py-3 text-foreground font-medium transition-colors relative ${currentTab === 'replies'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Replies
                        {currentTab === 'replies' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                    <Link
                        href={`${baseUrl}/notes`}
                        className={`flex items-center justify-center w-full px-4 py-3 text-foreground font-medium transition-colors relative ${currentTab === 'notes'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Notes
                        {currentTab === 'notes' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                    <Link
                        href={`${baseUrl}/media`}
                        className={`flex items-center justify-center w-full px-4 py-3 text-foreground font-medium transition-colors relative ${currentTab === 'media'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Events
                        {currentTab === 'media' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                    <Link
                        href={`${baseUrl}/store`}
                        className={`flex items-center justify-center w-full px-4 py-3 text-foreground font-medium transition-colors relative ${currentTab === 'store'
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                            }`}
                    >
                        Store
                        {currentTab === 'store' && (
                            <span className="shrink-0 absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full animate-expand-custom-height"></span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Profile Completion Modal - only for own profile */}
            {isOwnProfile && authUser && (
                <ProfileCompletionModal
                    open={showProfileCompletion}
                    onOpenChange={setShowProfileCompletion}
                    user={authUser}
                    onComplete={handleProfileCompletionComplete}
                />
            )}

            {/* Professional Profile Modal - only for own profile */}
            {isOwnProfile && authUser && (
                <ProfessionalProfileModal
                    open={showProfessionalModal}
                    onOpenChange={setShowProfessionalModal}
                    user={authUser}
                    onSuccess={handleProfessionalProfileSuccess}
                    onApplicationSubmitted={handleApplicationSubmitted}
                />
            )}
        </div>
    );
}