import { useState } from 'react';
import { THEME } from '../../../constants/theme';

// Mock Data
const MOCK_MESSAGES = [
  { id: 1, text: "Hey! Is this room still available?", sender: 'them', time: '10:30 AM' },
  { id: 2, text: "Yes it is! When are you looking to move in?", sender: 'me', time: '11:15 AM' },
  { id: 3, text: "I was hoping for the start of next semester. Sometime around early January?", sender: 'them', time: '11:20 AM' },
  { id: 4, text: "That works perfectly. I'm moving out December 20th.", sender: 'me', time: '11:22 AM' },
  { id: 5, text: "Awesome. Could I come see it sometime this week?", sender: 'them', time: '11:30 AM' },
];

const MOCK_THREADS = [
  {
    id: '1',
    name: "Shannon, Thomas",
    lastMessage: "Awesome. Could I come see it sometime this week?",
    date: "12/28/25",
    avatar: "https://i.pravatar.cc/150?1",
    unread: true,
    listing: {
      name: "Sunny Room near Campus",
      host: "Shannon",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80",
      availableFrom: "Jan 1, 2026",
      rent: "$850",
    }
  },
  {
    id: '2',
    name: "Sarah Jenkins",
    lastMessage: "I'll let you know by tomorrow!",
    date: "12/27/25",
    avatar: "https://i.pravatar.cc/150?2",
    unread: false,
    listing: {
      name: "Quiet Studio Apartment",
      host: "Sarah",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ea2a5098c?w=500&q=80",
      availableFrom: "Feb 1, 2026",
      rent: "$1100",
    }
  },
  {
    id: '3',
    name: "Alex",
    lastMessage: "Do you allow pets?",
    date: "12/26/25",
    avatar: "https://i.pravatar.cc/150?3",
    unread: false,
    listing: {
      name: "Downtown Loft Shared",
      host: "Alex",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80",
      availableFrom: "Immediately",
      rent: "$950",
    }
  }
];

export const Messages = () => {
  const [activeThread, setActiveThread] = useState(MOCK_THREADS[0]);
  const [inputText, setInputText] = useState("");

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
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold shadow-sm border border-black">All</button>
              <button className="px-4 py-1.5 rounded-full text-black hover:bg-white/20 border border-transparent text-sm font-bold transition-colors">Unread</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {MOCK_THREADS.map(thread => (
              <div 
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`p-4 mx-2 my-2 rounded-2xl cursor-pointer transition-all ${activeThread.id === thread.id ? 'bg-white/30 shadow-sm border border-white/40' : 'hover:bg-white/10 border border-transparent'}`}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <img src={thread.avatar} alt={thread.name} className="w-12 h-12 rounded-full object-cover border border-white/30 shadow-sm"/>
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
              <img src={activeThread.avatar} alt={activeThread.name} className="w-10 h-10 rounded-full object-cover border border-white/30"/>
              <div>
                <h2 className="font-extrabold text-lg text-black">{activeThread.name}</h2>
                <p className="text-xs font-bold text-black/50 uppercase">Active now</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <p className="text-center text-xs font-bold text-black/40 uppercase mb-8">Dec 28, 2025</p>
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'them' && (
                  <img src={activeThread.avatar} alt="Sender" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 shadow-sm border border-white/20"/>
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

        {/* RIGHT COLUMN: Listing Details */}
        <div className="w-[340px] shrink-0 border-l border-black/10 bg-white/5 p-6 flex flex-col overflow-y-auto custom-scrollbar hidden lg:flex backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-black">Listing Details</h2>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-sm custom-hover-scale transition-transform duration-300">
            <img src={activeThread.listing.image} alt="Property" className="w-full h-48 object-cover"/>
            <div className="p-5">
              <h3 className="font-extrabold text-xl text-black mb-1">{activeThread.listing.name}</h3>
              <p className="text-sm font-semibold text-black/60 mb-4">Hosted by {activeThread.listing.host}</p>
              
              <div className="border-t border-black/10 pt-4 mb-4">
                <p className="text-xs uppercase font-extrabold tracking-wider text-black/50 mb-1">Rent</p>
                <p className="text-lg font-black text-black">{activeThread.listing.rent}<span className="text-sm font-semibold text-black/50">/mo</span></p>
              </div>

              <div className="border-t border-black/10 pt-4 mb-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-black/50 mb-0.5">Available From</p>
                    <p className="text-sm font-bold text-black">{activeThread.listing.availableFrom}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-white/40 hover:bg-white/60 text-black font-extrabold rounded-xl border border-white/40 shadow-sm transition-colors cursor-pointer text-sm">
                View Full Listing
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Messages;
