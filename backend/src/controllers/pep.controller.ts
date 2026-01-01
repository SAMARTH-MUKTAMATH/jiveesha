import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create PEP
 * POST /api/v1/parent/pep
 */
export const createPEP = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            patientId,
            planName,
            focusAreas,
            startDate,
            description,
            linkedIEPId
        } = req.body;

        // Validate
        if (!patientId || !planName || !startDate) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'patientId, planName, and startDate are required'
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

        // Create PEP
        const pep = await prisma.pEP.create({
            data: {
                parentId: user.parent.id,
                patientId,
                planName,
                focusAreas: JSON.stringify(focusAreas || []),
                startDate: new Date(startDate),
                description,
                linkedIEPId,
                status: 'active'
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

        res.status(201).json({
            success: true,
            data: pep
        });
    } catch (error) {
        console.error('Create PEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_PEP_FAILED',
                message: 'Failed to create PEP'
            }
        });
    }
};

/**
 * Get PEP by ID
 * GET /api/v1/parent/pep/:id
 */
export const getPEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pep = await prisma.pEP.findUnique({
            where: { id },
            include: {
                patient: true,
                goals: {
                    include: {
                        activities: true,
                        progressUpdates: {
                            orderBy: { updateDate: 'desc' },
                            take: 5
                        }
                    },
                    orderBy: { goalNumber: 'asc' }
                },
                activities: {
                    include: {
                        completions: {
                            orderBy: { completedAt: 'desc' },
                            take: 3
                        }
                    }
                }
            }
        });

        if (!pep) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found'
                }
            });
        }

        res.json({
            success: true,
            data: pep
        });
    } catch (error) {
        console.error('Get PEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PEP_FAILED',
                message: 'Failed to retrieve PEP'
            }
        });
    }
};

/**
 * Get all PEPs for child
 * GET /api/v1/parent/pep/child/:patientId
 */
export const getChildPEPs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId } = req.params;

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

        const peps = await prisma.pEP.findMany({
            where: { patientId },
            include: {
                _count: {
                    select: {
                        goals: true,
                        activities: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: peps
        });
    } catch (error) {
        console.error('Get child PEPs error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PEPS_FAILED',
                message: 'Failed to retrieve PEPs'
            }
        });
    }
};

/**
 * Update PEP
 * PUT /api/v1/parent/pep/:id
 */
export const updatePEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.parentId;
        delete updateData.patientId;

        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
        if (updateData.focusAreas) updateData.focusAreas = JSON.stringify(updateData.focusAreas);

        const pep = await prisma.pEP.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            data: pep
        });
    } catch (error) {
        console.error('Update PEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PEP_FAILED',
                message: 'Failed to update PEP'
            }
        });
    }
};

/**
 * Add goal to PEP
 * POST /api/v1/parent/pep/:id/goals
 */
export const addGoal = async (req: Request, res: Response) => {
    try {
        const { id: pepId } = req.params;
        const {
            goalNumber,
            domain,
            goalStatement,
            targetDate,
            targetCriteria,
            linkedIEPGoalId
        } = req.body;

        const goal = await prisma.pEPGoal.create({
            data: {
                pepId,
                goalNumber,
                domain,
                goalStatement,
                targetDate: targetDate ? new Date(targetDate) : null,
                targetCriteria,
                linkedIEPGoalId
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
 * Add activity to PEP
 * POST /api/v1/parent/pep/:id/activities
 */
export const addActivity = async (req: Request, res: Response) => {
    try {
        const { id: pepId } = req.params;
        const {
            goalId,
            activityName,
            activityType,
            description,
            instructions,
            materials,
            duration,
            frequency,
            linkedResourceId
        } = req.body;

        const activity = await prisma.pEPActivity.create({
            data: {
                pepId,
                goalId,
                activityName,
                activityType,
                description,
                instructions,
                materials: materials ? JSON.stringify(materials) : null,
                duration,
                frequency,
                linkedResourceId
            }
        });

        res.status(201).json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Add activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_ACTIVITY_FAILED',
                message: 'Failed to add activity'
            }
        });
    }
};

/**
 * Complete activity
 * POST /api/v1/parent/pep/activities/:activityId/complete
 */
export const completeActivity = async (req: Request, res: Response) => {
    try {
        const { activityId } = req.params;
        const {
            duration,
            childEngagement,
            parentObservations,
            challengesFaced,
            successesNoted,
            photos,
            videos
        } = req.body;

        const completion = await prisma.activityCompletion.create({
            data: {
                activityId,
                duration,
                childEngagement,
                parentObservations,
                challengesFaced,
                successesNoted,
                photos: photos ? JSON.stringify(photos) : null,
                videos: videos ? JSON.stringify(videos) : null
            }
        });

        // Update activity completion count
        await prisma.pEPActivity.update({
            where: { id: activityId },
            data: {
                completionCount: { increment: 1 },
                lastCompletedAt: new Date()
            }
        });

        res.status(201).json({
            success: true,
            data: completion
        });
    } catch (error) {
        console.error('Complete activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'COMPLETE_ACTIVITY_FAILED',
                message: 'Failed to record completion'
            }
        });
    }
};

/**
 * Update goal progress
 * POST /api/v1/parent/pep/goals/:goalId/progress
 */
export const updateGoalProgress = async (req: Request, res: Response) => {
    try {
        const { goalId } = req.params;
        const {
            progressPercentage,
            status,
            notes,
            observations
        } = req.body;

        const progress = await prisma.pEPGoalProgress.create({
            data: {
                goalId,
                progressPercentage,
                status,
                notes,
                observations
            }
        });

        // Update goal progress
        await prisma.pEPGoal.update({
            where: { id: goalId },
            data: {
                currentProgress: progressPercentage,
                progressStatus: status
            }
        });

        res.status(201).json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PROGRESS_FAILED',
                message: 'Failed to update progress'
            }
        });
    }
};
