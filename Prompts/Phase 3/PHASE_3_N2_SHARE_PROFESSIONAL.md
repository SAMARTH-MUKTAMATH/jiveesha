# PHASE 3-N2: SHARE WITH PROFESSIONAL FLOW
## Build Data Sharing Wizard with Token Generation

**Prompt ID:** 3-N2  
**Phase:** 3 - Parent Portal Frontend  
**Section:** N - Consent & Sharing  
**Dependencies:** 3-N1 complete (Consent Management working)  
**Estimated Time:** 35-40 minutes

---

## 🎯 OBJECTIVE

Create a multi-step wizard for sharing child data with professionals:
- Child selection step
- Professional information form
- Data permissions selection (checkboxes)
- Access duration options (time-limited or permanent)
- Optional message to professional
- Generate shareable access token
- Display token with copy functionality
- Email token option
- Confirmation step
- Responsive multi-step layout

**Design Reference:**
- `/stitch_jiveesha-parent_updated_ui/consent_&_share_(parent_view)_/`

**Styling:** Match Frontend-clinician patterns with #2563EB blue

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Share with Professional Page

**File:** `src/pages/ShareWithProfessional.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Mail, User, Building2, Clock,
  Shield, FileText, Activity, TrendingUp, Copy, Check,
  Send, Calendar, AlertCircle, CheckCircle2
} from 'lucide-react';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import childrenService, { Child } from '../services/children.service';
import consentService, { GrantConsentData } from '../services/consent.service';

const steps = [
  { label: 'Select Child', description: 'Choose child' },
  { label: 'Professional Info', description: 'Enter details' },
  { label: 'Permissions', description: 'Select data' },
  { label: 'Review & Share', description: 'Confirm' },
];

interface FormData {
  childId: string;
  professionalEmail: string;
  professionalName: string;
  facility: string;
  permissions: {
    screenings: boolean;
    peps: boolean;
    medicalHistory: boolean;
    assessments: boolean;
    reports: boolean;
  };
  accessDuration: 'permanent' | '30days' | '90days' | '1year';
  message: string;
}

export default function ShareWithProfessional() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenCopied, setTokenCopied] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    childId: '',
    professionalEmail: '',
    professionalName: '',
    facility: '',
    permissions: {
      screenings: false,
      peps: false,
      medicalHistory: false,
      assessments: false,
      reports: false,
    },
    accessDuration: '1year',
    message: '',
  });

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const response = await childrenService.getChildren();
      if (response.success) {
        setChildren(response.data);
        if (response.data.length === 1) {
          setFormData(prev => ({ ...prev, childId: response.data[0].id }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load children:', error);
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.childId) {
          setError('Please select a child');
          return false;
        }
        break;
      case 1:
        if (!formData.professionalEmail) {
          setError('Professional email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.professionalEmail)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.professionalName) {
          setError('Professional name is required');
          return false;
        }
        if (!formData.facility) {
          setError('Facility is required');
          return false;
        }
        break;
      case 2:
        const hasPermissions = Object.values(formData.permissions).some(Boolean);
        if (!hasPermissions) {
          setError('Please select at least one permission');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      const expiresAt = calculateExpiryDate(formData.accessDuration);

      const data: GrantConsentData = {
        childId: formData.childId,
        professionalEmail: formData.professionalEmail,
        permissions: formData.permissions,
        expiresAt,
        message: formData.message,
      };

      const response = await consentService.grantConsent(data);
      
      if (response.success && response.data.accessToken) {
        setGeneratedToken(response.data.accessToken);
        setCurrentStep(currentStep + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to share data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateExpiryDate = (duration: FormData['accessDuration']): string | undefined => {
    if (duration === 'permanent') return undefined;

    const now = new Date();
    switch (duration) {
      case '30days':
        now.setDate(now.getDate() + 30);
        break;
      case '90days':
        now.setDate(now.getDate() + 90);
        break;
      case '1year':
        now.setFullYear(now.getFullYear() + 1);
        break;
    }
    return now.toISOString();
  };

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const sendTokenEmail = async () => {
    // This would trigger email sending via backend
    alert('Token sent to professional via email!');
  };

  const getSelectedChild = () => {
    return children.find(c => c.id === formData.childId);
  };

  const getPermissionCount = () => {
    return Object.values(formData.permissions).filter(Boolean).length;
  };

  const calculateAge = (dateOfBirth: string) => {
    const age = childrenService.calculateAge(dateOfBirth);
    if (age.years === 0) {
      return `${age.months} months`;
    }
    return `${age.years} years`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (children.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="mx-auto text-amber-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Children Added</h2>
            <p className="text-slate-600 mb-6">
              You need to add a child before sharing data with professionals.
            </p>
            <button
              onClick={() => navigate('/onboarding/add-child')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Add Child
            </button>
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
          onClick={() => navigate('/consent')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Consents</span>
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <Shield className="text-[#2563EB]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Share with Professional
          </h1>
          <p className="text-slate-600">
            Grant access to your child's data securely
          </p>
        </div>

        {/* Stepper */}
        {currentStep < 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Step 0: Select Child */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Select Child</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setFormData(prev => ({ ...prev, childId: child.id }))}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      formData.childId === child.id
                        ? 'border-[#2563EB] bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                      {child.firstName[0]}{child.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{child.firstName} {child.lastName}</p>
                      <p className="text-sm text-slate-600">{calculateAge(child.dateOfBirth)}</p>
                    </div>
                    {formData.childId === child.id && (
                      <CheckCircle2 className="text-[#2563EB]" size={24} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Professional Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Professional Information</h2>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Professional Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={formData.professionalEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, professionalEmail: e.target.value }))}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                    placeholder="professional@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Professional Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.professionalName}
                    onChange={(e) => setFormData(prev => ({ ...prev, professionalName: e.target.value }))}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                    placeholder="Dr. Jane Smith"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Facility/Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) => setFormData(prev => ({ ...prev, facility: e.target.value }))}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                    placeholder="ABC Pediatric Clinic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Permissions */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Select Data to Share</h2>

              <div className="space-y-3">
                {[
                  { key: 'screenings', label: 'Screening Results', icon: Activity, description: 'M-CHAT, ASQ, and other screening assessments' },
                  { key: 'peps', label: 'Personalized Education Plans', icon: TrendingUp, description: 'PEP goals, activities, and progress tracking' },
                  { key: 'medicalHistory', label: 'Medical History', icon: FileText, description: 'Health conditions and medical background' },
                  { key: 'assessments', label: 'Professional Assessments', icon: CheckCircle2, description: 'Clinical evaluations and diagnoses' },
                  { key: 'reports', label: 'Progress Reports', icon: Calendar, description: 'Developmental progress and milestone reports' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <label
                      key={item.key}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.permissions[item.key as keyof typeof formData.permissions]
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions[item.key as keyof typeof formData.permissions]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, [item.key]: e.target.checked }
                        }))}
                        className="mt-1 size-5 text-[#2563EB] rounded border-slate-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={18} className="text-[#2563EB]" />
                          <span className="font-bold text-slate-900">{item.label}</span>
                        </div>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Access Duration
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <select
                    value={formData.accessDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessDuration: e.target.value as FormData['accessDuration'] }))}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                  >
                    <option value="30days">30 Days</option>
                    <option value="90days">90 Days</option>
                    <option value="1year">1 Year</option>
                    <option value="permanent">Permanent (until revoked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Message to Professional <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                  placeholder="Add a note for the professional..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Review & Confirm</h2>

              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Child</p>
                  <p className="text-lg font-bold text-slate-900">
                    {getSelectedChild()?.firstName} {getSelectedChild()?.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Professional</p>
                  <p className="text-lg font-bold text-slate-900">{formData.professionalName}</p>
                  <p className="text-sm text-slate-700">{formData.professionalEmail}</p>
                  <p className="text-sm text-slate-700">{formData.facility}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    Shared Data ({getPermissionCount()} items)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.permissions.screenings && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        Screenings
                      </span>
                    )}
                    {formData.permissions.peps && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                        PEPs
                      </span>
                    )}
                    {formData.permissions.medicalHistory && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                        Medical History
                      </span>
                    )}
                    {formData.permissions.assessments && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                        Assessments
                      </span>
                    )}
                    {formData.permissions.reports && (
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full">
                        Reports
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Access Duration</p>
                  <p className="text-slate-900">
                    {formData.accessDuration === 'permanent' ? 'Permanent (until revoked)' :
                     formData.accessDuration === '30days' ? '30 Days' :
                     formData.accessDuration === '90days' ? '90 Days' : '1 Year'}
                  </p>
                </div>

                {formData.message && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Message</p>
                    <p className="text-slate-900">{formData.message}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-slate-700">
                  By confirming, you authorize <strong>{formData.professionalName}</strong> to access 
                  the selected data for <strong>{getSelectedChild()?.firstName} {getSelectedChild()?.lastName}</strong>. 
                  You can revoke this access at any time from the Consent Management page.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success with Token */}
          {currentStep === 4 && generatedToken && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Granted!</h2>
                <p className="text-slate-600">
                  Share this token with {formData.professionalName}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">Access Token</p>
                <div className="bg-white border-2 border-slate-200 rounded-lg p-4 mb-3">
                  <code className="text-sm text-slate-900 break-all font-mono">
                    {generatedToken}
                  </code>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyToken}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                  >
                    {tokenCopied ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={sendTokenEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                  >
                    <Send size={18} />
                    <span>Email Token</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-900">
                  <strong>Important:</strong> The professional will use this token to access your child's data. 
                  Keep it secure and only share it with trusted professionals.
                </p>
              </div>

              <button
                onClick={() => navigate('/consent')}
                className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Navigation Buttons (except success step) */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Grant Access</span>
                      <Shield size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
```

---

### Step 2: Update App.tsx with Share Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import ShareWithProfessional from './pages/ShareWithProfessional';

// In the Routes section, add:
<Route
  path="/consent/share"
  element={isAuthenticated ? <ShareWithProfessional /> : <Navigate to="/login" />}
/>
```

---

### Step 3: Update Consent Management Page

**File:** `src/pages/ConsentManagement.tsx`

**Action:** Verify the "Share with Professional" button navigates to `/consent/share` (should already be correct from N1)

---

### Step 4: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to /consent
2. Click "Share with Professional"
3. Step 1: Select a child
4. Click "Next"
5. Step 2: Fill professional info
6. Click "Next"
7. Step 3: Select permissions
8. Choose access duration
9. Add optional message
10. Click "Next"
11. Step 4: Review all info
12. Click "Grant Access"
13. See success screen with token
14. Copy token to clipboard
15. Test "Email Token" button
16. Click "Done" to return to consents

---

## ✅ SUCCESS CRITERIA

1. ✅ Share with professional page created
2. ✅ 4-step wizard working
3. ✅ Stepper shows progress
4. ✅ Child selection step functional
5. ✅ Professional info form validates
6. ✅ Permissions checkboxes work
7. ✅ Access duration dropdown works
8. ✅ Optional message field works
9. ✅ Review step shows all data
10. ✅ Token generation works
11. ✅ Copy token to clipboard works
12. ✅ Email token option present
13. ✅ Success screen displays
14. ✅ Navigation between steps works
15. ✅ Form validation at each step
16. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate to /consent/share
- [ ] Step 1: Select child works
- [ ] Can't proceed without child selection
- [ ] Step 2: All fields validate
- [ ] Email validation works
- [ ] Can't proceed with invalid email
- [ ] Step 3: Permission checkboxes toggle
- [ ] Can't proceed without permissions
- [ ] Access duration dropdown works
- [ ] Optional message works
- [ ] Step 4: Review shows all data
- [ ] Permission tags display correctly
- [ ] Grant access creates consent
- [ ] Token displays on success
- [ ] Copy token works
- [ ] "Copied!" feedback shows
- [ ] Email token button works
- [ ] Done returns to consent list
- [ ] Back button works on all steps
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ 4-step stepper component
- ✅ Child selection cards
- ✅ Professional form fields with icons
- ✅ Permission checkboxes with descriptions
- ✅ Review summary layout
- ✅ Success screen with token display
- ✅ Copy/Email buttons
- ✅ #2563EB blue color scheme
- ✅ Lucide React icons
- ✅ Smooth step transitions

---

## ⏭️ NEXT PROMPT

**PHASE_3-N3** - Professional Referrals View

---

**Files Created:**
- ✅ `src/pages/ShareWithProfessional.tsx`

**Files Modified:**
- ✅ `src/App.tsx`

**Mark complete and proceed to 3-N3** ✅
