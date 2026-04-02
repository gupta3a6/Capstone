import React from 'react';
import { THEME } from '../../../constants/theme';

export const Support = () => {
  return (
    <div className={`min-h-[calc(100vh-80px)] flex items-center justify-center ${THEME.light.classes.text} px-4`}>
      <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 p-10 sm:p-14 rounded-3xl shadow-2xl max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-300">
        <h1 className="text-4xl font-extrabold mb-4 text-black">
          Experiencing an issue?
        </h1>
        <p className="text-xl opacity-90 mb-8 font-medium">We can help!</p>
        
        <div className="space-y-3">
          <p className="opacity-80">Contact us at:</p>
          <a 
            href="mailto:sub4you.co@gmail.com" 
            className="inline-block text-xl font-bold text-[#00A6E4] hover:text-[#40ffaa] hover:underline underline-offset-4 transition-colors duration-200"
          >
            sub4you.co@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Support;
