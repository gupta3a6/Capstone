import { Carousel } from '../../components/Carousel'
import { PropertyCard } from '../../components/PropertyCard'
import { useNavigate } from 'react-router-dom'
import { mockProperties } from '../../data/mockProperties'

export const SeekerHome = () => {
  const navigate = useNavigate()

  return (
    <>
    <Carousel
      items={mockProperties}
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
          onClick={() => navigate(`/property/${property.id}`)}
        />
      )}
    />

    <Carousel
      items={mockProperties}
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
          onClick={() => navigate(`/property/${property.id}`)}
        />
      )}
    />
    </>
  )
}

export default SeekerHome