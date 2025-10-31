'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { shouldRedirectToOnboarding } from '@/lib/onboarding-utils';
import Loader from './ui/loader';
import Link from 'next/link';

interface OnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function OnboardingGuard({
  children,
  redirectTo = '/onboarding',
}: OnboardingGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showSkip, setShowSkip] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Show "Skip" button after 5 seconds on loader
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle onboarding redirect once auth is ready
  useEffect(() => {
    if (isLoading || hasRedirected) return;

    if (isAuthenticated && user && shouldRedirectToOnboarding(user)) {
      setHasRedirected(true);
      router.replace(redirectTo); // replace() avoids back button issues
    }
  }, [isLoading, isAuthenticated, user, router, redirectTo, hasRedirected]);

  const handleSkip = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== redirectTo) {
      router.push(currentPath);
    } else {
      router.push('/home');
    }
  };

  // Loader while auth context initializes
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen relative">
        <Loader />
        {showSkip && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
          >
            Skip
          </button>
        )}
      </div>
    );
  }

  // While redirecting to onboarding
  if (
    isAuthenticated &&
    user &&
    shouldRedirectToOnboarding(user) &&
    !hasRedirected
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <Loader />
        <p className="text-center text-muted-foreground">
          Checking your onboarding status...
        </p>
      </div>
    );
  }

  // Otherwise render children
  return <>{children}</>;
}
