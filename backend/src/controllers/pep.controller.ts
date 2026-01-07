import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create PEP (Parent Education Plan)
 * POST /api/v1/parent/pep
 */
export const createPEP = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        const parentId = user.parent.id;

        const {
            childId,
            personId: bodyPersonId,
            planName,
            focusAreas,
            startDate,
            endDate,
            description,
            notes
        } = req.body;

        // Support both childId and personId
        const personId = childId || bodyPersonId;

        // Validate required fields
        if (!personId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['childId or personId is required']
                }
            });
        }

        // Verify parent has access to this child
        const relationship = await prisma.parentChildView.findFirst({
            where: {
                parentId,
                personId
            },
            include: {
                person: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
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

        // Use defaults if not provided
        const childName = `${relationship.person.firstName} ${relationship.person.lastName}`;
        const defaultPlanName = planName || `${childName}'s PEP`;
        const defaultStartDate = startDate ? new Date(startDate) : new Date();

        const pep = await prisma.educationPlan.create({
            data: {
                personId,
                createdBy: userId,
                createdByType: 'parent',
                planType: 'PEP',
                planName: defaultPlanName,
                focusAreas: JSON.stringify(focusAreas || []),
                startDate: defaultStartDate,
                endDate: endDate ? new Date(endDate) : null,
                description: description || '',
                notes: notes || '',
                status: 'active'
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                goals: true
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
 * Get all PEPs for logged-in parent with calculated progress
 * GET /api/v1/parent/pep
 */
export const getAllPEPs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        // Get all children for this parent
        const parentViews = await prisma.parentChildView.findMany({
            where: { parentId: user.parent.id },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const childIds = parentViews.map(pv => pv.personId);

        // Get all PEPs for these children
        const peps = await prisma.educationPlan.findMany({
            where: {
                personId: { in: childIds },
                planType: 'PEP'
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate progress for each PEP based on activities
        const pepsWithProgress = await Promise.all(
            peps.map(async (pep) => {
                // Get all activities for this PEP
                const activities = await prisma.activity.findMany({
                    where: {
                        personId: pep.personId,
                        activityType: 'pep'
                    }
                });

                const totalActivities = activities.length;
                const completedActivities = activities.filter(a => a.completionCount > 0).length;
                const progress = totalActivities > 0
                    ? Math.round((completedActivities / totalActivities) * 100)
                    : 0;

                return {
                    id: pep.id,
                    childId: pep.personId,
                    childName: `${pep.person.firstName} ${pep.person.lastName}`,
                    status: pep.status,
                    goalsCount: 0, // Goals not implemented yet
                    activitiesCount: totalActivities,
                    progress: progress,
                    createdAt: pep.createdAt,
                    updatedAt: pep.updatedAt
                };
            })
        );

        res.json({
            success: true,
            data: pepsWithProgress
        });
    } catch (error) {
        console.error('Get all PEPs error:', error);
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
 * Get PEP by ID
 * GET /api/v1/parent/pep/:id
 */
export const getPEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pep = await prisma.educationPlan.findUnique({
            where: { id },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                },
                goals: {
                    include: {
                        objectives: true,
                        progressUpdates: {
                            orderBy: { updateDate: 'desc' },
                            take: 5
                        }
                    }
                }
            }
        });

        if (!pep || pep.planType !== 'PEP') {
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
 * GET /api/v1/parent/pep/child/:personId
 */
export const getChildPEPs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { personId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        const parentId = user.parent.id;

        // Verify parent has access to this child
        const relationship = await prisma.parentChildView.findFirst({
            where: {
                parentId,
                personId
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

        const peps = await prisma.educationPlan.findMany({
            where: {
                personId,
                planType: 'PEP'
            },
            include: {
                goals: {
                    select: {
                        id: true,
                        goalStatement: true,
                        currentProgress: true,
                        progressStatus: true
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

        // Remove fields that shouldn't be updated
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.personId;
        delete updateData.createdBy;
        delete updateData.createdByType;
        delete updateData.planType;

        // Handle JSON fields
        if (updateData.focusAreas) {
            updateData.focusAreas = JSON.stringify(updateData.focusAreas);
        }

        // Handle date fields
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        const pep = await prisma.educationPlan.update({
            where: { id },
            data: updateData,
            include: {
                goals: true
            }
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
        const { id: planId } = req.params;
        const {
            goalNumber,
            domain,
            goalStatement,
            targetCriteria,
            targetDate,
            milestones
        } = req.body;

        // Get current goal count for numbering
        const existingGoals = await prisma.educationGoal.count({
            where: { planId }
        });

        const goal = await prisma.educationGoal.create({
            data: {
                planId,
                goalNumber: goalNumber || existingGoals + 1,
                domain: domain || 'general',
                goalStatement,
                targetCriteria: targetCriteria || 'Mastery of skill',
                targetDate: targetDate ? new Date(targetDate) : null,
                milestones: JSON.stringify(milestones || []),
                currentProgress: 0,
                progressStatus: 'not_started'
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
        const userId = (req as any).userId;
        const { id: planId } = req.params;
        const {
            title,
            activityName: bodyActivityName,
            description,
            category,
            domain,
            duration,
            materials,
            instructions
        } = req.body;

        // Support both title and activityName
        const activityName = title || bodyActivityName || 'Untitled Activity';

        // Get personId from the plan
        const plan = await prisma.educationPlan.findUnique({
            where: { id: planId },
            select: { personId: true }
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found'
                }
            });
        }

        const activity = await prisma.activity.create({
            data: {
                personId: plan.personId,
                createdBy: userId,
                createdByType: 'parent',
                activityName,
                activityType: 'pep',
                domain: domain || category || 'general',
                description: description || '',
                duration: duration || null,
                materials: JSON.stringify(materials || []),
                instructions: instructions || null
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
 * Update activity
 * PUT /api/v1/parent/pep/:pepId/activities/:activityId
 */
export const updateActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { pepId, activityId } = req.params;
        const { title, description, domain } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        // Verify PEP ownership
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        if (!pep || pep.person.parentViews.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        // Update activity
        const activity = await prisma.activity.update({
            where: { id: activityId },
            data: {
                activityName: title,
                description: description || '',
                domain: domain || 'motor'
            }
        });

        res.json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Update activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_ACTIVITY_FAILED',
                message: 'Failed to update activity'
            }
        });
    }
};

/**
 * Delete activity
 * DELETE /api/v1/parent/pep/:pepId/activities/:activityId
 */
export const deleteActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { pepId, activityId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        // Verify PEP ownership
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        if (!pep || pep.person.parentViews.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        // Delete activity
        await prisma.activity.delete({
            where: { id: activityId }
        });

        res.json({
            success: true
        });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_ACTIVITY_FAILED',
                message: 'Failed to delete activity'
            }
        });
    }
};

/**
 * Toggle activity completion
 * POST /api/v1/parent/pep/:pepId/activities/:activityId/toggle-completion
 */
export const toggleActivityCompletion = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { pepId, activityId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        // Verify PEP ownership
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        if (!pep || pep.person.parentViews.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        // Get current activity
        const activity = await prisma.activity.findUnique({
            where: { id: activityId }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ACTIVITY_NOT_FOUND',
                    message: 'Activity not found'
                }
            });
        }

        // Toggle completion: if completionCount > 0, it's completed, so we "uncomplete" it
        // Otherwise, we mark it as completed
        const isCurrentlyCompleted = activity.completionCount > 0;

        if (isCurrentlyCompleted) {
            // Uncomplete: set count to 0
            const updatedActivity = await prisma.activity.update({
                where: { id: activityId },
                data: {
                    completionCount: 0,
                    lastCompletedAt: null
                }
            });

            res.json({
                success: true,
                data: {
                    id: updatedActivity.id,
                    pepId: pepId,
                    title: updatedActivity.activityName,
                    description: updatedActivity.description || '',
                    category: 'sports',
                    domain: updatedActivity.domain || 'motor',
                    completed: false,
                    completedAt: null,
                    createdAt: updatedActivity.createdAt,
                    updatedAt: updatedActivity.updatedAt
                }
            });
        } else {
            // Complete: increment count and set timestamp
            const updatedActivity = await prisma.activity.update({
                where: { id: activityId },
                data: {
                    completionCount: { increment: 1 },
                    lastCompletedAt: new Date()
                }
            });

            // Also create an ActivityCompletion record
            await prisma.activityCompletion.create({
                data: {
                    activityId: activityId,
                    completedAt: new Date()
                }
            });

            res.json({
                success: true,
                data: {
                    id: updatedActivity.id,
                    pepId: pepId,
                    title: updatedActivity.activityName,
                    description: updatedActivity.description || '',
                    category: 'sports',
                    domain: updatedActivity.domain || 'motor',
                    completed: true,
                    completedAt: updatedActivity.lastCompletedAt,
                    createdAt: updatedActivity.createdAt,
                    updatedAt: updatedActivity.updatedAt
                }
            });
        }
    } catch (error) {
        console.error('Toggle activity completion error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'TOGGLE_COMPLETION_FAILED',
                message: 'Failed to toggle activity completion'
            }
        });
    }
};

/**
 * Get activities for PEP
 * GET /api/v1/parent/pep/:pepId/activities
 */
export const getActivities = async (req: Request, res: Response) => {
    try {
        const { pepId } = req.params;
        const userId = (req as any).userId;

        console.log('[getActivities] Starting - pepId:', pepId, 'userId:', userId);

        if (!userId) {
            console.log('[getActivities] No userId found');
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        console.log('[getActivities] Fetching user and parent...');
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            console.log('[getActivities] User or parent not found');
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        console.log('[getActivities] Parent found:', user.parent.id);

        // Verify PEP ownership and get personId
        console.log('[getActivities] Fetching PEP...');
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        console.log('[getActivities] PEP found:', !!pep, 'personId:', pep?.personId);
        console.log('[getActivities] Parent views:', pep?.person.parentViews.length);

        if (!pep || pep.person.parentViews.length === 0) {
            console.log('[getActivities] PEP not found or access denied');
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        // Get activities for this person with activityType 'pep'
        console.log('[getActivities] Querying activities for personId:', pep.personId);
        const activities = await prisma.activity.findMany({
            where: {
                personId: pep.personId,
                activityType: 'pep'
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('[getActivities] Found', activities.length, 'activities');

        // Transform activities to match frontend interface
        const transformedActivities = activities.map(activity => ({
            id: activity.id,
            pepId: pepId,
            title: activity.activityName,
            description: activity.description || '',
            category: 'sports', // Default category since it doesn't exist in schema
            domain: activity.domain || 'motor',
            completed: activity.completionCount > 0,
            completedAt: activity.lastCompletedAt,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt
        }));

        console.log('[getActivities] Returning', transformedActivities.length, 'transformed activities');

        res.json({
            success: true,
            data: transformedActivities
        });
    } catch (error) {
        console.error('[getActivities] ERROR:', error);
        console.error('[getActivities] Error stack:', (error as Error).stack);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_ACTIVITIES_FAILED',
                message: 'Failed to retrieve activities',
                details: (error as Error).message
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
        const { notes, outcome, enjoymentLevel, difficultyLevel } = req.body;

        const activity = await prisma.activity.update({
            where: { id: activityId },
            data: {
                completionCount: { increment: 1 },
                lastCompletedAt: new Date(),
                notes: notes || undefined
            }
        });

        res.json({
            success: true,
            data: activity,
            message: 'Activity completed successfully'
        });
    } catch (error) {
        console.error('Complete activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'COMPLETE_ACTIVITY_FAILED',
                message: 'Failed to complete activity'
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
        const userId = (req as any).userId;
        const { goalId } = req.params;
        const { progressPercentage, notes, observations } = req.body;

        const progress = await prisma.goalProgressUpdate.create({
            data: {
                goalId,
                updateDate: new Date(),
                progressPercentage,
                status: progressPercentage >= 100 ? 'completed' : 'in_progress',
                notes,
                updatedBy: userId,
                updatedByType: 'parent'
            }
        });

        // Update goal's current progress
        await prisma.educationGoal.update({
            where: { id: goalId },
            data: {
                currentProgress: progressPercentage,
                progressStatus: progressPercentage >= 100 ? 'completed' : 'in_progress'
            }
        });

        res.status(201).json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Update goal progress error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PROGRESS_FAILED',
                message: 'Failed to update goal progress'
            }
        });
    }
};

/**
 * Get Activity Details with Notes, Media, and Completions
 * GET /api/v1/parent/pep/:pepId/activities/:activityId/details
 */
export const getActivityDetails = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { pepId, activityId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Parent authentication required'
                }
            });
        }

        // Get the PEP and verify ownership
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        if (!pep || pep.person.parentViews.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        // Get activity details with notes, media, and completions
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                personId: pep.personId,
                activityType: 'pep'
            },
            include: {
                activityNotes: {
                    orderBy: { createdAt: 'desc' }
                },
                activityMedia: {
                    orderBy: { uploadedAt: 'desc' }
                },
                completions: {
                    orderBy: { completedAt: 'desc' },
                    take: 50
                }
            }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Activity not found'
                }
            });
        }

        // Transform activity data
        const activityData = {
            id: activity.id,
            pepId: pepId,
            title: activity.activityName,
            description: activity.description || '',
            category: 'sports', // Default since not in schema
            domain: activity.domain || 'motor',
            completed: activity.completionCount > 0,
            completedAt: activity.lastCompletedAt,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt
        };

        // Transform notes
        const notesData = activity.activityNotes.map(n => ({
            id: n.id,
            note: n.note,
            createdAt: n.createdAt
        }));

        // Transform media
        const mediaData = activity.activityMedia.map(m => ({
            id: m.id,
            type: m.mediaType as 'photo' | 'video',
            url: m.mediaUrl,
            caption: m.caption || '',
            uploadedAt: m.uploadedAt
        }));

        // Transform completions
        const completionsData = activity.completions.map(c => ({
            id: c.id,
            activityId: c.activityId,
            completedAt: c.completedAt,
            duration: c.duration,
            notes: c.parentObservations || c.challengesFaced || ''
        }));

        res.json({
            success: true,
            data: {
                activity: activityData,
                notes: notesData,
                media: mediaData,
                completions: completionsData
            }
        });
    } catch (error) {
        console.error('Get activity details error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_ACTIVITY_DETAILS_FAILED',
                message: 'Failed to get activity details'
            }
        });
    }
};

/**
 * Add note to activity
 * POST /api/v1/parent/pep/:pepId/activities/:activityId/notes
 */
export const addActivityNote = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { pepId, activityId } = req.params;
        const { note } = req.body;

        if (!note) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Note text is required'
                }
            });
        }

        // Verify parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        // Verify PEP ownership
        const pep = await prisma.educationPlan.findUnique({
            where: { id: pepId },
            include: {
                person: {
                    include: {
                        parentViews: {
                            where: { parentId: user.parent.id }
                        }
                    }
                }
            }
        });

        if (!pep || pep.person.parentViews.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PEP_NOT_FOUND',
                    message: 'PEP not found or access denied'
                }
            });
        }

        const activity = await prisma.activity.findUnique({
            where: { id: activityId }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ACTIVITY_NOT_FOUND',
                    message: 'Activity not found'
                }
            });
        }

        const newNote = await prisma.activityNote.create({
            data: {
                activityId,
                note,
                createdBy: userId
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: newNote.id,
                text: newNote.note,
                createdAt: newNote.createdAt
            }
        });

    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_NOTE_FAILED',
                message: 'Failed to add note'
            }
        });
    }
};

/**
 * Delete activity note
 * DELETE /api/v1/parent/pep/:pepId/activities/:activityId/notes/:noteId
 */
export const deleteActivityNote = async (req: Request, res: Response) => {
    try {
        const { noteId } = req.params;
        await prisma.activityNote.delete({
            where: { id: noteId }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_NOTE_FAILED',
                message: 'Failed to delete note'
            }
        });
    }
};

/**
 * Upload activity media
 * POST /api/v1/parent/pep/:pepId/activities/:activityId/media
 */
export const uploadActivityMedia = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { activityId } = req.params;
        const { mediaType = 'photo', caption } = req.body;

        // Mocking file upload: using a placeholder URL
        const mediaUrl = 'https://ui-avatars.com/api/?name=IMG&background=random&size=400';

        const newMedia = await prisma.activityMedia.create({
            data: {
                activityId,
                mediaType,
                mediaUrl,
                caption,
                uploadedBy: userId,
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: newMedia.id,
                type: newMedia.mediaType,
                url: newMedia.mediaUrl,
                caption: newMedia.caption,
                createdAt: newMedia.uploadedAt
            }
        });

    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPLOAD_MEDIA_FAILED',
                message: 'Failed to upload media'
            }
        });
    }
};

/**
 * Delete activity media
 * DELETE /api/v1/parent/pep/:pepId/activities/:activityId/media/:mediaId
 */
export const deleteActivityMedia = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        await prisma.activityMedia.delete({
            where: { id: mediaId }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_MEDIA_FAILED',
                message: 'Failed to delete media'
            }
        });
    }
};
