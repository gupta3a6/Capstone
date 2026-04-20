import { useEffect, useState } from 'react'

import { useNavigate, useOutletContext } from 'react-router-dom'
import { FiFilter, FiHome } from 'react-icons/fi'
import { Carousel } from '../../components/Carousel'
import { SeekerCard } from '../../components/SeekerCard'
import SeekerViewProfile from '../../Seeker/SeekerViewProfile/SeekerViewProfile'
import { ListerFilter } from './lister-filters/ListerFilter'
import { supabase } from '../../lib/supabase'
import { getListerProperties, getSeekers } from '../../lib/api'

export const ListerHome = () => {
  const navigate = useNavigate()
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null>(null)
  
  // Connect cleanly into the Layout routing orchestrator to intercept global search text natively
  const { searchQuery, isLoggedIn } = useOutletContext<{ searchQuery?: string, isLoggedIn?: boolean }>() || {}
  const activeSearch = searchQuery?.trim().toLowerCase() || ''

  // Advanced Filtering Pipeline
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  
  const [hasListings, setHasListings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbSeekers, setDbSeekers] = useState<any[]>([]);

  useEffect(() => {
    const checkListings = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        const fetchedSeekers = await getSeekers();
        setDbSeekers(fetchedSeekers);

        if (session) {
          const dbData = await getListerProperties(session.user.id);
          setHasListings(dbData.length > 0);
        } else {
          const savedArr = localStorage.getItem('sub4you_lister_listings_array')
          setHasListings(savedArr ? JSON.parse(savedArr).length > 0 : false)
        }
      } catch (err) {
        console.error("Failed to check listings", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkListings();
  }, [])

  const searchResults = activeSearch
    ? dbSeekers.filter(s => {
        const term = activeSearch;
        return (
          (s.name && s.name.toLowerCase().includes(term)) ||
          (s.major && s.major.toLowerCase().includes(term)) ||
          (s.university && s.university.toLowerCase().includes(term)) ||
          (s.city && s.city.toLowerCase().includes(term)) ||
          (s.state && s.state.toLowerCase().includes(term)) ||
          (s.zipcode && s.zipcode.includes(term))
        );
      })
    : dbSeekers;

  let finalResults = searchResults;

  if (appliedFilters) {
    finalResults = finalResults.filter(s => {
       let ok = true;
       // We now use maxBudget provided natively as an integer from our Phase 5 Supabase DB
       if (s.maxBudget !== null && s.maxBudget !== undefined) {
         if (s.maxBudget > appliedFilters.maxBudget || s.maxBudget < appliedFilters.minBudget) ok = false;
       }
       if (appliedFilters.minAge && s.age && s.age < appliedFilters.minAge) ok = false;
       if (appliedFilters.maxAge && s.age && s.age > appliedFilters.maxAge) ok = false;
       
       let mappedMockGender = '';
       if (s.gender === 'Male' || s.gender === 'M') mappedMockGender = 'Male Only';
       if (s.gender === 'Female' || s.gender === 'F') mappedMockGender = 'Female Only';
       if (appliedFilters.genderPref && mappedMockGender && mappedMockGender !== appliedFilters.genderPref && appliedFilters.genderPref !== 'Any' && appliedFilters.genderPref !== 'No Preference') ok = false;
       
       if (appliedFilters.university && s.university && s.university !== appliedFilters.university) ok = false;
       if (appliedFilters.year && s.year && s.year !== appliedFilters.year) ok = false;
       if (appliedFilters.city && s.city && s.city.toLowerCase() !== appliedFilters.city.toLowerCase()) ok = false;
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
      {isLoggedIn && hasListings && (
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
      )}

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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm mt-10">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-6"></div>
             <p className="text-lg text-gray-600 font-medium">Loading your profile status...</p>
          </div>
        ) : (!isLoggedIn || !hasListings) ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm mt-10">
             <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <FiHome size={40} className="text-black/80" /> 
             </div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Let's list your room</h2>
             <p className="text-lg text-gray-600 font-medium mb-8 max-w-md">You need to have an active listing to view and match with students taking over leases.</p>
             <button 
               onClick={() => isLoggedIn ? navigate('/lister/createlisting') : navigate('/login')}
               className="px-8 py-4 bg-black text-white rounded-xl font-bold text-[17px] hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
             >
               {isLoggedIn ? 'Create a Listing' : 'Log in to List'}
             </button>
          </div>
        ) : (
          activeSearch || appliedFilters ? (
            finalResults.length === 0 ? (
              <div className="w-full flex justify-center items-center h-64 bg-black/5 backdrop-blur-md rounded-3xl border border-black/10">
                <p className="text-xl text-black/50 font-semibold">No students matched your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {finalResults.map((seeker: any) => (
                  <SeekerCard
                    key={seeker.id}
                    id={seeker.id}
                    name={seeker.name}
                    age={seeker.age}
                    gender={seeker.gender}
                    major={seeker.major}
                    university={seeker.university}
                    year={seeker.year}
                    budget={`$${seeker.maxBudget || 0}`}
                    timeline={`${seeker.moveInDate || ''}`}
                    imageSrc={seeker.avatar}
                    onClick={() => setSelectedProfileId(seeker.id)}
                  />
                ))}
              </div>
            )
          ) : (
          <>
            <Carousel
              items={dbSeekers}
              itemsPerPage={4}
              title="Students Actively Looking"
              renderItem={(seeker: any) => (
                <SeekerCard
                  key={seeker.id}
                  id={seeker.id}
                  name={seeker.name}
                  age={seeker.age}
                  gender={seeker.gender}
                  major={seeker.major}
                  university={seeker.university}
                  year={seeker.year}
                  budget={`$${seeker.maxBudget || 0}`}
                  timeline={`${seeker.moveInDate || ''}`}
                  imageSrc={seeker.avatar}
                  onClick={() => setSelectedProfileId(seeker.id)}
                />
              )}
            />
            
            <div className="mt-12">
              <Carousel
                items={[...dbSeekers].reverse()}
                itemsPerPage={4}
                title="Newest Seeker Profiles"
                renderItem={(seeker: any) => (
                  <SeekerCard
                    key={seeker.id}
                    id={seeker.id}
                    name={seeker.name}
                    age={seeker.age}
                    gender={seeker.gender}
                    major={seeker.major}
                    university={seeker.university}
                    year={seeker.year}
                    budget={`$${seeker.maxBudget || 0}`}
                    timeline={`${seeker.moveInDate || ''}`}
                    imageSrc={seeker.avatar}
                    onClick={() => setSelectedProfileId(seeker.id)}
                  />
                )}
              />
            </div>
          </>
          )
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
