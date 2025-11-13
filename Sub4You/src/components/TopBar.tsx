import GlassSurface from './GlassSurface'

interface TopBarProps {
  /** Width of the Sub4You brand glass surface on the left */
  leftWidth?: number | string
  /** Height of the Sub4You brand glass surface on the left */
  leftHeight?: number | string
  /** Width of the Login button glass surface on the right */
  rightWidth?: number | string
  /** Height of the Login button glass surface on the right */
  rightHeight?: number | string
  /** Callback function when Login button is clicked */
  onLoginClick?: () => void
  /** Callback function when Sign Up button is clicked */
  onSignUpClick?: () => void
  /** Callback function when Sub4You brand/logo is clicked */
  onHomeClick?: () => void
}

/**
 * TopBar Component
 * Navigation bar component that uses glass surfaces.
 * This provides a consistent top navigation bar across all pages.
 * Features:
 * - Sub4You logo/brand on the left
 * - Login and Sign Up buttons on the right
 * 
 * @param leftWidth - Width of the Sub4You brand glass surface (default: 200)
 * @param leftHeight - Height of the Sub4You brand glass surface (default: 75)
 * @param rightWidth - Width of the button glass surfaces (default: 150)
 * @param rightHeight - Height of the button glass surfaces (default: 75)
 */
export const TopBar = ({
  leftWidth = 200,
  leftHeight = 75,
  rightWidth = 150,
  rightHeight = 75,
  onLoginClick,
  onSignUpClick,
  onHomeClick,
}: TopBarProps = {}) => {
  const baseGlassProps = {
    borderRadius: 50,
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

  const leftGlassProps = {
    ...baseGlassProps,
    width: leftWidth,
    height: leftHeight,
  }

  const rightGlassProps = {
    ...baseGlassProps,
    width: rightWidth,
    height: rightHeight,
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-20 pt-8 pointer-events-none">
      {/* Left side - Sub4You brand */}
      <div className="pointer-events-auto">
        <GlassSurface {...leftGlassProps}>
          <div className="p-4 text-center">
            <button 
              onClick={onHomeClick}
              className="text-2xl font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              Sub4You
            </button>
          </div>
        </GlassSurface>
      </div>

      {/* Right side - Login and Sign Up buttons */}
      <div className="pointer-events-auto flex items-center gap-4">
        <GlassSurface {...rightGlassProps}>
          <div className="p-4 text-center">
            <button 
              onClick={onLoginClick}
              className="text-xl font-semibold text-white hover:opacity-80 transition-opacity"
            >
              Login
            </button>
          </div>
        </GlassSurface>
        <GlassSurface {...rightGlassProps}>
          <div className="p-4 text-center">
            <button 
              onClick={onSignUpClick}
              className="text-xl font-semibold text-white hover:opacity-80 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </GlassSurface>
      </div>
    </div>
  )
}

export default TopBar