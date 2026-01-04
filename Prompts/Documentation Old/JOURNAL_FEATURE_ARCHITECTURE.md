# JOURNALING FEATURE - ARCHITECTURE & INTEGRATION PLAN
## Parent-to-Clinician Communication via Timeline Journal

**Created:** January 3, 2026  
**Feature Type:** New Addition (Not in original 18 prompts)  
**Integration:** Dashboard + Navbar + New Section

---

## 🎯 FEATURE OVERVIEW

### What is the Journaling Feature?

A **LinkedIn-style post creation system** where parents can:
- Document their child's daily activities, milestones, observations
- Upload photos, videos, documents
- Add captions/comments to posts
- Share with clinicians who have consent/permission
- View timeline of all journal entries
- Edit/delete their own entries

### Who Sees What?

**Parents:**
- Can create, view, edit, delete their own journal entries
- See all entries for their children
- Control which clinicians can view via consent system

**Clinicians (Future - Professional Portal):**
- View journal entries for children they have consent to access
- Cannot edit parent entries
- Can comment/respond (future feature)
- Filter by child, date range, media type

---

## 📋 FEATURE SPECIFICATIONS

### Unified Journal Entry Structure:

```typescript
interface JournalEntry {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  
  // Entry Type - CRITICAL FOR UNIFIED SYSTEM
  entryType: 'general' | 'pep'; // General journal or PEP-related
  
  // PEP-specific fields (only if entryType === 'pep')
  pepId?: string;
  pepActivityId?: string;
  activityTitle?: string;
  activityCompletion?: boolean; // Was activity completed?
  activityDuration?: number; // Minutes spent
  
  // Content
  caption: string; // Main text content
  mediaType: 'photo' | 'video' | 'document' | 'none';
  mediaUrls: string[]; // Array of uploaded file URLs
  
  // Metadata
  timestamp: string; // Auto-generated
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  
  // Visibility
  visibility: 'private' | 'shared'; // Private or shared with clinicians
  sharedWithClinicianIds: string[]; // Which clinicians can see this
  
  // Engagement
  viewCount: number;
  comments?: Comment[]; // Future: Clinician comments
  
  // Tags/Categories
  tags?: string[]; // e.g., "milestone", "concern", "achievement", "motor-skill", "social-skill"
  mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
}

interface Comment {
  id: string;
  journalEntryId: string;
  clinicianId: string;
  clinicianName: string;
  text: string;
  createdAt: string;
}
```

---

## 🎨 UI/UX DESIGN SPECIFICATIONS

### 1. Dashboard Integration

**Location:** Main dashboard page  
**Component:** Large prominent "Journal" card/button

```
┌─────────────────────────────────────┐
│  📊 Dashboard                       │
├─────────────────────────────────────┤
│                                     │
│  [Child Switcher Tabs]              │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Stats    │  │ Stats    │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📝 Daily Journal           │   │
│  │  Document your child's      │   │
│  │  progress and milestones    │   │
│  │                             │   │
│  │  [Create Journal Entry] →   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Recent Entries - 2-3 preview]    │
└─────────────────────────────────────┘
```

### 2. Navbar Integration

**Location:** Top-right navbar (next to notifications)  
**Component:** Journal icon button

```
┌────────────────────────────────────────┐
│  Daira    [Nav Links]    🔔 📔 👤     │
└────────────────────────────────────────┘
                            ↑
                        Journal Icon
```

**Icon:** Book/Journal icon (Lucide: BookOpen or FileEdit)  
**Badge:** Number of entries this week (optional)

### 3. Create Journal Entry Modal

**LinkedIn-style composer:**

```
┌─────────────────────────────────────────┐
│  Create Journal Entry                   │
├─────────────────────────────────────────┤
│                                         │
│  Select Child: [Dropdown]               │
│                                         │
│  ┌────────────────────────────────┐    │
│  │ What's on your mind?           │    │
│  │                                │    │
│  │ Share an update, milestone,   │    │
│  │ or observation...              │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                         │
│  📎 Add Photos/Videos/Documents         │
│  [Upload Zone - Drag & Drop]            │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ IMG │ │ IMG │ │ VID │              │
│  └─────┘ └─────┘ └─────┘              │
│                                         │
│  🏷️ Add Tags (Optional)                │
│  [milestone] [concern] [achievement]   │
│                                         │
│  😊 Mood: [Happy] [Neutral] [Concerned]│
│                                         │
│  👁️ Visibility:                         │
│  ◉ Share with authorized clinicians    │
│  ○ Keep private                        │
│                                         │
│  [Cancel]  [Save Draft]  [Post] →      │
└─────────────────────────────────────────┘
```

### 4. Journal Timeline Page (Unified View)

**Full page view of all entries with filtering:**

```
┌─────────────────────────────────────────┐
│  ← Back    📝 Journal Timeline          │
├─────────────────────────────────────────┤
│                                         │
│  [Search] [Filter: All/General/PEP]    │
│  [Child Filter] [Date Range]           │
│  [Media: All/Photos/Videos]            │
│                                         │
│  ┌───────────────────────────────┐     │
│  │ 📷 Photo  Dec 15, 2024 3:45pm │     │
│  │ By: Parent Name               │     │
│  │ Child: Emma Thompson          │     │
│  │ 🏷️ PEP | Balance Beam Walking │     │
│  │                               │     │
│  │ [Photo Preview]               │     │
│  │                               │     │
│  │ "Emma completed the activity  │     │
│  │  today in 15 minutes! Great   │     │
│  │  balance improvement! 🎉"     │     │
│  │                               │     │
│  │ ✅ Activity Completed         │     │
│  │ ⏱️ Duration: 15 minutes        │     │
│  │                               │     │
│  │ 👁️ Shared with Dr. Smith       │     │
│  │                               │     │
│  │ [Edit] [Delete] [Share]       │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │ 📝 Note  Dec 14, 2024 7:20pm  │     │
│  │ By: Parent Name               │     │
│  │ Child: Emma Thompson          │     │
│  │ 🏷️ General | Milestone        │     │
│  │                               │     │
│  │ "Emma said her first three-   │     │
│  │  word sentence today!"        │     │
│  │                               │     │
│  │ 😊 Celebrating                │     │
│  │ 👁️ Shared with therapists      │     │
│  │                               │     │
│  │ [Edit] [Delete] [Share]       │     │
│  └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features:**
- **Unified Timeline**: Both PEP and General entries in one feed
- **Visual Distinction**: 
  - PEP entries have: 🏷️ PEP badge + activity name + completion status
  - General entries have: 🏷️ General badge
- **Filter by Type**: All/General/PEP dropdown
- **Chronological Order**: Newest first (default)
- **Search**: Across all entries
- **Child Filter**: Multi-child support

### 5. Entry Detail View

**Click on entry to see full view with clinician comments:**

```
┌─────────────────────────────────────────┐
│  ← Back to Timeline                     │
├─────────────────────────────────────────┤
│                                         │
│  Emma Thompson                          │
│  December 15, 2024 at 3:45 PM          │
│  Posted by: Sarah Thompson (Parent)    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [Full Size Image]          │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  "Emma took her first steps today!     │
│   So proud! We've been working on      │
│   balance exercises from her PEP."     │
│                                         │
│  🏷️ #milestone #motor-skills           │
│  😊 Celebrating                         │
│                                         │
│  👁️ Shared with:                        │
│  • Dr. Smith (Developmental Pediatrics)│
│  • Ms. Johnson (Speech Therapist)      │
│                                         │
│  ────────────────────────────────      │
│                                         │
│  💬 Comments (2)                        │
│                                         │
│  👨‍⚕️ Dr. Smith - Dec 15, 4:10 PM       │
│  "Wonderful progress! This aligns      │
│   perfectly with her motor goals."     │
│                                         │
│  👩‍⚕️ Ms. Johnson - Dec 15, 5:30 PM     │
│  "Great! Let's discuss this in our     │
│   next session."                       │
│                                         │
│  [Edit Entry] [Delete Entry]           │
│  [Share with More Clinicians]          │
└─────────────────────────────────────────┘
```

---

## 🔌 INTEGRATION POINTS

### 1. Dashboard Integration

**Component:** `Dashboard.tsx`

Add Journal card in Quick Actions section:

```typescript
<div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6">
  <div className="flex items-center gap-3 mb-3">
    <BookOpen className="text-purple-600" size={28} />
    <h3 className="text-lg font-bold text-slate-900">Daily Journal</h3>
  </div>
  <p className="text-sm text-slate-600 mb-4">
    Document milestones, share observations with your child's care team
  </p>
  <button
    onClick={() => setShowJournalModal(true)}
    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
  >
    Create Journal Entry
  </button>
  
  {/* Recent entries preview */}
  <div className="mt-4 pt-4 border-t border-purple-200">
    <p className="text-xs text-purple-700 mb-2">Recent Entries (3)</p>
    {/* Mini entry cards */}
  </div>
</div>
```

### 2. Navbar Integration

**Component:** `Layout.tsx`

Add journal icon button:

```typescript
<div className="flex items-center gap-4">
  {/* Notifications */}
  <button className="relative">
    <Bell size={20} />
    {notificationCount > 0 && <Badge />}
  </button>
  
  {/* Journal - NEW */}
  <button 
    onClick={() => navigate('/journal')}
    className="relative hover:text-purple-600 transition-colors"
    title="Journal"
  >
    <BookOpen size={20} />
    {recentEntriesCount > 0 && (
      <span className="absolute -top-1 -right-1 size-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
        {recentEntriesCount}
      </span>
    )}
  </button>
  
  {/* Profile */}
  <button>
    <User size={20} />
  </button>
</div>
```

### 3. Consent System Integration

**Link with existing consent system:**

When sharing journal entries, use existing consent structure:

```typescript
// Only show clinicians who have active consent
const authorizedClinicians = consents
  .filter(c => c.status === 'active' && c.childId === selectedChild.id)
  .map(c => ({
    id: c.professionalId,
    name: c.professionalName,
    role: c.professionalRole,
  }));

// Auto-share with all authorized clinicians by default
// or let parent select which ones
```

### 4. PEP Integration

**Automatic Journal Creation from PEP Activities:**

When parent performs any of these actions in PEP section:
- ✅ **Records Activity Completion** (O3: Activity Details page)
- 📝 **Adds Activity Note** (O3: Activity Details page)
- 📸 **Uploads Activity Media** (O3: Activity Details page)

**Automatic Behavior:**
```typescript
// When parent records completion with media/notes:
await pepService.recordCompletion(pepId, activityId, {
  duration: 15,
  notes: "Great progress on balance!"
});

// Automatically create journal entry:
await journalService.createJournalEntry({
  entryType: 'pep',
  pepId,
  pepActivityId: activityId,
  activityTitle: "Balance Beam Walking",
  activityCompletion: true,
  activityDuration: 15,
  caption: "Great progress on balance!",
  // ... other fields
});
```

**Result:**
- Parent sees completion in PEP activity history (O3 page)
- SAME entry appears in unified Journal timeline with "PEP" tag
- Clinicians see it in journal feed with PEP context
- No duplication - single source of truth

**Visual Distinction in Journal:**
```
┌─────────────────────────────────────┐
│ ✅ Activity Completed               │
│ 🏷️ PEP | Balance Beam Walking      │  ← PEP badge + activity name
│                                     │
│ Emma completed this activity in     │
│ 15 minutes today!                   │
│                                     │
│ Duration: 15 minutes                │  ← PEP-specific data
│ Category: Sports | Domain: Motor    │
│                                     │
│ [View Activity Details] →           │  ← Link to O3 page
└─────────────────────────────────────┘
```

```typescript
// Parent can create entries for any of their children
const selectedChild = children.find(c => c.id === formData.childId);

// Journal entries are child-specific
// Clinicians only see entries for children they have consent for
```

---

## 📁 FILE STRUCTURE

### New Files to Create:

```
Frontend-parent/
├── src/
│   ├── pages/
│   │   ├── JournalTimeline.tsx       # Main journal page
│   │   └── JournalEntryDetail.tsx    # Individual entry view
│   ├── components/
│   │   ├── JournalEntryCard.tsx      # Reusable entry card
│   │   ├── CreateJournalModal.tsx    # Create/edit modal
│   │   └── MediaUploader.tsx         # File upload component
│   ├── services/
│   │   └── journal.service.ts        # Journal API calls
```

### Routes to Add:

```typescript
// App.tsx
<Route path="/journal" element={<JournalTimeline />} />
<Route path="/journal/:id" element={<JournalEntryDetail />} />
```

---

## 🔧 BACKEND REQUIREMENTS CHECK

### Database Schema Needed:

```sql
-- Unified Journal Entries Table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  parent_id UUID REFERENCES parents(id),
  
  -- Entry Type
  entry_type VARCHAR(20) NOT NULL DEFAULT 'general', -- 'general' or 'pep'
  
  -- PEP-specific fields (only populated if entry_type = 'pep')
  pep_id UUID REFERENCES peps(id),
  pep_activity_id UUID REFERENCES pep_activities(id),
  activity_title VARCHAR(255),
  activity_completion BOOLEAN,
  activity_duration INTEGER, -- minutes
  
  -- Content
  caption TEXT,
  media_type VARCHAR(20),
  media_urls TEXT[], -- Array of file URLs
  
  -- Metadata
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  
  -- Visibility
  visibility VARCHAR(20) DEFAULT 'shared',
  tags TEXT[],
  mood VARCHAR(20)
);

-- Index for filtering by type
CREATE INDEX idx_journal_entry_type ON journal_entries(entry_type);
CREATE INDEX idx_journal_pep_id ON journal_entries(pep_id);
CREATE INDEX idx_journal_activity_id ON journal_entries(pep_activity_id);

-- Journal Entry Visibility (which clinicians can see)
CREATE TABLE journal_entry_visibility (
  id UUID PRIMARY KEY,
  journal_entry_id UUID REFERENCES journal_entries(id),
  clinician_id UUID REFERENCES professionals(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journal Comments (Future)
CREATE TABLE journal_comments (
  id UUID PRIMARY KEY,
  journal_entry_id UUID REFERENCES journal_entries(id),
  clinician_id UUID REFERENCES professionals(id),
  comment_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Changes:**
- Single `journal_entries` table for both types
- `entry_type` field distinguishes General vs PEP
- PEP-specific fields nullable (only used when entry_type = 'pep')
- Indexes for efficient filtering

### API Endpoints Needed:

```typescript
// Unified Journal Endpoints

// GET /api/v1/parent/journal?type=all|general|pep
// List all entries with optional type filter
// Returns: Array of JournalEntry

// GET /api/v1/parent/journal/:id
// Get single entry (general or PEP)
// Returns: JournalEntry

// POST /api/v1/parent/journal
// Create general journal entry
// Body: { childId, caption, mediaUrls, tags, mood, visibility }
// Returns: JournalEntry

// POST /api/v1/parent/journal/pep
// Create PEP journal entry (auto-triggered from PEP actions)
// Body: { 
//   childId, 
//   pepId, 
//   pepActivityId, 
//   activityTitle,
//   activityCompletion,
//   activityDuration,
//   caption, 
//   mediaUrls 
// }
// Returns: JournalEntry

// PUT /api/v1/parent/journal/:id
// Update entry (caption, tags, mood, visibility)
// Returns: JournalEntry

// DELETE /api/v1/parent/journal/:id
// Delete entry
// Returns: { success: true }

// POST /api/v1/parent/journal/:id/media
// Upload media to existing entry
// Returns: { mediaUrl: string }

// GET /api/v1/parent/journal/:id/comments
// Get comments (future - clinician responses)
// Returns: Array of Comment
```

**Integration with PEP Service:**
```typescript
// In pepService.recordCompletion():
// Automatically create journal entry when completion includes media/notes
if (data.notes || mediaUrls.length > 0) {
  await journalService.createPEPJournalEntry({
    entryType: 'pep',
    pepId,
    pepActivityId: activityId,
    activityTitle: activity.title,
    activityCompletion: true,
    activityDuration: data.duration,
    caption: data.notes,
    mediaUrls,
    // ... other fields
  });
}
```

**ACTION NEEDED:** Check if backend has these tables/endpoints, if not - plan backend development

---

## 📋 INTEGRATION PLAN - WHERE TO ADD

### Option 1: Add as New Prompt (Recommended)

**New Prompt:** PHASE_3-Q1 (Journal Feature)  
**Position:** After Section P (Settings)  
**Total Prompts:** 20 (was 19)

**Progress Impact:**
- Current: 14/19 = 74%
- With Journal: 14/20 = 70%
- After O2: 15/20 = 75%

### Option 2: Split into Multiple Prompts

**3-Q1:** Journal Timeline & Entry Cards  
**3-Q2:** Create/Edit Journal Modal with Media Upload  

Total: 21 prompts

### Option 3: Integrate into Existing Prompts (Not Recommended)

Could add to Dashboard (K2) or Settings (P2), but would make those prompts too large.

---

## 🎯 RECOMMENDED APPROACH

### Add Journal as Section Q (1-2 Prompts)

**PHASE 3-Q1: Journal Timeline & Create Entry (35-40 min)**
- Journal timeline page
- Entry cards with media
- Create journal modal
- Media upload
- Dashboard integration
- Navbar integration

**PHASE 3-Q2 (Optional - Future): Journal Comments & Advanced Features (30 min)**
- Entry detail view
- Clinician comments
- Advanced filters
- Export entries

---

## 🚀 IMMEDIATE NEXT STEPS

1. **Complete O2** (Activity Management) - Already created
2. **Create O3** (Activity Details) - Next
3. **Create O4** (Progress Tracking) - After O3
4. **Create P1** (Resource Library) - After O4
5. **Create P2** (Settings) - After P1
6. **Create Q1** (Journal) - After P2 ← **NEW**

---

## 📊 UPDATED ROADMAP

**Current Status:** O1 complete, O2 ready

**Remaining Work:**
- O2: Activity Management UI ← Execute next
- O3: Activity Details & Tracking
- O4: Progress Tracking & Visualization
- P1: Resource Library & Browse
- P2: Settings & Account Management
- **Q1: Journal Feature** ← NEW
- **Q2: Journal Advanced Features** ← OPTIONAL

**Total:** 20-21 prompts (added 1-2 for Journal)

---

## 💡 DESIGN NOTES

**Color Theme for Journal:**
- Primary: Purple (#9333EA or #A855F7)
- Accent: Blue (#2563EB) - existing
- Matches PEP purple theme
- Distinct from other sections

**Icons:**
- Main: BookOpen (Lucide)
- Upload: Upload, Paperclip
- Media: Image, Video, FileText
- Mood: Smile, Meh, Frown

**Key Features:**
- Drag & drop media upload
- Auto-save drafts
- Rich text editor (optional)
- @mention clinicians (future)
- Export to PDF
- Print friendly view

---

**Last Updated:** January 3, 2026  
**Status:** Architecture defined, ready to create Q1 prompt after P2  
**Backend Check:** REQUIRED before implementation
