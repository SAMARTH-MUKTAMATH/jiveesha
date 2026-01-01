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
                tags: JSON.stringify(tags || []),
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
                metadata: JSON.stringify({ entryId: entry.id }),
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

        // Stringify tags if provided
        if (updateData.tags) {
            updateData.tags = JSON.stringify(updateData.tags);
        }

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
                metadata: JSON.stringify({ entryId: entry.id }),
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
