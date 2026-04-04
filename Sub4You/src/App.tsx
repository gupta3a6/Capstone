import Layout from "./components/Layout";
import SeekerHome from "./Seeker/SeekerHome/SeekerHome";
import ListerHome from "./Lister/ListerHome/ListerHome";
import SeekerCreateProfile from "./Seeker/SeekerHome/seeker-profile/SeekerCreateProfile";
import Support from "./Seeker/SeekerHome/support/Support";
import Matches from "./Seeker/SeekerHome/seeker-matches/Matches";
import Messages from "./Seeker/SeekerHome/seeker-messages/Messages";
import Saved from "./Seeker/SeekerHome/seeker-saved/Saved";
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
      <Route path="/seeker/home" element={<SeekerHome />} />
      <Route path="/lister/home" element={<ListerHome />} />
      <Route path="/seeker/profile" element={<SeekerCreateProfile />} />
      <Route path="/seeker/matches" element={<Matches />} />
      <Route path="/lister/matches" element={<div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-3xl font-extrabold text-[#00A6E4]">Lister Matches (Coming Soon)</div>} />
      <Route path="/seeker/messages" element={<Messages />} />
      <Route path="/lister/messages" element={<div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-3xl font-extrabold text-[#00A6E4]">Lister Messages (Coming Soon)</div>} />
      <Route path="/seeker/saved" element={<Saved />} />
      <Route path="/support" element={<Support />} />
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
