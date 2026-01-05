# REDESIGN_03: Update Controllers for Unified Schema - CONTEXT

## Overview

**Prompt:** REDESIGN_03  
**Phase:** 0 - Schema Redesign  
**Step:** 3 of 3  
**Time Estimate:** 6-8 hours  
**Complexity:** High  
**Priority:** 🔴 CRITICAL - Make new schema functional

---

## Objective

Update all backend controllers to use the new unified schema (Person/Views/AccessGrant) instead of the old schema (children/patients/parent_children).

---

## Current State

**Old Controllers:**
```typescript
// GET /parent/children
export const getChildren = async (req, res) => {
  const children = await prisma.children.findMany({
    where: { parent_id: parentId }
  });
  res.json({ success: true, data: children });
};
```

**New Controllers (Target):**
```typescript
// GET /parent/children
export const getChildren = async (req, res) => {
  const views = await prisma.parentChildView.findMany({
    where: { parentId },
    include: { person: true }
  });
  
  // Combine Person + View data
  const children = views.map(view => ({
    ...view.person,
    view: {
      medicalHistory: view.medicalHistory,
      currentConcerns: view.currentConcerns,
      relationshipType: view.relationshipType
    }
  }));
  
  res.json({ success: true, data: children });
};
```

---

## Key Changes Required

### Change 1: Query Pattern Shift

**Old Pattern:**
```typescript
// Direct table query
await prisma.children.findMany({
  where: { parent_id: parentId }
});
```

**New Pattern:**
```typescript
// View + Person join
await prisma.parentChildView.findMany({
  where: { parentId },
  include: { person: true }
});
```

### Change 2: Create Operations

**Old Pattern:**
```typescript
// Create in one table
await prisma.children.create({
  data: {
    parent_id: parentId,
    first_name: 'Emma',
    last_name: 'Smith',
    date_of_birth: '2020-03-15',
    medical_history: 'None'
  }
});
```

**New Pattern:**
```typescript
// Create in two tables (transaction)
await prisma.$transaction(async (tx) => {
  // 1. Create Person
  const person = await tx.person.create({
    data: {
      firstName: 'Emma',
      lastName: 'Smith',
      dateOfBirth: new Date('2020-03-15'),
      gender: 'female'
    }
  });
  
  // 2. Create ParentChildView
  const view = await tx.parentChildView.create({
    data: {
      personId: person.id,
      parentId,
      medicalHistory: 'None',
      relationshipType: 'parent'
    }
  });
  
  return { person, view };
});
```

### Change 3: Update Operations

**Old Pattern:**
```typescript
// Update directly
await prisma.children.update({
  where: { id: childId },
  data: { first_name: 'Emma' }
});
```

**New Pattern:**
```typescript
// Determine which table to update
if (updatingDemographics) {
  // Update Person table
  await prisma.person.update({
    where: { id: personId },
    data: { firstName: 'Emma' }
  });
} else {
  // Update View table
  await prisma.parentChildView.update({
    where: { personId },
    data: { medicalHistory: '...' }
  });
}
```

### Change 4: Access Control

**Old Pattern:**
```typescript
// Check consent_grants
const consent = await prisma.consent_grant.findFirst({
  where: {
    parent_id: parentId,
    patient_id: patientId,
    status: 'active'
  }
});
```

**New Pattern:**
```typescript
// Check AccessGrant (polymorphic)
const grant = await prisma.accessGrant.findFirst({
  where: {
    granteeType: 'parent',
    granteeId: parentId,
    personId,
    status: 'active'
  }
});
```

---

## Controller Categories to Update

### Category A: Parent Controllers (8 files)

1. **parent-auth.controller.ts** - ✅ No changes (user auth only)
2. **parent-children.controller.ts** - 🔴 MAJOR changes
3. **parent-screening.controller.ts** - 🔴 MAJOR changes
4. **parent-pep.controller.ts** - 🔴 MAJOR changes
5. **parent-consent.controller.ts** - 🔴 MAJOR changes
6. **parent-journal.controller.ts** - 🟡 MODERATE changes
7. **parent-settings.controller.ts** - ✅ No changes
8. **parent-dashboard.controller.ts** - 🟡 MODERATE changes

### Category B: Clinician Controllers (12 files)

1. **clinician-auth.controller.ts** - ✅ No changes
2. **clinician-patients.controller.ts** - 🔴 MAJOR changes
3. **clinician-assessments.controller.ts** - 🔴 MAJOR changes
4. **clinician-iep.controller.ts** - 🔴 MAJOR changes
5. **clinician-sessions.controller.ts** - 🟡 MODERATE changes
6. **clinician-interventions.controller.ts** - 🟡 MODERATE changes
7. **clinician-reports.controller.ts** - 🟡 MODERATE changes
8. **clinician-appointments.controller.ts** - 🟡 MODERATE changes
9. **clinician-journal.controller.ts** - 🟡 MODERATE changes
10. **clinician-consent.controller.ts** - 🔴 MAJOR changes
11. **clinician-settings.controller.ts** - ✅ No changes
12. **clinician-dashboard.controller.ts** - 🟡 MODERATE changes

### Category C: Shared Controllers (3 files)

1. **messaging.controller.ts** - 🟡 MODERATE changes
2. **notifications.controller.ts** - ✅ No changes
3. **resources.controller.ts** - ✅ No changes

**Total:** 23 controllers, 10 major changes needed

---

## Detailed Update Patterns

### Pattern 1: Parent Get Children

**Before:**
```typescript
export const getChildren = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  
  const children = await prisma.children.findMany({
    where: { parent_id: parentId }
  });
  
  res.json({ success: true, data: children });
};
```

**After:**
```typescript
export const getChildren = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  
  const views = await prisma.parentChildView.findMany({
    where: { parentId },
    include: {
      person: true
    }
  });
  
  // Transform to Child interface
  const children = views.map(view => ({
    // Person data
    id: view.person.id,
    firstName: view.person.firstName,
    lastName: view.person.lastName,
    dateOfBirth: view.person.dateOfBirth,
    gender: view.person.gender,
    // ... all person fields
    
    // View-specific data
    viewId: view.id,
    medicalHistory: view.medicalHistory,
    currentConcerns: view.currentConcerns,
    relationshipType: view.relationshipType,
    isPrimaryCaregiver: view.isPrimaryCaregiver
  }));
  
  res.json({ success: true, data: children });
};
```

### Pattern 2: Parent Create Child

**Before:**
```typescript
export const createChild = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  const { first_name, last_name, date_of_birth, gender } = req.body;
  
  const child = await prisma.children.create({
    data: {
      parent_id: parentId,
      first_name,
      last_name,
      date_of_birth: new Date(date_of_birth),
      gender
    }
  });
  
  res.json({ success: true, data: child });
};
```

**After:**
```typescript
export const createChild = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    medicalHistory,
    currentConcerns,
    relationshipType
  } = req.body;
  
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Person
    const person = await tx.person.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender
      }
    });
    
    // 2. Create ParentChildView
    const view = await tx.parentChildView.create({
      data: {
        personId: person.id,
        parentId,
        medicalHistory,
        currentConcerns,
        relationshipType: relationshipType || 'parent',
        isPrimaryCaregiver: true
      }
    });
    
    return { person, view };
  });
  
  // Transform to response format
  const child = {
    ...result.person,
    viewId: result.view.id,
    medicalHistory: result.view.medicalHistory,
    currentConcerns: result.view.currentConcerns,
    relationshipType: result.view.relationshipType
  };
  
  res.json({ success: true, data: child });
};
```

### Pattern 3: Clinician Get Patients

**Before:**
```typescript
export const getPatients = async (req: Request, res: Response) => {
  const clinicianId = (req as any).user?.id;
  
  const patients = await prisma.patients.findMany({
    where: { clinician_id: clinicianId }
  });
  
  res.json({ success: true, data: patients });
};
```

**After:**
```typescript
export const getPatients = async (req: Request, res: Response) => {
  const clinicianId = (req as any).user?.id;
  
  const views = await prisma.clinicianPatientView.findMany({
    where: { clinicianId },
    include: {
      person: true
    }
  });
  
  // Transform to Patient interface
  const patients = views.map(view => ({
    // Person data
    id: view.person.id,
    firstName: view.person.firstName,
    lastName: view.person.lastName,
    dateOfBirth: view.person.dateOfBirth,
    gender: view.person.gender,
    // ... all person fields
    
    // Clinical view data
    viewId: view.id,
    primaryConcerns: view.primaryConcerns,
    existingDiagnosis: view.existingDiagnosis,
    diagnosisCodes: view.diagnosisCodes,
    caseStatus: view.caseStatus,
    // ... all view fields
  }));
  
  res.json({ success: true, data: patients });
};
```

### Pattern 4: Consent Grant Flow

**Before:**
```typescript
export const grantConsent = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  const { patient_id, clinician_email } = req.body;
  
  const consent = await prisma.consent_grant.create({
    data: {
      parent_id: parentId,
      patient_id,
      clinician_email,
      token: generateToken(),
      status: 'pending'
    }
  });
  
  res.json({ success: true, data: consent });
};
```

**After:**
```typescript
export const grantConsent = async (req: Request, res: Response) => {
  const parentId = (req as any).user?.parentId;
  const { personId, clinicianEmail, permissions } = req.body;
  
  // Verify parent owns this person via ParentChildView
  const view = await prisma.parentChildView.findFirst({
    where: {
      parentId,
      personId
    }
  });
  
  if (!view) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized for this person'
    });
  }
  
  const grant = await prisma.accessGrant.create({
    data: {
      grantorType: 'parent',
      grantorId: parentId,
      granteeType: 'clinician',
      granteeId: 'unknown', // Will be set when claimed
      personId,
      permissions: JSON.stringify(permissions),
      accessLevel: 'view',
      token: generateToken(),
      status: 'pending',
      grantedByName: req.user?.name,
      grantedByEmail: req.user?.email,
      granteeEmail: clinicianEmail
    }
  });
  
  res.json({ success: true, data: grant });
};
```

### Pattern 5: Check Access Permission

**Before:**
```typescript
async function canAccessPatient(parentId: string, patientId: string) {
  const consent = await prisma.consent_grant.findFirst({
    where: {
      parent_id: parentId,
      patient_id: patientId,
      status: 'active'
    }
  });
  
  return !!consent;
}
```

**After:**
```typescript
async function canAccessPerson(
  accessorType: 'parent' | 'clinician' | 'school',
  accessorId: string,
  personId: string
) {
  // Check if they own the view
  if (accessorType === 'parent') {
    const view = await prisma.parentChildView.findFirst({
      where: { parentId: accessorId, personId }
    });
    if (view) return true;
  }
  
  if (accessorType === 'clinician') {
    const view = await prisma.clinicianPatientView.findFirst({
      where: { clinicianId: accessorId, personId }
    });
    if (view) return true;
  }
  
  // Check if they have access grant
  const grant = await prisma.accessGrant.findFirst({
    where: {
      granteeType: accessorType,
      granteeId: accessorId,
      personId,
      status: 'active'
    }
  });
  
  return !!grant;
}
```

### Pattern 6: Update Demographics vs View Data

```typescript
export const updateChild = async (req: Request, res: Response) => {
  const { id: personId } = req.params;
  const parentId = (req as any).user?.parentId;
  const updates = req.body;
  
  // Verify access
  const view = await prisma.parentChildView.findFirst({
    where: { parentId, personId }
  });
  
  if (!view) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }
  
  await prisma.$transaction(async (tx) => {
    // Demographic updates → Person table
    const personUpdates = {
      ...(updates.firstName && { firstName: updates.firstName }),
      ...(updates.lastName && { lastName: updates.lastName }),
      ...(updates.dateOfBirth && { dateOfBirth: new Date(updates.dateOfBirth) }),
      ...(updates.gender && { gender: updates.gender })
    };
    
    if (Object.keys(personUpdates).length > 0) {
      await tx.person.update({
        where: { id: personId },
        data: personUpdates
      });
    }
    
    // Parent-specific updates → ParentChildView table
    const viewUpdates = {
      ...(updates.medicalHistory && { medicalHistory: updates.medicalHistory }),
      ...(updates.currentConcerns && { currentConcerns: updates.currentConcerns }),
      ...(updates.parentNotes && { parentNotes: updates.parentNotes })
    };
    
    if (Object.keys(viewUpdates).length > 0) {
      await tx.parentChildView.update({
        where: { personId },
        data: viewUpdates
      });
    }
  });
  
  res.json({ success: true, message: 'Updated successfully' });
};
```

---

## Helper Functions to Create

### Helper 1: Transform View to Child

```typescript
// utils/transformers.ts

export function transformToChild(view: ParentChildView & { person: Person }) {
  return {
    // Person fields (camelCase from transformation layer)
    id: view.person.id,
    firstName: view.person.firstName,
    lastName: view.person.lastName,
    dateOfBirth: view.person.dateOfBirth,
    gender: view.person.gender,
    placeOfBirth: view.person.placeOfBirth,
    addressLine1: view.person.addressLine1,
    addressLine2: view.person.addressLine2,
    city: view.person.city,
    state: view.person.state,
    pinCode: view.person.pinCode,
    country: view.person.country,
    
    // View fields
    viewId: view.id,
    parentId: view.parentId,
    medicalHistory: view.medicalHistory,
    currentConcerns: view.currentConcerns,
    developmentalNotes: view.developmentalNotes,
    parentNotes: view.parentNotes,
    relationshipType: view.relationshipType,
    isPrimaryCaregiver: view.isPrimaryCaregiver,
    addedAt: view.addedAt
  };
}
```

### Helper 2: Transform View to Patient

```typescript
export function transformToPatient(view: ClinicianPatientView & { person: Person }) {
  return {
    // Person fields
    id: view.person.id,
    firstName: view.person.firstName,
    lastName: view.person.lastName,
    // ... all person fields
    
    // Clinical view fields
    viewId: view.id,
    clinicianId: view.clinicianId,
    primaryConcerns: view.primaryConcerns,
    existingDiagnosis: view.existingDiagnosis,
    diagnosisCodes: JSON.parse(view.diagnosisCodes),
    medicalHistory: view.medicalHistory,
    familyHistory: view.familyHistory,
    currentMedications: JSON.parse(view.currentMedications),
    allergies: view.allergies,
    caseStatus: view.caseStatus,
    referralSource: view.referralSource,
    admittedAt: view.admittedAt
  };
}
```

### Helper 3: Check Person Access

```typescript
export async function checkPersonAccess(
  accessorType: 'parent' | 'clinician' | 'school',
  accessorId: string,
  personId: string
): Promise<boolean> {
  // Direct ownership check
  if (accessorType === 'parent') {
    const view = await prisma.parentChildView.findFirst({
      where: { parentId: accessorId, personId }
    });
    if (view) return true;
  }
  
  if (accessorType === 'clinician') {
    const view = await prisma.clinicianPatientView.findFirst({
      where: { clinicianId: accessorId, personId }
    });
    if (view) return true;
  }
  
  // Access grant check
  const grant = await prisma.accessGrant.findFirst({
    where: {
      granteeType: accessorType,
      granteeId: accessorId,
      personId,
      status: 'active'
    }
  });
  
  return !!grant;
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('ParentChildrenController', () => {
  describe('GET /children', () => {
    it('should return children with person data', async () => {
      // Create test data
      const person = await prisma.person.create({...});
      const view = await prisma.parentChildView.create({...});
      
      const response = await request(app)
        .get('/api/v1/parent/children')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.body.data[0]).toHaveProperty('firstName');
      expect(response.body.data[0]).toHaveProperty('medicalHistory');
    });
  });
});
```

### Integration Tests

```typescript
describe('Consent Flow', () => {
  it('should grant access from parent to clinician', async () => {
    // 1. Parent creates child
    const child = await createChild();
    
    // 2. Clinician creates patient for same person
    const patient = await createPatient(child.personId);
    
    // 3. Parent grants access
    const grant = await grantAccess(parentId, child.personId, clinicianId);
    
    // 4. Verify clinician can now access
    const canAccess = await checkPersonAccess('clinician', clinicianId, child.personId);
    expect(canAccess).toBe(true);
  });
});
```

---

## Expected Outcomes

After REDESIGN_03:

✅ All controllers use new schema  
✅ Person + View pattern working  
✅ AccessGrant system functional  
✅ Helper functions created  
✅ Tests updated and passing  
✅ No references to old tables  
✅ Ready for transformation layer  

---

## Dependencies

**Requires:**
- ✅ REDESIGN_01 complete (schema exists)
- ✅ REDESIGN_02 complete (data migrated)
- ✅ New Prisma client generated

**Enables:**
- 🔄 BACKEND_02: Transformation layer
- 🔄 Frontend integration
- 🔄 Production deployment

---

**Status:** Ready for Activation Prompt  
**Next:** REDESIGN_03 Activation - Controller Updates
