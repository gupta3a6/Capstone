import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import GlassSurface from './GlassSurface'
import { CgProfile, CgSearch } from 'react-icons/cg'
import GradientText from './GradientText'

interface TopBarProps {
  children?: ReactNode
  profileImageSrc?: string
  profileImageAlt?: string
}

/**
 * TopBar Component
 * A navigation bar with Sub4You brand on the left and a continuous glass surface bar
 * that starts where Sub4You ends.
 */
export const TopBar = ({ 
  children, 
  profileImageSrc,
  profileImageAlt = 'Profile'
}: TopBarProps = {}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const glassSurfaceRef = useRef<HTMLDivElement>(null)

  // Constants
  const CONFIG = {
    height: 60,
    topPadding: 20,
    brandText: 'Sub4You',
    navPadding: { left: '60px', right: '24px' },
    navGap: '60px',
  }

  // Animation timing
  const TRANSITION = 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'

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

  const handleNavClick = (path: string) => {
    console.log(`Navigate to: ${path}`)
    setIsSearchOpen(false)
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

  // Icons
  const profileIcon = <CgProfile className="text-white" style={{ width: '30px', height: '30px' }} />
  const searchIcon = <CgSearch className="text-white" style={{ width: '24px', height: '24px' }} />

  // Default content for glass bar
  const defaultContent = (
    <div 
      className="w-full h-full flex items-center justify-between" 
      style={{ paddingLeft: CONFIG.navPadding.left, paddingRight: CONFIG.navPadding.right }}
    >
      {/* Navigation buttons */}
      <div 
        className="flex items-center gap-[60px]"
        style={{
          transform: isSearchOpen ? 'translateX(-100%)' : 'translateX(0)',
          opacity: isSearchOpen ? 0 : 1,
          pointerEvents: isSearchOpen ? 'none' : 'auto',
          transition: TRANSITION,
          willChange: 'transform, opacity'
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium text-sm whitespace-nowrap"
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div
        ref={searchContainerRef}
        className="absolute left-[60px] right-[24px] flex items-center"
        style={{
          transform: isSearchOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? 'auto' : 'none',
          transition: TRANSITION,
          willChange: 'transform, opacity'
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm font-medium"
          style={{ caretColor: 'white' }}
          autoFocus={isSearchOpen}
          onKeyDown={(e) => e.key === 'Escape' && handleEscape()}
        />
      </div>

      {/* Search button */}
      <button 
        ref={searchButtonRef}
        className="flex items-center justify-center hover:opacity-80 transition-opacity relative z-10"
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
        className="pointer-events-auto flex items-center w-full gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 2xl:gap-28"
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

        {/* Profile button */}
        <div className="pointer-events-auto flex items-center">
          <GlassSurface {...circularButtonProps}>
            <button 
              className="w-full h-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label={profileImageAlt}
              onClick={() => console.log('Profile clicked')}
            >
              {profileImageSrc ? (
                <img 
                  src={profileImageSrc} 
                  alt={profileImageAlt}
                  className="w-full h-full object-cover rounded-full"
                  style={{ width: '40px', height: '40px' }}
                />
              ) : (
                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                  {profileIcon}
                </div>
              )}
            </button>
          </GlassSurface>
        </div>
      </div>
    </div>
  )
}

export default TopBar
