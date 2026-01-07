# STEP_01: Create Unified Schema - CONTEXT

## Overview

**Step:** 1 of 11  
**Phase:** Backend Transformation - Schema Creation  
**Time Estimate:** 2 hours  
**Complexity:** Medium  
**Priority:** 🔴 CRITICAL - Foundation for everything

---

## Objective

Create a new Prisma schema file (`schema-v2.prisma`) with the complete 59-table unified architecture implementing the three-view model (Person + ParentChildView + ClinicianPatientView + SchoolStudentView).

---

## Prerequisites

Before starting:
- [ ] Backend project accessible
- [ ] Node.js installed
- [ ] Prisma installed (`npm install -g prisma` or use `npx`)
- [ ] Text editor ready
- [ ] Terminal/command line access

---

## What This Step Does

### Creates New Database Schema

**Input:** REDESIGN_01_ACTIVATION files (PART1 + PART2)  
**Output:** `schema-v2.prisma` with 59 tables  
**Result:** New empty database (`dev-v2.db`) ready for migration

### Key Components

1. **Core Entities (5 tables)**
   - Person (single source of truth)
   - ParentChildView (parent perspective)
   - ClinicianPatientView (clinician perspective)
   - SchoolStudentView (school perspective)
   - AccessGrant (unified permissions)

2. **User Accounts (8 tables)**
   - User, Parent, ClinicianProfile, School, Teacher, etc.

3. **Feature Tables (46 tables)**
   - Screenings, Assessments, Education Plans, Activities, etc.

**Total:** 59 tables with proper relationships and indexes

---

## Why This Matters

### Old Architecture Problems

```
children table:
  - first_name
  - last_name
  - date_of_birth
  - medical_history

patients table:
  - first_name    ← DUPLICATE!
  - last_name     ← DUPLICATE!
  - date_of_birth ← DUPLICATE!
  - clinical_notes

Result: Data stored 2-3 times (will be 3x when schools added)
```

### New Architecture Solution

```
Person table:
  - first_name    ← ONCE!
  - last_name     ← ONCE!
  - date_of_birth ← ONCE!

ParentChildView:
  - person_id → Person
  - medical_history (parent-specific only)

ClinicianPatientView:
  - person_id → Person
  - clinical_notes (clinician-specific only)

Result: Zero redundancy, perfect separation of concerns
```

---

## Expected Outcomes

After STEP_01:

✅ New schema file created (`schema-v2.prisma`)  
✅ Schema validated (no syntax errors)  
✅ New database created (`dev-v2.db`)  
✅ Prisma client generated  
✅ All 59 tables visible in Prisma Studio  
✅ Old database backed up  
✅ Ready for data migration  

---

## File Structure After Completion

```
backend/
├── prisma/
│   ├── schema.prisma          (old - keep for reference)
│   ├── schema-v2.prisma       ✅ NEW - unified schema
│   ├── dev.db                 (old data - preserve)
│   ├── dev.db.backup-*        ✅ NEW - safety backup
│   ├── dev-v2.db              ✅ NEW - empty, ready for migration
│   └── migrations/
│       └── *_initial_unified_schema/
│           └── migration.sql  ✅ NEW - migration file
```

---

## Safety Measures

### Backup Strategy

1. **Never delete old database** until fully verified
2. **Create timestamped backup** before any operations
3. **Keep migration reversible** via backup restoration

### Validation Steps

1. **Syntax validation** - `npx prisma validate`
2. **Format check** - `npx prisma format`
3. **Client generation** - `npx prisma generate`
4. **Visual verification** - Prisma Studio inspection

---

## Common Issues & Solutions

### Issue 1: Schema Validation Errors

**Symptom:** `Prisma schema validation failed`

**Common Causes:**
- Missing closing bracket `}`
- Missing comma between fields
- Typo in model/field names
- Incorrect relation syntax

**Solution:**
```bash
# Auto-fix formatting issues
npx prisma format ./schema-v2.prisma

# Check specific error line
# Error message shows: "Error at line 45"
# Open schema-v2.prisma and check line 45
```

### Issue 2: Database Already Exists

**Symptom:** `Database dev-v2.db already exists`

**Solution:**
```bash
# Delete and recreate
rm prisma/dev-v2.db
npx prisma migrate dev --name initial_unified_schema --schema=./schema-v2.prisma
```

### Issue 3: Prisma Client Not Generated

**Symptom:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
# Regenerate client
npx prisma generate --schema=./schema-v2.prisma
```

### Issue 4: Missing Content from PART2

**Symptom:** Only 30 tables instead of 59

**Solution:**
- Ensure PART2 content was appended (not replaced)
- Check for continuation comment: `// CATEGORY E: SCREENINGS`
- Verify last model in file is `ResourceFavorite`

---

## Verification Checklist

Before proceeding to STEP_02:

### Schema File
- [ ] `schema-v2.prisma` exists
- [ ] File size ~15-20KB (both parts combined)
- [ ] Starts with `generator client`
- [ ] Contains `model Person`
- [ ] Contains `model ParentChildView`
- [ ] Contains `model ClinicianPatientView`
- [ ] Contains `model AccessGrant`
- [ ] Contains `model Screening`
- [ ] Ends with `model ResourceFavorite`

### Validation
- [ ] `npx prisma validate` passes with no errors
- [ ] `npx prisma format` completes successfully
- [ ] No syntax errors shown

### Database
- [ ] `dev-v2.db` file exists
- [ ] File size > 0 (not empty file)
- [ ] Can open with Prisma Studio

### Tables
- [ ] Prisma Studio shows 59 tables
- [ ] Person table visible with correct fields
- [ ] ParentChildView table visible
- [ ] ClinicianPatientView table visible
- [ ] AccessGrant table visible

### Backup
- [ ] `dev.db.backup-*` file exists
- [ ] Backup file size matches original `dev.db`

---

## Time Breakdown

| Task | Time |
|------|------|
| Navigate to directory | 2 min |
| Create schema file | 5 min |
| Copy PART1 content | 10 min |
| Copy PART2 content | 10 min |
| Format & validate | 5 min |
| Generate client | 10 min |
| Create database | 15 min |
| Backup old database | 2 min |
| Verify with Prisma Studio | 30 min |
| Troubleshoot (if needed) | 30 min |
| **Total** | **~2 hours** |

---

## Next Steps

After STEP_01 completion:

**STEP_02:** Run Migration Script
- Read data from old database
- Transform to new structure
- Write to new database
- Generate migration report

**Time:** 1-2 hours  
**File:** STEP_02_ACTIVATION.md

---

## Dependencies

**Requires:**
- ✅ REDESIGN_01_ACTIVATION_PART1.md (schema content)
- ✅ REDESIGN_01_ACTIVATION_PART2.md (schema content)
- ✅ Backend project with Prisma setup

**Enables:**
- 🔄 STEP_02: Data migration
- 🔄 STEP_03: Controller updates
- 🔄 All subsequent steps

---

## Critical Success Factors

1. **Complete Schema** - Must include BOTH PART1 and PART2
2. **Valid Syntax** - All validation steps must pass
3. **Backup Created** - Safety net for rollback
4. **Visual Verification** - Prisma Studio confirms structure
5. **59 Tables** - Exact count required

---

**Status:** Ready for Activation  
**Next:** STEP_01_ACTIVATION.md - Detailed execution instructions
