import Layout from "./components/Layout";
import SeekerHome from "./Seeker/SeekerHome/SeekerHome.tsx";
import PropertyDetails from "./Seeker/PropertyDetails/PropertyDetails.tsx";
import ListerHome from "./Lister/ListerHome/ListerHome.tsx";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from './AuthPage/LoginPage/LoginPage.tsx'
import { SignUpPage } from './AuthPage/SignUpPage/SignUpPage.tsx'
import AuthHandle from './AuthPage/AuthHandle.tsx'
import { LandingPage } from './UserTypeSelection/LandingPage.tsx'
import type { NavItem } from './components/TopBar'

const seekerNavItems: NavItem[] = [
  { label: 'Home', path: '/seeker/home' },
  { label: 'Messages', path: '/messages' },
  { label: 'Matches', path: '/matches' },
  { label: 'Saved', path: '/saved' },
  { label: 'Support', path: '/help' },
]

const listerNavItems: NavItem[] = [
  { label: 'Home', path: '/lister/home' },
  { label: 'Messages', path: '/messages' },
  { label: 'My Listings', path: '/lister/listings' },
  { label: 'Support', path: '/help' },
]

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
    
    {/* Seeker Routes */}
    <Route element={<Layout isLoggedIn={isLoggedIn} onLogoutClick={onLogoutClick} navItems={seekerNavItems} />}>
      <Route path="/seeker/home" element={<SeekerHome />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      {/* Add other seeker specific routes here */}
    </Route>

    {/* Lister Routes */}
    <Route element={<Layout isLoggedIn={isLoggedIn} onLogoutClick={onLogoutClick} navItems={listerNavItems} />}>
      <Route path="/lister/home" element={<ListerHome />} />
      {/* Add other lister specific routes here */}
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
