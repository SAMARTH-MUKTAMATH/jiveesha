import { Request, Response } from 'express';

/**
 * GET /api/v1/parent/screenings/types
 * Get available screening types
 */
export const getScreeningTypes = async (req: Request, res: Response) => {
    try {
        const types = [
            {
                id: 'mchat-r',
                name: 'M-CHAT-R',
                description: 'Modified Checklist for Autism in Toddlers, Revised',
                ageRange: '16-30 months',
                questionCount: 20
            },
            {
                id: 'asq3',
                name: 'ASQ-3',
                description: 'Ages & Stages Questionnaires',
                ageRange: '1-66 months',
                questionCount: 30
            }
        ];

        res.json({
            success: true,
            data: types
        });
    } catch (error) {
        console.error('Get screening types error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_TYPES_FAILED',
                message: 'Failed to retrieve screening types'
            }
        });
    }
};
