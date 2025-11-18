import { useState } from 'react'
import GlassSurface from '../components/GlassSurface'
import { supabase } from '../lib/supabase'

/**
 * Sign Up Page Component
 * Handles user registration with Supabase authentication.
 */
export const SignUpPage = ({ 
  onSignUpSuccess,
  onNavigateToLogin
}: { 
  onSignUpSuccess?: (isLoggedIn: boolean) => void
  onNavigateToLogin?: () => void
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Password validation rules
  const passwordChecks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isPasswordValid = Object.values(passwordChecks).every(check => check)

  /**
   * Handles the signup form submission
   * Creates a new user account with Supabase
   */
  const handleSignUp = async () => {
    // Clear previous errors
    setError(null)
    setSuccess(false)
    
    // Validate form fields
    if (!isPasswordValid || !firstName || !lastName || !email) {
      setError('Please fill in all fields and ensure password meets requirements')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          }
        }
      })
      
      // Handle errors
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please login instead.')
        } else {
          setError(signUpError.message || 'An error occurred during signup')
        }
        setIsLoading(false)
        return
      }
      
      // Success - account created
      if (data.user) {
        setSuccess(true)
        
        // If user has a session, they're automatically logged in (email confirmation disabled)
        // If no session, email confirmation is required
        if (data.session) {
          // User is logged in - pass true to navigate to home
          if (onSignUpSuccess) {
            setTimeout(() => {
              onSignUpSuccess(true) // true = user is logged in
            }, 1500)
          }
        } else {
          // Email confirmation required - pass false to navigate to login
          if (onSignUpSuccess) {
            setTimeout(() => {
              onSignUpSuccess(false) // false = email confirmation needed
            }, 2000)
          }
        }
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
    handleSignUp()
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
    <div className="relative z-10 min-h-screen flex items-center justify-center px-8 pt-40 pb-20">
        <GlassSurface {...glassProps}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Sign Up</h2>
            
            <form 
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-white text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-white text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
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
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border ${
                    password && !isPasswordValid
                      ? 'border-red-400/50'
                      : password && isPasswordValid
                      ? 'border-green-400/50'
                      : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your password"
                />
                
                {password && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-white/80 text-xs font-medium mb-2">Password requirements:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordChecks.minLength ? 'text-green-400' : 'text-white/60'}`}>
                        <span className={`mr-2 ${passwordChecks.minLength ? '✓' : '✗'}`}>
                          {passwordChecks.minLength ? '✓' : '✗'}
                        </span>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center text-xs ${passwordChecks.hasUpperCase ? 'text-green-400' : 'text-white/60'}`}>
                        <span className={`mr-2 ${passwordChecks.hasUpperCase ? '✓' : '✗'}`}>
                          {passwordChecks.hasUpperCase ? '✓' : '✗'}
                        </span>
                        One uppercase letter
                      </div>
                      <div className={`flex items-center text-xs ${passwordChecks.hasLowerCase ? 'text-green-400' : 'text-white/60'}`}>
                        <span className={`mr-2 ${passwordChecks.hasLowerCase ? '✓' : '✗'}`}>
                          {passwordChecks.hasLowerCase ? '✓' : '✗'}
                        </span>
                        One lowercase letter
                      </div>
                      <div className={`flex items-center text-xs ${passwordChecks.hasNumber ? 'text-green-400' : 'text-white/60'}`}>
                        <span className={`mr-2 ${passwordChecks.hasNumber ? '✓' : '✗'}`}>
                          {passwordChecks.hasNumber ? '✓' : '✗'}
                        </span>
                        One number
                      </div>
                      <div className={`flex items-center text-xs ${passwordChecks.hasSpecialChar ? 'text-green-400' : 'text-white/60'}`}>
                        <span className={`mr-2 ${passwordChecks.hasSpecialChar ? '✓' : '✗'}`}>
                          {passwordChecks.hasSpecialChar ? '✓' : '✗'}
                        </span>
                        One special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-400 text-sm text-center">
                    Account created successfully! Redirecting...
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!isPasswordValid || !firstName || !lastName || !email || isLoading}
                className="w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-white/70 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-white font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </GlassSurface>
      </div>
  )
}

export default SignUpPage

