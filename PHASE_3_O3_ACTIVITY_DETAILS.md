# PHASE 3-O3: ACTIVITY DETAILS & TRACKING (PLACEHOLDER/CONTAINER)
## Build Individual Activity View & Progress Tracking UI

**Prompt ID:** 3-O3  
**Phase:** 3 - Parent Portal Frontend  
**Section:** O - PEP Builder  
**Dependencies:** 3-O2 complete (Activity Management working)  
**Estimated Time:** 30-35 minutes

---

## ⚠️ CRITICAL NOTE: THIS IS A PLACEHOLDER/CONTAINER PROMPT

**Continuing the placeholder approach**, this builds the STRUCTURE for individual activity tracking, NOT the actual smart suggestions or difficulty adjustment features.

### What O3 Builds (Container):
- ✅ Individual activity detail page
- ✅ Activity information display
- ✅ Completion history timeline
- ✅ Notes/observations section
- ✅ Photo/video attachment UI
- ✅ Progress tracking interface
- ✅ Integration point for "Adjust Difficulty"
- ✅ Props interfaces documented

### What O3 Does NOT Build:
- ❌ AI-powered difficulty adjustment
- ❌ Smart activity variations
- ❌ Automated progress analytics
- ❌ Activity recommendations based on progress

---

## 🎯 OBJECTIVE

Create the activity detail page CONTAINER:
- View complete activity information
- Display activity description and instructions
- Show completion history (dates completed)
- Add/view notes and observations
- Upload/view photos and videos
- Mark activity sessions as complete
- Track progress over time
- **Integration point**: "Adjust Difficulty" button
- **Integration point**: "Get Variations" button
- Simple progress visualization
- Edit activity details
- Delete activity
- Responsive layout

**Styling:** Match Frontend-clinician patterns with #2563EB blue + purple PEP theme

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 FUTURE INTEGRATION NOTES

### AI Difficulty Adjustment (To Be Integrated Later):

**Trigger Point:**
```typescript
// Button: Adjust activity difficulty based on child's progress
<button onClick={handleAdjustDifficulty}>
  Adjust Difficulty Level
</button>

// Future implementation:
const handleAdjustDifficulty = async () => {
  const suggestions = await genAIService.suggestDifficultyAdjustment({
    activityId,
    completionHistory,
    childProfile,
  });
  
  // AI will analyze:
  // - How many times completed
  // - Time between completions
  // - Parent notes (success/struggle indicators)
  // - Child's age progression
  
  // Returns variations:
  // - Easier version (if struggling)
  // - Harder version (if mastered)
  // - Alternative approach (if stuck)
};
```

**Integration Comment:**
```typescript
/* 
  ========================================================================
  GENAI INTEGRATION POINT: Difficulty Adjustment
  ========================================================================
  
  When GenAI service is ready, this will:
  1. Analyze activity completion patterns
  2. Review parent notes/observations
  3. Consider child's age and development
  4. Suggest:
     - Easier variations if child struggling
     - Harder variations if child excelling
     - Different approaches if progress stalled
  
  Example for "Balance Beam Walking":
  - Easier: "Walk on wide tape line on floor"
  - Current: "Walk on 4-inch balance beam"
  - Harder: "Walk backwards on balance beam"
  - Alternative: "Hop on one foot along line"
  
  Service: genAIService.adjustDifficulty(activityId, progressData)
  ========================================================================
*/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Update PEP Service with Activity Tracking Methods

**File:** `src/services/pep.service.ts`

**Action:** ADD activity tracking methods:

```typescript
// Add these interfaces and methods to the PEPService

export interface ActivityNote {
  id: string;
  activityId: string;
  note: string;
  createdAt: string;
}

export interface ActivityMedia {
  id: string;
  activityId: string;
  type: 'photo' | 'video';
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface ActivityCompletion {
  id: string;
  activityId: string;
  completedAt: string;
  duration?: number; // minutes
  notes?: string;
}

// Add to PEPService class:

async getActivityDetails(pepId: string, activityId: string): Promise<{ 
  success: boolean; 
  data: {
    activity: PEPActivity;
    notes: ActivityNote[];
    media: ActivityMedia[];
    completions: ActivityCompletion[];
  }
}> {
  const response = await api.get(`/parent/peps/${pepId}/activities/${activityId}/details`);
  return response.data;
}

async addActivityNote(pepId: string, activityId: string, note: string): Promise<{ success: boolean; data: ActivityNote }> {
  const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/notes`, { note });
  return response.data;
}

async deleteActivityNote(pepId: string, activityId: string, noteId: string): Promise<{ success: boolean }> {
  const response = await api.delete(`/parent/peps/${pepId}/activities/${activityId}/notes/${noteId}`);
  return response.data;
}

async uploadActivityMedia(pepId: string, activityId: string, formData: FormData): Promise<{ success: boolean; data: ActivityMedia }> {
  const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

async deleteActivityMedia(pepId: string, activityId: string, mediaId: string): Promise<{ success: boolean }> {
  const response = await api.delete(`/parent/peps/${pepId}/activities/${activityId}/media/${mediaId}`);
  return response.data;
}

async recordCompletion(pepId: string, activityId: string, data: { duration?: number; notes?: string }): Promise<{ success: boolean; data: ActivityCompletion }> {
  const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/completions`, data);
  return response.data;
}
```

---

### Step 2: Create Activity Details Page

**File:** `src/pages/ActivityDetails.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Calendar, Clock, StickyNote,
  Image as ImageIcon, Video, Upload, Trash2, Plus,
  TrendingUp, BarChart3, Sparkles, Edit, AlertCircle,
  Loader2, X, Camera, FileText
} from 'lucide-react';
import Layout from '../components/Layout';
import pepService, { 
  PEPActivity, ActivityNote, ActivityMedia, ActivityCompletion 
} from '../services/pep.service';

export default function ActivityDetails() {
  const { pepId, activityId } = useParams<{ pepId: string; activityId: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<PEPActivity | null>(null);
  const [notes, setNotes] = useState<ActivityNote[]>([]);
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [completions, setCompletions] = useState<ActivityCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showRecordCompletionModal, setShowRecordCompletionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [completionData, setCompletionData] = useState({ duration: '', notes: '' });
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');

  useEffect(() => {
    if (pepId && activityId) {
      loadActivityDetails();
    }
  }, [pepId, activityId]);

  const loadActivityDetails = async () => {
    if (!pepId || !activityId) return;

    try {
      const response = await pepService.getActivityDetails(pepId, activityId);
      if (response.success) {
        setActivity(response.data.activity);
        setNotes(response.data.notes || []);
        setMedia(response.data.media || []);
        setCompletions(response.data.completions || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load activity details:', error);
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!pepId || !activityId || !newNote.trim()) {
      alert('Please enter a note');
      return;
    }

    try {
      setProcessing(true);
      await pepService.addActivityNote(pepId, activityId, newNote);
      await loadActivityDetails();
      setShowAddNoteModal(false);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!pepId || !activityId) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await pepService.deleteActivityNote(pepId, activityId, noteId);
      await loadActivityDetails();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleUploadMedia = async () => {
    if (!pepId || !activityId || !selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (mediaCaption) {
        formData.append('caption', mediaCaption);
      }

      await pepService.uploadActivityMedia(pepId, activityId, formData);
      await loadActivityDetails();
      setShowUploadModal(false);
      setSelectedFile(null);
      setMediaCaption('');
    } catch (error) {
      console.error('Failed to upload media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!pepId || !activityId) return;
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      await pepService.deleteActivityMedia(pepId, activityId, mediaId);
      await loadActivityDetails();
    } catch (error) {
      console.error('Failed to delete media:', error);
      alert('Failed to delete media. Please try again.');
    }
  };

  const handleRecordCompletion = async () => {
    if (!pepId || !activityId) return;

    try {
      setProcessing(true);
      const data = {
        duration: completionData.duration ? parseInt(completionData.duration) : undefined,
        notes: completionData.notes || undefined,
      };

      await pepService.recordCompletion(pepId, activityId, data);
      await loadActivityDetails();
      setShowRecordCompletionModal(false);
      setCompletionData({ duration: '', notes: '' });
    } catch (error) {
      console.error('Failed to record completion:', error);
      alert('Failed to record completion. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  /* 
    ========================================================================
    GENAI INTEGRATION POINT: Difficulty Adjustment
    ========================================================================
    
    When GenAI service is ready, implement:
    
    const handleAdjustDifficulty = async () => {
      try {
        setProcessing(true);
        
        const suggestions = await genAIService.adjustDifficulty({
          activityId,
          completions: completions.length,
          recentCompletions: completions.slice(-5),
          parentNotes: notes,
          childAge: activity.childAge,
        });
        
        // Show modal with suggestions:
        // - Easier variation
        // - Current level
        // - Harder variation
        // - Alternative approach
        
        setDifficultySuggestions(suggestions);
        setShowDifficultyModal(true);
        
      } catch (error) {
        console.error('Failed to get difficulty suggestions:', error);
      } finally {
        setProcessing(false);
      }
    };
    
    AI will analyze:
    - Completion frequency (struggling vs. mastering)
    - Parent notes (positive vs. concerning observations)
    - Time between completions
    - Child's developmental progress
    
    Returns variations with different difficulty levels
    
    ========================================================================
  */

  const handleAdjustDifficulty = () => {
    alert('GenAI Integration Point: This will analyze progress and suggest easier/harder variations. Implementation pending.');
  };

  const handleGetVariations = () => {
    alert('GenAI Integration Point: This will suggest alternative approaches to the same skill. Implementation pending.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading activity...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!activity) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Activity Not Found</h2>
            <p className="text-slate-600 mb-6">This activity doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate(`/pep/${pepId}/activities`)}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Activities
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/pep/${pepId}/activities`)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Activities</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {activity.title}
              </h1>
              <p className="text-slate-600 text-base mb-4">
                {activity.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                  {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                  {activity.domain.charAt(0).toUpperCase() + activity.domain.slice(1)}
                </span>
                {activity.completed && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/pep/${pepId}/activities`)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2563EB]">{completions.length}</p>
              <p className="text-sm text-slate-600">Times Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{notes.length}</p>
              <p className="text-sm text-slate-600">Notes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{media.length}</p>
              <p className="text-sm text-slate-600">Photos/Videos</p>
            </div>
          </div>
        </div>

        {/* GenAI Integration Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-purple-600" size={24} />
              <h3 className="font-bold text-slate-900">Adjust Difficulty</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Get AI-powered suggestions for easier or harder variations based on progress.
            </p>
            <button
              onClick={handleAdjustDifficulty}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-all"
            >
              Suggest Difficulty Adjustments
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-[#2563EB]" size={24} />
              <h3 className="font-bold text-slate-900">Get Variations</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Discover alternative approaches to practice the same skill.
            </p>
            <button
              onClick={handleGetVariations}
              className="w-full px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all"
            >
              Show Activity Variations
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowRecordCompletionModal(true)}
            className="bg-white border-2 border-green-200 hover:border-green-300 rounded-xl p-4 text-left transition-all group"
          >
            <CheckCircle2 className="text-green-600 mb-2" size={28} />
            <h3 className="font-bold text-slate-900 mb-1">Record Completion</h3>
            <p className="text-sm text-slate-600">Mark this activity as completed</p>
          </button>

          <button
            onClick={() => setShowAddNoteModal(true)}
            className="bg-white border-2 border-blue-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group"
          >
            <StickyNote className="text-[#2563EB] mb-2" size={28} />
            <h3 className="font-bold text-slate-900 mb-1">Add Note</h3>
            <p className="text-sm text-slate-600">Record observations or progress</p>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-white border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 text-left transition-all group"
          >
            <Upload className="text-purple-600 mb-2" size={28} />
            <h3 className="font-bold text-slate-900 mb-1">Upload Media</h3>
            <p className="text-sm text-slate-600">Add photos or videos</p>
          </button>
        </div>

        {/* Completion History */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="text-[#2563EB]" size={24} />
              Completion History
            </h2>
          </div>

          {completions.length > 0 ? (
            <div className="space-y-3">
              {completions.map((completion) => (
                <div
                  key={completion.id}
                  className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle2 className="text-green-600 shrink-0" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {formatDate(completion.completedAt)}
                    </p>
                    {completion.duration && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Clock size={14} />
                        {completion.duration} minutes
                      </p>
                    )}
                    {completion.notes && (
                      <p className="text-sm text-slate-700 mt-1">{completion.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="mx-auto mb-2" size={40} />
              <p>No completions recorded yet</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <StickyNote className="text-[#2563EB]" size={24} />
              Notes & Observations
            </h2>
          </div>

          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <FileText className="text-[#2563EB] shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-slate-900">{note.note}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <StickyNote className="mx-auto mb-2" size={40} />
              <p>No notes yet</p>
            </div>
          )}
        </div>

        {/* Media Gallery */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Camera className="text-[#2563EB]" size={24} />
              Photos & Videos
            </h2>
          </div>

          {media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-slate-100 rounded-lg overflow-hidden aspect-square"
                >
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.caption || 'Activity media'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Video className="text-slate-400" size={40} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="size-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                      <p className="text-xs truncate">{item.caption}</p>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-white/90 text-xs font-bold rounded">
                      {item.type === 'photo' ? '📷' : '🎥'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Camera className="mx-auto mb-2" size={40} />
              <p>No photos or videos yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Record Completion Modal */}
      {showRecordCompletionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Record Completion</h3>
                <p className="text-sm text-slate-600">Mark activity as completed</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Duration (minutes) - Optional
                </label>
                <input
                  type="number"
                  value={completionData.duration}
                  onChange={(e) => setCompletionData({ ...completionData, duration: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                  placeholder="e.g., 15"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Notes - Optional
                </label>
                <textarea
                  value={completionData.notes}
                  onChange={(e) => setCompletionData({ ...completionData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                  placeholder="Any observations or notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRecordCompletionModal(false);
                  setCompletionData({ duration: '', notes: '' });
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordCompletion}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                <StickyNote className="text-[#2563EB]" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Note</h3>
                <p className="text-sm text-slate-600">Record observation or progress</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                placeholder="Enter your observation..."
                autoFocus
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setNewNote('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={processing || !newNote.trim()}
                className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Upload className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Upload Media</h3>
                <p className="text-sm text-slate-600">Add photos or videos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Select File
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                />
                {selectedFile && (
                  <p className="text-sm text-slate-600 mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Caption - Optional
                </label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                  placeholder="Add a caption..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setMediaCaption('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadMedia}
                disabled={processing || !selectedFile}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload</span>
                  </>
                )}
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

### Step 3: Update App.tsx with Activity Details Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import ActivityDetails from './pages/ActivityDetails';

// In the Routes section, add:
<Route
  path="/pep/:pepId/activities/:activityId"
  element={isAuthenticated ? <ActivityDetails /> : <Navigate to="/login" />}
/>
```

---

### Step 4: Update PEPActivities.tsx to Add "View Details" Link

**File:** `src/pages/PEPActivities.tsx`

**Action:** UPDATE activity cards to add a "View Details" button:

In the activity card action buttons section, add:

```typescript
<button
  onClick={() => navigate(`/pep/${id}/activities/${activity.id}`)}
  className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold text-sm transition-all"
  title="View Details"
>
  <Eye size={16} />
  <span>View Details</span>
</button>
```

---

### Step 5: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to PEP activities page
2. Click "View Details" on an activity
3. See activity details page
4. View stats (completions, notes, media)
5. Click "Adjust Difficulty" (shows placeholder alert)
6. Click "Get Variations" (shows placeholder alert)
7. Click "Record Completion"
8. Fill duration and notes, submit
9. See new completion in history
10. Click "Add Note"
11. Add a note, submit
12. See note appear
13. Click "Upload Media"
14. Select file, add caption
15. Upload and see in gallery
16. Delete note/media
17. Test responsive layout

---

## ✅ SUCCESS CRITERIA

1. ✅ PEP service updated with tracking methods
2. ✅ Activity details page created
3. ✅ Activity info displays
4. ✅ Stats cards show counts
5. ✅ GenAI integration buttons present
6. ✅ Record completion works
7. ✅ Completion history displays
8. ✅ Add note works
9. ✅ Notes list displays
10. ✅ Delete note works
11. ✅ Upload media works
12. ✅ Media gallery displays
13. ✅ Delete media works
14. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate from activities list
- [ ] Details page loads
- [ ] Activity info displays
- [ ] Stats accurate
- [ ] Click "Adjust Difficulty" (alert)
- [ ] Click "Get Variations" (alert)
- [ ] Click "Record Completion"
- [ ] Modal opens
- [ ] Fill duration and notes
- [ ] Submit works
- [ ] Completion appears in history
- [ ] Click "Add Note"
- [ ] Modal opens
- [ ] Type note
- [ ] Submit works
- [ ] Note appears in list
- [ ] Delete note works
- [ ] Click "Upload Media"
- [ ] Modal opens
- [ ] Select file
- [ ] Add caption
- [ ] Upload works
- [ ] Media appears in gallery
- [ ] Delete media works
- [ ] Back navigation works
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ Activity header with badges
- ✅ Stats grid (3 columns)
- ✅ GenAI integration cards (purple + blue)
- ✅ Quick action cards (3 columns)
- ✅ Completion history timeline
- ✅ Notes list with timestamps
- ✅ Media gallery grid (4 columns)
- ✅ Three modals (Completion, Note, Upload)
- ✅ #2563EB blue + purple accents
- ✅ Lucide React icons
- ✅ Hover effects on media

---

## ⏭️ NEXT PROMPT

**PHASE_3-O4** - Progress Tracking & Visualization

---

**Files Created:**
- ✅ `src/pages/ActivityDetails.tsx`

**Files Modified:**
- ✅ `src/services/pep.service.ts` (add tracking methods)
- ✅ `src/App.tsx`
- ✅ `src/pages/PEPActivities.tsx` (add View Details button)

**Mark complete and proceed to 3-O4** ✅
