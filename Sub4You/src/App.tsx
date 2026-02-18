import Layout from "./components/Layout";
import Home from "./Seeker/HomePage";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from './AuthPage/LoginPage/LoginPage.tsx'
import { SignUpPage } from './AuthPage/SignUpPage/SignUpPage.tsx'
import AuthHandle from './AuthPage/AuthHandle.tsx'
import { LandingPage } from './UserTypeSelection/LandingPage.tsx'

interface AppProps {
  isLoggedIn?: boolean
  onLogoutClick?: () => void
}

/**
 * Landing Page Component
 * This is the main landing page content of the Sub4You website.
 */
export const App = ({ isLoggedIn = false, onLogoutClick }: AppProps) => (
  
  <Routes>
    {/* Landing Page - Public Root */}
    <Route path="/" element={<LandingPage />} />

    {/* Main App Routes - Accessible to everyone with Layout */}
    <Route element={<Layout isLoggedIn={isLoggedIn} onLogoutClick={onLogoutClick} />}>
      <Route path="/home" element={<Home />} />
      {/* Add other main app pages here that need the TopBar */}
    </Route>

    {/* Auth Routes - Standalone with AuthHandle */}
    <Route path="/login" element={
      <AuthHandle>
        <LoginPage />
      </AuthHandle>
    } />
    <Route path="/signup" element={
      <AuthHandle>
        <SignUpPage />
      </AuthHandle>
    } />
  </Routes>

)
