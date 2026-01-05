# SEED_DATA: Create Test Database - CONTEXT

## Overview

**Task:** Create comprehensive seed data  
**Phase:** Development Setup  
**Time Estimate:** 1-2 hours  
**Complexity:** Medium  
**Priority:** 🟡 HIGH - Enables realistic testing

---

## Objective

Create a TypeScript seed script that populates the database with realistic, comprehensive test data covering all major entities and relationships in the Daira platform.

---

## Why Seed Data Matters

### **Current State: Empty Database**
```
✅ Schema created (59 tables)
✅ Structure perfect
❌ No data to test with
❌ Manual data entry tedious
❌ Hard to test relationships
```

### **After Seed Data:**
```
✅ 10+ test parents
✅ 20+ test children
✅ Parent-child relationships
✅ 5+ test clinicians
✅ Clinical relationships
✅ Sample screenings
✅ Sample assessments
✅ Sample PEPs
✅ Sample access grants
✅ Complete test environment
```

---

## What Will Be Seeded

### **Category A: Users & Authentication**

**1. Parent Users (10 accounts)**
```
Parent 1: Sunita Sharma
  - Email: sunita.sharma@test.com
  - Password: Password123!
  - Phone: +91-9876543210
  - Children: 2 (Aarav, Ananya)
  
Parent 2: Rajesh Patel
  - Email: rajesh.patel@test.com
  - Password: Password123!
  - Phone: +91-9876543211
  - Children: 1 (Arjun)

Parent 3: Priya Desai
  - Email: priya.desai@test.com
  - Password: Password123!
  - Phone: +91-9876543212
  - Children: 3 (Diya, Ishaan, Kavya)

... (7 more parents)
```

**2. Clinician Users (5 accounts)**
```
Clinician 1: Dr. Anjali Patel
  - Email: anjali.patel@daira.com
  - Specialization: Developmental Pediatrics
  - Patients: 8

Clinician 2: Dr. Rajesh Kumar
  - Email: rajesh.kumar@daira.com
  - Specialization: Child Psychology
  - Patients: 6

... (3 more clinicians)
```

---

### **Category B: Core Entities**

**1. Persons (20+ unique individuals)**
```
Person 1: Aarav Sharma
  - DOB: 2020-03-15
  - Gender: Male
  - Age: 4 years old
  - Parent: Sunita Sharma
  - Clinician: Dr. Anjali Patel
  - Screenings: 2 (M-CHAT, ASQ)
  - Assessments: 1
  - PEP: Active

Person 2: Ananya Sharma
  - DOB: 2018-07-22
  - Gender: Female
  - Age: 6 years old
  - Parent: Sunita Sharma
  - Clinician: Dr. Rajesh Kumar
  - Screenings: 3
  - Assessments: 2
  - PEP: Active

... (18+ more persons with varied ages, genders, conditions)
```

**2. ParentChildViews (25+ relationships)**
```
- Multiple children per parent
- Multiple parents per child (divorced/separated cases)
- Various relationship types (parent, guardian, grandparent)
```

**3. ClinicianPatientViews (20+ relationships)**
```
- Multiple patients per clinician
- Varied case statuses (active, monitoring, discharged)
- Different diagnoses and concerns
```

---

### **Category C: Clinical Data**

**1. Screenings (40+ records)**
```
M-CHAT Screenings: 15
  - Various risk levels (low, medium, high)
  - Different completion statuses
  - Age-appropriate (16-30 months)

ASQ Screenings: 15
  - Different age intervals
  - Various domains assessed
  - Mixed results

CARS Screenings: 10
  - Autism severity ratings
  - Detailed observations
```

**2. Assessments (25+ records)**
```
Developmental Assessments: 10
Speech & Language: 8
Behavioral Assessments: 7

Each with:
  - Conducted by specific clinician
  - Findings and recommendations
  - Follow-up notes
```

**3. Education Plans (PEPs/IEPs) (15+ records)**
```
Active PEPs: 10
  - With goals (3-5 per plan)
  - With objectives (2-3 per goal)
  - With activities (5-10 per plan)
  - Progress tracking

Completed IEPs: 5
  - Historical data
  - Achievement records
```

---

### **Category D: Activities & Progress**

**1. Activities (50+ records)**
```
Categories:
  - Motor Skills (15 activities)
  - Communication (15 activities)
  - Social Skills (10 activities)
  - Cognitive (10 activities)

Each with:
  - Instructions
  - Duration
  - Difficulty level
  - Completion records
```

**2. Progress Records (100+ records)**
```
- Daily activity completions
- Parent notes
- Success ratings
- Photo evidence (simulated)
```

---

### **Category E: Access & Permissions**

**1. Access Grants (20+ records)**
```
Parent → Clinician grants: 15
  - Various permission levels
  - Some pending, some active
  - Token-based claiming

Clinician → Parent grants: 5
  - Report sharing
  - Assessment access
```

**2. Consent Management**
```
- Active consents
- Expired consents
- Revoked consents
- Token history
```

---

### **Category F: Communication**

**1. Journal Entries (30+ records)**
```
Parent journals:
  - Daily observations
  - Milestone celebrations
  - Concern logs
  - With photos/videos (simulated)
```

**2. Messages (40+ records)**
```
Parent ↔ Clinician: 30
Parent ↔ School: 10

- Various statuses (read/unread)
- Different priorities
- Threaded conversations
```

---

## Seed Data Characteristics

### **Realistic Demographics**

**Age Distribution:**
```
0-2 years: 4 children (early intervention)
3-5 years: 8 children (preschool)
6-10 years: 6 children (school age)
11-15 years: 2 children (adolescent)
```

**Gender Distribution:**
```
Male: 12 (60%)
Female: 8 (40%)
```

**Geographic Distribution (India):**
```
Bhubaneswar, Odisha: 8 children
Mumbai, Maharashtra: 5 children
Delhi: 4 children
Bangalore, Karnataka: 3 children
```

**Language Distribution:**
```
Primary Language:
  - English: 8
  - Hindi: 6
  - Odia: 4
  - Tamil: 2

Multilingual: 12 children speak 2+ languages
```

---

### **Clinical Diversity**

**Diagnostic Spectrum:**
```
Autism Spectrum Disorder (ASD): 8 children
  - Mild: 3
  - Moderate: 4
  - Severe: 1

Speech Delays: 5 children
ADHD: 3 children
Developmental Delays: 4 children
No diagnosis (screening only): 5 children
```

**Screening Results Distribution:**
```
Low Risk: 30% (12 screenings)
Medium Risk: 45% (18 screenings)
High Risk: 25% (10 screenings)
```

---

### **Family Scenarios**

**Family Structures:**
```
Nuclear family (both parents): 12 children
Single parent: 5 children
Joint family (grandparents): 2 children
Divorced/separated: 1 child (2 parent records)
```

**Socioeconomic Diversity:**
```
Urban, educated parents: 12
Semi-urban: 5
Rural: 3
```

---

## Data Quality Standards

### **Consistency Rules**

1. **Temporal Consistency:**
   - Children's DOB → Age-appropriate screenings
   - Screenings → Subsequent assessments
   - Assessments → Education plans
   - All timestamps logical sequence

2. **Relationship Integrity:**
   - Every ParentChildView → Valid Person + Parent
   - Every ClinicianPatientView → Valid Person + Clinician
   - Every AccessGrant → Valid grantor + grantee + person
   - No orphaned records

3. **Domain Validity:**
   - Email formats correct
   - Phone numbers valid Indian format
   - Dates realistic (not future dates)
   - Status values from allowed enums

---

### **Variability Patterns**

**Complete Profiles (30%):**
```
- All fields filled
- Rich history
- Multiple screenings
- Active treatment
```

**Partial Profiles (50%):**
```
- Basic info complete
- 1-2 screenings
- Some missing optional fields
- Realistic for new patients
```

**Minimal Profiles (20%):**
```
- Just registered
- Basic demographics only
- Pending first screening
- Represents intake phase
```

---

## Expected Outcomes

### **After Running Seed Script:**

**Database State:**
```
✅ 10 parent accounts (all loginable)
✅ 5 clinician accounts (all loginable)
✅ 20+ unique persons (children)
✅ 25+ parent-child relationships
✅ 20+ clinician-patient relationships
✅ 40+ screening records
✅ 25+ assessment records
✅ 15+ education plans
✅ 50+ activities
✅ 100+ progress records
✅ 20+ access grants
✅ 30+ journal entries
✅ 40+ messages
```

**Test Scenarios Enabled:**
```
✅ Parent can login and see their children
✅ Parent can view screening results
✅ Parent can manage PEP activities
✅ Parent can share access with clinician
✅ Clinician can login and see patients
✅ Clinician can add assessments
✅ Clinician can create IEPs
✅ Complete data flow testing
```

---

## Seed Script Structure

### **Phases:**

```typescript
Phase 1: Clear existing data (if any)
Phase 2: Create users (parents + clinicians)
Phase 3: Create persons (children)
Phase 4: Create views (relationships)
Phase 5: Create screenings
Phase 6: Create assessments
Phase 7: Create education plans
Phase 8: Create activities & progress
Phase 9: Create access grants
Phase 10: Create communication data
Phase 11: Verify & report
```

### **Execution Time:**

```
Phase 1: 1 second
Phase 2: 5 seconds (password hashing)
Phase 3: 3 seconds
Phase 4: 2 seconds
Phase 5: 3 seconds
Phase 6: 2 seconds
Phase 7: 4 seconds
Phase 8: 5 seconds
Phase 9: 2 seconds
Phase 10: 3 seconds
Phase 11: 1 second

Total: ~30 seconds
```

---

## Testing Value

### **What You Can Test:**

**Authentication:**
- Login as any of 10 parents
- Login as any of 5 clinicians
- Token generation and validation

**Parent Features:**
- Dashboard with multiple children
- Add new child
- View child profiles
- Start screenings
- Track PEP activities
- Share access with clinician

**Clinician Features:**
- View patient list
- Access shared children
- Add assessments
- Create treatment plans
- Message parents

**Edge Cases:**
- Multiple children per parent
- Multiple parents per child
- Expired access grants
- Incomplete screenings
- Various status combinations

---

## Maintenance

### **Easy Reset:**

```bash
# Clear all data and reseed
npm run db:reset
npm run seed

# Or combine:
npm run db:fresh
```

### **Partial Seeding:**

```typescript
// Seed only users
npm run seed:users

// Seed only clinical data
npm run seed:clinical

// Seed only sample children
npm run seed:children
```

---

## Security Considerations

### **Test Data Markers:**

All seeded data will be marked as test data:
```typescript
- Emails use @test.com domain
- Passwords are all Password123! (clearly test)
- Phone numbers use +91-987654xxxx pattern
- Names are clearly fictional
```

### **Production Safety:**

```typescript
// Prevent accidental seeding in production
if (process.env.NODE_ENV === 'production') {
  throw new Error('Cannot run seed in production!');
}
```

---

## Dependencies

**Requires:**
- ✅ Unified schema created
- ✅ Database migrations run
- ✅ Prisma client generated
- ✅ TypeScript configured

**Enables:**
- 🔄 Realistic testing
- 🔄 Feature development
- 🔄 UI/UX validation
- 🔄 Performance testing

---

**Status:** Ready for Activation  
**Next:** SEED_DATA_ACTIVATION.md - Complete seed script
