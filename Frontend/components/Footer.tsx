
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-6 text-center border-t border-slate-100 bg-white z-20">
      <p className="text-slate-400 text-sm mb-2">
        &copy; 2024 Daira EdTech. All rights reserved.
      </p>
      <div className="flex justify-center gap-4 text-sm font-medium">
        <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
        <span className="text-slate-200">|</span>
        <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
