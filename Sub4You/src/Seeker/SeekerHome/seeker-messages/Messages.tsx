import { useState, useEffect, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { AuthPlaceholder } from '../../../components/AuthPlaceholder';
import { THEME } from '../../../constants/theme';
import { SeekerPropertyDetails } from '../property-details/SeekerPropertyDetails';
import { supabase } from '../../../lib/supabase';
import { getUserThreads, getThreadMessages, sendMessage, getOrCreateMessageThread } from '../../../lib/api';

export const Messages = () => {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn?: boolean }>() || {};
  const [activeThread, setActiveThread] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [showListingDetails, setShowListingDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeListerProfile, setActiveListerProfile] = useState<any>(null);
  const [activeListingDetails, setActiveListingDetails] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setSessionUser(session.user);
      
      let initialThreadId = null;
      // Handle programmatic navigation from Matches "Send Message"
      if (location.state?.createThreadWith && location.state?.property) {
         try {
             // In Phase 6, we'll try to get or create a thread for this matching payload
             const mockedListerId = "dummy-lister"; // As seeder might be mocked still, real integration expects real UUID
             // Actually, if we get matched via DB, we can just resolve from matches, but for now we fallback to standard 
         } catch(e) {}
      }
      
      const res = await getUserThreads(session.user.id);
      
      const mapped = res.map((t: any) => {
        const isLister = t.lister_id === session.user.id;
        const otherParty = isLister ? t.seeker_profile : t.lister_profile;
        const listing = t.property_listings;
        
        return {
          id: t.id,
          name: `${otherParty?.first_name || ''} ${otherParty?.last_name || ''}`.trim() || 'Unknown',
          lastMessage: "Start of conversation...",
          date: new Date(t.created_at).toLocaleDateString(),
          avatar: otherParty?.avatar_url || 'https://i.pravatar.cc/150',
          unread: false,
          listing: {
            name: listing?.title || "Sublease Request",
            host: `${t.lister_profile?.first_name || ''} ${t.lister_profile?.last_name || ''}`,
            image: listing?.listing_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
            availableFrom: listing?.available_from || "Flexible",
            rent: `$${listing?.monthly_rent || 0}`
          },
          hostProfile: {
            bio: otherParty?.bio || "No bio available.",
            avatar: otherParty?.avatar_url || 'https://i.pravatar.cc/150',
            hobbies: "Ask me!",
            role: isLister ? "Seeker" : "Lister"
          }
        }
      });
      
      setThreads(mapped);
      if (mapped.length > 0) setActiveThread(mapped[0]);
    }
    loadData();
  }, [location.state]);

  useEffect(() => {
    if (!activeThread || !sessionUser) return;
    
    async function fetchMsgs() {
      const msgs = await getThreadMessages(activeThread.id);
      setRawMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    fetchMsgs();
    
    // Subscribe to realtime via Supabase channel!
    const channel = supabase.channel(`messages:${activeThread.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${activeThread.id}` }, (payload) => {
        setRawMessages(prev => [...prev, payload.new])
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .subscribe()
      
    return () => { supabase.removeChannel(channel) }
  }, [activeThread, sessionUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread || !sessionUser) return;
    const textToSend = inputText;
    setInputText("");
    try {
      await sendMessage(activeThread.id, sessionUser.id, textToSend);
    } catch(err) {
      console.error(err)
    }
  };

  if (!isLoggedIn) return <AuthPlaceholder title="Stay Connected" message="Log in to view and send messages to listers." />;

  return (
    <div className={`h-[calc(100vh-80px)] max-w-[1600px] mx-auto flex flex-col p-4 sm:p-6 ${THEME.light.classes.text}`}>

      <div className="flex-1 w-full bg-white/10 backdrop-blur-lg rounded-[2rem] border border-white/20 shadow-xl overflow-hidden flex">

        {/* LEFT COLUMN: Inbox */}
        <div className="w-[320px] shrink-0 border-r border-black/10 flex flex-col bg-transparent">
          <div className="p-6 border-b border-black/10">
            <h1 className="text-2xl font-extrabold text-black mb-4">Messages</h1>
            <div className="relative mb-4">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="w-4 h-4 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search messages..."
                 className="w-full bg-black/5 border border-black/10 rounded-xl py-2 pl-9 pr-4 text-sm text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20 focus:bg-white/50 transition-all font-medium"
               />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold shadow-sm border border-black">All</button>
              <button className="px-4 py-1.5 rounded-full text-black hover:bg-white/20 border border-transparent text-sm font-bold transition-colors">Unread</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {threads.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(thread => (
              <div
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`p-4 mx-2 my-2 rounded-2xl cursor-pointer transition-all ${activeThread?.id === thread.id ? 'bg-white/30 shadow-sm border border-white/40' : 'hover:bg-white/10 border border-transparent'}`}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <img src={thread.avatar} alt={thread.name} className="w-12 h-12 rounded-full object-cover border border-white/30 shadow-sm" />
                    {thread.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-black truncate">{thread.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-black/40">{thread.date}</span>
                    </div>
                    <p className={`text-sm truncate ${thread.unread ? 'text-black font-semibold' : 'text-black/60 font-medium'}`}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {threads.length === 0 && (
               <div className="p-8 text-center text-black/50 text-sm font-medium">
                 No conversations yet. Match with a property to start chatting!
               </div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Chat Window */}
        <div className="flex-1 flex flex-col relative bg-transparent">
          {activeThread ? (
          <>
          <div className="h-20 border-b border-black/10 flex items-center justify-between px-6 bg-white/5 shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img src={activeThread.avatar} alt={activeThread.name} className="w-10 h-10 rounded-full object-cover border border-white/30" />
              <div>
                <h2 className="font-extrabold text-lg text-black">{activeThread.name}</h2>
                <p className="text-xs font-bold text-black/50 uppercase">Active now</p>
              </div>
            </div>
            <button 
              onClick={() => setShowListingDetails(!showListingDetails)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showListingDetails ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/40'}`}
              title="Toggle Details"
            >
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <p className="text-center text-xs font-bold text-black/40 uppercase mb-8">Beginning of Conversation</p>
            {rawMessages.map((msg) => {
              const isMe = msg.sender_id === sessionUser?.id;
              return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img src={activeThread.avatar} alt="Sender" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 shadow-sm border border-white/20" />
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-full shadow-sm ${isMe ? 'bg-black text-white rounded-br-sm ml-auto border border-black/50' : 'bg-white/20 backdrop-blur-md text-black border border-white/30 rounded-bl-sm'}`}
                  >
                    <p className="text-[15px] font-medium leading-relaxed break-words">{msg.content}</p>
                  </div>
                  <span className={`text-[10px] font-bold text-black/40 mt-1 uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )})}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white/5 border-t border-black/10 shrink-0 backdrop-blur-sm">
            <form onSubmit={handleSend} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center p-2 shadow-sm focus-within:ring-2 focus-within:ring-black/20 focus-within:bg-white/50 transition-all">
              <button type="button" className="p-2 text-black/50 hover:text-black transition-colors rounded-full hover:bg-black/5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 bg-transparent px-3 py-2 outline-none text-black placeholder-black/50 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-black text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform border border-transparent"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </form>
          </div>
          </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-black/40 font-medium pb-20">
              Select a conversation to start messaging.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Listing Details */}
        {(showListingDetails && activeThread) && (
          <div className="w-[340px] shrink-0 border-l border-black/10 bg-white/5 p-6 flex flex-col overflow-y-auto custom-scrollbar backdrop-blur-sm relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-black">Listing Details</h2>
              <button 
                onClick={() => setShowListingDetails(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors border border-black/10"
                title="Close Details"
              >
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-white/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/50 shadow-sm mb-4">
              <img src={activeThread.listing.image} alt="Property" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-extrabold text-lg text-black leading-tight mb-2">{activeThread.listing.name}</h3>
                
                <div className="flex justify-between items-center bg-white/50 px-4 py-3 rounded-xl border border-white/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                   <div>
                     <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Rent</p>
                     <p className="text-lg font-black text-black leading-none">{activeThread.listing.rent}<span className="text-xs font-bold text-black/40">/mo</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Available</p>
                     <p className="text-sm font-bold text-black">{activeThread.listing.availableFrom}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Prominent Action Button directly under Listing Block */}
            <button 
              onClick={() => setActiveListingDetails(activeThread)}
              className="w-full py-4 mb-8 bg-black hover:bg-gray-800 text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer text-sm tracking-wide text-center"
            >
              View Full Listing Details
            </button>
          
          {/* Host Profile Injection */}
          <div className="flex items-center justify-between mb-4">
               <h2 className="text-[15px] uppercase tracking-wider font-extrabold text-black/50">Lister Profile</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-sm">
               <div className="flex items-center gap-4 mb-4">
                    <img src={activeThread.hostProfile.avatar} alt="host avatar" className="w-12 h-12 rounded-full border border-white/40 object-cover shadow-sm" />
                    <div>
                         <h3 className="font-extrabold text-lg text-black">{activeThread.listing.host}</h3>
                         <p className="text-xs font-bold text-[#00A6E4] uppercase uppercase tracking-wider">{activeThread.hostProfile.role}</p>
                    </div>
               </div>
               
               <p className="text-sm font-medium text-black leading-relaxed mb-4">"{activeThread.hostProfile.bio}"</p>
               
               <div className="border-t border-black/10 pt-3 mb-5">
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-1">Interests</p>
                    <p className="text-xs font-bold text-black">{activeThread.hostProfile.hobbies}</p>
               </div>

              <button 
                onClick={() => setActiveListerProfile(activeThread)}
                className="w-full py-3 bg-white/40 hover:bg-white/60 text-black font-extrabold rounded-xl border border-white/40 shadow-sm transition-colors cursor-pointer text-sm"
              >
                View Lister Profile
              </button>
          </div>
          
        </div>
        )}

      </div>
      
      {/* Isolated Lister Profile Modal matching SeekerViewProfile aesthetics */}
      {activeListerProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/20 backdrop-blur-sm overflow-y-auto" onClick={() => setActiveListerProfile(null)}>
          <div 
            className="relative w-full max-w-[1100px] my-auto bg-white/40 rounded-[32px] p-6 sm:p-12 border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex flex-col md:flex-row gap-12" 
            onClick={(e) => e.stopPropagation()}
            style={{ backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)' }}
          >
            <button 
              onClick={() => setActiveListerProfile(null)}
              className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-black/5 hover:bg-black/10 border border-black/10 rounded-full text-gray-800 transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Left Col: Image */}
            <div className="w-full md:w-[35%] shrink-0 flex flex-col gap-6">
              <img 
                src={activeListerProfile.hostProfile.avatar} 
                alt="Lister" 
                className="w-full aspect-[4/5] object-cover rounded-[24px] shadow-2xl border border-black/5" 
              />
            </div>

            {/* Right Col: Details */}
            <div className="w-full md:w-[65%] flex flex-col pt-2">
              <div className="flex justify-between items-start mb-2 pr-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  {activeListerProfile.listing.host}
                </h1>
              </div>
              
              <p className="text-xl text-[#00A6E4] font-bold tracking-widest uppercase mb-10 flex items-center gap-2">
                {activeListerProfile.hostProfile.role}
              </p>

              <div className="w-full h-px bg-gradient-to-r from-black/10 to-transparent mb-10" />

              <div className="mb-10 lg:mb-auto">
                <p className="text-xs uppercase tracking-widest text-black mb-3 font-bold">About Me</p>
                <p className="text-lg leading-relaxed text-gray-800 opacity-90 font-light pr-4">
                  {activeListerProfile.hostProfile.bio}
                </p>
              </div>

              <div className="mt-auto">
                <p className="text-xs uppercase tracking-widest text-black mb-3 font-bold">Hobbies & Interests</p>
                <div className="flex flex-wrap gap-2.5">
                    <span className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 transition-colors border border-black/10 text-gray-800 text-[13px] font-medium tracking-wide">
                      {activeListerProfile.hostProfile.hobbies}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Isolated Property Listing Modal */}
      {activeListingDetails && (
        <SeekerPropertyDetails
          property={{
            id: activeListingDetails.id || activeListingDetails.listing.name,
            title: activeListingDetails.listing.name,
            address: activeListingDetails.listing.location || 'Location Not Provided',
            city: 'Cincinnati',
            state: 'OH',
            zipcode: '45219',
            rent: activeListingDetails.listing.rent.toString().replace(/[^0-9]/g, ''),
            subleasePeriod: 'Duration Negotiable',
            bedrooms: 1,
            baths: 1,
            propertyType: 'Sublease Unit',
            sqft: '~500',
            genderPref: 'Any',
            commuteType: 'walk',
            commuteMinutes: '10',
            moveInDate: activeListingDetails.listing.availableFrom,
            moveOutDate: 'Flexible',
            utilities: '0',
            description: activeListingDetails.hostProfile.bio,
            amenities: ['High-Speed WiFi', 'Utilities Included', 'Furnished'],
            images: [
              activeListingDetails.listing.image,
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
              'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
              'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
            ],
            hostName: activeListingDetails.listing.host,
            hostAvatar: activeListingDetails.hostProfile.avatar
          }}
          onClose={() => setActiveListingDetails(null)}
          onSendMessage={() => setActiveListingDetails(null)}
        />
      )}

    </div>
  );
};

export default Messages;
