import { useState } from 'react';
import { THEME } from '../../../constants/theme';

export const ListerSupport = () => {
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');

  const mailtoUrl = `mailto:sub4you.co@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(context)}`;

  return (
    <div className={`min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4`}>
      <div className={`text-center bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-xl w-full transform transition-transform duration-300 ${THEME.light.classes.text}`}>
        <h1 className="text-4xl font-extrabold mb-3 text-black">
          Experiencing an issue?
        </h1>
        <p className="text-lg opacity-90 mb-8 font-medium">Drop us a line and we'll help get it sorted!</p>
        
        <div className="space-y-6 text-left">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2 opacity-90">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this concerning?"
              required
              className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00A6E4]/50 focus:border-transparent transition-all`}
            />
          </div>

          <div>
            <label htmlFor="context" className="block text-sm font-medium mb-2 opacity-90">How can we help?</label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide some details about the issue..."
              required
              rows={5}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${THEME.light.classes.text} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00A6E4]/50 focus:border-transparent transition-all resize-none`}
            />
          </div>

          <a
            href={subject.trim() && context.trim() ? mailtoUrl : '#'}
            onClick={(e) => {
              if (!subject.trim() || !context.trim()) {
                e.preventDefault();
                alert('Please fill out both the subject and the details of your issue before sending.');
              }
            }}
            className="block text-center w-full py-4 rounded-xl font-bold text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #00A6E4 0%, #40ffaa 100%)',
              backgroundSize: '200% auto',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}
          >
            Send Email
          </a>
        </div>

        <div className="mt-8 text-sm opacity-80 pt-6 border-t border-white/10">
          Or email us directly at{' '}
          <a href="mailto:sub4you.co@gmail.com" className="font-bold text-[#00A6E4] hover:text-[#40ffaa] hover:underline transition-colors">
            sub4you.co@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListerSupport;
