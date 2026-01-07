# REDESIGN_02: Data Migration Script - CONTEXT

## Overview

**Prompt:** REDESIGN_02  
**Phase:** 0 - Schema Redesign  
**Step:** 2 of 3  
**Time Estimate:** 4-6 hours  
**Complexity:** High  
**Priority:** 🔴 CRITICAL - Must preserve all existing data

---

## Objective

Create a comprehensive data migration script that safely transfers all data from the old schema (children/patients/parent_children) to the new unified schema (Person/Views/AccessGrant) without any data loss.

---

## Current State

**Old Schema (Active):**
- Database: `dev.db`
- Tables: `children`, `patients`, `parent_children`, `consent_grants`
- Data: Active production data

**New Schema (Empty):**
- Database: `dev-v2.db`
- Tables: `persons`, `parent_child_views`, `clinician_patient_views`, `access_grants`
- Data: None yet

---

## Migration Challenges

### Challenge 1: Identifying Unique Persons

**Problem:** Same person exists in multiple places

```
Example:
children table: { id: 'child-123', first_name: 'Emma', parent_id: 'parent-456' }
patients table: { id: 'patient-789', first_name: 'Emma', clinician_id: 'clinician-111' }
children.linked_patient_id: 'patient-789'

This is ONE person (Emma), not two!
```

**Solution:** Merge based on `linkedPatientId`

### Challenge 2: Orphaned Records

**Scenario 1: Child without Patient**
```
children table: { id: 'child-123', linked_patient_id: null }
→ Create: Person + ParentChildView only
```

**Scenario 2: Patient without Parent**
```
patients table: { id: 'patient-456' }
No parent_children record linking to this patient
→ Create: Person + ClinicianPatientView only
```

**Scenario 3: Linked Child-Patient**
```
children table: { id: 'child-123', linked_patient_id: 'patient-456' }
patients table: { id: 'patient-456' }
parent_children: { parent_id: 'parent-789', patient_id: 'patient-456' }
→ Create: Person + ParentChildView + ClinicianPatientView + AccessGrant
```

### Challenge 3: Data Completeness

**Question:** Which record has more complete data?

```
children: { first_name: 'Emma', last_name: 'Smith', date_of_birth: '2020-03-15' }
patients: { first_name: 'Emma', last_name: 'Smith', date_of_birth: '2020-03-15', 
            address_line1: '123 Main St', city: 'Mumbai', ... }

Answer: patients (more fields)
Strategy: Use patient data as source for Person, preserve child-specific fields in view
```

### Challenge 4: Related Data

**Problem:** Screenings, assessments, etc. reference old IDs

```
Old:
screenings: { id: 'screen-1', patient_id: 'patient-456' }

New:
screenings: { id: 'screen-1', person_id: 'person-999' }

Must update all foreign keys!
```

---

## Migration Strategy

### Phase 1: Create Person Records

```typescript
Strategy:
1. Process all children with linked_patient_id first
   → Create Person from patient data (more complete)
   → Track mapping: patient-456 → person-999
   
2. Process remaining standalone children
   → Create Person from child data
   → Track mapping: child-123 → person-888
   
3. Process remaining standalone patients
   → Create Person from patient data
   → Track mapping: patient-777 → person-666
```

### Phase 2: Create View Records

```typescript
For each Person created:

If created from linked child+patient:
  → Create ParentChildView (link parent → person)
  → Create ClinicianPatientView (link clinician → person)
  → Create AccessGrant (enable sharing)

If created from standalone child:
  → Create ParentChildView only

If created from standalone patient:
  → Create ClinicianPatientView only
```

### Phase 3: Migrate Related Data

```typescript
Update foreign keys in:
- contacts (patient_id → person_id)
- documents (patient_id → person_id)
- tags (patient_id → person_id)
- screenings (patient_id → person_id)
- assessments (patient_id → person_id)
- ieps → education_plans (patient_id → person_id)
- peps → education_plans (patient_id → person_id)
- activities (patient_id → person_id)
- sessions (patient_id → person_id)
- interventions (patient_id → person_id)
- journal_entries (patient_id → person_id)
- appointments (patient_id → person_id)
- reports (patient_id → person_id)
```

### Phase 4: Verification

```typescript
Verify:
1. Person count = unique persons across children + patients
2. All children migrated to ParentChildView
3. All patients migrated to ClinicianPatientView
4. All consent_grants migrated to AccessGrant
5. All related data foreign keys updated
6. No data loss (row counts match)
```

---

## ID Mapping Strategy

**Critical:** Must track old IDs → new IDs

```typescript
interface MigrationMap {
  // Old patient ID → New person ID
  patientToPerson: Map<string, string>;
  
  // Old child ID → New person ID
  childToPerson: Map<string, string>;
  
  // Old child ID → New view ID
  childToView: Map<string, string>;
  
  // Old patient ID → New view ID
  patientToView: Map<string, string>;
  
  // Old consent ID → New grant ID
  consentToGrant: Map<string, string>;
}
```

---

## Data Integrity Rules

### Rule 1: Preserve All Data

```
❌ Never delete from old tables until verification complete
✅ Create new records, verify, then mark old as migrated
```

### Rule 2: Handle Conflicts

```typescript
If same person in children + patients:
  Demographics: Use patient data (more complete)
  Parent notes: Preserve from child
  Clinical notes: Preserve from patient
```

### Rule 3: Maintain Relationships

```typescript
If child linked to patient:
  1. Create Person
  2. Create both views
  3. Create AccessGrant
  4. Verify all three created successfully
```

### Rule 4: Atomic Operations

```typescript
Use transactions:
try {
  await prisma.$transaction(async (tx) => {
    const person = await tx.person.create(...);
    const childView = await tx.parentChildView.create(...);
    const patientView = await tx.clinicianPatientView.create(...);
    const grant = await tx.accessGrant.create(...);
  });
} catch (error) {
  // All or nothing - prevents partial migrations
  rollback();
}
```

---

## Migration Script Structure

```typescript
// migration.ts

import { PrismaClient as OldPrisma } from './old-generated/client';
import { PrismaClient as NewPrisma } from './new-generated/client';

const oldDb = new OldPrisma({ datasources: { db: { url: 'file:./dev.db' } } });
const newDb = new NewPrisma({ datasources: { db: { url: 'file:./dev-v2.db' } } });

async function migrate() {
  console.log('Starting migration...');
  
  // Phase 1: Migrate core entities
  const maps = await migratePersons();
  
  // Phase 2: Migrate views
  await migrateViews(maps);
  
  // Phase 3: Migrate access grants
  await migrateAccessGrants(maps);
  
  // Phase 4: Migrate related data
  await migrateRelatedData(maps);
  
  // Phase 5: Verification
  await verifyMigration(maps);
  
  console.log('Migration complete!');
}

async function migratePersons() {
  // Implementation...
}

async function migrateViews(maps: MigrationMap) {
  // Implementation...
}

// ... more functions
```

---

## Handling Edge Cases

### Edge Case 1: Duplicate Demographics

```typescript
// Children and Patient have same name but different DOB
child: { first_name: 'Emma', date_of_birth: '2020-03-15' }
patient: { first_name: 'Emma', date_of_birth: '2020-03-14' }

Solution:
1. Flag as potential mismatch
2. Use patient DOB (assumed more accurate)
3. Log discrepancy for manual review
4. Add note to Person record
```

### Edge Case 2: Missing Linked Patient

```typescript
child: { id: 'child-123', linked_patient_id: 'patient-999' }
patient with id 'patient-999' doesn't exist!

Solution:
1. Set linked_patient_id to null
2. Create Person from child data only
3. Create ParentChildView only
4. Log error for investigation
```

### Edge Case 3: Orphaned Consent Grant

```typescript
consent_grant: { parent_id: 'parent-123', patient_id: 'patient-999' }
But patient-999 was never migrated (doesn't exist)

Solution:
1. Skip this consent grant
2. Log as orphaned record
3. Manual review required
```

### Edge Case 4: Multiple Parents for Same Patient

```typescript
parent_children records:
{ parent_id: 'parent-123', patient_id: 'patient-456' }
{ parent_id: 'parent-789', patient_id: 'patient-456' }

Same patient linked to two parents!

Solution:
1. Create ONE Person
2. Create TWO ParentChildView records (one per parent)
3. Create ONE ClinicianPatientView
4. Mark one parent as primary (isPrimaryCaregiver: true)
```

---

## Rollback Strategy

### Pre-Migration Backup

```bash
# Backup old database
cp backend/prisma/dev.db backend/prisma/dev.db.backup

# Backup new database (in case of partial migration)
cp backend/prisma/dev-v2.db backend/prisma/dev-v2.db.pre-migration
```

### Migration Checkpoints

```typescript
interface MigrationCheckpoint {
  timestamp: Date;
  phase: string;
  recordsProcessed: number;
  errors: string[];
}

const checkpoints: MigrationCheckpoint[] = [];

async function checkpoint(phase: string, count: number, errors: string[] = []) {
  checkpoints.push({
    timestamp: new Date(),
    phase,
    recordsProcessed: count,
    errors
  });
  
  // Save to file
  fs.writeFileSync(
    'migration-checkpoints.json',
    JSON.stringify(checkpoints, null, 2)
  );
}
```

### Rollback Procedure

```typescript
async function rollback() {
  console.log('Rolling back migration...');
  
  // Drop all tables in new database
  await newDb.$executeRaw`DROP TABLE IF EXISTS persons CASCADE`;
  await newDb.$executeRaw`DROP TABLE IF EXISTS parent_child_views CASCADE`;
  // ... all tables
  
  // Recreate schema
  await newDb.$executeRaw`... schema SQL`;
  
  // Restore from backup
  // (or just delete dev-v2.db and start over)
  
  console.log('Rollback complete');
}
```

---

## Verification Queries

### Verify Person Count

```typescript
const oldChildCount = await oldDb.children.count();
const oldPatientCount = await oldDb.patients.count();

// Count unique persons (children with linked_patient_id counted once)
const linkedChildren = await oldDb.children.count({
  where: { linked_patient_id: { not: null } }
});

const expectedPersons = (oldChildCount - linkedChildren) + oldPatientCount;
const actualPersons = await newDb.person.count();

console.log(`Expected: ${expectedPersons}, Actual: ${actualPersons}`);
assert(expectedPersons === actualPersons, 'Person count mismatch!');
```

### Verify Views Count

```typescript
const oldChildrenCount = await oldDb.children.count();
const actualViewsCount = await newDb.parentChildView.count();

assert(oldChildrenCount === actualViewsCount, 'ParentChildView count mismatch!');
```

### Verify Related Data

```typescript
const oldScreenings = await oldDb.parent_screenings.count();
const newScreenings = await newDb.screening.count();

assert(oldScreenings === newScreenings, 'Screenings count mismatch!');
```

---

## Performance Optimization

### Batch Processing

```typescript
// Don't process one record at a time
❌ for (const child of children) { await migrate(child); }

// Process in batches
✅ const batchSize = 100;
   for (let i = 0; i < children.length; i += batchSize) {
     const batch = children.slice(i, i + batchSize);
     await migrateBatch(batch);
   }
```

### Use Transactions for Batches

```typescript
await newDb.$transaction(async (tx) => {
  for (const record of batch) {
    await tx.person.create({ data: record });
  }
});
```

### Progress Reporting

```typescript
let processed = 0;
const total = children.length;

for (const child of children) {
  await migrateChild(child);
  processed++;
  
  if (processed % 10 === 0) {
    console.log(`Progress: ${processed}/${total} (${(processed/total*100).toFixed(1)}%)`);
  }
}
```

---

## Expected Outcomes

After REDESIGN_02:

✅ All children migrated → Person + ParentChildView  
✅ All patients migrated → Person + ClinicianPatientView  
✅ All consent_grants → AccessGrant  
✅ All related data foreign keys updated  
✅ Zero data loss verified  
✅ ID mappings documented  
✅ Rollback available if needed  
✅ Migration log generated  

---

## Dependencies

**Requires:**
- ✅ REDESIGN_01 complete (new schema exists)
- ✅ Old database backed up
- ✅ New database created (empty)

**Enables:**
- 🔄 REDESIGN_03: Update controllers
- 🔄 Switch to new database
- 🔄 Deprecate old schema

---

## Risk Mitigation

### Risk 1: Data Loss

**Mitigation:**
- Full database backup before starting
- Transaction-based migration (atomic)
- Verification step before committing
- Keep old database until fully verified

### Risk 2: Partial Migration

**Mitigation:**
- Checkpoint system
- Can resume from last checkpoint
- Clear error logging
- Rollback procedure ready

### Risk 3: ID Conflicts

**Mitigation:**
- Generate new UUIDs for all new records
- Maintain mapping table
- Never reuse old IDs

### Risk 4: Performance Issues

**Mitigation:**
- Batch processing
- Progress reporting
- Can run during off-hours
- Estimated time: 1-2 hours for typical dataset

---

**Status:** Ready for Activation Prompt  
**Next:** REDESIGN_02 Activation - Complete Migration Script
