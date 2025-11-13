import { useState } from 'react'
import PageBackground from '../components/PageBackground'
import TopBar from '../components/TopBar'
import GlassSurface from '../components/GlassSurface'

/**
 * Login Page Component
 * A simple login page with consistent background and top bar.
 */
export const LoginPage = ({ 
  onNavigateToSignUp,
  onNavigateToLogin,
  onNavigateToHome
}: { 
  onNavigateToSignUp: () => void
  onNavigateToLogin: () => void
  onNavigateToHome: () => void
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const glassProps = {
    borderRadius: 30,
    distortionScale: -150,
    redOffset: 5,
    greenOffset: 15,
    blueOffset: 25,
    brightness: 60,
    opacity: 0.93,
    mixBlendMode: 'screen' as const,
    saturation: 1,
    blur: 7,
    width: 450,
    height: 'auto',
  }

  return (
    <PageBackground>
      <TopBar onLoginClick={onNavigateToLogin} onSignUpClick={onNavigateToSignUp} onHomeClick={onNavigateToHome} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 pt-40 pb-20">
        <GlassSurface {...glassProps}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                Login
              </button>
              
              <div className="text-center mt-4">
                <p className="text-white/70 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="text-white font-semibold hover:underline"
                  >
                    Sign up!
                  </button>
                </p>
              </div>
            </form>
          </div>
        </GlassSurface>
      </div>
    </PageBackground>
  )
}

export default LoginPage

