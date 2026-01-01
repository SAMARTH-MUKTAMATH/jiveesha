# PHASE 1-D1: IEP BUILDER API CONTROLLER
## Create Individualized Education Program (IEP) API

**Prompt ID:** 1-D1  
**Phase:** 1 - Complete Clinician Backend  
**Section:** D - IEP System  
**Dependencies:** 1-A1, 1-A2, 1-B1, 1-B2, 1-C1, 1-C2 complete  
**Estimated Time:** 35-40 minutes

---

## 🎯 OBJECTIVE

Create comprehensive IEP Builder API for:
- Create and manage IEPs (Individualized Education Programs)
- Add goals with objectives
- Track goal progress
- Add accommodations
- Manage IEP services
- Team member management
- Digital signatures (parent/clinician)
- Progress reports

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create IEP Controller

**File:** `src/controllers/iep.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create new IEP
 * POST /api/v1/iep
 */
export const createIEP = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      academicYear,
      startDate,
      endDate,
      academicPerformance,
      functionalPerformance,
      strengths,
      concerns,
      impactOfDisability,
      placementType,
      placementPercentage,
      placementJustification,
      lreJustification,
      schoolName,
      grade,
      teacher
    } = req.body;

    // Validate required fields
    if (!patientId || !academicYear || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['patientId, academicYear, startDate, and endDate are required']
        }
      });
    }

    // Create IEP
    const iep = await prisma.iEP.create({
      data: {
        patientId,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        academicPerformance,
        functionalPerformance,
        strengths,
        concerns,
        impactOfDisability,
        placementType,
        placementPercentage,
        placementJustification,
        lreJustification,
        schoolName,
        grade,
        teacher,
        status: 'draft'
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

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId,
        activityType: 'iep_created',
        description: `IEP created for ${academicYear}`,
        metadata: { iepId: iep.id },
        createdBy: (req as any).userId
      }
    });

    res.status(201).json({
      success: true,
      data: iep
    });
  } catch (error) {
    console.error('Create IEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_IEP_FAILED',
        message: 'Failed to create IEP'
      }
    });
  }
};

/**
 * Get IEP by ID
 * GET /api/v1/iep/:id
 */
export const getIEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const iep = await prisma.iEP.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true
          }
        },
        goals: {
          include: {
            objectives: true,
            progressUpdates: {
              orderBy: { updateDate: 'desc' },
              take: 5
            }
          },
          orderBy: { goalNumber: 'asc' }
        },
        accommodations: true,
        services: true,
        teamMembers: true,
        progressReports: {
          orderBy: { reportDate: 'desc' }
        }
      }
    });

    if (!iep) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IEP_NOT_FOUND',
          message: 'IEP not found'
        }
      });
    }

    res.json({
      success: true,
      data: iep
    });
  } catch (error) {
    console.error('Get IEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_IEP_FAILED',
        message: 'Failed to retrieve IEP'
      }
    });
  }
};

/**
 * Get all IEPs for a patient
 * GET /api/v1/iep/patient/:patientId
 */
export const getPatientIEPs = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    const where: any = { patientId };
    if (status) where.status = status as string;

    const ieps = await prisma.iEP.findMany({
      where,
      include: {
        goals: {
          select: {
            id: true,
            goalNumber: true,
            domain: true,
            currentProgress: true
          }
        },
        _count: {
          select: {
            goals: true,
            services: true,
            accommodations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: ieps
    });
  } catch (error) {
    console.error('Get patient IEPs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_IEPS_FAILED',
        message: 'Failed to retrieve IEPs'
      }
    });
  }
};

/**
 * Update IEP
 * PUT /api/v1/iep/:id
 */
export const updateIEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.patientId;

    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.nextReviewDate) updateData.nextReviewDate = new Date(updateData.nextReviewDate);

    const iep = await prisma.iEP.update({
      where: { id },
      data: updateData,
      include: {
        goals: true,
        accommodations: true,
        services: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: iep.patientId,
        activityType: 'iep_updated',
        description: 'IEP updated',
        metadata: { iepId: iep.id },
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      data: iep
    });
  } catch (error) {
    console.error('Update IEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_IEP_FAILED',
        message: 'Failed to update IEP'
      }
    });
  }
};

/**
 * Delete IEP
 * DELETE /api/v1/iep/:id
 */
export const deleteIEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get IEP for logging
    const iep = await prisma.iEP.findUnique({
      where: { id },
      select: { patientId: true, academicYear: true }
    });

    if (!iep) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IEP_NOT_FOUND',
          message: 'IEP not found'
        }
      });
    }

    // Delete (cascades to goals, accommodations, services, team members, progress reports)
    await prisma.iEP.delete({
      where: { id }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: iep.patientId,
        activityType: 'iep_deleted',
        description: `IEP for ${iep.academicYear} deleted`,
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      message: 'IEP deleted successfully'
    });
  } catch (error) {
    console.error('Delete IEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_IEP_FAILED',
        message: 'Failed to delete IEP'
      }
    });
  }
};

/**
 * Add goal to IEP
 * POST /api/v1/iep/:id/goals
 */
export const addGoal = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;
    const {
      goalNumber,
      domain,
      priority,
      goalStatement,
      baselineData,
      targetCriteria,
      targetDate,
      measurementMethod,
      objectives
    } = req.body;

    const goal = await prisma.iEPGoal.create({
      data: {
        iepId,
        goalNumber,
        domain,
        priority,
        goalStatement,
        baselineData,
        targetCriteria,
        targetDate: targetDate ? new Date(targetDate) : null,
        measurementMethod,
        objectives: {
          create: objectives?.map((obj: any, index: number) => ({
            objectiveNumber: index + 1,
            objectiveText: obj.text,
            criteria: obj.criteria,
            targetDate: obj.targetDate ? new Date(obj.targetDate) : null
          })) || []
        }
      },
      include: {
        objectives: true
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
 * Update goal
 * PUT /api/v1/iep/goals/:goalId
 */
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.iepId;
    delete updateData.createdAt;

    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate);
    }

    const goal = await prisma.iEPGoal.update({
      where: { id: goalId },
      data: updateData,
      include: {
        objectives: true
      }
    });

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_GOAL_FAILED',
        message: 'Failed to update goal'
      }
    });
  }
};

/**
 * Delete goal
 * DELETE /api/v1/iep/goals/:goalId
 */
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;

    await prisma.iEPGoal.delete({
      where: { id: goalId }
    });

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_GOAL_FAILED',
        message: 'Failed to delete goal'
      }
    });
  }
};

/**
 * Add progress update to goal
 * POST /api/v1/iep/goals/:goalId/progress
 */
export const addGoalProgress = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const userId = (req as any).userId;
    const {
      updateDate,
      progressPercentage,
      status,
      notes,
      evidence
    } = req.body;

    const progressUpdate = await prisma.goalProgressUpdate.create({
      data: {
        goalId,
        updateDate: new Date(updateDate),
        progressPercentage,
        status,
        notes,
        evidence,
        updatedBy: userId
      }
    });

    // Update goal's current progress
    await prisma.iEPGoal.update({
      where: { id: goalId },
      data: {
        currentProgress: progressPercentage,
        progressStatus: status
      }
    });

    res.status(201).json({
      success: true,
      data: progressUpdate
    });
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_PROGRESS_FAILED',
        message: 'Failed to add progress update'
      }
    });
  }
};

/**
 * Add accommodation to IEP
 * POST /api/v1/iep/:id/accommodations
 */
export const addAccommodation = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;
    const { category, accommodationText, frequency } = req.body;

    const accommodation = await prisma.iEPAccommodation.create({
      data: {
        iepId,
        category,
        accommodationText,
        frequency
      }
    });

    res.status(201).json({
      success: true,
      data: accommodation
    });
  } catch (error) {
    console.error('Add accommodation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_ACCOMMODATION_FAILED',
        message: 'Failed to add accommodation'
      }
    });
  }
};

/**
 * Delete accommodation
 * DELETE /api/v1/iep/accommodations/:accommodationId
 */
export const deleteAccommodation = async (req: Request, res: Response) => {
  try {
    const { accommodationId } = req.params;

    await prisma.iEPAccommodation.delete({
      where: { id: accommodationId }
    });

    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ACCOMMODATION_FAILED',
        message: 'Failed to delete accommodation'
      }
    });
  }
};

/**
 * Sign IEP (parent or clinician)
 * POST /api/v1/iep/:id/sign
 */
export const signIEP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signerType, signature } = req.body; // signerType: 'parent' or 'clinician'

    if (!['parent', 'clinician'].includes(signerType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SIGNER_TYPE',
          message: 'signerType must be either "parent" or "clinician"'
        }
      });
    }

    const updateData: any = {};
    if (signerType === 'parent') {
      updateData.signedByParent = true;
      updateData.parentSignedAt = new Date();
      updateData.parentSignature = signature;
    } else {
      updateData.signedByClinician = true;
      updateData.clinicianSignedAt = new Date();
      updateData.clinicianSignature = signature;
    }

    const iep = await prisma.iEP.update({
      where: { id },
      data: updateData
    });

    // Check if both signed, then activate
    if (iep.signedByParent && iep.signedByClinician && iep.status === 'draft') {
      await prisma.iEP.update({
        where: { id },
        data: { status: 'active' }
      });
    }

    res.json({
      success: true,
      data: iep,
      message: `IEP signed by ${signerType}`
    });
  } catch (error) {
    console.error('Sign IEP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SIGN_IEP_FAILED',
        message: 'Failed to sign IEP'
      }
    });
  }
};

/**
 * Get IEP overview/summary
 * GET /api/v1/iep/:id/summary
 */
export const getIEPSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const iep = await prisma.iEP.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true
          }
        },
        goals: {
          select: {
            id: true,
            domain: true,
            currentProgress: true,
            progressStatus: true
          }
        },
        _count: {
          select: {
            goals: true,
            accommodations: true,
            services: true,
            teamMembers: true
          }
        }
      }
    });

    if (!iep) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IEP_NOT_FOUND',
          message: 'IEP not found'
        }
      });
    }

    // Calculate overall progress
    const totalProgress = iep.goals.reduce((sum, goal) => sum + goal.currentProgress, 0);
    const avgProgress = iep.goals.length > 0 ? Math.round(totalProgress / iep.goals.length) : 0;

    const summary = {
      id: iep.id,
      academicYear: iep.academicYear,
      status: iep.status,
      patient: iep.patient,
      startDate: iep.startDate,
      endDate: iep.endDate,
      overallProgress: avgProgress,
      counts: {
        goals: iep._count.goals,
        accommodations: iep._count.accommodations,
        services: iep._count.services,
        teamMembers: iep._count.teamMembers
      },
      signatures: {
        parent: iep.signedByParent,
        clinician: iep.signedByClinician
      },
      goalsByDomain: iep.goals.reduce((acc: any, goal) => {
        if (!acc[goal.domain]) acc[goal.domain] = [];
        acc[goal.domain].push({
          id: goal.id,
          progress: goal.currentProgress,
          status: goal.progressStatus
        });
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SUMMARY_FAILED',
        message: 'Failed to get summary'
      }
    });
  }
};
```

---

### Step 2: Create IEP Routes

**File:** `src/routes/iep.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  createIEP,
  getIEP,
  getPatientIEPs,
  updateIEP,
  deleteIEP,
  addGoal,
  updateGoal,
  deleteGoal,
  addGoalProgress,
  addAccommodation,
  deleteAccommodation,
  signIEP,
  getIEPSummary
} from '../controllers/iep.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// IEP CRUD
router.post('/', createIEP);
router.get('/patient/:patientId', getPatientIEPs);
router.get('/:id/summary', getIEPSummary);
router.get('/:id', getIEP);
router.put('/:id', updateIEP);
router.delete('/:id', deleteIEP);

// Goals
router.post('/:id/goals', addGoal);
router.put('/goals/:goalId', updateGoal);
router.delete('/goals/:goalId', deleteGoal);
router.post('/goals/:goalId/progress', addGoalProgress);

// Accommodations
router.post('/:id/accommodations', addAccommodation);
router.delete('/accommodations/:accommodationId', deleteAccommodation);

// Signatures
router.post('/:id/sign', signIEP);

export default router;
```

---

### Step 3: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**At the top with other imports:**
```typescript
import iepRoutes from './routes/iep.routes';
```

**In the routes section:**
```typescript
app.use(`${API_PREFIX}/iep`, iepRoutes);
```

---

### Step 4: Test the API

**Start server:**
```bash
npm run dev
```

---

## ✅ SUCCESS CRITERIA

1. ✅ `iep.controller.ts` created with 14 functions
2. ✅ `iep.routes.ts` created
3. ✅ Routes registered in `app.ts`
4. ✅ Server starts without errors
5. ✅ All IEP endpoints respond

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/iep` | Create IEP |
| GET | `/api/v1/iep/:id` | Get IEP |
| GET | `/api/v1/iep/patient/:id` | List patient IEPs |
| PUT | `/api/v1/iep/:id` | Update IEP |
| DELETE | `/api/v1/iep/:id` | Delete IEP |
| POST | `/api/v1/iep/:id/goals` | Add goal |
| PUT | `/api/v1/iep/goals/:goalId` | Update goal |
| DELETE | `/api/v1/iep/goals/:goalId` | Delete goal |
| POST | `/api/v1/iep/goals/:goalId/progress` | Add progress |
| POST | `/api/v1/iep/:id/accommodations` | Add accommodation |
| DELETE | `/api/v1/iep/accommodations/:id` | Delete accommodation |
| POST | `/api/v1/iep/:id/sign` | Sign IEP |
| GET | `/api/v1/iep/:id/summary` | Get summary |

---

## ⏭️ NEXT PROMPT

**PHASE_1_D2** - IEP Services & Team Members

---

**Mark complete and proceed to 1-D2** ✅
