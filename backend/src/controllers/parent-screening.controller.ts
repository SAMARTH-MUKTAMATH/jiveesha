import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { scoreMChatR, scoreASQ3, generateRecommendations } from '../utils/screening-scorer';

const prisma = new PrismaClient();

/**
 * Start new screening (TYPE-AGNOSTIC)
 * POST /api/v1/parent/screening
 */
export const startScreening = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { personId, screeningType, ageAtScreening } = req.body;

        // Validate
        if (!personId || !screeningType || !ageAtScreening) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'personId, screeningType, and ageAtScreening are required'
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
        const relationship = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
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

        // Determine total questions (extensible for new screening types)
        const totalQuestions: Record<string, number> = {
            'M-CHAT-R': 20,
            'M-CHAT-F': 20,
            'ASQ-3': 30,
            'ASQ-SE-2': 30
        };

        // Create screening
        const screening = await prisma.screening.create({
            data: {
                conductedBy: user.parent.id,
                conductedByType: 'parent',
                personId,
                screeningType,
                ageAtScreening,
                totalQuestions: totalQuestions[screeningType] || 20,
                status: 'in_progress'
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: screening
        });
    } catch (error) {
        console.error('Start screening error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'START_SCREENING_FAILED',
                message: 'Failed to start screening'
            }
        });
    }
};

/**
 * Get screening questions (TYPE-SPECIFIC LOADER)
 * GET /api/v1/parent/screening/:id/questions
 */
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const screening = await prisma.screening.findUnique({
            where: { id }
        });

        if (!screening) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'SCREENING_NOT_FOUND',
                    message: 'Screening not found'
                }
            });
        }

        let questions;

        // Load questions based on type (add new types here)
        if (screening.screeningType === 'M-CHAT-R' || screening.screeningType === 'M-CHAT-F') {
            questions = await prisma.mChatQuestion.findMany({
                where: {
                    isInitialScreener: screening.screeningType === 'M-CHAT-R'
                },
                orderBy: { questionNumber: 'asc' }
            });
        } else if (screening.screeningType === 'ASQ-3') {
            // Determine age range based on ageAtScreening
            const ageRange = `${Math.floor(screening.ageAtScreening / 12) * 12}-months`;

            questions = await prisma.aSQQuestion.findMany({
                where: { ageRange },
                orderBy: [
                    { domain: 'asc' },
                    { questionNumber: 'asc' }
                ]
            });
        }

        res.json({
            success: true,
            data: {
                screening,
                questions
            }
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_QUESTIONS_FAILED',
                message: 'Failed to retrieve questions'
            }
        });
    }
};

/**
 * Save response (TYPE-AGNOSTIC auto-save)
 * POST /api/v1/parent/screening/:id/response
 */
export const saveResponse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { questionId, answer, currentQuestion } = req.body;

        const screening = await prisma.screening.findUnique({
            where: { id }
        });

        if (!screening) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'SCREENING_NOT_FOUND',
                    message: 'Screening not found'
                }
            });
        }

        // Update responses (JSON string for SQLite)
        const responses = screening.responses ? JSON.parse(screening.responses as string) : {};
        responses[questionId] = answer;

        await prisma.screening.update({
            where: { id },
            data: {
                responses: JSON.stringify(responses),
                currentQuestion: currentQuestion || screening.currentQuestion
            }
        });

        res.json({
            success: true,
            message: 'Response saved'
        });
    } catch (error) {
        console.error('Save response error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SAVE_RESPONSE_FAILED',
                message: 'Failed to save response'
            }
        });
    }
};

/**
 * Complete and score screening (ROUTES TO APPROPRIATE SCORER)
 * POST /api/v1/parent/screening/:id/complete
 */
export const completeScreening = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { responses } = req.body;

        const screening = await prisma.screening.findUnique({
            where: { id }
        });

        if (!screening) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'SCREENING_NOT_FOUND',
                    message: 'Screening not found'
                }
            });
        }

        const existingResponses = screening.responses ? JSON.parse(screening.responses as string) : {};
        const finalResponses = responses || existingResponses;
        let scoreResult: any;
        let recommendations: string[] = [];

        // Score based on type (add new scorers here)
        if (screening.screeningType === 'M-CHAT-R' || screening.screeningType === 'M-CHAT-F') {
            scoreResult = scoreMChatR(finalResponses as Record<string, string>);
            recommendations = generateRecommendations(
                screening.screeningType,
                scoreResult.riskLevel,
                scoreResult.screenerResult
            );

            await prisma.screening.update({
                where: { id },
                data: {
                    responses: JSON.stringify(finalResponses),
                    status: 'completed',
                    completedAt: new Date(),
                    totalScore: scoreResult.totalScore,
                    riskLevel: scoreResult.riskLevel,
                    screenerResult: scoreResult.screenerResult,
                    followUpRequired: scoreResult.followUpRequired,
                    professionalReferral: scoreResult.professionalReferral,
                    mchatInitialScore: scoreResult.totalScore,
                    recommendations: JSON.stringify(recommendations)
                }
            });
        } else if (screening.screeningType === 'ASQ-3') {
            const ageRange = `${Math.floor(screening.ageAtScreening / 12) * 12}-months`;
            scoreResult = scoreASQ3(finalResponses as Record<string, string>, ageRange);
            recommendations = generateRecommendations(
                screening.screeningType,
                scoreResult.riskLevel
            );

            await prisma.screening.update({
                where: { id },
                data: {
                    responses: JSON.stringify(finalResponses),
                    status: 'completed',
                    completedAt: new Date(),
                    totalScore: scoreResult.totalScore,
                    riskLevel: scoreResult.riskLevel,
                    followUpRequired: scoreResult.riskLevel !== 'low',
                    professionalReferral: scoreResult.riskLevel === 'high',
                    recommendations: JSON.stringify({
                        ...scoreResult,
                        recommendations
                    })
                }
            });
        }

        // Log activity

        const updated = await prisma.screening.findUnique({
            where: { id },
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

        res.json({
            success: true,
            data: updated,
            message: 'Screening completed'
        });
    } catch (error) {
        console.error('Complete screening error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'COMPLETE_SCREENING_FAILED',
                message: 'Failed to complete screening'
            }
        });
    }
};

/**
 * Get screening results (TYPE-AGNOSTIC)
 * GET /api/v1/parent/screening/:id/results
 */
export const getResults = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        const screening = await prisma.screening.findUnique({
            where: { id },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                }
            }
        });

        if (!screening) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'SCREENING_NOT_FOUND',
                    message: 'Screening not found'
                }
            });
        }

        // Verify ownership
        if (screening.conductedBy !== user?.parent?.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this screening'
                }
            });
        }

        if (screening.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'SCREENING_NOT_COMPLETED',
                    message: 'Screening has not been completed yet'
                }
            });
        }

        res.json({
            success: true,
            data: screening
        });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_RESULTS_FAILED',
                message: 'Failed to retrieve results'
            }
        });
    }
};

/**
 * Get screening history for child (TYPE-AGNOSTIC)
 * GET /api/v1/parent/screening/child/:personId
 */
export const getChildScreenings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { personId } = req.params;
        const { screeningType, status } = req.query;

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
        const relationship = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
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

        const where: any = { personId };
        if (screeningType) where.screeningType = screeningType as string;
        if (status) where.status = status as string;

        const screenings = await prisma.screening.findMany({
            where,
            orderBy: { startedAt: 'desc' }
        });

        res.json({
            success: true,
            data: screenings
        });
    } catch (error) {
        console.error('Get child screenings error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_SCREENINGS_FAILED',
                message: 'Failed to retrieve screenings'
            }
        });
    }
};

/**
 * Get all screenings for parent (TYPE-AGNOSTIC)
 * GET /api/v1/parent/screening/my
 */
export const getMyScreenings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

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

        const screenings = await prisma.screening.findMany({
            where: { conductedBy: user.parent.id },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { startedAt: 'desc' }
        });

        res.json({
            success: true,
            data: screenings
        });
    } catch (error) {
        console.error('Get my screenings error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_SCREENINGS_FAILED',
                message: 'Failed to retrieve screenings'
            }
        });
    }
};

/**
 * Delete screening (TYPE-AGNOSTIC)
 * DELETE /api/v1/parent/screening/:id
 */
export const deleteScreening = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        const screening = await prisma.screening.findUnique({
            where: { id }
        });

        if (!screening || screening.conductedBy !== user?.parent?.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have permission to delete this screening'
                }
            });
        }

        // Only allow deleting in-progress screenings
        if (screening.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'CANNOT_DELETE_COMPLETED',
                    message: 'Cannot delete completed screenings'
                }
            });
        }

        await prisma.screening.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Screening deleted'
        });
    } catch (error) {
        console.error('Delete screening error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_SCREENING_FAILED',
                message: 'Failed to delete screening'
            }
        });
    }
};
