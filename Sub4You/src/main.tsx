import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { App } from './App.tsx'
import { supabase, isSupabaseConfigured } from './lib/supabase'

const MissingConfig = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Configuration Missing</h1>
    <p>Please add a <code>.env</code> file to the project root with your Supabase credentials:</p>
    <pre style={{
      background: '#333',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      textAlign: 'left'
    }}>
      VITE_SUPABASE_URL=your_url_here{'\n'}
      VITE_SUPABASE_ANON_KEY=your_key_here
    </pre>
  </div>
)

const AppRouter = () => {
  if (!isSupabaseConfigured) {
    return <MissingConfig />
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const navigateToHome = () => navigate('/home')


  // Check for existing session on app load and listen for auth changes
  useEffect(() => {
    // Helper function to check if user just verified email from URL
    const checkEmailVerification = () => {
      // Check URL for email verification tokens/hashes (Supabase adds these on redirect)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')

      // If we have an access token and type is 'signup', user just verified
      if (accessToken && type === 'signup') {
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname)
        return true
      }
      return false
    }

    // Check if user has an existing session (stored in localStorage by Supabase)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)

        // Check if user just verified email (handles redirect from email link)
        const justVerified = checkEmailVerification()
        const hasPendingVerification = localStorage.getItem('pendingEmailVerification') === 'true'

        // If user has session and either just verified OR has pending verification flag, navigate to home
        if (session && (justVerified || hasPendingVerification)) {
          // Clear the pending verification flag
          localStorage.removeItem('pendingEmailVerification')
          localStorage.removeItem('pendingEmailVerificationEmail')
          // User just verified email, navigate to home
          navigateToHome()
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setIsLoggedIn(false)
      }
    }

    checkSession()

    // Listen for auth state changes (login, logout, token refresh, email verification)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)

      // Handle email verification - if user just verified their email, navigate to home
      if (event === 'SIGNED_IN' && session) {
        // Check if this is a new signup (user just verified email)
        // Check URL hash for verification tokens (Supabase adds these on redirect)
        const justVerified = checkEmailVerification()
        const hasPendingVerification = localStorage.getItem('pendingEmailVerification') === 'true'

        // If simple check passes, navigate to home
        if (justVerified || hasPendingVerification) {
          // Clear the pending verification flag
          localStorage.removeItem('pendingEmailVerification')
          localStorage.removeItem('pendingEmailVerificationEmail')
          navigateToHome()
        }
      }

      // Only redirect to home on SIGNED_OUT event, and only if not already on login/signup pages
      if (event === 'SIGNED_OUT') {
        // Optional: redirect to home or login page on sign out
        // For now, we'll redirect to home
        if (window.location.pathname !== '/' && 
            window.location.pathname !== '/login' && 
            window.location.pathname !== '/signup') {
          navigateToHome()
        }
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array - only run once on mount


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      navigate('/home', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <App isLoggedIn={isLoggedIn} onLogoutClick={handleLogout} />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)
