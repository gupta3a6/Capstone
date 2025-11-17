import type { ReactNode } from 'react'
import PageBackground from './PageBackground'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  isLoggedIn?: boolean
  profileImageSrc?: string
  profileImageAlt?: string
  onLoginClick?: () => void
  onSignUpClick?: () => void
  onHomeClick?: () => void
}

/**
 * Layout Component
 * Provides a consistent layout with PageBackground and TopBar that stays fixed.
 * Only the children content changes when navigating.
 */
export const Layout = ({
  children,
  isLoggedIn = false,
  profileImageSrc,
  profileImageAlt,
  onLoginClick,
  onSignUpClick,
  onHomeClick,
}: LayoutProps) => {
  return (
    <PageBackground>
      <TopBar
        isLoggedIn={isLoggedIn}
        profileImageSrc={profileImageSrc}
        profileImageAlt={profileImageAlt}
        onLoginClick={onLoginClick}
        onSignUpClick={onSignUpClick}
        onHomeClick={onHomeClick}
      />
      {children}
    </PageBackground>
  )
}

export default Layout

