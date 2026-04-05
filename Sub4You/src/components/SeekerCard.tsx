import { useState, useEffect } from 'react'
import { THEME } from '../constants/theme'
import { IoSchoolOutline, IoCalendarOutline } from "react-icons/io5";

interface SeekerCardProps {
  id?: string | number;
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
  id,
  imageSrc,
  name,
  age,
  gender,
  major,
  budget,
  timeline,
  onClick
}: SeekerCardProps) => {
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (id !== undefined) {
      const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}')
      if (stored[id]) setIsPending(true)
    }
  }, [id])

  const handleMatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPending) return;

    const confirm = window.confirm(`Are you sure you want to send ${name} a match request?`)
    if (confirm) {
      alert(`Congratulations! You sent a match request to ${name}.`)
      setIsPending(true)
      if (id !== undefined) {
        const stored = JSON.parse(localStorage.getItem('sub4you_sent_matches') || '{}')
        stored[id] = 'pending'
        localStorage.setItem('sub4you_sent_matches', JSON.stringify(stored))
      }
    }
  }

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
            <span className={`${THEME.light.classes.text} font-medium text-sm flex items-center gap-2 mb-4`}>
              <IoCalendarOutline size={16} />
              {timeline}
            </span>
            {isPending ? (
              <button 
                onClick={(e) => e.stopPropagation()}
                disabled
                className={`w-full py-2 bg-black/20 border border-white/10 rounded-lg font-medium text-[13px] transition-colors ${THEME.light.classes.text} backdrop-blur-sm opacity-70 cursor-not-allowed`}
              >
                Match Request Pending Approval
              </button>
            ) : (
              <button 
                onClick={handleMatch}
                className={`w-full py-2 bg-[#00A6E4] hover:bg-[#00A6E4]/90 border-transparent rounded-lg font-medium text-sm transition-colors text-white shadow-sm`}
              >
                Send Match Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerCard
