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
            personId,
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
        if (!personId || !entryType || !title || !content) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['personId, entryType, title, and content are required']
                }
            });
        }

        // Get user info for createdByName
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                clinicianProfile: true,
                parent: true
            }
        });

        let createdByName = 'Unknown';
        let type = user?.role || 'clinician';

        if (user?.clinicianProfile) {
            createdByName = `${user.clinicianProfile.firstName} ${user.clinicianProfile.lastName}`;
        } else if (user?.parent) {
            // Fallback for safety, though registration creates clinicianProfile
            createdByName = 'Parent';
        }

        // Verify access to personId
        if (type === 'parent') {
            const access = await prisma.parentChildView.findFirst({
                where: {
                    parentId: user?.parent?.id,
                    personId
                }
            });
            if (!access) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'ACCESS_DENIED', message: 'You do not have access to this child' }
                });
            }
        } else if (type === 'clinician') {
            const access = await prisma.clinicianPatientView.findFirst({
                where: {
                    clinicianId: userId,
                    personId
                }
            });
            if (!access) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'ACCESS_DENIED', message: 'You do not have access to this patient' }
                });
            }
        }

        // Create entry with attachments
        const entry = await prisma.journalEntry.create({
            data: {
                personId,
                entryType,
                title,
                content,
                tags: JSON.stringify(tags || []),
                linkedSessionId,
                linkedGoalId,
                linkedInterventionId,
                visibility: visibility || (type === 'parent' ? 'shared_with_team' : 'clinician_only'),
                createdBy: userId,
                createdByType: type,
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
 * GET /api/v1/journal/patient/:personId
 */
export const getPatientJournalEntries = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const userId = (req as any).userId;
        const role = (req as any).userRole; // Assuming role is in token

        // Verify access
        if (role === 'parent') {
            const parent = await prisma.parent.findUnique({ where: { userId } });
            const access = await prisma.parentChildView.findFirst({
                where: { parentId: parent?.id, personId }
            });
            if (!access) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'ACCESS_DENIED', message: 'Access denied to this child' }
                });
            }
        } else {
            // Clinician check
            const access = await prisma.clinicianPatientView.findFirst({
                where: { clinicianId: userId, personId }
            });
            if (!access) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'ACCESS_DENIED', message: 'Access denied to this patient' }
                });
            }
        }

        const {
            entryType,
            startDate,
            endDate,
            visibility,
            page = 1,
            limit = 20
        } = req.query;

        const where: any = { personId };

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
                person: {
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
        delete updateData.personId;

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
            select: { personId: true, title: true }
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
        const { personId, limit = 10 } = req.query;

        const where: any = { entryType };
        if (personId) where.personId = personId as string;

        const entries = await prisma.journalEntry.findMany({
            where,
            include: {
                attachments: true,
                person: {
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
        const patients = await prisma.clinicianPatientView.findMany({
            where: { clinicianId },
            select: { personId: true }
        });

        const personIds = patients.map((p: any) => p.personId);

        const entries = await prisma.journalEntry.findMany({
            where: {
                personId: { in: personIds }
            },
            include: {
                attachments: true,
                person: {
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

/**
 * Get unified timeline for parent (Journal + Activities)
 * GET /api/v1/journal/parent/timeline/:personId
 */
export const getParentTimeline = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const { limit = 50 } = req.query;
        const userId = (req as any).userId;

        // Verify parent has access to this child
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent profile required'
                }
            });
        }

        const access = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
                personId
            }
        });

        if (!access) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this child\'s timeline'
                }
            });
        }

        // 1. Get Journal Entries
        const journalEntries = await prisma.journalEntry.findMany({
            where: {
                personId
            },
            include: { attachments: true },
            orderBy: { createdAt: 'desc' },
            take: Number(limit)
        });

        // 2. Get Activity Completions
        const activityCompletions = await prisma.activityCompletion.findMany({
            where: {
                activity: {
                    personId: personId
                }
            },
            include: {
                activity: true
            },
            orderBy: { completedAt: 'desc' },
            take: Number(limit)
        });

        // 3. Transform and Merge
        const timelineItems = [
            ...journalEntries.map(entry => ({
                id: entry.id,
                type: 'journal',
                entryType: entry.entryType, // observation, note, milestone
                title: entry.title,
                content: entry.content,
                date: entry.createdAt,
                author: entry.createdByName,
                createdByType: entry.createdByType,
                data: {
                    attachments: entry.attachments,
                    visibility: entry.visibility
                }
            })),
            ...activityCompletions.map(completion => ({
                id: completion.id,
                type: 'activity',
                entryType: 'activity_completion',
                title: `Completed Activity: ${completion.activity.activityName}`,
                content: completion.parentObservations || completion.challengesFaced || 'Activity completed',
                date: completion.completedAt,
                author: 'Parent',
                data: {
                    activityId: completion.activity.id,
                    duration: completion.duration,
                    photos: completion.photos, // String[]
                    videos: completion.videos  // String[]
                }
            }))
        ];

        // 4. Sort by date desc
        timelineItems.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 5. Slice to limit
        const finalItems = timelineItems.slice(0, Number(limit));

        res.json({
            success: true,
            data: finalItems
        });

    } catch (error) {
        console.error('Get parent timeline error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_TIMELINE_FAILED',
                message: 'Failed to retrieve timeline'
            }
        });
    }
};
