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
                metadata: JSON.stringify({ reportId: report.id }),
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

        // Parse existing shared data (stored as JSON strings in SQLite)
        const sharedWith = report.sharedWith ? JSON.parse(report.sharedWith as string) : [];
        const shareLog = report.shareLog ? JSON.parse(report.shareLog as string) : [];

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
                sharedWith: JSON.stringify(sharedWith),
                shareLog: JSON.stringify(shareLog)
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
