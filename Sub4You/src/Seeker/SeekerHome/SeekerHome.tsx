import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FiFilter } from 'react-icons/fi'
import { Carousel } from '../../components/Carousel'
import { PropertyCard } from '../../components/PropertyCard'
import { SeekerPropertyDetails } from './property-details/SeekerPropertyDetails'
import { SeekerFilter } from './seeker-filter/SeekerFilter'
import HouseShowingImage from '../../assets/HouseShowing-image1.jpeg'
import RoomForSubleaseImage from '../../assets/RoomForSublease.jpg'

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

  const exampleproperties = [
    {
      id: 1,
      name: 'Luxury Downtown Apartment',
      title: 'Luxury Downtown Apartment w/ City Views',
      address: 'Downtown, Cincinnati, Ohio',
      rent: '1200',
      utilities: '150',
      subleasePeriod: 'May - Aug 2026',
      moveInDate: 'May 1, 2026',
      moveOutDate: 'August 31, 2026',
      bedrooms: 2,
      baths: 2,
      sqft: '1100',
      propertyType: 'Entire Apartment',
      genderPref: 'Any',
      commuteType: 'bus',
      commuteMinutes: '10',
      description: 'Stunning luxury apartment right in the heart of downtown Cincinnati! The building has premium amenities including a fully equipped fitness center, rooftop lounge, and 24/7 security. Perfect for summer interns or students working downtown.',
      amenities: ['High-Speed WiFi', 'In-Unit Washer/Dryer', 'Air Conditioning', 'Gym/Fitness Center', 'Rooftop Access'],
      location: 'Downtown',
      image: HouseShowingImage,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      hostName: 'David K.',
      hostAvatar: 'https://i.pravatar.cc/150?u=12',
    },
    {
      id: 2,
      name: 'Cozy Studio Near Campus',
      title: 'Minimalist Cozy Studio directly across Campus',
      address: 'University District, Cincinnati, Ohio',
      rent: '850',
      utilities: '80',
      subleasePeriod: 'Jun - Aug 2026',
      moveInDate: 'June 1, 2026',
      moveOutDate: 'August 15, 2026',
      bedrooms: 1,
      baths: 1,
      sqft: '450',
      propertyType: 'Private Studio',
      genderPref: 'Female',
      commuteType: 'walk',
      commuteMinutes: '5',
      description: 'Super peaceful studio heavily preferred for someone quiet! Located literal steps away from campus so you can wake up 10 minutes before class. Fully furnished with a workstation and a queen bed.',
      amenities: ['High-Speed WiFi', 'Heating', 'Fully Furnished', 'Utilities Included'],
      location: 'University District',
      image: RoomForSubleaseImage,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ea2a5098c?w=1000&q=80',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
      ],
      hostName: 'Sarah Jenkins',
      hostAvatar: 'https://i.pravatar.cc/150?u=42',
    },
    {
      id: 3,
      name: 'Modern 3-Bedroom House',
      title: 'Spacious Modern 3-Bedroom House with Backyard',
      address: 'Northgate, Cincinnati, Ohio',
      rent: '900',
      utilities: '100',
      subleasePeriod: 'Jan - May 2027',
      moveInDate: 'January 10, 2027',
      moveOutDate: 'May 30, 2027',
      bedrooms: 3,
      baths: 2.5,
      sqft: '1850',
      propertyType: 'Entire House',
      genderPref: 'Male',
      commuteType: 'drive',
      commuteMinutes: '15',
      description: 'Massive property best for a group of 3 friends! Has a fully renovated kitchen, attached double-garage, and a huge backyard with a fire pit that we just set up. Looking to sublease the entire house for the Spring semester.',
      amenities: ['Parking Space', 'Dishwasher', 'In-Unit Washer/Dryer', 'Pet Friendly', 'Balcony/Patio'],
      location: 'Northgate',
      image: HouseShowingImage,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28e503d982b?w=800&q=80',
      ],
      hostName: 'Alex Mercer',
      hostAvatar: 'https://i.pravatar.cc/150?u=9',
    },
    {
      id: 4,
      name: 'Spacious Shared Room',
      rent: '650',
      subleasePeriod: 'Sep - Dec 2026',
      bedrooms: 4,
      location: 'Capitol Hill',
      image: RoomForSubleaseImage
    },
    {
      id: 5,
      name: 'Sunny 2-Bed Condo',
      title: 'Beautiful Sunlit Condo near the River',
      address: 'Hyde Park, Cincinnati, Ohio',
      rent: '1400',
      utilities: '0',
      subleasePeriod: 'Aug - Dec 2026',
      moveInDate: 'August 1, 2026',
      moveOutDate: 'December 20, 2026',
      bedrooms: 2,
      baths: 2,
      sqft: '1050',
      propertyType: 'Condo',
      genderPref: 'Any',
      commuteType: 'drive',
      commuteMinutes: '20',
      description: 'A higher-end condo in a completely safe, walkable neighborhood with immediate access to cafes and parks. All utilities are included in the rent! Seeking responsible subtenants.',
      amenities: ['Swimming Pool', 'Security System', 'Elevator', 'Utilities Included', 'Dishwasher'],
      location: 'Hyde Park',
      image: RoomForSubleaseImage,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
        'https://images.unsplash.com/photo-1595526114101-9ccba7015093?w=800&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
      ],
      hostName: 'Emily & Mike',
      hostAvatar: 'https://i.pravatar.cc/150?u=18',
    },
    {
      id: 6,
      name: 'Historic Brick House',
      rent: '750',
      subleasePeriod: 'May - Aug 2026',
      bedrooms: 1,
      location: 'Over-the-Rhine',
      image: HouseShowingImage
    },
    {
      id: 7,
      name: 'Modern Loft',
      rent: '1,100',
      subleasePeriod: 'Jun - Dec 2026',
      bedrooms: 1,
      location: 'Downtown',
      image: RoomForSubleaseImage
    },
    {
      id: 8,
      name: 'Campus View Apartment',
      rent: '950',
      subleasePeriod: 'Sep - May 2027',
      bedrooms: 2,
      location: 'University District',
      image: HouseShowingImage
    }
  ]

  const searchResults = activeSearch
    ? exampleproperties.filter(p => {
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
    : exampleproperties;

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
         <button 
           onClick={() => setIsFilterOpen(true)} 
           className="flex items-center gap-2 px-6 py-2.5 bg-white/40 hover:bg-white/60 backdrop-blur-md text-black/80 rounded-full font-medium transition-all shadow-sm border border-black/5 shrink-0 ml-auto"
         >
            <FiFilter size={18} /> {appliedFilters ? 'Edit Filters' : 'Advanced Filters'}
         </button>
      </div>

      {activeSearch || appliedFilters ? (
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 pb-24 z-10 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
                Search Results ({finalResults.length})
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
              <p className="text-xl text-black/50 font-semibold">No properties matched your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      ) : (
        <div className="w-full mx-auto pb-24 z-10 relative">
          <div className="-mt-6">
            <Carousel
            items={exampleproperties}
            itemsPerPage={4}
            title="Featured Listings in Cincinnati"
            renderItem={(property) => (
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
        items={exampleproperties}
        itemsPerPage={4}
        title="Featured Listings in Cincinnati"
        renderItem={(property) => (
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
        items={exampleproperties}
        itemsPerPage={4}
        title="Featured Listings in Cincinnati"
        renderItem={(property) => (
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
        </div>
      )}
      
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