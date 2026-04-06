import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUploadCloud } from 'react-icons/fi'
import { THEME } from '../../../constants/theme'

const LIFESTYLE_OPTIONS = [
  'No Smoking', 'Clean', 'Quiet',
  'Social', 'No Pets', 'Pets Allowed',
  'Drinking', 'No Drinking', 'Early Riser',
  'Night Owl', 'Study at Home', 'Study at Library',
  'Vegetarian/Vegan', 'Gym Enthusiast', 'Greek Life',
  'Intramural Sports', 'Parties', 'Gaming',
  'Cooking at Home', 'Meal Plan', 'Car Owner',
  'Bike Commuter', 'Guests Welcome', 'No Guests',
  '420 Friendly'
]

export const SeekerCreateProfile = () => {
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
  const [minBudget, setMinBudget] = useState(500)
  const [maxBudget, setMaxBudget] = useState(1500)
  const [commuteType, setCommuteType] = useState('walkable')
  const [commuteMinutes, setCommuteMinutes] = useState('')
  const [moveInType, setMoveInType] = useState('semester')
  const [moveInSemesters, setMoveInSemesters] = useState<string[]>([])
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false)
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false)
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [moveInDate, setMoveInDate] = useState('')
  const [moveOutDate, setMoveOutDate] = useState('')
  const [leaseDuration, setLeaseDuration] = useState('')
  const [lifestyle, setLifestyle] = useState<string[]>([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sub4you_seeker_profile')
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
        if (data.minBudget !== undefined) setMinBudget(data.minBudget)
        if (data.maxBudget !== undefined) setMaxBudget(data.maxBudget)
        if (data.commuteType) setCommuteType(data.commuteType)
        if (data.commuteMinutes) setCommuteMinutes(data.commuteMinutes)
        if (data.moveInType) setMoveInType(data.moveInType)
        if (data.moveInSemesters) setMoveInSemesters(data.moveInSemesters)
        if (data.moveInDate) setMoveInDate(data.moveInDate)
        if (data.moveOutDate) setMoveOutDate(data.moveOutDate)
        if (data.leaseDuration) setLeaseDuration(data.leaseDuration)
        if (data.lifestyle) setLifestyle(data.lifestyle)
      } catch (err) {
        console.error('Error loading profile', err)
      }
    }
  }, [])

  const handleLifestyleToggle = (option: string) => {
    setLifestyle(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const handleSemesterToggle = (option: string) => {
    setMoveInSemesters(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }
  
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
    
    let isMoveInValid = false;
    if (moveInType === 'semester') {
      isMoveInValid = moveInSemesters.length > 0;
    } else {
      isMoveInValid = !!moveInDate && !!moveOutDate;
    }

    if (!photoPreview || !age || !gender || !university || !isMoveInValid) {
      setError('Please fill out all required fields: Profile Photo, Age, Gender, University Name, and Desired Move-in.')
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
        minBudget,
        maxBudget,
        commuteType,
        commuteMinutes,
        moveInType,
        moveInSemesters,
        moveInDate,
        moveOutDate,
        leaseDuration,
        lifestyle,
        setupComplete: true
      }

      localStorage.setItem('sub4you_seeker_profile', JSON.stringify(profileData))
      window.dispatchEvent(new Event('profileUpdated'))

      setTimeout(() => {
        setIsLoading(false)
        navigate('/seeker/home') // Redirect to home for now after saving
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
                      University Name <span className="text-red-400">*</span>
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

              {/* Room Preferences Section */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-6`}>Room Preferences</h3>
                <div className="space-y-6">
                  {/* Budget */}
                  <div>
                    <div className="flex justify-between mb-2">
                       <label className={`block ${THEME.light.classes.text} text-sm font-medium`}>Budget Range ($/month) <span className="text-red-400">*</span></label>
                       <span className={`text-sm ${THEME.light.classes.text}`}>${minBudget} - ${maxBudget}</span>
                    </div>
                    <div className="relative h-2 bg-white/20 rounded-full mt-4 flex items-center">
                      <div 
                        className="absolute h-full bg-[#00A6E4] rounded-full pointer-events-none"
                        style={{ left: `${(minBudget/3000)*100}%`, right: `${100 - (maxBudget/3000)*100}%` }}
                      />
                      <input 
                        type="range" min={0} max={3000} step={50} value={minBudget}
                        onChange={(e) => setMinBudget(Math.min(Number(e.target.value), maxBudget - 50))}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                      />
                      <input 
                        type="range" min={0} max={3000} step={50} value={maxBudget}
                        onChange={(e) => setMaxBudget(Math.max(Number(e.target.value), minBudget + 50))}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/50">
                      <span>$0</span>
                      <span>$3000</span>
                    </div>
                  </div>

                  {/* Commute */}
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-3`}>
                      Max Commute to Campus
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" name="commuteType" value="walkable" 
                          checked={commuteType === 'walkable'} onChange={() => setCommuteType('walkable')}
                          className="w-4 h-4 text-[#00A6E4] bg-white/10 border-white/30 focus:ring-[#00A6E4]/50" 
                        />
                        <span className={THEME.light.classes.text}>Walkable</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" name="commuteType" value="drivable" 
                          checked={commuteType === 'drivable'} onChange={() => setCommuteType('drivable')}
                          className="w-4 h-4 text-[#00A6E4] bg-white/10 border-white/30 focus:ring-[#00A6E4]/50" 
                        />
                        <span className={THEME.light.classes.text}>Drivable</span>
                      </label>
                    </div>
                    <div>
                      <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>
                        Maximum {commuteType === 'walkable' ? 'Walkable' : 'Drivable'} Minutes
                      </label>
                      <input
                        type="number" min="0" value={commuteMinutes} onChange={(e) => setCommuteMinutes(e.target.value)}
                        placeholder="e.g. 15"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                      />
                    </div>
                  </div>

                  {/* Move-in */}
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-3`}>
                      Desired Move-in <span className="text-red-400">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" name="moveInType" value="semester" 
                          checked={moveInType === 'semester'} onChange={() => setMoveInType('semester')}
                          className="w-4 h-4 text-[#00A6E4] bg-white/10 border-white/30 focus:ring-[#00A6E4]/50" 
                        />
                        <span className={THEME.light.classes.text}>By Semester</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" name="moveInType" value="date" 
                          checked={moveInType === 'date'} onChange={() => setMoveInType('date')}
                          className="w-4 h-4 text-[#00A6E4] bg-white/10 border-white/30 focus:ring-[#00A6E4]/50" 
                        />
                        <span className={THEME.light.classes.text}>Specific Date</span>
                      </label>
                    </div>
                    
                    {moveInType === 'semester' ? (
                      <div className="relative">
                        <div 
                          className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${moveInSemesters.length === 0 ? 'text-white/50' : ''}`}
                          onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
                        >
                          <span className="truncate">
                            {moveInSemesters.length > 0 ? moveInSemesters.join(', ') : 'Select semesters'}
                          </span>
                          <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isSemesterDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                        
                        {isSemesterDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsSemesterDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                              {['Fall 2026', 'Spring 2027', 'Summer 2027', 'Fall 2027'].map((semester) => (
                                <label key={semester} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-gray-100 cursor-pointer group transition-colors">
                                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                    <input
                                      type="checkbox"
                                      checked={moveInSemesters.includes(semester)}
                                      onChange={() => handleSemesterToggle(semester)}
                                      className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#00A6E4] checked:border-[#00A6E4] transition-all cursor-pointer"
                                    />
                                    <svg 
                                      className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" 
                                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="text-gray-900 text-sm transition-colors">{semester}</span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move In Date</label>
                          <input
                            type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                          />
                        </div>
                        <div>
                          <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move Out Date</label>
                          <input
                            type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lease Duration */}
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Lease Duration
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!leaseDuration ? 'text-white/50' : ''}`}
                        onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)}
                      >
                        <span className="truncate">
                          {leaseDuration || 'Select duration'}
                        </span>
                        <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isLeaseDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                      
                      {isLeaseDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsLeaseDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['4 Months', '8 Months', '1 Year', 'Other'].map((duration) => (
                              <div 
                                key={duration} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${leaseDuration === duration ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => {
                                  setLeaseDuration(duration)
                                  setIsLeaseDropdownOpen(false)
                                }}
                              >
                                <span className="text-sm">{duration}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lifestyle Preferences Section */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-2`}>Lifestyle Preferences</h3>
                <p className={`${THEME.light.classes.text}/80 text-sm mb-6`}>Select all that apply to you</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {LIFESTYLE_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="checkbox"
                          checked={lifestyle.includes(option)}
                          onChange={() => handleLifestyleToggle(option)}
                          className="peer appearance-none w-5 h-5 border border-white/30 rounded bg-white/10 checked:bg-[#00A6E4] checked:border-[#00A6E4] transition-all cursor-pointer"
                        />
                        <svg 
                          className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`${THEME.light.classes.text} text-sm group-hover:text-white transition-colors`}>{option}</span>
                    </label>
                  ))}
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

export default SeekerCreateProfile
