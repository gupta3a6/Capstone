import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import Layout from './components/Layout'

const AppRouter = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup'>('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const navigateToHome = () => setCurrentPage('home')
  const navigateToLogin = () => setCurrentPage('login')
  const navigateToSignUp = () => setCurrentPage('signup')
  
  const handleLogin = () => {
    setIsLoggedIn(true)
    navigateToHome()
  }
  
  const handleLogout = () => {
    setIsLoggedIn(false)
    navigateToHome()
  }

  const handleSignUpSuccess = () => {
    // After successful signup, navigate to login page
    navigateToLogin()
  }

  // Render content based on current page
  let pageContent
  if (currentPage === 'login') {
    pageContent = <LoginPage onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLogin} />
  } else if (currentPage === 'signup') {
    pageContent = <SignUpPage onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={navigateToLogin} />
  } else {
    pageContent = <App />
  }

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      onLoginClick={navigateToLogin}
      onSignUpClick={navigateToSignUp}
      onHomeClick={navigateToHome}
    >
      {pageContent}
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
