# FRONTEND INTEGRATION - Complete Plan

## Overview

**Phase:** Frontend Integration  
**Target:** Parent Portal + Clinician Portal  
**Status:** Parent Portal ~80% complete (Sections J-O done, P-Q remaining)  
**Goal:** Connect frontends to unified backend with transformation layer

---

## Current State

### Parent Portal Status (from memory)

**Completed Sections (J-N):** ✅
- J: Authentication (Login, Signup, Forgot Password)
- L: Children Management (List, Profile, Edit)
- M: Screening (Container, Results)
- N: Consent Management (Share, Referrals, Permissions)

**In Progress (O):** 🔄
- O: PEP Builder (Dashboard, Activities, Details, Progress)

**Remaining (P-Q):** 📋
- P: Resources & Settings
- Q: Journal Feature

**Estimated Completion:** 80%

### Backend Status

**Completed:** ✅
- REDESIGN_01: Unified schema (Person + Views)
- REDESIGN_02: Data migration script
- REDESIGN_03: Updated controllers
- BACKEND_02: Transformation layer (snake ↔ camel)

**API Changes:**
- Old: `/api/v1/parent/children` returns `children` array with mixed fields
- New: `/api/v1/parent/children` returns `children` array with Person + ParentChildView combined
- **Good News:** Transformation layer ensures frontend still gets camelCase!

---

## Integration Strategy

### Approach: Minimal Frontend Changes

**Why?** The transformation layer handles case conversion!

**Frontend Impact:**
```typescript
// OLD API (before redesign)
{
  id: "child-123",
  firstName: "Emma",
  lastName: "Smith",
  dateOfBirth: "2020-03-15",
  medicalHistory: "None"
}

// NEW API (after redesign + transformation)
{
  id: "person-789",           // ← Different ID (Person ID now)
  firstName: "Emma",          // ← Same structure!
  lastName: "Smith",
  dateOfBirth: "2020-03-15",
  medicalHistory: "None",
  viewId: "view-456"          // ← NEW: View ID
}
```

**Required Changes:**
1. Update API base URL (if needed)
2. Update ID references (child ID → person ID)
3. Add viewId handling (optional, for future features)
4. **That's it!** Everything else stays the same thanks to transformation layer

---

## Phase-by-Phase Integration Plan

### Phase 1: Update Shared Types (1 hour)

**Goal:** Ensure frontend types match new API

**File:** `parent-portal/src/types/index.ts` (or wherever types live)

**Update Child Interface:**
```typescript
// Before
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  medicalHistory?: string;
  currentConcerns?: string;
}

// After - Add viewId
export interface Child {
  id: string;                 // Now Person ID
  viewId: string;             // NEW: ParentChildView ID
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  medicalHistory?: string;
  currentConcerns?: string;
  relationshipType?: string;  // NEW: From view
  isPrimaryCaregiver?: boolean; // NEW: From view
}
```

**Update API Response Types:**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

---

### Phase 2: Update API Service Layer (2 hours)

**Goal:** Update API calls to work with new endpoints

**File:** `parent-portal/src/services/api.ts`

**Update API Client:**
```typescript
// Before
const API_BASE_URL = 'http://localhost:3001/api/v1';

// After - Same! Just ensure it matches backend
const API_BASE_URL = 'http://localhost:3001/api/v1';

// API client stays the same
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Update Children Service:**
```typescript
// children.service.ts

export const childrenService = {
  // Get all children
  getAll: async (): Promise<Child[]> => {
    const response = await apiClient.get<ApiResponse<Child[]>>('/parent/children');
    return response.data.data;
    // ✅ No changes needed - API still returns Child[]
  },

  // Get single child
  getById: async (id: string): Promise<Child> => {
    // ✅ Just use person ID now instead of child ID
    const response = await apiClient.get<ApiResponse<Child>>(`/parent/children/${id}`);
    return response.data.data;
  },

  // Create child
  create: async (data: Partial<Child>): Promise<Child> => {
    // ✅ Send camelCase, transformation layer handles it
    const response = await apiClient.post<ApiResponse<Child>>('/parent/children', data);
    return response.data.data;
  },

  // Update child
  update: async (id: string, data: Partial<Child>): Promise<Child> => {
    // ✅ Use person ID
    const response = await apiClient.put<ApiResponse<Child>>(`/parent/children/${id}`, data);
    return response.data.data;
  },

  // Delete child
  delete: async (id: string): Promise<void> => {
    // ✅ Use person ID
    await apiClient.delete(`/parent/children/${id}`);
  }
};
```

**Key Point:** Almost NO changes needed because:
- Transformation layer returns camelCase
- API structure stays the same
- Only ID semantics changed (child ID → person ID)

---

### Phase 3: Update Components (3-4 hours)

**Goal:** Update components to use new API structure

**Affected Components:**
1. ChildrenList (L1)
2. ChildProfile (L2)
3. EditChild (L3)
4. ScreeningContainer (M1)
5. ConsentManagement (N1-N4)

**Example Update - ChildrenList.tsx:**

```typescript
// Before
const ChildrenList: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  
  useEffect(() => {
    childrenService.getAll().then(setChildren);
  }, []);
  
  const handleEdit = (child: Child) => {
    navigate(`/children/${child.id}/edit`);  // Uses child.id
  };
  
  return (
    <div>
      {children.map(child => (
        <ChildCard 
          key={child.id}        {/* ✅ Still works - just person ID now */}
          child={child}
          onEdit={() => handleEdit(child)}
        />
      ))}
    </div>
  );
};

// After - Minimal changes
const ChildrenList: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  
  useEffect(() => {
    childrenService.getAll().then(setChildren);  // ✅ No change
  }, []);
  
  const handleEdit = (child: Child) => {
    navigate(`/children/${child.id}/edit`);  // ✅ Still works!
  };
  
  return (
    <div>
      {children.map(child => (
        <ChildCard 
          key={child.id}        {/* ✅ No change needed */}
          child={child}
          onEdit={() => handleEdit(child)}
        />
      ))}
    </div>
  );
};
```

**What Changed?** Almost nothing! The `id` is now a person ID instead of child ID, but the component doesn't care.

**Example Update - EditChild.tsx:**

```typescript
// Before
const EditChild: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  
  const handleSubmit = async (data: Partial<Child>) => {
    await childrenService.update(id!, data);
    navigate('/children');
  };
  
  // ...rest of component
};

// After - No changes needed!
const EditChild: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // ✅ Still works
  const [child, setChild] = useState<Child | null>(null);
  
  const handleSubmit = async (data: Partial<Child>) => {
    await childrenService.update(id!, data);  // ✅ Still works
    navigate('/children');
  };
  
  // ...rest of component - NO CHANGES
};
```

---

### Phase 4: Update Consent/Access Grant Flow (2 hours)

**Goal:** Update consent system to use new AccessGrant model

**Old Flow:**
```
Parent shares child → consent_grant created with child_id + patient_id
```

**New Flow:**
```
Parent shares child → AccessGrant created with person_id
```

**Update ConsentService:**

```typescript
// consent.service.ts

export const consentService = {
  // Grant access to clinician
  grantAccess: async (childId: string, clinicianEmail: string): Promise<AccessGrant> => {
    // ✅ childId is now person ID
    const response = await apiClient.post<ApiResponse<AccessGrant>>('/access/grant', {
      grantorType: 'parent',
      personId: childId,           // ✅ person ID
      granteeEmail: clinicianEmail,
      permissions: {
        viewDemographics: true,
        viewMedical: true,
        viewAssessments: true,
        viewReports: true
      }
    });
    return response.data.data;
  },

  // Get all access grants for a child
  getGrantsForChild: async (childId: string): Promise<AccessGrant[]> => {
    const response = await apiClient.get<ApiResponse<AccessGrant[]>>(
      `/access/grants?personId=${childId}`  // ✅ person ID
    );
    return response.data.data;
  },

  // Revoke access
  revokeAccess: async (grantId: string): Promise<void> => {
    await apiClient.delete(`/access/grants/${grantId}`);
  }
};
```

**Update AccessGrant Interface:**

```typescript
export interface AccessGrant {
  id: string;
  grantorType: 'parent' | 'clinician' | 'school';
  grantorId: string;
  granteeType: 'parent' | 'clinician' | 'school';
  granteeId: string;
  personId: string;           // ✅ NEW: person being shared
  permissions: {
    viewDemographics?: boolean;
    viewMedical?: boolean;
    viewAssessments?: boolean;
    viewReports?: boolean;
  };
  accessLevel: 'view' | 'edit' | 'full_access';
  token?: string;
  status: 'pending' | 'active' | 'revoked' | 'expired';
  grantedAt: string;
  expiresAt?: string;
}
```

---

### Phase 5: Testing (2-3 hours)

**Goal:** Ensure all features work with new backend

**Test Checklist:**

**Authentication:**
- [ ] Login works
- [ ] Signup works
- [ ] Forgot password works
- [ ] Token refresh works

**Children Management:**
- [ ] List all children
- [ ] View child profile
- [ ] Create new child
- [ ] Edit child
- [ ] Delete child

**Screenings:**
- [ ] Start screening
- [ ] Complete screening
- [ ] View results

**Consent Management:**
- [ ] Share with clinician
- [ ] View access grants
- [ ] Revoke access
- [ ] Accept invitation (if applicable)

**PEP (if completed):**
- [ ] Create PEP
- [ ] Add activities
- [ ] Track progress

---

## Detailed Changes by Section

### Section L: Children Management

**Files to Update:**
- `ChildrenList.tsx` - ✅ Minimal changes (ID semantics)
- `ChildProfile.tsx` - ✅ Minimal changes
- `EditChild.tsx` - ✅ Minimal changes

**Changes:**
- Update type imports to include `viewId`
- No logic changes needed

---

### Section M: Screening

**Files to Update:**
- `ScreeningContainer.tsx` - ✅ Use person ID instead of child ID
- `ScreeningResults.tsx` - ✅ Display results (no changes)

**Changes:**
```typescript
// Before
const startScreening = async (childId: string) => {
  await screeningService.create({ childId, screeningType: 'mchat' });
};

// After
const startScreening = async (personId: string) => {
  await screeningService.create({ 
    personId,              // ✅ Updated
    screeningType: 'mchat' 
  });
};
```

---

### Section N: Consent Management

**Files to Update:**
- `ConsentManagement.tsx` - Update to use AccessGrant
- `ShareProfessional.tsx` - Update grant flow
- `ProfessionalReferrals.tsx` - Update display
- `EditPermissions.tsx` - Update permissions structure

**Major Changes:**
```typescript
// Update permissions structure
const permissions = {
  viewDemographics: true,    // ✅ New structure
  viewMedical: true,
  viewAssessments: true,
  viewReports: true
};

// Old structure (deprecated)
const oldPermissions = {
  canViewProfile: true,
  canViewScreenings: true
};
```

---

### Section O: PEP Builder

**Files to Update:**
- `PEPDashboard.tsx` - Use person ID
- `ActivityManagement.tsx` - Use person ID
- `ActivityDetails.tsx` - No changes
- `ProgressVisualization.tsx` - No changes

**Changes:**
- Replace `childId` with `personId` in API calls
- Everything else stays the same

---

### Section P: Resources & Settings

**Status:** Not yet implemented

**Integration Notes:**
- Build against new API from the start
- Use person ID in all API calls
- Follow camelCase conventions

---

### Section Q: Journal Feature

**Status:** Not yet implemented

**Integration Notes:**
- Build against new API from the start
- Use person ID for journal entries
- Support multimedia uploads

---

## Migration Checklist

### Pre-Integration

- [ ] Backend REDESIGN_01, 02, 03 complete
- [ ] Backend BACKEND_02 transformation layer complete
- [ ] Backend running and tested
- [ ] API documentation updated

### Integration Steps

- [ ] **Step 1:** Update shared types (Child, AccessGrant, etc.)
- [ ] **Step 2:** Update API service layer
- [ ] **Step 3:** Update Section L components (Children)
- [ ] **Step 4:** Update Section M components (Screening)
- [ ] **Step 5:** Update Section N components (Consent)
- [ ] **Step 6:** Update Section O components (PEP)
- [ ] **Step 7:** Test all features
- [ ] **Step 8:** Fix any bugs
- [ ] **Step 9:** Deploy frontend

### Post-Integration

- [ ] Monitor for errors
- [ ] Collect user feedback
- [ ] Performance testing
- [ ] Documentation updates

---

## Key Takeaways

### ✅ What Makes This Easy

1. **Transformation Layer:** Frontend gets camelCase automatically
2. **Minimal Changes:** Mostly just ID semantics (child → person)
3. **Type Safety:** TypeScript catches issues early
4. **Existing Code:** 80% of parent portal already built

### ⚠️ Watch Out For

1. **ID References:** Ensure all `childId` becomes `personId`
2. **Nested Objects:** Check Person + View combined data
3. **Permissions:** New AccessGrant structure
4. **Testing:** Thoroughly test all CRUD operations

---

## Timeline Estimate

**Total Time:** 8-12 hours for Parent Portal integration

```
Phase 1: Types (1 hour)
Phase 2: API Services (2 hours)
Phase 3: Components (3-4 hours)
Phase 4: Consent Flow (2 hours)
Phase 5: Testing (2-3 hours)
```

**Clinician Portal:** Similar timeline (8-12 hours)

---

## Success Criteria

After integration:

✅ All existing features work  
✅ New backend API connected  
✅ camelCase throughout frontend  
✅ Person IDs used correctly  
✅ AccessGrant system working  
✅ No console errors  
✅ Tests passing  

---

**Status:** Ready for Execution  
**Next:** Create detailed activation prompts for each phase
