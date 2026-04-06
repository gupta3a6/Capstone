import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { THEME } from '../../../constants/theme'

const AMENITIES_OPTIONS = [
  'High-Speed WiFi', 'In-Unit Washer/Dryer', 'Air Conditioning',
  'Heating', 'Parking Space', 'Gym/Fitness Center',
  'Swimming Pool', 'Pet Friendly', 'Fully Furnished',
  'Dishwasher', 'Balcony/Patio', 'Utilities Included',
  'Wheelchair Accessible', 'Elevator', 'Security System'
]

interface SeekerFilterProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export const SeekerFilter: React.FC<SeekerFilterProps> = ({ onClose, onApply, initialFilters }) => {
  // Filters State
  const [city, setCity] = useState(initialFilters?.city || '')
  const [stateCode, setStateCode] = useState(initialFilters?.stateCode || '')
  const [zipcode, setZipcode] = useState(initialFilters?.zipcode || '')
  const [minRent, setMinRent] = useState(initialFilters?.minRent || 0)
  const [maxRent, setMaxRent] = useState(initialFilters?.maxRent || 3000)
  
  const [beds, setBeds] = useState(initialFilters?.beds || '')
  const [baths, setBaths] = useState(initialFilters?.baths || '')
  const [bathroomType, setBathroomType] = useState(initialFilters?.bathroomType || '')
  const [isBathroomTypeOpen, setIsBathroomTypeOpen] = useState(false)
  const [propertyType, setPropertyType] = useState(initialFilters?.propertyType || '')
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false)
  const [genderPref, setGenderPref] = useState(initialFilters?.genderPref || '')
  const [isGenderPrefOpen, setIsGenderPrefOpen] = useState(false)
  
  const [commuteType, setCommuteType] = useState(initialFilters?.commuteType || 'walkable')
  const [commuteMinutes, setCommuteMinutes] = useState(initialFilters?.commuteMinutes || 15)
  
  const [moveInType, setMoveInType] = useState(initialFilters?.moveInType || 'semester')
  const [moveInSemesters, setMoveInSemesters] = useState<string[]>(initialFilters?.moveInSemesters || [])
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false)
  const [moveInDate, setMoveInDate] = useState(initialFilters?.moveInDate || '')
  const [moveOutDate, setMoveOutDate] = useState(initialFilters?.moveOutDate || '')
  const [leaseDuration, setLeaseDuration] = useState(initialFilters?.leaseDuration || '')
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false)
  
  const [amenities, setAmenities] = useState<string[]>(initialFilters?.amenities || [])

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

  const handleApply = () => {
    const filters = {
      city, stateCode, zipcode, minRent, maxRent, beds, baths, bathroomType, propertyType, genderPref,
      commuteType, commuteMinutes, moveInType, moveInSemesters, moveInDate, moveOutDate, leaseDuration, amenities
    }
    onApply(filters)
  }

  const handleClearAll = () => {
    setCity('')
    setStateCode('')
    setZipcode('')
    setMinRent(0)
    setMaxRent(3000)
    setBeds('')
    setBaths('')
    setBathroomType('')
    setPropertyType('')
    setGenderPref('')
    setCommuteType('walkable')
    setCommuteMinutes(15)
    setMoveInType('semester')
    setMoveInSemesters([])
    setMoveInDate('')
    setMoveOutDate('')
    setLeaseDuration('')
    setAmenities([])
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-full overflow-hidden flex flex-col rounded-[30px]"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/5 sticky top-0 z-10 hidden sm:flex">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Advanced Filters</h2>
            <p className="text-white/70 text-sm mt-1">Refine your property search</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-10 custom-scrollbar flex-1">
          
          {/* Location */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div className="sm:col-span-3">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1.5`}>City</label>
                <input
                  type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                  placeholder="e.g. Cincinnati"
                />
              </div>
              <div className="sm:col-span-1">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1.5`}>State</label>
                <input
                  type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} maxLength={2}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all uppercase`}
                  placeholder="OH"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1.5`}>Zipcode</label>
                <input
                  type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} maxLength={10}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                  placeholder="e.g. 45219"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                 <label className={`block ${THEME.light.classes.text} text-sm font-medium`}>Monthly Rent ($)</label>
                 <span className={`text-sm ${THEME.light.classes.text}`}>${minRent} - ${maxRent}</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full mt-4 flex items-center">
                <div 
                  className="absolute h-full bg-[#00A6E4] rounded-full pointer-events-none"
                  style={{ left: `${(minRent/3000)*100}%`, right: `${100 - (maxRent/3000)*100}%` }}
                />
                <input 
                  type="range" min={0} max={3000} step={50} value={minRent}
                  onChange={(e) => setMinRent(Math.min(Number(e.target.value), maxRent - 50))}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                />
                <input 
                  type="range" min={0} max={3000} step={50} value={maxRent}
                  onChange={(e) => setMaxRent(Math.max(Number(e.target.value), minRent + 50))}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/50">
                <span>$0</span>
                <span>$3000</span>
              </div>
            </div>
          </section>

          <hr className="border-white/20" />

          {/* Details */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Property Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              
              <div className="flex flex-col">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Bedrooms</label>
                <input
                  type="number" value={beds} onChange={(e) => setBeds(e.target.value)} min={0}
                  className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50`}
                  placeholder="Any"
                />
              </div>
              <div className="flex flex-col">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Bathrooms</label>
                <input
                  type="number" value={baths} onChange={(e) => setBaths(e.target.value)} min={0} step="0.5"
                  className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50`}
                  placeholder="Any"
                />
              </div>

              <div className="flex flex-col relative z-20">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Bathroom Type</label>
                <div 
                  className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!bathroomType ? 'text-white/50' : ''}`}
                  onClick={() => setIsBathroomTypeOpen(!isBathroomTypeOpen)}
                >
                  <span className="truncate">{bathroomType || 'Any'}</span>
                  <svg className={`fill-current h-4 w-4 transition-transform ${isBathroomTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
                {isBathroomTypeOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsBathroomTypeOpen(false)} />
                    <div className="absolute top-[80px] left-0 right-0 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto w-48">
                      {['Any', 'Private', 'Shared', 'En-suite', 'Other'].map((option) => (
                        <div 
                          key={option} 
                          className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${bathroomType === (option === 'Any' ? '' : option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                          onClick={() => { setBathroomType(option === 'Any' ? '' : option); setIsBathroomTypeOpen(false) }}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col relative z-10">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Property Type</label>
                <div 
                  className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!propertyType ? 'text-white/50' : ''}`}
                  onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
                >
                  <span className="truncate">{propertyType || 'Any'}</span>
                  <svg className={`fill-current h-4 w-4 transition-transform ${isPropertyTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
                {isPropertyTypeOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsPropertyTypeOpen(false)} />
                    <div className="absolute top-[80px] left-0 right-0 p-2 rounded-lg bg-white shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto w-48">
                      {['Any', 'Apartment', 'House', 'Studio', 'Private Room', 'Shared Room', 'Other'].map((option) => (
                        <div 
                          key={option} 
                          className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${propertyType === (option==='Any'?'':option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                          onClick={() => { setPropertyType(option==='Any'?'':option); setIsPropertyTypeOpen(false) }}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col relative z-0">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Gender Pref</label>
                <div 
                  className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!genderPref ? 'text-white/50' : ''}`}
                  onClick={() => setIsGenderPrefOpen(!isGenderPrefOpen)}
                >
                  <span className="truncate">{genderPref || 'Any'}</span>
                  <svg className={`fill-current h-4 w-4 transition-transform ${isGenderPrefOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
                {isGenderPrefOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsGenderPrefOpen(false)} />
                    <div className="absolute top-[80px] right-0 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto w-48">
                      {['Any', 'No Preference', 'Male Only', 'Female Only'].map((option) => (
                        <div 
                          key={option} 
                          className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${genderPref === (option==='Any'?'':option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                          onClick={() => { setGenderPref(option==='Any'?'':option); setIsGenderPrefOpen(false) }}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
            </div>
          </section>

          <hr className="border-white/20" />

          {/* Commute */}
          <section>
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
                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <label className={`block ${THEME.light.classes.text} text-sm font-medium`}>
                      Under {commuteMinutes} Minutes
                    </label>
                  </div>
                  <div className="relative h-2 bg-white/20 rounded-full mt-2 flex items-center max-w-md">
                    <div 
                      className="absolute h-full bg-[#00A6E4] rounded-full pointer-events-none"
                      style={{ left: `0%`, right: `${100 - (commuteMinutes/60)*100}%` }}
                    />
                    <input 
                      type="range" min={0} max={60} step={1} value={commuteMinutes}
                      onChange={(e) => setCommuteMinutes(Number(e.target.value))}
                      className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/50 max-w-md">
                    <span>0 min</span>
                    <span>1 hour</span>
                  </div>
                </div>
             </div>
          </section>

          <hr className="border-white/20" />

          {/* Availability */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Availability</h3>
            <div>
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
                <div className="relative mb-6 sm:max-w-md">
                  <div 
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${moveInSemesters.length === 0 ? 'text-white/50' : ''}`}
                    onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
                  >
                    <span className="truncate">
                      {moveInSemesters.length > 0 ? moveInSemesters.join(', ') : 'Any semester'}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:max-w-lg">
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move In Target</label>
                    <input
                      type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                    />
                  </div>
                  <div>
                    <label className={`block ${THEME.light.classes.text} text-[13px] mb-1.5 opacity-80`}>Move Out Exact</label>
                    <input
                      type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                    />
                  </div>
                </div>
              )}

              <div className="sm:max-w-md relative z-0">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  Lease Duration
                </label>
                <div 
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!leaseDuration ? 'text-white/50' : ''}`}
                  onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)}
                >
                  <span className="truncate">{leaseDuration || 'Any duration'}</span>
                  <svg className={`fill-current h-4 w-4 transition-transform ${isLeaseDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
                
                {isLeaseDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLeaseDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-white shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                      {['Any', '4 Months', '8 Months', '1 Year', 'Other'].map((duration) => (
                        <div 
                          key={duration} 
                          className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${leaseDuration === (duration==='Any'?'':duration) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                          onClick={() => { setLeaseDuration(duration==='Any'?'':duration); setIsLeaseDropdownOpen(false) }}
                        >
                          <span className="text-sm">{duration}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <hr className="border-white/20" />

          {/* Amenities Grid */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Required Amenities</h3>            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {AMENITIES_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
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
          </section>
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-white/20 bg-white/5 flex justify-between items-center sm:rounded-b-[30px] shrink-0">
          <button 
            onClick={handleClearAll}
            className="text-white/70 hover:text-white font-medium transition-colors px-4 py-2 border border-transparent"
          >
            Clear All
          </button>
          <div className="flex gap-4">
             <button 
               onClick={onClose}
               className="px-6 py-2.5 rounded-lg text-white border border-white/30 hover:bg-white/10 font-medium transition-all"
             >
               Cancel
             </button>
             <button 
               onClick={handleApply}
               className="px-8 py-2.5 rounded-lg bg-[#00A6E4] hover:bg-[#00A6E4]/90 text-white font-semibold shadow-lg transition-all"
             >
               Apply Filters
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
