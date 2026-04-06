import { useEffect, useState } from 'react'

import { useNavigate, useOutletContext } from 'react-router-dom'
import { Carousel } from '../../components/Carousel'
import { SeekerCard } from '../../components/SeekerCard'
import SeekerViewProfile from '../../Seeker/SeekerViewProfile/SeekerViewProfile'

export const ListerHome = () => {
  const navigate = useNavigate()
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null>(null)
  
  // Connect cleanly into the Layout routing orchestrator to intercept global search text natively
  const { searchQuery } = useOutletContext<{ searchQuery?: string }>() || {}
  const activeSearch = searchQuery?.trim().toLowerCase() || ''

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

  return (
    <>
      <div className="w-full min-h-screen pt-10 pb-24 px-8 max-w-[1400px] mx-auto z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
              {activeSearch ? `Search Results (${searchResults.length})` : 'Find Subtenants'}
            </h1>
            <p className="text-black/80 font-medium mt-2">
              {activeSearch ? `Results matching "${searchQuery}"` : 'Browse students actively looking for rooms.'}
            </p>
          </div>
        </div>

        {activeSearch ? (
          searchResults.length === 0 ? (
            <div className="w-full flex justify-center items-center h-64 bg-black/5 backdrop-blur-md rounded-3xl border border-black/10">
              <p className="text-xl text-black/50 font-semibold">No students matched your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((seeker) => (
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
