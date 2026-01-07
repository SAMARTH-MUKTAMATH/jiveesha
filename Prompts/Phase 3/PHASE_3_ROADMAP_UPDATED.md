# PHASE 3 ROADMAP - PARENT PORTAL FRONTEND
## Complete Frontend Development Plan (18 Prompts)

**Updated:** Screening sections will be placeholder/container UI for pre-coded frameworks

---

## 📋 PHASE 3 STRUCTURE - 18 PROMPTS

### Section J: Authentication & Onboarding (2 prompts)
- ✅ **3-J1:** Login & Register Pages ← **COMPLETE**
- ⏳ **3-J2:** Onboarding Flow (Add First Child)

**What You'll Build:**
- Login/register pages with validation
- First-time user onboarding
- Add child wizard
- Welcome screens

---

### Section K: Dashboard & Navigation (2 prompts)
- ⏳ **3-K1:** Parent Dashboard (Main Overview)
- ⏳ **3-K2:** Navigation Layout & Sidebar

**What You'll Build:**
- Main dashboard with widgets
- Quick actions panel
- Recent activity feed
- Navigation sidebar
- Header with user menu
- Mobile-responsive layout

**Figma Design:** `parent_dashboard/`

---

### Section L: Child Management (3 prompts)
- ⏳ **3-L1:** Children List View
- ⏳ **3-L2:** Child Profile View
- ⏳ **3-L3:** Add/Edit Child Flow

**What You'll Build:**
- List of all children (empty state + with data)
- Individual child profile cards
- Child details view
- Add child form
- Edit child information
- Delete child confirmation

**Figma Designs:** 
- `my_children_(list)__1/` (empty state)
- `my_children_(list)__2/` (with data)
- `child_profile/`

---

### Section M: Screening (2 prompts - PLACEHOLDER/CONTAINER ONLY)
- ⏳ **3-M1:** Screening Container & Navigation
- ⏳ **3-M2:** Screening History & Results Container

**What You'll Build:**
- Container pages with routing
- Navigation to screening sections
- Placeholder containers where pre-coded frameworks will be inserted
- Results display containers
- History list containers
- **NO screening question UI** - you'll provide pre-coded frameworks later

**Figma Designs:**
- `screening_flow_(parent)__1/` - Reference for container structure
- `screening_flow_(parent)__2/` - Reference for container structure
- `screening_results_(parent_view)__1/`
- `screening_results_(parent_view)__2/`

**Integration Points:**
```typescript
// Placeholder structure you'll build:
<ScreeningContainer>
  {/* Your pre-coded screening framework will go here */}
  <div id="screening-questions-container">
    {/* M-CHAT, ASQ, etc. frameworks */}
  </div>
</ScreeningContainer>
```

---

### Section N: Consent & Sharing (3 prompts)
- ⏳ **3-N1:** Consent Management UI
- ⏳ **3-N2:** Share with Professional Flow
- ⏳ **3-N3:** Professional Referrals View

**What You'll Build:**
- List of granted consents
- Token generation UI
- Share child data flow
- Revoke consent UI
- Pending/active consent status
- Professional referrals list
- Consent details modal

**Figma Designs:**
- `consent_&_permissions/`
- `consent_&_share_(parent_view)_/`
- `professional_referrals_(parent_view)_/`

---

### Section O: PEP Builder (4 prompts)
- ⏳ **3-O1:** PEP Dashboard & List
- ⏳ **3-O2:** Goal Management UI
- ⏳ **3-O3:** Activity Management UI
- ⏳ **3-O4:** Progress Tracking & Visualization

**What You'll Build:**
- PEP list view
- Create/edit PEP
- Add/manage goals
- Link goals to IEP
- Add/complete activities
- Activity completion modal with observations
- Progress charts and graphs
- Goal timeline view

**Figma Design:** `pep_builder_(personalized_education_plan)_/`

---

### Section P: Resources & Settings (2 prompts)
- ⏳ **3-P1:** Resource Library & Browse
- ⏳ **3-P2:** Settings & Account Management

**What You'll Build:**
- Resource library with filtering
- Search functionality
- Resource categories
- Resource detail view
- Favorite resources
- Account settings
- Notification preferences
- Profile editing
- Password change

**Figma Designs:**
- `resources_&_home_activities_(parent_view)_/`
- `settings_&_account/`

---

## 📊 PROMPT COUNT BREAKDOWN

| Section | Prompts | Status |
|---------|---------|--------|
| J - Authentication | 2 | 1/2 (50%) |
| K - Dashboard | 2 | 0/2 (0%) |
| L - Child Management | 3 | 0/3 (0%) |
| M - Screening (Containers) | 2 | 0/2 (0%) |
| N - Consent | 3 | 0/3 (0%) |
| O - PEP Builder | 4 | 0/4 (0%) |
| P - Resources & Settings | 2 | 0/2 (0%) |
| **TOTAL** | **18** | **1/18 (6%)** |

**Note:** Reduced from 20 to 18 prompts since screening questions are pre-coded

---

## 🎯 SCREENING SECTIONS - SPECIAL NOTES

### What We're Building for Screening:

**3-M1: Screening Container & Navigation**
- Route structure (`/screening/select`, `/screening/:id/start`)
- Container components with proper layout
- Navigation between steps
- Integration points clearly marked with comments
- Props interface for your pre-coded frameworks

**3-M2: Screening History & Results Container**
- Display completed screenings list
- Results page layout/containers
- Data fetching from API
- Display containers for your results UI

### What You'll Provide Later:

**Your Pre-Coded Frameworks:**
- M-CHAT question flow component
- ASQ question flow component  
- Screening question UI/UX
- Answer selection components
- Progress indicators
- Question navigation

### Integration Approach:

```typescript
// We'll create containers like this:
import React from 'react';
// Your pre-coded framework import will go here
// import MChatFramework from './frameworks/MChatFramework';

export default function ScreeningQuestions({ screeningId, screeningType }) {
  return (
    <div className="screening-container">
      {/* Container UI we build */}
      <div className="screening-header">
        <h1>Screening in Progress</h1>
      </div>

      {/* Integration point for your framework */}
      <div id="screening-questions-container">
        {/* Your pre-coded framework will be inserted here */}
        {/* Example: <MChatFramework screeningId={screeningId} /> */}
        
        {/* Placeholder for now */}
        <div className="placeholder-framework">
          <p>Screening framework will be integrated here</p>
          <p>Screening Type: {screeningType}</p>
          <p>Screening ID: {screeningId}</p>
        </div>
      </div>

      {/* Container UI we build */}
      <div className="screening-footer">
        <button>Save & Continue Later</button>
      </div>
    </div>
  );
}
```

---

## 🔄 INTEGRATION WORKFLOW

**Phase 1: Build Containers (Our Work)**
1. Create route structure
2. Build container components
3. Add placeholder content
4. Setup data flow (API calls)
5. Create props interfaces

**Phase 2: Integration (Your Work)**
1. Drop in your pre-coded frameworks
2. Connect to container props
3. Test data flow
4. Style adjustments if needed

**Phase 3: Testing**
1. End-to-end testing
2. Data persistence verification
3. UX flow validation

---

## 📁 FILE STRUCTURE PREVIEW

```
frontend/src/
├── pages/
│   ├── auth/
│   │   ├── Login.tsx ✅
│   │   ├── Register.tsx ✅
│   │   └── Onboarding.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── children/
│   │   ├── ChildrenList.tsx
│   │   ├── ChildProfile.tsx
│   │   └── AddChild.tsx
│   ├── screening/
│   │   ├── ScreeningContainer.tsx (container only)
│   │   ├── ScreeningHistory.tsx (container only)
│   │   ├── ScreeningResults.tsx (container only)
│   │   └── frameworks/ (your pre-coded files go here)
│   ├── consent/
│   │   ├── ConsentManagement.tsx
│   │   └── ShareWithProfessional.tsx
│   ├── pep/
│   │   ├── PEPDashboard.tsx
│   │   ├── PEPGoals.tsx
│   │   └── PEPActivities.tsx
│   └── resources/
│       ├── ResourceLibrary.tsx
│       └── Settings.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── services/
│   ├── api.ts ✅
│   ├── auth.service.ts ✅
│   ├── children.service.ts
│   ├── screening.service.ts
│   ├── consent.service.ts
│   └── pep.service.ts
└── types/
    ├── auth.types.ts
    ├── child.types.ts
    ├── screening.types.ts
    └── pep.types.ts
```

---

## ⏭️ NEXT STEPS

**Immediate Next Prompts:**
1. ✅ 3-J1: Login/Register (COMPLETE)
2. ⏳ 3-J2: Onboarding Flow
3. ⏳ 3-K1: Dashboard
4. ⏳ 3-K2: Navigation Layout

After these foundation pieces, we'll build:
- Child management (3 prompts)
- Screening containers (2 prompts - placeholders)
- Consent UI (3 prompts)
- PEP builder (4 prompts)
- Resources & Settings (2 prompts)

---

## 🎨 DESIGN SYSTEM NOTES

**Colors:**
- Primary: Blue (#3b82f6)
- Success: Green
- Warning: Yellow
- Danger: Red
- Gray scales for text

**Typography:**
- Headings: Bold, clear hierarchy
- Body: Readable, accessible
- Forms: Clear labels

**Components:**
- Consistent button styles
- Card components for content
- Modals for actions
- Toast notifications
- Loading states

**Responsive:**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI elements

---

## 📝 IMPORTANT REMINDERS

### For Screening Sections:
- ✅ Build container structure
- ✅ Setup routing
- ✅ Create integration points
- ✅ Document props interface
- ❌ DON'T build question UI
- ❌ DON'T implement question flow
- ❌ DON'T hardcode screening logic

### For All Sections:
- ✅ Use TypeScript
- ✅ Follow Figma designs
- ✅ Implement error handling
- ✅ Add loading states
- ✅ Mobile responsive
- ✅ Accessibility (ARIA labels)

---

**Last Updated:** Phase 3-J1 Complete  
**Next Milestone:** Phase 3-J2 (Onboarding Flow)  
**Screening Strategy:** Container/Placeholder approach for framework integration
