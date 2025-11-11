import { TopBar } from '../components/TopBar'

export const ComingSoonPage = () => {
  return (
    <div className="page">
      <TopBar />
      <main className="content single-column">
        <section className="card">
          <span className="badge subtle">Coming soon</span>
          <h1 className="section-title">Login is on the way</h1>
          <p className="section-subtitle">
            For now, explore the sublease experience by creating a new account. We can’t wait to
            welcome you back soon!
          </p>
        </section>
      </main>
    </div>
  )
}
