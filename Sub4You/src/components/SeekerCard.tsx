import { THEME } from '../constants/theme'
import { IoSchoolOutline, IoCalendarOutline } from "react-icons/io5";

interface SeekerCardProps {
  imageSrc: string
  name: string
  age: number
  gender: string
  major: string
  budget: string
  timeline: string
  onClick?: () => void
}

/**
 * SeekerCard Component
 * Displays prospective subtenant profile information in a card using the glassmorphism aesthetic.
 */
export const SeekerCard = ({
  imageSrc,
  name,
  age,
  gender,
  major,
  budget,
  timeline,
  onClick
}: SeekerCardProps) => {
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10 pointer-events-none" />
        <img 
          src={imageSrc} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-xs font-extrabold text-[#00A6E4] shadow-lg">
            Max ${budget}/mo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`text-xl font-bold ${THEME.light.classes.text} mb-1 line-clamp-1`}>
              {name}, {age} <span className="opacity-60 text-sm font-semibold">({gender})</span>
            </h3>
            <p className={`${THEME.light.classes.text} opacity-80 pl-1 mt-1.5 text-sm flex items-center gap-2 font-medium`}>
              <IoSchoolOutline size={16} />
              {major}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex flex-col w-full">
            <span className={`${THEME.light.classes.text} opacity-50 text-xs uppercase tracking-wider font-bold mb-1.5`}>Looking For</span>
            <span className={`${THEME.light.classes.text} font-medium text-sm flex items-center gap-2`}>
              <IoCalendarOutline size={16} />
              {timeline}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerCard
