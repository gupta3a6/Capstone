import { useParams, useNavigate } from 'react-router-dom'
import { IoShareOutline, IoHeartOutline, IoPersonCircleOutline, IoKeyOutline, IoChatbubbleEllipsesOutline, IoFlagOutline } from 'react-icons/io5'
import { THEME } from '../../constants/theme'
import { mockProperties } from '../../data/mockProperties'

export const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Find the property that matches the ID from the URL
  const property = mockProperties.find(p => p.id === Number(id))

  if (!property) {
    return (
      <div className={`container mx-auto px-4 max-w-6xl py-20 text-center ${THEME.light.classes.text}`}>
        <h2 className="text-3xl font-bold mb-4">Property not found</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '1.5rem'
  }

  return (
    <div className={`container mx-auto px-4 max-w-6xl py-6 ${THEME.light.classes.text}`}>
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold">{property.name}</h1>
        <div className="flex gap-4 font-medium underline text-sm">
          <button className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <IoShareOutline size={18} /> Share
          </button>
          <button className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <IoHeartOutline size={18} /> Save
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden relative mb-10">
        <div className="col-span-2 row-span-2">
          <img src={property.images[0]} alt="Main view" className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={property.images[1]} alt="View 2" className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={property.images[2]} alt="View 3" className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={property.images[3]} alt="View 4" className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1">
          <img src={property.images[4]} alt="View 5" className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer" />
        </div>
        <button 
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg shadow-md border hover:bg-gray-50 transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 0h4v4H9V9z" />
          </svg>
          Show all photos
        </button>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="border-b border-black/10 pb-6">
            <h2 className="text-2xl font-bold mb-1">Entire home in {property.location}</h2>
            <div className="font-medium opacity-80 flex flex-wrap gap-1 items-center">
              <span>{property.guests} guests</span>
              <span>·</span>
              <span>{property.beds} beds</span>
              <span>·</span>
              <span>{property.bedrooms} bedrooms</span>
              <span>·</span>
              <span>{property.baths} baths</span>
            </div>
            <div className="font-medium mt-2 flex items-center gap-1">
              <span>★ {property.rating.toFixed(1)}</span>
              <span>·</span>
              <span className="underline cursor-pointer hover:opacity-80">{property.reviews} reviews</span>
            </div>
          </div>

          <div className="border-b border-black/10 pb-6 flex items-center gap-4">
            <IoPersonCircleOutline size={48} className="opacity-80" />
            <div>
              <h3 className="font-bold text-lg">Hosted by {property.host.name}</h3>
              <p className="opacity-60 text-sm">{property.host.status}</p>
            </div>
          </div>

          <div className="border-b border-black/10 pb-6 flex flex-col gap-5">
            <div className="flex gap-4">
              <IoKeyOutline size={28} className="flex-shrink-0 mt-1 opacity-80" />
              <div>
                <h4 className="font-bold text-lg">Exceptional check-in experience</h4>
                <p className="opacity-70">Recent guests gave the check-in process a 5-star rating.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <IoChatbubbleEllipsesOutline size={28} className="flex-shrink-0 mt-1 opacity-80" />
              <div>
                <h4 className="font-bold text-lg">Exceptional host communication</h4>
                <p className="opacity-70">Recent guests gave {property.host.name} a 5-star rating for communication.</p>
              </div>
            </div>
          </div>

          <div className="pb-6">
            <p className="opacity-80 leading-relaxed text-lg">
              {property.description}
            </p>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="relative">
          <div className="sticky top-28 p-6 shadow-xl" style={glassStyle}>
            <div className="flex justify-between items-end mb-6">
              <div className="text-2xl font-bold">
                ${property.rent} <span className="text-base font-normal opacity-80">/mo</span>
              </div>
            </div>

            <div className="border border-black/20 rounded-xl overflow-hidden mb-4 bg-white/10 backdrop-blur-md">
              <div className="flex border-b border-black/20">
                <div className="p-3 w-1/2 border-r border-black/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Start Date</div>
                  <div className="text-sm font-medium">{property.subleasePeriod.split(' - ')[0]}</div>
                </div>
                <div className="p-3 w-1/2">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">End Date</div>
                  <div className="text-sm font-medium">{property.subleasePeriod.split(' - ')[1]}</div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex flex-col">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Guests</div>
                  <div className="text-sm font-medium">{property.guests} guest{property.guests !== 1 ? 's' : ''}</div>
                </div>
                <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Simulated gradient button to match Sub4You branding */}
            <button className="w-full py-3.5 rounded-xl font-bold text-white text-lg transition-transform hover:scale-[1.02] shadow-md mb-3" style={{ background: 'linear-gradient(90deg, #40ffaa 0%, #4079ff 100%)' }}>
              Request Sublease
            </button>

            <p className="text-center text-sm font-medium opacity-70 mb-6">
              You won't be charged yet
            </p>

            <button className="w-full flex items-center justify-center gap-2 text-sm font-medium underline opacity-60 hover:opacity-100 transition-opacity mt-4">
              <IoFlagOutline /> Report this listing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
