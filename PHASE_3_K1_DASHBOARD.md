# PHASE 3-K1: PARENT DASHBOARD
## Build Main Parent Dashboard (Using Figma Design + Clinician Styling)

**Prompt ID:** 3-K1  
**Phase:** 3 - Parent Portal Frontend  
**Section:** K - Dashboard & Navigation  
**Dependencies:** 3-J2 complete (Onboarding working)  
**Estimated Time:** 40-45 minutes

---

## 🎯 OBJECTIVE

Create the main parent dashboard using:
- **Design Structure:** From `/stitch_jiveesha-parent_updated_ui/parent_dashboard/`
- **UI Element Styling:** From `Frontend-clinician` components
- **Backend Integration:** Real data from Phase 2 APIs

**Key Features:**
- Child switcher tabs (switch between multiple children)
- Dashboard stats cards (Active Screenings, PEPs Due, Recommendations, Milestone Tracker)
- Alert banner for urgent items
- Main action card (next screening due)
- Milestone journey timeline
- Quick actions panel
- Messages/notifications sidebar
- Responsive layout matching Figma design

**Design Approach:**
- Follow Figma HTML structure for layout
- Apply Frontend-clinician color scheme (#2563EB, not #135bec)
- Use Lucide React icons (not Material Symbols)
- Keep Tailwind classes but adjust colors to match clinician
- Maintain responsive grid from Figma
- Add real API data integration

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📂 REFERENCE FILES

**Figma Design:**
- Structure: `/Users/anikaet/Downloads/Jiveesha-Clinical/stitch_jiveesha-parent_updated_ui/parent_dashboard/code.html`
- Visual: `/Users/anikaet/Downloads/Jiveesha-Clinical/stitch_jiveesha-parent_updated_ui/parent_dashboard/screen.png`

**Clinician Styling:**
- Reference: `/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-clinician/components/Dashboard.tsx`

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Dashboard Service

**File:** `src/services/dashboard.service.ts`

**Action:** CREATE this new file:

```typescript
import api from './api';

export interface DashboardStats {
  activeScreenings: number;
  pepsDue: number;
  newRecommendations: number;
  milestoneProgress: number;
}

export interface NextAction {
  id: string;
  type: 'screening' | 'pep' | 'appointment';
  title: string;
  description: string;
  dueDate: string;
  childId: string;
  childName: string;
  urgent: boolean;
}

export interface RecentMessage {
  id: string;
  from: string;
  fromRole: string;
  preview: string;
  timestamp: string;
  read: boolean;
}

class DashboardService {
  async getStats(childId?: string): Promise<{ success: boolean; data: DashboardStats }> {
    const params = childId ? { childId } : {};
    const response = await api.get('/parent/dashboard/stats', { params });
    return response.data;
  }

  async getNextAction(childId?: string): Promise<{ success: boolean; data: NextAction | null }> {
    const params = childId ? { childId } : {};
    const response = await api.get('/parent/dashboard/next-action', { params });
    return response.data;
  }

  async getRecentMessages(): Promise<{ success: boolean; data: RecentMessage[] }> {
    const response = await api.get('/parent/messages/recent');
    return response.data;
  }

  async getMilestones(childId: string): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get(`/parent/children/${childId}/milestones`);
    return response.data;
  }
}

export default new DashboardService();
```

---

### Step 2: Create Dashboard Layout Component

**File:** `src/components/Layout.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bell, Menu, X, LogOut, Settings, User } from 'lucide-react';
import authService from '../services/auth.service';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', active: true },
    { label: 'My Children', path: '/children', active: false },
    { label: 'Screening', path: '/screening', active: false },
    { label: 'Results', path: '/results', active: false },
    { label: 'PEP Builder', path: '/pep', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 py-3 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 text-[#2563EB]">
            <div className="size-8 flex items-center justify-center bg-blue-50 rounded-lg text-[#2563EB]">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Daira</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-sm font-semibold leading-normal transition-colors ${
                  link.active
                    ? 'text-[#2563EB]'
                    : 'text-slate-600 hover:text-[#2563EB]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex-1 flex justify-end mr-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-900 p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-full size-10 hover:bg-slate-100 transition-colors text-slate-900 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="bg-blue-100 rounded-full size-10 flex items-center justify-center text-[#2563EB] font-bold hover:bg-blue-200 transition-colors"
              >
                {user?.firstName?.[0] || 'U'}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <div className="border-t border-slate-200 my-2"></div>
                  <button
                    onClick={() => {
                      authService.logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm font-semibold py-2 px-4 rounded-lg text-left transition-colors ${
                    link.active
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <button className="hover:text-[#2563EB] transition-colors">English (US)</button>
            <button className="hover:text-[#2563EB] transition-colors">Accessibility</button>
            <button className="hover:text-[#2563EB] transition-colors">Data Privacy & Consent</button>
          </div>
          <p className="text-xs text-slate-500">© 2024 Daira. HIPAA Compliant.</p>
        </div>
      </footer>
    </div>
  );
}
```

---

### Step 3: Create Dashboard Page

**File:** `src/pages/Dashboard.tsx`

**Action:** CREATE this new file (following Figma structure with clinician styling):

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, FileText, Calendar, TrendingUp, AlertTriangle,
  ArrowRight, Download, Plus, CheckCircle, Clock,
  School, Stethoscope, ClipboardList, Save, MessageSquare
} from 'lucide-react';
import Layout from '../components/Layout';
import childrenService, { Child } from '../services/children.service';
import dashboardService, { DashboardStats } from '../services/dashboard.service';

export default function Dashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeScreenings: 0,
    pepsDue: 0,
    newRecommendations: 0,
    milestoneProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadChildStats(selectedChild.id);
    }
  }, [selectedChild]);

  const loadData = async () => {
    try {
      const childrenRes = await childrenService.getChildren();
      if (childrenRes.success && childrenRes.data.length > 0) {
        setChildren(childrenRes.data);
        setSelectedChild(childrenRes.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const loadChildStats = async (childId: string) => {
    try {
      const statsRes = await dashboardService.getStats(childId);
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const age = childrenService.calculateAge(dateOfBirth);
    if (age.years === 0) {
      return `${age.months} months`;
    }
    return `${age.years} ${age.years === 1 ? 'year' : 'years'}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
        {/* Header & Child Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Parent Dashboard</p>
            <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Good morning, {authService.getCurrentUser()?.firstName || 'Parent'}
            </h1>
            <p className="text-slate-600 text-base">Here's what's happening with your family today.</p>
          </div>

          {/* Child Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-1 md:pb-0">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`group flex items-center gap-3 rounded-full pl-2 pr-5 py-2 shadow-sm transition-all whitespace-nowrap ${
                  selectedChild?.id === child.id
                    ? 'bg-white border-2 border-[#2563EB]'
                    : 'bg-white/50 hover:bg-white border border-slate-200'
                }`}
              >
                <div className="bg-blue-100 text-[#2563EB] rounded-full size-8 flex items-center justify-center font-bold text-sm">
                  {child.firstName[0]}
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-bold leading-none ${
                    selectedChild?.id === child.id ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {child.firstName}
                  </span>
                  <span className={`text-xs font-semibold ${
                    selectedChild?.id === child.id ? 'text-[#2563EB]' : 'text-slate-500'
                  }`}>
                    {calculateAge(child.dateOfBirth)}
                  </span>
                </div>
              </button>
            ))}

            <button
              onClick={() => navigate('/onboarding/add-child')}
              className="flex items-center justify-center gap-2 bg-transparent border border-dashed border-slate-400 rounded-full px-4 py-2 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add Child</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Screenings */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-[-10px] top-[-10px] bg-blue-50 size-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div>
              <p className="text-slate-600 text-sm font-semibold">Active Screenings</p>
              <p className="text-slate-900 text-3xl font-bold mt-1">{stats.activeScreenings}</p>
            </div>
            <div className="flex items-center gap-1 text-[#2563EB] text-xs font-semibold">
              <Clock size={14} />
              <span>In progress</span>
            </div>
          </div>

          {/* PEPs Due */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-[-10px] top-[-10px] bg-orange-50 size-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div>
              <p className="text-slate-600 text-sm font-semibold">PEPs Due</p>
              <p className="text-slate-900 text-3xl font-bold mt-1">{stats.pepsDue}</p>
            </div>
            <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
              <AlertTriangle size={14} />
              <span>Due this week</span>
            </div>
          </div>

          {/* New Recommendations */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-[-10px] top-[-10px] bg-green-50 size-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div>
              <p className="text-slate-600 text-sm font-semibold">New Recommendations</p>
              <p className="text-slate-900 text-3xl font-bold mt-1">{stats.newRecommendations}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
              <FileText size={14} />
              <span>Check results</span>
            </div>
          </div>

          {/* Milestone Tracker */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer hover:border-[#2563EB]">
            <div className="absolute right-[-10px] top-[-10px] bg-purple-50 size-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div>
              <p className="text-slate-600 text-sm font-semibold">Milestone Tracker</p>
              <p className="text-slate-900 text-3xl font-bold mt-1">{stats.milestoneProgress}%</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.milestoneProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Actions & Progress */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Alert Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="text-amber-900 font-bold text-sm">Professional Review Recommended</h3>
                <p className="text-amber-800 text-sm mt-1">
                  Based on recent screening inputs for {selectedChild?.firstName}'s motor skills, 
                  we recommend scheduling a brief review with a clinician.
                </p>
              </div>
              <button className="text-amber-700 font-semibold text-sm hover:underline whitespace-nowrap">
                Review
              </button>
            </div>

            {/* Main Action Card */}
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-100 to-blue-200 h-48 md:h-auto relative flex items-center justify-center">
                <Heart className="text-[#2563EB] opacity-20" size={120} />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800">
                  Due: Oct 24
                </div>
              </div>
              <div className="p-6 flex flex-col justify-center flex-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      Urgent
                    </span>
                    <span className="text-slate-600 text-xs">Developmental Screening</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">18-Month Comprehensive Check</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    It's time to check in on {selectedChild?.firstName}'s communication, gross motor, 
                    fine motor, problem-solving, and personal-social skills. This takes about 15 minutes.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                    <span>Start Screening</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download size={16} />
                    PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Milestone Journey</h3>
                <button className="text-[#2563EB] text-sm font-semibold hover:underline">
                  View History
                </button>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Desktop: Horizontal Line */}
                <div className="hidden md:block absolute top-4 left-0 w-full h-1 bg-slate-200 rounded-full z-0"></div>
                {/* Mobile: Vertical Line */}
                <div className="md:hidden absolute top-4 left-4 w-1 h-full bg-slate-200 rounded-full z-0"></div>

                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6 md:gap-0">
                  {/* 6 Months (Completed) */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white">
                      <CheckCircle size={16} />
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-slate-900">6 Months</p>
                      <p className="text-xs text-green-600 font-semibold">Completed</p>
                    </div>
                  </div>

                  {/* 12 Months (Completed) */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white">
                      <CheckCircle size={16} />
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-slate-900">12 Months</p>
                      <p className="text-xs text-green-600 font-semibold">Completed</p>
                    </div>
                  </div>

                  {/* 18 Months (Current) */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="size-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center ring-4 ring-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]">
                      <span className="text-xs font-bold">18m</span>
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-[#2563EB]">18 Months</p>
                      <p className="text-xs text-[#2563EB] font-semibold">In Progress</p>
                    </div>
                  </div>

                  {/* 24 Months (Future) */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="size-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center ring-4 ring-white">
                      <span className="text-xs font-bold">24m</span>
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-slate-400">24 Months</p>
                      <p className="text-xs text-slate-400">Upcoming</p>
                    </div>
                  </div>

                  {/* 3 Years (Locked) */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="size-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center ring-4 ring-white">
                      <span className="text-xs font-bold">3y</span>
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-slate-400">3 Years</p>
                      <p className="text-xs text-slate-400">Locked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Messages */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-[#2563EB] border border-transparent hover:border-blue-200">
                  <ClipboardList size={24} />
                  <span className="text-xs font-bold text-center">View PEP</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-600 border border-transparent hover:border-purple-200">
                  <Stethoscope size={24} />
                  <span className="text-xs font-bold text-center">Clinician</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-600 border border-transparent hover:border-emerald-200">
                  <Save size={24} />
                  <span className="text-xs font-bold text-center">Save Offline</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 border border-transparent hover:border-slate-200"
                >
                  <Settings size={24} />
                  <span className="text-xs font-bold text-center">Profile</span>
                </button>
              </div>
            </div>

            {/* Messages Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Messages</h3>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                {/* Message 1 */}
                <button className="w-full p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                      <School size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">Mrs. Anderson (Teacher)</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {selectedChild?.firstName} showed great progress in group play today! 
                        Just wanted to share a quick update...
                      </p>
                      <p className="text-xs text-slate-400 mt-2">10:30 AM</p>
                    </div>
                  </div>
                </button>

                {/* Message 2 */}
                <button className="w-full p-4 hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Stethoscope size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">Dr. Smith (Pediatrician)</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        The results from the last screening are ready for your review. Please login to...
                      </p>
                      <p className="text-xs text-slate-400 mt-2">Yesterday</p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                <button
                  onClick={() => navigate('/messages')}
                  className="text-[#2563EB] text-xs font-bold hover:underline"
                >
                  View All Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

---

### Step 4: Update App.tsx with Dashboard Route

**File:** `src/App.tsx`

**Action:** UPDATE to use the new Dashboard component:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import AddChild from './pages/AddChild';
import Dashboard from './pages/Dashboard';
import authService from './services/auth.service';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/welcome"
          element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding/add-child"
          element={isAuthenticated ? <AddChild /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### Step 5: Add Missing Import to Dashboard

**File:** `src/pages/Dashboard.tsx`

**Action:** ADD missing import at top:

```typescript
import authService from '../services/auth.service';
```

---

### Step 6: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Login with parent account
2. Should see dashboard with child tabs
3. Click child tabs to switch between children
4. See stat cards with numbers
5. View milestone timeline
6. Check quick actions panel
7. Review messages panel
8. Test responsive layout on mobile

---

## ✅ SUCCESS CRITERIA

1. ✅ Dashboard service created with API methods
2. ✅ Layout component with navigation created
3. ✅ Dashboard page matches Figma structure
4. ✅ Child switcher tabs working
5. ✅ Stats cards display correctly
6. ✅ Alert banner shows
7. ✅ Main action card displays
8. ✅ Milestone timeline renders
9. ✅ Quick actions panel functional
10. ✅ Messages panel displays
11. ✅ Navigation menu works
12. ✅ Responsive layout (mobile + desktop)
13. ✅ Colors match Frontend-clinician (#2563EB)
14. ✅ Icons from Lucide React
15. ✅ Footer with privacy links

---

## 🧪 TESTING CHECKLIST

- [ ] Dashboard loads after login
- [ ] Child tabs display all children
- [ ] Clicking child tab switches active child
- [ ] Stats cards show correct numbers
- [ ] Stats update when switching children
- [ ] Alert banner displays
- [ ] Main action card shows next screening
- [ ] Milestone timeline shows progress
- [ ] Quick actions buttons work
- [ ] Messages panel scrolls
- [ ] "View All Messages" button works
- [ ] Top navigation links work
- [ ] Profile dropdown works
- [ ] Logout works
- [ ] Mobile menu toggles on small screens
- [ ] Footer links present
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1200px+)

---

## 🎨 DESIGN CONSISTENCY

**Figma Structure:** ✅
- Grid layout matches
- Child switcher at top
- Stats in 4-column grid
- 2/3 + 1/3 column split
- Milestone timeline horizontal
- Quick actions 2x2 grid
- Messages with scrolling

**Clinician Styling:** ✅
- Blue color #2563EB (not #135bec)
- Lucide icons (not Material Symbols)
- Same shadow styles
- Same border radius
- Same hover states
- Same font weights
- Consistent spacing

---

## ⏭️ NEXT PROMPT

**PHASE_3-K2** - Navigation & Layout Enhancements

---

**Files Created:**
- ✅ `src/services/dashboard.service.ts`
- ✅ `src/components/Layout.tsx`
- ✅ `src/pages/Dashboard.tsx`

**Files Modified:**
- ✅ `src/App.tsx`

**Mark complete and proceed to 3-K2** ✅
