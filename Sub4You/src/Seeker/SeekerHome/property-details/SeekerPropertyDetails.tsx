import React, { useState, useEffect } from 'react';
import { FiHeart, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

interface SeekerPropertyDetailsProps {
  property: {
    id: number | string;
    title: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    rent: string | number;
    subleasePeriod: string;
    bedrooms: number;
    baths: number;
    propertyType: string;
    sqft: string | number;
    genderPref: string;
    commuteType: string;
    commuteMinutes: string;
    moveInDate: string;
    moveOutDate: string;
    utilities: string;
    description: string;
    amenities: string[];
    images: string[];
    hostName: string;
    hostAvatar: string;
  };
  onClose: () => void;
  onSendMessage: () => void;
}

export const SeekerPropertyDetails: React.FC<SeekerPropertyDetailsProps> = ({ 
  property, 
  onClose,
  onSendMessage
}) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (property) {
      const currentSavedStr = localStorage.getItem('sub4you_saved_properties');
      if (currentSavedStr) {
        try {
          const savedArr = JSON.parse(currentSavedStr);
          if (savedArr.some((p: any) => p.id === property.id)) {
            setIsSaved(true);
          }
        } catch (e) {}
      }
    }
  }, [property]);

  if (!property) return null;

  // Destructure with fallbacks for safety mapping
  const images = property.images || [];
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';
  const gridImages = [
    images[1] || 'https://images.unsplash.com/photo-1502672260266-1c1ea2a5098c?w=400&q=80',
    images[2] || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80',
    images[3] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80',
    images[4] || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=400&q=80'
  ];

  return (
    <div 
       className="fixed inset-0 z-[100] flex justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-md overflow-y-auto custom-scrollbar" 
       onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[1240px] my-auto bg-white/50 rounded-[40px] p-6 sm:p-10 border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        style={{ backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)' }}
      >
        
        {/* Header Actions */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-black/5 hover:bg-black/10 border border-black/10 rounded-full text-gray-800 transition-all shadow-sm group"
        >
          <IoClose size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Header Title Section */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{property.title}</h1>
          <div className="flex justify-between flex-wrap gap-4 items-center">
             <div className="text-[16px] text-gray-800 font-medium leading-snug cursor-pointer">
               <span className="underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">{property.address}</span><br />
               <span className="underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">{property.city}, {property.state} {property.zipcode}</span>
             </div>
             <div className="flex gap-4 pr-12">
                <button 
                  onClick={() => {
                    const currentSaved = localStorage.getItem('sub4you_saved_properties');
                    let savedArr = currentSaved ? JSON.parse(currentSaved) : [];
                    
                    if (isSaved) {
                       savedArr = savedArr.filter((p: any) => p.id !== property.id);
                       localStorage.setItem('sub4you_saved_properties', JSON.stringify(savedArr));
                       setIsSaved(false);
                    } else {
                       const savedProp = {
                         id: property.id,
                         listerName: property.hostName,
                         listerAvatar: property.hostAvatar,
                         propertyName: property.title,
                         propertyImage: images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
                         rent: typeof property.rent === 'string' ? parseInt(property.rent.replace(/\D/g, ''), 10) : property.rent,
                         location: property.address,
                         roomSpecs: `${property.bedrooms} Bed, ${property.baths} Bath`,
                         amenities: property.amenities,
                         availableFrom: property.moveInDate,
                       };
                       savedArr.push(savedProp);
                       localStorage.setItem('sub4you_saved_properties', JSON.stringify(savedArr));
                       setIsSaved(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 rounded-xl transition-colors font-semibold text-sm text-gray-800 border border-white/50 shadow-sm"
                >
                 <FiHeart size={16} className={`transition-colors ${isSaved ? 'text-pink-500 fill-pink-500' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
                </button>
             </div>
          </div>
        </div>

        {/* 5-Photo Airbnb Style Grid Grid (Masking the corners naturally) */}
        <div className="w-full h-[300px] sm:h-[480px] rounded-[32px] overflow-hidden flex gap-3 mb-12 shadow-xl border border-white/40 bg-black/10">
          {/* Main Hero (Left 50%) */}
          <div className="w-full md:w-1/2 h-full cursor-pointer hover:opacity-[0.85] transition-opacity bg-black">
            <img src={primaryImage} alt="Main property view" className="w-full h-full object-cover" />
          </div>
          {/* Grid Views (Right 50%) */}
          <div className="hidden md:grid w-1/2 grid-cols-2 grid-rows-2 gap-3 h-full">
            <div className="bg-black hover:opacity-[0.85] transition-opacity cursor-pointer h-full"><img src={gridImages[0]} alt="Grid view 1" className="w-full h-full object-cover" /></div>
            <div className="bg-black hover:opacity-[0.85] transition-opacity cursor-pointer h-full"><img src={gridImages[1]} alt="Grid view 2" className="w-full h-full object-cover" /></div>
            <div className="bg-black hover:opacity-[0.85] transition-opacity cursor-pointer h-full"><img src={gridImages[2]} alt="Grid view 3" className="w-full h-full object-cover" /></div>
            <div className="bg-black hover:opacity-[0.85] transition-opacity cursor-pointer h-full"><img src={gridImages[3]} alt="Grid view 4" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="flex flex-col md:flex-row gap-16 relative">
          
          {/* Left Column (Details - 65%) */}
          <div className="w-full md:w-[65%]">
             <div className="flex justify-between items-start pb-8 border-b border-black/10">
               <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                    {property.propertyType} hosted by {property.hostName}
                  </h2>
                  <p className="text-[17px] mt-1 text-gray-800 flex flex-wrap gap-1.5 font-medium opacity-80">
                    <span>{property.bedrooms} bedrooms</span>
                    <span className="px-1 text-gray-400">•</span>
                    <span>{property.baths} baths</span>
                    <span className="px-1 text-gray-400">•</span>
                    <span>{property.sqft} sqft</span>
                  </p>
                  <div className="mt-4 inline-flex px-4 py-2 rounded-xl bg-black/5 border border-black/10">
                     <p className="text-[13px] font-extrabold uppercase tracking-widest text-black">
                       Gender Pref: {property.genderPref || 'Any'}
                     </p>
                  </div>
               </div>
               <img src={property.hostAvatar || 'https://i.pravatar.cc/150'} alt="Host Avatar" className="w-16 h-16 rounded-full object-cover border border-white/60 shadow-md" />
             </div>
             
             {/* Dynamic Commute Info Box */}
             <div className="py-8 border-b border-black/10 flex items-start gap-5">
                <div className="p-3 bg-black/5 rounded-2xl border border-black/10">
                   <FiMapPin className="text-gray-900" size={24} />
                </div>
                <div className="pt-1">
                   <h3 className="font-extrabold text-gray-900 text-lg">Highly accessible location</h3>
                   <p className="text-gray-700 font-medium mt-1 opacity-80">Approximately a {property.commuteMinutes} min {property.commuteType} to campus.</p>
                </div>
             </div>

             {/* Description Section */}
             <div className="py-8 border-b border-black/10">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-5">About this place</h2>
                <div className="text-[17px] leading-relaxed text-gray-800 font-medium whitespace-pre-wrap opacity-80">
                  {property.description || 'No description available for this property.'}
                </div>
             </div>

             {/* Amenities Section */}
             <div className="py-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  {(property.amenities || []).map((amenity, idx) => (
                     <div key={idx} className="flex items-center gap-4 text-gray-800 text-[17px] font-medium opacity-90">
                        <FiCheckCircle size={22} className="text-black" />
                        {amenity}
                     </div>
                  ))}
                </div>
             </div>

            {/* Lister Profile Section */}
             <div className="py-10 mt-2 border-t border-black/10">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Meet your Lister</h2>
                <div className="flex flex-col md:flex-row gap-8 items-start bg-white/30 backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-sm">
                   <div className="flex flex-col items-center shrink-0 w-full sm:w-48">
                      <img src={property.hostAvatar || 'https://i.pravatar.cc/150'} alt={property.hostName || 'Lister'} className="w-28 h-28 rounded-full object-cover shadow-lg mb-4 border-2 border-white/60" />
                      <h3 className="text-xl font-extrabold text-gray-900 text-center">{property.hostName || 'Sublister'}</h3>
                      <p className="text-sm font-medium text-gray-600 mt-1">Joined 2026</p>
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-gray-900 mb-2">About {(property.hostName || 'them').split(' ')[0]}</h4>
                      <p className="text-[16px] leading-relaxed text-gray-800 opacity-80 mb-6">
                        Hi! I am looking for a respectful and clean subtenant to take over my place for the specified lease duration. Feel free to send me a message directly if you have any questions or want to secure the unit!
                      </p>
                      

                      
                      <button 
                        onClick={onSendMessage}
                        className="mt-8 px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl font-bold text-[16px] text-gray-900 transition-colors shadow-sm"
                      >
                        Message Host
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column (Sticky Action Box - 35%) */}
          <div className="w-full md:w-[35%] relative">
             <div className="sticky top-6 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-2xl">
                <div className="flex items-baseline gap-1.5 mb-6">
                   <span className="text-3xl font-black text-gray-900">${property.rent}</span>
                   <span className="text-[16px] font-bold text-gray-500">/ month</span>
                </div>
                
                <div className="border border-black/10 bg-white/40 rounded-2xl overflow-hidden mb-6 shadow-sm">
                   <div className="flex">
                      <div className="w-1/2 p-4 border-r border-b border-black/10">
                         <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Move-in</p>
                         <p className="text-[15px] font-bold text-gray-900 mt-1">{property.moveInDate}</p>
                      </div>
                      <div className="w-1/2 p-4 border-b border-black/10">
                         <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Move-out</p>
                         <p className="text-[15px] font-bold text-gray-900 mt-1">{property.moveOutDate}</p>
                      </div>
                   </div>
                   <div className="p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Total Duration</p>
                      <p className="text-[15px] font-bold text-gray-900 mt-1">{property.subleasePeriod}</p>
                   </div>
                </div>

                <button 
                  onClick={onSendMessage}
                  className="w-full py-4 bg-black text-white hover:bg-gray-900 rounded-2xl font-bold text-[17px] transition-all tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Send a message
                </button>

                <div className="mt-8 border-t border-black/10 pt-6">
                   <div className="flex justify-between items-center mb-4">
                      <span className="underline decoration-gray-300 text-[16px] text-gray-700 font-medium">Monthly Rent</span>
                      <span className="text-[16px] text-gray-800 font-bold">${property.rent}</span>
                   </div>
                   <div className="flex justify-between items-center mb-4">
                      <span className="underline decoration-gray-300 text-[16px] text-gray-700 font-medium">Estimated Utilities</span>
                      <span className="text-[16px] text-gray-800 font-bold">${property.utilities}</span>
                   </div>
                </div>

                <div className="mt-6 border-t border-black/20 pt-6 flex justify-between items-center font-black text-xl text-gray-900">
                   <span>Total</span>
                   <span>${Number(property.rent) + Number(property.utilities || 0)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
