import { useState, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PageBackground from './PageBackground'
import TopBar from './TopBar'
import type { NavItem } from './TopBar'

interface LayoutProps {
  children?: ReactNode
  navItems?: NavItem[]
  isLoggedIn?: boolean
  profileImageSrc?: string
  profileImageAlt?: string
  onLoginClick?: () => void
  onSignUpClick?: () => void
  onHomeClick?: () => void
  onProfileClick?: () => void
  onLogoutClick?: () => void
}

/**
 * Layout Component
 * Provides a consistent layout with PageBackground and TopBar.
 * Uses flex column to ensure content flows naturally below the TopBar.
 */
export const Layout = ({
  children,
  navItems,
  isLoggedIn = false,
  profileImageSrc,
  profileImageAlt,
  onLoginClick,
  onSignUpClick,
  onHomeClick,
  onProfileClick,
  onLogoutClick,
}: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const isLister = location.pathname.startsWith('/lister')

  return (
    <PageBackground isLister={isLister}>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50">
          <TopBar
            navItems={navItems}
            isLoggedIn={isLoggedIn}
            profileImageSrc={profileImageSrc}
            profileImageAlt={profileImageAlt}
            onLoginClick={onLoginClick}
            onSignUpClick={onSignUpClick}
            onHomeClick={onHomeClick}
            onProfileClick={onProfileClick}
            onLogoutClick={onLogoutClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="">
          {children || <Outlet context={{ searchQuery }} />}
        </div>
      </div>
    </PageBackground>
  )
}

export default Layout

