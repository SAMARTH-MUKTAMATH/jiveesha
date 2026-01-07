import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { toSnakeCase } from '../utils/case-transformer';

const prisma = new PrismaClient();

// Create assessment
export const createAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const data = toSnakeCase(req.body);

        if (!data.person_id || !data.assessment_type) {
            throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
        }

        const assessment = await prisma.assessment.create({
            data: {
                personId: data.person_id,
                clinicianId: req.userId!,
                assessmentType: data.assessment_type,
                status: 'in_progress',
                responses: data.responses || '{}',
                currentDomain: data.current_domain,
                currentQuestion: data.current_question,
                totalQuestions: data.total_questions,
                administeredBy: req.userId!,
                administeredDate: new Date()
            },
            include: {
                person: { select: { id: true, firstName: true, lastName: true } }
            }
        });

        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        next(error);
    }
};

// Get assessments
export const getAssessments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { person_id, assessment_type, status } = req.query;

        const where: any = { clinicianId: req.userId };

        if (person_id) where.personId = person_id;
        if (assessment_type) where.assessmentType = assessment_type;
        if (status) where.status = status;

        const assessments = await prisma.assessment.findMany({
            where,
            include: {
                person: { select: { id: true, firstName: true, lastName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: assessments
        });
    } catch (error) {
        next(error);
    }
};

// Get single assessment
export const getAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const assessment = await prisma.assessment.findFirst({
            where: { id, clinicianId: req.userId },
            include: {
                person: { select: { id: true, firstName: true, lastName: true, dateOfBirth: true } },
                evidence: true
            }
        });

        if (!assessment) {
            throw new AppError('Assessment not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        next(error);
    }
};

// Update assessment
export const updateAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = toSnakeCase(req.body);

        const existing = await prisma.assessment.findFirst({
            where: { id, clinicianId: req.userId }
        });

        if (!existing) {
            throw new AppError('Assessment not found', 404, 'NOT_FOUND');
        }

        const assessment = await prisma.assessment.update({
            where: { id },
            data: {
                responses: data.responses,
                currentDomain: data.current_domain,
                currentQuestion: data.current_question,
                totalScore: data.total_score,
                domainScores: data.domain_scores,
                interpretation: data.interpretation,
                severityLevel: data.severity_level,
                dsm5Criteria: data.dsm5_criteria,
                recommendations: data.recommendations,
                duration: data.duration,
                status: data.status,
                completedAt: data.status === 'completed' ? new Date() : undefined
            },
            include: {
                person: { select: { firstName: true, lastName: true } }
            }
        });

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        next(error);
    }
};

// Delete assessment
export const deleteAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const existing = await prisma.assessment.findFirst({
            where: { id, clinicianId: req.userId }
        });

        if (!existing) {
            throw new AppError('Assessment not found', 404, 'NOT_FOUND');
        }

        await prisma.assessment.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Assessment deleted successfully' }
        });
    } catch (error) {
        next(error);
    }
};

// Upload evidence
export const uploadEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = toSnakeCase(req.body);

        const assessment = await prisma.assessment.findFirst({
            where: { id, clinicianId: req.userId }
        });

        if (!assessment) {
            throw new AppError('Assessment not found', 404, 'NOT_FOUND');
        }

        const evidence = await prisma.assessmentEvidence.create({
            data: {
                assessmentId: id,
                evidenceType: data.evidence_type,
                fileName: data.file_name,
                fileUrl: data.file_url,
                fileSize: data.file_size,
                description: data.description,
                timestamp: data.timestamp
            }
        });

        res.status(201).json({
            success: true,
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};
