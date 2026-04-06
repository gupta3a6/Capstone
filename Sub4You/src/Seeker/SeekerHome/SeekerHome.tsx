import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel } from '../../components/Carousel'
import { PropertyCard } from '../../components/PropertyCard'
import { SeekerPropertyDetails } from './property-details/SeekerPropertyDetails'
import HouseShowingImage from '../../assets/HouseShowing-image1.jpeg'
import RoomForSubleaseImage from '../../assets/RoomForSublease.jpg'

export const SeekerHome = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const navigate = useNavigate();

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

  return (
    <>
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
            imageSrc={property.image}
            isSaved={savedPropertyIds.includes(property.id.toString())}
            onSaveClick={(e) => handlePropertyCardSave(property, e)}
            onClick={() => setSelectedProperty(property)}
          />
        )}
      />
      
      {selectedProperty && (
        <SeekerPropertyDetails 
          property={selectedProperty} 
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