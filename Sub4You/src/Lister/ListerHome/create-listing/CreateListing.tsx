import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { THEME } from '../../../constants/theme'
import { supabase } from '../../../lib/supabase'

const AMENITIES_OPTIONS = [
  'High-Speed WiFi', 'In-Unit Washer/Dryer', 'Air Conditioning',
  'Heating', 'Parking Space', 'Gym/Fitness Center',
  'Swimming Pool', 'Pet Friendly', 'Fully Furnished',
  'Dishwasher', 'Balcony/Patio', 'Utilities Included',
  'Wheelchair Accessible', 'Elevator', 'Security System'
]

export const CreateListing = () => {
  const navigate = useNavigate()
  
  // Form State
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  
  // Basic
  const [listingTitle, setListingTitle] = useState('')
  const [address, setAddress] = useState('')
  const [rent, setRent] = useState('')
  const [utilities, setUtilities] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [isPropertyTypeDropdownOpen, setIsPropertyTypeDropdownOpen] = useState(false)
  
  // Specs & Prefs
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')
  const [bathroomType, setBathroomType] = useState('')
  const [isBathroomTypeOpen, setIsBathroomTypeOpen] = useState(false)
  const [sqft, setSqft] = useState('')
  const [genderPref, setGenderPref] = useState('')
  const [isGenderPrefOpen, setIsGenderPrefOpen] = useState(false)
  const [showBedsInfo, setShowBedsInfo] = useState(false)
  
  // Location
  const [commuteType, setCommuteType] = useState('walkable')
  const [commuteMinutes, setCommuteMinutes] = useState('')
  
  // Availability
  const [moveInType, setMoveInType] = useState('semester')
  const [moveInSemesters, setMoveInSemesters] = useState<string[]>([])
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false)
  const [moveInDate, setMoveInDate] = useState('')
  const [moveOutDate, setMoveOutDate] = useState('')
  const [leaseDuration, setLeaseDuration] = useState('')
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false)
  
  // Extra
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAmenityToggle = (option: string) => {
    setAmenities(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const handleSemesterToggle = (option: string) => {
    setMoveInSemesters(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      let sizeError = false
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) { sizeError = true; return }
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })

      if (sizeError) setError('One or more images must be less than 5MB')
      else setError(null)
    }
  }

  const removePhoto = (indexToRemove: number) => {
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsLoading(false)
        const wantsToLogin = window.confirm("Sign up / Login first to create the listing. Go to login page now?")
        if (wantsToLogin) {
          navigate('/login')
        }
        return
      }

      const listingData = { 
        photoPreviews, listingTitle, address, rent, utilities, propertyType, beds, baths, bathroomType, sqft, genderPref,
        commuteType, commuteMinutes, moveInType, moveInSemesters, moveInDate, moveOutDate,
        leaseDuration, description, amenities 
      }
      localStorage.setItem('sub4you_persisted_listing', JSON.stringify(listingData))

      setTimeout(() => {
        setIsLoading(false)
        navigate('/lister/home')
      }, 800)
    } catch (err) {
      setError('Failed to save listing')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl mb-6 ml-4">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Create a Listing</h1>
        <p className="text-white/80 font-medium text-lg mt-1">Provide details and photos for your property</p>
      </div>

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
            <form className="space-y-10" onSubmit={handleSave}>
              
              {/* Property Photos */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Listing Photos</h3>
                <p className={`${THEME.light.classes.text}/80 text-sm mb-4`}>Upload up to 5 high-quality photos of your space.</p>
                
                <div 
                  onClick={handlePhotoClick}
                  className="w-full h-32 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all mb-4"
                >
                  <input type="file" multiple ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <FiUploadCloud size={32} className={`${THEME.light.classes.text} mb-2`} />
                  <span className={`${THEME.light.classes.text} font-medium`}>Click to upload photos</span>
                  <span className={`${THEME.light.classes.text}/60 text-xs mt-1`}>(JPG, PNG max 5MB)</span>
                </div>

                {photoPreviews.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {photoPreviews.map((src, index) => (
                      <div key={index} className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden group">
                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button" onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <hr className="border-white/20" />

              {/* Basic Details Section */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-6`}>Basic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 mb-6">
                  <div className="sm:col-span-3">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Listing Title / Name</label>
                    <input
                      type="text" value={listingTitle} onChange={(e) => setListingTitle(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                      placeholder="e.g. Spacious Sunny Room in Downtown"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Street Address</label>
                    <input
                      type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                      placeholder="e.g. 123 College Ave, Apt 4"
                    />
                  </div>
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Monthly Rent ($)</label>
                    <input
                      type="number" value={rent} onChange={(e) => setRent(e.target.value)} min={0}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                      placeholder="850"
                    />
                  </div>
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Est. Utilities ($/mo)</label>
                    <input
                      type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} min={0}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Property Type</label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!propertyType ? 'text-white/50' : ''}`}
                        onClick={() => setIsPropertyTypeDropdownOpen(!isPropertyTypeDropdownOpen)}
                      >
                        <span className="truncate">{propertyType || 'Select type'}</span>
                        <svg className={`fill-current h-4 w-4 transition-transform ${isPropertyTypeDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                      {isPropertyTypeDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsPropertyTypeDropdownOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Apartment', 'House', 'Studio', 'Private Room', 'Shared Room', 'Other'].map((option) => (
                              <div 
                                key={option} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${propertyType === option ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => { setPropertyType(option); setIsPropertyTypeDropdownOpen(false) }}
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
              </div>

              {/* Layout & Preferences */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-6`}>Layout & Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Bedrooms with Info tooltip */}
                  <div className="relative flex flex-col">
                    <label className={`flex items-center gap-2 ${THEME.light.classes.text} text-sm font-medium mb-1`}>
                      Bedrooms
                      <div className="relative flex items-center justify-center">
                        <button 
                          type="button"
                          className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[10px] hover:bg-white/20 transition-all leading-none focus:outline-none focus:ring-1 focus:ring-white/80"
                          onClick={() => setShowBedsInfo(!showBedsInfo)}
                          onBlur={() => setTimeout(() => setShowBedsInfo(false), 200)}
                        >
                          i
                        </button>
                        {showBedsInfo && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-black/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl pointer-events-none">
                            <p className="text-xs text-white/90 font-medium leading-relaxed">
                              If you have a house, put the number of rooms available for sublease (not the total rooms in the house).
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                    <span className="text-xs text-white/60 mb-2 truncate">(available for sublease)</span>
                    <input
                      type="number" value={beds} onChange={(e) => setBeds(e.target.value)} min={0}
                      className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50`}
                      placeholder="e.g. 2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1`}>Bathrooms</label>
                    <span className="text-xs text-white/60 mb-2 truncate">(total accessible)</span>
                    <input
                      type="number" value={baths} onChange={(e) => setBaths(e.target.value)} min={0} step="0.5"
                      className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50`}
                      placeholder="e.g. 1.5"
                    />
                  </div>

                  {/* Bathroom Type */}
                  <div className="flex flex-col">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1`}>Bathroom Type</label>
                    <span className="text-xs text-white/60 mb-2 truncate">(accessibility)</span>
                    <div className="relative mt-auto">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!bathroomType ? 'text-white/50' : ''}`}
                        onClick={() => setIsBathroomTypeOpen(!isBathroomTypeOpen)}
                      >
                        <span className="truncate">{bathroomType || 'Select'}</span>
                        <svg className={`fill-current h-4 w-4 transition-transform ${isBathroomTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                      
                      {isBathroomTypeOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsBathroomTypeOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Private', 'Shared', 'En-suite', 'Other'].map((option) => (
                              <div 
                                key={option} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${bathroomType === option ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => { setBathroomType(option); setIsBathroomTypeOpen(false) }}
                              >
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1`}>Est. Sqft</label>
                    <span className="text-xs text-white/60 mb-2 truncate">(optional)</span>
                    <input
                      type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} min={0}
                      className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50`}
                      placeholder="e.g. 800"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1`}>Gender Preference</label>
                    <span className="text-xs text-white/60 mb-2 truncate">(roommate pref)</span>
                    <div className="relative mt-auto">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!genderPref ? 'text-white/50' : ''}`}
                        onClick={() => setIsGenderPrefOpen(!isGenderPrefOpen)}
                      >
                        <span className="truncate">{genderPref || 'Select'}</span>
                        <svg className={`fill-current h-4 w-4 transition-transform ${isGenderPrefOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                      
                      {isGenderPrefOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsGenderPrefOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['No Preference', 'Male Only', 'Female Only'].map((option) => (
                              <div 
                                key={option} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${genderPref === option ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => { setGenderPref(option); setIsGenderPrefOpen(false) }}
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
              </div>

               {/* Distance from Campus */}
               <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Distance from Campus</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
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
                      <span className={THEME.light.classes.text}>Drivable / Commuter</span>
                    </label>
                  </div>
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>
                      Estimated {commuteType === 'walkable' ? 'Walkable' : 'Drivable'} Minutes to Campus
                    </label>
                    <input
                      type="number" min="0" value={commuteMinutes} onChange={(e) => setCommuteMinutes(e.target.value)}
                      placeholder="e.g. 15"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all sm:max-w-xs`}
                    />
                  </div>
                </div>
              </div>

              {/* Availability (Seeker Pattern) */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Availability</h3>
                <div>
                  <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-3`}>
                    Desired Move-in timeline
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
                    <div className="relative mb-6">
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
                          <div className="fixed inset-0 z-40" onClick={() => setIsSemesterDropdownOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Fall 2026', 'Spring 2027', 'Summer 2027', 'Fall 2027'].map((semester) => (
                              <label key={semester} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-gray-100 cursor-pointer group transition-colors">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                  <input
                                    type="checkbox" checked={moveInSemesters.includes(semester)}
                                    onChange={() => handleSemesterToggle(semester)}
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#00A6E4] checked:border-[#00A6E4] transition-all cursor-pointer"
                                  />
                                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move In Date</label>
                        <input
                          type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                      </div>
                      <div>
                        <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move Out Date</label>
                        <input
                          type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                      Lease Duration
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!leaseDuration ? 'text-white/50' : ''}`}
                        onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)}
                      >
                        <span className="truncate">{leaseDuration || 'Select duration'}</span>
                        <svg className={`fill-current h-4 w-4 transition-transform ${isLeaseDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                      
                      {isLeaseDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsLeaseDropdownOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['Fall Semester', 'Spring Semester', 'Summer', 'Fall & Spring (Academic Year)', 'Full Calendar Year'].map((duration) => (
                              <div 
                                key={duration} 
                                className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${leaseDuration === duration ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                                onClick={() => { setLeaseDuration(duration); setIsLeaseDropdownOpen(false) }}
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

              <hr className="border-white/20" />

              {/* Amenities Grid */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-2`}>Amenities</h3>
                <p className={`${THEME.light.classes.text}/80 text-sm mb-6`}>Select all inclusive amenities or unit features</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {AMENITIES_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="checkbox"
                          checked={amenities.includes(option)}
                          onChange={() => handleAmenityToggle(option)}
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

              {/* Description */}
              <div>
                <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Description</h3>
                <textarea
                  value={description} onChange={(e) => { if (e.target.value.length <= 800) setDescription(e.target.value) }}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none`}
                  placeholder="Describe your the unit, rules, lifestyle expectations, etc."
                />
                <div className="text-right mt-2 flex justify-end">
                  <span className={`${THEME.light.classes.text}/60 text-xs`}>{description.length}/800</span>
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
                  {isLoading ? 'Publishing...' : 'Create Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
  )
}

export default CreateListing
