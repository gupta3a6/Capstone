import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { LIFESTYLE_OPTIONS, MOVE_IN_OPTIONS } from '../data/mockData'
import { useAppFlow } from '../context/AppFlowContext'

const roomTypeOptions = ['Private room', 'Shared room', 'Studio']
const amenityOptions = ['In-unit laundry', 'Parking', 'Gym access', 'Study lounge', 'Pet friendly']

export const ProfileBuilderPage = () => {
  const navigate = useNavigate()
  const { saveSeekerProfile, seekerProfile } = useAppFlow()
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(seekerProfile?.avatar)
  const [formState, setFormState] = useState({
    age: seekerProfile?.age ?? '',
    gender: seekerProfile?.gender ?? '',
    major: seekerProfile?.major ?? '',
    year: seekerProfile?.year ?? '',
    bio: seekerProfile?.bio ?? '',
    budgetMin: seekerProfile?.budgetRange?.min?.toString() ?? '',
    budgetMax: seekerProfile?.budgetRange?.max?.toString() ?? '',
    distanceFromCampus: seekerProfile?.distanceFromCampus ?? '',
    moveInTiming: seekerProfile?.moveInTiming ?? '',
    leaseDuration: seekerProfile?.leaseDuration ?? '',
    roomType: seekerProfile?.roomPreferences?.roomType ?? '',
    amenities: seekerProfile?.roomPreferences?.amenities ?? [],
    lifestylePreferences: seekerProfile?.lifestylePreferences ?? [],
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAmenitiesToggle = (amenity: string) => {
    setFormState((prev) => {
      const next = prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities: next }
    })
  }

  const handleLifestyleToggle = (preference: string) => {
    setFormState((prev) => {
      const next = prev.lifestylePreferences.includes(preference)
        ? prev.lifestylePreferences.filter((item) => item !== preference)
        : [...prev.lifestylePreferences, preference]
      return { ...prev, lifestylePreferences: next }
    })
  }

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result?.toString()
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.bio || !formState.moveInTiming) {
      setError('Add a short bio and move-in timing to complete your profile.')
      return
    }
    saveSeekerProfile({
      avatar: avatarPreview,
      age: formState.age,
      gender: formState.gender,
      major: formState.major,
      year: formState.year,
      bio: formState.bio,
      budgetRange: {
        min: formState.budgetMin ? Number.parseInt(formState.budgetMin, 10) : undefined,
        max: formState.budgetMax ? Number.parseInt(formState.budgetMax, 10) : undefined,
      },
      distanceFromCampus: formState.distanceFromCampus,
      moveInTiming: formState.moveInTiming,
      leaseDuration: formState.leaseDuration,
      lifestylePreferences: formState.lifestylePreferences,
      roomPreferences: {
        roomType: formState.roomType,
        amenities: formState.amenities,
      },
    })
    navigate('/discover')
  }

  return (
    <div className="page">
      <TopBar showAuthActions={false} />
      <main className="content">
        <section className="card">
          <span className="badge subtle">Step 2</span>
          <h1 className="section-title">Build your seeker profile</h1>
          <p className="section-subtitle">
            Help us find your best match. Share who you are, what you need, and how you live.
          </p>
          <form className="form vertical" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend>Profile photo</legend>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" />
                  ) : (
                    <span className="avatar-placeholder">Upload</span>
                  )}
                </div>
                <label className="ghost-button">
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
                </label>
              </div>
            </fieldset>

            <fieldset className="fieldset grid-two">
              <legend>Basic information</legend>
              <label>
                Age
                <input type="number" value={formState.age} onChange={handleChange('age')} />
              </label>
              <label>
                Gender
                <input type="text" value={formState.gender} onChange={handleChange('gender')} />
              </label>
              <label>
                Major
                <input type="text" value={formState.major} onChange={handleChange('major')} />
              </label>
              <label>
                Year
                <input type="text" value={formState.year} onChange={handleChange('year')} />
              </label>
              <label className="full-width">
                Bio
                <textarea
                  rows={4}
                  placeholder="Share a bit about yourself, your schedule, and what matters in a roommate."
                  value={formState.bio}
                  onChange={handleChange('bio')}
                />
              </label>
            </fieldset>

            <fieldset className="fieldset grid-two">
              <legend>Room preferences</legend>
              <label>
                Budget min
                <input
                  type="number"
                  placeholder="$"
                  value={formState.budgetMin}
                  onChange={handleChange('budgetMin')}
                />
              </label>
              <label>
                Budget max
                <input
                  type="number"
                  placeholder="$"
                  value={formState.budgetMax}
                  onChange={handleChange('budgetMax')}
                />
              </label>
              <label>
                Distance from campus
                <input
                  type="text"
                  placeholder="ex. within 1 mile"
                  value={formState.distanceFromCampus}
                  onChange={handleChange('distanceFromCampus')}
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
                  placeholder="Fall 2025 - Spring 2026"
                  value={formState.leaseDuration}
                  onChange={handleChange('leaseDuration')}
                />
              </label>
              <label>
                Preferred room type
                <select value={formState.roomType} onChange={handleChange('roomType')}>
                  <option value="">Select one</option>
                  {roomTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div className="full-width">
                <p className="field-label">Amenities</p>
                <div className="chip-row">
                  {amenityOptions.map((option) => {
                    const selected = formState.amenities.includes(option)
                    return (
                      <button
                        type="button"
                        key={option}
                        className={`chip selectable ${selected ? 'selected' : ''}`}
                        onClick={() => handleAmenitiesToggle(option)}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend>Lifestyle preferences</legend>
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
