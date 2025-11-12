import PageBackground from './components/PageBackground'
import TopBar from './components/TopBar'

/**
 * Landing Page Component
 * This is the main landing page of the Sub4You website.
 * All pages should use the PageBackground component to maintain consistent background.
 */
export const App = () => (
  <PageBackground>
    <TopBar />
  </PageBackground>
)