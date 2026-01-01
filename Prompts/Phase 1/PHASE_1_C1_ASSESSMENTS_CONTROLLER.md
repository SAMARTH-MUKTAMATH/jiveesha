# PHASE 1-C1: ASSESSMENTS API CONTROLLER
## Create Assessment System API (ISAA, ADHD, GLAD, ASD Deep-Dive)

**Prompt ID:** 1-C1  
**Phase:** 1 - Complete Clinician Backend  
**Section:** C - Assessment System  
**Dependencies:** 1-A1, 1-A2, 1-B1, 1-B2 complete  
**Estimated Time:** 30-35 minutes

---

## 🎯 OBJECTIVE

Create comprehensive assessment API for:
- **ISAA** - Indian Scale for Assessment of Autism
- **ADHD** - ADHD Rating Scale
- **GLAD** - General Learning and Adaptive Disorder
- **ASD Deep-Dive** - Comprehensive autism evaluation

**Features:**
- Start new assessment
- Auto-save progress (every 30 seconds from frontend)
- Complete assessment with scoring
- Upload evidence (videos, photos, documents)
- Track assessment history

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Assessments Controller

**File:** `src/controllers/assessments.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Start a new assessment
 * POST /api/v1/assessments
 */
export const startAssessment = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const { patientId, assessmentType } = req.body;

    // Validate required fields
    if (!patientId || !assessmentType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['patientId and assessmentType are required']
        }
      });
    }

    // Check valid assessment type
    const validTypes = ['ISAA', 'ADHD', 'GLAD', 'ASD-Deep-Dive'];
    if (!validTypes.includes(assessmentType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ASSESSMENT_TYPE',
          message: 'Invalid assessment type',
          details: [`Must be one of: ${validTypes.join(', ')}`]
        }
      });
    }

    // Check if there's already an in-progress assessment of this type
    const existing = await prisma.assessment.findFirst({
      where: {
        patientId,
        assessmentType,
        status: 'in_progress'
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ASSESSMENT_IN_PROGRESS',
          message: 'An assessment of this type is already in progress',
          data: { assessmentId: existing.id }
        }
      });
    }

    // Set total questions based on type
    const totalQuestions: { [key: string]: number } = {
      'ISAA': 40,
      'ADHD': 18,
      'GLAD': 25,
      'ASD-Deep-Dive': 60
    };

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        patientId,
        clinicianId,
        assessmentType,
        administeredBy: clinicianId,
        administeredDate: new Date(),
        responses: {},
        currentQuestion: 1,
        totalQuestions: totalQuestions[assessmentType],
        status: 'in_progress'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true
          }
        }
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId,
        activityType: 'assessment_started',
        description: `${assessmentType} assessment started`,
        metadata: { assessmentId: assessment.id },
        createdBy: clinicianId
      }
    });

    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'START_ASSESSMENT_FAILED',
        message: 'Failed to start assessment'
      }
    });
  }
};

/**
 * Save assessment progress (auto-save)
 * PUT /api/v1/assessments/:id/progress
 */
export const saveAssessmentProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responses, currentDomain, currentQuestion } = req.body;

    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        responses,
        currentDomain,
        currentQuestion
      }
    });

    res.json({
      success: true,
      data: assessment,
      message: 'Progress saved'
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SAVE_PROGRESS_FAILED',
        message: 'Failed to save progress'
      }
    });
  }
};

/**
 * Complete assessment with scoring
 * POST /api/v1/assessments/:id/complete
 */
export const completeAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      responses,
      totalScore,
      domainScores,
      interpretation,
      severityLevel,
      dsm5Criteria,
      recommendations,
      duration
    } = req.body;

    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        status: 'completed',
        responses,
        totalScore,
        domainScores,
        interpretation,
        severityLevel,
        dsm5Criteria,
        recommendations,
        duration,
        completedAt: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        evidence: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: assessment.patientId,
        activityType: 'assessment_completed',
        description: `${assessment.assessmentType} completed - Score: ${totalScore}`,
        metadata: { 
          assessmentId: assessment.id,
          score: totalScore,
          severityLevel
        },
        createdBy: assessment.clinicianId
      }
    });

    // Create notification for clinician
    await prisma.notification.create({
      data: {
        userId: assessment.clinicianId,
        userType: 'clinician',
        notificationType: 'assessment_complete',
        title: 'Assessment Completed',
        message: `${assessment.assessmentType} assessment for ${assessment.patient.firstName} ${assessment.patient.lastName} has been completed.`,
        actionUrl: `/assessments/${assessment.id}`,
        actionData: { assessmentId: assessment.id },
        category: 'assessments'
      }
    });

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'COMPLETE_ASSESSMENT_FAILED',
        message: 'Failed to complete assessment'
      }
    });
  }
};

/**
 * Get assessment by ID
 * GET /api/v1/assessments/:id
 */
export const getAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        patient: true,
        clinician: {
          include: {
            profile: true
          }
        },
        evidence: true
      }
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ASSESSMENT_NOT_FOUND',
          message: 'Assessment not found'
        }
      });
    }

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ASSESSMENT_FAILED',
        message: 'Failed to retrieve assessment'
      }
    });
  }
};

/**
 * Get all assessments for a patient
 * GET /api/v1/assessments/patient/:patientId
 */
export const getPatientAssessments = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { assessmentType, status } = req.query;

    const where: any = { patientId };
    if (assessmentType) where.assessmentType = assessmentType as string;
    if (status) where.status = status as string;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        clinician: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                professionalTitle: true
              }
            }
          }
        },
        evidence: {
          select: {
            id: true,
            evidenceType: true,
            fileName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Get patient assessments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ASSESSMENTS_FAILED',
        message: 'Failed to retrieve assessments'
      }
    });
  }
};

/**
 * Get assessments summary for patient (one of each type)
 * GET /api/v1/assessments/patient/:patientId/summary
 */
export const getPatientAssessmentsSummary = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    // Get most recent completed assessment of each type
    const assessmentTypes = ['ISAA', 'ADHD', 'GLAD', 'ASD-Deep-Dive'];
    
    const summary = await Promise.all(
      assessmentTypes.map(async (type) => {
        const latest = await prisma.assessment.findFirst({
          where: {
            patientId,
            assessmentType: type,
            status: 'completed'
          },
          orderBy: { completedAt: 'desc' },
          select: {
            id: true,
            assessmentType: true,
            totalScore: true,
            severityLevel: true,
            completedAt: true,
            interpretation: true
          }
        });

        return {
          assessmentType: type,
          latest: latest || null,
          hasCompleted: !!latest
        };
      })
    );

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
        message: 'Failed to retrieve summary'
      }
    });
  }
};

/**
 * Upload evidence for assessment
 * POST /api/v1/assessments/:id/evidence
 */
export const uploadEvidence = async (req: Request, res: Response) => {
  try {
    const { id: assessmentId } = req.params;
    const { evidenceType, fileName, fileUrl, fileSize, description, timestamp } = req.body;

    const evidence = await prisma.assessmentEvidence.create({
      data: {
        assessmentId,
        evidenceType,
        fileName,
        fileUrl,
        fileSize,
        description,
        timestamp
      }
    });

    res.status(201).json({
      success: true,
      data: evidence
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_EVIDENCE_FAILED',
        message: 'Failed to upload evidence'
      }
    });
  }
};

/**
 * Delete assessment
 * DELETE /api/v1/assessments/:id
 */
export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get assessment for logging
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: { patientId: true, assessmentType: true }
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ASSESSMENT_NOT_FOUND',
          message: 'Assessment not found'
        }
      });
    }

    // Delete (cascades to evidence)
    await prisma.assessment.delete({
      where: { id }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: assessment.patientId,
        activityType: 'assessment_deleted',
        description: `${assessment.assessmentType} assessment deleted`,
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ASSESSMENT_FAILED',
        message: 'Failed to delete assessment'
      }
    });
  }
};

/**
 * Get clinician's recent assessments
 * GET /api/v1/assessments/clinician/recent
 */
export const getClinicianRecentAssessments = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const { limit = 10, status } = req.query;

    const where: any = { clinicianId };
    if (status) where.status = status as string;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Get recent assessments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_RECENT_ASSESSMENTS_FAILED',
        message: 'Failed to retrieve assessments'
      }
    });
  }
};
```

---

### Step 2: Create Assessments Routes

**File:** `src/routes/assessments.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  startAssessment,
  saveAssessmentProgress,
  completeAssessment,
  getAssessment,
  getPatientAssessments,
  getPatientAssessmentsSummary,
  uploadEvidence,
  deleteAssessment,
  getClinicianRecentAssessments
} from '../controllers/assessments.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Assessment lifecycle
router.post('/', startAssessment);
router.put('/:id/progress', saveAssessmentProgress);
router.post('/:id/complete', completeAssessment);

// Get assessments
router.get('/patient/:patientId', getPatientAssessments);
router.get('/patient/:patientId/summary', getPatientAssessmentsSummary);
router.get('/clinician/recent', getClinicianRecentAssessments);
router.get('/:id', getAssessment);

// Evidence
router.post('/:id/evidence', uploadEvidence);

// Delete
router.delete('/:id', deleteAssessment);

export default router;
```

---

### Step 3: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**At the top with other imports:**
```typescript
import assessmentRoutes from './routes/assessments.routes';
```

**In the routes section:**
```typescript
app.use(`${API_PREFIX}/assessments`, assessmentRoutes);
```

---

### Step 4: Test the API

**Start server:**
```bash
npm run dev
```

**Test creating an assessment:**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "assessmentType": "ISAA"
  }' \
  http://localhost:5001/api/v1/assessments
```

---

## ✅ SUCCESS CRITERIA

1. ✅ `assessments.controller.ts` created with 10 functions
2. ✅ `assessments.routes.ts` created
3. ✅ Routes registered in `app.ts`
4. ✅ Server starts without errors
5. ✅ API endpoints respond:
   - POST `/api/v1/assessments` - Start assessment
   - PUT `/api/v1/assessments/:id/progress` - Save progress
   - POST `/api/v1/assessments/:id/complete` - Complete assessment
   - GET `/api/v1/assessments/:id` - Get assessment
   - GET `/api/v1/assessments/patient/:id` - List patient assessments
   - GET `/api/v1/assessments/patient/:id/summary` - Assessment summary
   - POST `/api/v1/assessments/:id/evidence` - Upload evidence
   - DELETE `/api/v1/assessments/:id` - Delete assessment
   - GET `/api/v1/assessments/clinician/recent` - Recent assessments

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/assessments` | Start new assessment |
| PUT | `/api/v1/assessments/:id/progress` | Auto-save progress |
| POST | `/api/v1/assessments/:id/complete` | Complete & score |
| GET | `/api/v1/assessments/:id` | Get assessment |
| GET | `/api/v1/assessments/patient/:id` | List all |
| GET | `/api/v1/assessments/patient/:id/summary` | Summary view |
| POST | `/api/v1/assessments/:id/evidence` | Upload evidence |
| DELETE | `/api/v1/assessments/:id` | Delete |
| GET | `/api/v1/assessments/clinician/recent` | Recent |

---

## ⏭️ NEXT PROMPT

**PHASE_1_C2_ASSESSMENT_RESULTS.md** - Assessment results comparison and analysis

---

**Files Created:**
- ✅ `src/controllers/assessments.controller.ts`
- ✅ `src/routes/assessments.routes.ts`

**Files Modified:**
- ✅ `src/app.ts`

**Mark complete and proceed to 1-C2** ✅
