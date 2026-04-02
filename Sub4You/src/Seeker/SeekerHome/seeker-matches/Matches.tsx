import { useState } from 'react';
import { THEME } from '../../../constants/theme';

interface MatchRequest {
  id: string;
  listerName: string;
  propertyName: string;
  rent: number;
  location: string;
  status: 'pending' | 'approved' | 'denied';
  roomSpecs: string;
  amenities: string[];
}

// Dummy data for match requests
const INITIAL_REQUESTS: MatchRequest[] = [
  {
    id: 'req_1',
    listerName: 'Sarah Jenkins',
    propertyName: 'Sunny Downtown Loft',
    rent: 950,
    location: '123 Main St, Downtown',
    status: 'pending',
    roomSpecs: '1 Bed / 1 Bath in 3B2B apartment',
    amenities: ['In-unit Washer/Dryer', 'Gym', 'Pool', 'High-speed Wi-Fi'],
  },
  {
    id: 'req_2',
    listerName: 'Michael Chang',
    propertyName: 'Quiet Campus Edge Room',
    rent: 700,
    location: '404 University Dr',
    status: 'pending',
    roomSpecs: 'Master Bedroom with Private Bath',
    amenities: ['Furnished', 'Utilities Included', 'Free Parking'],
  },
];

export const Matches = () => {
  const [requests, setRequests] = useState<MatchRequest[]>(INITIAL_REQUESTS);
  const [selectedListing, setSelectedListing] = useState<MatchRequest | null>(null);

  const handleAction = (id: string, action: 'approved' | 'denied') => {
    setRequests(current =>
      current.map(req => (req.id === id ? { ...req, status: action } : req))
    );
  };

  const getStatusBadge = (status: MatchRequest['status']) => {
    if (status === 'approved') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">Approved</span>;
    if (status === 'denied') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">Denied</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Pending</span>;
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] py-12 px-4 sm:px-8 max-w-6xl mx-auto ${THEME.light.classes.text}`}>
      
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold mb-3">Match Requests</h1>
        <p className="text-lg opacity-80">Review requests from Listers who want you as a roommate!</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl">
          <p className="text-xl opacity-70">No match requests right now. Keep exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                    {req.listerName}
                  </h2>
                  {getStatusBadge(req.status)}
                </div>
                
                <p className="text-sm opacity-90 mb-6 font-medium bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="font-bold">"{req.listerName}"</span> has requested to match with you! They want you to take a look at their listing.
                </p>

                <div className="space-y-2 mb-6 opacity-80 text-sm">
                  <p className="flex items-center gap-2"><span className="text-lg">📍</span> {req.location}</p>
                  <p className="flex items-center gap-2"><span className="text-lg">💵</span> ${req.rent}/mo</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedListing(req)}
                  className="w-full py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/30 transition-all text-white"
                >
                  View Listing
                </button>
                
                {req.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(req.id, 'denied')}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-500/20 hover:bg-red-500/40 text-red-100 transition-colors"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'approved')}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-green-500/20 hover:bg-green-500/40 text-green-100 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listing details modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedListing(null)} />
          <div className="relative bg-[#1A202C] border border-white/20 p-8 rounded-3xl max-w-2xl w-full shadow-2xl z-10">
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-3xl font-extrabold text-white mb-2">{selectedListing.propertyName}</h2>
            <p className="text-[#00A6E4] font-medium mb-6">Hosted by {selectedListing.listerName}</p>

            <div className="grid grid-cols-2 gap-6 mb-8 text-white">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-sm opacity-60 mb-1">Rent</p>
                <p className="text-xl font-bold text-[#40ffaa]">${selectedListing.rent}/mo</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-sm opacity-60 mb-1">Room Setup</p>
                <p className="text-lg font-bold">{selectedListing.roomSpecs}</p>
              </div>
            </div>

            <div className="mb-8 text-white">
              <h3 className="text-lg font-bold mb-3 border-b border-white/10 pb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedListing.amenities.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg text-sm bg-white/10 border border-white/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedListing(null)}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #00A6E4 0%, #40ffaa 100%)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches
