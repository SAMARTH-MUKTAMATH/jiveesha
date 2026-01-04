# PHASE 3-L2: CHILD PROFILE VIEW
## Build Individual Child Profile Page

**Prompt ID:** 3-L2  
**Phase:** 3 - Parent Portal Frontend  
**Section:** L - Child Management  
**Dependencies:** 3-L1 complete (Children List working)  
**Estimated Time:** 35-40 minutes

---

## 🎯 OBJECTIVE

Create a detailed child profile page showing complete information:
- Child header with photo/avatar and key details
- Tabbed interface for different data sections
- Overview tab (basic info, age, gender)
- Medical history (full display)
- Current concerns (full display)
- Screening history timeline
- PEP progress summary
- Milestones tracker
- Action buttons (Edit, Delete, Share, Back)
- Responsive layout

**Design Reference:**
- `/stitch_jiveesha-parent_updated_ui/child_profile/`

**Styling:** Match Frontend-clinician patterns with #2563EB blue

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Child Profile Page

**File:** `src/pages/ChildProfile.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, Share2, Calendar, User, Activity,
  FileText, TrendingUp, Heart, AlertCircle, CheckCircle2,
  Clock, Download, Mail
} from 'lucide-react';
import Layout from '../components/Layout';
import childrenService, { Child } from '../services/children.service';

type TabType = 'overview' | 'medical' | 'concerns' | 'screenings' | 'pep' | 'milestones';

export default function ChildProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadChild(id);
    }
  }, [id]);

  const loadChild = async (childId: string) => {
    try {
      const response = await childrenService.getChild(childId);
      if (response.success) {
        setChild(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load child:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await childrenService.deleteChild(id);
      navigate('/children');
    } catch (error) {
      console.error('Failed to delete child:', error);
      alert('Failed to delete child. Please try again.');
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const age = childrenService.calculateAge(dateOfBirth);
    if (age.years === 0) {
      return `${age.months} months old`;
    } else if (age.years === 1) {
      return `1 year, ${age.months} months old`;
    } else {
      return `${age.years} years, ${age.months} months old`;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!child) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Child Not Found</h2>
            <p className="text-slate-600 mb-6">The child profile you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/children')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Children List
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical', label: 'Medical History', icon: FileText },
    { id: 'concerns', label: 'Current Concerns', icon: AlertCircle },
    { id: 'screenings', label: 'Screenings', icon: Activity },
    { id: 'pep', label: 'PEP Progress', icon: TrendingUp },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle2 },
  ];

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/children')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Children</span>
        </button>

        {/* Child Header Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header Background */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="size-24 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold text-3xl shadow-xl ring-4 ring-white">
                {getInitials(child.firstName, child.lastName)}
              </div>

              {/* Child Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {child.firstName} {child.lastName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Calendar size={16} className="text-[#2563EB]" />
                    <span className="font-semibold text-slate-700">
                      {calculateAge(child.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <User size={16} className="text-[#2563EB]" />
                    <span className="font-semibold text-slate-700 capitalize">
                      {child.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Heart size={16} className="text-[#2563EB]" />
                    <span className="font-semibold text-slate-700">
                      Born {formatDate(child.dateOfBirth)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/children/${child.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-lg font-semibold transition-all"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => navigate(`/children/${child.id}/share`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 rounded-lg font-semibold transition-all"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 bg-white">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'border-[#2563EB] text-[#2563EB] bg-blue-50'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Full Name</p>
                    <p className="text-lg font-bold text-slate-900">
                      {child.firstName} {child.lastName}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Date of Birth</p>
                    <p className="text-lg font-bold text-slate-900">{formatDate(child.dateOfBirth)}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Age</p>
                    <p className="text-lg font-bold text-slate-900">{calculateAge(child.dateOfBirth)}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Gender</p>
                    <p className="text-lg font-bold text-slate-900 capitalize">{child.gender}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-slate-700">
                    <strong>Profile Created:</strong> {formatDate(child.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Medical History</h2>
                
                {child.medicalHistory ? (
                  <div className="bg-slate-50 rounded-lg p-6">
                    <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                      {child.medicalHistory}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-600">No medical history recorded</p>
                    <button
                      onClick={() => navigate(`/children/${child.id}/edit`)}
                      className="mt-4 text-[#2563EB] font-semibold hover:underline"
                    >
                      Add Medical History
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Current Concerns Tab */}
            {activeTab === 'concerns' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Current Concerns</h2>
                
                {child.currentConcerns ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                      {child.currentConcerns}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-600">No current concerns recorded</p>
                    <button
                      onClick={() => navigate(`/children/${child.id}/edit`)}
                      className="mt-4 text-[#2563EB] font-semibold hover:underline"
                    >
                      Add Concerns
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Screenings Tab */}
            {activeTab === 'screenings' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Screening History</h2>
                  <button
                    onClick={() => navigate('/screening')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    <Activity size={18} />
                    <span>New Screening</span>
                  </button>
                </div>

                {/* Placeholder for screening history */}
                <div className="text-center py-12">
                  <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-600 mb-2">No screenings completed yet</p>
                  <p className="text-sm text-slate-500">
                    Screenings will appear here once completed
                  </p>
                </div>
              </div>
            )}

            {/* PEP Progress Tab */}
            {activeTab === 'pep' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">PEP Progress</h2>
                  <button
                    onClick={() => navigate('/pep')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    <TrendingUp size={18} />
                    <span>View PEP Builder</span>
                  </button>
                </div>

                {/* Placeholder for PEP progress */}
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-600 mb-2">No PEP created yet</p>
                  <p className="text-sm text-slate-500">
                    Create a Personalized Education Plan to track progress
                  </p>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Developmental Milestones</h2>

                {/* Placeholder for milestones */}
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-600 mb-2">No milestones tracked yet</p>
                  <p className="text-sm text-slate-500">
                    Milestones will be tracked through screenings and assessments
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Child Profile?</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{child.firstName} {child.lastName}</strong>'s profile? 
              This action cannot be undone and will permanently delete all associated data including 
              screenings, PEPs, and milestones.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
```

---

### Step 2: Update App.tsx with Child Profile Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import ChildProfile from './pages/ChildProfile';

// In the Routes section, add:
<Route
  path="/children/:id"
  element={isAuthenticated ? <ChildProfile /> : <Navigate to="/login" />}
/>
```

---

### Step 3: Update ChildrenList to Link to Profile

**File:** `src/pages/ChildrenList.tsx`

**Action:** The "View" button should already navigate to `/children/${child.id}`, verify it's working.

---

### Step 4: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to "My Children"
2. Click "View" button on a child card
3. Should navigate to child profile page
4. See child header with avatar and details
5. Click through all tabs (Overview, Medical, Concerns, etc.)
6. Click "Edit" button (will navigate to placeholder for now)
7. Click "Delete" button
8. See delete confirmation modal
9. Click "Cancel" to close modal
10. Click "Back to Children" button
11. Test on mobile/tablet/desktop

---

## ✅ SUCCESS CRITERIA

1. ✅ Child profile page created
2. ✅ Child header displays correctly
3. ✅ Avatar shows initials
4. ✅ Child details displayed (age, gender, DOB)
5. ✅ Tabs work and switch content
6. ✅ Overview tab shows basic info
7. ✅ Medical history tab displays content
8. ✅ Current concerns tab displays content
9. ✅ Empty states for screenings/PEP/milestones
10. ✅ Edit button present (placeholder navigation)
11. ✅ Delete button shows confirmation modal
12. ✅ Delete modal has cancel and confirm
13. ✅ Back button returns to children list
14. ✅ Share button present (placeholder)
15. ✅ Responsive layout works
16. ✅ Styling matches clinician patterns

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate to child profile from list
- [ ] Child header displays all details
- [ ] Avatar shows correct initials
- [ ] Age calculates correctly
- [ ] Tabs switch content smoothly
- [ ] Overview tab shows all fields
- [ ] Medical history displays if present
- [ ] Medical history shows empty state if blank
- [ ] Concerns display if present
- [ ] Concerns show empty state if blank
- [ ] Screenings tab shows placeholder
- [ ] PEP tab shows placeholder
- [ ] Milestones tab shows placeholder
- [ ] Edit button navigates (to placeholder)
- [ ] Delete button opens modal
- [ ] Delete modal cancel works
- [ ] Delete modal confirm deletes child
- [ ] After delete, redirects to children list
- [ ] Back button works
- [ ] Share button present
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)
- [ ] 404 state shows if child not found

---

## 🎨 DESIGN CONSISTENCY

- ✅ Header with gradient background
- ✅ Avatar with initials
- ✅ Badge-style info pills
- ✅ Tabbed interface
- ✅ Smooth tab transitions
- ✅ Empty states with icons
- ✅ Action buttons with icons
- ✅ Delete confirmation modal
- ✅ #2563EB blue color scheme
- ✅ Lucide React icons throughout
- ✅ Consistent spacing and shadows

---

## ⏭️ NEXT PROMPT

**PHASE_3-L3** - Add/Edit Child Flow

---

**Files Created:**
- ✅ `src/pages/ChildProfile.tsx`

**Files Modified:**
- ✅ `src/App.tsx`

**Mark complete and proceed to 3-L3** ✅
