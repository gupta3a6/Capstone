import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AuthPlaceholder } from '../../../components/AuthPlaceholder';
import { THEME } from '../../../constants/theme';
import { SeekerPropertyDetails } from '../property-details/SeekerPropertyDetails';

interface MatchRequest {
  id: string;
  listerName: string;
  listerAvatar: string;
  propertyName: string;
  propertyImage: string;
  rent: number;
  location: string;
  status: 'pending' | 'approved' | 'denied';
  roomSpecs: string;
  amenities: string[];
}

const INITIAL_REQUESTS: MatchRequest[] = [
  {
    id: 'req_1',
    listerName: 'Sarah Jenkins',
    listerAvatar: 'https://i.pravatar.cc/150?img=32',
    propertyName: 'Sunny Downtown Loft',
    propertyImage: 'https://picsum.photos/seed/apt1/800/600',
    rent: 950,
    location: '123 Main St, Downtown',
    status: 'pending',
    roomSpecs: '1 Bed / 1 Bath in 3B2B apartment',
    amenities: ['In-unit Washer/Dryer', 'Gym', 'Pool', 'High-speed Wi-Fi'],
  },
  {
    id: 'req_2',
    listerName: 'Michael Chang',
    listerAvatar: 'https://i.pravatar.cc/150?img=11',
    propertyName: 'Quiet Campus Edge Room',
    propertyImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    rent: 700,
    location: '404 University Dr',
    status: 'pending',
    roomSpecs: 'Master Bedroom with Private Bath',
    amenities: ['Furnished', 'Utilities Included', 'Free Parking'],
  },
];

export const Matches = () => {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn?: boolean }>() || {};
  if (!isLoggedIn) return <AuthPlaceholder title="Find Your Match" message="Log in to view your property and roommate matches." />;
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MatchRequest[]>(INITIAL_REQUESTS);
  const [selectedListing, setSelectedListing] = useState<MatchRequest | null>(null);

  useEffect(() => {
    const pendingCount = requests.filter(req => req.status === 'pending').length;
    localStorage.setItem('sub4you_pending_matches', pendingCount.toString());
    window.dispatchEvent(new Event('matchesUpdated'));
  }, [requests]);

  const handleAction = (id: string, action: 'approved' | 'denied') => {
    setRequests(current =>
      current.map(req => (req.id === id ? { ...req, status: action } : req))
    );

    if (action === 'approved') {
      setTimeout(() => {
        if (window.confirm('Would you like to send a message to the lister now?')) {
          navigate('/seeker/messages');
        }
      }, 50);
    }
  };



  return (
    <div className={`min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col ${THEME.light.classes.text}`}>

      {/* Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold mb-1 ${THEME.light.classes.text}`}>Match Requests</h1>
          <p className={`text-sm sm:text-base opacity-80 font-medium ${THEME.light.classes.text}`}>These listers want you to take over their sublease.</p>
        </div>
        <div className="px-5 py-2.5 rounded-full border shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <span className={`text-sm font-bold ${THEME.light.classes.text}`}>{requests.filter(r => r.status === 'pending').length} New Requests</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-3xl border shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <h3 className={`text-2xl font-extrabold mb-2 ${THEME.light.classes.text}`}>You're all caught up!</h3>
          <p className={`text-lg opacity-70 ${THEME.light.classes.text}`}>When listers discover your profile, their requests will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id}
              className="flex flex-col rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)',
                border: '1px solid rgba(255, 255, 255, 0.6)'
              }}
            >

              {/* Top Image */}
              <div className="h-40 w-full relative shrink-0">
                <img
                  src={req.propertyImage}
                  alt={req.propertyName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                {req.status !== 'pending' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-20">
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm" style={req.status === 'approved' ? { backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.5)' } : { backgroundColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.5)' }}>
                      {req.status === 'approved' ? 'Accepted' : 'Declined'}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Card Content */}
              <div className="relative p-5 pt-8 flex-1 flex flex-col z-20">
                <div className="absolute -top-7 right-4 p-1 rounded-full shadow-md" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <img
                    src={req.listerAvatar}
                    alt={req.listerName}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                </div>

                <div className="mb-3 pr-14">
                  <h2 className={`text-lg font-bold mb-0.5 leading-tight ${THEME.light.classes.text}`}>{req.propertyName}</h2>
                  <p className={`text-xs font-medium flex items-center gap-1.5 opacity-70 ${THEME.light.classes.text}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {req.location}
                  </p>
                </div>

                <div className="border-t border-black/10 pt-3 mb-4 flex justify-between items-center mt-2">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-50 ${THEME.light.classes.text}`}>Requested By</p>
                    <p className={`text-sm font-extrabold ${THEME.light.classes.text}`}>{req.listerName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-50 ${THEME.light.classes.text}`}>Rent</p>
                    <p className={`text-lg font-black ${THEME.light.classes.text}`}>${req.rent}<span className={`text-[10px] font-semibold opacity-70 ${THEME.light.classes.text}`}>/mo</span></p>
                  </div>
                </div>

                {/* Actions pushing to the bottom */}
                <div className="mt-auto space-y-2">
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'denied'); }}
                        className="flex-1 py-1.5 rounded-lg text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'approved'); }}
                        className="flex-1 py-1.5 rounded-lg text-sm font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  <button
                    className={`w-full py-2.5 rounded-lg text-sm font-bold opacity-80 hover:opacity-100 transition-colors flex items-center justify-center gap-1.5 ${THEME.light.classes.text}`}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedListing(req); }}
                  >
                    View Description <span className="text-base leading-none transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Listing Details Modal */}
      {selectedListing && (
        <SeekerPropertyDetails
          property={{
            id: selectedListing.id,
            title: selectedListing.propertyName,
            address: selectedListing.location,
            city: 'Cincinnati',
            state: 'OH',
            zipcode: '45219',
            rent: selectedListing.rent,
            subleasePeriod: 'Duration Negotiable',
            bedrooms: 1,
            baths: 1,
            propertyType: 'Sublease Unit',
            sqft: '~500',
            genderPref: 'Any',
            commuteType: 'walk',
            commuteMinutes: '10',
            moveInDate: 'Flexible', // MatchRequest lacks availableFrom
            moveOutDate: 'Flexible',
            utilities: '0',
            description: "No specific description provided.",
            amenities: selectedListing.amenities || ['High-Speed WiFi', 'Utilities Included'],
            images: [
              selectedListing.propertyImage,
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
              'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
              'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
            ],
            hostName: selectedListing.listerName,
            hostAvatar: selectedListing.listerAvatar
          }}
          onClose={() => setSelectedListing(null)}
          onSendMessage={() => {
             setSelectedListing(null);
             navigate('/seeker/messages', { state: { createThreadWith: selectedListing.listerName, property: selectedListing } });
          }}
        />
      )}
    </div>
  );
};

export default Matches;
