import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUploadCloud } from 'react-icons/fi'
import { THEME } from '../../../constants/theme'

export const ListerCreateProfile = () => {
  const navigate = useNavigate()
  
  // Form State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [university, setUniversity] = useState('')
  const [major, setMajor] = useState('')
  const [year, setYear] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sub4you_lister_profile')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.photoPreview) setPhotoPreview(data.photoPreview)
        if (data.age) setAge(data.age)
        if (data.gender) setGender(data.gender)
        if (data.university) setUniversity(data.university)
        if (data.major) setMajor(data.major)
        if (data.year) setYear(data.year)
        if (data.bio) setBio(data.bio)
        if (data.instagram) setInstagram(data.instagram)
      } catch (err) {
        console.error('Error loading profile', err)
      }
    }
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!photoPreview || !age || !gender) {
      setError('Please fill out all required fields: Profile Photo, Age, and Gender.')
      return
    }
    
    setIsLoading(true)

    try {
      const profileData = {
        photoPreview,
        age,
        gender,
        university,
        major,
        year,
        bio,
        instagram,
        setupComplete: true
      }

      localStorage.setItem('sub4you_lister_profile', JSON.stringify(profileData))
      window.dispatchEvent(new Event('listerProfileUpdated'))

      setTimeout(() => {
        setIsLoading(false)
        const savedArr = localStorage.getItem('sub4you_lister_listings_array')
        const hasListings = savedArr ? JSON.parse(savedArr).length > 0 : false
        
        if (hasListings) {
          navigate('/lister/home')
        } else {
          navigate('/lister/createlisting')
        }
      }, 800)
    } catch (err) {
      setError('Failed to save profile')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-10 w-full flex items-center justify-center py-10 px-4">
      <div 
        className="w-full max-w-4xl overflow-hidden rounded-[30px]"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          border: '1px solid rgba(255, 255, 255, 0.6)'
        }}
      >
        <div className="p-10 w-full">
            <h2 className={`text-3xl font-bold ${THEME.light.classes.text} mb-2`}>Your Profile</h2>
            <p className={`${THEME.light.classes.text}/80 text-[15px] mb-10`}>View and edit your profile details below</p>
            
            <form className="space-y-10" onSubmit={handleSave}>
              {/* Profile Photo Section */}
              <div>
                <h3 className={`text-lg font-medium ${THEME.light.classes.text} mb-4`}>Profile Photo <span className="text-red-400">*</span></h3>
                <div className="flex items-center gap-6">
                  <div 
                    className="relative group w-24 h-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={handlePhotoClick}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/png, image/jpeg, image/gif" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                    />
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiUploadCloud size={24} className={THEME.light.classes.text} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      className={`w-max px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium ${THEME.light.classes.text} transition-colors backdrop-blur-sm`}
                    >
                      Upload Photo
                    </button>
                    <span className={`${THEME.light.classes.text}/60 text-xs`}>JPG, PNG or GIF (max. 5MB)</span>
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-6`}>Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-6">
                  <div>
                    <label htmlFor="age" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                      placeholder="20"
                      min="16"
                      max="120"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!gender ? 'text-white/50' : ''}`}
                        onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                      >
                        <span className="truncate">
                          {gender || 'Select gender'}
                        </span>
                        <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isGenderDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                      
                      {isGenderDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsGenderDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((option) => (
                              <div 
                                key={option} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${gender === option ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => {
                                  setGender(option)
                                  setIsGenderDropdownOpen(false)
                                }}
                              >
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="university" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      University Name
                    </label>
                    <input
                      type="text"
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                      placeholder="e.g. State University"
                    />
                  </div>
                  <div>
                    <label htmlFor="major" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Major
                    </label>
                    <input
                      type="text"
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Year
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!year ? 'text-white/50' : ''}`}
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                      >
                        <span className="truncate">
                          {year || 'Select year'}
                        </span>
                        <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                      
                      {isYearDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsYearDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'].map((option) => (
                              <div 
                                key={option} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${year === option ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => {
                                  setYear(option)
                                  setIsYearDropdownOpen(false)
                                }}
                              >
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) setBio(e.target.value)
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all resize-none`}
                    placeholder="Tell us about yourself, your hobbies, and what you're looking for..."
                  />
                  <div className="text-right mt-2 flex justify-between">
                    <span></span>
                    <span className={`${THEME.light.classes.text}/60 text-xs`}>{bio.length}/500 characters</span>
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="instagram" className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">@</span>
                    <input
                      type="text"
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className={`w-full pl-9 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              
              <div className="pt-8 flex justify-end gap-3">
                <button
                  type="submit" disabled={isLoading}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${THEME.light.classes.text} font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30`}
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default ListerCreateProfile
