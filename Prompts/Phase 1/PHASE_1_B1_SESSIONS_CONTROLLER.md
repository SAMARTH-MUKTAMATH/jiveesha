# PHASE 1-B1: SESSIONS API CONTROLLER
## Create Consultation Sessions API Endpoints

**Prompt ID:** 1-B1  
**Phase:** 1 - Complete Clinician Backend  
**Section:** B - Session Management  
**Dependencies:** 1-A1, 1-A2 complete  
**Estimated Time:** 25-30 minutes

---

## 🎯 OBJECTIVE

Create full CRUD API for consultation sessions:
- Create new session notes
- Get session by ID
- Get all sessions for a patient
- Update session notes
- Delete session
- Upload session attachments
- Get session templates

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Sessions Controller

**File:** `src/controllers/sessions.controller.ts`

**Action:** Create this NEW file with the following code:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new consultation session
 * POST /api/v1/sessions
 */
export const createSession = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const {
      patientId,
      sessionDate,
      duration,
      sessionType,
      format,
      location,
      notes,
      participants,
      linkedGoalId,
      linkedInterventionId,
      templateUsed
    } = req.body;

    // Validate required fields
    if (!patientId || !sessionDate || !duration || !sessionType || !format) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['patientId, sessionDate, duration, sessionType, and format are required']
        }
      });
    }

    // Create session with participants
    const session = await prisma.consultationSession.create({
      data: {
        patientId,
        clinicianId,
        sessionDate: new Date(sessionDate),
        duration,
        sessionType,
        format,
        location,
        notes,
        linkedGoalId,
        linkedInterventionId,
        templateUsed,
        participants: {
          create: participants?.map((p: any) => ({
            participantType: p.type,
            participantName: p.name
          })) || []
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        participants: true,
        attachments: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId,
        activityType: 'session_logged',
        description: `${sessionType} session logged`,
        metadata: { sessionId: session.id },
        createdBy: clinicianId
      }
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_SESSION_FAILED',
        message: 'Failed to create session'
      }
    });
  }
};

/**
 * Get all sessions for a patient
 * GET /api/v1/sessions/patient/:patientId
 */
export const getPatientSessions = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 20, sessionType } = req.query;

    const where: any = { patientId };
    if (sessionType) where.sessionType = sessionType as string;

    const sessions = await prisma.consultationSession.findMany({
      where,
      include: {
        participants: true,
        attachments: true,
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
        }
      },
      orderBy: { sessionDate: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.consultationSession.count({ where });

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          current_page: Number(page),
          per_page: Number(limit),
          total_pages: Math.ceil(total / Number(limit)),
          total_count: total
        }
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SESSIONS_FAILED',
        message: 'Failed to retrieve sessions'
      }
    });
  }
};

/**
 * Get single session by ID
 * GET /api/v1/sessions/:id
 */
export const getSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await prisma.consultationSession.findUnique({
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
        clinician: {
          include: {
            profile: true
          }
        },
        participants: true,
        attachments: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found'
        }
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SESSION_FAILED',
        message: 'Failed to retrieve session'
      }
    });
  }
};

/**
 * Update session
 * PUT /api/v1/sessions/:id
 */
export const updateSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.patientId;
    delete updateData.clinicianId;

    const session = await prisma.consultationSession.update({
      where: { id },
      data: {
        ...updateData,
        sessionDate: updateData.sessionDate ? new Date(updateData.sessionDate) : undefined
      },
      include: {
        participants: true,
        attachments: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: session.patientId,
        activityType: 'session_updated',
        description: 'Session notes updated',
        metadata: { sessionId: session.id },
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_SESSION_FAILED',
        message: 'Failed to update session'
      }
    });
  }
};

/**
 * Delete session
 * DELETE /api/v1/sessions/:id
 */
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get session first to log activity
    const session = await prisma.consultationSession.findUnique({
      where: { id },
      select: { patientId: true, sessionType: true }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found'
        }
      });
    }

    // Delete session (cascades to attachments and participants)
    await prisma.consultationSession.delete({
      where: { id }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: session.patientId,
        activityType: 'session_deleted',
        description: `${session.sessionType} session deleted`,
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_SESSION_FAILED',
        message: 'Failed to delete session'
      }
    });
  }
};

/**
 * Get session templates
 * GET /api/v1/sessions/templates
 */
export const getSessionTemplates = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;

    const templates = await prisma.sessionTemplate.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { createdBy: clinicianId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TEMPLATES_FAILED',
        message: 'Failed to retrieve templates'
      }
    });
  }
};

/**
 * Create session template
 * POST /api/v1/sessions/templates
 */
export const createSessionTemplate = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const { name, sessionType, templateContent, isGlobal } = req.body;

    const template = await prisma.sessionTemplate.create({
      data: {
        name,
        sessionType,
        templateContent,
        createdBy: clinicianId,
        isGlobal: isGlobal || false
      }
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_TEMPLATE_FAILED',
        message: 'Failed to create template'
      }
    });
  }
};

/**
 * Add attachment to session
 * POST /api/v1/sessions/:id/attachments
 */
export const addSessionAttachment = async (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const { fileType, fileName, fileUrl, fileSize, description } = req.body;

    const attachment = await prisma.sessionAttachment.create({
      data: {
        sessionId,
        fileType,
        fileName,
        fileUrl,
        fileSize,
        description
      }
    });

    res.status(201).json({
      success: true,
      data: attachment
    });
  } catch (error) {
    console.error('Add attachment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_ATTACHMENT_FAILED',
        message: 'Failed to add attachment'
      }
    });
  }
};

/**
 * Get clinician's sessions
 * GET /api/v1/sessions/clinician/me
 */
export const getClinicianSessions = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const { startDate, endDate, sessionType } = req.query;

    const where: any = { clinicianId };
    
    if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) where.sessionDate.gte = new Date(startDate as string);
      if (endDate) where.sessionDate.lte = new Date(endDate as string);
    }
    
    if (sessionType) where.sessionType = sessionType as string;

    const sessions = await prisma.consultationSession.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        participants: true
      },
      orderBy: { sessionDate: 'desc' }
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get clinician sessions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_CLINICIAN_SESSIONS_FAILED',
        message: 'Failed to retrieve sessions'
      }
    });
  }
};
```

---

### Step 2: Create Sessions Routes

**File:** `src/routes/sessions.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  createSession,
  getPatientSessions,
  getSession,
  updateSession,
  deleteSession,
  getSessionTemplates,
  createSessionTemplate,
  addSessionAttachment,
  getClinicianSessions
} from '../controllers/sessions.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Session CRUD
router.post('/', createSession);
router.get('/patient/:patientId', getPatientSessions);
router.get('/clinician/me', getClinicianSessions);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

// Templates
router.get('/templates/list', getSessionTemplates);
router.post('/templates', createSessionTemplate);

// Attachments
router.post('/:id/attachments', addSessionAttachment);

export default router;
```

---

### Step 3: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**At the top with other imports:**
```typescript
import sessionRoutes from './routes/sessions.routes';
```

**In the routes section (after existing routes):**
```typescript
app.use(`${API_PREFIX}/sessions`, sessionRoutes);
```

---

### Step 4: Test the API

**Start server:**
```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/backend
npm run dev
```

**Test endpoints (you'll need a valid JWT token):**

```bash
# Get session templates (should return empty array initially)
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:5001/api/v1/sessions/templates/list

# Create a session
curl -X POST -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "sessionDate": "2024-12-30",
    "duration": 45,
    "sessionType": "Speech Therapy",
    "format": "In-Person",
    "notes": "Good progress on expressive language"
  }' \
  http://localhost:5001/api/v1/sessions
```

---

## ✅ SUCCESS CRITERIA

**This prompt is complete when:**

1. ✅ `sessions.controller.ts` created with 9 functions
2. ✅ `sessions.routes.ts` created with all routes
3. ✅ Routes registered in `app.ts`
4. ✅ Server starts without errors: `npm run dev`
5. ✅ No TypeScript compilation errors
6. ✅ API endpoints respond:
   - POST `/api/v1/sessions` - Creates session
   - GET `/api/v1/sessions/patient/:id` - Lists patient sessions
   - GET `/api/v1/sessions/:id` - Gets single session
   - PUT `/api/v1/sessions/:id` - Updates session
   - DELETE `/api/v1/sessions/:id` - Deletes session
   - GET `/api/v1/sessions/templates/list` - Lists templates
   - POST `/api/v1/sessions/templates` - Creates template
   - POST `/api/v1/sessions/:id/attachments` - Adds attachment
   - GET `/api/v1/sessions/clinician/me` - Gets clinician sessions

---

## 🧪 VERIFICATION TESTS

### Test 1: Check Files Created
```bash
ls -la src/controllers/sessions.controller.ts
ls -la src/routes/sessions.routes.ts
```

### Test 2: Check Routes Registered
```bash
grep "sessionRoutes" src/app.ts
```

### Test 3: TypeScript Compilation
```bash
npm run build
# Should complete without errors
```

### Test 4: Server Health
```bash
npm run dev
# Should see: "🚀 Daira Backend Server running on port 5001"
```

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/sessions` | Create new session |
| GET | `/api/v1/sessions/patient/:patientId` | List patient sessions |
| GET | `/api/v1/sessions/clinician/me` | List my sessions |
| GET | `/api/v1/sessions/:id` | Get session details |
| PUT | `/api/v1/sessions/:id` | Update session |
| DELETE | `/api/v1/sessions/:id` | Delete session |
| GET | `/api/v1/sessions/templates/list` | List templates |
| POST | `/api/v1/sessions/templates` | Create template |
| POST | `/api/v1/sessions/:id/attachments` | Add attachment |

---

## 🐛 TROUBLESHOOTING

### Issue: "authenticate middleware not found"
**Solution:** Middleware should exist from previous setup
```bash
ls -la src/middleware/auth.ts
```

### Issue: "Prisma Client not found"
**Solution:** Regenerate Prisma Client
```bash
npx prisma generate
```

---

## ⏭️ NEXT PROMPT

**PHASE_1_B2_JOURNAL_CONTROLLER.md** - Create Patient Journal API

---

**Files Created:**
- ✅ `src/controllers/sessions.controller.ts`
- ✅ `src/routes/sessions.routes.ts`

**Files Modified:**
- ✅ `src/app.ts` (added route registration)

**Mark complete and proceed to 1-B2** ✅
