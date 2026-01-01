import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// PHASE 1-D1: IEP BUILDER FUNCTIONS
// ============================================

/**
 * Create new IEP
 * POST /api/v1/iep
 */
export const createIEP = async (req: Request, res: Response) => {
    try {
        const {
            patientId,
            academicYear,
            startDate,
            endDate,
            academicPerformance,
            functionalPerformance,
            strengths,
            concerns,
            impactOfDisability,
            placementType,
            placementPercentage,
            placementJustification,
            lreJustification,
            schoolName,
            grade,
            teacher
        } = req.body;

        // Validate required fields
        if (!patientId || !academicYear || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['patientId, academicYear, startDate, and endDate are required']
                }
            });
        }

        // Create IEP
        const iep = await prisma.iEP.create({
            data: {
                patientId,
                academicYear,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                academicPerformance,
                functionalPerformance,
                strengths,
                concerns,
                impactOfDisability,
                placementType,
                placementPercentage,
                placementJustification,
                lreJustification,
                schoolName,
                grade,
                teacher,
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
                activityType: 'iep_created',
                description: `IEP created for ${academicYear}`,
                metadata: JSON.stringify({ iepId: iep.id }),
                createdBy: (req as any).userId
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

        const iep = await prisma.iEP.findUnique({
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
                goals: {
                    include: {
                        objectives: true,
                        progressUpdates: {
                            orderBy: { updateDate: 'desc' },
                            take: 5
                        }
                    },
                    orderBy: { goalNumber: 'asc' }
                },
                accommodations: true,
                services: true,
                teamMembers: true,
                progressReports: {
                    orderBy: { reportDate: 'desc' }
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
 * GET /api/v1/iep/patient/:patientId
 */
export const getPatientIEPs = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;

        const where: any = { patientId };
        if (status) where.status = status as string;

        const ieps = await prisma.iEP.findMany({
            where,
            include: {
                goals: {
                    select: {
                        id: true,
                        goalNumber: true,
                        domain: true,
                        currentProgress: true
                    }
                },
                _count: {
                    select: {
                        goals: true,
                        services: true,
                        accommodations: true
                    }
                }
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

        // Remove fields that shouldn't be updated directly
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.patientId;

        // Convert date strings to Date objects
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
        if (updateData.nextReviewDate) updateData.nextReviewDate = new Date(updateData.nextReviewDate);

        const iep = await prisma.iEP.update({
            where: { id },
            data: updateData,
            include: {
                goals: true,
                accommodations: true,
                services: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: iep.patientId,
                activityType: 'iep_updated',
                description: 'IEP updated',
                metadata: JSON.stringify({ iepId: iep.id }),
                createdBy: (req as any).userId
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

        // Get IEP for logging
        const iep = await prisma.iEP.findUnique({
            where: { id },
            select: { patientId: true, academicYear: true }
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

        // Delete (cascades to goals, accommodations, services, team members, progress reports)
        await prisma.iEP.delete({
            where: { id }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: iep.patientId,
                activityType: 'iep_deleted',
                description: `IEP for ${iep.academicYear} deleted`,
                createdBy: (req as any).userId
            }
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
        const { id: iepId } = req.params;
        const {
            goalNumber,
            domain,
            priority,
            goalStatement,
            baselineData,
            targetCriteria,
            targetDate,
            measurementMethod,
            objectives
        } = req.body;

        const goal = await prisma.iEPGoal.create({
            data: {
                iepId,
                goalNumber,
                domain,
                priority,
                goalStatement,
                baselineData,
                targetCriteria,
                targetDate: targetDate ? new Date(targetDate) : null,
                measurementMethod,
                objectives: {
                    create: objectives?.map((obj: any, index: number) => ({
                        objectiveNumber: index + 1,
                        objectiveText: obj.text,
                        criteria: obj.criteria,
                        targetDate: obj.targetDate ? new Date(obj.targetDate) : null
                    })) || []
                }
            },
            include: {
                objectives: true
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
        delete updateData.iepId;
        delete updateData.createdAt;

        if (updateData.targetDate) {
            updateData.targetDate = new Date(updateData.targetDate);
        }

        const goal = await prisma.iEPGoal.update({
            where: { id: goalId },
            data: updateData,
            include: {
                objectives: true
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

        await prisma.iEPGoal.delete({
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
        const { goalId } = req.params;
        const userId = (req as any).userId;
        const {
            updateDate,
            progressPercentage,
            status,
            notes,
            evidence
        } = req.body;

        const progressUpdate = await prisma.goalProgressUpdate.create({
            data: {
                goalId,
                updateDate: new Date(updateDate),
                progressPercentage,
                status,
                notes,
                evidence,
                updatedBy: userId
            }
        });

        // Update goal's current progress
        await prisma.iEPGoal.update({
            where: { id: goalId },
            data: {
                currentProgress: progressPercentage,
                progressStatus: status
            }
        });

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
 * Add accommodation to IEP
 * POST /api/v1/iep/:id/accommodations
 */
export const addAccommodation = async (req: Request, res: Response) => {
    try {
        const { id: iepId } = req.params;
        const { category, accommodationText, frequency } = req.body;

        const accommodation = await prisma.iEPAccommodation.create({
            data: {
                iepId,
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

        await prisma.iEPAccommodation.delete({
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
        const { signerType, signature } = req.body; // signerType: 'parent' or 'clinician'

        if (!['parent', 'clinician'].includes(signerType)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_SIGNER_TYPE',
                    message: 'signerType must be either "parent" or "clinician"'
                }
            });
        }

        const updateData: any = {};
        if (signerType === 'parent') {
            updateData.signedByParent = true;
            updateData.parentSignedAt = new Date();
            updateData.parentSignature = signature;
        } else {
            updateData.signedByClinician = true;
            updateData.clinicianSignedAt = new Date();
            updateData.clinicianSignature = signature;
        }

        const iep = await prisma.iEP.update({
            where: { id },
            data: updateData
        });

        // Check if both signed, then activate
        if (iep.signedByParent && iep.signedByClinician && iep.status === 'draft') {
            await prisma.iEP.update({
                where: { id },
                data: { status: 'active' }
            });
        }

        res.json({
            success: true,
            data: iep,
            message: `IEP signed by ${signerType}`
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

        const iep = await prisma.iEP.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                },
                goals: {
                    select: {
                        id: true,
                        domain: true,
                        currentProgress: true,
                        progressStatus: true
                    }
                },
                _count: {
                    select: {
                        goals: true,
                        accommodations: true,
                        services: true,
                        teamMembers: true
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

        // Calculate overall progress
        const totalProgress = iep.goals.reduce((sum, goal) => sum + goal.currentProgress, 0);
        const avgProgress = iep.goals.length > 0 ? Math.round(totalProgress / iep.goals.length) : 0;

        const summary = {
            id: iep.id,
            academicYear: iep.academicYear,
            status: iep.status,
            patient: iep.patient,
            startDate: iep.startDate,
            endDate: iep.endDate,
            overallProgress: avgProgress,
            counts: {
                goals: iep._count.goals,
                accommodations: iep._count.accommodations,
                services: iep._count.services,
                teamMembers: iep._count.teamMembers
            },
            signatures: {
                parent: iep.signedByParent,
                clinician: iep.signedByClinician
            },
            goalsByDomain: iep.goals.reduce((acc: any, goal) => {
                if (!acc[goal.domain]) acc[goal.domain] = [];
                acc[goal.domain].push({
                    id: goal.id,
                    progress: goal.currentProgress,
                    status: goal.progressStatus
                });
                return acc;
            }, {})
        };

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_SUMMARY_FAILED',
                message: 'Failed to get summary'
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
        const { id: iepId } = req.params;
        const {
            serviceName,
            provider,
            frequency,
            duration,
            serviceType,
            setting,
            startDate,
            endDate,
            totalSessionsPlanned
        } = req.body;

        const service = await prisma.iEPService.create({
            data: {
                iepId,
                serviceName,
                provider,
                frequency,
                duration,
                serviceType,
                setting,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalSessionsPlanned
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
        delete updateData.iepId;

        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        const service = await prisma.iEPService.update({
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

        await prisma.iEPService.delete({
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

        const service = await prisma.iEPService.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'SERVICE_NOT_FOUND',
                    message: 'Service not found'
                }
            });
        }

        // Increment sessions completed
        const updatedService = await prisma.iEPService.update({
            where: { id: serviceId },
            data: {
                sessionsCompleted: service.sessionsCompleted + 1
            }
        });

        res.json({
            success: true,
            data: updatedService,
            message: 'Session recorded'
        });
    } catch (error) {
        console.error('Record session error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'RECORD_SESSION_FAILED',
                message: 'Failed to record session'
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
        const { id: iepId } = req.params;
        const {
            memberType,
            name,
            role,
            email,
            phone,
            organization
        } = req.body;

        const teamMember = await prisma.iEPTeamMember.create({
            data: {
                iepId,
                memberType,
                name,
                role,
                email,
                phone,
                organization
            }
        });

        res.status(201).json({
            success: true,
            data: teamMember
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
        delete updateData.iepId;

        const teamMember = await prisma.iEPTeamMember.update({
            where: { id: memberId },
            data: updateData
        });

        res.json({
            success: true,
            data: teamMember
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

        await prisma.iEPTeamMember.delete({
            where: { id: memberId }
        });

        res.json({
            success: true,
            message: 'Team member removed successfully'
        });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_TEAM_MEMBER_FAILED',
                message: 'Failed to remove team member'
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
        const { signature } = req.body;

        const teamMember = await prisma.iEPTeamMember.update({
            where: { id: memberId },
            data: {
                signed: true,
                signedAt: new Date(),
                signature
            }
        });

        res.json({
            success: true,
            data: teamMember,
            message: 'Team member signed'
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
        const { id: iepId } = req.params;
        const userId = (req as any).userId;
        const {
            reportDate,
            reportingPeriod,
            overallProgress,
            summary
        } = req.body;

        const progressReport = await prisma.iEPProgressReport.create({
            data: {
                iepId,
                reportDate: new Date(reportDate),
                reportingPeriod,
                overallProgress,
                summary,
                createdBy: userId
            }
        });

        // Update IEP overall progress
        await prisma.iEP.update({
            where: { id: iepId },
            data: {
                overallProgress,
                lastReviewDate: new Date(reportDate)
            }
        });

        res.status(201).json({
            success: true,
            data: progressReport
        });
    } catch (error) {
        console.error('Create progress report error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_PROGRESS_REPORT_FAILED',
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
        const { id: iepId } = req.params;

        const reports = await prisma.iEPProgressReport.findMany({
            where: { iepId },
            orderBy: { reportDate: 'desc' }
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
                code: 'GET_PROGRESS_REPORTS_FAILED',
                message: 'Failed to retrieve progress reports'
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

        const iep = await prisma.iEP.findUnique({
            where: { id },
            include: {
                goals: {
                    include: {
                        progressUpdates: true
                    }
                },
                services: true,
                progressReports: {
                    orderBy: { reportDate: 'desc' }
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

        // Calculate statistics
        const totalGoals = iep.goals.length;
        const goalsAchieved = iep.goals.filter(g => g.progressStatus === 'achieved').length;
        const goalsInProgress = iep.goals.filter(g => g.progressStatus === 'in_progress').length;
        const goalsNotStarted = iep.goals.filter(g => g.progressStatus === 'not_started').length;

        const avgProgress = totalGoals > 0
            ? Math.round(iep.goals.reduce((sum, g) => sum + g.currentProgress, 0) / totalGoals)
            : 0;

        const totalServices = iep.services.length;
        const totalSessionsCompleted = iep.services.reduce((sum, s) => sum + s.sessionsCompleted, 0);
        const totalSessionsPlanned = iep.services.reduce((sum, s) => sum + (s.totalSessionsPlanned || 0), 0);

        const statistics = {
            iepId: iep.id,
            goals: {
                total: totalGoals,
                achieved: goalsAchieved,
                inProgress: goalsInProgress,
                notStarted: goalsNotStarted,
                averageProgress: avgProgress
            },
            services: {
                total: totalServices,
                sessionsCompleted: totalSessionsCompleted,
                sessionsPlanned: totalSessionsPlanned,
                completionRate: totalSessionsPlanned > 0
                    ? Math.round((totalSessionsCompleted / totalSessionsPlanned) * 100)
                    : 0
            },
            progressReports: {
                total: iep.progressReports.length,
                latest: iep.progressReports[0] || null
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
