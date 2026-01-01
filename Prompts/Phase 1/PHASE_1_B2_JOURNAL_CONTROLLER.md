# PHASE 1-B2: JOURNAL API CONTROLLER
## Create Patient Journal API Endpoints

**Prompt ID:** 1-B2  
**Phase:** 1 - Complete Clinician Backend  
**Section:** B - Session Management  
**Dependencies:** 1-A1, 1-A2, 1-B1 complete  
**Estimated Time:** 20-25 minutes

---

## 🎯 OBJECTIVE

Create full CRUD API for patient journal:
- Create journal entries (observations, milestones, concerns)
- Get entries for a patient
- Update entries
- Delete entries
- Add attachments (photos, videos, documents)
- Filter by entry type and date range

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Journal Controller

**File:** `src/controllers/journal.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create journal entry
 * POST /api/v1/journal
 */
export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const {
      patientId,
      entryType,
      title,
      content,
      tags,
      linkedSessionId,
      linkedGoalId,
      linkedInterventionId,
      visibility,
      attachments
    } = req.body;

    // Validate required fields
    if (!patientId || !entryType || !title || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['patientId, entryType, title, and content are required']
        }
      });
    }

    // Get user info for createdByName
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    const createdByName = user?.profile 
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : 'Unknown';

    // Create entry with attachments
    const entry = await prisma.journalEntry.create({
      data: {
        patientId,
        entryType,
        title,
        content,
        tags: tags || [],
        linkedSessionId,
        linkedGoalId,
        linkedInterventionId,
        visibility: visibility || 'clinician_only',
        createdBy: userId,
        createdByType: 'clinician',
        createdByName,
        attachments: {
          create: attachments?.map((att: any) => ({
            fileType: att.fileType,
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize
          })) || []
        }
      },
      include: {
        attachments: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId,
        activityType: 'journal_entry_created',
        description: `${entryType} journal entry: ${title}`,
        metadata: { entryId: entry.id },
        createdBy: userId
      }
    });

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_ENTRY_FAILED',
        message: 'Failed to create journal entry'
      }
    });
  }
};

/**
 * Get journal entries for a patient
 * GET /api/v1/journal/patient/:patientId
 */
export const getPatientJournalEntries = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { 
      entryType, 
      startDate, 
      endDate,
      visibility,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = { patientId };

    if (entryType) where.entryType = entryType as string;
    if (visibility) where.visibility = visibility as string;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        attachments: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.journalEntry.count({ where });

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          current_page: Number(page),
          per_page: Number(limit),
          total_pages: Math.ceil(total / Number(limit)),
          total_count: total
        }
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ENTRIES_FAILED',
        message: 'Failed to retrieve journal entries'
      }
    });
  }
};

/**
 * Get single journal entry
 * GET /api/v1/journal/:id
 */
export const getJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        attachments: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ENTRY_NOT_FOUND',
          message: 'Journal entry not found'
        }
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ENTRY_FAILED',
        message: 'Failed to retrieve journal entry'
      }
    });
  }
};

/**
 * Update journal entry
 * PUT /api/v1/journal/:id
 */
export const updateJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.createdBy;
    delete updateData.createdByType;
    delete updateData.createdByName;
    delete updateData.patientId;

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: updateData,
      include: {
        attachments: true
      }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: entry.patientId,
        activityType: 'journal_entry_updated',
        description: `Journal entry updated: ${entry.title}`,
        metadata: { entryId: entry.id },
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ENTRY_FAILED',
        message: 'Failed to update journal entry'
      }
    });
  }
};

/**
 * Delete journal entry
 * DELETE /api/v1/journal/:id
 */
export const deleteJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get entry first for logging
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      select: { patientId: true, title: true }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ENTRY_NOT_FOUND',
          message: 'Journal entry not found'
        }
      });
    }

    // Delete entry (cascades to attachments)
    await prisma.journalEntry.delete({
      where: { id }
    });

    // Log activity
    await prisma.patientActivityLog.create({
      data: {
        patientId: entry.patientId,
        activityType: 'journal_entry_deleted',
        description: `Journal entry deleted: ${entry.title}`,
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ENTRY_FAILED',
        message: 'Failed to delete journal entry'
      }
    });
  }
};

/**
 * Add attachment to journal entry
 * POST /api/v1/journal/:id/attachments
 */
export const addJournalAttachment = async (req: Request, res: Response) => {
  try {
    const { id: entryId } = req.params;
    const { fileType, fileName, fileUrl, fileSize } = req.body;

    const attachment = await prisma.journalAttachment.create({
      data: {
        entryId,
        fileType,
        fileName,
        fileUrl,
        fileSize
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
 * Get journal entries by type (milestones, observations, concerns, etc.)
 * GET /api/v1/journal/type/:entryType
 */
export const getEntriesByType = async (req: Request, res: Response) => {
  try {
    const { entryType } = req.params;
    const { patientId, limit = 10 } = req.query;

    const where: any = { entryType };
    if (patientId) where.patientId = patientId as string;

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        attachments: true,
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
      data: entries
    });
  } catch (error) {
    console.error('Get entries by type error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ENTRIES_BY_TYPE_FAILED',
        message: 'Failed to retrieve entries'
      }
    });
  }
};

/**
 * Get recent journal entries across all patients for clinician
 * GET /api/v1/journal/clinician/recent
 */
export const getClinicianRecentEntries = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const { limit = 20 } = req.query;

    // Get clinician's patients
    const patients = await prisma.patient.findMany({
      where: { clinicianId },
      select: { id: true }
    });

    const patientIds = patients.map(p => p.id);

    const entries = await prisma.journalEntry.findMany({
      where: {
        patientId: { in: patientIds }
      },
      include: {
        attachments: true,
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
      data: entries
    });
  } catch (error) {
    console.error('Get recent entries error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_RECENT_ENTRIES_FAILED',
        message: 'Failed to retrieve recent entries'
      }
    });
  }
};
```

---

### Step 2: Create Journal Routes

**File:** `src/routes/journal.routes.ts`

**Action:** Create this NEW file:

```typescript
import express from 'express';
import {
  createJournalEntry,
  getPatientJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  addJournalAttachment,
  getEntriesByType,
  getClinicianRecentEntries
} from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Journal CRUD
router.post('/', createJournalEntry);
router.get('/patient/:patientId', getPatientJournalEntries);
router.get('/clinician/recent', getClinicianRecentEntries);
router.get('/type/:entryType', getEntriesByType);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

// Attachments
router.post('/:id/attachments', addJournalAttachment);

export default router;
```

---

### Step 3: Register Routes in app.ts

**File:** `src/app.ts`

**Action:** Add these lines:

**At the top with other imports:**
```typescript
import journalRoutes from './routes/journal.routes';
```

**In the routes section (after sessions routes):**
```typescript
app.use(`${API_PREFIX}/journal`, journalRoutes);
```

---

### Step 4: Test the API

**Start server:**
```bash
npm run dev
```

**Test endpoints:**

```bash
# Create journal entry
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "entryType": "milestone",
    "title": "First Steps!",
    "content": "Leo took his first independent steps today!",
    "tags": ["motor", "milestone"],
    "visibility": "shared_with_parent"
  }' \
  http://localhost:5001/api/v1/journal

# Get patient journal
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/v1/journal/patient/patient-uuid
```

---

## ✅ SUCCESS CRITERIA

1. ✅ `journal.controller.ts` created with 8 functions
2. ✅ `journal.routes.ts` created
3. ✅ Routes registered in `app.ts`
4. ✅ Server starts without errors
5. ✅ API endpoints respond:
   - POST `/api/v1/journal` - Creates entry
   - GET `/api/v1/journal/patient/:id` - Lists patient entries
   - GET `/api/v1/journal/:id` - Gets single entry
   - PUT `/api/v1/journal/:id` - Updates entry
   - DELETE `/api/v1/journal/:id` - Deletes entry
   - POST `/api/v1/journal/:id/attachments` - Adds attachment
   - GET `/api/v1/journal/type/:entryType` - Gets by type
   - GET `/api/v1/journal/clinician/recent` - Recent entries

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/journal` | Create journal entry |
| GET | `/api/v1/journal/patient/:patientId` | List patient entries |
| GET | `/api/v1/journal/clinician/recent` | Recent entries |
| GET | `/api/v1/journal/type/:entryType` | Get by type |
| GET | `/api/v1/journal/:id` | Get entry details |
| PUT | `/api/v1/journal/:id` | Update entry |
| DELETE | `/api/v1/journal/:id` | Delete entry |
| POST | `/api/v1/journal/:id/attachments` | Add attachment |

---

## ⏭️ NEXT PROMPT

After completing 1-B1 and 1-B2, tell me and I'll create:
- **PHASE_1_C1** - Assessments Controller
- **PHASE_1_C2** - Assessment Results & Comparison

---

**Files Created:**
- ✅ `src/controllers/journal.controller.ts`
- ✅ `src/routes/journal.routes.ts`

**Files Modified:**
- ✅ `src/app.ts`

**Mark complete** ✅
