# STEP_02: Run Migration Script - CONTEXT

## Overview

**Step:** 2 of 11  
**Phase:** Backend Transformation - Data Migration  
**Time Estimate:** 1-2 hours  
**Complexity:** High  
**Priority:** 🔴 CRITICAL - Migrates all existing data

---

## Objective

Execute a comprehensive data migration script that reads data from the old database (`dev.db`) and transforms it into the new unified schema (`dev-v2.db`), preserving all data while eliminating redundancy.

---

## Prerequisites

Before starting:
- [x] STEP_01 complete (new schema created)
- [x] `dev-v2.db` exists and is empty
- [x] `dev.db` backed up
- [x] Prisma client generated for new schema
- [x] All 59 tables verified in Prisma Studio

---

## What This Step Does

### Migration Strategy Overview

**Input:** Old database (`dev.db`) with separate children/patients tables  
**Process:** Intelligent merging and transformation  
**Output:** New database (`dev-v2.db`) with Person + Views structure

### Migration Phases

**Phase 1: Migrate Persons**
```
OLD:
  children:     { id: 'c1', first_name: 'Emma', ... }
  patients:     { id: 'p1', first_name: 'Emma', linked_child_id: 'c1' }

NEW:
  Person:       { id: 'person-1', first_name: 'Emma', ... }  ← Created ONCE
  
Decision: If child links to patient, create ONE Person from patient data
          (patient data is more complete with clinical details)
```

**Phase 2: Migrate Views**
```
OLD:
  children:     { id: 'c1', parent_id: 'parent-1', medical_history: '...' }

NEW:
  ParentChildView: { person_id: 'person-1', parent_id: 'parent-1', medical_history: '...' }
  
OLD:
  patients:     { id: 'p1', clinician_id: 'clinic-1', diagnosis: '...' }

NEW:
  ClinicianPatientView: { person_id: 'person-1', clinician_id: 'clinic-1', diagnosis: '...' }
```

**Phase 3: Migrate Access Grants**
```
OLD:
  consent_grants: { parent_id: 'p1', patient_id: 'pat1', child_id: 'c1' }

NEW:
  AccessGrant: { 
    grantor_type: 'parent',
    grantor_id: 'p1',
    grantee_type: 'clinician',
    person_id: 'person-1'  ← Unified reference
  }
```

**Phase 4: Migrate Related Data**
```
All feature tables (screenings, assessments, etc.):
  OLD: { child_id: 'c1' } or { patient_id: 'p1' }
  NEW: { person_id: 'person-1' }  ← Same person ID everywhere
```

**Phase 5: Verification**
```
- Count old children + patients = Count new persons (deduplicated)
- Count old screenings = Count new screenings
- All data accounted for
- Generate detailed report
```

---

## Migration Intelligence

### Smart Merging Logic

**Case 1: Linked Child + Patient (Most Common)**
```
child:   { id: 'c1', first_name: 'Emma', date_of_birth: '2020-01-15' }
patient: { id: 'p1', first_name: 'Emma Smith', date_of_birth: '2020-01-15', linked_child_id: 'c1' }

Decision: Create ONE Person using patient data (more complete)
Result:   Person { first_name: 'Emma Smith' }  ← Uses patient version
          Map: c1 → person-1, p1 → person-1
```

**Case 2: Standalone Child**
```
child: { id: 'c2', first_name: 'John', ... }
patient: None

Decision: Create Person from child data only
Result:   Person { first_name: 'John', ... }
          ParentChildView created
          No ClinicianPatientView
```

**Case 3: Standalone Patient**
```
child: None
patient: { id: 'p2', first_name: 'Sarah', ... }

Decision: Create Person from patient data only
Result:   Person { first_name: 'Sarah', ... }
          ClinicianPatientView created
          No ParentChildView
```

**Case 4: Multiple Parents for Same Child**
```
parent_children:
  { parent_id: 'mom', child_id: 'c1' }
  { parent_id: 'dad', child_id: 'c1' }

Decision: Create multiple ParentChildView records
Result:   ParentChildView { person_id: 'person-1', parent_id: 'mom' }
          ParentChildView { person_id: 'person-1', parent_id: 'dad' }
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    OLD DATABASE (dev.db)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  children (100 records)                                      │
│  └─ 70 linked to patients                                   │
│  └─ 30 standalone                                           │
│                                                              │
│  patients (80 records)                                       │
│  └─ 70 linked to children (same person!)                    │
│  └─ 10 standalone                                           │
│                                                              │
│  Total unique persons: 100 + 10 = 110                       │
│  (70 are duplicates - same person in both tables)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    MIGRATION SCRIPT
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  NEW DATABASE (dev-v2.db)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Person (110 records) ← Zero duplication!                   │
│                                                              │
│  ParentChildView (100 records)                              │
│  └─ Links parents to their children                         │
│                                                              │
│  ClinicianPatientView (80 records)                          │
│  └─ Links clinicians to their patients                      │
│                                                              │
│  AccessGrant (all consent_grants migrated)                  │
│  └─ Unified permissions                                     │
│                                                              │
│  All related data (screenings, assessments, etc.)           │
│  └─ References updated to Person IDs                        │
└─────────────────────────────────────────────────────────────┘
```

---

## ID Mapping Strategy

The script maintains a comprehensive mapping of old → new IDs:

```typescript
{
  childIdMap: {
    'child-123': 'person-abc',
    'child-456': 'person-def'
  },
  patientIdMap: {
    'patient-789': 'person-abc',  // Same person as child-123!
    'patient-012': 'person-ghi'
  },
  viewIdMap: {
    parentChildViews: {
      'child-123': 'view-001'
    },
    clinicianPatientViews: {
      'patient-789': 'view-002'
    }
  }
}
```

This mapping is saved to `migration-report.json` for reference.

---

## Safety Features

### Transaction-Based Migration

**Everything happens in transactions:**
```typescript
await prisma.$transaction(async (tx) => {
  // All operations here
  // If ANY fails, ALL rollback
});
```

**Benefits:**
- Atomic operations (all or nothing)
- No partial migrations
- Automatic rollback on error
- Database consistency guaranteed

### Error Handling

**The script continues on non-critical errors:**
```typescript
try {
  // Migrate item
} catch (error) {
  console.error(`Failed to migrate item: ${error}`);
  errors.push({ item, error });
  // Continue with next item
}
```

**Critical vs Non-Critical:**
- Critical: Person creation, View creation (stops migration)
- Non-Critical: Individual related data (logs error, continues)

### Rollback Strategy

**If migration fails:**
```bash
# 1. Stop script (Ctrl+C or let it fail)
# 2. Delete new database
rm prisma/dev-v2.db

# 3. Restore from backup if needed
cp prisma/dev.db.backup-* prisma/dev.db

# 4. Recreate empty database
npx prisma migrate dev --name initial_unified_schema --schema=./schema-v2.prisma

# 5. Fix issue in migration script
# 6. Run migration again
```

---

## Migration Report

After migration completes, `migration-report.json` is generated:

```json
{
  "timestamp": "2026-01-04T12:30:00.000Z",
  "duration": "45.2s",
  "summary": {
    "personsCreated": 110,
    "parentChildViewsCreated": 100,
    "clinicianPatientViewsCreated": 80,
    "accessGrantsCreated": 25,
    "screeningsMigrated": 150,
    "assessmentsMigrated": 80,
    "totalRecordsMigrated": 545
  },
  "mapping": {
    "childIdMap": { ... },
    "patientIdMap": { ... }
  },
  "errors": [],
  "warnings": [
    "Child 'child-999' has no parent_children record - orphaned data"
  ],
  "verification": {
    "oldChildrenCount": 100,
    "oldPatientsCount": 80,
    "newPersonsCount": 110,
    "deduplicationCount": 70,
    "verified": true
  }
}
```

---

## Expected Outcomes

After STEP_02:

✅ All data migrated from old → new database  
✅ Zero data redundancy (Person stored once)  
✅ All relationships preserved  
✅ ID mappings saved  
✅ Migration report generated  
✅ Verification passed  
✅ Old database untouched (still have backup)  

---

## Common Migration Scenarios

### Scenario 1: Perfect Link

**Old Data:**
```
child:   { id: 'c1', first_name: 'Emma', date_of_birth: '2020-01-15' }
patient: { id: 'p1', first_name: 'Emma', linked_child_id: 'c1' }
parent_children: { parent_id: 'parent-1', child_id: 'c1' }
```

**New Data:**
```
Person: { 
  id: 'person-1', 
  first_name: 'Emma', 
  date_of_birth: '2020-01-15' 
}
ParentChildView: { 
  person_id: 'person-1', 
  parent_id: 'parent-1' 
}
ClinicianPatientView: { 
  person_id: 'person-1', 
  clinician_id: 'clinician-1' 
}
```

---

### Scenario 2: Orphaned Child

**Old Data:**
```
child: { id: 'c2', first_name: 'John' }
parent_children: None (orphaned!)
```

**New Data:**
```
Person: { id: 'person-2', first_name: 'John' }
ParentChildView: NOT created (no parent link)
Warning: "Child c2 has no parent_children record"
```

---

### Scenario 3: Data Mismatch

**Old Data:**
```
child:   { id: 'c3', first_name: 'Sarah', date_of_birth: '2019-05-10' }
patient: { id: 'p3', first_name: 'Sarah Smith', date_of_birth: '2019-05-11', linked_child_id: 'c3' }
                                                    ↑ Different date!
```

**New Data:**
```
Person: { 
  id: 'person-3', 
  first_name: 'Sarah Smith',    ← Uses patient version
  date_of_birth: '2019-05-11'   ← Uses patient version
}
Warning: "Date mismatch for c3/p3: 2019-05-10 vs 2019-05-11"
```

---

## Time Breakdown

| Phase | Time |
|-------|------|
| Script setup | 10 min |
| Phase 1: Persons | 15 min |
| Phase 2: Views | 10 min |
| Phase 3: Access Grants | 5 min |
| Phase 4: Related Data | 20 min |
| Phase 5: Verification | 10 min |
| Review report | 10 min |
| **Total** | **1-2 hours** |

*Time varies based on data volume*

---

## Verification Steps

After migration:

**1. Count Verification:**
```sql
-- Old database
SELECT COUNT(*) FROM children;      -- e.g., 100
SELECT COUNT(*) FROM patients;      -- e.g., 80
-- Expected unique: ~110 (accounting for 70 linked)

-- New database
SELECT COUNT(*) FROM persons;       -- Should be ~110
SELECT COUNT(*) FROM parent_child_views;      -- Should be 100
SELECT COUNT(*) FROM clinician_patient_views; -- Should be 80
```

**2. Relationship Verification:**
```sql
-- Every ParentChildView should reference existing Person
SELECT COUNT(*) FROM parent_child_views pcv
LEFT JOIN persons p ON pcv.person_id = p.id
WHERE p.id IS NULL;
-- Should return: 0

-- Every ClinicianPatientView should reference existing Person
SELECT COUNT(*) FROM clinician_patient_views cpv
LEFT JOIN persons p ON cpv.person_id = p.id
WHERE p.id IS NULL;
-- Should return: 0
```

**3. Data Integrity:**
```sql
-- No duplicate persons (based on demographics)
SELECT first_name, last_name, date_of_birth, COUNT(*)
FROM persons
GROUP BY first_name, last_name, date_of_birth
HAVING COUNT(*) > 1;
-- Should return: 0 rows (or investigate duplicates)
```

---

## Rollback Plan

If something goes wrong:

**Step 1: Stop Migration**
```bash
Ctrl+C  # Stop the script
```

**Step 2: Check Error**
```bash
# Review error message
# Check migration-report.json (if exists)
```

**Step 3: Delete New Database**
```bash
rm prisma/dev-v2.db
```

**Step 4: Recreate Empty Database**
```bash
npx prisma migrate dev --name initial_unified_schema --schema=./schema-v2.prisma
```

**Step 5: Fix Script**
```bash
# Edit backend/scripts/migrate-to-v2.ts
# Fix the issue identified
```

**Step 6: Run Again**
```bash
npx ts-node scripts/migrate-to-v2.ts
```

---

## Dependencies

**Requires:**
- ✅ STEP_01 complete (schema created)
- ✅ Old database accessible (`dev.db`)
- ✅ New database empty (`dev-v2.db`)
- ✅ TypeScript and ts-node installed

**Enables:**
- 🔄 STEP_03: Controller updates
- 🔄 STEP_04: Transformation layer
- 🔄 All subsequent steps

---

## Critical Success Factors

1. **Complete Mapping** - All old IDs mapped to new Person IDs
2. **Zero Data Loss** - All records accounted for
3. **Relationship Preservation** - All links maintained
4. **Verification Passed** - Counts and integrity checks pass
5. **Report Generated** - Full audit trail available

---

**Status:** Ready for Activation  
**Next:** STEP_02_ACTIVATION.md - Migration script execution
