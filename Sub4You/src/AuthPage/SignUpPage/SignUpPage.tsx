import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassSurface from '../../components/GlassSurface'
import { supabase } from '../../lib/supabase'
import { THEME } from '@/constants/theme'

/**
 * Sign Up Page Component
 * Handles user registration with Supabase authentication.
 */
export const SignUpPage = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

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
   * Displays an error message in a styled error box
   */
  const displayError = (errorMessage: string | null) => {
    if (!errorMessage) return null
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
        <p className="text-red-400 text-sm text-center">{errorMessage}</p>
      </div>
    )
  }

  /**
   * Displays a success message in a styled success box
   */
  const displaySuccess = (successMessage: string | null) => {
    if (!successMessage) return null
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
        <p className="text-green-400 text-sm text-center">{successMessage}</p>
      </div>
    )
  }

  /**
   * Handles the signup form submission
   * Creates a new user account with Supabase
   */
  const handleSignUp = async () => {
    // Clear previous errors
    setError(null)
    setSuccess(false)

    // Validate form fields
    if (!isPasswordValid || !firstName || !lastName || !email || !confirmPassword) {
      setError('Please fill in all fields and ensure password meets requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase
      const redirectUrl = `${window.location.origin}${window.location.pathname}`
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          }
        }
      })

      // Handle errors
      if (signUpError) {
        setError(signUpError.message || 'An error occurred during signup')
        setIsLoading(false)
        return
      }

      // Success - account created
      if (data.user) {
        // If user has a session, they're automatically logged in
        if (data.session) {
          setSuccess(true)
          setTimeout(() => {
            navigate('/')
          }, 1500)
        } else {
          // Email confirmation required - show verification screen
          setNeedsEmailVerification(true)
          setVerificationEmail(email)
          localStorage.setItem('pendingEmailVerification', 'true')
          localStorage.setItem('pendingEmailVerificationEmail', email)
        }
      } else {
        setError('Account creation failed. Please try again.')
      }

      setIsLoading(false)
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

  /**
   * Listen for email verification completion
   */
  useEffect(() => {
    if (!needsEmailVerification) return

    // Listen for auth state changes to detect email verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Email verified and user is now signed in
        setNeedsEmailVerification(false)
        // Clear the pending verification flag
        localStorage.removeItem('pendingEmailVerification')
        localStorage.removeItem('pendingEmailVerificationEmail')
        navigate('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [needsEmailVerification, navigate])

  /**
   * Resend verification email
   */
  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: verificationEmail,
      })
      if (error) {
        setError('Failed to resend verification email. Please try again.')
      } else {
        setError(null)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
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

  // Email verification screen
  if (needsEmailVerification) {
    return (
      <div className="relative z-10 w-full flex items-center justify-center">
        <GlassSurface {...glassProps}>
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-16 w-16 mx-auto ${THEME.light.classes.text}/70`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold ${THEME.light.classes.text} mb-4`}>Verify Your Email</h2>
              <p className={`${THEME.light.classes.text}/70 text-sm mb-2`}>
                We've sent a verification link to
              </p>
              <p className={`${THEME.light.classes.text} font-medium mb-6`}>{verificationEmail}</p>
              <p className={`${THEME.light.classes.text}/70 text-sm mb-6`}>
                Please check your email and click the verification link to continue.
              </p>
            </div>

            {displayError(error)}
            {displaySuccess(success ? 'Verification email sent! Please check your inbox.' : null)}

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className={`w-full py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20 ${THEME.light.classes.text} font-medium transition-all duration-200 border border-white/20`}
              >
                Resend Verification Email
              </button>

              <div className="text-center">
                <p className={`${THEME.light.classes.text}/70 text-sm`}>
                  Already verified?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      // Check if user is now verified
                      supabase.auth.getSession().then(({ data: { session } }) => {
                        if (session) {
                          setNeedsEmailVerification(false)
                          navigate('/')
                        }
                      })
                    }}
                    className={`${THEME.light.classes.text} font-semibold hover:underline`}
                  >
                    Continue
                  </button>
                </p>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    )
  }

  return (
    <div className="relative z-10 w-full flex items-center justify-center">
      <GlassSurface {...glassProps}>
        <div className="p-8">
          <h2 className={`text-3xl font-bold ${THEME.light.classes.text} text-center mb-8`}>Sign Up</h2>

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Last name"
                />
              </div>
            </div>

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
                className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border ${password && !isPasswordValid
                  ? 'border-red-400/50'
                  : password && isPasswordValid
                    ? 'border-green-400/50'
                    : 'border-white/20'
                  } ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter your password"
              />

              {password && (
                <div className="mt-3 space-y-1.5">
                  <p className={`${THEME.light.classes.text}/80 text-xs font-medium mb-2`}>Password requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordChecks.minLength ? 'text-green-400' : `${THEME.light.classes.text}/60`}`}>
                      <span className={`mr-2 ${passwordChecks.minLength ? '✓' : '✗'}`}>
                        {passwordChecks.minLength ? '✓' : '✗'}
                      </span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordChecks.hasUpperCase ? 'text-green-400' : `${THEME.light.classes.text}/60`}`}>
                      <span className={`mr-2 ${passwordChecks.hasUpperCase ? '✓' : '✗'}`}>
                        {passwordChecks.hasUpperCase ? '✓' : '✗'}
                      </span>
                      One uppercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordChecks.hasLowerCase ? 'text-green-400' : `${THEME.light.classes.text}/60`}`}>
                      <span className={`mr-2 ${passwordChecks.hasLowerCase ? '✓' : '✗'}`}>
                        {passwordChecks.hasLowerCase ? '✓' : '✗'}
                      </span>
                      One lowercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordChecks.hasNumber ? 'text-green-400' : `${THEME.light.classes.text}/60`}`}>
                      <span className={`mr-2 ${passwordChecks.hasNumber ? '✓' : '✗'}`}>
                        {passwordChecks.hasNumber ? '✓' : '✗'}
                      </span>
                      One number
                    </div>
                    <div className={`flex items-center text-xs ${passwordChecks.hasSpecialChar ? 'text-green-400' : `${THEME.light.classes.text}/60`}`}>
                      <span className={`mr-2 ${passwordChecks.hasSpecialChar ? '✓' : '✗'}`}>
                        {passwordChecks.hasSpecialChar ? '✓' : '✗'}
                      </span>
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border ${confirmPassword && confirmPassword !== password
                  ? 'border-red-400/50'
                  : confirmPassword && confirmPassword === password
                    ? 'border-green-400/50'
                    : 'border-white/20'
                  } ${THEME.light.classes.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Confirm your password"
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs mt-2 ml-1">
                  Passwords need to match
                </p>
              )}
            </div>

            {displayError(error)}
            {displaySuccess(success ? 'Account created successfully! Redirecting...' : null)}

            <button
              type="submit"
              disabled={!isPasswordValid || !firstName || !lastName || !email || !confirmPassword || password !== confirmPassword || isLoading}
              className={`w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${THEME.light.classes.text} font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30`}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
              <p className={`${THEME.light.classes.text}/70 text-sm`}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className={`${THEME.light.classes.text} font-semibold hover:underline`}
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

