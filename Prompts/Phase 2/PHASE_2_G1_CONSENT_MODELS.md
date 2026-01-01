# PHASE 2-G1: CONSENT MODELS & TOKEN SYSTEM
## Add Consent Grant Database Models with Token System

**Prompt ID:** 2-G1  
**Phase:** 2 - Parent Portal Backend  
**Section:** G - Consent System  
**Dependencies:** 2-F1, 2-F2 complete  
**Estimated Time:** 15-20 minutes

---

## 🎯 OBJECTIVE

Create consent management database models:
- ConsentGrant model (parent grants clinician access to child data)
- 8-character unique token generation
- Permission levels (view, edit, full_access)
- Expiration dates
- Revocation tracking
- Audit trail

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add Consent Models to Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** APPEND these models to the end of the file:

```prisma
// ============================================
// CONSENT MANAGEMENT - Added in Phase 2-G1
// ============================================

model ConsentGrant {
  id                    String    @id @default(uuid())
  token                 String    @unique // 8-character unique token
  
  // Parties
  parentId              String    @map("parent_id")
  patientId             String    @map("patient_id")
  clinicianId           String?   @map("clinician_id") // Null if not yet claimed
  
  // Permissions
  permissions           Json      @default("{\"view\": true, \"edit\": false, \"assessments\": true, \"reports\": true, \"iep\": false}")
  accessLevel           String    @default("view") @map("access_level") // view, edit, full_access
  
  // Status
  status                String    @default("pending") // pending, active, revoked, expired
  
  // Dates
  grantedAt             DateTime  @default(now()) @map("granted_at")
  activatedAt           DateTime? @map("activated_at") // When clinician claimed the token
  expiresAt             DateTime? @map("expires_at")
  revokedAt             DateTime? @map("revoked_at")
  
  // Metadata
  grantedByName         String    @map("granted_by_name")
  grantedByEmail        String    @map("granted_by_email")
  clinicianEmail        String?   @map("clinician_email") // Email to send token to
  notes                 String?   @db.Text
  
  // Audit trail
  auditLog              Json      @default("[]") @map("audit_log") // [{action, timestamp, userId}]
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  parent                Parent    @relation(fields: [parentId], references: [id], onDelete: Cascade)
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  clinician             User?     @relation("ConsentGrantClinician", fields: [clinicianId], references: [id])
  
  @@index([parentId])
  @@index([patientId])
  @@index([clinicianId])
  @@index([token])
  @@index([status])
  @@map("consent_grants")
}
```

---

### Step 2: Update Related Models

**File:** `prisma/schema.prisma`

**Action:** Update these models to add consent relations:

**Find User model and ADD:**
```prisma
model User {
  // ... existing fields ...
  
  consentGrantsReceived ConsentGrant[] @relation("ConsentGrantClinician") // Add this line
  
  // ... rest of existing relations ...
}
```

**Find Patient model and ADD:**
```prisma
model Patient {
  // ... existing fields ...
  
  consentGrants         ConsentGrant[] // Add this line
  
  // ... rest of existing relations ...
}
```

---

### Step 3: Create Token Generator Utility

**File:** `src/utils/token-generator.ts`

**Action:** Create this NEW file:

```typescript
/**
 * Generate a random 8-character alphanumeric token
 * Format: XXXX-XXXX (e.g., AB12-CD34)
 */
export function generateConsentToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0, O, I, 1)
  let token = '';
  
  for (let i = 0; i < 8; i++) {
    if (i === 4) {
      token += '-'; // Add separator
    }
    const randomIndex = Math.floor(Math.random() * chars.length);
    token += chars[randomIndex];
  }
  
  return token;
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string): boolean {
  const pattern = /^[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(token);
}

/**
 * Generate unique token (checks database)
 */
export async function generateUniqueConsentToken(prisma: any): Promise<string> {
  let token = generateConsentToken();
  let attempts = 0;
  const maxAttempts = 10;
  
  // Ensure token is unique
  while (attempts < maxAttempts) {
    const existing = await prisma.consentGrant.findUnique({
      where: { token }
    });
    
    if (!existing) {
      return token;
    }
    
    token = generateConsentToken();
    attempts++;
  }
  
  throw new Error('Failed to generate unique token');
}
```

---

### Step 4: Run Migration

**Commands:**
```bash
cd backend
npx prisma migrate dev --name add_consent_models
npx prisma generate
```

**Expected Output:**
```
✔ Prisma Migrate applied the migration
✔ Generated Prisma Client

Database changes:
- Created table "consent_grants"
- Updated table "users" (added relation)
- Updated table "patients" (added relation)
```

---

### Step 5: Create Seed Data for Testing

**File:** `prisma/seed.ts`

**Action:** ADD this function to seed.ts (if not already present, create the file):

```typescript
import { PrismaClient } from '@prisma/client';
import { generateUniqueConsentToken } from '../src/utils/token-generator';

const prisma = new PrismaClient();

async function seedConsentGrants() {
  console.log('Seeding consent grants...');
  
  // Example: Create a pending consent grant
  const token = await generateUniqueConsentToken(prisma);
  
  const consent = await prisma.consentGrant.create({
    data: {
      token,
      parentId: 'parent-uuid', // Replace with actual parent ID
      patientId: 'patient-uuid', // Replace with actual patient ID
      grantedByName: 'Sarah Johnson',
      grantedByEmail: 'sarah@example.com',
      clinicianEmail: 'dr.smith@clinic.com',
      permissions: {
        view: true,
        edit: false,
        assessments: true,
        reports: true,
        iep: false
      },
      accessLevel: 'view',
      status: 'pending',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      auditLog: [
        {
          action: 'created',
          timestamp: new Date(),
          userId: 'parent-uuid',
          notes: 'Initial consent grant created'
        }
      ]
    }
  });
  
  console.log('Created consent grant:', consent.token);
}

// Run if this is the main module
async function main() {
  await seedConsentGrants();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed (optional):**
```bash
npx prisma db seed
```

---

### Step 6: Test Token Generator

**Create test file:** `src/utils/token-generator.test.ts` (optional)

```typescript
import { generateConsentToken, isValidTokenFormat } from './token-generator';

// Test token generation
const token = generateConsentToken();
console.log('Generated token:', token);
console.log('Is valid format:', isValidTokenFormat(token));

// Test multiple tokens are unique
const tokens = new Set();
for (let i = 0; i < 100; i++) {
  tokens.add(generateConsentToken());
}
console.log('Generated 100 tokens, unique count:', tokens.size);
```

**Run test:**
```bash
npx ts-node src/utils/token-generator.test.ts
```

---

### Step 7: Verify Database Schema

**Command:**
```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/daira_dev

# Check table
\d consent_grants

# Exit
\q
```

**Expected columns:**
- id, token, parent_id, patient_id, clinician_id
- permissions, access_level, status
- granted_at, activated_at, expires_at, revoked_at
- granted_by_name, granted_by_email, clinician_email
- notes, audit_log
- created_at, updated_at

---

## ✅ SUCCESS CRITERIA

1. ✅ ConsentGrant model added to schema
2. ✅ User and Patient models updated with relations
3. ✅ Migration runs successfully
4. ✅ `token-generator.ts` utility created
5. ✅ Token generation works (8 chars, format XXXX-XXXX)
6. ✅ Tokens are unique
7. ✅ Database table `consent_grants` created
8. ✅ All columns present with correct types
9. ✅ Indexes created

---

## 🧪 VERIFICATION TESTS

### Test 1: Check Schema File
```bash
grep -A 30 "model ConsentGrant" prisma/schema.prisma
```
**Expected:** Should show the complete model definition

### Test 2: Generate Token
```bash
node -e "const {generateConsentToken} = require('./dist/utils/token-generator'); console.log(generateConsentToken());"
```
**Expected:** Token like `AB12-CD34`

### Test 3: Check Database
```bash
psql daira_dev -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'consent_grants';"
```
**Expected:** List of all columns

---

## 📊 DATABASE SCHEMA SUMMARY

**Table:** `consent_grants`

**Key Fields:**
- `token` - Unique 8-char code (XXXX-XXXX format)
- `parentId` - Parent who granted consent
- `patientId` - Child/patient the consent is for
- `clinicianId` - Clinician who receives access (null until claimed)
- `permissions` - JSON object with granular permissions
- `status` - pending → active → revoked/expired
- `auditLog` - Complete history of all actions

**Use Cases:**
1. Parent generates token to share child data
2. Parent sends token to clinician via email
3. Clinician claims token (status: pending → active)
4. Clinician accesses child data within permissions
5. Parent can revoke anytime
6. Token auto-expires after set date

---

## ⏭️ NEXT PROMPT

**PHASE_2_G2** - Consent Management API (grant, claim, revoke, list)

---

**Files Created:**
- ✅ `src/utils/token-generator.ts`
- ✅ (Optional) `src/utils/token-generator.test.ts`

**Files Modified:**
- ✅ `prisma/schema.prisma` (1 new model, 2 model updates)
- ✅ (Optional) `prisma/seed.ts`

**Mark complete and proceed to 2-G2** ✅
