# PHASE 3-N4: EDIT CONSENT PERMISSIONS
## Build Dynamic Permission Editor for Active Consents

**Prompt ID:** 3-N4  
**Phase:** 3 - Parent Portal Frontend  
**Section:** N - Consent & Sharing  
**Dependencies:** 3-N3 complete (Professional Referrals working)  
**Estimated Time:** 30-35 minutes

---

## 🎯 OBJECTIVE

Create functionality to dynamically edit permissions for active consents:
- Edit permissions modal accessible from consent cards
- Toggle individual data types (screenings, PEPs, medical history, etc.)
- Real-time permission updates
- Visual feedback for changes
- Confirmation before saving
- Update expiration date
- View permission change history
- Prevent removing all permissions (at least one required)
- Success/error notifications
- Works from both Consent Management and Professional Referrals pages

**Styling:** Match Frontend-clinician patterns with #2563EB blue

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Edit Consent Permissions Page

**File:** `src/pages/EditConsentPermissions.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, X, Shield, Activity, TrendingUp, FileText,
  CheckCircle2, Calendar, Clock, AlertCircle, Loader2, Edit,
  History, ToggleLeft, ToggleRight
} from 'lucide-react';
import Layout from '../components/Layout';
import consentService, { Consent } from '../services/consent.service';

export default function EditConsentPermissions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [editedPermissions, setEditedPermissions] = useState({
    screenings: false,
    peps: false,
    medicalHistory: false,
    assessments: false,
    reports: false,
  });

  const [originalPermissions, setOriginalPermissions] = useState({
    screenings: false,
    peps: false,
    medicalHistory: false,
    assessments: false,
    reports: false,
  });

  useEffect(() => {
    if (id) {
      loadConsent(id);
    }
  }, [id]);

  useEffect(() => {
    // Check if permissions have changed
    const changed = JSON.stringify(editedPermissions) !== JSON.stringify(originalPermissions);
    setHasChanges(changed);
  }, [editedPermissions, originalPermissions]);

  const loadConsent = async (consentId: string) => {
    try {
      const response = await consentService.getConsent(consentId);
      if (response.success) {
        setConsent(response.data);
        setEditedPermissions(response.data.permissions);
        setOriginalPermissions(response.data.permissions);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load consent:', error);
      setError('Failed to load consent details');
      setLoading(false);
    }
  };

  const togglePermission = (key: keyof typeof editedPermissions) => {
    const newPermissions = { ...editedPermissions, [key]: !editedPermissions[key] };
    
    // Check if at least one permission remains enabled
    const hasActivePermission = Object.values(newPermissions).some(Boolean);
    
    if (!hasActivePermission) {
      setError('At least one permission must be enabled');
      return;
    }

    setEditedPermissions(newPermissions);
    setError('');
  };

  const handleSave = async () => {
    if (!id) return;

    // Validate at least one permission is selected
    const hasActivePermission = Object.values(editedPermissions).some(Boolean);
    if (!hasActivePermission) {
      setError('At least one permission must be enabled');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await consentService.updatePermissions(id, editedPermissions);
      
      // Reload consent to get updated data
      await loadConsent(id);
      setHasChanges(false);
      
      // Show success message
      alert('Permissions updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) return;
    }
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPermissionChanges = () => {
    const changes: { type: string; action: 'added' | 'removed' }[] = [];
    
    Object.keys(editedPermissions).forEach((key) => {
      const k = key as keyof typeof editedPermissions;
      const original = originalPermissions[k];
      const edited = editedPermissions[k];
      
      if (original !== edited) {
        changes.push({
          type: key,
          action: edited ? 'added' : 'removed',
        });
      }
    });
    
    return changes;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading consent...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!consent) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Consent Not Found</h2>
            <p className="text-slate-600 mb-6">This consent doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/consent')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Consents
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const permissionItems = [
    {
      key: 'screenings',
      label: 'Screening Results',
      icon: Activity,
      description: 'M-CHAT, ASQ, and other developmental screening assessments',
      color: 'blue',
    },
    {
      key: 'peps',
      label: 'Personalized Education Plans',
      icon: TrendingUp,
      description: 'PEP goals, activities, and progress tracking data',
      color: 'purple',
    },
    {
      key: 'medicalHistory',
      label: 'Medical History',
      icon: FileText,
      description: 'Health conditions, diagnoses, and medical background',
      color: 'green',
    },
    {
      key: 'assessments',
      label: 'Professional Assessments',
      icon: CheckCircle2,
      description: 'Clinical evaluations, diagnoses, and professional reports',
      color: 'orange',
    },
    {
      key: 'reports',
      label: 'Progress Reports',
      icon: Calendar,
      description: 'Developmental progress, milestone tracking, and reports',
      color: 'teal',
    },
  ];

  const changes = getPermissionChanges();

  return (
    <Layout>
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="text-[#2563EB]" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Permissions</h1>
              <p className="text-slate-600 mb-3">
                Manage data access for <strong>{consent.professionalName}</strong>
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                  <Calendar size={14} className="text-[#2563EB]" />
                  <span className="text-slate-700">
                    Granted: {formatDate(consent.grantedAt)}
                  </span>
                </div>
                {consent.expiresAt && (
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock size={14} className="text-[#2563EB]" />
                    <span className="text-slate-700">
                      Expires: {formatDate(consent.expiresAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Professional:</span>
              <span className="font-bold text-slate-900">{consent.professionalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Role:</span>
              <span className="font-bold text-slate-900">{consent.professionalRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Facility:</span>
              <span className="font-bold text-slate-900">{consent.facility}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Child:</span>
              <span className="font-bold text-slate-900">{consent.childName}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Changes Summary */}
        {hasChanges && changes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="text-[#2563EB]" size={20} />
              <h3 className="font-bold text-slate-900">Pending Changes ({changes.length})</h3>
            </div>
            <div className="space-y-2">
              {changes.map((change, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {change.action === 'added' ? (
                    <CheckCircle2 className="text-green-600" size={16} />
                  ) : (
                    <X className="text-red-600" size={16} />
                  )}
                  <span className="text-slate-700">
                    <strong>{change.type.replace(/([A-Z])/g, ' $1').trim()}</strong>{' '}
                    will be <strong>{change.action === 'added' ? 'enabled' : 'disabled'}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permissions Editor */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Data Permissions</h2>

          <div className="space-y-4">
            {permissionItems.map((item) => {
              const Icon = item.icon;
              const isEnabled = editedPermissions[item.key as keyof typeof editedPermissions];
              const ToggleIcon = isEnabled ? ToggleRight : ToggleLeft;

              return (
                <div
                  key={item.key}
                  className={`border-2 rounded-xl p-5 transition-all ${
                    isEnabled
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`size-12 rounded-lg flex items-center justify-center ${
                        isEnabled
                          ? `bg-${item.color}-100`
                          : 'bg-slate-100'
                      }`}
                    >
                      <Icon
                        className={isEnabled ? `text-${item.color}-600` : 'text-slate-400'}
                        size={24}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{item.label}</h3>
                        {isEnabled && (
                          <span className={`px-2 py-0.5 bg-${item.color}-100 text-${item.color}-700 text-xs font-bold rounded`}>
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{item.description}</p>

                      {/* Toggle Button */}
                      <button
                        onClick={() => togglePermission(item.key as keyof typeof editedPermissions)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          isEnabled
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-[#2563EB] hover:bg-blue-700 text-white'
                        }`}
                      >
                        <ToggleIcon size={18} />
                        <span>{isEnabled ? 'Disable Access' : 'Enable Access'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Note */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> At least one permission must remain enabled. Changes take effect immediately after saving.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {!hasChanges && (
            <p className="text-sm text-slate-500 text-center mt-3">
              Make changes to enable the save button
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
```

---

### Step 2: Update App.tsx with Edit Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import EditConsentPermissions from './pages/EditConsentPermissions';

// In the Routes section, add:
<Route
  path="/consent/:id/edit"
  element={isAuthenticated ? <EditConsentPermissions /> : <Navigate to="/login" />}
/>
```

---

### Step 3: Update ConsentManagement.tsx to Add Edit Button

**File:** `src/pages/ConsentManagement.tsx`

**Action:** ADD an "Edit" button to each consent card:

In the consent card actions section, add:

```typescript
{consent.status === 'active' && (
  <button
    onClick={() => navigate(`/consent/${consent.id}/edit`)}
    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold transition-all text-sm"
  >
    <Edit size={16} />
    <span>Edit</span>
  </button>
)}
```

---

### Step 4: Update ProfessionalReferrals.tsx to Add Edit Button

**File:** `src/pages/ProfessionalReferrals.tsx`

**Action:** ADD "Edit" to the action buttons grid:

Update the action buttons section to include 4 buttons instead of 3:

```typescript
<div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200">
  <button
    onClick={() => navigate(`/consent/${consent.id}/edit`)}
    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
    title="Edit Permissions"
  >
    <Edit size={18} />
    <span className="text-xs font-semibold">Edit</span>
  </button>
  <button
    onClick={() => {
      setSelectedConsent(consent);
      setShowDataModal(true);
    }}
    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#2563EB]"
    title="View Shared Data"
  >
    <Eye size={18} />
    <span className="text-xs font-semibold">View</span>
  </button>
  <button
    onClick={() => {
      setSelectedConsent(consent);
      setShowMessageModal(true);
    }}
    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
    title="Send Message"
  >
    <MessageSquare size={18} />
    <span className="text-xs font-semibold">Message</span>
  </button>
  {consent.status === 'active' && (
    <button
      onClick={() => {
        setSelectedConsent(consent);
        setShowRevokeModal(true);
      }}
      className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
      title="Revoke Access"
    >
      <Trash2 size={18} />
      <span className="text-xs font-semibold">Revoke</span>
    </button>
  )}
</div>
```

Also add the Edit import at the top:
```typescript
import { Edit } from 'lucide-react';
```

---

### Step 5: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to /consent or /referrals
2. Click "Edit" button on an active consent
3. See edit permissions page
4. Toggle permissions on/off
5. See "Pending Changes" summary update
6. Try to disable all permissions (should show error)
7. Enable/disable different combinations
8. Click "Save Changes"
9. See success message
10. Return to consent list
11. Verify permissions updated
12. Test "Cancel" with unsaved changes
13. Test responsive layout

---

## ✅ SUCCESS CRITERIA

1. ✅ Edit permissions page created
2. ✅ Professional and consent info displayed
3. ✅ All 5 permission types listed
4. ✅ Toggle buttons work for each permission
5. ✅ Visual feedback (enabled/disabled states)
6. ✅ Pending changes summary shows
7. ✅ Prevents disabling all permissions
8. ✅ Save button disabled when no changes
9. ✅ Save updates permissions
10. ✅ Success notification shown
11. ✅ Cancel with confirmation works
12. ✅ Edit button in ConsentManagement
13. ✅ Edit button in ProfessionalReferrals
14. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate from consent list via Edit button
- [ ] Navigate from referrals via Edit button
- [ ] Professional info displays correctly
- [ ] All 5 permissions show
- [ ] Toggle screenings on/off
- [ ] Toggle PEPs on/off
- [ ] Toggle medical history on/off
- [ ] Toggle assessments on/off
- [ ] Toggle reports on/off
- [ ] Pending changes summary updates
- [ ] Try to disable all permissions (error shows)
- [ ] At least one must remain enabled
- [ ] Save button disabled initially
- [ ] Save button enabled after changes
- [ ] Save updates permissions successfully
- [ ] Success message appears
- [ ] Returns to previous page after save
- [ ] Cancel shows confirmation if changes
- [ ] Cancel without changes works immediately
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ Permission cards with icons
- ✅ Toggle buttons with icons
- ✅ Enabled/disabled visual states
- ✅ Pending changes summary with icons
- ✅ Professional info card
- ✅ Save/Cancel action buttons
- ✅ Color-coded permission categories
- ✅ #2563EB blue color scheme
- ✅ Lucide React icons
- ✅ Smooth toggle transitions

---

## 🎉 SECTION N NOW FULLY COMPLETE!

After this prompt, you will have completed **all of Section N: Consent & Sharing**:
- ✅ 3-N1: Consent Management UI
- ✅ 3-N2: Share with Professional Flow
- ✅ 3-N3: Professional Referrals View
- ✅ 3-N4: Edit Consent Permissions ← NEW!

**Total Progress:** 12/19 prompts = 63% complete (added 1 extra prompt)

---

## ⏭️ NEXT SECTION

**PHASE_3-O** - PEP Builder (4 prompts)

---

**Files Created:**
- ✅ `src/pages/EditConsentPermissions.tsx`

**Files Modified:**
- ✅ `src/App.tsx`
- ✅ `src/pages/ConsentManagement.tsx`
- ✅ `src/pages/ProfessionalReferrals.tsx`

**Mark complete and proceed to Section O (PEP Builder)** ✅
