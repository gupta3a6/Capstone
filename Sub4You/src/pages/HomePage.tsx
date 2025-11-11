import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { useAppFlow } from '../context/AppFlowContext'

export const HomePage = () => {
  const navigate = useNavigate()
  const { setIntent } = useAppFlow()

  const handleNavigate = (intent: 'find' | 'offer') => {
    setIntent(intent)
    navigate(`/signup?intent=${intent}`)
  }

  return (
    <div className="page gradient-background">
      <TopBar />
      <main className="hero">
        <div className="hero-content">
          <span className="badge">Student Subleasing Made Simple</span>
          <h1 className="hero-title">
            Find your next campus space or the perfect person to sublet your room.
          </h1>
          <p className="hero-subtitle">
            Sub4You connects students who need a sublease with those offering one — fast, secure,
            and curated for student life.
          </p>
          <div className="hero-actions">
            <button className="pill-button" onClick={() => handleNavigate('find')}>
              I want to sublease a room
            </button>
            <button className="pill-button secondary" onClick={() => handleNavigate('offer')}>
              I need a sublease for my room
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
