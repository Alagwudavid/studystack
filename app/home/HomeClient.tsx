"use client";
/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  CirclePlus,
  Camera,
  TrendingUp,
  Users,
  Globe,
  Crown,
  Medal,
  Award,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LibraryBig,
  Compass,
  UsersRound,
  Headphones,
  Play,
  RefreshCcw,
  BookOpen,
  MessagesSquareIcon,
  Plus,
  X,
  MoreHorizontal,
  UserPlus,
  Ban,
  Settings,
  Share,
  HelpCircle,
  Flag,
} from "lucide-react";
import PostCard from "@/components/PostCard";
import { FeedGenerator } from "@/components/FeedGenerator";
import QuickPost from "@/components/QuickPost";
import TopicsNavigator from "@/components/TopicsNavigator";
import { socialLearningPosts } from "@/data/social-learning";
import { cn } from "@/lib/utils";
import { Audiowide } from "next/font/google";
import { useScreenSize } from "@/hooks/use-screen-size";
import NotificationBell from "@/components/NotificationBell";
import { CreatePostModal } from "@/components/CreatePostModal";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { RightSidebar } from "@/components/aside/right-sidebar";
import { useDynamicTitle } from "@/hooks/use-dynamic-title";
import Link from "next/link";
import styled from '@emotion/styled'

const StyledSidebar = styled.div`
        display: hidden;
        
        @media (min-width: 768px) {
          display: block;
        }
    `;

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile_image: string | null;
  bio: string | null;
  points: number;
  level: number;
  streak_count: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

interface HomeClientProps {
  serverUser?: User;
}

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
});

const HomeClient = ({ serverUser }: HomeClientProps) => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [activeTopic, setActiveTopic] = useState("home");
  const { setServerUser } = useAuth();
  const { user, isAuthenticated } = useLayoutContext();
  const { showTopNav } = useScreenSize();

  // Create a ref for the home content scroll container
  const homeContentRef = useRef<HTMLDivElement>(null);

  // Use dynamic title hook to update page title with notification count
  const { unreadCount } = useDynamicTitle({
    baseTitle: "For you | Home - Bitroot",
  });

  // Debug info in development
  const isDev = process.env.NODE_ENV === 'development';

  // Use the context authentication state
  const isUserAuthenticated = isAuthenticated;
  // Set server user in auth context if provided
  useEffect(() => {
    if (serverUser) {
      setServerUser(serverUser);
    }
  }, [serverUser, setServerUser]);

  const topics = [
    {
      id: 'biology-basics',
      name: 'Biology basics',
      Members: '5.1k',
      replies: 12,
      image:
        'https://thumbs.dreamstime.com/b/biology-hand-drawn-doodles-lettering-education-science-vector-white-background-135246167.jpg',
    },
    {
      id: 'unn-aspirants',
      name: 'UNN Aspirants',
      Members: '4.2k',
      replies: 566,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA5BvK32tXMmSMJT5OYyj9xqI0vx7bLrvCRjN9X9KCxW6AuyIteAx_MV5a-a54c0dJ1B4&usqp=CAU',
    },
    {
      id: 'what-is-physics',
      name: 'What is Physics?',
      Members: '219.1K',
      replies: 506,
      image:
        'https://scienceforgeorgia.org/wp-content/uploads/2020/08/physics_img.png',
    },
    {
      id: 'chess-kings',
      name: 'Chess Kings',
      Members: '2.2M',
      replies: 430,
      image:
        'https://blog.houseofstaunton.com/wp-content/uploads/2024/11/Chess-King-Wear-a-Crown-Pexels-1024x701.jpg',
      isLive: true,
    },
  ]

  return (
    <div className="bg-background h-full">
      <div className="flex">
        {isUserAuthenticated && <NotificationBell />}
        {/* Main Content */}
        <main className={cn("flex-1 relative min-h-screen overflow-hidden", showTopNav && "pt-14")}>
          <div
            ref={homeContentRef}
            data-scroll-container="true"
            className="max-w-7xl mx-auto h-full md:h-screen overflow-y-auto scrollbar-custom scrollbar-hide relative"
          >
            <div className="max-w-xl grid grid-cols-1 mx-auto md:gap-4">
              {isUserAuthenticated && (
                <div className="max-w-xl w-full mx-auto mt-4">
                  <QuickPost
                    user={user || serverUser || undefined}
                    onCreatePost={() => setShowCreatePostModal(true)}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:gap-4 overflow-hidden md:mt-4">
                {socialLearningPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="p-4 text-center max-w-xl mx-auto flex flex-wrap items-center justify-center gap-2">
                <span className="text-foreground">Seems you've reached the end.</span>
                <Button
                  variant="cool"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Refresh <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
        <div className="hidden lg:block min-h-screen w-fit sticky top-0 self-start">
          <RightSidebar />
        </div>
      </div>
      <CreatePostModal
        open={showCreatePostModal}
        onOpenChange={setShowCreatePostModal}
        user={user || serverUser || undefined}
      />
    </div>
  );
};

export default HomeClient;
