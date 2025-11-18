import { StrictMode, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import Layout from './components/Layout'
import { supabase } from './lib/supabase'

const AppRouter = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup'>('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const currentPageRef = useRef(currentPage)
  
  // Keep ref in sync with state
  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])
  
  const navigateToHome = () => setCurrentPage('home')
  const navigateToLogin = () => setCurrentPage('login')
  const navigateToSignUp = () => setCurrentPage('signup')
  
  // Check for existing session on app load and listen for auth changes
  useEffect(() => {
    // Check if user has an existing session (stored in localStorage by Supabase)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
      } catch (error) {
        console.error('Error checking session:', error)
        setIsLoggedIn(false)
      }
    }
    
    checkSession()
    
    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
      // Only redirect to home on SIGNED_OUT event, and only if not already on login/signup pages
      if (event === 'SIGNED_OUT') {
        const current = currentPageRef.current
        if (current !== 'home' && current !== 'login' && current !== 'signup') {
          navigateToHome()
        }
      }
    })
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array - only run once on mount
  
  const handleLogin = () => {
    // Auth state change listener will automatically update isLoggedIn
    navigateToHome()
  }
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      navigateToHome()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSignUpSuccess = (isLoggedIn: boolean) => {
    // This callback is called after successful signup
    // isLoggedIn = true: user has session (email confirmation disabled) → go to home
    // isLoggedIn = false: email confirmation required → go to login
    if (isLoggedIn) {
      setIsLoggedIn(true)
      navigateToHome()
    } else {
      navigateToLogin()
    }
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

  const handleProfileClick = () => {
    // Navigate to profile page (you can create a profile page later)
    console.log('Navigate to profile page')
    // navigateToProfile() // Add this when you create a profile page
  }

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      onLoginClick={navigateToLogin}
      onSignUpClick={navigateToSignUp}
      onHomeClick={navigateToHome}
      onProfileClick={handleProfileClick}
      onLogoutClick={handleLogout}
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
