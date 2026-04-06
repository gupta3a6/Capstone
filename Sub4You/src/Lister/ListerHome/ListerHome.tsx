import { useEffect, useState } from 'react'

import { useNavigate, useOutletContext } from 'react-router-dom'
import { FiFilter } from 'react-icons/fi'
import { Carousel } from '../../components/Carousel'
import { SeekerCard } from '../../components/SeekerCard'
import SeekerViewProfile from '../../Seeker/SeekerViewProfile/SeekerViewProfile'
import { ListerFilter } from './lister-filters/ListerFilter'

export const ListerHome = () => {
  const navigate = useNavigate()
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null>(null)
  
  // Connect cleanly into the Layout routing orchestrator to intercept global search text natively
  const { searchQuery } = useOutletContext<{ searchQuery?: string }>() || {}
  const activeSearch = searchQuery?.trim().toLowerCase() || ''

  // Advanced Filtering Pipeline
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  useEffect(() => {
    const savedArr = localStorage.getItem('sub4you_lister_listings_array')
    const hasListings = savedArr ? JSON.parse(savedArr).length > 0 : false
    if (!hasListings) {
      navigate('/lister/createlisting')
    }
  }, [navigate])

  // Dummy Seeker Data mimicking Seeker Profile Form elements
  const exampleSeekers = [
    {
      id: 1, name: 'Alice Smith', age: 20, gender: 'F', major: 'Computer Science', university: 'University of Cincinnati', year: 'Junior',
      budget: '800', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=5', city: 'Cincinnati', state: 'OH', zipcode: '45219'
    },
    {
      id: 2, name: 'Jason Lee', age: 22, gender: 'M', major: 'Business Administration', university: 'University of Cincinnati', year: 'Senior',
      budget: '1,000', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=11', city: 'Cincinnati', state: 'OH', zipcode: '45220'
    },
    {
      id: 3, name: 'Sarah Jenkins', age: 19, gender: 'F', university: 'Xavier University',
      budget: '750', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=1', city: 'Norwood', state: 'OH', zipcode: '45212'
    },
    {
      id: 4, name: 'Michael Chen', age: 21, gender: 'M', major: 'Engineering', university: 'University of Cincinnati', year: 'Sophomore',
      budget: '950', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=59', city: 'Cincinnati', state: 'OH', zipcode: '45219'
    },
    {
      id: 5, name: 'Emma Davis', age: 20, gender: 'F', major: 'Psychology',
      budget: '850', timeline: 'Spring 2027', image: 'https://i.pravatar.cc/300?img=9', city: 'Columbus', state: 'OH', zipcode: '43210'
    },
    {
      id: 6, name: 'David Wilson', age: 23, gender: 'M', major: 'Law',
      budget: '1,200', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=60', city: 'Cincinnati', state: 'OH', zipcode: '45221'
    },
    {
      id: 7, name: 'Chloe Brown', age: 21, gender: 'F', major: 'Marketing',
      budget: '900', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=43', city: 'Dayton', state: 'OH', zipcode: '45469'
    },
    {
      id: 8, name: 'Ryan Taylor', age: 20, gender: 'M', major: 'Architecture',
      budget: '1,100', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=53', city: 'Cincinnati', state: 'OH', zipcode: '45220'
    }
  ]

  const searchResults = activeSearch
    ? exampleSeekers.filter(s => {
        const term = activeSearch;
        return (
          s.name.toLowerCase().includes(term) ||
          (s.major && s.major.toLowerCase().includes(term)) ||
          (s.university && s.university.toLowerCase().includes(term)) ||
          s.timeline.toLowerCase().includes(term) ||
          s.budget.includes(term) ||
          ((s as any).city && (s as any).city.toLowerCase().includes(term)) ||
          ((s as any).state && (s as any).state.toLowerCase().includes(term)) ||
          ((s as any).zipcode && (s as any).zipcode.includes(term))
        );
      })
    : exampleSeekers;

  let finalResults = searchResults;

  if (appliedFilters) {
    finalResults = finalResults.filter(s => {
       let ok = true;
       const budgetVal = typeof s.budget === 'string' ? parseInt(s.budget.replace(/\D/g, ''), 10) : s.budget;
       if (budgetVal !== undefined && (budgetVal > appliedFilters.maxBudget || budgetVal < appliedFilters.minBudget)) ok = false;
       if (appliedFilters.minAge && s.age < appliedFilters.minAge) ok = false;
       if (appliedFilters.maxAge && s.age > appliedFilters.maxAge) ok = false;
       
       let mappedMockGender = '';
       if (s.gender === 'M') mappedMockGender = 'Male Only';
       if (s.gender === 'F') mappedMockGender = 'Female Only';
       if (appliedFilters.genderPref && mappedMockGender && mappedMockGender !== appliedFilters.genderPref && appliedFilters.genderPref !== 'Any' && appliedFilters.genderPref !== 'No Preference') ok = false;
       
       if (appliedFilters.university && (s as any).university && (s as any).university !== appliedFilters.university) ok = false;
       if (appliedFilters.year && (s as any).year && (s as any).year !== appliedFilters.year) ok = false;
       return ok;
    });
  }

  const renderFilterPills = () => {
    if (!appliedFilters) return null;
    
    const pills = [];
    if (appliedFilters.city) pills.push(`City: ${appliedFilters.city}`);
    if (appliedFilters.university) pills.push(`${appliedFilters.university}`);
    if (appliedFilters.minBudget > 0 || appliedFilters.maxBudget < 3000) pills.push(`$${appliedFilters.minBudget} - $${appliedFilters.maxBudget}`);
    if (appliedFilters.minAge !== 17 || appliedFilters.maxAge !== 80) pills.push(`Age: ${appliedFilters.minAge}-${appliedFilters.maxAge}`);
    if (appliedFilters.genderPref && appliedFilters.genderPref !== 'Any') pills.push(`${appliedFilters.genderPref}`);
    if (appliedFilters.lifestyle && appliedFilters.lifestyle.length > 0) pills.push(`${appliedFilters.lifestyle.length} Lifestyles`);

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {pills.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium">
             {p}
          </div>
        ))}
        {pills.length > 0 && (
          <button 
            onClick={() => setAppliedFilters(null)}
            className="text-xs text-black/60 hover:text-black font-semibold underline underline-offset-2 ml-2"
          >
            Clear All
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {isFilterOpen && (
        <ListerFilter 
           initialFilters={appliedFilters}
           onClose={() => setIsFilterOpen(false)} 
           onApply={(filters) => { 
             setAppliedFilters(filters); 
             setIsFilterOpen(false); 
           }} 
        />
      )}

      {/* Persistent Filters Bar */}
      <div className="w-full px-8 pt-10 pb-2 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10 max-w-[1400px] mx-auto">
         <div className="flex-1 w-full sm:w-auto flex justify-start">
            {renderFilterPills()}
         </div>
         <button 
           onClick={() => setIsFilterOpen(true)} 
           className="flex items-center gap-2 px-6 py-2.5 bg-white/40 hover:bg-white/60 backdrop-blur-md text-black/80 rounded-full font-medium transition-all shadow-sm border border-black/5 shrink-0 ml-auto"
         >
            <FiFilter size={18} /> {appliedFilters ? 'Edit Filters' : 'Advanced Filters'}
         </button>
      </div>

      <div className="w-full min-h-screen pt-4 pb-24 px-8 max-w-[1400px] mx-auto z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
              {activeSearch || appliedFilters ? `Search Results (${finalResults.length})` : 'Find Subtenants'}
            </h1>
            <p className="text-black/80 font-medium mt-2">
              {activeSearch ? `Results matching "${searchQuery}"` : 'Browse students actively looking for rooms.'}
            </p>
          </div>
        </div>

        {activeSearch || appliedFilters ? (
          finalResults.length === 0 ? (
            <div className="w-full flex justify-center items-center h-64 bg-black/5 backdrop-blur-md rounded-3xl border border-black/10">
              <p className="text-xl text-black/50 font-semibold">No students matched your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {finalResults.map((seeker) => (
                <SeekerCard
                  key={seeker.id}
                  id={seeker.id}
                  name={seeker.name}
                  age={seeker.age}
                  gender={seeker.gender}
                  major={(seeker as any).major}
                  university={(seeker as any).university}
                  year={(seeker as any).year}
                  budget={seeker.budget}
                  timeline={seeker.timeline}
                  imageSrc={seeker.image}
                  onClick={() => setSelectedProfileId(seeker.id)}
                />
              ))}
            </div>
          )
        ) : (
          <>
            <Carousel
              items={exampleSeekers}
              itemsPerPage={4}
              title="Students Actively Looking"
              renderItem={(seeker) => (
                <SeekerCard
                  key={seeker.id}
                  id={seeker.id}
                  name={seeker.name}
                  age={seeker.age}
                  gender={seeker.gender}
                  major={(seeker as any).major}
                  university={(seeker as any).university}
                  year={(seeker as any).year}
                  budget={seeker.budget}
                  timeline={seeker.timeline}
                  imageSrc={seeker.image}
                  onClick={() => setSelectedProfileId(seeker.id)}
                />
              )}
            />
            
            <div className="mt-12">
              <Carousel
                items={[...exampleSeekers].reverse()}
                itemsPerPage={4}
                title="Newest Seeker Profiles"
                renderItem={(seeker) => (
                  <SeekerCard
                    key={seeker.id}
                    id={seeker.id}
                    name={seeker.name}
                    age={seeker.age}
                    gender={seeker.gender}
                    major={(seeker as any).major}
                    university={(seeker as any).university}
                    year={(seeker as any).year}
                    budget={seeker.budget}
                    timeline={seeker.timeline}
                    imageSrc={seeker.image}
                    onClick={() => setSelectedProfileId(seeker.id)}
                  />
                )}
              />
            </div>
          </>
        )}

      </div>

      {/* Render Pop-up Modal */}
      {selectedProfileId !== null && (
        <SeekerViewProfile 
          profileId={selectedProfileId} 
          onClose={() => setSelectedProfileId(null)} 
        />
      )}
    </>
  )
}

export default ListerHome
