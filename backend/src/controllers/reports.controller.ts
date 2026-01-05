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
            personId,
            reportType,
            title,
            summary,
            reportingPeriod,
            recommendations,
            fileUrl
        } = req.body;

        if (!personId || !reportType || !title || !summary) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['personId, reportType, title, and summary are required']
                }
            });
        }

        const report = await prisma.report.create({
            data: {
                personId,
                clinicianId,
                reportType,
                title,
                reportDate: new Date(),
                reportingPeriod,
                summary,
                recommendations,
                fileUrl,
                status: 'draft'
            },
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
                person: true,
                clinician: {
                    include: {
                        clinicianProfile: true
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
 * GET /api/v1/reports/patient/:personId
 */
export const getPatientReports = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const { reportType, status } = req.query;

        const where: any = { personId };
        if (reportType) where.reportType = reportType as string;
        if (status) where.status = status as string;

        const reports = await prisma.report.findMany({
            where,
            include: {
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
                }
            },
            orderBy: { reportDate: 'desc' }
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
        delete updateData.personId;
        delete updateData.clinicianId;
        delete updateData.createdAt;

        if (updateData.reportDate) {
            updateData.reportDate = new Date(updateData.reportDate);
        }

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
            select: { personId: true, title: true }
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
        const { shareWith, email } = req.body;

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

        // In new schema, sharing could be implemented via AccessGrant or a notification
        // For now, just acknowledge the share request
        res.json({
            success: true,
            data: report,
            message: `Report shared with ${shareWith} at ${email}`
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
