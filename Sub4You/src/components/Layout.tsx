import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import PageBackground from './PageBackground'
import TopBar from './TopBar'

interface LayoutProps {
  children?: ReactNode
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
  isLoggedIn = false,
  profileImageSrc,
  profileImageAlt,
  onLoginClick,
  onSignUpClick,
  onHomeClick,
  onProfileClick,
  onLogoutClick,
}: LayoutProps) => {
  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50">
          <TopBar
            isLoggedIn={isLoggedIn}
            profileImageSrc={profileImageSrc}
            profileImageAlt={profileImageAlt}
            onLoginClick={onLoginClick}
            onSignUpClick={onSignUpClick}
            onHomeClick={onHomeClick}
            onProfileClick={onProfileClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
        <div className="">
          {children || <Outlet />}
        </div>
      </div>
    </PageBackground>
  )
}

export default Layout

