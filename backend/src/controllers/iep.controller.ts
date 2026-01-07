import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// PHASE 1-D1: IEP BUILDER FUNCTIONS
// Uses EducationPlan model with planType='IEP'
// ============================================

/**
 * Create new IEP
 * POST /api/v1/iep
 */
export const createIEP = async (req: Request, res: Response) => {
    try {
        const clinicianId = (req as any).userId;
        const {
            personId,
            planName,
            academicYear,
            focusAreas,
            startDate,
            endDate,
            nextReviewDate,
            description,
            notes
        } = req.body;

        // Validate required fields
        if (!personId || !planName || !startDate) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['personId, planName, and startDate are required']
                }
            });
        }

        const iep = await prisma.educationPlan.create({
            data: {
                personId,
                createdBy: clinicianId,
                createdByType: 'clinician',
                planType: 'IEP',
                planName,
                academicYear,
                focusAreas: JSON.stringify(focusAreas || []),
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
                description,
                notes,
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
                goals: true,
                accommodations: true,
                services: true,
                teamMembers: true
            }
        });

        res.status(201).json({
            success: true,
            data: iep
        });
    } catch (error) {
        console.error('Create IEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_IEP_FAILED',
                message: 'Failed to create IEP'
            }
        });
    }
};

/**
 * Get IEP by ID
 * GET /api/v1/iep/:id
 */
export const getIEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const iep = await prisma.educationPlan.findUnique({
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
                },
                accommodations: true,
                services: true,
                teamMembers: true
            }
        });

        if (!iep || iep.planType !== 'IEP') {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'IEP_NOT_FOUND',
                    message: 'IEP not found'
                }
            });
        }

        res.json({
            success: true,
            data: iep
        });
    } catch (error) {
        console.error('Get IEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_IEP_FAILED',
                message: 'Failed to retrieve IEP'
            }
        });
    }
};

/**
 * Get all IEPs for a patient
 * GET /api/v1/iep/patient/:personId
 */
export const getPatientIEPs = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const { status } = req.query;

        const where: any = { personId, planType: 'IEP' };
        if (status) where.status = status as string;

        const ieps = await prisma.educationPlan.findMany({
            where,
            include: {
                goals: {
                    select: {
                        id: true,
                        goalStatement: true,
                        currentProgress: true,
                        progressStatus: true
                    }
                },
                accommodations: true,
                services: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: ieps
        });
    } catch (error) {
        console.error('Get patient IEPs error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_IEPS_FAILED',
                message: 'Failed to retrieve IEPs'
            }
        });
    }
};

/**
 * Update IEP
 * PUT /api/v1/iep/:id
 */
export const updateIEP = async (req: Request, res: Response) => {
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
        if (updateData.nextReviewDate) updateData.nextReviewDate = new Date(updateData.nextReviewDate);
        if (updateData.lastReviewDate) updateData.lastReviewDate = new Date(updateData.lastReviewDate);

        const iep = await prisma.educationPlan.update({
            where: { id },
            data: updateData,
            include: {
                goals: true,
                accommodations: true,
                services: true
            }
        });

        res.json({
            success: true,
            data: iep
        });
    } catch (error) {
        console.error('Update IEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_IEP_FAILED',
                message: 'Failed to update IEP'
            }
        });
    }
};

/**
 * Delete IEP
 * DELETE /api/v1/iep/:id
 */
export const deleteIEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.educationPlan.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'IEP deleted successfully'
        });
    } catch (error) {
        console.error('Delete IEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_IEP_FAILED',
                message: 'Failed to delete IEP'
            }
        });
    }
};

/**
 * Add goal to IEP
 * POST /api/v1/iep/:id/goals
 */
export const addGoal = async (req: Request, res: Response) => {
    try {
        const { id: planId } = req.params;
        const {
            goalNumber,
            domain,
            priority,
            goalStatement,
            baselineData,
            targetCriteria,
            targetDate,
            measurementMethod,
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
                domain,
                priority,
                goalStatement,
                baselineData,
                targetCriteria,
                targetDate: targetDate ? new Date(targetDate) : null,
                measurementMethod,
                milestones: JSON.stringify(milestones || []),
                currentProgress: 0,
                progressStatus: 'not_started'
            },
            include: {
                objectives: true,
                progressUpdates: true
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
 * Update goal
 * PUT /api/v1/iep/goals/:goalId
 */
export const updateGoal = async (req: Request, res: Response) => {
    try {
        const { goalId } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.planId;
        delete updateData.createdAt;

        if (updateData.milestones) {
            updateData.milestones = JSON.stringify(updateData.milestones);
        }
        if (updateData.targetDate) {
            updateData.targetDate = new Date(updateData.targetDate);
        }

        const goal = await prisma.educationGoal.update({
            where: { id: goalId },
            data: updateData,
            include: {
                objectives: true,
                progressUpdates: true
            }
        });

        res.json({
            success: true,
            data: goal
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_GOAL_FAILED',
                message: 'Failed to update goal'
            }
        });
    }
};

/**
 * Delete goal
 * DELETE /api/v1/iep/goals/:goalId
 */
export const deleteGoal = async (req: Request, res: Response) => {
    try {
        const { goalId } = req.params;

        await prisma.educationGoal.delete({
            where: { id: goalId }
        });

        res.json({
            success: true,
            message: 'Goal deleted successfully'
        });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_GOAL_FAILED',
                message: 'Failed to delete goal'
            }
        });
    }
};

/**
 * Add progress update to goal
 * POST /api/v1/iep/goals/:goalId/progress
 */
export const addGoalProgress = async (req: Request, res: Response) => {
    try {
        const clinicianId = (req as any).userId;
        const { goalId } = req.params;
        const {
            progressValue,
            progressNote,
            dataCollected,
            nextSteps
        } = req.body;

        const progress = await prisma.goalProgressUpdate.create({
            data: {
                goalId,
                updateDate: new Date(),
                updatedBy: clinicianId,
                updatedByType: 'clinician',
                progressPercentage: progressValue,
                status: progressValue >= 100 ? 'completed' : 'in_progress',
                notes: progressNote,
                evidence: dataCollected
            }
        });

        // Update goal's current progress
        await prisma.educationGoal.update({
            where: { id: goalId },
            data: {
                currentProgress: progressValue,
                progressStatus: progressValue >= 100 ? 'completed' : 'in_progress'
            }
        });

        res.status(201).json({
            success: true,
            data: progress
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
 * Add accommodation to IEP
 * POST /api/v1/iep/:id/accommodations
 */
export const addAccommodation = async (req: Request, res: Response) => {
    try {
        const { id: planId } = req.params;
        const { category, accommodationText, frequency } = req.body;

        const accommodation = await prisma.accommodation.create({
            data: {
                planId,
                category,
                accommodationText,
                frequency
            }
        });

        res.status(201).json({
            success: true,
            data: accommodation
        });
    } catch (error) {
        console.error('Add accommodation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_ACCOMMODATION_FAILED',
                message: 'Failed to add accommodation'
            }
        });
    }
};

/**
 * Delete accommodation
 * DELETE /api/v1/iep/accommodations/:accommodationId
 */
export const deleteAccommodation = async (req: Request, res: Response) => {
    try {
        const { accommodationId } = req.params;

        await prisma.accommodation.delete({
            where: { id: accommodationId }
        });

        res.json({
            success: true,
            message: 'Accommodation deleted successfully'
        });
    } catch (error) {
        console.error('Delete accommodation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_ACCOMMODATION_FAILED',
                message: 'Failed to delete accommodation'
            }
        });
    }
};

/**
 * Sign IEP (parent or clinician)
 * POST /api/v1/iep/:id/sign
 */
export const signIEP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { signerType } = req.body;
        const userId = (req as any).userId;

        const updateData: any = {};

        if (signerType === 'parent') {
            updateData.signedByParent = true;
            updateData.parentSignedAt = new Date();
        } else if (signerType === 'clinician') {
            updateData.signedByClinician = true;
            updateData.clinicianSignedAt = new Date();
        }

        const iep = await prisma.educationPlan.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            data: iep,
            message: `IEP signed by ${signerType} successfully`
        });
    } catch (error) {
        console.error('Sign IEP error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SIGN_IEP_FAILED',
                message: 'Failed to sign IEP'
            }
        });
    }
};

/**
 * Get IEP overview/summary
 * GET /api/v1/iep/:id/summary
 */
export const getIEPSummary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const iep = await prisma.educationPlan.findUnique({
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
                    select: {
                        id: true,
                        domain: true,
                        goalStatement: true,
                        currentProgress: true,
                        progressStatus: true
                    }
                },
                accommodations: true,
                services: true,
                teamMembers: true
            }
        });

        if (!iep || iep.planType !== 'IEP') {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'IEP_NOT_FOUND',
                    message: 'IEP not found'
                }
            });
        }

        // Calculate summary statistics
        const goals = iep.goals as any[];
        const goalStats = {
            total: goals.length,
            completed: goals.filter((g: any) => g.progressStatus === 'completed').length,
            inProgress: goals.filter((g: any) => g.progressStatus === 'in_progress').length,
            notStarted: goals.filter((g: any) => g.progressStatus === 'not_started').length,
            avgProgress: goals.length > 0
                ? Math.round(goals.reduce((sum: number, g: any) => sum + g.currentProgress, 0) / goals.length)
                : 0
        };

        res.json({
            success: true,
            data: {
                ...iep,
                statistics: {
                    goals: goalStats,
                    accommodations: iep.accommodations.length,
                    services: iep.services.length,
                    teamMembers: iep.teamMembers.length
                }
            }
        });
    } catch (error) {
        console.error('Get IEP summary error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_SUMMARY_FAILED',
                message: 'Failed to get IEP summary'
            }
        });
    }
};

// ============================================
// PHASE 1-D2: IEP SERVICES & TEAM FUNCTIONS
// ============================================

/**
 * Add service to IEP
 * POST /api/v1/iep/:id/services
 */
export const addService = async (req: Request, res: Response) => {
    try {
        const { id: planId } = req.params;
        const {
            serviceType,
            provider,
            frequency,
            duration,
            location,
            startDate,
            endDate,
            notes
        } = req.body;

        const service = await prisma.service.create({
            data: {
                planId,
                serviceName: serviceType,
                serviceType,
                provider,
                frequency,
                duration,
                setting: location || 'default',
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : new Date()
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
        delete updateData.planId;
        delete updateData.createdAt;

        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        const service = await prisma.service.update({
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

        await prisma.service.delete({
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
        const { sessionDate, notes, status } = req.body;

        // Update service sessions completed
        const service = await prisma.service.update({
            where: { id: serviceId },
            data: {
                sessionsCompleted: { increment: 1 }
            }
        });

        res.json({
            success: true,
            data: service,
            message: 'Service session recorded'
        });
    } catch (error) {
        console.error('Record service session error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'RECORD_SESSION_FAILED',
                message: 'Failed to record service session'
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
        const { id: planId } = req.params;
        const { name, role, email, phone, organization, isPrimary } = req.body;

        const member = await prisma.teamMember.create({
            data: {
                planId,
                memberType: 'team',
                name,
                role,
                email,
                phone,
                organization
            }
        });

        res.status(201).json({
            success: true,
            data: member
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
        delete updateData.planId;
        delete updateData.createdAt;

        const member = await prisma.teamMember.update({
            where: { id: memberId },
            data: updateData
        });

        res.json({
            success: true,
            data: member
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

        await prisma.teamMember.delete({
            where: { id: memberId }
        });

        res.json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_TEAM_MEMBER_FAILED',
                message: 'Failed to delete team member'
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

        const member = await prisma.teamMember.update({
            where: { id: memberId },
            data: {
                signed: true,
                signedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: member,
            message: 'Team member signed successfully'
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
        const { id } = req.params;
        const clinicianId = (req as any).userId;
        const { reportingPeriod, summary, recommendations } = req.body;

        // Get IEP with goals for report
        const iep = await prisma.educationPlan.findUnique({
            where: { id },
            include: {
                goals: {
                    select: {
                        id: true,
                        domain: true,
                        goalStatement: true,
                        currentProgress: true,
                        progressStatus: true
                    }
                },
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
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

        // Create report in reports table
        const report = await prisma.report.create({
            data: {
                personId: iep.personId,
                clinicianId,
                reportType: 'IEP_PROGRESS',
                title: `IEP Progress Report - ${reportingPeriod}`,
                reportDate: new Date(),
                reportingPeriod,
                summary: summary || `Progress report for ${iep.person.firstName} ${iep.person.lastName}`,
                recommendations,
                status: 'draft'
            }
        });

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Create progress report error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_REPORT_FAILED',
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
        const { id } = req.params;

        // Get IEP to find personId
        const iep = await prisma.educationPlan.findUnique({
            where: { id },
            select: { personId: true }
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

        const reports = await prisma.report.findMany({
            where: {
                personId: iep.personId,
                reportType: 'IEP_PROGRESS'
            },
            orderBy: { createdAt: 'desc' }
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
                code: 'GET_REPORTS_FAILED',
                message: 'Failed to get progress reports'
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

        const iep = await prisma.educationPlan.findUnique({
            where: { id },
            include: {
                goals: {
                    include: {
                        progressUpdates: true
                    }
                },
                accommodations: true,
                services: true,
                teamMembers: true
            }
        });

        if (!iep || iep.planType !== 'IEP') {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'IEP_NOT_FOUND',
                    message: 'IEP not found'
                }
            });
        }

        // Calculate statistics
        const statistics = {
            goals: {
                total: iep.goals.length,
                completed: iep.goals.filter(g => g.progressStatus === 'completed').length,
                inProgress: iep.goals.filter(g => g.progressStatus === 'in_progress').length,
                notStarted: iep.goals.filter(g => g.progressStatus === 'not_started').length,
                averageProgress: iep.goals.length > 0
                    ? Math.round(iep.goals.reduce((sum, g) => sum + g.currentProgress, 0) / iep.goals.length)
                    : 0,
                byDomain: iep.goals.reduce((acc: Record<string, number>, g) => {
                    acc[g.domain] = (acc[g.domain] || 0) + 1;
                    return acc;
                }, {})
            },
            accommodations: {
                total: iep.accommodations.length
            },
            services: {
                total: iep.services.length
            },
            team: {
                total: iep.teamMembers.length,
                signed: iep.teamMembers.filter(m => m.signed).length
            },
            signatures: {
                parentSigned: iep.signedByParent,
                clinicianSigned: iep.signedByClinician,
                fullyExecuted: iep.signedByParent && iep.signedByClinician
            }
        };

        res.json({
            success: true,
            data: {
                iepId: iep.id,
                planName: iep.planName,
                status: iep.status,
                overallProgress: iep.overallProgress,
                statistics
            }
        });
    } catch (error) {
        console.error('Get IEP statistics error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_STATISTICS_FAILED',
                message: 'Failed to get IEP statistics'
            }
        });
    }
};
