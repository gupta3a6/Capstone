import { Link } from 'react-router-dom'
import { TopBar } from '../components/TopBar'

export const NotFoundPage = () => (
  <div className="page">
    <TopBar />
    <main className="content single-column">
      <section className="card">
        <span className="badge subtle">404</span>
        <h1 className="section-title">We couldn’t find that page</h1>
        <p className="section-subtitle">
          The page you’re looking for may have moved. Head back to the homepage to continue
          exploring Sub4You.
        </p>
        <Link className="primary-button inline" to="/">
          Go home
        </Link>
      </section>
    </main>
  </div>
)
