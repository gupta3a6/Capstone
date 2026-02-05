import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassSurface from '../../components/GlassSurface'
import { supabase } from '../../lib/supabase'
import { THEME } from '../../constants/theme'

/**
 * Login Page Component
 * Handles user authentication with Supabase.
 */
export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Check if user is already logged in and redirect if so
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in, redirect to home and replace history
        navigate('/', { replace: true })
      }
    }
    
    checkSession()
  }, [navigate])
  
  /**
   * Handles the login form submission
   * Authenticates user with Supabase
   */
  const handleLogin = async () => {
    // Clear previous errors and success
    setError(null)
    setSuccess(false)
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      // Handle errors
      if (signInError) {
        // Handle specific error cases
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in.')
        } else {
          setError(signInError.message || 'An error occurred during login')
        }
        setIsLoading(false)
        return
      }
      
      // Success - user is logged in
      if (data.user) {
        setSuccess(true)
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }
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
    <div className="relative z-10 w-full flex items-center justify-center">
        <GlassSurface {...glassProps}>
          <div className="p-8">
            <h2 className={`text-3xl font-bold ${THEME.light.classes.text} text-center mb-8`}>Login</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your password"
                />
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-400 text-sm text-center">
                    Login successful! Redirecting...
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${THEME.light.classes.text} font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              
              <div className="text-center mt-4">
                <p className={`${THEME.light.classes.text}/70 text-sm`}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className={`${THEME.light.classes.text} font-semibold hover:underline`}
                  >
                    Sign up!
                  </button>
                </p>
              </div>
            </form>
          </div>
        </GlassSurface>
      </div>
  )
}

export default LoginPage

