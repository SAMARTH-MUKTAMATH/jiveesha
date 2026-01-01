import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Start a new assessment
 * POST /api/v1/assessments
 */
export const startAssessment = async (req: Request, res: Response) => {
    try {
        const clinicianId = (req as any).userId;
        const { patientId, assessmentType } = req.body;

        // Validate required fields
        if (!patientId || !assessmentType) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['patientId and assessmentType are required']
                }
            });
        }

        // Check valid assessment type
        const validTypes = ['ISAA', 'ADHD', 'GLAD', 'ASD-Deep-Dive'];
        if (!validTypes.includes(assessmentType)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_ASSESSMENT_TYPE',
                    message: 'Invalid assessment type',
                    details: [`Must be one of: ${validTypes.join(', ')}`]
                }
            });
        }

        // Check if there's already an in-progress assessment of this type
        const existing = await prisma.assessment.findFirst({
            where: {
                patientId,
                assessmentType,
                status: 'in_progress'
            }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'ASSESSMENT_IN_PROGRESS',
                    message: 'An assessment of this type is already in progress',
                    data: { assessmentId: existing.id }
                }
            });
        }

        // Set total questions based on type
        const totalQuestions: { [key: string]: number } = {
            'ISAA': 40,
            'ADHD': 18,
            'GLAD': 25,
            'ASD-Deep-Dive': 60
        };

        // Create assessment
        const assessment = await prisma.assessment.create({
            data: {
                patientId,
                clinicianId,
                assessmentType,
                administeredBy: clinicianId,
                administeredDate: new Date(),
                responses: '{}',
                currentQuestion: 1,
                totalQuestions: totalQuestions[assessmentType],
                status: 'in_progress'
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                }
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId,
                activityType: 'assessment_started',
                description: `${assessmentType} assessment started`,
                metadata: JSON.stringify({ assessmentId: assessment.id }),
                createdBy: clinicianId
            }
        });

        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Start assessment error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'START_ASSESSMENT_FAILED',
                message: 'Failed to start assessment'
            }
        });
    }
};

/**
 * Save assessment progress (auto-save)
 * PUT /api/v1/assessments/:id/progress
 */
export const saveAssessmentProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { responses, currentDomain, currentQuestion } = req.body;

        const assessment = await prisma.assessment.update({
            where: { id },
            data: {
                responses: typeof responses === 'string' ? responses : JSON.stringify(responses),
                currentDomain,
                currentQuestion
            }
        });

        res.json({
            success: true,
            data: assessment,
            message: 'Progress saved'
        });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SAVE_PROGRESS_FAILED',
                message: 'Failed to save progress'
            }
        });
    }
};

/**
 * Complete assessment with scoring
 * POST /api/v1/assessments/:id/complete
 */
export const completeAssessment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            responses,
            totalScore,
            domainScores,
            interpretation,
            severityLevel,
            dsm5Criteria,
            recommendations,
            duration
        } = req.body;

        const assessment = await prisma.assessment.update({
            where: { id },
            data: {
                status: 'completed',
                responses: typeof responses === 'string' ? responses : JSON.stringify(responses),
                totalScore,
                domainScores: typeof domainScores === 'string' ? domainScores : JSON.stringify(domainScores),
                interpretation,
                severityLevel,
                dsm5Criteria: typeof dsm5Criteria === 'string' ? dsm5Criteria : JSON.stringify(dsm5Criteria),
                recommendations,
                duration,
                completedAt: new Date()
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                evidence: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: assessment.patientId,
                activityType: 'assessment_completed',
                description: `${assessment.assessmentType} completed - Score: ${totalScore}`,
                metadata: JSON.stringify({
                    assessmentId: assessment.id,
                    score: totalScore,
                    severityLevel
                }),
                createdBy: assessment.clinicianId
            }
        });

        // Create notification for clinician
        await prisma.notification.create({
            data: {
                userId: assessment.clinicianId,
                userType: 'clinician',
                notificationType: 'assessment_complete',
                title: 'Assessment Completed',
                message: `${assessment.assessmentType} assessment for ${assessment.patient.firstName} ${assessment.patient.lastName} has been completed.`,
                actionUrl: `/assessments/${assessment.id}`,
                actionData: JSON.stringify({ assessmentId: assessment.id }),
                category: 'assessments'
            }
        });

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Complete assessment error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'COMPLETE_ASSESSMENT_FAILED',
                message: 'Failed to complete assessment'
            }
        });
    }
};

/**
 * Get assessment by ID
 * GET /api/v1/assessments/:id
 */
export const getAssessment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                patient: true,
                clinician: {
                    include: {
                        profile: true
                    }
                },
                evidence: true
            }
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ASSESSMENT_NOT_FOUND',
                    message: 'Assessment not found'
                }
            });
        }

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Get assessment error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_ASSESSMENT_FAILED',
                message: 'Failed to retrieve assessment'
            }
        });
    }
};

/**
 * Get all assessments for a patient
 * GET /api/v1/assessments/patient/:patientId
 */
export const getPatientAssessments = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const { assessmentType, status } = req.query;

        const where: any = { patientId };
        if (assessmentType) where.assessmentType = assessmentType as string;
        if (status) where.status = status as string;

        const assessments = await prisma.assessment.findMany({
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
                },
                evidence: {
                    select: {
                        id: true,
                        evidenceType: true,
                        fileName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: assessments
        });
    } catch (error) {
        console.error('Get patient assessments error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_ASSESSMENTS_FAILED',
                message: 'Failed to retrieve assessments'
            }
        });
    }
};

/**
 * Get assessments summary for patient (one of each type)
 * GET /api/v1/assessments/patient/:patientId/summary
 */
export const getPatientAssessmentsSummary = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        // Get most recent completed assessment of each type
        const assessmentTypes = ['ISAA', 'ADHD', 'GLAD', 'ASD-Deep-Dive'];

        const summary = await Promise.all(
            assessmentTypes.map(async (type) => {
                const latest = await prisma.assessment.findFirst({
                    where: {
                        patientId,
                        assessmentType: type,
                        status: 'completed'
                    },
                    orderBy: { completedAt: 'desc' },
                    select: {
                        id: true,
                        assessmentType: true,
                        totalScore: true,
                        severityLevel: true,
                        completedAt: true,
                        interpretation: true
                    }
                });

                return {
                    assessmentType: type,
                    latest: latest || null,
                    hasCompleted: !!latest
                };
            })
        );

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
                message: 'Failed to retrieve summary'
            }
        });
    }
};

/**
 * Upload evidence for assessment
 * POST /api/v1/assessments/:id/evidence
 */
export const uploadEvidence = async (req: Request, res: Response) => {
    try {
        const { id: assessmentId } = req.params;
        const { evidenceType, fileName, fileUrl, fileSize, description, timestamp } = req.body;

        const evidence = await prisma.assessmentEvidence.create({
            data: {
                assessmentId,
                evidenceType,
                fileName,
                fileUrl,
                fileSize,
                description,
                timestamp
            }
        });

        res.status(201).json({
            success: true,
            data: evidence
        });
    } catch (error) {
        console.error('Upload evidence error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPLOAD_EVIDENCE_FAILED',
                message: 'Failed to upload evidence'
            }
        });
    }
};

/**
 * Delete assessment
 * DELETE /api/v1/assessments/:id
 */
export const deleteAssessment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get assessment for logging
        const assessment = await prisma.assessment.findUnique({
            where: { id },
            select: { patientId: true, assessmentType: true }
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ASSESSMENT_NOT_FOUND',
                    message: 'Assessment not found'
                }
            });
        }

        // Delete (cascades to evidence)
        await prisma.assessment.delete({
            where: { id }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: assessment.patientId,
                activityType: 'assessment_deleted',
                description: `${assessment.assessmentType} assessment deleted`,
                createdBy: (req as any).userId
            }
        });

        res.json({
            success: true,
            message: 'Assessment deleted successfully'
        });
    } catch (error) {
        console.error('Delete assessment error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_ASSESSMENT_FAILED',
                message: 'Failed to delete assessment'
            }
        });
    }
};

/**
 * Get clinician's recent assessments
 * GET /api/v1/assessments/clinician/recent
 */
export const getClinicianRecentAssessments = async (req: Request, res: Response) => {
    try {
        const clinicianId = (req as any).userId;
        const { limit = 10, status } = req.query;

        const where: any = { clinicianId };
        if (status) where.status = status as string;

        const assessments = await prisma.assessment.findMany({
            where,
            include: {
                patient: {
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
            data: assessments
        });
    } catch (error) {
        console.error('Get recent assessments error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_RECENT_ASSESSMENTS_FAILED',
                message: 'Failed to retrieve assessments'
            }
        });
    }
};

// ============================================
// PHASE 1-C2: COMPARISON & INSIGHTS FUNCTIONS
// ============================================

/**
 * Compare assessment with baseline
 * GET /api/v1/assessments/:id/compare/:baselineId
 */
export const compareAssessments = async (req: Request, res: Response) => {
    try {
        const { id, baselineId } = req.params;

        const [current, baseline] = await Promise.all([
            prisma.assessment.findUnique({
                where: { id },
                select: {
                    id: true,
                    assessmentType: true,
                    totalScore: true,
                    domainScores: true,
                    severityLevel: true,
                    completedAt: true,
                    interpretation: true
                }
            }),
            prisma.assessment.findUnique({
                where: { id: baselineId },
                select: {
                    id: true,
                    assessmentType: true,
                    totalScore: true,
                    domainScores: true,
                    severityLevel: true,
                    completedAt: true,
                    interpretation: true
                }
            })
        ]);

        if (!current || !baseline) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ASSESSMENT_NOT_FOUND',
                    message: 'One or both assessments not found'
                }
            });
        }

        if (current.assessmentType !== baseline.assessmentType) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISMATCHED_TYPES',
                    message: 'Cannot compare assessments of different types'
                }
            });
        }

        // Calculate changes
        const scoreDifference = (current.totalScore || 0) - (baseline.totalScore || 0);
        const percentChange = baseline.totalScore
            ? ((scoreDifference / baseline.totalScore) * 100).toFixed(2)
            : 0;

        // Compare domain scores (parse from JSON string)
        const currentDomains = current.domainScores ? JSON.parse(current.domainScores as string) : {};
        const baselineDomains = baseline.domainScores ? JSON.parse(baseline.domainScores as string) : {};

        const domainChanges: any = {};
        Object.keys(currentDomains).forEach(domain => {
            const currentScore = currentDomains[domain] || 0;
            const baselineScore = baselineDomains[domain] || 0;
            domainChanges[domain] = {
                current: currentScore,
                baseline: baselineScore,
                change: currentScore - baselineScore,
                percentChange: baselineScore
                    ? ((currentScore - baselineScore) / baselineScore * 100).toFixed(2)
                    : 0
            };
        });

        // Determine trend
        let trend = 'stable';
        if (Math.abs(scoreDifference) <= 2) {
            trend = 'stable';
        } else if (scoreDifference > 0) {
            trend = current.assessmentType === 'ISAA' ? 'worsening' : 'improving';
        } else {
            trend = current.assessmentType === 'ISAA' ? 'improving' : 'worsening';
        }

        // Time between assessments
        const daysBetween = current.completedAt && baseline.completedAt
            ? Math.floor((current.completedAt.getTime() - baseline.completedAt.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        const comparison = {
            current: {
                id: current.id,
                totalScore: current.totalScore,
                domainScores: currentDomains,
                severityLevel: current.severityLevel,
                completedAt: current.completedAt
            },
            baseline: {
                id: baseline.id,
                totalScore: baseline.totalScore,
                domainScores: baselineDomains,
                severityLevel: baseline.severityLevel,
                completedAt: baseline.completedAt
            },
            changes: {
                totalScoreDifference: scoreDifference,
                percentChange: Number(percentChange),
                domainChanges,
                severityLevelChange: {
                    from: baseline.severityLevel,
                    to: current.severityLevel,
                    changed: baseline.severityLevel !== current.severityLevel
                },
                trend,
                daysBetween
            }
        };

        res.json({
            success: true,
            data: comparison
        });
    } catch (error) {
        console.error('Compare assessments error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'COMPARISON_FAILED',
                message: 'Failed to compare assessments'
            }
        });
    }
};

/**
 * Get assessment progress over time for a patient
 * GET /api/v1/assessments/patient/:patientId/progress
 */
export const getAssessmentProgress = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const { assessmentType } = req.query;

        if (!assessmentType) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_ASSESSMENT_TYPE',
                    message: 'assessmentType query parameter is required'
                }
            });
        }

        const assessments = await prisma.assessment.findMany({
            where: {
                patientId,
                assessmentType: assessmentType as string,
                status: 'completed'
            },
            select: {
                id: true,
                totalScore: true,
                domainScores: true,
                severityLevel: true,
                completedAt: true
            },
            orderBy: { completedAt: 'asc' }
        });

        if (assessments.length === 0) {
            return res.json({
                success: true,
                data: {
                    assessmentType,
                    assessments: [],
                    trend: 'insufficient_data'
                }
            });
        }

        // Calculate overall trend
        const firstScore = assessments[0].totalScore || 0;
        const lastScore = assessments[assessments.length - 1].totalScore || 0;
        const scoreDiff = lastScore - firstScore;

        let overallTrend = 'stable';
        if (Math.abs(scoreDiff) > 5) {
            overallTrend = scoreDiff > 0 ? 'worsening' : 'improving';
        }

        // Extract domain trends
        const domainTrends: any = {};
        if (assessments.length >= 2) {
            const firstDomains = assessments[0].domainScores ? JSON.parse(assessments[0].domainScores as string) : {};
            const lastDomains = assessments[assessments.length - 1].domainScores ? JSON.parse(assessments[assessments.length - 1].domainScores as string) : {};

            Object.keys(firstDomains).forEach(domain => {
                const first = firstDomains[domain] || 0;
                const last = lastDomains[domain] || 0;
                domainTrends[domain] = {
                    firstScore: first,
                    lastScore: last,
                    change: last - first
                };
            });
        }

        res.json({
            success: true,
            data: {
                assessmentType,
                assessments,
                trend: overallTrend,
                domainTrends,
                totalAssessments: assessments.length,
                timespan: {
                    first: assessments[0].completedAt,
                    last: assessments[assessments.length - 1].completedAt
                }
            }
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PROGRESS_FAILED',
                message: 'Failed to retrieve progress'
            }
        });
    }
};

/**
 * Get domain insights for an assessment
 * GET /api/v1/assessments/:id/insights
 */
export const getAssessmentInsights = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            select: {
                id: true,
                assessmentType: true,
                totalScore: true,
                domainScores: true,
                severityLevel: true,
                responses: true
            }
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ASSESSMENT_NOT_FOUND',
                    message: 'Assessment not found'
                }
            });
        }

        const domainScores = assessment.domainScores ? JSON.parse(assessment.domainScores as string) : {};

        // Identify strongest and weakest domains
        const domains = Object.entries(domainScores).map(([name, score]) => ({
            name,
            score: score as number
        }));

        domains.sort((a, b) => b.score - a.score);

        const insights = {
            assessmentId: assessment.id,
            assessmentType: assessment.assessmentType,
            totalScore: assessment.totalScore,
            severityLevel: assessment.severityLevel,
            domainAnalysis: {
                strongest: domains.length > 0 ? domains[domains.length - 1] : null,
                weakest: domains.length > 0 ? domains[0] : null,
                allDomains: domains
            },
            recommendations: generateRecommendations(assessment.assessmentType, domainScores)
        };

        res.json({
            success: true,
            data: insights
        });
    } catch (error) {
        console.error('Get insights error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_INSIGHTS_FAILED',
                message: 'Failed to generate insights'
            }
        });
    }
};

/**
 * Helper function to generate recommendations based on assessment
 */
function generateRecommendations(assessmentType: string, domainScores: any): string[] {
    const recommendations: string[] = [];

    if (assessmentType === 'ISAA') {
        if (domainScores.social > 15) {
            recommendations.push('Consider social skills training programs');
            recommendations.push('Structured peer interaction activities recommended');
        }
        if (domainScores.communication > 15) {
            recommendations.push('Speech and language therapy evaluation recommended');
            recommendations.push('Consider AAC (Augmentative and Alternative Communication) assessment');
        }
        if (domainScores.motor > 50) {
            recommendations.push('Occupational therapy assessment recommended');
            recommendations.push('Fine and gross motor skill development activities');
        }
    }

    if (assessmentType === 'ADHD') {
        recommendations.push('Consider behavioral intervention strategies');
        recommendations.push('Structured routine and environment modifications');
        recommendations.push('Parent training in behavior management');
    }

    if (recommendations.length === 0) {
        recommendations.push('Continue regular monitoring and reassessment');
    }

    return recommendations;
}

/**
 * Update assessment interpretation
 * PUT /api/v1/assessments/:id/interpretation
 */
export const updateInterpretation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { interpretation, recommendations } = req.body;

        const assessment = await prisma.assessment.update({
            where: { id },
            data: {
                interpretation,
                recommendations
            }
        });

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Update interpretation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_INTERPRETATION_FAILED',
                message: 'Failed to update interpretation'
            }
        });
    }
};
