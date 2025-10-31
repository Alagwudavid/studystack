'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2, MessageCircle, Share } from "lucide-react";
import { toast } from "sonner";

interface FollowButtonProps {
  userId?: number;
  username: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
  showActions?: boolean;
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void;
}

export default function FollowButton({
  userId,
  username,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  variant = "default",
  size = "sm",
  showText = true,
  showActions = false,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Safety check for username
  if (!username) {
    console.error('FollowButton: username prop is missing');
    return (
      <div className="text-red-500 text-sm">
        Error: Username not provided
      </div>
    );
  }

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token") ||
        getCookie("client_auth_token");
    }
    return null;
  };

  // Helper function to get cookie value
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  async function toggleFollow() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const action = isFollowing ? "unfollow" : "follow";
      const method = isFollowing ? "DELETE" : "POST";

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Protection': '1',
      };

      const authToken = getAuthToken();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${apiBase.replace(/\/api$/, '')}/api/users/${encodeURIComponent(username)}/follow`, {
        method,
        credentials: 'include',
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to follow users");
          window.location.href = '/auth';
          return;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        const newIsFollowing = !isFollowing;
        const newFollowersCount = data.followers_count || followersCount + (newIsFollowing ? 1 : -1);

        setIsFollowing(newIsFollowing);
        setFollowersCount(newFollowersCount);

        // Call the callback if provided
        onFollowChange?.(newIsFollowing, newFollowersCount);

        toast.success(data.message || (newIsFollowing ? 'Followed successfully' : 'Unfollowed successfully'));
      } else {
        toast.error(data.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
      toast.error('Action failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleMessage = () => {
    // TODO: Implement message functionality
    toast.info("Messaging feature coming soon!");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${username} on Bitroot`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share profile");
    }
  };

  const buttonText = isFollowing
    ? (showText ? "Following" : "")
    : (showText ? "Follow" : "");

  const ButtonIcon = isLoading
    ? Loader2
    : isFollowing
      ? UserMinus
      : UserPlus;

  if (showActions) {
    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={toggleFollow}
          disabled={isLoading}
          variant={isFollowing ? "outline" : variant}
          size={size}
          className={`
            transition-all duration-200 
            ${isFollowing
              ? "hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800"
              : "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800"
            }
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <ButtonIcon className={`${showText ? "mr-2" : ""} h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {showText && (isLoading ? 'Please wait...' : buttonText)}
        </Button>

        <Button
          variant="outline"
          size={size}
          onClick={handleMessage}
          className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>

        <Button
          variant="ghost"
          size={size}
          onClick={handleShare}
          className="hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={`
        transition-all duration-200 
        ${isFollowing
          ? "hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800"
          : "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <ButtonIcon className={`${showText ? "mr-2" : ""} h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      {showText && (isLoading ? 'Please wait...' : buttonText)}
    </Button>
  );
}