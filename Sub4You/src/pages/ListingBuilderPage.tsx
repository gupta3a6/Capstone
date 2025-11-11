import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { LIFESTYLE_OPTIONS, MOVE_IN_OPTIONS } from '../data/mockData'
import { useAppFlow } from '../context/AppFlowContext'

const roomUseOptions = ['Private room', 'Shared room', 'Whole unit', 'Studio']

export const ListingBuilderPage = () => {
  const navigate = useNavigate()
  const { saveListingProfile, listingProfile } = useAppFlow()
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(listingProfile?.photos ?? [])
  const [formState, setFormState] = useState({
    headline: listingProfile?.headline ?? '',
    rent: listingProfile?.rent?.toString() ?? '',
    moveInTiming: listingProfile?.moveInTiming ?? '',
    leaseDuration: listingProfile?.leaseDuration ?? '',
    distanceFromCampus: listingProfile?.distanceFromCampus ?? '',
    address: listingProfile?.address ?? '',
    roomsTotal: listingProfile?.roomsTotal?.toString() ?? '',
    roomType: listingProfile?.roomType ?? '',
    bio: listingProfile?.bio ?? '',
    genderPreference: listingProfile?.genderPreference ?? '',
    lifestylePreferences: listingProfile?.lifestylePreferences ?? [],
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange =
    (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleLifestyleToggle = (preference: string) => {
    setFormState((prev) => {
      const next = prev.lifestylePreferences.includes(preference)
        ? prev.lifestylePreferences.filter((item) => item !== preference)
        : [...prev.lifestylePreferences, preference]
      return { ...prev, lifestylePreferences: next }
    })
  }

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    const previews: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result?.toString()
        if (result) {
          previews.push(result)
          if (previews.length === files.length) {
            setPhotoPreviews((prev) => [...prev, ...previews])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.headline || !formState.rent) {
      setError('Add a headline and rent amount to complete your listing.')
      return
    }
    saveListingProfile({
      photos: photoPreviews,
      headline: formState.headline,
      rent: formState.rent ? Number.parseInt(formState.rent, 10) : undefined,
      moveInTiming: formState.moveInTiming,
      leaseDuration: formState.leaseDuration,
      distanceFromCampus: formState.distanceFromCampus,
      address: formState.address,
      roomsTotal: formState.roomsTotal ? Number.parseInt(formState.roomsTotal, 10) : undefined,
      roomType: formState.roomType,
      bio: formState.bio,
      lifestylePreferences: formState.lifestylePreferences,
      genderPreference: formState.genderPreference,
    })
    navigate('/matches')
  }

  return (
    <div className="page">
      <TopBar showAuthActions={false} />
      <main className="content">
        <section className="card">
          <span className="badge subtle">Step 2</span>
          <h1 className="section-title">Create your listing</h1>
          <p className="section-subtitle">
            Showcase your space, highlight the essentials, and let sublease seekers know what makes
            it a great fit.
          </p>

          <form className="form vertical" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend>Basic information</legend>
              <label>
                Listing headline
                <input
                  type="text"
                  placeholder="Sunny 2-bedroom apartment near campus"
                  value={formState.headline}
                  onChange={handleChange('headline')}
                />
              </label>
              <label>
                Bio / About the space
                <textarea
                  rows={4}
                  placeholder="Share what makes your space special and what you're looking for in a subletter."
                  value={formState.bio}
                  onChange={handleChange('bio')}
                />
              </label>
            </fieldset>

            <fieldset className="fieldset grid-two">
              <legend>Room details</legend>
              <label>
                Monthly rent
                <input
                  type="number"
                  placeholder="$"
                  value={formState.rent}
                  onChange={handleChange('rent')}
                />
              </label>
              <label>
                Move-in timing
                <select value={formState.moveInTiming} onChange={handleChange('moveInTiming')}>
                  <option value="">Select a semester</option>
                  {MOVE_IN_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Lease duration
                <input
                  type="text"
                  placeholder="Aug 2025 - May 2026"
                  value={formState.leaseDuration}
                  onChange={handleChange('leaseDuration')}
                />
              </label>
              <label>
                Distance from campus
                <input
                  type="text"
                  placeholder="0.5 miles"
                  value={formState.distanceFromCampus}
                  onChange={handleChange('distanceFromCampus')}
                />
              </label>
              <label>
                Address
                <input
                  type="text"
                  placeholder="123 Campus Ave"
                  value={formState.address}
                  onChange={handleChange('address')}
                />
              </label>
              <label>
                Rooms in house
                <input
                  type="number"
                  value={formState.roomsTotal}
                  onChange={handleChange('roomsTotal')}
                />
              </label>
              <label>
                Room type
                <select value={formState.roomType} onChange={handleChange('roomType')}>
                  <option value="">Choose one</option>
                  {roomUseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>

            <fieldset className="fieldset">
              <legend>Photos</legend>
              <div className="photo-grid">
                {photoPreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Listing ${index + 1}`} />
                ))}
                <label className="photo-upload ghost-button">
                  Upload images
                  <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
                </label>
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend>Preferences</legend>
              <label>
                Gender preference (optional)
                <input
                  type="text"
                  placeholder="No preference"
                  value={formState.genderPreference}
                  onChange={handleChange('genderPreference')}
                />
              </label>
              <p className="field-label">Lifestyle preferences</p>
              <div className="chip-grid">
                {LIFESTYLE_OPTIONS.map((preference) => {
                  const selected = formState.lifestylePreferences.includes(preference)
                  return (
                    <button
                      type="button"
                      key={preference}
                      className={`chip selectable ${selected ? 'selected' : ''}`}
                      onClick={() => handleLifestyleToggle(preference)}
                    >
                      {preference}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="primary-button expanded">
              Complete profile
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
