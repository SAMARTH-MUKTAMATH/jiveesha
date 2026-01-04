import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Add child to parent account
 * POST /api/v1/parent/children
 */
export const addChild = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            medicalHistory,
            currentConcerns
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !dateOfBirth || !gender) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['firstName, lastName, dateOfBirth, and gender are required']
                }
            });
        }

        // Get parent profile
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

        // Create child using the new Child model
        const child = await prisma.child.create({
            data: {
                parentId: user.parent.id,
                firstName,
                lastName,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                medicalHistory: medicalHistory || null,
                currentConcerns: currentConcerns || null
            }
        });

        res.status(201).json({
            success: true,
            data: child,
            message: 'Child added successfully'
        });
    } catch (error) {
        console.error('Add child error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_CHILD_FAILED',
                message: 'Failed to add child'
            }
        });
    }
};

/**
 * Get all children for parent
 * GET /api/v1/parent/children
 */
export const getChildren = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: {
                    include: {
                        myChildren: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                }
            }
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

        res.json({
            success: true,
            data: user.parent.myChildren
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CHILDREN_FAILED',
                message: 'Failed to retrieve children'
            }
        });
    }
};

/**
 * Get single child details
 * GET /api/v1/parent/children/:childId
 */
export const getChild = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId: childId } = req.params;

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

        // Get child from Child model
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                parentId: user.parent.id
            }
        });

        if (!child) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this child'
                }
            });
        }

        res.json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Get child error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CHILD_FAILED',
                message: 'Failed to retrieve child'
            }
        });
    }
};

/**
 * Update child details
 * PUT /api/v1/parent/children/:childId
 */
export const updateRelationship = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId: childId } = req.params;
        const { firstName, lastName, dateOfBirth, gender, medicalHistory, currentConcerns } = req.body;

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

        // Verify parent owns this child
        const existingChild = await prisma.child.findFirst({
            where: {
                id: childId,
                parentId: user.parent.id
            }
        });

        if (!existingChild) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this child'
                }
            });
        }

        // Update child
        const child = await prisma.child.update({
            where: { id: childId },
            data: {
                firstName: firstName || existingChild.firstName,
                lastName: lastName || existingChild.lastName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : existingChild.dateOfBirth,
                gender: gender || existingChild.gender,
                medicalHistory: medicalHistory !== undefined ? medicalHistory : existingChild.medicalHistory,
                currentConcerns: currentConcerns !== undefined ? currentConcerns : existingChild.currentConcerns
            }
        });

        res.json({
            success: true,
            data: child,
            message: 'Child updated successfully'
        });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_CHILD_FAILED',
                message: 'Failed to update child'
            }
        });
    }
};

/**
 * Remove child from parent account
 * DELETE /api/v1/parent/children/:childId
 */
export const removeChild = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId: childId } = req.params;

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

        // Verify parent owns this child
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                parentId: user.parent.id
            }
        });

        if (!child) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this child'
                }
            });
        }

        // Delete child
        await prisma.child.delete({
            where: {
                id: childId
            }
        });

        res.json({
            success: true,
            message: 'Child removed from your account'
        });
    } catch (error) {
        console.error('Remove child error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'REMOVE_CHILD_FAILED',
                message: 'Failed to remove child'
            }
        });
    }
};

/**
 * Verify parent has access to child (middleware helper)
 * GET /api/v1/parent/children/:patientId/verify-access
 */
export const verifyAccess = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                hasAccess: false
            });
        }

        const relationship = await prisma.parentChild.findUnique({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
            }
        });

        res.json({
            success: true,
            hasAccess: !!relationship,
            relationship: relationship || null
        });
    } catch (error) {
        console.error('Verify access error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'VERIFY_ACCESS_FAILED',
                message: 'Failed to verify access'
            }
        });
    }
};

/**
 * Get child's activity timeline
 * GET /api/v1/parent/children/:patientId/activity
 */
export const getChildActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId } = req.params;
        const { limit = 20 } = req.query;

        // Verify parent has access
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

        const hasAccess = await prisma.parentChild.findUnique({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
            }
        });

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this child'
                }
            });
        }

        // Get activity log
        const activities = await prisma.patientActivityLog.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            take: Number(limit)
        });

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Get child activity error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_ACTIVITY_FAILED',
                message: 'Failed to retrieve activity'
            }
        });
    }
};
