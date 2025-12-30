
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { getCurrentUser } from '../services/api';

interface HeaderProps {
  variant?: 'landing' | 'signup' | 'help' | 'dashboard';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogout?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'landing',
  activeTab = 'Dashboard',
  onTabChange,
  onAction,
  actionLabel,
  onSettingsClick,
  onHelpClick,
  onLogout,
  onSearchClick,
  onNotificationsClick,
  onLogoClick
}) => {
  const isDashboard = variant === 'dashboard';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get user info from localStorage
  const user = getCurrentUser();
  const userName = user?.profile ? `Dr. ${user.profile.first_name?.[0] || 'U'}. ${user.profile.last_name || 'User'}` : 'Dr. User';
  const userFullName = user?.profile ? `${user.profile.first_name || 'Dr.'} ${user.profile.last_name || 'User'}` : 'Dr. User';
  const userTitle = user?.profile?.professional_title || 'Healthcare Professional';
  const userSeed = user?.profile?.first_name || 'User';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (isDashboard && onLogoClick) {
      onLogoClick();
    } else if (isDashboard && onTabChange) {
      onTabChange('Dashboard');
    } else if (!isDashboard) {
      window.location.reload();
    }
  };

  return (
    <header className={`w-full h-20 flex items-center justify-between px-6 lg:px-12 bg-white border-b border-slate-100 z-50 ${isDashboard ? 'sticky top-0' : ''}`}>
      <div className="flex items-center gap-2 group cursor-pointer" onClick={handleLogoClick}>
        <div className="bg-[#2563EB] p-1.5 rounded-lg shadow-sm flex items-center justify-center">
          <Plus className="text-white" size={20} strokeWidth={3} />
        </div>
        <span className="text-xl font-bold text-[#1E40AF] tracking-tight">Daira</span>
      </div>

      {isDashboard && (
        <nav className="hidden lg:flex items-center gap-1">
          {['Dashboard', 'Patients', 'Consent', 'Diagnostics', 'Interventions'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1.6rem] left-0 w-full h-0.5 bg-[#2563EB]" />
              )}
            </button>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-4 lg:gap-6">
        {isDashboard ? (
          <>
            <button
              onClick={onSearchClick}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={onNotificationsClick}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-100 group cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline text-sm font-bold text-slate-700 group-hover:text-[#2563EB] transition-colors">{userName}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-sm font-black text-slate-900">{userFullName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userTitle}</p>
                  </div>
                  <button onClick={() => { onSettingsClick?.(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors flex items-center gap-2">
                    <Settings size={16} /> Profile & Settings
                  </button>
                  <button onClick={() => { onHelpClick?.(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors flex items-center gap-2">
                    <HelpCircle size={16} /> Help Center
                  </button>
                  <div className="h-px bg-slate-50 my-1" />
                  <button onClick={() => { onLogout?.(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {variant === 'signup' && onAction && (
              <button
                onClick={onAction}
                className="text-[#2563EB] font-bold hover:text-blue-700 transition-colors uppercase text-xs tracking-widest"
              >
                {actionLabel || 'Sign In'}
              </button>
            )}

            {variant === 'help' && (
              <button className="text-slate-500 font-medium hover:text-[#2563EB] transition-colors">
                Help
              </button>
            )}

            {variant === 'landing' && (
              <div className="flex items-center gap-8">
                <a href="#" className="hidden sm:block text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Features</a>
                <a href="#" className="hidden sm:block text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Resources</a>
                <button
                  onClick={onAction}
                  className="bg-blue-50 text-[#2563EB] px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#2563EB] hover:text-white transition-all shadow-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
