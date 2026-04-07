import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { THEME } from '../../../constants/theme'

const LIFESTYLE_OPTIONS = [
  'Early Bird', 'Night Owl', 'Clean & Tidy', 'Messy',
  'Occasional Drinker', '420 Friendly', 'Non-Smoker',
  'Pet Friendly', 'Quiet', 'Social', 'Introverted',
  'Extroverted', 'Vegetarian', 'Vegan', 'Gym Goer'
]

interface ListerFilterProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export const ListerFilter: React.FC<ListerFilterProps> = ({ onClose, onApply, initialFilters }) => {
  // Filters State
  const [minAge, setMinAge] = useState(initialFilters?.minAge || 17)
  const [maxAge, setMaxAge] = useState(initialFilters?.maxAge || 40)
  
  const [genderPref, setGenderPref] = useState(initialFilters?.genderPref || '')
  const [isGenderPrefOpen, setIsGenderPrefOpen] = useState(false)
  
  const [university, setUniversity] = useState(initialFilters?.university || '')
  const [isUniversityOpen, setIsUniversityOpen] = useState(false)
  
  const [year, setYear] = useState(initialFilters?.year || '')
  const [isYearOpen, setIsYearOpen] = useState(false)
  
  const [city, setCity] = useState(initialFilters?.city || '')
  const [stateCode, setStateCode] = useState(initialFilters?.stateCode || '')
  
  const [minBudget, setMinBudget] = useState(initialFilters?.minBudget || 0)
  const [maxBudget, setMaxBudget] = useState(initialFilters?.maxBudget || 3000)
  
  const [moveInType, setMoveInType] = useState(initialFilters?.moveInType || 'semester')
  const [moveInSemesters, setMoveInSemesters] = useState<string[]>(initialFilters?.moveInSemesters || [])
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false)
  const [moveInDate, setMoveInDate] = useState(initialFilters?.moveInDate || '')
  const [moveOutDate, setMoveOutDate] = useState(initialFilters?.moveOutDate || '')
  
  const [leaseDuration, setLeaseDuration] = useState(initialFilters?.leaseDuration || '')
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false)
  
  const [lifestyle, setLifestyle] = useState<string[]>(initialFilters?.lifestyle || [])

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

  const handleApply = () => {
    const filters = {
      minAge, maxAge, genderPref, university, year, city, stateCode, minBudget, maxBudget,
      moveInType, moveInSemesters, moveInDate, moveOutDate, leaseDuration, lifestyle
    }
    onApply(filters)
  }

  const handleClearAll = () => {
    setMinAge(17)
    setMaxAge(40)
    setGenderPref('')
    setUniversity('')
    setYear('')
    setCity('')
    setStateCode('')
    setMinBudget(0)
    setMaxBudget(3000)
    setMoveInType('semester')
    setMoveInSemesters([])
    setMoveInDate('')
    setMoveOutDate('')
    setLeaseDuration('')
    setLifestyle([])
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Seeker Filters</h2>
            <p className="text-white/70 text-sm mt-1">Filter potential candidates</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-10 custom-scrollbar flex-1 pb-28 sm:pb-32">
          
          {/* Candidate Profile Details */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Candidate Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="flex flex-col relative z-30">
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
                      <div className="absolute top-[80px] left-0 right-0 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto min-w-[140px]">
                        {['Any', 'No Preference', 'Male Only', 'Female Only', 'LGBTQ+ Friendly'].map((option) => (
                          <div 
                            key={option} 
                            className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${genderPref === (option === 'Any' ? '' : option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                            onClick={() => { setGenderPref(option === 'Any' ? '' : option); setIsGenderPrefOpen(false) }}
                          >
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
               </div>

               <div className="flex flex-col relative z-20">
                  <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>University</label>
                  <div 
                    className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!university ? 'text-white/50' : ''}`}
                    onClick={() => setIsUniversityOpen(!isUniversityOpen)}
                  >
                    <span className="truncate">{university || 'Any University'}</span>
                    <svg className={`fill-current h-4 w-4 transition-transform ${isUniversityOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                  {isUniversityOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUniversityOpen(false)} />
                      <div className="absolute top-[80px] left-0 right-0 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto min-w-[200px]">
                        {['Any', 'University of Cincinnati', 'Xavier University', 'Northern Kentucky University', 'Miami University', 'Other'].map((option) => (
                          <div 
                            key={option} 
                            className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${university === (option === 'Any' ? '' : option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                            onClick={() => { setUniversity(option === 'Any' ? '' : option); setIsUniversityOpen(false) }}
                          >
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
               </div>

               <div className="flex flex-col relative z-10">
                  <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>Academic Year</label>
                  <div 
                    className={`w-full mt-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} cursor-pointer flex justify-between items-center transition-all ${!year ? 'text-white/50' : ''}`}
                    onClick={() => setIsYearOpen(!isYearOpen)}
                  >
                    <span className="truncate">{year || 'Any Year'}</span>
                    <svg className={`fill-current h-4 w-4 transition-transform ${isYearOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                  {isYearOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsYearOpen(false)} />
                      <div className="absolute top-[80px] left-0 right-0 p-2 rounded-lg bg-white border border-gray-200 shadow-xl z-50 flex flex-col gap-1 max-h-60 overflow-y-auto min-w-[140px]">
                        {['Any', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Alumni/Professional'].map((option) => (
                          <div 
                            key={option} 
                            className={`flex items-center p-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${year === (option === 'Any' ? '' : option) ? 'bg-gray-50 font-medium text-[#00A6E4]' : 'text-gray-900'}`}
                            onClick={() => { setYear(option === 'Any' ? '' : option); setIsYearOpen(false) }}
                          >
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
               </div>
            </div>

            {/* Age Range Slider */}
            <div className="mt-8 max-w-lg">
              <div className="flex justify-between mb-2">
                 <label className={`block ${THEME.light.classes.text} text-sm font-medium`}>Age Range ({minAge} - {maxAge})</label>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full mt-4 flex items-center">
                <div 
                  className="absolute h-full bg-[#00A6E4] rounded-full pointer-events-none"
                  style={{ left: `${((minAge - 17)/63)*100}%`, right: `${100 - ((maxAge - 17)/63)*100}%` }}
                />
                <input 
                  type="range" min={17} max={80} step={1} value={minAge}
                  onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                />
                <input 
                  type="range" min={17} max={80} step={1} value={maxAge}
                  onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00A6E4]"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/50">
                <span>17</span>
                <span>80</span>
              </div>
            </div>
          </section>

          <hr className="border-white/20" />

          {/* Location Focus */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Target Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div className="sm:col-span-4">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1.5`}>City</label>
                <input
                  type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                  placeholder="e.g. Cincinnati"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-1.5`}>State</label>
                <input
                  type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} maxLength={2}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all uppercase`}
                  placeholder="OH"
                />
              </div>
            </div>
          </section>

          <hr className="border-white/20" />

          {/* Budget Range */}
          <section>
             <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Candidate Budget</h3>
             <div className="max-w-lg">
                <div className="flex justify-between mb-2">
                   <label className={`block ${THEME.light.classes.text} text-sm font-medium`}>Monthly Range</label>
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
          </section>

          <hr className="border-white/20" />

          {/* Availability */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Move In Timing</h3>
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
                <div className="relative mb-6 sm:max-w-md z-20">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:max-w-lg z-20 relative">
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

              <div className="sm:max-w-md relative z-10">
                <label className={`block ${THEME.light.classes.text} text-sm font-medium mb-2`}>
                  Lease Duration Preference
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
                      {['Any', '1-3 Months', '4-6 Months', '7-9 Months', '10-12 Months', '1 Year+'].map((duration) => (
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

          {/* Lifestyle Grid */}
          <section>
            <h3 className={`text-xl font-medium ${THEME.light.classes.text} mb-4`}>Lifestyle Preferences</h3>            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {LIFESTYLE_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
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
          </section>
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-white/20 bg-white/5 flex justify-between items-center sm:rounded-b-[30px] shrink-0 absolute bottom-0 w-full backdrop-blur-md">
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
