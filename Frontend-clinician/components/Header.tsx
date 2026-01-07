
import React, { useState, useRef, useEffect } from 'react';
import logo from '@common/logo.png';
import { Plus, Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { getCurrentUser } from '../services/api';
import { motion, LayoutGroup } from 'framer-motion';

const NavItem = ({ tab, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 py-2 text-sm font-semibold transition-colors duration-200 z-10 rounded-full
      ${active ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-700'}
    `}
  >
    {active && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute inset-0 shadow-sm border border-blue-100/50 rounded-full bg-slate-50 shadow-blue-100"
        style={{ zIndex: -1 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10">{tab}</span>
  </button>
);

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
  const [user, setUser] = useState(getCurrentUser());
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen for storage changes to update user info
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    const handleProfileUpdate = (event: CustomEvent) => {
      setUser(event.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('visibilitychange', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('visibilitychange', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);


  const rawFirstName = user?.profile?.firstName || user?.profile?.first_name || 'User';
  const cleanFirstName = rawFirstName.replace(/^Dr\.\s+/i, '');
  const rawLastName = user?.profile?.lastName || user?.profile?.last_name || '';

  const userName = user?.profile ? `Dr. ${cleanFirstName}${rawLastName ? ' ' + rawLastName[0] + '.' : ''}` : 'Dr. User';
  const userFullName = user?.profile ? `Dr. ${cleanFirstName} ${rawLastName}`.trim() : 'Dr. User';
  const userTitle = user?.profile?.professionalTitle || user?.profile?.professional_title || 'Healthcare Professional';
  const userSeed = user?.profile?.first_name || user?.profile?.firstName || 'User';

  // Get profile photo - check localStorage first, then API, then fallback to generated avatar
  const getProfilePhoto = () => {
    const storedPhoto = localStorage.getItem('clinician_photo');
    const apiPhoto = user?.profile?.photo_url;

    if (storedPhoto && storedPhoto.startsWith('data:')) {
      return storedPhoto;
    }
    if (apiPhoto && apiPhoto !== 'photo_exists') {
      if (apiPhoto.startsWith('http') || apiPhoto.startsWith('/')) {
        return apiPhoto;
      }
    }

    // 3. Fallback to gender-based static avatar
    const gender = user?.profile?.gender?.toLowerCase();
    if (gender === 'female') {
      return '/female-avatar.png';
    }
    if (gender === 'other') {
      return '/neutral-avatar.png';
    }
    // Default or male
    return '/male-avatar.png';
  };

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
    <header className={`w-full h-20 bg-white border-b border-slate-100 z-50 ${isDashboard ? 'sticky top-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Daira Logo" className="h-12 w-auto" />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 group-hover:text-[#2563EB] transition-colors">Clinical Portal</span>
          </div>
        </div>

        {isDashboard && (
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm">
            <LayoutGroup>
              {['Dashboard', 'Patients', 'Consent', 'Diagnostics', 'Interventions'].map((tab) => (
                <NavItem
                  key={tab}
                  tab={tab}
                  active={activeTab === tab}
                  onClick={() => onTabChange?.(tab)}
                />
              ))}
            </LayoutGroup>
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
                    <img src={getProfilePhoto()} alt="User" className="w-full h-full object-cover" />
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
      </div>
    </header>
  );
};

export default Header;
