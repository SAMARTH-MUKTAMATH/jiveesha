import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create intervention plan
 * POST /api/v1/interventions
 */
export const createIntervention = async (req: Request, res: Response) => {
    try {
        const clinicianId = (req as any).userId;
        const {
            patientId,
            interventionName,
            protocol,
            focus,
            targetBehaviors,
            frequency,
            duration,
            totalSessions,
            provider,
            providerRole,
            startDate,
            endDate,
            targetCompletionDate,
            linkedIEPGoalId,
            strategies
        } = req.body;

        // Validate required fields
        if (!patientId || !interventionName || !focus || !startDate) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['patientId, interventionName, focus, and startDate are required']
                }
            });
        }

        // Create intervention with strategies
        const intervention = await prisma.intervention.create({
            data: {
                patientId,
                clinicianId,
                interventionName,
                protocol,
                focus,
                targetBehaviors,
                frequency,
                duration,
                totalSessions,
                provider,
                providerRole,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate) : null,
                linkedIEPGoalId,
                status: 'active',
                strategies: {
                    create: strategies?.map((s: any) => ({
                        strategyName: s.name,
                        strategyText: s.text,
                        implementation: s.implementation,
                        frequency: s.frequency
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
                strategies: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId,
                activityType: 'intervention_created',
                description: `Intervention plan created: ${interventionName}`,
                metadata: JSON.stringify({ interventionId: intervention.id }),
                createdBy: clinicianId
            }
        });

        res.status(201).json({
            success: true,
            data: intervention
        });
    } catch (error) {
        console.error('Create intervention error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_INTERVENTION_FAILED',
                message: 'Failed to create intervention'
            }
        });
    }
};

/**
 * Get intervention by ID
 * GET /api/v1/interventions/:id
 */
export const getIntervention = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const intervention = await prisma.intervention.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
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
                },
                strategies: true,
                progressTracking: {
                    orderBy: { updateDate: 'desc' },
                    take: 20
                }
            }
        });

        if (!intervention) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INTERVENTION_NOT_FOUND',
                    message: 'Intervention not found'
                }
            });
        }

        res.json({
            success: true,
            data: intervention
        });
    } catch (error) {
        console.error('Get intervention error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_INTERVENTION_FAILED',
                message: 'Failed to retrieve intervention'
            }
        });
    }
};

/**
 * Get all interventions for a patient
 * GET /api/v1/interventions/patient/:patientId
 */
export const getPatientInterventions = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;

        const where: any = { patientId };
        if (status) where.status = status as string;

        const interventions = await prisma.intervention.findMany({
            where,
            include: {
                strategies: true,
                progressTracking: {
                    orderBy: { updateDate: 'desc' },
                    take: 1
                },
                _count: {
                    select: {
                        progressTracking: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: interventions
        });
    } catch (error) {
        console.error('Get patient interventions error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_INTERVENTIONS_FAILED',
                message: 'Failed to retrieve interventions'
            }
        });
    }
};

/**
 * Update intervention
 * PUT /api/v1/interventions/:id
 */
export const updateIntervention = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.patientId;
        delete updateData.clinicianId;

        // Convert dates
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
        if (updateData.targetCompletionDate) updateData.targetCompletionDate = new Date(updateData.targetCompletionDate);

        const intervention = await prisma.intervention.update({
            where: { id },
            data: updateData,
            include: {
                strategies: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: intervention.patientId,
                activityType: 'intervention_updated',
                description: `Intervention updated: ${intervention.interventionName}`,
                metadata: JSON.stringify({ interventionId: intervention.id }),
                createdBy: (req as any).userId
            }
        });

        res.json({
            success: true,
            data: intervention
        });
    } catch (error) {
        console.error('Update intervention error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_INTERVENTION_FAILED',
                message: 'Failed to update intervention'
            }
        });
    }
};

/**
 * Delete intervention
 * DELETE /api/v1/interventions/:id
 */
export const deleteIntervention = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const intervention = await prisma.intervention.findUnique({
            where: { id },
            select: { patientId: true, interventionName: true }
        });

        if (!intervention) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INTERVENTION_NOT_FOUND',
                    message: 'Intervention not found'
                }
            });
        }

        await prisma.intervention.delete({
            where: { id }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: intervention.patientId,
                activityType: 'intervention_deleted',
                description: `Intervention deleted: ${intervention.interventionName}`,
                createdBy: (req as any).userId
            }
        });

        res.json({
            success: true,
            message: 'Intervention deleted successfully'
        });
    } catch (error) {
        console.error('Delete intervention error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_INTERVENTION_FAILED',
                message: 'Failed to delete intervention'
            }
        });
    }
};

/**
 * Add strategy to intervention
 * POST /api/v1/interventions/:id/strategies
 */
export const addStrategy = async (req: Request, res: Response) => {
    try {
        const { id: interventionId } = req.params;
        const { strategyName, strategyText, implementation, frequency } = req.body;

        const strategy = await prisma.interventionStrategy.create({
            data: {
                interventionId,
                strategyName,
                strategyText,
                implementation,
                frequency
            }
        });

        res.status(201).json({
            success: true,
            data: strategy
        });
    } catch (error) {
        console.error('Add strategy error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_STRATEGY_FAILED',
                message: 'Failed to add strategy'
            }
        });
    }
};

/**
 * Update strategy
 * PUT /api/v1/interventions/strategies/:strategyId
 */
export const updateStrategy = async (req: Request, res: Response) => {
    try {
        const { strategyId } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.interventionId;

        const strategy = await prisma.interventionStrategy.update({
            where: { id: strategyId },
            data: updateData
        });

        res.json({
            success: true,
            data: strategy
        });
    } catch (error) {
        console.error('Update strategy error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_STRATEGY_FAILED',
                message: 'Failed to update strategy'
            }
        });
    }
};

/**
 * Delete strategy
 * DELETE /api/v1/interventions/strategies/:strategyId
 */
export const deleteStrategy = async (req: Request, res: Response) => {
    try {
        const { strategyId } = req.params;

        await prisma.interventionStrategy.delete({
            where: { id: strategyId }
        });

        res.json({
            success: true,
            message: 'Strategy deleted successfully'
        });
    } catch (error) {
        console.error('Delete strategy error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_STRATEGY_FAILED',
                message: 'Failed to delete strategy'
            }
        });
    }
};

/**
 * Add progress update
 * POST /api/v1/interventions/:id/progress
 */
export const addProgressUpdate = async (req: Request, res: Response) => {
    try {
        const { id: interventionId } = req.params;
        const userId = (req as any).userId;
        const {
            updateDate,
            progressNote,
            sessionCount,
            dataPoints,
            attachments
        } = req.body;

        const progressUpdate = await prisma.interventionProgress.create({
            data: {
                interventionId,
                updateDate: new Date(updateDate),
                progressNote,
                sessionCount,
                dataPoints,
                attachments,
                updatedBy: userId
            }
        });

        // Update intervention sessions completed
        if (sessionCount) {
            await prisma.intervention.update({
                where: { id: interventionId },
                data: {
                    sessionsCompleted: sessionCount
                }
            });
        }

        res.status(201).json({
            success: true,
            data: progressUpdate
        });
    } catch (error) {
        console.error('Add progress error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_PROGRESS_FAILED',
                message: 'Failed to add progress update'
            }
        });
    }
};

/**
 * Get progress timeline for intervention
 * GET /api/v1/interventions/:id/progress
 */
export const getProgressTimeline = async (req: Request, res: Response) => {
    try {
        const { id: interventionId } = req.params;

        const progressUpdates = await prisma.interventionProgress.findMany({
            where: { interventionId },
            orderBy: { updateDate: 'asc' }
        });

        res.json({
            success: true,
            data: progressUpdates
        });
    } catch (error) {
        console.error('Get progress timeline error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PROGRESS_FAILED',
                message: 'Failed to retrieve progress timeline'
            }
        });
    }
};

/**
 * Update intervention status
 * PUT /api/v1/interventions/:id/status
 */
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['active', 'paused', 'completed', 'discontinued'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_STATUS',
                    message: 'Invalid status value',
                    details: [`Must be one of: ${validStatuses.join(', ')}`]
                }
            });
        }

        const intervention = await prisma.intervention.update({
            where: { id },
            data: {
                status,
                endDate: status === 'completed' || status === 'discontinued' ? new Date() : undefined
            }
        });

        res.json({
            success: true,
            data: intervention,
            message: `Intervention status updated to ${status}`
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_STATUS_FAILED',
                message: 'Failed to update status'
            }
        });
    }
};

/**
 * Get intervention statistics
 * GET /api/v1/interventions/:id/statistics
 */
export const getInterventionStatistics = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const intervention = await prisma.intervention.findUnique({
            where: { id },
            include: {
                progressTracking: {
                    orderBy: { updateDate: 'asc' }
                }
            }
        });

        if (!intervention) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INTERVENTION_NOT_FOUND',
                    message: 'Intervention not found'
                }
            });
        }

        const totalUpdates = intervention.progressTracking.length;
        const completionRate = intervention.totalSessions
            ? Math.round((intervention.sessionsCompleted / intervention.totalSessions) * 100)
            : 0;

        // Calculate days active
        const startDate = new Date(intervention.startDate);
        const endDate = intervention.endDate ? new Date(intervention.endDate) : new Date();
        const daysActive = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        const statistics = {
            interventionId: intervention.id,
            status: intervention.status,
            sessions: {
                completed: intervention.sessionsCompleted,
                total: intervention.totalSessions,
                completionRate
            },
            timeline: {
                startDate: intervention.startDate,
                endDate: intervention.endDate,
                targetCompletion: intervention.targetCompletionDate,
                daysActive
            },
            progress: {
                totalUpdates,
                overallProgress: intervention.overallProgress
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
