import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AccountSetupPage } from './pages/AccountSetupPage'
import { ProfileBuilderPage } from './pages/ProfileBuilderPage'
import { ListingBuilderPage } from './pages/ListingBuilderPage'
import { SeekerDashboard } from './pages/SeekerDashboard'
import { ListerDashboard } from './pages/ListerDashboard'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<AccountSetupPage />} />
        <Route path="/profile-builder" element={<ProfileBuilderPage />} />
        <Route path="/listing-builder" element={<ListingBuilderPage />} />
        <Route path="/discover" element={<SeekerDashboard />} />
        <Route path="/matches" element={<ListerDashboard />} />
        <Route path="/login" element={<ComingSoonPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}