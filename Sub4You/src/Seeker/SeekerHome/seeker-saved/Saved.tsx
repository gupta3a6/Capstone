import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../../../constants/theme';
import { SeekerPropertyDetails } from '../property-details/SeekerPropertyDetails';

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

const MOCK_SAVED_PROPERTIES: SavedProperty[] = [];

export const Saved = () => {
  const [savedData, setSavedData] = useState<SavedProperty[]>(MOCK_SAVED_PROPERTIES);
  const [selectedListing, setSelectedListing] = useState<SavedProperty | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSaved = localStorage.getItem('sub4you_saved_properties');
    if (currentSaved) {
      try {
        const parsed = JSON.parse(currentSaved);
        const combined = [...MOCK_SAVED_PROPERTIES];
        parsed.forEach((p: SavedProperty) => {
          if (!combined.find(x => x.id === p.id)) {
            combined.push(p);
          }
        });
        setSavedData(combined);
      } catch (e) {}
    }
  }, []);

  const handleUnsave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove from saved?")) {
      setSavedData(current => current.filter(item => item.id !== id));
      
      const currentSavedStr = localStorage.getItem('sub4you_saved_properties');
      if (currentSavedStr) {
        try {
          const parsedArr = JSON.parse(currentSavedStr);
          const filteredArr = parsedArr.filter((item: SavedProperty) => item.id.toString() !== id.toString());
          localStorage.setItem('sub4you_saved_properties', JSON.stringify(filteredArr));
        } catch (e) {}
      }
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
        <SeekerPropertyDetails
          property={{
            id: selectedListing.id,
            title: selectedListing.propertyName,
            address: selectedListing.location,
            rent: selectedListing.rent,
            subleasePeriod: 'Duration Negotiable',
            bedrooms: 1,
            baths: 1,
            propertyType: 'Sublease Unit',
            sqft: '~500',
            genderPref: 'Any',
            commuteType: 'walk',
            commuteMinutes: '10',
            moveInDate: selectedListing.availableFrom,
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

export default Saved;
