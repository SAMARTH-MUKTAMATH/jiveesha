# PHASE 2-H2: PARENT SCREENING API
## Create APIs for Parent-Led Screenings (M-CHAT, ASQ)

**Prompt ID:** 2-H2  
**Phase:** 2 - Parent Portal Backend  
**Section:** H - Parent Screening  
**Dependencies:** 2-H1 complete  
**Estimated Time:** 30-35 minutes

---

## 🎯 OBJECTIVE

Create **MODULAR** parent screening APIs designed for easy replacement:
- Generic screening lifecycle (start/save/complete)
- Pluggable scoring engines (easy to swap)
- Screening-agnostic API endpoints
- Question loaders (type-specific)
- Flexible results format
- Easy to add new screening types WITHOUT code changes

**MODULARITY ARCHITECTURE:**
- Controller methods are screening-type agnostic
- Scoring logic isolated in separate utility file
- New screening types = new scoring function only
- API remains unchanged when adding/removing screenings
- Question banks are data-driven (database-based)

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Screening Utilities

**File:** `src/utils/screening-scorer.ts`

**Action:** Create this NEW file:

```typescript
/**
 * M-CHAT-R Scoring Logic
 */
export function scoreMChatR(responses: Record<string, string>): {
  totalScore: number;
  criticalScore: number;
  riskLevel: string;
  screenerResult: string;
  followUpRequired: boolean;
  professionalReferral: boolean;
} {
  // Critical items: 2, 5, 12 (reverse scored), others (normally scored)
  const criticalItems = [2, 5, 12];
  const reverseScored = [1, 2, 3, 6, 7, 9, 10, 13, 14, 15, 23]; // Items where "NO" = 1 point
  
  let totalScore = 0;
  let criticalScore = 0;
  
  Object.entries(responses).forEach(([questionId, answer]) => {
    const questionNum = parseInt(questionId);
    const isReverse = reverseScored.includes(questionNum);
    const isCritical = criticalItems.includes(questionNum);
    
    let points = 0;
    if ((answer === 'no' && isReverse) || (answer === 'yes' && !isReverse)) {
      points = 1;
    }
    
    totalScore += points;
    if (isCritical && points === 1) {
      criticalScore += 1;
    }
  });
  
  // Determine risk and follow-up
  let riskLevel = 'low';
  let screenerResult = 'pass';
  let followUpRequired = false;
  let professionalReferral = false;
  
  if (totalScore >= 8) {
    riskLevel = 'high';
    screenerResult = 'fail';
    professionalReferral = true;
  } else if (totalScore >= 3 || criticalScore >= 2) {
    riskLevel = 'medium';
    screenerResult = 'follow_up_needed';
    followUpRequired = true;
  }
  
  return {
    totalScore,
    criticalScore,
    riskLevel,
    screenerResult,
    followUpRequired,
    professionalReferral
  };
}

/**
 * ASQ-3 Scoring Logic
 */
export function scoreASQ3(
  responses: Record<string, string>,
  ageRange: string
): {
  domainScores: Record<string, number>;
  totalScore: number;
  riskLevel: string;
  areasOfConcern: string[];
  recommendations: string[];
} {
  const domains = ['communication', 'gross_motor', 'fine_motor', 'problem_solving', 'personal_social'];
  const domainScores: Record<string, number> = {};
  
  // Calculate scores per domain
  domains.forEach(domain => {
    let score = 0;
    Object.entries(responses).forEach(([questionId, answer]) => {
      if (questionId.startsWith(domain)) {
        if (answer === 'yes') score += 10;
        else if (answer === 'sometimes') score += 5;
        // 'not_yet' = 0
      }
    });
    domainScores[domain] = score;
  });
  
  const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
  
  // Determine areas of concern (scores below cutoff)
  // Cutoffs vary by age, using simplified example
  const cutoffs: Record<string, number> = {
    communication: 35,
    gross_motor: 40,
    fine_motor: 35,
    problem_solving: 35,
    personal_social: 30
  };
  
  const areasOfConcern = domains.filter(domain => 
    domainScores[domain] < cutoffs[domain]
  );
  
  let riskLevel = 'low';
  if (areasOfConcern.length >= 2) {
    riskLevel = 'high';
  } else if (areasOfConcern.length === 1) {
    riskLevel = 'medium';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (areasOfConcern.length > 0) {
    recommendations.push('Discuss results with pediatrician');
    recommendations.push('Consider developmental evaluation');
    areasOfConcern.forEach(area => {
      recommendations.push(`Focus on ${area.replace('_', ' ')} activities`);
    });
  } else {
    recommendations.push('Continue age-appropriate activities');
    recommendations.push('Rescreen at next milestone');
  }
  
  return {
    domainScores,
    totalScore,
    riskLevel,
    areasOfConcern,
    recommendations
  };
}

/**
 * Generate recommendations based on screening results
 */
export function generateRecommendations(
  screeningType: string,
  riskLevel: string,
  screenerResult?: string
): string[] {
  const recommendations: string[] = [];
  
  if (screeningType === 'M-CHAT-R' || screeningType === 'M-CHAT-F') {
    if (riskLevel === 'high' || screenerResult === 'fail') {
      recommendations.push('Contact your pediatrician immediately');
      recommendations.push('Request referral for comprehensive autism evaluation');
      recommendations.push('Early intervention services may be beneficial');
      recommendations.push('Document specific behaviors of concern');
    } else if (riskLevel === 'medium' || screenerResult === 'follow_up_needed') {
      recommendations.push('Complete M-CHAT Follow-Up interview');
      recommendations.push('Monitor development closely');
      recommendations.push('Discuss concerns at next pediatric visit');
    } else {
      recommendations.push('Development appears on track');
      recommendations.push('Continue routine developmental monitoring');
      recommendations.push('Rescreen at 30 months if concerns arise');
    }
  } else if (screeningType.startsWith('ASQ')) {
    if (riskLevel === 'high') {
      recommendations.push('Schedule developmental evaluation');
      recommendations.push('Contact early intervention program');
      recommendations.push('Discuss results with pediatrician');
    } else if (riskLevel === 'medium') {
      recommendations.push('Provide learning activities in concern areas');
      recommendations.push('Rescreen in 2-3 months');
      recommendations.push('Monitor progress closely');
    } else {
      recommendations.push('Development progressing well');
      recommendations.push('Continue age-appropriate activities');
      recommendations.push('Complete next ASQ at recommended interval');
    }
  }
  
  return recommendations;
}
```

---

### Step 2: Create Parent Screening Controller

**File:** `src/controllers/parent-screening.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { scoreMChatR, scoreASQ3, generateRecommendations } from '../utils/screening-scorer';

const prisma = new PrismaClient();

/**
 * Start new screening
 * POST /api/v1/parent/screening
 */
export const startScreening = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { patientId, screeningType, ageAtScreening } = req.body;

    // Validate
    if (!patientId || !screeningType || !ageAtScreening) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'patientId, screeningType, and ageAtScreening are required'
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

    // Determine total questions
    const totalQuestions: Record<string, number> = {
      'M-CHAT-R': 20,
      'M-CHAT-F': 20, // Follow-up has additional prompts
      'ASQ-3': 30,
      'ASQ-SE-2': 30
    };

    // Create screening
    const screening = await prisma.parentScreening.create({
      data: {
        parentId: user.parent.id,
        patientId,
        screeningType,
        ageAtScreening,
        totalQuestions: totalQuestions[screeningType] || 20,
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

    res.status(201).json({
      success: true,
      data: screening
    });
  } catch (error) {
    console.error('Start screening error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'START_SCREENING_FAILED',
        message: 'Failed to start screening'
      }
    });
  }
};

/**
 * Get screening questions
 * GET /api/v1/parent/screening/:id/questions
 */
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const screening = await prisma.parentScreening.findUnique({
      where: { id }
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCREENING_NOT_FOUND',
          message: 'Screening not found'
        }
      });
    }

    let questions;

    if (screening.screeningType === 'M-CHAT-R' || screening.screeningType === 'M-CHAT-F') {
      questions = await prisma.mChatQuestion.findMany({
        where: {
          isInitialScreener: screening.screeningType === 'M-CHAT-R'
        },
        orderBy: { questionNumber: 'asc' }
      });
    } else if (screening.screeningType === 'ASQ-3') {
      // Determine age range based on ageAtScreening
      const ageRange = `${Math.floor(screening.ageAtScreening / 12) * 12}-months`;
      
      questions = await prisma.aSQQuestion.findMany({
        where: { ageRange },
        orderBy: [
          { domain: 'asc' },
          { questionNumber: 'asc' }
        ]
      });
    }

    res.json({
      success: true,
      data: {
        screening,
        questions
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_QUESTIONS_FAILED',
        message: 'Failed to retrieve questions'
      }
    });
  }
};

/**
 * Save response (auto-save)
 * POST /api/v1/parent/screening/:id/response
 */
export const saveResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { questionId, answer, currentQuestion } = req.body;

    const screening = await prisma.parentScreening.findUnique({
      where: { id }
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCREENING_NOT_FOUND',
          message: 'Screening not found'
        }
      });
    }

    // Update responses
    const responses = screening.responses as Record<string, any>;
    responses[questionId] = answer;

    await prisma.parentScreening.update({
      where: { id },
      data: {
        responses,
        currentQuestion: currentQuestion || screening.currentQuestion
      }
    });

    res.json({
      success: true,
      message: 'Response saved'
    });
  } catch (error) {
    console.error('Save response error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SAVE_RESPONSE_FAILED',
        message: 'Failed to save response'
      }
    });
  }
};

/**
 * Complete and score screening
 * POST /api/v1/parent/screening/:id/complete
 */
export const completeScreening = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const screening = await prisma.parentScreening.findUnique({
      where: { id }
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCREENING_NOT_FOUND',
          message: 'Screening not found'
        }
      });
    }

    const finalResponses = responses || screening.responses;
    let scoreResult: any;
    let recommendations: string[] = [];

    // Score based on type
    if (screening.screeningType === 'M-CHAT-R' || screening.screeningType === 'M-CHAT-F') {
      scoreResult = scoreMChatR(finalResponses as Record<string, string>);
      recommendations = generateRecommendations(
        screening.screeningType,
        scoreResult.riskLevel,
        scoreResult.screenerResult
      );

      await prisma.parentScreening.update({
        where: { id },
        data: {
          responses: finalResponses,
          status: 'completed',
          completedAt: new Date(),
          totalScore: scoreResult.totalScore,
          riskLevel: scoreResult.riskLevel,
          screenerResult: scoreResult.screenerResult,
          followUpRequired: scoreResult.followUpRequired,
          professionalReferral: scoreResult.professionalReferral,
          mchatInitialScore: scoreResult.totalScore,
          recommendations
        }
      });
    } else if (screening.screeningType === 'ASQ-3') {
      const ageRange = `${Math.floor(screening.ageAtScreening / 12) * 12}-months`;
      scoreResult = scoreASQ3(finalResponses as Record<string, string>, ageRange);
      recommendations = generateRecommendations(
        screening.screeningType,
        scoreResult.riskLevel
      );

      await prisma.parentScreening.update({
        where: { id },
        data: {
          responses: finalResponses,
          status: 'completed',
          completedAt: new Date(),
          totalScore: scoreResult.totalScore,
          riskLevel: scoreResult.riskLevel,
          followUpRequired: scoreResult.riskLevel !== 'low',
          professionalReferral: scoreResult.riskLevel === 'high',
          recommendations: {
            ...scoreResult,
            recommendations
          }
        }
      });
    }

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: screening.patientId,
        activityType: 'screening_completed',
        description: `Parent completed ${screening.screeningType} - Risk: ${scoreResult.riskLevel}`,
        metadata: { screeningId: screening.id },
        createdBy: (req as any).userId
      }
    });

    const updated = await prisma.parentScreening.findUnique({
      where: { id },
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

    res.json({
      success: true,
      data: updated,
      message: 'Screening completed'
    });
  } catch (error) {
    console.error('Complete screening error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'COMPLETE_SCREENING_FAILED',
        message: 'Failed to complete screening'
      }
    });
  }
};

/**
 * Get screening results
 * GET /api/v1/parent/screening/:id/results
 */
export const getResults = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parent: true }
    });

    const screening = await prisma.parentScreening.findUnique({
      where: { id },
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

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCREENING_NOT_FOUND',
          message: 'Screening not found'
        }
      });
    }

    // Verify ownership
    if (screening.parentId !== user?.parent?.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this screening'
        }
      });
    }

    if (screening.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SCREENING_NOT_COMPLETED',
          message: 'Screening has not been completed yet'
        }
      });
    }

    res.json({
      success: true,
      data: screening
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_RESULTS_FAILED',
        message: 'Failed to retrieve results'
      }
    });
  }
};

/**
 * Get screening history for child
 * GET /api/v1/parent/screening/child/:patientId
 */
export const getChildScreenings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { patientId } = req.params;
    const { screeningType, status } = req.query;

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

    // Verify access
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

    const where: any = { patientId };
    if (screeningType) where.screeningType = screeningType as string;
    if (status) where.status = status as string;

    const screenings = await prisma.parentScreening.findMany({
      where,
      orderBy: { startedAt: 'desc' }
    });

    res.json({
      success: true,
      data: screenings
    });
  } catch (error) {
    console.error('Get child screenings error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SCREENINGS_FAILED',
        message: 'Failed to retrieve screenings'
      }
    });
  }
};

/**
 * Get all screenings for parent
 * GET /api/v1/parent/screening/my
 */
export const getMyScreenings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

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

    const screenings = await prisma.parentScreening.findMany({
      where: { parentId: user.parent.id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json({
      success: true,
      data: screenings
    });
  } catch (error) {
    console.error('Get my screenings error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SCREENINGS_FAILED',
        message: 'Failed to retrieve screenings'
      }
    });
  }
};

/**
 * Delete screening
 * DELETE /api/v1/parent/screening/:id
 */
export const deleteScreening = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parent: true }
    });

    const screening = await prisma.parentScreening.findUnique({
      where: { id }
    });

    if (!screening || screening.parentId !== user?.parent?.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to delete this screening'
        }
      });
    }

    await prisma.parentScreening.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Screening deleted successfully'
    });
  } catch (error) {
    console.error('Delete screening error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_SCREENING_FAILED',
        message: 'Failed to delete screening'
      }
    });
  }
};
```

---

### Step 3: Create Parent Screening Routes

**File:** `src/routes/parent-screening.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  startScreening,
  getQuestions,
  saveResponse,
  completeScreening,
  getResults,
  getChildScreenings,
  getMyScreenings,
  deleteScreening
} from '../controllers/parent-screening.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Start screening
router.post('/', startScreening);

// My screenings
router.get('/my', getMyScreenings);

// Child screenings
router.get('/child/:patientId', getChildScreenings);

// Screening operations
router.get('/:id/questions', getQuestions);
router.post('/:id/response', saveResponse);
router.post('/:id/complete', completeScreening);
router.get('/:id/results', getResults);
router.delete('/:id', deleteScreening);

export default router;
```

---

### Step 4: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**Import:**
```typescript
import parentScreeningRoutes from './routes/parent-screening.routes';
```

**Register:**
```typescript
app.use(`${API_PREFIX}/parent/screening`, parentScreeningRoutes);
```

---

### Step 5: Test Server

```bash
npm run dev
```

---

## 🔧 EXTENSIBILITY GUIDE: Adding New Screening Types

**Want to add a new screening tool? Here's the complete process:**

### Step 1: Add Question Bank (One-Time Setup)
```typescript
// Create new question table or add to existing
await prisma.newScreeningQuestion.createMany({
  data: [
    { questionNumber: 1, questionText: "...", scoringKey: "..." },
    // ... more questions
  ]
});
```

### Step 2: Add Scoring Function
```typescript
// In src/utils/screening-scorer.ts
export function scoreNewScreening(responses: Record<string, string>) {
  // Your scoring logic here
  return {
    totalScore: 0,
    riskLevel: 'low',
    recommendations: []
  };
}
```

### Step 3: Update Complete Handler
```typescript
// In completeScreening() function, add new case:
else if (screening.screeningType === 'NEW-SCREENING') {
  scoreResult = scoreNewScreening(finalResponses as Record<string, string>);
  // ... rest stays the same
}
```

### Step 4: Update Question Loader
```typescript
// In getQuestions() function, add new case:
else if (screening.screeningType === 'NEW-SCREENING') {
  questions = await prisma.newScreeningQuestion.findMany({
    orderBy: { questionNumber: 'asc' }
  });
}
```

**That's it!** No database migrations, no API changes, no frontend changes needed.

### Real-World Testing Workflow
```typescript
// 1. Add new screening type alongside existing
startScreening({ screeningType: 'NEW-SCREENING' })  // New
startScreening({ screeningType: 'M-CHAT-R' })       // Old (still works)

// 2. Compare results in production
// 3. Gather user feedback
// 4. Iterate on scoring logic (just update one function)
// 5. When ready, deprecate old screening (no removal needed)
```

### Swapping Out an Entire Screening
```typescript
// Before: M-CHAT-R
// After: Better-CHAT-2.0

// Step 1: Add Better-CHAT-2.0 questions
// Step 2: Add scoreBetterChat() function
// Step 3: Let parents use either one
// Step 4: Monitor adoption
// Step 5: Eventually hide M-CHAT-R from UI (data preserved)
```

**Key Benefit**: Historical data never breaks. Old screenings remain scorable even after you remove the screening type from the UI.

---

## ✅ SUCCESS CRITERIA

1. ✅ `screening-scorer.ts` utility created with scoring logic
2. ✅ `parent-screening.controller.ts` created with 8 functions
3. ✅ `parent-screening.routes.ts` created
4. ✅ Routes registered in `app.ts`
5. ✅ Server starts without errors
6. ✅ All endpoints respond
7. ✅ M-CHAT scoring works correctly
8. ✅ ASQ scoring works correctly
9. ✅ Recommendations generated

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/parent/screening` | Start screening |
| GET | `/api/v1/parent/screening/my` | List my screenings |
| GET | `/api/v1/parent/screening/child/:id` | List child screenings |
| GET | `/api/v1/parent/screening/:id/questions` | Get questions |
| POST | `/api/v1/parent/screening/:id/response` | Save response |
| POST | `/api/v1/parent/screening/:id/complete` | Complete & score |
| GET | `/api/v1/parent/screening/:id/results` | Get results |
| DELETE | `/api/v1/parent/screening/:id` | Delete screening |

---

## ⏭️ NEXT PROMPTS

After 2-H1 and 2-H2, tell me and I'll create final Phase 2 prompts:
- **PHASE_2_I1** - PEP Builder (Personalized Education Plans)
- **PHASE_2_I2** - Resources & Activities API

---

**Files Created:**
- ✅ `src/utils/screening-scorer.ts`
- ✅ `src/controllers/parent-screening.controller.ts`
- ✅ `src/routes/parent-screening.routes.ts`

**Files Modified:**
- ✅ `src/app.ts`

**Mark complete and notify for final Phase 2 prompts** ✅
