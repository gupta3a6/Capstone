import { useState, useEffect } from 'react'
import { THEME } from '../../constants/theme'
import { IoSchoolOutline, IoCalendarOutline, IoLocationOutline, IoLogoInstagram, IoClose } from "react-icons/io5"

interface SeekerViewProfileProps {
  profileId: string | number
  onClose: () => void
}

// Copy of ListerHome dummy seekers
const MOCK_SEEKERS = [
  {
    id: 1, name: 'Alice Smith', age: 20, gender: 'F', major: 'Computer Science', year: 'Junior', university: 'State University',
    budget: '800', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=5',
    bio: "Hi! I'm Alice. I'm a very cleanly and quiet CS major looking for a nice place near campus. I usually spend most of my time studying in the library or hanging out with small groups of friends.",
    lifestyle: ['Clean', 'Quiet', 'Study at Library', 'No Pets', 'Meal Plan'],
    commuteType: 'walkable', commuteMinutes: 15
  },
  {
    id: 2, name: 'Jason Lee', age: 22, gender: 'M', major: 'Business Administration', year: 'Senior', university: 'State University',
    budget: '1,000', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=11',
    bio: "Hey there! Finishing up my senior year and need a solid spot for the summer while I intern downtown. Open to pretty much anything!",
    lifestyle: ['Social', 'Gym Enthusiast', 'Cooking at Home', 'Guests Welcome'],
    commuteType: 'driving', commuteMinutes: 20
  },
  {
    id: 3, name: 'Sarah Jenkins', age: 19, gender: 'F', major: 'Nursing', year: 'Sophomore', university: 'State University',
    budget: '750', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=1',
    bio: "Nursing student here! My schedule can be a bit crazy with clinicals, so I emphasize a calm living environment.",
    lifestyle: ['Clean', 'Early Riser', 'Coffee Addict', 'No Smoking'],
    commuteType: 'transit', commuteMinutes: 30
  },
  {
    id: 4, name: 'Michael Chen', age: 21, gender: 'M', major: 'Engineering', year: 'Junior', university: 'State University',
    budget: '950', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=59',
    bio: "Engineering major. Big fan of intramural sports and gaming on the weekends. Looking for a relaxed place with good roommates.",
    lifestyle: ['Gaming', 'Intramural Sports', 'Night Owl', 'Car Owner'],
    commuteType: 'driving', commuteMinutes: 10
  },
  {
    id: 5, name: 'Emma Davis', age: 20, gender: 'F', major: 'Psychology', year: 'Junior', university: 'State University',
    budget: '850', timeline: 'Spring 2027', image: 'https://i.pravatar.cc/300?img=9',
    bio: "Love psychology and plant medicine! Trying to find a spot that is highly walkable since I don't own a car.",
    lifestyle: ['Vegetarian/Vegan', 'Pets Allowed', 'Walkable', 'Social'],
    commuteType: 'walkable', commuteMinutes: 5
  },
  {
    id: 6, name: 'David Wilson', age: 23, gender: 'M', major: 'Law', year: 'Graduate', university: 'State University',
    budget: '1,200', timeline: 'Fall 2026 - Spring 2027', image: 'https://i.pravatar.cc/300?img=60',
    bio: "First year law student. Will be buried in books most of the year so I won't be much of a disruption!",
    lifestyle: ['Study at Home', 'Quiet', 'Clean', 'No Parties'],
    commuteType: 'transit', commuteMinutes: 45
  },
  {
    id: 7, name: 'Chloe Brown', age: 21, gender: 'F', major: 'Marketing', year: 'Senior', university: 'State University',
    budget: '900', timeline: 'Summer 2026', image: 'https://i.pravatar.cc/300?img=43',
    bio: "Excited for my final summer semester! I love cooking and hosting tiny dinner get-togethers.",
    lifestyle: ['Cooking at Home', 'Social', 'Guests Welcome', 'Greek Life'],
    commuteType: 'walkable', commuteMinutes: 20
  },
  {
    id: 8, name: 'Ryan Taylor', age: 20, gender: 'M', major: 'Architecture', year: 'Sophomore', university: 'State University',
    budget: '1,100', timeline: 'Fall 2026', image: 'https://i.pravatar.cc/300?img=53',
    bio: "Living in the studio right now looking to migrate outward. I have a car and love finding fun weekend spots.",
    lifestyle: ['Car Owner', 'Social', 'Pets Allowed', 'Gym Enthusiast'],
    commuteType: 'driving', commuteMinutes: 15
  }
]

export const SeekerViewProfile = ({ profileId, onClose }: SeekerViewProfileProps) => {
  const [isPending, setIsPending] = useState(false)

  // Retrieve mock profiles natively
  const profile = MOCK_SEEKERS.find(s => s.id.toString() === profileId.toString())

  useEffect(() => {
    if (profileId) {
      const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}')
      if (stored[profileId]) setIsPending(true)
    }
  }, [profileId])

  const handleMatch = () => {
    if (isPending || !profile) return;
    
    const confirm = window.confirm(`Are you sure you want to send ${profile.name} a match request?`)
    if (confirm) {
        alert(`Congratulations! You sent a match request to ${profile.name}.`)
        setIsPending(true)
        const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}')
        stored[profile.id] = 'pending'
        localStorage.setItem('sub4you_sent_matches', JSON.stringify(stored))
    }
  }

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/20 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div 
        className="relative w-full max-w-[1100px] my-auto bg-white/40 rounded-[32px] p-6 sm:p-12 border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]" 
        onClick={(e) => e.stopPropagation()}
        style={{ backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-black/5 hover:bg-black/10 border border-black/10 rounded-full text-gray-800 transition-all shadow-sm group"
        >
          <IoClose size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex flex-col md:flex-row gap-12 pt-2">
            
          {/* Left Col: Image & Match Button */}
          <div className="w-full md:w-[35%] shrink-0 flex flex-col gap-6">
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-full aspect-[4/5] object-cover rounded-[24px] shadow-2xl border border-black/5" 
            />
            
            {isPending ? (
              <button 
                disabled
                className="w-full py-4 bg-black/5 border border-black/10 rounded-2xl font-medium text-[15px] transition-colors text-gray-500 cursor-not-allowed tracking-wide"
              >
                Match Pending Approval
              </button>
            ) : (
              <button 
                onClick={handleMatch}
                className="w-full py-4 bg-black text-white hover:bg-black/80 border border-transparent rounded-2xl font-bold text-[15px] transition-colors shadow-lg tracking-wide"
              >
                Send Match Request
              </button>
            )}
          </div>

          {/* Right Col: Details */}
          <div className="w-full md:w-[65%] flex flex-col pt-2">
            
            <div className="flex justify-between items-start mb-2 pr-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                {profile.name}, <span className="opacity-60 font-light">{profile.age}</span>
              </h1>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-gray-800 text-sm border border-black/10 font-medium">
                <IoLogoInstagram size={16} className="opacity-70" />
                @{(profile.name.split(' ')[0] + profile.id).toLowerCase()}
              </div>
            </div>
            
            <p className="text-xl text-gray-700 opacity-80 font-medium tracking-wide flex items-center gap-2 mb-10">
              {profile.major} • {profile.university}
            </p>

            <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-black mb-1.5 font-bold">Max Budget</p>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">${profile.budget}<span className="text-sm font-medium opacity-50 tracking-normal">/mo</span></p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-black mb-1.5 font-bold">Desired Move In</p>
                <p className="text-xl font-medium text-gray-800 opacity-90">{profile.timeline}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-black mb-1.5 font-bold">Commute</p>
                <p className="text-xl font-medium text-gray-800 opacity-90 capitalize">{profile.commuteType} ({profile.commuteMinutes}m)</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-black mb-1.5 font-bold">Gender Identity</p>
                <p className="text-xl font-medium text-gray-800 opacity-90">{profile.gender === 'F' ? 'Female' : profile.gender === 'M' ? 'Male' : profile.gender}</p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-black/10 to-transparent mb-10" />

            <div className="mb-10 lg:mb-auto">
              <p className="text-xs uppercase tracking-widest text-black mb-3 font-bold">About Me</p>
              <p className="text-lg leading-relaxed text-gray-800 opacity-90 font-light pr-4">
                {profile.bio}
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex flex-wrap gap-2.5">
                {profile.lifestyle.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 transition-colors border border-black/10 text-gray-800 text-[13px] font-medium tracking-wide"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerViewProfile
