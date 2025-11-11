import { Link, useNavigate } from 'react-router-dom'
import { useAppFlow } from '../context/AppFlowContext'

interface TopBarProps {
  showAuthActions?: boolean
  ctaLabel?: string
  onCtaClick?: () => void
}

export const TopBar = ({ showAuthActions = true, ctaLabel, onCtaClick }: TopBarProps) => {
  const navigate = useNavigate()
  const { reset } = useAppFlow()

  const handleLogoClick = () => {
    reset()
    navigate('/')
  }

  return (
    <header className="topbar">
      <button className="brand" onClick={handleLogoClick}>
        sub4you
      </button>
      {showAuthActions && (
        <nav className="topbar-actions">
          <Link className="ghost-button" to="/login">
            Log in
          </Link>
          <Link className="primary-button" to="/signup">
            Sign up
          </Link>
        </nav>
      )}
      {!showAuthActions && ctaLabel && (
        <button className="primary-button" onClick={onCtaClick}>
          {ctaLabel}
        </button>
      )}
    </header>
  )
}
