import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { AuthPlaceholder } from '../../../components/AuthPlaceholder'

import { PropertyCard } from '../../../components/PropertyCard'
import RoomForSubleaseImage from '../../../assets/RoomForSublease.jpg'

export const MyListings = () => {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn?: boolean }>() || {};
  if (!isLoggedIn) return <AuthPlaceholder title="Manage Listings" message="Log in to view and manage your active sublease listings." />;
  const navigate = useNavigate()
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    const fetchListings = () => {
      const savedJson = localStorage.getItem('sub4you_lister_listings_array')
      if (savedJson) {
        try {
          const parsed = JSON.parse(savedJson)
          // ensure it's an array
          if (Array.isArray(parsed)) {
            setListings(parsed)
          } else {
            // Migrating the old legacy data format automatically to new array format if exists
            setListings([parsed])
            localStorage.setItem('sub4you_lister_listings_array', JSON.stringify([parsed]))
          }
        } catch (e) {
          console.error("Failed to parse listings array", e)
        }
      }
    }
    fetchListings()
  }, [])

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you certain you want to permanently delete this listing?')) {
      const updatedListings = listings.filter(item => item.id !== id)
      setListings(updatedListings)
      localStorage.setItem('sub4you_lister_listings_array', JSON.stringify(updatedListings))
    }
  }

  return (
    <>
      <div className="w-full min-h-screen pt-10 pb-24 px-8 max-w-[1400px] mx-auto z-10 relative">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-black drop-shadow-md">My Listings</h1>
            <p className="text-black/80 font-medium mt-2">Manage your active properties and edit details.</p>
          </div>
          <button 
            onClick={() => navigate('/lister/createlisting')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-xl text-black font-bold shadow-lg border border-black/10 backdrop-blur-md whitespace-nowrap z-20"
          >
            Create a New Listing +
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="w-full flex justify-center items-center h-64 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
            <p className="text-xl text-white/50 font-semibold">You don't have any active listings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item, index) => {
              // fallback image if they didn't upload one
              const imgData = item.photoPreviews && item.photoPreviews.length > 0 
                              ? item.photoPreviews[0] 
                              : RoomForSubleaseImage;
              
              // Formatting dates or semesters for the card timeframe
              let timeStr = 'N/A';
              if (item.moveInType === 'semester') {
                 if (item.moveInSemesters && item.moveInSemesters.length > 0) {
                     timeStr = item.moveInSemesters.join(', ')
                 }
              } else {
                 if (item.moveInDate && item.moveOutDate) {
                     timeStr = `${item.moveInDate} until ${item.moveOutDate}`
                 }
              }

              return (
                <div key={item.id || index} className="relative group cursor-pointer z-10 block" onClick={() => navigate(`/lister/createlisting?id=${item.id}`)}>
                   <div className="pointer-events-none">
                     <PropertyCard
                       imageSrc={imgData}
                       name={item.listingTitle || item.address || 'Untitled Listing'}
                       rent={item.rent || '0'}
                       subleasePeriod={timeStr}
                       bedrooms={parseInt(item.beds) || 0}
                       location={item.address || 'Unknown Location'}
                       address={item.address}
                       city={item.city}
                       state={item.stateCode}
                       zipcode={item.zipcode}
                     />
                   </div>
                   
                   {/* Overlay 'Edit' tooltip / badge on hover just to make it clear */}
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-300 pointer-events-none">
                     <span className="bg-[#00A6E4] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-white/20 backdrop-blur-md">
                       Click to Edit
                     </span>
                   </div>

                   {/* Delete Listing Button */}
                   <button 
                     onClick={(e) => handleDelete(e, item.id)}
                     className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-30 duration-300 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl backdrop-blur-md"
                     title="Delete Listing"
                   >
                     <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default MyListings
