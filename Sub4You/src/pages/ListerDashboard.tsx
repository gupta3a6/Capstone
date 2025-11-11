import { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Modal } from '../components/Modal'
import { LIFESTYLE_OPTIONS, MOCK_SEEKERS } from '../data/mockData'

const budgetBands = [
  'Any budget',
  '$600 - $800',
  '$700 - $900',
  '$800 - $1,000',
  '$900 - $1,100',
]

const matchesBudget = (desiredBudget: string, filter: string) => {
  if (filter === 'Any budget') return true
  return desiredBudget === filter
}

export const ListerDashboard = () => {
  const [budgetFilter, setBudgetFilter] = useState('Any budget')
  const [moveInFilter, setMoveInFilter] = useState('Any semester')
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([])
  const [activeSeekerId, setActiveSeekerId] = useState<string | null>(null)

  const seekers = useMemo(() => {
    return MOCK_SEEKERS.filter((seeker) => {
      const moveInMatches =
        moveInFilter === 'Any semester' ||
        seeker.preferredMoveIn.toLowerCase() === moveInFilter.toLowerCase()
      const lifestyleMatches =
        selectedLifestyle.length === 0 ||
        selectedLifestyle.every((item) => seeker.lifestylePreferences.includes(item))
      return (
        matchesBudget(seeker.desiredBudget, budgetFilter) && moveInMatches && lifestyleMatches
      )
    })
  }, [budgetFilter, moveInFilter, selectedLifestyle])

  const activeSeeker = seekers.find((seeker) => seeker.id === activeSeekerId)

  const toggleLifestyle = (preference: string) => {
    setSelectedLifestyle((prev) =>
      prev.includes(preference) ? prev.filter((item) => item !== preference) : [...prev, preference],
    )
  }

  const handleContact = (contact: string) => {
    window.alert(`We pinged ${contact} about your listing!`)
  }

  return (
    <div className="page">
      <TopBar showAuthActions={false} />
      <main className="dashboard">
        <aside className="filters">
          <h2>Filters</h2>
          <label>
            Budget
            <select value={budgetFilter} onChange={(event) => setBudgetFilter(event.target.value)}>
              {budgetBands.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </label>
          <label>
            Move-in
            <select value={moveInFilter} onChange={(event) => setMoveInFilter(event.target.value)}>
              <option value="Any semester">Any semester</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Summer 2025">Summer 2025</option>
              <option value="Fall 2025">Fall 2025</option>
              <option value="Winter 2025">Winter 2025</option>
              <option value="Specific Date">Specific Date</option>
            </select>
          </label>
          <p className="field-label">Lifestyle</p>
          <div className="chip-grid">
            {LIFESTYLE_OPTIONS.map((preference) => {
              const selected = selectedLifestyle.includes(preference)
              return (
                <button
                  type="button"
                  key={preference}
                  className={`chip selectable ${selected ? 'selected' : ''}`}
                  onClick={() => toggleLifestyle(preference)}
                >
                  {preference}
                </button>
              )
            })}
          </div>
        </aside>
        <section className="results">
          <header className="results-header">
            <h1>Students looking to sublease</h1>
            <p>{seekers.length} potential matches</p>
          </header>
          <div className="card-grid">
            {seekers.map((seeker) => (
              <article className="listing-card" key={seeker.id}>
                <div className="listing-content">
                  <h3>{seeker.name}</h3>
                  <p className="listing-meta">
                    {seeker.campusYear} · Prefers {seeker.preferredMoveIn} · Budget {seeker.desiredBudget}
                  </p>
                  <p>{seeker.bio}</p>
                  <div className="tag-row">
                    {seeker.lifestylePreferences.slice(0, 3).map((preference) => (
                      <span key={preference} className="tag">
                        {preference}
                      </span>
                    ))}
                  </div>
                  <div className="listing-actions">
                    <button className="ghost-button" onClick={() => setActiveSeekerId(seeker.id)}>
                      View profile
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => handleContact(seeker.contact)}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {seekers.length === 0 && (
              <div className="empty-state">
                <h3>No matching seekers</h3>
                <p>Update your filters to discover more potential subletters.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Modal
        isOpen={Boolean(activeSeeker)}
        onClose={() => setActiveSeekerId(null)}
        title={activeSeeker?.name}
        footer={
          activeSeeker && (
            <button className="primary-button" onClick={() => handleContact(activeSeeker.contact)}>
              Message {activeSeeker.name}
            </button>
          )
        }
      >
        {activeSeeker && (
          <div className="modal-seeker">
            <p className="listing-meta">
              {activeSeeker.campusYear} · Prefers {activeSeeker.preferredMoveIn} · Budget{' '}
              {activeSeeker.desiredBudget}
            </p>
            <p>{activeSeeker.bio}</p>
            <h4>Lifestyle preferences</h4>
            <div className="tag-row">
              {activeSeeker.lifestylePreferences.map((preference) => (
                <span key={preference} className="tag">
                  {preference}
                </span>
              ))}
            </div>
            <h4>Contact</h4>
            <p>{activeSeeker.email}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
