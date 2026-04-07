import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FiFilter, FiMap, FiList } from 'react-icons/fi'
import { Carousel } from '../../components/Carousel'
import { PropertyCard } from '../../components/PropertyCard'
import { SeekerPropertyDetails } from './property-details/SeekerPropertyDetails'
import { SeekerFilter } from './seeker-filter/SeekerFilter'
import { SeekerMap } from './SeekerMap'
import HouseShowingImage from '../../assets/HouseShowing-image1.jpeg'
import RoomForSubleaseImage from '../../assets/RoomForSublease.jpg'
import { getProperties } from '../../lib/api'

export const SeekerHome = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Realtime Search Mapping Pipeline
  const { searchQuery } = useOutletContext<{ searchQuery?: string }>() || {};
  const activeSearch = searchQuery?.trim().toLowerCase() || '';

  // Advanced Filtering Pipeline
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    const fetchSavedState = () => {
      const currentSavedStr = localStorage.getItem('sub4you_saved_properties');
      if (currentSavedStr) {
        try {
          const arr = JSON.parse(currentSavedStr);
          setSavedPropertyIds(arr.map((p: any) => p.id.toString()));
        } catch(e) {}
      }
    };
    fetchSavedState();
    // Allow re-hydration to happen automatically when modal closes
    window.addEventListener('storage', fetchSavedState);
    return () => window.removeEventListener('storage', fetchSavedState);
  }, [selectedProperty]); // Simple refresh hook when coming back from detailed modal
  
  const handlePropertyCardSave = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSaved = localStorage.getItem('sub4you_saved_properties');
    let savedArr = currentSaved ? JSON.parse(currentSaved) : [];
    
    if (savedPropertyIds.includes(property.id.toString())) {
       // Remove
       savedArr = savedArr.filter((p: any) => p.id.toString() !== property.id.toString());
       setSavedPropertyIds(prev => prev.filter(id => id !== property.id.toString()));
    } else {
       // Add
       const savedProp = {
         id: property.id,
         listerName: property.hostName,
         listerAvatar: property.hostAvatar,
         propertyName: property.title,
         propertyImage: property.images[0] || property.image,
         rent: typeof property.rent === 'string' ? parseInt(property.rent.replace(/\D/g, ''), 10) : property.rent,
         location: property.address,
         roomSpecs: `${property.bedrooms} Bed, ${property.baths} Bath`,
         amenities: property.amenities,
         availableFrom: property.moveInDate,
       };
       savedArr.push(savedProp);
       setSavedPropertyIds(prev => [...prev, property.id.toString()]);
    }
    localStorage.setItem('sub4you_saved_properties', JSON.stringify(savedArr));
  };

  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRealData() {
      setIsLoading(true);
      const dbData = await getProperties();
      
      // Map the backend DB format into the precise format expected by the frontend UI
      const mappedProps = dbData.map(p => ({
        id: p.id,
        name: p.title || 'Sublease',
        title: p.title || 'Sublease',
        address: `${p.street_address}, ${p.city}, ${p.state}`,
        rent: p.monthly_rent,
        utilities: p.estimated_utilities || 0,
        subleasePeriod: `${p.available_from || 'Now'} - ${p.available_until || 'TBD'}`,
        moveInDate: p.available_from,
        moveOutDate: p.available_until,
        bedrooms: p.bedrooms,
        baths: p.bathrooms,
        sqft: p.sqft || 0,
        propertyType: p.property_type,
        genderPref: p.gender_preference || 'Any',
        commuteType: p.distance_type || 'drive',
        commuteMinutes: p.estimated_commute_minutes || 0,
        description: p.description || 'No description provided.',
        amenities: p.listing_amenities?.map((la: any) => la.amenities.name) || [],
        location: p.city || 'Unknown',
        city: p.city,
        state: p.state,
        zipcode: p.zipcode,
        image: p.listing_images?.[0]?.image_url || RoomForSubleaseImage,
        images: p.listing_images?.length 
          ? p.listing_images.map((img: any) => img.image_url)
          : [RoomForSubleaseImage],
        hostName: p.profiles ? `${p.profiles.first_name} ${p.profiles.last_name}` : 'Unknown Host',
        hostAvatar: p.profiles?.profile_picture_url || 'https://i.pravatar.cc/150?u=Unknown',
        lat: p.latitude || 39.1000, 
        lng: p.longitude || -84.5100
      }));
      
      setProperties(mappedProps);
      setIsLoading(false);
    }
    
    loadRealData();
  }, []);

  const searchResults = activeSearch
    ? properties.filter(p => {
        const term = activeSearch;
        return (
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.location && p.location.toLowerCase().includes(term)) ||
          (p.address && p.address.toLowerCase().includes(term)) ||
          (p.subleasePeriod && p.subleasePeriod.toLowerCase().includes(term)) ||
          (p.rent && p.rent.includes(term)) ||
          ((p as any).city && (p as any).city.toLowerCase().includes(term)) ||
          ((p as any).state && (p as any).state.toLowerCase().includes(term)) ||
          ((p as any).zipcode && (p as any).zipcode.includes(term))
        );
      })
    : properties;

  let finalResults = searchResults;

  if (appliedFilters) {
    finalResults = finalResults.filter(p => {
       let ok = true;
       // We'll run a standard check across bound active properties for native filtering map
       const rentVal = typeof p.rent === 'string' ? parseInt(p.rent.replace(/\D/g, ''), 10) : p.rent;
       if (rentVal > appliedFilters.maxRent || rentVal < appliedFilters.minRent) ok = false;
       if (appliedFilters.beds && p.bedrooms && Number(p.bedrooms) !== Number(appliedFilters.beds)) ok = false;
       if (appliedFilters.baths && p.baths && Number(p.baths) !== Number(appliedFilters.baths)) ok = false;
       if (appliedFilters.commuteType && p.commuteType && p.commuteType !== appliedFilters.commuteType) ok = false;
       if (appliedFilters.propertyType && p.propertyType && p.propertyType !== appliedFilters.propertyType) ok = false;
       if (appliedFilters.genderPref && p.genderPref && p.genderPref !== appliedFilters.genderPref) ok = false;
       
       if (appliedFilters.amenities && appliedFilters.amenities.length > 0) {
         if (!p.amenities) ok = false;
         else {
           for (const am of appliedFilters.amenities) {
             if (!p.amenities.includes(am)) ok = false;
           }
         }
       }
       return ok;
    });
  }

  // Identify visible pills
  const renderFilterPills = () => {
    if (!appliedFilters) return null;
    
    const pills = [];
    if (appliedFilters.city) pills.push(`City: ${appliedFilters.city}`);
    if (appliedFilters.minRent > 0 || appliedFilters.maxRent < 3000) pills.push(`$${appliedFilters.minRent} - $${appliedFilters.maxRent}`);
    if (appliedFilters.beds) pills.push(`${appliedFilters.beds} Beds`);
    if (appliedFilters.propertyType) pills.push(`${appliedFilters.propertyType}`);
    if (appliedFilters.amenities && appliedFilters.amenities.length > 0) pills.push(`${appliedFilters.amenities.length} Amenities`);

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
        <SeekerFilter 
           initialFilters={appliedFilters}
           onClose={() => setIsFilterOpen(false)} 
           onApply={(filters) => { 
             setAppliedFilters(filters); 
             setIsFilterOpen(false); 
           }} 
        />
      )}

      {/* Persistent Filters Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-2 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
         <div className="flex-1 w-full sm:w-auto flex justify-start">
            {renderFilterPills()}
         </div>

         {/* Phase 2 Test Button */}
         <button 
           onClick={async () => {
             console.log("Testing connection...");
             const properties = await getProperties();
             console.log("Successfully fetched properties from Supabase:", properties);
             alert("Connection works! Check your browser console to see the JSON data returned from the database.");
           }}
           className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-all shadow-lg shrink-0 ml-auto"
         >
           Test Database Connection
         </button>

         <button 
           onClick={() => setIsFilterOpen(true)} 
           className="flex items-center gap-2 px-6 py-2.5 bg-white/40 hover:bg-white/60 backdrop-blur-md text-black/80 rounded-full font-medium transition-all shadow-sm border border-black/5 shrink-0 ml-2"
         >
            <FiFilter size={18} /> {appliedFilters ? 'Edit Filters' : 'Advanced Filters'}
         </button>
      </div>

      {activeSearch || appliedFilters || isMapView ? (
        <div className={`w-full px-4 sm:px-8 lg:px-12 py-6 pb-24 z-10 relative ${isMapView ? 'flex gap-6 max-h-[calc(100vh-140px)]' : ''}`}>
          
          <div className={`${isMapView ? 'w-full lg:w-[60%] overflow-y-auto custom-scrollbar pr-2 pb-10' : 'w-full'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
                  {(activeSearch || appliedFilters) ? `Search Results (${finalResults.length})` : `All Properties (${finalResults.length})`}
                </h1>
                {activeSearch && (
                  <p className="text-black/80 font-medium mt-2">
                    Results matching "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
            {finalResults.length === 0 ? (
              <div className="w-full flex justify-center items-center h-64 bg-black/5 backdrop-blur-md rounded-3xl border border-black/10">
                <p className="text-xl text-black/50 font-semibold">No properties matched your criteria.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMapView ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                {finalResults.map((property) => (
                  <PropertyCard
                    key={property.id}
                    name={property.name}
                    rent={property.rent}
                    subleasePeriod={property.subleasePeriod}
                    bedrooms={property.bedrooms}
                    location={property.location}
                    address={property.address}
                    city={(property as any).city}
                    state={(property as any).state}
                    zipcode={(property as any).zipcode}
                    imageSrc={property.image}
                    isSaved={savedPropertyIds.includes(property.id.toString())}
                    onSaveClick={(e) => handlePropertyCardSave(property, e)}
                    onClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            )}
          </div>

          {isMapView && (
            <div className="hidden lg:block w-[40%] flex-shrink-0 h-[calc(100vh-140px)] sticky top-[10px] z-0">
               <SeekerMap properties={finalResults} onMarkerClick={setSelectedProperty} />
            </div>
          )}

        </div>
      ) : (
        <div className="w-full mx-auto pb-24 z-10 relative">
          {isLoading && (
            <div className="w-full h-40 flex items-center justify-center text-black/50 font-bold">
              Fetching properties...
            </div>
          )}
          {!isLoading && properties.length === 0 && (
            <div className="w-full h-40 flex items-center justify-center text-black/50 font-bold bg-white/20 rounded-xl mt-4">
              Your property feed is empty! Go create a test property in Supabase.
            </div>
          )}
          {!isLoading && properties.length > 0 && (
            <div className="-mt-6">
              <Carousel
              items={properties}
            itemsPerPage={4}
            title="Featured Listings in Cincinnati"
            renderItem={(property: any) => (
              <PropertyCard
                key={property.id}
                name={property.name}
                rent={property.rent}
                subleasePeriod={property.subleasePeriod}
                bedrooms={property.bedrooms}
                location={property.location}
                address={property.address}
                city={(property as any).city}
                state={(property as any).state}
                zipcode={(property as any).zipcode}
                imageSrc={property.image}
                isSaved={savedPropertyIds.includes(property.id.toString())}
                onSaveClick={(e) => handlePropertyCardSave(property, e)}
                onClick={() => setSelectedProperty(property)}
              />
            )}
          />

          <Carousel
        items={properties}
        itemsPerPage={4}
        title="Featured Listings in Cincinnati"
        renderItem={(property: any) => (
          <PropertyCard
            key={property.id}
            name={property.name}
            rent={property.rent}
            subleasePeriod={property.subleasePeriod}
            bedrooms={property.bedrooms}
            location={property.location}
            address={property.address}
            city={(property as any).city}
            state={(property as any).state}
            zipcode={(property as any).zipcode}
            imageSrc={property.image}
            isSaved={savedPropertyIds.includes(property.id.toString())}
            onSaveClick={(e) => handlePropertyCardSave(property, e)}
            onClick={() => setSelectedProperty(property)}
          />
        )}
      />

      <Carousel
        items={properties}
        itemsPerPage={4}
        title="Featured Listings in Cincinnati"
        renderItem={(property: any) => (
          <PropertyCard
            key={property.id}
            name={property.name}
            rent={property.rent}
            subleasePeriod={property.subleasePeriod}
            bedrooms={property.bedrooms}
            location={property.location}
            address={property.address}
            city={(property as any).city}
            state={(property as any).state}
            zipcode={(property as any).zipcode}
            imageSrc={property.image}
            isSaved={savedPropertyIds.includes(property.id.toString())}
            onSaveClick={(e) => handlePropertyCardSave(property, e)}
            onClick={() => setSelectedProperty(property)}
          />
        )}
          />
          </div>
          )}
        </div>
      )}
      
      {/* Floating Map Toggle Button (Always Available) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90]">
         <button 
           onClick={() => setIsMapView(!isMapView)}
           className="bg-black text-white hover:scale-105 active:scale-95 transition-all shadow-2xl px-6 py-3.5 rounded-full font-bold flex items-center gap-3"
         >
           {isMapView ? (
             <>Show List <FiList size={20}/></>
           ) : (
             <>Show Map <FiMap size={20}/></>
           )}
         </button>
      </div>

      {selectedProperty && (
        <SeekerPropertyDetails 
          property={{ ...selectedProperty, city: 'Cincinnati', state: 'OH', zipcode: '45219' }} 
          onClose={() => setSelectedProperty(null)}
          onSendMessage={() => {
             setSelectedProperty(null);
             navigate('/seeker/messages', { state: { createThreadWith: selectedProperty.hostName, property: selectedProperty } });
          }}
        />
      )}
    </>
  )
}

export default SeekerHome