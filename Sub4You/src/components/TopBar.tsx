import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GlassSurface from './GlassSurface'
import { CgProfile, CgSearch } from 'react-icons/cg'
import GradientText from './GradientText'
import { THEME } from '../constants/theme'

interface TopBarProps {
  children?: ReactNode
  profileImageSrc?: string
  profileImageAlt?: string
  isLoggedIn?: boolean
  onLoginClick?: () => void
  onSignUpClick?: () => void
  onHomeClick?: () => void
  onProfileClick?: () => void
  onLogoutClick?: () => void
}

/**
 * TopBar Component
 * A navigation bar with Sub4You brand on the left and a continuous glass surface bar
 * that starts where Sub4You ends.
 */
export const TopBar = ({
  children,
  profileImageSrc,
  profileImageAlt = 'Profile',
  isLoggedIn = false,
  onLoginClick,
  onSignUpClick,
  onHomeClick,
  onProfileClick,
  onLogoutClick
}: TopBarProps = {}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm')
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const glassSurfaceRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Responsive height calculation based on screen size
  const getResponsiveHeight = () => {
    switch (screenSize) {
      case 'sm': return 40  // Small screens
      case 'md': return 45  // Medium screens
      case 'lg': return 50  // Large screens
      case 'xl': return 55  // Extra large screens
      case '2xl': return 60 // 2X large screens
      default: return 40
    }
  }

  // Responsive top padding
  const getResponsiveTopPadding = () => {
    switch (screenSize) {
      case 'sm': return 16
      case 'md': return 18
      case 'lg': return 20
      case 'xl': return 22
      case '2xl': return 24
      default: return 16
    }
  }

  // Responsive auth button min width
  const getResponsiveAuthMinWidth = () => {
    switch (screenSize) {
      case 'sm': return '200px'
      case 'md': return '220px'
      case 'lg': return '240px'
      case 'xl': return '260px'
      case '2xl': return '280px'
      default: return '200px'
    }
  }

  // Responsive profile image size
  const getResponsiveProfileImageSize = () => {
    switch (screenSize) {
      case 'sm': return 32
      case 'md': return 36
      case 'lg': return 40
      case 'xl': return 44
      case '2xl': return 48
      default: return 32
    }
  }

  // Responsive dropdown icon size
  const getResponsiveDropdownIconSize = () => {
    switch (screenSize) {
      case 'sm': return 24
      case 'md': return 28
      case 'lg': return 32
      case 'xl': return 36
      case '2xl': return 40
      default: return 24
    }
  }

  // Responsive profile icon size
  const getResponsiveProfileIconSize = () => {
    switch (screenSize) {
      case 'sm': return 24
      case 'md': return 26
      case 'lg': return 30
      case 'xl': return 32
      case '2xl': return 36
      default: return 24
    }
  }

  // Responsive dropdown border radius
  const getResponsiveDropdownBorderRadius = () => {
    switch (screenSize) {
      case 'sm': return 16
      case 'md': return 18
      case 'lg': return 20
      case 'xl': return 22
      case '2xl': return 24
      default: return 16
    }
  }

  // Responsive navigation gap
  const getResponsiveNavGap = () => {
    switch (screenSize) {
      case 'sm': return '24px'  // Small screens - smaller gap
      case 'md': return '36px'  // Medium screens
      case 'lg': return '52px'  // Large screens - increased
      case 'xl': return '64px'  // Extra large screens - increased
      case '2xl': return '80px' // 2X large screens - increased
      default: return '24px'
    }
  }

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width >= 1536) {
        setScreenSize('2xl')
      } else if (width >= 1280) {
        setScreenSize('xl')
      } else if (width >= 1024) {
        setScreenSize('lg')
      } else if (width >= 768) {
        setScreenSize('md')
      } else {
        setScreenSize('sm')
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  // Constants with responsive values
  const CONFIG = {
    height: getResponsiveHeight(),
    topPadding: getResponsiveTopPadding(),
    brandText: 'Sub4You',
    navPadding: {
      left: getResponsiveNavGap(), // Left padding equals gap
      right: '24px'
    },
    navGap: '60px',
  }

  // Common glass properties
  const commonGlassProps = {
    distortionScale: -150,
    redOffset: 5,
    greenOffset: 15,
    blueOffset: 25,
    brightness: 60,
    opacity: 0.93,
    mixBlendMode: 'screen' as const,
    saturation: 1,
    blur: 7,
  }

  const glassBarProps = {
    ...commonGlassProps,
    width: '100%',
    height: CONFIG.height,
    borderRadius: 50,
  }

  const circularButtonProps = {
    ...commonGlassProps,
    width: CONFIG.height,
    height: CONFIG.height,
    borderRadius: CONFIG.height,
  }

  const authButtonsProps = {
    ...commonGlassProps,
    width: 'auto',
    height: CONFIG.height,
    borderRadius: CONFIG.height,
    minWidth: getResponsiveAuthMinWidth(),
  }

  const dropdownProps = {
    ...commonGlassProps,
    width: CONFIG.height,
    height: 'auto',
    borderRadius: getResponsiveDropdownBorderRadius(),
  }

  // Navigation items
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Messages', path: '/messages' },
    { label: 'Saved', path: '/saved' },
    { label: 'Matches', path: '/matches' },
    { label: 'Support', path: '/help' },
  ]

  // Event handlers
  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchQuery('')
    }
  }

  const handleEscape = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (path: string) => {
    // If we're already on this page, do nothing to prevent duplicate history
    if (path === location.pathname) {
      return
    }

    console.log(`Navigate to: ${path}`)
    setIsSearchOpen(false)
    if (path === '/' && onHomeClick) {
      onHomeClick()
    } else {
      navigate(path)
    }
  }

  // Close search when clicking outside the glass surface
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideGlassSurface = glassSurfaceRef.current?.contains(event.target as Node)
      const clickedSearchButton = searchButtonRef.current?.contains(event.target as Node)

      // Close if clicked outside glass surface and not on search button
      if (isSearchOpen && !clickedInsideGlassSurface && !clickedSearchButton) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideDropdown = dropdownRef.current?.contains(event.target as Node)
      const clickedProfileButton = profileButtonRef.current?.contains(event.target as Node)

      // Close if clicked outside dropdown and not on profile button
      if (isDropdownOpen && !clickedInsideDropdown && !clickedProfileButton) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleProfilePageClick = () => {
    setIsDropdownOpen(false)
    if (onProfileClick) {
      onProfileClick()
    } else {
      // Default behavior if no prop provided
      navigate('/profile')
    }
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    if (onLogoutClick) {
      onLogoutClick()
    }
  }

  // Icons with responsive sizing
  const profileIconSize = getResponsiveProfileIconSize()
  const profileIcon = <CgProfile className={THEME.light.classes.text} style={{ width: `${profileIconSize}px`, height: `${profileIconSize}px` }} />
  const searchIcon = <CgSearch className={THEME.light.classes.text} style={{ width: '24px', height: '24px' }} />

  // Default content for glass bar
  const defaultContent = (
    <div
      className="w-full h-full flex items-center justify-between"
      style={{ paddingLeft: CONFIG.navPadding.left, paddingRight: CONFIG.navPadding.right }}
    >
      {/* Navigation buttons */}
      <div
        className="flex items-center"
        style={{
          gap: getResponsiveNavGap(),
          transform: isSearchOpen ? 'translateX(-100%)' : 'translateX(0)',
          opacity: isSearchOpen ? 0 : 1,
          pointerEvents: isSearchOpen ? 'none' : 'auto',
          transition: isSearchOpen
            ? 'transform 600ms ease-in-out, opacity 300ms ease-in-out'
            : 'transform 600ms ease-in-out, opacity 300ms ease-in-out',
          willChange: 'transform, opacity'
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`${THEME.light.classes.text} ${THEME.light.classes.hover} transition-all duration-200 font-medium text-sm whitespace-nowrap hover:scale-110`}
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div
        ref={searchContainerRef}
        className="absolute right-[24px] flex items-center"
        style={{
          left: CONFIG.navPadding.left,
          transform: isSearchOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? 'auto' : 'none',
          transition: isSearchOpen
            ? 'transform 400ms ease-in-out, opacity 200ms ease-in-out 400ms'
            : 'opacity 200ms ease-in-out, transform 400ms ease-in-out 200ms',
          willChange: 'transform, opacity'
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-transparent ${THEME.light.classes.text} placeholder-gray-500 outline-none text-sm font-medium`}
          style={{ caretColor: THEME.light.text }}
          autoFocus={isSearchOpen}
          onKeyDown={(e) => e.key === 'Escape' && handleEscape()}
        />
      </div>

      {/* Search button */}
      <button
        ref={searchButtonRef}
        className="flex items-center justify-center hover:opacity-80 transition-all duration-200 relative z-10 hover:scale-110"
        aria-label="Search"
        onClick={handleSearchClick}
      >
        {searchIcon}
      </button>
    </div>
  )

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24"
      style={{ paddingTop: `${CONFIG.topPadding}px` }}
    >
      <div
        className="pointer-events-auto flex items-center w-full gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8"
      >
        {/* Brand text */}
        <div className="whitespace-nowrap pointer-events-auto flex items-center">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={15}
            showBorder={false}
            className="text-4xl font-bold"
          >
            {CONFIG.brandText}
          </GradientText>
        </div>

        {/* Main glass bar */}
        <div
          ref={glassSurfaceRef}
          className="flex-1 pointer-events-auto relative"
          style={{ minWidth: 0 }}
        >
          <GlassSurface {...glassBarProps}>
            {children ?? defaultContent}
          </GlassSurface>
        </div>

        {/* Profile button or Auth buttons */}
        <div className="pointer-events-auto flex items-center relative">
          {isLoggedIn ?
            (
              <>
                <div
                  ref={profileButtonRef}
                  onClick={handleProfileClick}
                  className="cursor-pointer"
                >
                  <GlassSurface {...circularButtonProps}>
                    <div className="w-full h-full flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-110">
                      {profileImageSrc ? (
                        <img
                          src={profileImageSrc}
                          alt={profileImageAlt}
                          className="w-full h-full object-cover rounded-full"
                          style={{ width: `${getResponsiveProfileImageSize()}px`, height: `${getResponsiveProfileImageSize()}px` }}
                        />
                      ) : (
                        <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                          {profileIcon}
                        </div>
                      )}
                    </div>
                  </GlassSurface>
                </div>

                {/* Dropdown menu */}
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-2 z-30"
                  style={{
                    marginTop: '8px',
                    opacity: isDropdownOpen ? 1 : 0,
                    transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                    pointerEvents: isDropdownOpen ? 'auto' : 'none',
                    transition: 'opacity 150ms ease-in-out, transform 150ms ease-in-out',
                    visibility: isDropdownOpen ? 'visible' : 'hidden'
                  }}
                >
                  <GlassSurface {...dropdownProps}>
                    <div className="p-3 flex flex-col items-center gap-4">
                      <button
                        onClick={handleProfilePageClick}
                        className="w-full flex flex-col items-center gap-2 py-2 text-white hover:opacity-80 transition-opacity duration-200"
                      >
                        {profileImageSrc ? (
                          <img
                            src={profileImageSrc}
                            alt={profileImageAlt}
                            className="object-cover rounded-full"
                            style={{ width: `${getResponsiveProfileImageSize()}px`, height: `${getResponsiveProfileImageSize()}px` }}
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            {profileIcon}
                          </div>
                        )}
                        <span className={`${THEME.light.classes.text} font-medium text-xs`}>Profile</span>
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex flex-col items-center gap-2 py-2 text-white hover:opacity-80 transition-opacity duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{ width: `${getResponsiveDropdownIconSize()}px`, height: `${getResponsiveDropdownIconSize()}px` }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className={`${THEME.light.classes.text} font-medium text-xs`}>Logout</span>
                      </button>
                    </div>
                  </GlassSurface>
                </div>
              </>
            ) : (
              <GlassSurface {...authButtonsProps}>
                <div className="w-full h-full flex items-center justify-center gap-3 px-4">
                  {/* Sign Up Button */}
                  <button
                    onClick={() => onSignUpClick ? onSignUpClick() : navigate('/signup')}
                    className={`${THEME.light.classes.text} ${THEME.light.classes.hover} transition-all duration-200 font-medium text-sm whitespace-nowrap hover:scale-110`}
                    aria-label="Sign Up"
                  >
                    Sign Up
                  </button>
                  
                  {/* Login Button */}
                  <button
                    onClick={() => onLoginClick ? onLoginClick() : navigate('/login')}
                    className={`${THEME.light.classes.text} ${THEME.light.classes.hover} transition-all duration-200 font-medium text-sm whitespace-nowrap hover:scale-110`}
                    aria-label="Login"
                  >
                    Login
                  </button>
                </div>
              </GlassSurface>
            )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
