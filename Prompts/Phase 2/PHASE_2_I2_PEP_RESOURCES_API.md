# PHASE 2-I2: PEP BUILDER & RESOURCES API
## Create PEP Management and Resource Library APIs (FINAL Phase 2 Prompt!)

**Prompt ID:** 2-I2  
**Phase:** 2 - Parent Portal Backend  
**Section:** I - Parent Education & Resources  
**Dependencies:** 2-I1 complete  
**Estimated Time:** 30-35 minutes

---

## 🎯 OBJECTIVE

Create PEP Builder and Resource Library APIs:
- **PEP Management** - Create, update, manage home education plans
- **Goal Setting** - Add and track goals
- **Activity Management** - Create and complete activities
- **Progress Tracking** - Track goal progress and activity completions
- **Resource Library** - Browse, search, and favorite resources
- **Resource Integration** - Link resources to activities

This is the **FINAL prompt for Phase 2**! 🎉

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create PEP Controller

**File:** `src/controllers/pep.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create PEP
 * POST /api/v1/parent/pep
 */
export const createPEP = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const {
      patientId,
      planName,
      focusAreas,
      startDate,
      description,
      linkedIEPId
    } = req.body;

    // Validate
    if (!patientId || !planName || !startDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'patientId, planName, and startDate are required'
        }
      });
    }

    // Get parent
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parent: true }
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

    // Verify access to child
    const relationship = await prisma.parentChild.findUnique({
      where: {
        parentId_patientId: {
          parentId: user.parent.id,
          patientId
        }
      }
    });

    if (!relationship) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this child'
        }
      });
    }

    // Create PEP
    const pep = await prisma.pEP.create({
      data: {
        parentId: user.parent.id,
        patientId,
        planName,
        focusAreas: focusAreas || [],
        startDate: new Date(startDate),
        description,
        linkedIEPId,
        status: 'active'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: pep
    });
  } catch (error) {
    console.error('Create PEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_PEP_FAILED',
        message: 'Failed to create PEP'
      }
    });
  }
};

/**
 * Get PEP by ID
 * GET /api/v1/parent/pep/:id
 */
export const getPEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pep = await prisma.pEP.findUnique({
      where: { id },
      include: {
        patient: true,
        goals: {
          include: {
            activities: true,
            progressUpdates: {
              orderBy: { updateDate: 'desc' },
              take: 5
            }
          },
          orderBy: { goalNumber: 'asc' }
        },
        activities: {
          include: {
            completions: {
              orderBy: { completedAt: 'desc' },
              take: 3
            }
          }
        }
      }
    });

    if (!pep) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PEP_NOT_FOUND',
          message: 'PEP not found'
        }
      });
    }

    res.json({
      success: true,
      data: pep
    });
  } catch (error) {
    console.error('Get PEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PEP_FAILED',
        message: 'Failed to retrieve PEP'
      }
    });
  }
};

/**
 * Get all PEPs for child
 * GET /api/v1/parent/pep/child/:patientId
 */
export const getChildPEPs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { patientId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parent: true }
    });

    // Verify access
    const relationship = await prisma.parentChild.findUnique({
      where: {
        parentId_patientId: {
          parentId: user!.parent!.id,
          patientId
        }
      }
    });

    if (!relationship) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this child'
        }
      });
    }

    const peps = await prisma.pEP.findMany({
      where: { patientId },
      include: {
        _count: {
          select: {
            goals: true,
            activities: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: peps
    });
  } catch (error) {
    console.error('Get child PEPs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PEPS_FAILED',
        message: 'Failed to retrieve PEPs'
      }
    });
  }
};

/**
 * Update PEP
 * PUT /api/v1/parent/pep/:id
 */
export const updatePEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.parentId;
    delete updateData.patientId;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const pep = await prisma.pEP.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: pep
    });
  } catch (error) {
    console.error('Update PEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_PEP_FAILED',
        message: 'Failed to update PEP'
      }
    });
  }
};

/**
 * Add goal to PEP
 * POST /api/v1/parent/pep/:id/goals
 */
export const addGoal = async (req: Request, res: Response) => {
  try {
    const { id: pepId } = req.params;
    const {
      goalNumber,
      domain,
      goalStatement,
      targetDate,
      targetCriteria,
      linkedIEPGoalId
    } = req.body;

    const goal = await prisma.pEPGoal.create({
      data: {
        pepId,
        goalNumber,
        domain,
        goalStatement,
        targetDate: targetDate ? new Date(targetDate) : null,
        targetCriteria,
        linkedIEPGoalId
      }
    });

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Add goal error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_GOAL_FAILED',
        message: 'Failed to add goal'
      }
    });
  }
};

/**
 * Add activity to PEP
 * POST /api/v1/parent/pep/:id/activities
 */
export const addActivity = async (req: Request, res: Response) => {
  try {
    const { id: pepId } = req.params;
    const {
      goalId,
      activityName,
      activityType,
      description,
      instructions,
      materials,
      duration,
      frequency,
      linkedResourceId
    } = req.body;

    const activity = await prisma.pEPActivity.create({
      data: {
        pepId,
        goalId,
        activityName,
        activityType,
        description,
        instructions,
        materials,
        duration,
        frequency,
        linkedResourceId
      }
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_ACTIVITY_FAILED',
        message: 'Failed to add activity'
      }
    });
  }
};

/**
 * Complete activity
 * POST /api/v1/parent/pep/activities/:activityId/complete
 */
export const completeActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const {
      duration,
      childEngagement,
      parentObservations,
      challengesFaced,
      successesNoted,
      photos,
      videos
    } = req.body;

    const completion = await prisma.activityCompletion.create({
      data: {
        activityId,
        duration,
        childEngagement,
        parentObservations,
        challengesFaced,
        successesNoted,
        photos,
        videos
      }
    });

    // Update activity completion count
    await prisma.pEPActivity.update({
      where: { id: activityId },
      data: {
        completionCount: { increment: 1 },
        lastCompletedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: completion
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'COMPLETE_ACTIVITY_FAILED',
        message: 'Failed to record completion'
      }
    });
  }
};

/**
 * Update goal progress
 * POST /api/v1/parent/pep/goals/:goalId/progress
 */
export const updateGoalProgress = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const {
      progressPercentage,
      status,
      notes,
      observations
    } = req.body;

    const progress = await prisma.pEPGoalProgress.create({
      data: {
        goalId,
        progressPercentage,
        status,
        notes,
        observations
      }
    });

    // Update goal progress
    await prisma.pEPGoal.update({
      where: { id: goalId },
      data: {
        currentProgress: progressPercentage,
        progressStatus: status
      }
    });

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_PROGRESS_FAILED',
        message: 'Failed to update progress'
      }
    });
  }
};
```

---

### Step 2: Create Resources Controller

**File:** `src/controllers/resources.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all resources (with filtering)
 * GET /api/v1/parent/resources
 */
export const getResources = async (req: Request, res: Response) => {
  try {
    const {
      resourceType,
      category,
      ageRange,
      difficulty,
      search,
      featured
    } = req.query;

    const where: any = { isPublished: true };

    if (resourceType) where.resourceType = resourceType as string;
    if (category) where.category = category as string;
    if (ageRange) where.ageRange = ageRange as string;
    if (difficulty) where.difficulty = difficulty as string;
    if (featured === 'true') where.isFeatured = true;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { views: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_RESOURCES_FAILED',
        message: 'Failed to retrieve resources'
      }
    });
  }
};

/**
 * Get resource by ID
 * GET /api/v1/parent/resources/:id
 */
export const getResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found'
        }
      });
    }

    // Increment view count
    await prisma.resource.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_RESOURCE_FAILED',
        message: 'Failed to retrieve resource'
      }
    });
  }
};

/**
 * Get featured resources
 * GET /api/v1/parent/resources/featured
 */
export const getFeaturedResources = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const resources = await prisma.resource.findMany({
      where: {
        isPublished: true,
        isFeatured: true
      },
      orderBy: { views: 'desc' },
      take: Number(limit)
    });

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get featured resources error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FEATURED_FAILED',
        message: 'Failed to retrieve featured resources'
      }
    });
  }
};

/**
 * Get resources by category
 * GET /api/v1/parent/resources/category/:category
 */
export const getResourcesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const resources = await prisma.resource.findMany({
      where: {
        category,
        isPublished: true
      },
      orderBy: { views: 'desc' }
    });

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get resources by category error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_CATEGORY_FAILED',
        message: 'Failed to retrieve resources'
      }
    });
  }
};
```

---

### Step 3: Create Routes

**File:** `src/routes/pep.routes.ts`

```typescript
import express from 'express';
import {
  createPEP,
  getPEP,
  getChildPEPs,
  updatePEP,
  addGoal,
  addActivity,
  completeActivity,
  updateGoalProgress
} from '../controllers/pep.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// PEP CRUD
router.post('/', createPEP);
router.get('/child/:patientId', getChildPEPs);
router.get('/:id', getPEP);
router.put('/:id', updatePEP);

// Goals
router.post('/:id/goals', addGoal);
router.post('/goals/:goalId/progress', updateGoalProgress);

// Activities
router.post('/:id/activities', addActivity);
router.post('/activities/:activityId/complete', completeActivity);

export default router;
```

**File:** `src/routes/resources.routes.ts`

```typescript
import express from 'express';
import {
  getResources,
  getResource,
  getFeaturedResources,
  getResourcesByCategory
} from '../controllers/resources.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getResources);
router.get('/featured', getFeaturedResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/:id', getResource);

export default router;
```

---

### Step 4: Register Routes in app.ts

**File:** `src/app.ts`

**Add imports:**
```typescript
import pepRoutes from './routes/pep.routes';
import resourceRoutes from './routes/resources.routes';
```

**Add registrations:**
```typescript
app.use(`${API_PREFIX}/parent/pep`, pepRoutes);
app.use(`${API_PREFIX}/parent/resources`, resourceRoutes);
```

---

### Step 5: Test Server

```bash
npm run dev
```

---

## ✅ SUCCESS CRITERIA - PHASE 2 COMPLETE!

1. ✅ `pep.controller.ts` created with 8 functions
2. ✅ `resources.controller.ts` created with 4 functions
3. ✅ Both routes files created
4. ✅ Routes registered in `app.ts`
5. ✅ Server starts without errors
6. ✅ All endpoints respond

---

## 🎉 PHASE 2 COMPLETE!

**Congratulations! You've completed ALL 8 Phase 2 prompts:**

✅ 2-F1: Parent Authentication  
✅ 2-F2: Parent-Child Links  
✅ 2-G1: Consent Models  
✅ 2-G2: Consent API  
✅ 2-H1: Screening Models  
✅ 2-H2: Screening API  
✅ 2-I1: PEP Models  
✅ 2-I2: PEP & Resources API ← **FINAL!**

---

## 📊 WHAT YOU'VE BUILT IN PHASE 2

**Complete Parent Portal Backend with:**
- ✅ Parent authentication & profiles
- ✅ Parent-child relationship management
- ✅ Token-based consent system
- ✅ Parent-led screenings (M-CHAT, ASQ)
- ✅ PEP Builder (home education plans)
- ✅ Resource library
- ✅ Activity tracking
- ✅ Progress monitoring

**Total Phase 2:**
- 🗄️ **15+ database tables**
- 🔌 **50+ API endpoints**
- 📁 **12 controller files**
- 🛣️ **12 route files**

---

## 📊 API ENDPOINTS SUMMARY

**PEP Management:**
- POST `/api/v1/parent/pep` - Create PEP
- GET `/api/v1/parent/pep/:id` - Get PEP
- GET `/api/v1/parent/pep/child/:id` - List child PEPs
- PUT `/api/v1/parent/pep/:id` - Update PEP
- POST `/api/v1/parent/pep/:id/goals` - Add goal
- POST `/api/v1/parent/pep/:id/activities` - Add activity
- POST `/api/v1/parent/pep/activities/:id/complete` - Complete activity
- POST `/api/v1/parent/pep/goals/:id/progress` - Update progress

**Resources:**
- GET `/api/v1/parent/resources` - List/search resources
- GET `/api/v1/parent/resources/featured` - Featured resources
- GET `/api/v1/parent/resources/category/:category` - By category
- GET `/api/v1/parent/resources/:id` - Get resource

---

## ⏭️ READY FOR PHASE 3?

Phase 3 will be **Parent Portal Frontend** (20 prompts):
- Using the 14 Figma designs you have
- React components with Tailwind
- Complete parent dashboard
- Child management UI
- Screening flow
- PEP builder UI
- And more!

Tell me when you're ready for Phase 3! 🚀

---

**Mark Phase 2 COMPLETE!** 🎊
