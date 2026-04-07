import { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { AuthPlaceholder } from '../../../components/AuthPlaceholder';
import { THEME } from '../../../constants/theme';
import SeekerViewProfile from '../../../Seeker/SeekerViewProfile/SeekerViewProfile';

// Mock Data
const MOCK_MESSAGES = [
  { id: 1, text: "Hey! Thanks for accepting my match request.", sender: 'me', time: '10:30 AM' },
  { id: 2, text: "Hey! No problem. Your listing looks perfect for what I need.", sender: 'them', time: '11:15 AM' },
  { id: 3, text: "Awesome. Did you have any questions about the utility split?", sender: 'me', time: '11:20 AM' },
  { id: 4, text: "Not really, it seems super straightforward. When would I be able to tour?", sender: 'them', time: '11:22 AM' },
  { id: 5, text: "I'm free all day Thursday or Friday!", sender: 'me', time: '11:30 AM' },
];

const MOCK_THREADS = [
  {
    id: '1',
    name: "Alice Smith",
    lastMessage: "I'm free all day Thursday or Friday!",
    date: "12/28/25",
    avatar: "https://i.pravatar.cc/300?img=5",
    unread: false,
    seeker: {
      name: "Alice Smith",
      major: "Computer Science",
      university: "State University",
      image: "https://i.pravatar.cc/300?img=5",
      budget: "$800",
      commute: "Walkable (15m)",
      gender: "Female",
    }
  },
  {
    id: '2',
    name: "Jason Lee",
    lastMessage: "I'll let you know by tomorrow!",
    date: "12/27/25",
    avatar: "https://i.pravatar.cc/300?img=11",
    unread: true,
    seeker: {
      name: "Jason Lee",
      major: "Business Administration",
      university: "State University",
      image: "https://i.pravatar.cc/300?img=11",
      budget: "$1,000",
      commute: "Driving (20m)",
      gender: "Male"
    }
  },
  {
    id: '3',
    name: "Sarah Jenkins",
    lastMessage: "Do you allow pets?",
    date: "12/26/25",
    avatar: "https://i.pravatar.cc/300?img=1",
    unread: false,
    seeker: {
      name: "Sarah Jenkins",
      major: "Nursing",
      university: "State University",
      image: "https://i.pravatar.cc/300?img=1",
      budget: "$750",
      commute: "Public Transit (30m)",
      gender: "Female"
    }
  }
];

export const ListerMessages = () => {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn?: boolean }>() || {};
  if (!isLoggedIn) return <AuthPlaceholder title="Stay Connected" message="Log in to view and send messages to potential subleasers." />;
  const location = useLocation();
  
  // Conditionally initialize active thread based on incoming payload from ListerMatches
  const [activeThread, setActiveThread] = useState(() => {
    const passedId = location.state?.openThreadId;
    if (passedId) {
       const found = MOCK_THREADS.find(t => t.id === passedId.toString());
       if (found) return found;
    }
    return MOCK_THREADS[0];
  });
  
  const [inputText, setInputText] = useState("");
  const [showSeekerDetails, setShowSeekerDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setInputText("");
    // Message send logic would go here
  };

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
            {MOCK_THREADS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(thread => (
              <div
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`p-4 mx-2 my-2 rounded-2xl cursor-pointer transition-all ${activeThread.id === thread.id ? 'bg-white/30 shadow-sm border border-white/40' : 'hover:bg-white/10 border border-transparent'}`}
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
          </div>
        </div>

        {/* MIDDLE COLUMN: Chat Window */}
        <div className="flex-1 flex flex-col relative bg-transparent">
          {/* Active Chat Header */}
          <div className="h-20 border-b border-black/10 flex items-center justify-between px-6 bg-white/5 shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img src={activeThread.avatar} alt={activeThread.name} className="w-10 h-10 rounded-full object-cover border border-white/30" />
              <div>
                <h2 className="font-extrabold text-lg text-black">{activeThread.name}</h2>
                <p className="text-xs font-bold text-black/50 uppercase">Active now</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSeekerDetails(!showSeekerDetails)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSeekerDetails ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/40'}`}
              title="Toggle Details"
            >
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <p className="text-center text-xs font-bold text-black/40 uppercase mb-8">Dec 28, 2025</p>
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'them' && (
                  <img src={activeThread.avatar} alt="Sender" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 shadow-sm border border-white/20" />
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === 'me' ? 'bg-black text-white rounded-br-sm ml-auto border border-black/50' : 'bg-white/20 backdrop-blur-md text-black border border-white/30 rounded-bl-sm'}`}
                  >
                    <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  <span className={`text-[10px] font-bold text-black/40 mt-1 uppercase ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>{msg.time}</span>
                </div>
              </div>
            ))}
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
        </div>

        {/* RIGHT COLUMN: Seeker Details */}
        {showSeekerDetails && (
          <div className="w-[340px] shrink-0 border-l border-black/10 bg-white/5 p-6 flex flex-col overflow-y-auto custom-scrollbar backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-black">About {activeThread.seeker.name}</h2>
              <button 
                onClick={() => setShowSeekerDetails(false)}
                className="p-1.5 rounded-full hover:bg-black/10 text-black/40 hover:text-black transition-colors"
                title="Close Details"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-sm custom-hover-scale transition-transform duration-300">
            <img src={activeThread.seeker.image} alt={activeThread.seeker.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="font-extrabold text-xl text-black mb-1">{activeThread.seeker.name}</h3>
              <p className="text-sm font-semibold text-black/60 mb-4">{activeThread.seeker.major} at {activeThread.seeker.university}</p>

              <div className="border-t border-black/10 pt-4 mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Budget</p>
                  <p className="text-base font-black text-black">{activeThread.seeker.budget}<span className="text-xs font-semibold text-black/50">/mo</span></p>
                </div>
                <div>
                   <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Gender</p>
                   <p className="text-sm font-bold text-black">{activeThread.seeker.gender}</p>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4 mb-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Commute Plan</p>
                    <p className="text-sm font-bold text-black">{activeThread.seeker.commute}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProfileId(activeThread.id)}
                className="w-full py-3 bg-white/40 hover:bg-white/60 text-black font-extrabold rounded-xl border border-white/40 shadow-sm transition-colors cursor-pointer text-sm"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>
        )}

      </div>
      
      {selectedProfileId && (
        <SeekerViewProfile 
          profileId={selectedProfileId} 
          onClose={() => setSelectedProfileId(null)} 
        />
      )}
    </div>
  );
};

export default ListerMessages;
