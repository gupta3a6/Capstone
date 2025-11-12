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
}

/**
 * TopBar Component
 * Navigation bar component that uses glass surfaces.
 * This provides a consistent top navigation bar across all pages.
 * Features:
 * - Sub4You logo/brand on the left
 * - Login button on the right (symmetrical)
 * 
 * @param leftWidth - Width of the Sub4You brand glass surface (default: 200)
 * @param leftHeight - Height of the Sub4You brand glass surface (default: 75)
 * @param rightWidth - Width of the Login button glass surface (default: 200)
 * @param rightHeight - Height of the Login button glass surface (default: 75)
 */
export const TopBar = ({
  leftWidth = 200,
  leftHeight = 75,
  rightWidth = 200,
  rightHeight = 75,
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
            <h1 className="text-2xl font-bold text-white">Sub4You</h1>
          </div>
        </GlassSurface>
      </div>

      {/* Right side - Login button */}
      <div className="pointer-events-auto">
        <GlassSurface {...rightGlassProps}>
          <div className="p-4 text-center">
            <button className="text-xl font-semibold text-white hover:opacity-80 transition-opacity">
              Login
            </button>
          </div>
        </GlassSurface>
      </div>
    </div>
  )
}

export default TopBar