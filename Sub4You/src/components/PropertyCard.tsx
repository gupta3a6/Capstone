import { THEME } from '../constants/theme'
import { IoLocationOutline, IoHomeOutline  } from "react-icons/io5";

interface PropertyCardProps {
  imageSrc: string
  name: string
  rent: string
  subleasePeriod: string
  bedrooms: number
  location?: string
  onClick?: () => void
}

/**
 * PropertyCard Component
 * Displays property information in a card with a plain translucent background.
 */
export const PropertyCard = ({
  imageSrc,
  name,
  rent,
  subleasePeriod,
  bedrooms,
  location = 'University Dist.',
  onClick
}: PropertyCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        <img 
          src={imageSrc} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-black backdrop-blur-sm">
            ${rent}/mo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`text-xl font-bold ${THEME.light.classes.text} mb-1 line-clamp-1`}>{name}</h3>
            <p className={`${THEME.light.classes.text} opacity-60 text-sm flex items-center gap-1`}>
              <IoLocationOutline />
              {location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex flex-col">
            <span className={`${THEME.light.classes.text} opacity-50 text-xs uppercase tracking-wider font-semibold`}>Period</span>
            <span className={`${THEME.light.classes.text} font-medium text-sm`}>{subleasePeriod}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`${THEME.light.classes.text} opacity-50 text-xs uppercase tracking-wider font-semibold`}>Bedrooms</span>
            <span className={`${THEME.light.classes.text} font-medium text-sm flex items-center gap-1`}>
              {bedrooms}
              <IoHomeOutline />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
