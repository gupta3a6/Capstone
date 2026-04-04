import { useState } from 'react';
import { THEME } from '../../../constants/theme';

interface SavedProperty {
  id: string;
  listerName: string;
  listerAvatar: string;
  propertyName: string;
  propertyImage: string;
  rent: number;
  location: string;
  roomSpecs: string;
  amenities: string[];
  availableFrom: string;
}

const MOCK_SAVED_PROPERTIES: SavedProperty[] = [
  {
    id: 'save_1',
    listerName: 'David Kim',
    listerAvatar: 'https://i.pravatar.cc/150?img=12',
    propertyName: 'Modern High-Rise Room',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    rent: 1100,
    location: '789 Skyline Blvd',
    roomSpecs: 'Private Bedroom & Bath in 2B2B',
    amenities: ['In-unit Washer/Dryer', 'Gym', 'Rooftop Pool'],
    availableFrom: 'Sept 1, 2026',
  },
  {
    id: 'save_2',
    listerName: 'Emily Chen',
    listerAvatar: 'https://i.pravatar.cc/150?img=5',
    propertyName: 'Cozy Campus Studio',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ea2a5098c?w=800&q=80',
    rent: 850,
    location: '101 College Ave',
    roomSpecs: 'Entire Studio',
    amenities: ['Furnished', 'High-speed Wi-Fi', 'Close to Transit'],
    availableFrom: 'Immediately',
  },
  {
    id: 'save_3',
    listerName: 'Marcus Johnson',
    listerAvatar: 'https://i.pravatar.cc/150?img=60',
    propertyName: 'Spacious House Share',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    rent: 600,
    location: '55 Maple Street',
    roomSpecs: '1 Room in 4B2B House',
    amenities: ['Backyard', 'Driveway Parking', 'Pet Friendly'],
    availableFrom: 'Aug 15, 2026',
  }
];

export const Saved = () => {
  const [savedData, setSavedData] = useState<SavedProperty[]>(MOCK_SAVED_PROPERTIES);
  const [selectedListing, setSelectedListing] = useState<SavedProperty | null>(null);

  const handleUnsave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove from saved?")) {
      setSavedData(current => current.filter(item => item.id !== id));
      return true;
    }
    return false;
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col ${THEME.light.classes.text}`}>

      {/* Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold mb-1 flex items-center gap-3 justify-center sm:justify-start ${THEME.light.classes.text}`}>
            Saved Properties
            <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>  
          </h1>
          <p className={`text-sm sm:text-base opacity-80 font-medium ${THEME.light.classes.text}`}>Keep track of listings you love.</p>
        </div>
        <div className="px-5 py-2.5 rounded-full border shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <span className={`text-sm font-bold ${THEME.light.classes.text}`}>{savedData.length} Saved</span>
        </div>
      </div>

      {savedData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-3xl border shadow-sm text-center" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <svg className="w-16 h-16 opacity-30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <h3 className={`text-2xl font-extrabold mb-2 ${THEME.light.classes.text}`}>No saved properties yet</h3>
          <p className={`text-lg opacity-70 max-w-md ${THEME.light.classes.text}`}>When you see a listing you like, tap the heart icon to save it for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedData.map((property) => (
            <div key={property.id} 
              className="group flex flex-col rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl cursor-pointer relative"
              style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}
              onClick={() => setSelectedListing(property)}
            >
              
              {/* Top Image */}
              <div className="h-48 w-full relative shrink-0 overflow-hidden">
                <img src={property.propertyImage} alt={property.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                
                {/* Unsave Heart Button */}
                <button
                  onClick={(e) => handleUnsave(property.id, e)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors border border-white/40 shadow-sm"
                  aria-label="Remove from Saved"
                >
                  <svg className="w-5 h-5 text-pink-500 drop-shadow-md transition-transform hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>

                {/* Bottom Left Info Over Image */}
                <div className="absolute bottom-4 left-5 z-20">
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm inline-block mb-1.5">
                    {property.availableFrom}
                  </div>
                  <h2 className="text-xl font-extrabold text-white drop-shadow-md leading-tight">{property.propertyName}</h2>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-5 flex flex-col flex-1 z-20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <img src={property.listerAvatar} alt={property.listerName} className="w-8 h-8 rounded-full border border-white/40 shadow-sm object-cover" />
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${THEME.light.classes.text} leading-none mb-0.5`}>Listed by</p>
                      <p className={`text-sm font-extrabold ${THEME.light.classes.text} leading-none`}>{property.listerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${THEME.light.classes.text} leading-none mb-0.5`}>Rent</p>
                    <p className={`text-xl font-black ${THEME.light.classes.text} leading-none`}>${property.rent}<span className={`text-xs font-semibold opacity-70 ${THEME.light.classes.text}`}>/mo</span></p>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 mb-4">
                  <p className={`text-sm font-medium flex items-center gap-2 opacity-80 ${THEME.light.classes.text} mb-2`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {property.location}
                  </p>
                  <p className={`text-sm font-bold ${THEME.light.classes.text}`}>
                    {property.roomSpecs}
                  </p>
                </div>
                
                <button className={`mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm flex items-center justify-center gap-2 group-hover:bg-white/40 ${THEME.light.classes.text}`}
                  style={{ background: 'rgba(255, 255, 255, 0.3)', border: '1px solid rgba(255, 255, 255, 0.5)' }}
                >
                  View Details <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Listing Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedListing(null)} />
          
          <div className="relative rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]" style={{ background: 'rgba(25, 25, 25, 0.85)', backdropFilter: 'blur(50px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            
            <div className="h-48 sm:h-56 relative shrink-0">
              <img src={selectedListing.propertyImage} className="w-full h-full object-cover" alt="Property" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/20 z-20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <button
                onClick={(e) => {
                  const wasRemoved = handleUnsave(selectedListing.id, e);
                  if (wasRemoved) {
                    setSelectedListing(null);
                  }
                }}
                className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors border border-white/20 shadow-sm"
                aria-label="Remove from Saved"
              >
                <svg className="w-5 h-5 text-pink-500 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>

              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm inline-block mb-2">
                       Available {selectedListing.availableFrom}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md leading-tight">{selectedListing.propertyName}</h2>
                  </div>
                  <div className="text-right pb-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-white/70 mb-0.5">Rent</p>
                    <p className="text-2xl font-black text-white leading-none">${selectedListing.rent}<span className="text-sm font-semibold text-white/70">/mo</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">

              {/* Specs & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="p-2 rounded-full bg-white/10 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-50 text-white mb-0.5">Layout</p>
                    <p className="text-sm font-bold text-white leading-snug">{selectedListing.roomSpecs}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="p-2 rounded-full bg-white/10 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-50 text-white mb-0.5">Location</p>
                    <p className="text-sm font-bold text-white leading-snug">{selectedListing.location}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/50">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.amenities.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A6E4]"></span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lister Profile Row */}
              <div className="flex items-center justify-between p-4 rounded-2xl mt-2" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div className="flex items-center gap-3">
                  <img src={selectedListing.listerAvatar} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-md" alt="Lister" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">Listed By</p>
                    <p className="text-base font-extrabold text-white">{selectedListing.listerName}</p>
                  </div>
                </div>
                <button 
                  className="px-6 py-3 rounded-xl text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #00A6E4 0%, #40ffaa 100%)' }}
                  onClick={() => alert("Connecting to messages...")}
                >
                  Contact
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saved;
