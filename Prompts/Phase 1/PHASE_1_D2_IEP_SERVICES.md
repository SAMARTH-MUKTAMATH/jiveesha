# PHASE 1-D2: IEP SERVICES & TEAM MEMBERS
## Add IEP Services, Team Members, and Progress Reports APIs

**Prompt ID:** 1-D2  
**Phase:** 1 - Complete Clinician Backend  
**Section:** D - IEP System  
**Dependencies:** 1-D1 complete  
**Estimated Time:** 20-25 minutes

---

## 🎯 OBJECTIVE

Extend IEP system with:
- Related services (Speech, OT, PT, etc.)
- IEP team member management
- Progress reports
- Service tracking
- Meeting notes

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add Service & Team Functions to Controller

**File:** `src/controllers/iep.controller.ts`

**Action:** APPEND these functions to the existing file (don't replace):

```typescript
/**
 * Add service to IEP
 * POST /api/v1/iep/:id/services
 */
export const addService = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;
    const {
      serviceName,
      provider,
      frequency,
      duration,
      serviceType,
      setting,
      startDate,
      endDate,
      totalSessionsPlanned
    } = req.body;

    const service = await prisma.iEPService.create({
      data: {
        iepId,
        serviceName,
        provider,
        frequency,
        duration,
        serviceType,
        setting,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalSessionsPlanned
      }
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_SERVICE_FAILED',
        message: 'Failed to add service'
      }
    });
  }
};

/**
 * Update service
 * PUT /api/v1/iep/services/:serviceId
 */
export const updateService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.iepId;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const service = await prisma.iEPService.update({
      where: { id: serviceId },
      data: updateData
    });

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_SERVICE_FAILED',
        message: 'Failed to update service'
      }
    });
  }
};

/**
 * Delete service
 * DELETE /api/v1/iep/services/:serviceId
 */
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    await prisma.iEPService.delete({
      where: { id: serviceId }
    });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_SERVICE_FAILED',
        message: 'Failed to delete service'
      }
    });
  }
};

/**
 * Track service session completion
 * POST /api/v1/iep/services/:serviceId/session
 */
export const recordServiceSession = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    const service = await prisma.iEPService.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SERVICE_NOT_FOUND',
          message: 'Service not found'
        }
      });
    }

    // Increment sessions completed
    const updatedService = await prisma.iEPService.update({
      where: { id: serviceId },
      data: {
        sessionsCompleted: service.sessionsCompleted + 1
      }
    });

    res.json({
      success: true,
      data: updatedService,
      message: 'Session recorded'
    });
  } catch (error) {
    console.error('Record session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RECORD_SESSION_FAILED',
        message: 'Failed to record session'
      }
    });
  }
};

/**
 * Add team member to IEP
 * POST /api/v1/iep/:id/team
 */
export const addTeamMember = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;
    const {
      memberType,
      name,
      role,
      email,
      phone,
      organization
    } = req.body;

    const teamMember = await prisma.iEPTeamMember.create({
      data: {
        iepId,
        memberType,
        name,
        role,
        email,
        phone,
        organization
      }
    });

    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_TEAM_MEMBER_FAILED',
        message: 'Failed to add team member'
      }
    });
  }
};

/**
 * Update team member
 * PUT /api/v1/iep/team/:memberId
 */
export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.iepId;

    const teamMember = await prisma.iEPTeamMember.update({
      where: { id: memberId },
      data: updateData
    });

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_TEAM_MEMBER_FAILED',
        message: 'Failed to update team member'
      }
    });
  }
};

/**
 * Delete team member
 * DELETE /api/v1/iep/team/:memberId
 */
export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    await prisma.iEPTeamMember.delete({
      where: { id: memberId }
    });

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_TEAM_MEMBER_FAILED',
        message: 'Failed to remove team member'
      }
    });
  }
};

/**
 * Sign team member (for IEP meeting attendance)
 * POST /api/v1/iep/team/:memberId/sign
 */
export const signTeamMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const { signature } = req.body;

    const teamMember = await prisma.iEPTeamMember.update({
      where: { id: memberId },
      data: {
        signed: true,
        signedAt: new Date(),
        signature
      }
    });

    res.json({
      success: true,
      data: teamMember,
      message: 'Team member signed'
    });
  } catch (error) {
    console.error('Sign team member error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SIGN_TEAM_MEMBER_FAILED',
        message: 'Failed to sign team member'
      }
    });
  }
};

/**
 * Create progress report
 * POST /api/v1/iep/:id/progress-report
 */
export const createProgressReport = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;
    const userId = (req as any).userId;
    const {
      reportDate,
      reportingPeriod,
      overallProgress,
      summary
    } = req.body;

    const progressReport = await prisma.iEPProgressReport.create({
      data: {
        iepId,
        reportDate: new Date(reportDate),
        reportingPeriod,
        overallProgress,
        summary,
        createdBy: userId
      }
    });

    // Update IEP overall progress
    await prisma.iEP.update({
      where: { id: iepId },
      data: {
        overallProgress,
        lastReviewDate: new Date(reportDate)
      }
    });

    res.status(201).json({
      success: true,
      data: progressReport
    });
  } catch (error) {
    console.error('Create progress report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_PROGRESS_REPORT_FAILED',
        message: 'Failed to create progress report'
      }
    });
  }
};

/**
 * Get progress reports for IEP
 * GET /api/v1/iep/:id/progress-reports
 */
export const getProgressReports = async (req: Request, res: Response) => {
  try {
    const { id: iepId } = req.params;

    const reports = await prisma.iEPProgressReport.findMany({
      where: { iepId },
      orderBy: { reportDate: 'desc' }
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get progress reports error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROGRESS_REPORTS_FAILED',
        message: 'Failed to retrieve progress reports'
      }
    });
  }
};

/**
 * Get IEP statistics
 * GET /api/v1/iep/:id/statistics
 */
export const getIEPStatistics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const iep = await prisma.iEP.findUnique({
      where: { id },
      include: {
        goals: {
          include: {
            progressUpdates: true
          }
        },
        services: true,
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

    // Calculate statistics
    const totalGoals = iep.goals.length;
    const goalsAchieved = iep.goals.filter(g => g.progressStatus === 'achieved').length;
    const goalsInProgress = iep.goals.filter(g => g.progressStatus === 'in_progress').length;
    const goalsNotStarted = iep.goals.filter(g => g.progressStatus === 'not_started').length;

    const avgProgress = totalGoals > 0
      ? Math.round(iep.goals.reduce((sum, g) => sum + g.currentProgress, 0) / totalGoals)
      : 0;

    const totalServices = iep.services.length;
    const totalSessionsCompleted = iep.services.reduce((sum, s) => sum + s.sessionsCompleted, 0);
    const totalSessionsPlanned = iep.services.reduce((sum, s) => sum + (s.totalSessionsPlanned || 0), 0);

    const statistics = {
      iepId: iep.id,
      goals: {
        total: totalGoals,
        achieved: goalsAchieved,
        inProgress: goalsInProgress,
        notStarted: goalsNotStarted,
        averageProgress: avgProgress
      },
      services: {
        total: totalServices,
        sessionsCompleted: totalSessionsCompleted,
        sessionsPlanned: totalSessionsPlanned,
        completionRate: totalSessionsPlanned > 0
          ? Math.round((totalSessionsCompleted / totalSessionsPlanned) * 100)
          : 0
      },
      progressReports: {
        total: iep.progressReports.length,
        latest: iep.progressReports[0] || null
      }
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_STATISTICS_FAILED',
        message: 'Failed to retrieve statistics'
      }
    });
  }
};
```

---

### Step 2: Add Routes for New Functions

**File:** `src/routes/iep.routes.ts`

**Action:** ADD these routes before `export default router;`:

```typescript
// Services
router.post('/:id/services', addService);
router.put('/services/:serviceId', updateService);
router.delete('/services/:serviceId', deleteService);
router.post('/services/:serviceId/session', recordServiceSession);

// Team members
router.post('/:id/team', addTeamMember);
router.put('/team/:memberId', updateTeamMember);
router.delete('/team/:memberId', deleteTeamMember);
router.post('/team/:memberId/sign', signTeamMember);

// Progress reports
router.post('/:id/progress-report', createProgressReport);
router.get('/:id/progress-reports', getProgressReports);

// Statistics
router.get('/:id/statistics', getIEPStatistics);
```

---

### Step 3: Update Imports in Routes File

**File:** `src/routes/iep.routes.ts`

**Action:** UPDATE the import statement at the top:

```typescript
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
  getIEPSummary,
  addService,
  updateService,
  deleteService,
  recordServiceSession,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  signTeamMember,
  createProgressReport,
  getProgressReports,
  getIEPStatistics
} from '../controllers/iep.controller';
```

---

### Step 4: Test the API

**Start server:**
```bash
npm run dev
```

**Test endpoints:**
```bash
# Add service
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Speech Therapy",
    "provider": "Dr. Smith",
    "frequency": "2x per week",
    "duration": 30,
    "serviceType": "Direct",
    "setting": "Pull-out",
    "startDate": "2024-09-01",
    "endDate": "2025-06-30",
    "totalSessionsPlanned": 72
  }' \
  http://localhost:5001/api/v1/iep/{iep-id}/services

# Get IEP statistics
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/v1/iep/{iep-id}/statistics
```

---

## ✅ SUCCESS CRITERIA

1. ✅ 12 new functions added to `iep.controller.ts`
2. ✅ 11 new routes added to `iep.routes.ts`
3. ✅ Server starts without errors
4. ✅ All new endpoints respond

---

## 📊 NEW API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/iep/:id/services` | Add service |
| PUT | `/api/v1/iep/services/:id` | Update service |
| DELETE | `/api/v1/iep/services/:id` | Delete service |
| POST | `/api/v1/iep/services/:id/session` | Record session |
| POST | `/api/v1/iep/:id/team` | Add team member |
| PUT | `/api/v1/iep/team/:id` | Update member |
| DELETE | `/api/v1/iep/team/:id` | Remove member |
| POST | `/api/v1/iep/team/:id/sign` | Sign member |
| POST | `/api/v1/iep/:id/progress-report` | Create report |
| GET | `/api/v1/iep/:id/progress-reports` | List reports |
| GET | `/api/v1/iep/:id/statistics` | Get stats |

---

## ⏭️ NEXT PROMPTS

After completing 1-D1 and 1-D2, tell me and I'll create:
- **PHASE_1_E1** - Interventions Controller
- **PHASE_1_E2** - Reports & Messages Controller

---

**Files Modified:**
- ✅ `src/controllers/iep.controller.ts` (12 functions added)
- ✅ `src/routes/iep.routes.ts` (11 routes added)

**Mark complete and notify for next prompts** ✅
