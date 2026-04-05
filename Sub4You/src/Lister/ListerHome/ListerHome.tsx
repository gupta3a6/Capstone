import { useEffect, useState } from 'react'
import PageBackground from '../../components/PageBackground'
import { useNavigate } from 'react-router-dom'
import { Carousel } from '../../components/Carousel'
import { SeekerCard } from '../../components/SeekerCard'
import SeekerViewProfile from '../../Seeker/SeekerViewProfile/SeekerViewProfile'

export const ListerHome = () => {
  const navigate = useNavigate()
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null>(null)

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
      id: 1, name: 'Alice Smith', age: 20, gender: 'F', major: 'Computer Science',
      budget: '800', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=5'
    },
    {
      id: 2, name: 'Jason Lee', age: 22, gender: 'M', major: 'Business Administration',
      budget: '1,000', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=11'
    },
    {
      id: 3, name: 'Sarah Jenkins', age: 19, gender: 'F', major: 'Nursing',
      budget: '750', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      id: 4, name: 'Michael Chen', age: 21, gender: 'M', major: 'Engineering',
      budget: '950', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=59'
    },
    {
      id: 5, name: 'Emma Davis', age: 20, gender: 'F', major: 'Psychology',
      budget: '850', timeline: 'Spring 2027', image: 'https://i.pravatar.cc/300?img=9'
    },
    {
      id: 6, name: 'David Wilson', age: 23, gender: 'M', major: 'Law',
      budget: '1,200', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=60'
    },
    {
      id: 7, name: 'Chloe Brown', age: 21, gender: 'F', major: 'Marketing',
      budget: '900', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=43'
    },
    {
      id: 8, name: 'Ryan Taylor', age: 20, gender: 'M', major: 'Architecture',
      budget: '1,100', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=53'
    }
  ]

  return (
    <PageBackground>
      <div className="w-full min-h-screen pt-10 pb-24 px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Find Subtenants</h1>
            <p className="text-white/80 font-medium mt-2">Browse students actively looking for rooms.</p>
          </div>
        </div>

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
              major={seeker.major}
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
                major={seeker.major}
                budget={seeker.budget}
                timeline={seeker.timeline}
                imageSrc={seeker.image}
                onClick={() => setSelectedProfileId(seeker.id)}
              />
            )}
          />
        </div>

      </div>

      {/* Render Pop-up Modal */}
      {selectedProfileId !== null && (
        <SeekerViewProfile 
          profileId={selectedProfileId} 
          onClose={() => setSelectedProfileId(null)} 
        />
      )}
    </PageBackground>
  )
}

export default ListerHome
