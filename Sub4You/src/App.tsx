import Layout from "./components/Layout";
import SeekerHome from "./Seeker/SeekerHome/SeekerHome";
import ListerHome from "./Lister/ListerHome/ListerHome";
import SeekerCreateProfile from "./Seeker/SeekerHome/seeker-profile/SeekerCreateProfile";
import ListerCreateProfile from "./Lister/ListerHome/lister-createprofile/ListerCreateProfile";
import CreateListing from "./Lister/ListerHome/create-listing/CreateListing";
import MyListings from "./Lister/ListerHome/mylistings/MyListings";
import ListerMatches from "./Lister/ListerHome/lister-matches/ListerMatches";
import ListerMessages from "./Lister/ListerHome/lister-messages/ListerMessages";
import ListerSupport from "./Lister/ListerHome/lister-support/ListerSupport";
import Support from "./Seeker/SeekerHome/seeker-support/Support";
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
      <Route path="/lister/createlisting" element={<CreateListing />} />
      <Route path="/lister/mylistings" element={<MyListings />} />
      <Route path="/lister/profile" element={<ListerCreateProfile />} />
      <Route path="/seeker/profile" element={<SeekerCreateProfile />} />
      <Route path="/seeker/matches" element={<Matches />} />
      <Route path="/lister/matches" element={<ListerMatches />} />
      <Route path="/seeker/messages" element={<Messages />} />
      <Route path="/lister/messages" element={<ListerMessages />} />
      <Route path="/seeker/saved" element={<Saved />} />
      <Route path="/seeker/support" element={<Support />} />
      <Route path="/lister/support" element={<ListerSupport />} />
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
