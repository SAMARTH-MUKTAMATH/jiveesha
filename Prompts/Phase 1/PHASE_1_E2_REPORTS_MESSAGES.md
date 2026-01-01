# PHASE 1-E2: REPORTS & MESSAGES CONTROLLER
## Create Report Generation and Messaging System APIs (FINAL Phase 1 Prompt!)

**Prompt ID:** 1-E2  
**Phase:** 1 - Complete Clinician Backend  
**Section:** E - Clinical Features  
**Dependencies:** All previous Phase 1 prompts complete  
**Estimated Time:** 25-30 minutes

---

## 🎯 OBJECTIVE

Create final clinician backend features:
- **Reports** - Generate diagnostic, progress, IEP summary reports
- **Messages** - Clinician-parent messaging system
- **Conversations** - Thread-based communication
- **Notifications** - System notifications

This is the **FINAL prompt for Phase 1**! 🎉

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Reports Controller

**File:** `src/controllers/reports.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create report
 * POST /api/v1/reports
 */
export const createReport = async (req: Request, res: Response) => {
  try {
    const clinicianId = (req as any).userId;
    const {
      patientId,
      reportType,
      title,
      content,
      sections,
      linkedAssessmentId,
      linkedIEPId
    } = req.body;

    if (!patientId || !reportType || !title) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: ['patientId, reportType, and title are required']
        }
      });
    }

    const report = await prisma.report.create({
      data: {
        patientId,
        clinicianId,
        reportType,
        title,
        content,
        sections,
        linkedAssessmentId,
        linkedIEPId,
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
        activityType: 'report_created',
        description: `${reportType} report created: ${title}`,
        metadata: { reportId: report.id },
        createdBy: clinicianId
      }
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_REPORT_FAILED',
        message: 'Failed to create report'
      }
    });
  }
};

/**
 * Get report by ID
 * GET /api/v1/reports/:id
 */
export const getReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        patient: true,
        clinician: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Report not found'
        }
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_REPORT_FAILED',
        message: 'Failed to retrieve report'
      }
    });
  }
};

/**
 * Get all reports for a patient
 * GET /api/v1/reports/patient/:patientId
 */
export const getPatientReports = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { reportType, status } = req.query;

    const where: any = { patientId };
    if (reportType) where.reportType = reportType as string;
    if (status) where.status = status as string;

    const reports = await prisma.report.findMany({
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
        }
      },
      orderBy: { generatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get patient reports error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_REPORTS_FAILED',
        message: 'Failed to retrieve reports'
      }
    });
  }
};

/**
 * Update report
 * PUT /api/v1/reports/:id
 */
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.patientId;
    delete updateData.clinicianId;
    delete updateData.generatedAt;

    const report = await prisma.report.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_REPORT_FAILED',
        message: 'Failed to update report'
      }
    });
  }
};

/**
 * Delete report
 * DELETE /api/v1/reports/:id
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      select: { patientId: true, title: true }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Report not found'
        }
      });
    }

    await prisma.report.delete({
      where: { id }
    });

    await prisma.patientActivityLog.create({
      data: {
        patientId: report.patientId,
        activityType: 'report_deleted',
        description: `Report deleted: ${report.title}`,
        createdBy: (req as any).userId
      }
    });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_REPORT_FAILED',
        message: 'Failed to delete report'
      }
    });
  }
};

/**
 * Share report with parent or other party
 * POST /api/v1/reports/:id/share
 */
export const shareReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { shareWith, email } = req.body; // shareWith: 'parent', 'school', etc.

    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Report not found'
        }
      });
    }

    const sharedWith = (report.sharedWith as any[]) || [];
    const shareLog = (report.shareLog as any[]) || [];

    sharedWith.push({
      type: shareWith,
      email,
      sharedAt: new Date()
    });

    shareLog.push({
      action: 'shared',
      sharedWith: shareWith,
      email,
      timestamp: new Date(),
      sharedBy: (req as any).userId
    });

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        sharedWith,
        shareLog
      }
    });

    res.json({
      success: true,
      data: updatedReport,
      message: 'Report shared successfully'
    });
  } catch (error) {
    console.error('Share report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SHARE_REPORT_FAILED',
        message: 'Failed to share report'
      }
    });
  }
};

/**
 * Finalize report (mark as final)
 * POST /api/v1/reports/:id/finalize
 */
export const finalizeReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: 'final'
      }
    });

    res.json({
      success: true,
      data: report,
      message: 'Report finalized'
    });
  } catch (error) {
    console.error('Finalize report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FINALIZE_REPORT_FAILED',
        message: 'Failed to finalize report'
      }
    });
  }
};
```

---

### Step 2: Create Messages Controller

**File:** `src/controllers/messages.controller.ts`

**Action:** Create this NEW file:

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create conversation and send first message
 * POST /api/v1/messages/conversations
 */
export const createConversation = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).userId;
    const {
      recipientId,
      recipientType,
      patientId,
      subject,
      body,
      senderName,
      recipientName
    } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        participants: [
          { id: senderId, type: 'clinician', name: senderName },
          { id: recipientId, type: recipientType, name: recipientName }
        ],
        patientId,
        subject,
        lastMessageAt: new Date(),
        messages: {
          create: {
            senderId,
            senderType: 'clinician',
            senderName,
            recipientId,
            recipientType,
            body
          }
        }
      },
      include: {
        messages: true
      }
    });

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        userType: recipientType,
        notificationType: 'message_received',
        title: 'New Message',
        message: `${senderName} sent you a message`,
        actionUrl: `/messages/${conversation.id}`,
        actionData: { conversationId: conversation.id },
        category: 'messages'
      }
    });

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_CONVERSATION_FAILED',
        message: 'Failed to create conversation'
      }
    });
  }
};

/**
 * Send message in existing conversation
 * POST /api/v1/messages/:conversationId
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const senderId = (req as any).userId;
    const {
      recipientId,
      recipientType,
      senderName,
      senderType,
      body,
      attachments
    } = req.body;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        senderType: senderType || 'clinician',
        senderName,
        recipientId,
        recipientType,
        body,
        attachments
      }
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date()
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: recipientId,
        userType: recipientType,
        notificationType: 'message_received',
        title: 'New Message',
        message: `${senderName} sent you a message`,
        actionUrl: `/messages/${conversationId}`,
        actionData: { conversationId, messageId: message.id },
        category: 'messages'
      }
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SEND_MESSAGE_FAILED',
        message: 'Failed to send message'
      }
    });
  }
};

/**
 * Get conversation by ID
 * GET /api/v1/messages/:conversationId
 */
export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { sentAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message: 'Conversation not found'
        }
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_CONVERSATION_FAILED',
        message: 'Failed to retrieve conversation'
      }
    });
  }
};

/**
 * Get all conversations for user
 * GET /api/v1/messages/conversations/my
 */
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Find conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          path: '$[*].id',
          array_contains: userId
        }
      },
      include: {
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_CONVERSATIONS_FAILED',
        message: 'Failed to retrieve conversations'
      }
    });
  }
};

/**
 * Mark message as read
 * PUT /api/v1/messages/:messageId/read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MARK_READ_FAILED',
        message: 'Failed to mark message as read'
      }
    });
  }
};

/**
 * Get unread message count
 * GET /api/v1/messages/unread/count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const count = await prisma.message.count({
      where: {
        recipientId: userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_UNREAD_COUNT_FAILED',
        message: 'Failed to get unread count'
      }
    });
  }
};
```

---

### Step 3: Create Routes Files

**File:** `src/routes/reports.routes.ts`

```typescript
import express from 'express';
import {
  createReport,
  getReport,
  getPatientReports,
  updateReport,
  deleteReport,
  shareReport,
  finalizeReport
} from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createReport);
router.get('/patient/:patientId', getPatientReports);
router.get('/:id', getReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.post('/:id/share', shareReport);
router.post('/:id/finalize', finalizeReport);

export default router;
```

**File:** `src/routes/messages.routes.ts`

```typescript
import express from 'express';
import {
  createConversation,
  sendMessage,
  getConversation,
  getMyConversations,
  markAsRead,
  getUnreadCount
} from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/conversations', createConversation);
router.get('/conversations/my', getMyConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:conversationId', getConversation);
router.post('/:conversationId', sendMessage);
router.put('/:messageId/read', markAsRead);

export default router;
```

---

### Step 4: Register Routes in app.ts

**File:** `src/app.ts`

**Add imports:**
```typescript
import reportRoutes from './routes/reports.routes';
import messageRoutes from './routes/messages.routes';
```

**Add route registrations:**
```typescript
app.use(`${API_PREFIX}/reports`, reportRoutes);
app.use(`${API_PREFIX}/messages`, messageRoutes);
```

---

### Step 5: Test Server

```bash
npm run dev
```

---

## ✅ SUCCESS CRITERIA - PHASE 1 COMPLETE!

1. ✅ `reports.controller.ts` created with 7 functions
2. ✅ `messages.controller.ts` created with 6 functions
3. ✅ Both routes files created
4. ✅ Routes registered in `app.ts`
5. ✅ Server starts without errors
6. ✅ All endpoints respond

---

## 🎉 PHASE 1 COMPLETE!

**Congratulations! You've completed ALL 10 Phase 1 prompts:**

✅ 1-A1: Sessions & Journal Models  
✅ 1-A2: Clinical Models  
✅ 1-B1: Sessions Controller  
✅ 1-B2: Journal Controller  
✅ 1-C1: Assessments Controller  
✅ 1-C2: Assessment Results  
✅ 1-D1: IEP Builder  
✅ 1-D2: IEP Services  
✅ 1-E1: Interventions  
✅ 1-E2: Reports & Messages ← **FINAL!**

---

## 📊 WHAT YOU'VE BUILT

**Complete Clinician Backend with:**
- ✅ 25+ database tables
- ✅ 100+ API endpoints
- ✅ 8 major feature areas
- ✅ Full CRUD operations
- ✅ Authentication & authorization
- ✅ Activity logging
- ✅ Notifications system

---

## ⏭️ NEXT: PHASE 2

Ready for **Phase 2: Parent Portal Backend**!

Tell me when you're ready and I'll create the Phase 2 prompts for:
- Parent authentication
- Parent-child relationships
- Consent management
- Parent-led screenings
- PEP builder
- Resources & activities

---

**Mark Phase 1 COMPLETE!** 🎊
