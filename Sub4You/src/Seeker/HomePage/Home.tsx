import { Carousel } from '../../components/Carousel'
import { PropertyCard } from '../../components/PropertyCard'
import HouseShowingImage from '../../assets/HouseShowing-image1.jpeg'
import RoomForSubleaseImage from '../../assets/RoomForSublease.jpg'

export const Home = () => {
  const exampleproperties = [
    {
      id: 1,
      name: 'Luxury Downtown Apartment',
      rent: '1,200',
      subleasePeriod: 'May - Aug 2026',
      bedrooms: 2,
      location: 'Downtown',
      image: HouseShowingImage
    },
    {
      id: 2,
      name: 'Cozy Studio Near Campus',
      rent: '850',
      subleasePeriod: 'Jun - Aug 2026',
      bedrooms: 1,
      location: 'University District',
      image: RoomForSubleaseImage
    },
    {
      id: 3,
      name: 'Modern 3-Bedroom House',
      rent: '900',
      subleasePeriod: 'Jan - May 2027',
      bedrooms: 3,
      location: 'Northgate',
      image: HouseShowingImage
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
      rent: '1,400',
      subleasePeriod: 'Aug - Dec 2026',
      bedrooms: 2,
      location: 'Hyde Park',
      image: RoomForSubleaseImage
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
          onClick={() => console.log(`Clicked property ${property.id}`)}
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
          onClick={() => console.log(`Clicked property ${property.id}`)}
        />
      )}
    />
    </>
  )
}

export default Home