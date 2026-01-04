# PHASE 3-Q1: JOURNAL FEATURE (UNIFIED SYSTEM)
## Build Unified Journal Timeline with PEP & General Entries

**Prompt ID:** 3-Q1  
**Phase:** 3 - Parent Portal Frontend  
**Section:** Q - Journal Feature (BONUS)  
**Dependencies:** 3-O3 complete (Activity Details working)  
**Estimated Time:** 40-45 minutes

---

## 🎯 OBJECTIVE

Create a unified journal system where parents can:
- **View unified timeline** of both PEP and General journal entries
- **Create General entries**: LinkedIn-style posts with photos/videos/documents
- **Auto-create PEP entries**: When completing activities (from O3)
- **Filter by type**: All / General / PEP
- **Filter by child**: Multi-child support
- **Search entries**: By keyword
- **Share with clinicians**: Via existing consent system
- **Add captions**: To all media uploads
- **Tag entries**: Milestone, concern, achievement, etc.
- **Set mood**: Happy, neutral, concerned, celebrating
- **View entry details**: Full view with media gallery
- Dashboard integration with quick access button
- Navbar icon for quick journal access

**Entry Types:**
- 🏷️ **General**: Parent-created milestones, observations, daily updates
- 🏷️ **PEP**: Auto-generated from activity completions (linked to O3)

**Styling:** Match Frontend-clinician patterns with #2563EB blue + purple accents for journal

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 INTEGRATION WITH EXISTING FEATURES

### Auto-Creation from PEP Activities (O3 Integration):

When parent records activity completion in **ActivityDetails.tsx (O3)**, automatically create journal entry:

```typescript
// In ActivityDetails.tsx - handleRecordCompletion() or handleUploadMedia()
// After successful completion/media upload:

if (completionData.notes || mediaUrls.length > 0) {
  await journalService.createPEPJournalEntry({
    childId: pep.childId,
    pepId: pep.id,
    pepActivityId: activity.id,
    activityTitle: activity.title,
    activityCompletion: true,
    activityDuration: completionData.duration,
    caption: completionData.notes || `Completed ${activity.title}`,
    mediaUrls: mediaUrls,
    category: activity.category,
    domain: activity.domain,
  });
}
```

This creates a **dual-purpose system**:
- Entry appears in O3 Activity Details completion history
- SAME entry appears in Journal Timeline with "PEP" badge
- Single source of truth, no duplication

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Journal Service

**File:** `src/services/journal.service.ts`

**Action:** CREATE this new file:

```typescript
import api from './api';

export interface JournalEntry {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  
  // Entry Type - CRITICAL
  entryType: 'general' | 'pep';
  
  // PEP-specific fields (only if entryType === 'pep')
  pepId?: string;
  pepActivityId?: string;
  activityTitle?: string;
  activityCompletion?: boolean;
  activityDuration?: number;
  activityCategory?: string; // sports, music, etc.
  activityDomain?: string; // motor, social, etc.
  
  // Content
  caption: string;
  mediaType: 'photo' | 'video' | 'document' | 'none';
  mediaUrls: string[];
  
  // Metadata
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  
  // Visibility
  visibility: 'private' | 'shared';
  sharedWithClinicianIds: string[];
  
  // Tags & Mood
  tags: string[]; // milestone, concern, achievement, motor-skill, social-skill
  mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
}

export interface CreateGeneralEntryData {
  childId: string;
  caption: string;
  mediaUrls?: string[];
  tags?: string[];
  mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
  visibility?: 'private' | 'shared';
}

export interface CreatePEPEntryData {
  childId: string;
  pepId: string;
  pepActivityId: string;
  activityTitle: string;
  activityCompletion: boolean;
  activityDuration?: number;
  activityCategory: string;
  activityDomain: string;
  caption: string;
  mediaUrls?: string[];
}

export interface JournalFilters {
  type?: 'all' | 'general' | 'pep';
  childId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

class JournalService {
  async getEntries(filters?: JournalFilters): Promise<{ success: boolean; data: JournalEntry[] }> {
    const params = filters || {};
    const response = await api.get('/parent/journal', { params });
    return response.data;
  }

  async getEntry(id: string): Promise<{ success: boolean; data: JournalEntry }> {
    const response = await api.get(`/parent/journal/${id}`);
    return response.data;
  }

  async createGeneralEntry(data: CreateGeneralEntryData): Promise<{ success: boolean; data: JournalEntry }> {
    const response = await api.post('/parent/journal', {
      ...data,
      entryType: 'general',
    });
    return response.data;
  }

  async createPEPEntry(data: CreatePEPEntryData): Promise<{ success: boolean; data: JournalEntry }> {
    const response = await api.post('/parent/journal/pep', {
      ...data,
      entryType: 'pep',
    });
    return response.data;
  }

  async updateEntry(id: string, data: Partial<JournalEntry>): Promise<{ success: boolean; data: JournalEntry }> {
    const response = await api.put(`/parent/journal/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/parent/journal/${id}`);
    return response.data;
  }

  async uploadMedia(file: File): Promise<{ success: boolean; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/parent/journal/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

export default new JournalService();
```

---

### Step 2: Create Journal Timeline Page

**File:** `src/pages/JournalTimeline.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Search, Filter, BookOpen, Calendar,
  Image as ImageIcon, Video, FileText, Tag, Smile, Meh,
  Frown, PartyPopper, Share2, Edit, Trash2, Eye, Sparkles,
  CheckCircle2, Clock, Activity, TrendingUp
} from 'lucide-react';
import Layout from '../components/Layout';
import journalService, { JournalEntry, JournalFilters } from '../services/journal.service';
import childService, { Child } from '../services/child.service';

type EntryTypeFilter = 'all' | 'general' | 'pep';

export default function JournalTimeline() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<EntryTypeFilter>('all');
  const [childFilter, setChildFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, typeFilter, childFilter, searchQuery]);

  const loadData = async () => {
    try {
      const [journalRes, childrenRes] = await Promise.all([
        journalService.getEntries(),
        childService.getChildren(),
      ]);

      if (journalRes.success) setEntries(journalRes.data);
      if (childrenRes.success) setChildren(childrenRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load journal:', error);
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.entryType === typeFilter);
    }

    // Filter by child
    if (childFilter !== 'all') {
      filtered = filtered.filter(e => e.childId === childFilter);
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.caption.toLowerCase().includes(query) ||
        e.childName.toLowerCase().includes(query) ||
        e.activityTitle?.toLowerCase().includes(query)
      );
    }

    setFilteredEntries(filtered);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Delete this journal entry?')) return;

    try {
      await journalService.deleteEntry(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const getMoodIcon = (mood?: string) => {
    const icons: any = {
      happy: Smile,
      neutral: Meh,
      concerned: Frown,
      celebrating: PartyPopper,
    };
    return mood ? icons[mood] : null;
  };

  const getMoodColor = (mood?: string) => {
    const colors: any = {
      happy: 'text-green-600',
      neutral: 'text-slate-600',
      concerned: 'text-orange-600',
      celebrating: 'text-purple-600',
    };
    return mood ? colors[mood] : 'text-slate-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading journal...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
              Family Timeline
            </p>
            <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Journal
            </h1>
            <p className="text-slate-600 text-base">
              Document milestones, activities, and daily observations
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
          >
            <Plus size={18} />
            <span>New Entry</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as EntryTypeFilter)}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
              >
                <option value="all">All Entries</option>
                <option value="general">General Only</option>
                <option value="pep">PEP Activities Only</option>
              </select>
            </div>

            {/* Child Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select
                value={childFilter}
                onChange={(e) => setChildFilter(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
              >
                <option value="all">All Children</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{entries.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-purple-700 mb-1">General</p>
            <p className="text-2xl font-bold text-purple-600">
              {entries.filter(e => e.entryType === 'general').length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-blue-700 mb-1">PEP</p>
            <p className="text-2xl font-bold text-blue-600">
              {entries.filter(e => e.entryType === 'pep').length}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const MoodIcon = getMoodIcon(entry.mood);
              const moodColor = getMoodColor(entry.mood);

              return (
                <div
                  key={entry.id}
                  className={`bg-white rounded-xl shadow-md border-2 overflow-hidden hover:shadow-lg transition-all ${
                    entry.entryType === 'pep'
                      ? 'border-blue-200'
                      : 'border-purple-200'
                  }`}
                >
                  {/* Header */}
                  <div className={`p-4 ${
                    entry.entryType === 'pep' ? 'bg-blue-50' : 'bg-purple-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            entry.entryType === 'pep'
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {entry.entryType.toUpperCase()}
                          </span>
                          {entry.entryType === 'pep' && entry.activityTitle && (
                            <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-bold">
                              {entry.activityTitle}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          {entry.childName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {formatDateShort(entry.timestamp)}
                        </p>
                      </div>

                      {/* Mood Icon */}
                      {MoodIcon && (
                        <div className={`size-10 rounded-full bg-white flex items-center justify-center ${moodColor}`}>
                          <MoodIcon size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media */}
                  {entry.mediaUrls.length > 0 && (
                    <div className={`grid ${
                      entry.mediaUrls.length === 1 ? 'grid-cols-1' :
                      entry.mediaUrls.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    } gap-2 p-4 bg-slate-50`}>
                      {entry.mediaUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square bg-slate-200 rounded-lg overflow-hidden">
                          {entry.mediaType === 'photo' ? (
                            <img
                              src={url}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : entry.mediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-300">
                              <Video className="text-slate-500" size={40} />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-300">
                              <FileText className="text-slate-500" size={40} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Caption */}
                  <div className="p-4">
                    <p className="text-slate-900 text-base leading-relaxed">
                      {entry.caption}
                    </p>
                  </div>

                  {/* PEP Activity Details */}
                  {entry.entryType === 'pep' && (
                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      {entry.activityCompletion && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      )}
                      {entry.activityDuration && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          <Clock size={14} />
                          {entry.activityDuration} min
                        </span>
                      )}
                      {entry.activityCategory && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          {entry.activityCategory}
                        </span>
                      )}
                      {entry.activityDomain && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                          {entry.activityDomain}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold"
                        >
                          <Tag size={12} />
                          {tag.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      {entry.visibility === 'shared' && (
                        <span className="flex items-center gap-1">
                          <Share2 size={14} className="text-[#2563EB]" />
                          Shared with clinicians
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/journal/${entry.id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      {entry.entryType === 'general' && (
                        <>
                          <button
                            onClick={() => navigate(`/journal/${entry.id}/edit`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg text-sm font-semibold transition-all"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {entries.length === 0 ? 'No Journal Entries Yet' : 'No Matching Entries'}
            </h3>
            <p className="text-slate-600 mb-6">
              {entries.length === 0
                ? 'Start documenting your child\'s journey!'
                : 'Try adjusting your filters or search query.'}
            </p>
            {entries.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
              >
                Create First Entry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Entry Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create Journal Entry</h3>
            <p className="text-slate-600 mb-6">
              Create entry modal will be implemented here with form for caption, media upload, tags, mood, etc.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
```

---

### Step 3: Update Dashboard to Add Journal Button

**File:** `src/pages/Dashboard.tsx`

**Action:** ADD journal card in the Quick Actions section:

```typescript
{/* Add after other action cards */}
<div
  onClick={() => navigate('/journal')}
  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all group"
>
  <div className="flex items-center gap-3 mb-3">
    <BookOpen className="text-purple-600" size={28} />
    <h3 className="text-lg font-bold text-slate-900">Daily Journal</h3>
  </div>
  <p className="text-sm text-slate-600 mb-4">
    Document milestones and share with your care team
  </p>
  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
    <span>View Timeline</span>
    <ArrowRight size={16} />
  </div>
</div>
```

Also add the imports:
```typescript
import { BookOpen, ArrowRight } from 'lucide-react';
```

---

### Step 4: Update Layout to Add Journal Icon in Navbar

**File:** `src/components/Layout.tsx`

**Action:** ADD journal icon button next to notifications:

```typescript
{/* Add in the top-right navbar section, between notifications and profile */}
<button
  onClick={() => navigate('/journal')}
  className="relative hover:text-purple-600 transition-colors"
  title="Journal"
>
  <BookOpen size={20} />
  {/* Optional: Badge for recent entries count */}
</button>
```

Import BookOpen:
```typescript
import { BookOpen } from 'lucide-react';
```

---

### Step 5: Update App.tsx with Journal Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import JournalTimeline from './pages/JournalTimeline';

// In the Routes section, add:
<Route
  path="/journal"
  element={isAuthenticated ? <JournalTimeline /> : <Navigate to="/login" />}
/>
```

---

### Step 6: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to /journal from dashboard or navbar
2. See unified timeline
3. View both General and PEP entries
4. Test type filter (All/General/PEP)
5. Test child filter
6. Test search functionality
7. Click "New Entry" (modal placeholder)
8. View entry details
9. Edit General entry
10. Delete General entry
11. Test responsive layout

---

## ✅ SUCCESS CRITERIA

1. ✅ Journal service created
2. ✅ Journal timeline page working
3. ✅ Unified timeline displays both types
4. ✅ Type filter works (All/General/PEP)
5. ✅ Child filter works
6. ✅ Search works
7. ✅ Stats cards accurate
8. ✅ PEP entries show activity details
9. ✅ General entries editable/deletable
10. ✅ Dashboard integration works
11. ✅ Navbar icon works
12. ✅ Entry cards styled correctly
13. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate to /journal
- [ ] Timeline loads
- [ ] Stats cards show counts
- [ ] See both entry types (if data exists)
- [ ] PEP entries have blue badge
- [ ] General entries have purple badge
- [ ] PEP entries show activity name
- [ ] PEP entries show completion badge
- [ ] PEP entries show duration
- [ ] PEP entries show category/domain
- [ ] Click type filter (All/General/PEP)
- [ ] Entries filter correctly
- [ ] Click child filter
- [ ] Entries filter by child
- [ ] Search by keyword
- [ ] Results update
- [ ] Click "New Entry"
- [ ] Modal opens (placeholder)
- [ ] Click "View" on entry
- [ ] Click "Edit" on General entry
- [ ] Click "Delete" on General entry
- [ ] Confirmation works
- [ ] Entry deleted
- [ ] Dashboard journal card works
- [ ] Navbar journal icon works
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ Unified timeline feed
- ✅ Entry cards with type badges
- ✅ PEP entries (blue theme)
- ✅ General entries (purple theme)
- ✅ Media grid display
- ✅ Activity details badges
- ✅ Tags with icons
- ✅ Mood icons
- ✅ Share status indicator
- ✅ Action buttons (View/Edit/Delete)
- ✅ Stats cards
- ✅ Search and filter bar
- ✅ Empty state
- ✅ Purple/blue color scheme
- ✅ Lucide React icons

---

## 🎉 PARENT PORTAL NOW 100% COMPLETE!

After this prompt, you will have completed **ALL Parent Portal features**:

**Sections Complete:**
- ✅ J: Authentication & Onboarding (2 prompts)
- ✅ K: Dashboard & Navigation (2 prompts)
- ✅ L: Child Management (3 prompts)
- ✅ M: Screening Containers (2 prompts)
- ✅ N: Consent & Sharing (4 prompts)
- ✅ O: PEP Builder (4 prompts)
- ✅ P: Resources & Settings (2 prompts)
- ✅ Q: Journal Feature (1 prompt) ← COMPLETE!

**Total Progress:** 20/20 prompts = 🎉 **100% COMPLETE!** 🎉

---

## ⏭️ NEXT STEPS

After Q1 completion:
1. **Dynamic Dashboard Routes** (4 prompts)
2. **Backend Gap Analysis** (collaborative planning)
3. **Backend Implementation** (~12 prompts)

---

## 📝 NOTES ON PEP INTEGRATION

The journal system is designed to integrate seamlessly with PEP Activity Details (O3):

**When parent in ActivityDetails.tsx:**
1. Records completion with notes
2. Uploads media to activity
3. Adds observations

**Automatically:**
- Create journal entry with `entryType: 'pep'`
- Include activity details (title, category, domain, duration)
- Link to PEP and activity IDs
- Entry appears in BOTH places:
  - O3: Activity completion history
  - Q1: Journal timeline with "PEP" badge

**User Experience:**
- Parent sees activity completion in activity page
- SAME completion appears in journal timeline
- Can click PEP entry to go back to activity details
- Single source of truth, no duplication

---

**Files Created:**
- ✅ `src/services/journal.service.ts`
- ✅ `src/pages/JournalTimeline.tsx`

**Files Modified:**
- ✅ `src/App.tsx`
- ✅ `src/pages/Dashboard.tsx`
- ✅ `src/components/Layout.tsx`

**Mark complete - PARENT PORTAL 100% DONE!** 🎊
