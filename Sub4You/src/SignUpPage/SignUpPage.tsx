import { useState } from 'react'
import GlassSurface from '../components/GlassSurface'

/**
 * Sign Up Page Component
 * A sign up page content.
 */
export const SignUpPage = ({ 
  onSignUpSuccess,
  onNavigateToLogin
}: { 
  onSignUpSuccess?: () => void
  onNavigateToLogin?: () => void
}) => {
  const [userType, setUserType] = useState<'sublease-seeker' | 'sublet-seeker' | ''>('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Password validation rules
  const passwordChecks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isPasswordValid = Object.values(passwordChecks).every(check => check)

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
              onSubmit={(e) => {
                e.preventDefault()
                if (isPasswordValid && firstName && lastName && email && userType) {
                  // In a real app, this would call an API to create the account
                  if (onSignUpSuccess) {
                    onSignUpSuccess()
                  }
                }
              }}
            >
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  I am a:
                </label>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('sublease-seeker')}
                    className={`py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                      userType === 'sublease-seeker'
                        ? 'bg-white/20 border-white/50 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>Sublease Seeker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('sublet-seeker')}
                    className={`py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                      userType === 'sublet-seeker'
                        ? 'bg-white/20 border-white/50 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Sublet Seeker</span>
                  </button>
                </div>
              </div>
              
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
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
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
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border ${
                    password && !isPasswordValid
                      ? 'border-red-400/50'
                      : password && isPasswordValid
                      ? 'border-green-400/50'
                      : 'border-white/20'
                  } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent`}
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
              
              <button
                type="submit"
                disabled={!isPasswordValid || !firstName || !lastName || !email || !userType}
                className="w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                Sign Up
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

