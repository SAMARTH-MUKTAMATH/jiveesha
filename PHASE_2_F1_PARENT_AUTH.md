# PHASE 2-F1: PARENT AUTHENTICATION & PROFILES
## Create Parent User System with Authentication

**Prompt ID:** 2-F1  
**Phase:** 2 - Parent Portal Backend  
**Section:** F - Parent Foundation  
**Dependencies:** Phase 1 complete  
**Estimated Time:** 25-30 minutes

---

## 🎯 OBJECTIVE

Create parent user system:
- Parent registration and authentication
- Parent profiles (separate from clinician users)
- Phone verification
- Preferred language settings
- Emergency contact information
- Parent-specific JWT tokens
- Password reset for parents

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add Parent Models to Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** APPEND these models to the end of the file:

```prisma
// ============================================
// PARENT PORTAL - Added in Phase 2-F1
// ============================================

model Parent {
  id                    String    @id @default(uuid())
  userId                String    @unique @map("user_id")
  phone                 String?
  phoneVerified         Boolean   @default(false) @map("phone_verified")
  emergencyContact      String?   @map("emergency_contact")
  emergencyPhone        String?   @map("emergency_phone")
  preferredLanguage     String    @default("en") @map("preferred_language")
  
  // Notifications preferences
  emailNotifications    Boolean   @default(true) @map("email_notifications")
  smsNotifications      Boolean   @default(false) @map("sms_notifications")
  
  // Account status
  accountStatus         String    @default("active") // active, suspended, deleted
  lastLoginAt           DateTime? @map("last_login_at")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  children              ParentChild[]
  screenings            ParentScreening[]
  peps                  PEP[]
  consentGrants         ConsentGrant[]
  
  @@index([userId])
  @@index([phone])
  @@map("parents")
}

model ParentChild {
  id                    String    @id @default(uuid())
  parentId              String    @map("parent_id")
  patientId             String    @map("patient_id")
  relationshipType      String    @map("relationship_type") // mother, father, guardian, other
  isPrimary             Boolean   @default(false) @map("is_primary") // Primary caregiver
  canConsent            Boolean   @default(true) @map("can_consent") // Can provide medical consent
  
  addedAt               DateTime  @default(now()) @map("added_at")
  
  parent                Parent    @relation(fields: [parentId], references: [id], onDelete: Cascade)
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@unique([parentId, patientId])
  @@index([parentId])
  @@index([patientId])
  @@map("parent_children")
}
```

**Run migration:**
```bash
cd backend
npx prisma migrate dev --name add_parent_models
npx prisma generate
```

---

### Step 2: Create Parent Auth Controller

**File:** `src/controllers/parent-auth.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Parent registration
 * POST /api/v1/parent/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      preferredLanguage,
      emergencyContact,
      emergencyPhone
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['email, password, firstName, and lastName are required']
        }
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already registered'
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and parent profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user account
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'parent',
          emailVerified: false
        }
      });

      // Create parent profile
      const parent = await tx.parent.create({
        data: {
          userId: user.id,
          phone,
          preferredLanguage: preferredLanguage || 'en',
          emergencyContact,
          emergencyPhone
        }
      });

      // Create basic profile (for name storage)
      await tx.clinicianProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          professionalTitle: 'Parent' // Placeholder
        }
      });

      return { user, parent };
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.user.id, 
        role: 'parent',
        parentId: result.parent.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role
        },
        parent: result.parent,
        token
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Parent registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register parent account'
      }
    });
  }
};

/**
 * Parent login
 * POST /api/v1/parent/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      });
    }

    // Find user with parent profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        parent: true,
        profile: true
      }
    });

    if (!user || user.role !== 'parent') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check account status
    if (user.parent?.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your account has been suspended'
        }
      });
    }

    // Update last login
    await prisma.parent.update({
      where: { id: user.parent.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: 'parent',
        parentId: user.parent.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName
        },
        parent: user.parent,
        token
      }
    });
  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to login'
      }
    });
  }
};

/**
 * Get parent profile
 * GET /api/v1/parent/auth/me
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        parent: {
          include: {
            children: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    gender: true
                  }
                }
              }
            }
          }
        },
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        parent: user.parent
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROFILE_FAILED',
        message: 'Failed to retrieve profile'
      }
    });
  }
};

/**
 * Update parent profile
 * PUT /api/v1/parent/auth/profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const {
      firstName,
      lastName,
      phone,
      emergencyContact,
      emergencyPhone,
      preferredLanguage,
      emailNotifications,
      smsNotifications
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parent: true, profile: true }
    });

    if (!user || !user.parent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PARENT_NOT_FOUND',
          message: 'Parent profile not found'
        }
      });
    }

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update profile name
      if (firstName || lastName) {
        await tx.clinicianProfile.update({
          where: { userId },
          data: {
            firstName: firstName || user.profile?.firstName,
            lastName: lastName || user.profile?.lastName
          }
        });
      }

      // Update parent-specific fields
      const parent = await tx.parent.update({
        where: { id: user.parent!.id },
        data: {
          phone,
          emergencyContact,
          emergencyPhone,
          preferredLanguage,
          emailNotifications,
          smsNotifications
        }
      });

      return parent;
    });

    res.json({
      success: true,
      data: result,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_PROFILE_FAILED',
        message: 'Failed to update profile'
      }
    });
  }
};

/**
 * Change password
 * POST /api/v1/parent/auth/change-password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Current password and new password are required'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CHANGE_PASSWORD_FAILED',
        message: 'Failed to change password'
      }
    });
  }
};
```

---

### Step 3: Create Parent Auth Routes

**File:** `src/routes/parent-auth.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/parent-auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
```

---

### Step 4: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**At the top with other imports:**
```typescript
import parentAuthRoutes from './routes/parent-auth.routes';
```

**In the routes section:**
```typescript
app.use(`${API_PREFIX}/parent/auth`, parentAuthRoutes);
```

---

### Step 5: Update User Model Relation

**File:** `prisma/schema.prisma`

**Action:** Find the `User` model and ADD this relation:

```prisma
model User {
  // ... existing fields ...
  
  parent                Parent? // Add this line
  
  // ... rest of existing relations ...
}
```

**Run migration again:**
```bash
npx prisma migrate dev --name update_user_parent_relation
npx prisma generate
```

---

### Step 6: Test the API

**Start server:**
```bash
npm run dev
```

**Test registration:**
```bash
curl -X POST http://localhost:5001/api/v1/parent/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "Test123!",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "phone": "+1234567890",
    "preferredLanguage": "en"
  }'
```

---

## ✅ SUCCESS CRITERIA

1. ✅ Parent and ParentChild models added to schema
2. ✅ Migration runs successfully
3. ✅ `parent-auth.controller.ts` created with 5 functions
4. ✅ `parent-auth.routes.ts` created
5. ✅ Routes registered in `app.ts`
6. ✅ Server starts without errors
7. ✅ Parent registration works
8. ✅ Parent login returns JWT token
9. ✅ Profile endpoints respond

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/parent/auth/register` | Parent registration |
| POST | `/api/v1/parent/auth/login` | Parent login |
| GET | `/api/v1/parent/auth/me` | Get profile |
| PUT | `/api/v1/parent/auth/profile` | Update profile |
| POST | `/api/v1/parent/auth/change-password` | Change password |

---

## ⏭️ NEXT PROMPT

**PHASE_2_F2** - Parent-Child Relationship Management

---

**Files Created:**
- ✅ `src/controllers/parent-auth.controller.ts`
- ✅ `src/routes/parent-auth.routes.ts`

**Files Modified:**
- ✅ `prisma/schema.prisma` (2 new models)
- ✅ `src/app.ts`

**Mark complete and proceed to 2-F2** ✅
