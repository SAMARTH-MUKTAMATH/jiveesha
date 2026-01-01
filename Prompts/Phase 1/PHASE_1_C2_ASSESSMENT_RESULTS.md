# PHASE 1-C2: ASSESSMENT RESULTS & COMPARISON
## Add Assessment Results Analysis and Comparison Features

**Prompt ID:** 1-C2  
**Phase:** 1 - Complete Clinician Backend  
**Section:** C - Assessment System  
**Dependencies:** 1-C1 complete  
**Estimated Time:** 15-20 minutes

---

## 🎯 OBJECTIVE

Add advanced assessment features:
- Compare current assessment with baseline
- Track progress over time
- Generate assessment reports
- Get domain-specific insights
- Calculate percentile scores

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add Comparison Functions to Controller

**File:** `src/controllers/assessments.controller.ts`

**Action:** APPEND these functions to the existing file (don't replace, just add to the end):

```typescript
/**
 * Compare assessment with baseline
 * GET /api/v1/assessments/:id/compare/:baselineId
 */
export const compareAssessments = async (req: Request, res: Response) => {
  try {
    const { id, baselineId } = req.params;

    const [current, baseline] = await Promise.all([
      prisma.assessment.findUnique({
        where: { id },
        select: {
          id: true,
          assessmentType: true,
          totalScore: true,
          domainScores: true,
          severityLevel: true,
          completedAt: true,
          interpretation: true
        }
      }),
      prisma.assessment.findUnique({
        where: { id: baselineId },
        select: {
          id: true,
          assessmentType: true,
          totalScore: true,
          domainScores: true,
          severityLevel: true,
          completedAt: true,
          interpretation: true
        }
      })
    ]);

    if (!current || !baseline) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ASSESSMENT_NOT_FOUND',
          message: 'One or both assessments not found'
        }
      });
    }

    if (current.assessmentType !== baseline.assessmentType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISMATCHED_TYPES',
          message: 'Cannot compare assessments of different types'
        }
      });
    }

    // Calculate changes
    const scoreDifference = (current.totalScore || 0) - (baseline.totalScore || 0);
    const percentChange = baseline.totalScore 
      ? ((scoreDifference / baseline.totalScore) * 100).toFixed(2)
      : 0;

    // Compare domain scores
    const currentDomains = current.domainScores as any || {};
    const baselineDomains = baseline.domainScores as any || {};
    
    const domainChanges: any = {};
    Object.keys(currentDomains).forEach(domain => {
      const currentScore = currentDomains[domain] || 0;
      const baselineScore = baselineDomains[domain] || 0;
      domainChanges[domain] = {
        current: currentScore,
        baseline: baselineScore,
        change: currentScore - baselineScore,
        percentChange: baselineScore 
          ? ((currentScore - baselineScore) / baselineScore * 100).toFixed(2)
          : 0
      };
    });

    // Determine trend
    let trend = 'stable';
    if (Math.abs(scoreDifference) <= 2) {
      trend = 'stable';
    } else if (scoreDifference > 0) {
      trend = current.assessmentType === 'ISAA' ? 'worsening' : 'improving';
    } else {
      trend = current.assessmentType === 'ISAA' ? 'improving' : 'worsening';
    }

    // Time between assessments
    const daysBetween = current.completedAt && baseline.completedAt
      ? Math.floor((current.completedAt.getTime() - baseline.completedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const comparison = {
      current: {
        id: current.id,
        totalScore: current.totalScore,
        domainScores: current.domainScores,
        severityLevel: current.severityLevel,
        completedAt: current.completedAt
      },
      baseline: {
        id: baseline.id,
        totalScore: baseline.totalScore,
        domainScores: baseline.domainScores,
        severityLevel: baseline.severityLevel,
        completedAt: baseline.completedAt
      },
      changes: {
        totalScoreDifference: scoreDifference,
        percentChange: Number(percentChange),
        domainChanges,
        severityLevelChange: {
          from: baseline.severityLevel,
          to: current.severityLevel,
          changed: baseline.severityLevel !== current.severityLevel
        },
        trend,
        daysBetween
      }
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Compare assessments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'COMPARISON_FAILED',
        message: 'Failed to compare assessments'
      }
    });
  }
};

/**
 * Get assessment progress over time for a patient
 * GET /api/v1/assessments/patient/:patientId/progress
 */
export const getAssessmentProgress = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { assessmentType } = req.query;

    if (!assessmentType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ASSESSMENT_TYPE',
          message: 'assessmentType query parameter is required'
        }
      });
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        patientId,
        assessmentType: assessmentType as string,
        status: 'completed'
      },
      select: {
        id: true,
        totalScore: true,
        domainScores: true,
        severityLevel: true,
        completedAt: true
      },
      orderBy: { completedAt: 'asc' }
    });

    if (assessments.length === 0) {
      return res.json({
        success: true,
        data: {
          assessmentType,
          assessments: [],
          trend: 'insufficient_data'
        }
      });
    }

    // Calculate overall trend
    const firstScore = assessments[0].totalScore || 0;
    const lastScore = assessments[assessments.length - 1].totalScore || 0;
    const scoreDiff = lastScore - firstScore;

    let overallTrend = 'stable';
    if (Math.abs(scoreDiff) > 5) {
      overallTrend = scoreDiff > 0 ? 'worsening' : 'improving';
    }

    // Extract domain trends
    const domainTrends: any = {};
    if (assessments.length >= 2) {
      const firstDomains = assessments[0].domainScores as any || {};
      const lastDomains = assessments[assessments.length - 1].domainScores as any || {};

      Object.keys(firstDomains).forEach(domain => {
        const first = firstDomains[domain] || 0;
        const last = lastDomains[domain] || 0;
        domainTrends[domain] = {
          firstScore: first,
          lastScore: last,
          change: last - first
        };
      });
    }

    res.json({
      success: true,
      data: {
        assessmentType,
        assessments,
        trend: overallTrend,
        domainTrends,
        totalAssessments: assessments.length,
        timespan: {
          first: assessments[0].completedAt,
          last: assessments[assessments.length - 1].completedAt
        }
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROGRESS_FAILED',
        message: 'Failed to retrieve progress'
      }
    });
  }
};

/**
 * Get domain insights for an assessment
 * GET /api/v1/assessments/:id/insights
 */
export const getAssessmentInsights = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        assessmentType: true,
        totalScore: true,
        domainScores: true,
        severityLevel: true,
        responses: true
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

    const domainScores = assessment.domainScores as any || {};
    
    // Identify strongest and weakest domains
    const domains = Object.entries(domainScores).map(([name, score]) => ({
      name,
      score: score as number
    }));

    domains.sort((a, b) => b.score - a.score);

    const insights = {
      assessmentId: assessment.id,
      assessmentType: assessment.assessmentType,
      totalScore: assessment.totalScore,
      severityLevel: assessment.severityLevel,
      domainAnalysis: {
        strongest: domains.length > 0 ? domains[domains.length - 1] : null,
        weakest: domains.length > 0 ? domains[0] : null,
        allDomains: domains
      },
      recommendations: generateRecommendations(assessment.assessmentType, domainScores)
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_INSIGHTS_FAILED',
        message: 'Failed to generate insights'
      }
    });
  }
};

/**
 * Helper function to generate recommendations based on assessment
 */
function generateRecommendations(assessmentType: string, domainScores: any): string[] {
  const recommendations: string[] = [];

  if (assessmentType === 'ISAA') {
    if (domainScores.social > 15) {
      recommendations.push('Consider social skills training programs');
      recommendations.push('Structured peer interaction activities recommended');
    }
    if (domainScores.communication > 15) {
      recommendations.push('Speech and language therapy evaluation recommended');
      recommendations.push('Consider AAC (Augmentative and Alternative Communication) assessment');
    }
    if (domainScores.motor > 50) {
      recommendations.push('Occupational therapy assessment recommended');
      recommendations.push('Fine and gross motor skill development activities');
    }
  }

  if (assessmentType === 'ADHD') {
    recommendations.push('Consider behavioral intervention strategies');
    recommendations.push('Structured routine and environment modifications');
    recommendations.push('Parent training in behavior management');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue regular monitoring and reassessment');
  }

  return recommendations;
}

/**
 * Update assessment interpretation
 * PUT /api/v1/assessments/:id/interpretation
 */
export const updateInterpretation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { interpretation, recommendations } = req.body;

    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        interpretation,
        recommendations
      }
    });

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Update interpretation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_INTERPRETATION_FAILED',
        message: 'Failed to update interpretation'
      }
    });
  }
};
```

---

### Step 2: Add Routes for New Functions

**File:** `src/routes/assessments.routes.ts`

**Action:** ADD these routes to the existing file (before `export default router;`):

```typescript
// Comparison and insights
router.get('/:id/compare/:baselineId', compareAssessments);
router.get('/patient/:patientId/progress', getAssessmentProgress);
router.get('/:id/insights', getAssessmentInsights);
router.put('/:id/interpretation', updateInterpretation);
```

---

### Step 3: Update Imports in Routes File

**File:** `src/routes/assessments.routes.ts`

**Action:** UPDATE the import statement at the top to include new functions:

```typescript
import {
  startAssessment,
  saveAssessmentProgress,
  completeAssessment,
  getAssessment,
  getPatientAssessments,
  getPatientAssessmentsSummary,
  uploadEvidence,
  deleteAssessment,
  getClinicianRecentAssessments,
  compareAssessments,
  getAssessmentProgress,
  getAssessmentInsights,
  updateInterpretation
} from '../controllers/assessments.controller';
```

---

### Step 4: Test the New Endpoints

**Start server:**
```bash
npm run dev
```

**Test comparison:**
```bash
# Compare two assessments
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/v1/assessments/{assessment-id}/compare/{baseline-id}

# Get progress over time
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/v1/assessments/patient/{patient-id}/progress?assessmentType=ISAA"

# Get insights
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/v1/assessments/{assessment-id}/insights
```

---

## ✅ SUCCESS CRITERIA

1. ✅ 4 new functions added to `assessments.controller.ts`:
   - compareAssessments
   - getAssessmentProgress
   - getAssessmentInsights
   - updateInterpretation
   - generateRecommendations (helper)

2. ✅ 4 new routes added to `assessments.routes.ts`

3. ✅ Server starts without errors

4. ✅ New endpoints respond:
   - GET `/api/v1/assessments/:id/compare/:baselineId` - Compare assessments
   - GET `/api/v1/assessments/patient/:id/progress` - Progress over time
   - GET `/api/v1/assessments/:id/insights` - Domain insights
   - PUT `/api/v1/assessments/:id/interpretation` - Update interpretation

---

## 📊 NEW API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/assessments/:id/compare/:baselineId` | Compare with baseline |
| GET | `/api/v1/assessments/patient/:id/progress` | Progress tracking |
| GET | `/api/v1/assessments/:id/insights` | Domain analysis |
| PUT | `/api/v1/assessments/:id/interpretation` | Update notes |

---

## ⏭️ NEXT PROMPTS

After completing 1-C1 and 1-C2, tell me and I'll create:
- **PHASE_1_D1** - IEP Builder Controller
- **PHASE_1_D2** - IEP Services & Progress

---

**Files Modified:**
- ✅ `src/controllers/assessments.controller.ts` (4 functions added)
- ✅ `src/routes/assessments.routes.ts` (4 routes added)

**No new files created - extending existing files**

**Mark complete and notify for next prompts** ✅
