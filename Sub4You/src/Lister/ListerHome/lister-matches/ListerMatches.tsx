import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../../../constants/theme';
import SeekerViewProfile from '../../../Seeker/SeekerViewProfile/SeekerViewProfile';

const MOCK_SEEKERS_SYNC = [
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
];

export const ListerMatches = () => {
  const navigate = useNavigate();
  const [sentMatches, setSentMatches] = useState<Record<string, string>>({});
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}');
    setSentMatches(stored);
  }, []);

  const handleCancelMatch = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to withdraw the request?")) {
      const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}');
      delete stored[id.toString()];
      localStorage.setItem('sub4you_sent_matches', JSON.stringify(stored));
      setSentMatches(stored);
    }
  };

  const handleSimulateAccept = (e: React.MouseEvent, id: string | number) => {
      e.stopPropagation();
      const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}');
      stored[id.toString()] = "accepted";
      localStorage.setItem('sub4you_sent_matches', JSON.stringify(stored));
      setSentMatches(stored);
  };

  const handleMessageSeeker = (e: React.MouseEvent, id: string | number) => {
      e.stopPropagation();
      if (window.confirm("Would you like to send them a message?")) {
          navigate('/lister/messages', { state: { openThreadId: id } });
      }
  };

  const activeSeekers = MOCK_SEEKERS_SYNC.filter(s => Object.keys(sentMatches).includes(s.id.toString()));

  return (
    <div className={`min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col ${THEME.light.classes.text}`}>

      {/* Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold mb-1 ${THEME.light.classes.text}`}>Match Requests Outbox</h1>
          <p className={`text-sm sm:text-base opacity-80 font-medium ${THEME.light.classes.text}`}>Track the Seekers you've reached out to.</p>
        </div>
        <div className="px-5 py-2.5 rounded-full border shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <span className={`text-sm font-bold ${THEME.light.classes.text}`}>{activeSeekers.length} Sent Requests</span>
        </div>
      </div>

      {activeSeekers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-3xl border shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <h3 className={`text-2xl font-extrabold mb-2 ${THEME.light.classes.text}`}>Your Outbox is Empty</h3>
          <p className={`text-lg opacity-70 ${THEME.light.classes.text}`}>Browse Seekers on the Home page and send them Match Requests!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSeekers.map((seeker) => {
            const status = sentMatches[seeker.id.toString()];
            
            return (
              <div key={seeker.id}
                className="flex flex-col rounded-[28px] overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl cursor-pointer bg-white/10 backdrop-blur-3xl border border-white/20"
                onClick={() => setSelectedProfileId(seeker.id.toString())}
              >
                {/* Top Image */}
                <div className="h-56 w-full relative shrink-0">
                  <img
                    src={seeker.image}
                    alt={seeker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                  {status === 'pending' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-20">
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm" style={{ backgroundColor: 'rgba(255, 215, 0, 0.3)', color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.5)' }}>
                        Request Pending
                      </span>
                    </div>
                  )}

                  {status === 'accepted' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-20">
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.5)' }}>
                        Match Accepted!
                      </span>
                    </div>
                  )}

                  {status === 'declined' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-20">
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.5)' }}>
                        Match Declined
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 z-20">
                    <h2 className="text-xl font-extrabold text-white drop-shadow-md">{seeker.name}, {seeker.age}</h2>
                    <p className="text-sm font-medium text-white opacity-80">{seeker.major} at {seeker.university}</p>
                  </div>
                </div>

                {/* Bottom Card Content */}
                <div className="relative p-5 flex-1 flex flex-col z-20">
                  <div className="mb-4">
                    <p className="text-sm font-semibold opacity-60 mb-1">Max Budget</p>
                    <p className="text-lg font-black">${seeker.budget}<span className="text-xs opacity-70">/mo</span></p>
                  </div>

                  <div className="mt-auto space-y-2">
                    {status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => handleCancelMatch(e, seeker.id)}
                          className="w-full py-2 rounded-lg text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors uppercase tracking-wider mb-2"
                        >
                          Withdraw Request
                        </button>
                        <div className="flex gap-2">
                           <button onClick={(e) => handleSimulateAccept(e, seeker.id)} className="flex-1 py-1 text-xs bg-green-500/20 text-green-500 rounded font-bold border border-green-500/30">Sim Acc</button>
                        </div>
                      </>
                    )}
                    {status === 'accepted' && (
                       <button
                         onClick={(e) => handleMessageSeeker(e, seeker.id)}
                         className="w-full py-2 rounded-lg text-sm font-extrabold text-white bg-[#00A6E4] hover:bg-[#0092c9] border border-transparent transition-colors uppercase tracking-wider shadow-lg"
                       >
                         Send a message
                       </button>
                    )}
                    {status === 'declined' && (
                       <button
                         onClick={(e) => handleCancelMatch(e, seeker.id)}
                         className="w-full py-2 rounded-lg text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors uppercase tracking-wider"
                       >
                         Remove From Outbox
                       </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProfileId && (
        <SeekerViewProfile 
          profileId={selectedProfileId} 
          onClose={() => setSelectedProfileId(null)} 
        />
      )}

    </div>
  );
};

export default ListerMatches;
