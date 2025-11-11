import { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Modal } from '../components/Modal'
import { MOCK_LISTINGS, LIFESTYLE_OPTIONS } from '../data/mockData'

const budgetFilters = ['Any budget', 'Under $800', 'Under $1,000', 'Under $1,200']
const distanceFilters = ['Any distance', 'Within 0.5 miles', 'Within 1 mile', 'Within 2 miles']

const parseDistance = (value?: string) => {
  if (!value) return Number.POSITIVE_INFINITY
  const match = value.match(/([\d.]+)/)
  if (!match) return Number.POSITIVE_INFINITY
  return Number.parseFloat(match[1])
}

const satisfiesBudget = (rent: number | undefined, filter: string) => {
  if (!rent) return true
  switch (filter) {
    case 'Under $800':
      return rent < 800
    case 'Under $1,000':
      return rent < 1000
    case 'Under $1,200':
      return rent < 1200
    default:
      return true
  }
}

const satisfiesDistance = (distance: string | undefined, filter: string) => {
  const miles = parseDistance(distance)
  switch (filter) {
    case 'Within 0.5 miles':
      return miles <= 0.5
    case 'Within 1 mile':
      return miles <= 1
    case 'Within 2 miles':
      return miles <= 2
    default:
      return true
  }
}

export const SeekerDashboard = () => {
  const [budgetFilter, setBudgetFilter] = useState('Any budget')
  const [distanceFilter, setDistanceFilter] = useState('Any distance')
  const [moveInFilter, setMoveInFilter] = useState('Any semester')
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([])
  const [activeListingId, setActiveListingId] = useState<string | null>(null)

  const listings = useMemo(() => {
    return MOCK_LISTINGS.filter((listing) => {
      const moveInMatches =
        moveInFilter === 'Any semester' ||
        listing.moveInTiming?.toLowerCase() === moveInFilter.toLowerCase()
      const lifestyleMatches =
        selectedLifestyle.length === 0 ||
        selectedLifestyle.every((item) => listing.lifestylePreferences.includes(item))
      return (
        satisfiesBudget(listing.rent, budgetFilter) &&
        satisfiesDistance(listing.distanceFromCampus, distanceFilter) &&
        moveInMatches &&
        lifestyleMatches
      )
    })
  }, [budgetFilter, distanceFilter, moveInFilter, selectedLifestyle])

  const activeListing = listings.find((listing) => listing.id === activeListingId)

  const toggleLifestyle = (preference: string) => {
    setSelectedLifestyle((prev) =>
      prev.includes(preference) ? prev.filter((item) => item !== preference) : [...prev, preference],
    )
  }

  const handleContact = (contact: string) => {
    window.alert(`We let ${contact} know you are interested!`)
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
              {budgetFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Distance
            <select
              value={distanceFilter}
              onChange={(event) => setDistanceFilter(event.target.value)}
            >
              {distanceFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
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
            <h1>Available subleases</h1>
            <p>{listings.length} matches based on your preferences</p>
          </header>
          <div className="card-grid">
            {listings.map((listing) => (
              <article key={listing.id} className="listing-card">
                <div className="listing-photo">
                  <img
                    src={
                      listing.photos[0] ??
                      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={listing.title}
                  />
                </div>
                <div className="listing-content">
                  <h3>{listing.title}</h3>
                  <p className="listing-meta">
                    ${listing.rent} · {listing.distanceFromCampus} · {listing.moveInTiming}
                  </p>
                  <p>{listing.bio}</p>
                  <div className="tag-row">
                    {listing.lifestylePreferences.slice(0, 3).map((preference) => (
                      <span key={preference} className="tag">
                        {preference}
                      </span>
                    ))}
                  </div>
                  <div className="listing-actions">
                    <button
                      className="ghost-button"
                      onClick={() => setActiveListingId(listing.id)}
                    >
                      View details
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => handleContact(listing.contact)}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {listings.length === 0 && (
              <div className="empty-state">
                <h3>No matches yet</h3>
                <p>Try adjusting your filters to see more available subleases.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Modal
        isOpen={Boolean(activeListing)}
        onClose={() => setActiveListingId(null)}
        title={activeListing?.title}
        footer={
          activeListing && (
            <button className="primary-button" onClick={() => handleContact(activeListing.contact)}>
              Message {activeListing.landlordName}
            </button>
          )
        }
      >
        {activeListing && (
          <div className="modal-listing">
            <img
              src={
                activeListing.photos[0] ??
                'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80'
              }
              alt={activeListing.title}
            />
            <p className="listing-meta">
              ${activeListing.rent} · {activeListing.distanceFromCampus} · {activeListing.leaseDuration}
            </p>
            <p>{activeListing.bio}</p>
            <h4>Location</h4>
            <p>{activeListing.address}</p>
            <h4>Lifestyle preferences</h4>
            <div className="tag-row">
              {activeListing.lifestylePreferences.map((preference) => (
                <span key={preference} className="tag">
                  {preference}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
