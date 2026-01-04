# PHASE 3-M1: SCREENING CONTAINER & NAVIGATION
## Build Screening Framework Integration Structure (PLACEHOLDER/CONTAINER ONLY)

**Prompt ID:** 3-M1  
**Phase:** 3 - Parent Portal Frontend  
**Section:** M - Screening  
**Dependencies:** 3-L3 complete (Child Management complete)  
**Estimated Time:** 35-40 minutes

---

## 🎯 OBJECTIVE

**CRITICAL:** This prompt builds PLACEHOLDER/CONTAINER pages only!

Create the routing and container structure for screening frameworks:
- Screening selection page (choose which screening to start)
- Screening in-progress container (where M-CHAT/ASQ frameworks will be inserted)
- Clearly marked integration points for pre-coded frameworks
- Props interfaces for framework components
- Navigation and state management
- Save/continue later functionality
- **NO actual screening questions** - those come from your pre-coded frameworks

**Design Reference:**
- `/stitch_jiveesha-parent_updated_ui/screening_flow_(parent)__1/`
- `/stitch_jiveesha-parent_updated_ui/screening_flow_(parent)__2/`

**Styling:** Match Frontend-clinician patterns with #2563EB blue

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Screening Service

**File:** `src/services/screening.service.ts`

**Action:** CREATE this new file:

```typescript
import api from './api';

export interface ScreeningType {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  duration: string;
  category: string;
}

export interface Screening {
  id: string;
  childId: string;
  screeningTypeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  responses: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
  results?: any;
}

export interface StartScreeningData {
  childId: string;
  screeningTypeId: string;
}

class ScreeningService {
  async getScreeningTypes(): Promise<{ success: boolean; data: ScreeningType[] }> {
    const response = await api.get('/parent/screenings/types');
    return response.data;
  }

  async startScreening(data: StartScreeningData): Promise<{ success: boolean; data: Screening }> {
    const response = await api.post('/parent/screenings/start', data);
    return response.data;
  }

  async getScreening(id: string): Promise<{ success: boolean; data: Screening }> {
    const response = await api.get(`/parent/screenings/${id}`);
    return response.data;
  }

  async saveProgress(id: string, responses: Record<string, any>, progress: number): Promise<{ success: boolean }> {
    const response = await api.put(`/parent/screenings/${id}/progress`, { responses, progress });
    return response.data;
  }

  async completeScreening(id: string, responses: Record<string, any>): Promise<{ success: boolean; data: any }> {
    const response = await api.post(`/parent/screenings/${id}/complete`, { responses });
    return response.data;
  }

  async getScreeningHistory(childId?: string): Promise<{ success: boolean; data: Screening[] }> {
    const params = childId ? { childId } : {};
    const response = await api.get('/parent/screenings', { params });
    return response.data;
  }
}

export default new ScreeningService();
```

---

### Step 2: Create Screening Selection Page

**File:** `src/pages/ScreeningSelect.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Activity, Clock, Users, Baby, PlayCircle,
  CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';
import Layout from '../components/Layout';
import screeningService, { ScreeningType } from '../services/screening.service';
import childrenService, { Child } from '../services/children.service';

export default function ScreeningSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedChildId = searchParams.get('childId');

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [screeningTypes, setScreeningTypes] = useState<ScreeningType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [childrenRes, typesRes] = await Promise.all([
        childrenService.getChildren(),
        screeningService.getScreeningTypes(),
      ]);

      if (childrenRes.success) {
        setChildren(childrenRes.data);
        if (preSelectedChildId) {
          const child = childrenRes.data.find(c => c.id === preSelectedChildId);
          if (child) setSelectedChild(child);
        } else if (childrenRes.data.length === 1) {
          setSelectedChild(childrenRes.data[0]);
        }
      }

      if (typesRes.success) {
        setScreeningTypes(typesRes.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handleStartScreening = async (screeningTypeId: string) => {
    if (!selectedChild) {
      alert('Please select a child first');
      return;
    }

    try {
      const response = await screeningService.startScreening({
        childId: selectedChild.id,
        screeningTypeId,
      });

      if (response.success) {
        navigate(`/screening/${response.data.id}/start`);
      }
    } catch (error) {
      console.error('Failed to start screening:', error);
      alert('Failed to start screening. Please try again.');
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const age = childrenService.calculateAge(dateOfBirth);
    if (age.years === 0) {
      return `${age.months} months`;
    }
    return `${age.years} years`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'developmental':
        return Baby;
      case 'behavioral':
        return Activity;
      case 'social':
        return Users;
      default:
        return Activity;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading screenings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
            Developmental Screening
          </p>
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Start a New Screening
          </h1>
          <p className="text-slate-600 text-base">
            Choose a screening tool to track your child's developmental progress
          </p>
        </div>

        {/* Child Selection */}
        {children.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Select Child</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    selectedChild?.id === child.id
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                    {getInitials(child.firstName, child.lastName)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900">{child.firstName} {child.lastName}</p>
                    <p className="text-sm text-slate-600">{calculateAge(child.dateOfBirth)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {children.length === 1 && selectedChild && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
              {getInitials(selectedChild.firstName, selectedChild.lastName)}
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Screening for: {selectedChild.firstName} {selectedChild.lastName}
              </p>
              <p className="text-sm text-slate-600">
                Age: {calculateAge(selectedChild.dateOfBirth)}
              </p>
            </div>
          </div>
        )}

        {/* No Children State */}
        {children.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <AlertCircle className="mx-auto text-amber-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Children Added</h3>
            <p className="text-slate-700 mb-4">
              You need to add a child before starting a screening.
            </p>
            <button
              onClick={() => navigate('/onboarding/add-child')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Add Child
            </button>
          </div>
        )}

        {/* Screening Types Grid */}
        {children.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screeningTypes.map((type) => {
              const Icon = getCategoryIcon(type.category);
              
              return (
                <div
                  key={type.id}
                  className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 relative">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-slate-700 capitalize">
                        {type.category}
                      </span>
                    </div>
                    <Icon className="text-[#2563EB] mb-3" size={32} />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{type.name}</h3>
                    <p className="text-sm text-slate-700 line-clamp-2">{type.description}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={16} className="text-[#2563EB]" />
                      <span className="font-medium">Age Range: {type.ageRange}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span className="font-medium">Duration: {type.duration}</span>
                    </div>

                    <button
                      onClick={() => handleStartScreening(type.id)}
                      disabled={!selectedChild}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlayCircle size={18} />
                      <span>Start Screening</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Placeholder for when no screening types */}
        {screeningTypes.length === 0 && children.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <Activity className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Screening Types Available
            </h3>
            <p className="text-slate-600">
              Screening tools will appear here once configured by your administrator.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
```

---

### Step 3: Create Screening In-Progress Container

**File:** `src/pages/ScreeningInProgress.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, X, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Layout from '../components/Layout';
import screeningService, { Screening } from '../services/screening.service';
import childrenService from '../services/children.service';

export default function ScreeningInProgress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [screening, setScreening] = useState<Screening | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadScreening(id);
    }
  }, [id]);

  const loadScreening = async (screeningId: string) => {
    try {
      const response = await screeningService.getScreening(screeningId);
      if (response.success) {
        setScreening(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load screening:', error);
      setLoading(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!id || !screening) return;

    try {
      setSaving(true);
      await screeningService.saveProgress(id, screening.responses, screening.progress);
      alert('Progress saved! You can continue later.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save progress:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!id || !screening) return;

    try {
      await screeningService.completeScreening(id, screening.responses);
      navigate(`/screening/${id}/results`);
    } catch (error) {
      console.error('Failed to complete screening:', error);
      alert('Failed to complete screening. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading screening...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!screening) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Screening Not Found</h2>
            <p className="text-slate-600 mb-6">This screening doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/screening/select')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Start New Screening
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Header with Progress */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Screening in Progress</h1>
              <p className="text-slate-600">Complete the questions below</p>
            </div>
            <button
              onClick={handleSaveProgress}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save & Continue Later</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-700">Progress</p>
              <p className="text-sm font-bold text-[#2563EB]">{screening.progress}% Complete</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-[#2563EB] h-3 rounded-full transition-all duration-500"
                style={{ width: `${screening.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 
          ====================================================================
          INTEGRATION POINT: YOUR PRE-CODED SCREENING FRAMEWORK GOES HERE
          ====================================================================
          
          This is where you'll insert your M-CHAT, ASQ, or other screening
          framework components.
          
          Example Integration:
          
          {screening.screeningTypeId === 'mchat' && (
            <MChatFramework
              screeningId={screening.id}
              responses={screening.responses}
              onProgressUpdate={(responses, progress) => {
                setScreening({ ...screening, responses, progress });
              }}
              onComplete={handleComplete}
            />
          )}
          
          {screening.screeningTypeId === 'asq' && (
            <ASQFramework
              screeningId={screening.id}
              responses={screening.responses}
              onProgressUpdate={(responses, progress) => {
                setScreening({ ...screening, responses, progress });
              }}
              onComplete={handleComplete}
            />
          )}
          
          ====================================================================
        */}

        {/* PLACEHOLDER CONTENT - Remove this when you add your frameworks */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
              <AlertCircle className="text-[#2563EB]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Screening Framework Integration Point
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              This is a placeholder. Your pre-coded M-CHAT, ASQ, or other screening 
              framework components will be integrated here.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
              <p className="text-sm font-semibold text-slate-700 mb-2">Integration Details:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Screening ID: <code className="bg-white px-2 py-1 rounded">{screening.id}</code></li>
                <li>• Screening Type: <code className="bg-white px-2 py-1 rounded">{screening.screeningTypeId}</code></li>
                <li>• Child ID: <code className="bg-white px-2 py-1 rounded">{screening.childId}</code></li>
                <li>• Status: <code className="bg-white px-2 py-1 rounded">{screening.status}</code></li>
                <li>• Progress: <code className="bg-white px-2 py-1 rounded">{screening.progress}%</code></li>
              </ul>
            </div>
          </div>
        </div>
        {/* END PLACEHOLDER */}

        {/* Action Buttons (for testing - remove when framework is integrated) */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
          >
            <CheckCircle2 size={18} />
            <span>Complete Screening (Test)</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
```

---

### Step 4: Update App.tsx with Screening Routes

**File:** `src/App.tsx`

**Action:** ADD the new routes:

```typescript
import ScreeningSelect from './pages/ScreeningSelect';
import ScreeningInProgress from './pages/ScreeningInProgress';

// In the Routes section, add:
<Route
  path="/screening/select"
  element={isAuthenticated ? <ScreeningSelect /> : <Navigate to="/login" />}
/>
<Route
  path="/screening/:id/start"
  element={isAuthenticated ? <ScreeningInProgress /> : <Navigate to="/login" />}
/>
```

---

### Step 5: Update Layout Navigation

**File:** `src/components/Layout.tsx`

**Action:** UPDATE the navLinks to make "Screening" link active:

```typescript
const navLinks = [
  { label: 'Dashboard', path: '/dashboard', active: window.location.pathname === '/dashboard' },
  { label: 'My Children', path: '/children', active: window.location.pathname === '/children' },
  { label: 'Screening', path: '/screening/select', active: window.location.pathname.startsWith('/screening') },
  { label: 'Results', path: '/results', active: false },
  { label: 'PEP Builder', path: '/pep', active: false },
];
```

---

### Step 6: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to "Screening" in top navigation
2. Should see screening selection page
3. Select a child (if multiple)
4. See screening type cards
5. Click "Start Screening" on a type
6. Should navigate to in-progress page
7. See placeholder content with integration instructions
8. Click "Save & Continue Later"
9. Should save and redirect to dashboard
10. Test "Cancel" button
11. Test responsive layout

---

## ✅ SUCCESS CRITERIA

1. ✅ Screening service created
2. ✅ Screening selection page working
3. ✅ Child selection functional
4. ✅ Screening type cards display
5. ✅ Start screening creates new screening
6. ✅ In-progress page loads screening
7. ✅ Progress bar displays
8. ✅ Integration point clearly marked
9. ✅ Save progress works
10. ✅ Placeholder content explains integration
11. ✅ Navigation updated
12. ✅ Routing works correctly
13. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate to /screening/select
- [ ] Child selection works
- [ ] Screening types display
- [ ] Can start a screening
- [ ] Redirects to in-progress page
- [ ] Progress bar shows
- [ ] Placeholder content visible
- [ ] Integration instructions clear
- [ ] Save & Continue Later button works
- [ ] Cancel returns to dashboard
- [ ] Test Complete button (placeholder)
- [ ] Navigation highlights "Screening"
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ Screening type cards match child cards style
- ✅ Category icons and badges
- ✅ Progress bar styling
- ✅ #2563EB blue color scheme
- ✅ Lucide React icons
- ✅ Consistent shadows and borders
- ✅ Smooth transitions

---

## 📝 INTEGRATION NOTES FOR YOUR FRAMEWORKS

**Props Your Frameworks Should Accept:**
```typescript
interface ScreeningFrameworkProps {
  screeningId: string;
  responses: Record<string, any>;
  onProgressUpdate: (responses: Record<string, any>, progress: number) => void;
  onComplete: () => void;
}
```

**Integration Location:**
- File: `src/pages/ScreeningInProgress.tsx`
- Look for: `INTEGRATION POINT` comment block
- Replace: Placeholder content with your framework components

**Example:**
```typescript
{screening.screeningTypeId === 'mchat' && (
  <MChatFramework
    screeningId={screening.id}
    responses={screening.responses}
    onProgressUpdate={(responses, progress) => {
      setScreening({ ...screening, responses, progress });
    }}
    onComplete={handleComplete}
  />
)}
```

---

## ⏭️ NEXT PROMPT

**PHASE_3-M2** - Screening History & Results Container

---

**Files Created:**
- ✅ `src/services/screening.service.ts`
- ✅ `src/pages/ScreeningSelect.tsx`
- ✅ `src/pages/ScreeningInProgress.tsx`

**Files Modified:**
- ✅ `src/App.tsx`
- ✅ `src/components/Layout.tsx`

**Mark complete and proceed to 3-M2** ✅
