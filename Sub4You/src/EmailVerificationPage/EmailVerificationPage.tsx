import { useState } from 'react'
import PageBackground from '../components/PageBackground'
import TopBar from '../components/TopBar'
import GlassSurface from '../components/GlassSurface'

/**
 * Email Verification Page Component
 * Shows email verification status and allows resending verification email.
 */
export const EmailVerificationPage = ({
  email,
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToHome,
  onResendEmail,
}: {
  email: string
  onNavigateToLogin: () => void
  onNavigateToSignUp: () => void
  onNavigateToHome: () => void
  onResendEmail: () => void
}) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState('')

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)
    setVerificationError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      setVerificationCode(pastedData.split(''))
      setVerificationError('')
      // Focus the last input
      document.getElementById('code-5')?.focus()
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setVerificationError('Please enter a 6-digit code')
      return
    }

    setIsVerifying(true)
    setVerificationError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, this would verify the code with the backend
    // For now, we'll simulate success/failure
    const isValid = code.length === 6 // Simple validation
    if (isValid) {
      // Navigate to login on success
      onNavigateToLogin()
    } else {
      setVerificationError('Invalid verification code. Please try again.')
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    setVerificationCode(['', '', '', '', '', ''])
    setVerificationError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onResendEmail()
    setIsResending(false)
    setResendSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => setResendSuccess(false), 3000)
  }

  const isCodeComplete = verificationCode.every(digit => digit !== '')

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
    width: 500,
    height: 'auto',
  }

  return (
    <PageBackground>
      <TopBar onLoginClick={onNavigateToLogin} onSignUpClick={onNavigateToSignUp} onHomeClick={onNavigateToHome} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 pt-40 pb-20">
        <GlassSurface {...glassProps}>
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-white/70 text-sm">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-white font-semibold mt-1">{email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-2 mb-4">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-2xl font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    />
                  ))}
                </div>
                {verificationError && (
                  <p className="text-red-400 text-sm text-center mb-2">{verificationError}</p>
                )}
              </div>

              {resendSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-400 text-sm text-center">
                    Verification code sent successfully!
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleVerify}
                disabled={!isCodeComplete || isVerifying}
                className="w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white/80 font-medium transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>

              <div className="text-center mt-6">
                <p className="text-white/70 text-sm">
                  Already verified?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-white font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </PageBackground>
  )
}

export default EmailVerificationPage

