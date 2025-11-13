import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import EmailVerificationPage from './EmailVerificationPage'

const AppRouter = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'email-verification'>('home')
  const [verificationEmail, setVerificationEmail] = useState('')
  
  const navigateToHome = () => setCurrentPage('home')
  const navigateToLogin = () => setCurrentPage('login')
  const navigateToSignUp = () => setCurrentPage('signup')
  const navigateToEmailVerification = (email: string) => {
    setVerificationEmail(email)
    setCurrentPage('email-verification')
  }

  const handleResendVerificationEmail = () => {
    // Simulate sending verification email
    console.log(`Sending verification email to: ${verificationEmail}`)
    // In a real app, this would call an API endpoint
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigateToSignUp={navigateToSignUp} onNavigateToLogin={navigateToLogin} onNavigateToHome={navigateToHome} />
  }

  if (currentPage === 'signup') {
    return (
      <SignUpPage 
        onNavigateToLogin={navigateToLogin} 
        onNavigateToSignUp={navigateToSignUp}
        onNavigateToHome={navigateToHome}
        onSignUpSuccess={navigateToEmailVerification}
      />
    )
  }

  if (currentPage === 'email-verification') {
    return (
      <EmailVerificationPage
        email={verificationEmail}
        onNavigateToLogin={navigateToLogin}
        onNavigateToSignUp={navigateToSignUp}
        onNavigateToHome={navigateToHome}
        onResendEmail={handleResendVerificationEmail}
      />
    )
  }

  return <App onNavigateToLogin={navigateToLogin} onNavigateToSignUp={navigateToSignUp} onNavigateToHome={navigateToHome} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
