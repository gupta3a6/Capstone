import type { ReactNode } from 'react'
import '../App.css'

import { THEME } from '../constants/theme'

interface PageBackgroundProps {
  children: ReactNode
}

/**
 * PageBackground component that provides the consistent background (black + orange blob)
 * for all pages of the website. Wrap all page content with this component.
 */
export const PageBackground = ({ children }: PageBackgroundProps) => {
  return (
    <div 
      className="relative min-h-screen w-full text-dark-text font-sans"
      style={{ backgroundColor: THEME.light.background, minHeight: '100vh' }}
    >
      {/* Orange gradient blob background - Fixed */}
      <div className="fixed inset-0 gradient-blob" aria-hidden="true" style={{ zIndex: 0 }} />
      
      {/* Page content */}
      {children}
    </div>
  )
}

export default PageBackground

