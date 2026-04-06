import type { ReactNode } from 'react'
import '../App.css'

import { THEME } from '../constants/theme'

interface PageBackgroundProps {
  children: ReactNode
  isLister?: boolean
}

/**
 * PageBackground component that provides the consistent background (black + orange blob)
 * for all pages of the website. Wrap all page content with this component.
 */
export const PageBackground = ({ children, isLister = false }: PageBackgroundProps) => {
  const bgColor = isLister ? '#FFE5D9' : THEME.light.background;

  return (
    <div 
      className="relative min-h-screen w-full text-dark-text font-sans transition-colors duration-500"
      style={{ backgroundColor: bgColor, minHeight: '100vh' }}
    >
      {/* Orange gradient blob background - Fixed */}
      <div className="fixed inset-0 gradient-blob" aria-hidden="true" style={{ zIndex: 0 }} />
      
      {/* Page content */}
      {children}
    </div>
  )
}

export default PageBackground

