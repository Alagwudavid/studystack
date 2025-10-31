/** @jsxImportSource @emotion/react */
"use client";
import { useRef } from "react";
import styled from '@emotion/styled';
import { BottomNav } from "@/components/bottom-nav";
import { TopNavigation } from "@/components/top-navigation";
import { UnifiedTopNavigation } from "@/components/UnifiedTopNavigation";
import { AsideBar } from "@/components/aside-bar";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SideBar } from "../SideBar";
import { FloatingSidebar } from "../FloatingSidebar";
import { DropdownSidebar } from "../DropdownSidebar";
import { BottomWidget } from "../BottomWidget";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import JumpToTopButton from "@/components/JumpToTopButton";
import { useScreenSize } from "@/hooks/use-screen-size";

import type { User } from "@/types/user";

const LayoutContainer = styled.div<{ $isMobile: boolean; $sidebarVisible: boolean }>`
  display: grid;
  grid-template-areas: ${props =>
    props.$isMobile
      ? '"top" "main"'
      : '"top top" "sidebar main"'
  };
  grid-template-columns: ${props =>
    props.$isMobile
      ? '1fr'
      : 'auto 1fr'
  };
  grid-template-rows: auto 1fr;
  height: 100vh;
  position: relative;
`;

const TopNav = styled.header`
  grid-area: top;
  z-index: 30;
`;

const Sidebar = styled.aside<{ $isMobile: boolean; $visible: boolean }>`
  grid-area: ${props => props.$isMobile ? 'unset' : 'sidebar'};
  
  ${props => !props.$isMobile && `
    /* Large screen: normal grid positioning */
  `}
`;

const MainContent = styled.main`
  grid-area: main;
  position: relative;
`;

interface ProtectedLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  token?: string;
}

export function ProtectedLayout({
  children,
  user = null,
  token,
}: ProtectedLayoutProps) {
  const { setServerUser } = useAuth();
  const { showTopNav, isMobile } = useScreenSize();

  useEffect(() => {
    if (user && setServerUser) {
      setServerUser(user, token);
    }
  }, [user, token, setServerUser]);

  const mainRef = useRef<HTMLElement>(null);

  return (
    <LayoutProvider user={user}>
      <SearchProvider>
        <LayoutContainer
          className="bg-background text-foreground theme-aware"
          $isMobile={isMobile}
          $sidebarVisible={false}
        >
          {/* Top Navigation - spans full width */}
          <TopNav>
            <UnifiedTopNavigation />
          </TopNav>

          {/* Sidebar - handled by SideBar component */}
          {!isMobile && (
            <Sidebar
              $isMobile={isMobile}
              $visible={true}
            >
              <SideBar />
            </Sidebar>
          )}

          {/* Mobile sidebar is handled within SideBar component */}
          {isMobile && (
            <SideBar />
          )}

          {/* Main Content */}
          <MainContent
            ref={mainRef}
            className="overflow-y-auto scrollbar-hide max-md:px-0.5 pl-0 max-lg:pr-0"
          >
            {children}
            <JumpToTopButton
              scrollContainer={mainRef.current}
            />
          </MainContent>
        </LayoutContainer>
      </SearchProvider>
    </LayoutProvider>
  );
}
