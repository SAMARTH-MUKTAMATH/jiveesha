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
            personId,
            interventionName,
            interventionType,
            targetBehavior,
            goalStatement,
            startDate,
            endDate,
            frequency,
            duration,
            notes
        } = req.body;

        // Validate required fields
        if (!personId || !interventionName || !interventionType || !targetBehavior || !goalStatement || !startDate) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['personId, interventionName, interventionType, targetBehavior, goalStatement, and startDate are required']
                }
            });
        }

        const intervention = await prisma.intervention.create({
            data: {
                personId,
                clinicianId,
                interventionName,
                interventionType,
                targetBehavior,
                goalStatement,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                frequency,
                duration,
                notes,
                status: 'active',
                overallProgress: 0
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                strategies: true,
                progressRecords: true
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
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                },
                clinician: {
                    select: {
                        id: true,
                        clinicianProfile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                professionalTitle: true
                            }
                        }
                    }
                },
                strategies: true,
                progressRecords: {
                    orderBy: { recordDate: 'desc' },
                    take: 10
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
 * GET /api/v1/interventions/patient/:personId
 */
export const getPatientInterventions = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const { status } = req.query;

        const where: any = { personId };
        if (status) where.status = status as string;

        const interventions = await prisma.intervention.findMany({
            where,
            include: {
                strategies: true,
                progressRecords: {
                    orderBy: { recordDate: 'desc' },
                    take: 3
                },
                _count: {
                    select: {
                        strategies: true,
                        progressRecords: true
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

        // Remove fields that shouldn't be updated
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.personId;
        delete updateData.clinicianId;

        // Handle date fields
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        const intervention = await prisma.intervention.update({
            where: { id },
            data: updateData,
            include: {
                strategies: true,
                progressRecords: true
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

        await prisma.intervention.delete({
            where: { id }
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
        const { strategyName, description, implementation, expectedOutcome } = req.body;

        const strategy = await prisma.interventionStrategy.create({
            data: {
                interventionId,
                strategyName,
                description,
                implementation,
                expectedOutcome
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
        const clinicianId = (req as any).userId;
        const { id: interventionId } = req.params;
        const { progressPercentage, observations, dataPoints } = req.body;

        const progress = await prisma.interventionProgress.create({
            data: {
                interventionId,
                recordDate: new Date(),
                progressPercentage,
                observations,
                dataPoints,
                recordedBy: clinicianId
            }
        });

        // Update intervention overall progress
        await prisma.intervention.update({
            where: { id: interventionId },
            data: {
                overallProgress: progressPercentage,
                status: progressPercentage >= 100 ? 'completed' : 'active'
            }
        });

        res.status(201).json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Add progress update error:', error);
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

        const progress = await prisma.interventionProgress.findMany({
            where: { interventionId },
            orderBy: { recordDate: 'desc' }
        });

        res.json({
            success: true,
            data: progress
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
        const { status, notes } = req.body;

        const intervention = await prisma.intervention.update({
            where: { id },
            data: {
                status,
                notes: notes || undefined
            }
        });

        res.json({
            success: true,
            data: intervention
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
                strategies: true,
                progressRecords: {
                    orderBy: { recordDate: 'desc' }
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

        // Calculate statistics
        const progressRecords = intervention.progressRecords;
        const statistics = {
            totalProgressRecords: progressRecords.length,
            currentProgress: intervention.overallProgress,
            strategiesCount: intervention.strategies.length,
            progressTrend: progressRecords.length > 1
                ? progressRecords[0].progressPercentage - progressRecords[progressRecords.length - 1].progressPercentage
                : 0,
            averageProgress: progressRecords.length > 0
                ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / progressRecords.length)
                : 0,
            daysActive: Math.ceil((new Date().getTime() - intervention.startDate.getTime()) / (1000 * 60 * 60 * 24)),
            status: intervention.status
        };

        res.json({
            success: true,
            data: {
                interventionId: intervention.id,
                interventionName: intervention.interventionName,
                statistics
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_STATISTICS_FAILED',
                message: 'Failed to get statistics'
            }
        });
    }
};
