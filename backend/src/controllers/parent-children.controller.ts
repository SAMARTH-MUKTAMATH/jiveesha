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
            patientId,
            relationshipType,
            isPrimary,
            canConsent
        } = req.body;

        // Validate required fields
        if (!patientId || !relationshipType) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['patientId and relationshipType are required']
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

        // Check if patient exists
        const patient = await prisma.patient.findUnique({
            where: { id: patientId }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PATIENT_NOT_FOUND',
                    message: 'Child not found'
                }
            });
        }

        // Check if relationship already exists
        const existing = await prisma.parentChild.findUnique({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
            }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'RELATIONSHIP_EXISTS',
                    message: 'This child is already linked to your account'
                }
            });
        }

        // Create relationship
        const relationship = await prisma.parentChild.create({
            data: {
                parentId: user.parent.id,
                patientId,
                relationshipType,
                isPrimary: isPrimary || false,
                canConsent: canConsent !== undefined ? canConsent : true
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: relationship,
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
                        children: {
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        gender: true,
                                        profilePicture: true,
                                        medicalHistory: true
                                    }
                                }
                            },
                            orderBy: {
                                addedAt: 'desc'
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
            data: user.parent.children
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
 * GET /api/v1/parent/children/:patientId
 */
export const getChild = async (req: Request, res: Response) => {
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
                error: {
                    code: 'PARENT_NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Check if parent has access to this child
        const relationship = await prisma.parentChild.findUnique({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
            },
            include: {
                patient: true
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

        res.json({
            success: true,
            data: relationship
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
 * Update relationship details
 * PUT /api/v1/parent/children/:patientId
 */
export const updateRelationship = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { patientId } = req.params;
        const { relationshipType, isPrimary, canConsent } = req.body;

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

        // Update relationship
        const relationship = await prisma.parentChild.update({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
            },
            data: {
                relationshipType,
                isPrimary,
                canConsent
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

        res.json({
            success: true,
            data: relationship,
            message: 'Relationship updated successfully'
        });
    } catch (error) {
        console.error('Update relationship error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_RELATIONSHIP_FAILED',
                message: 'Failed to update relationship'
            }
        });
    }
};

/**
 * Remove child from parent account
 * DELETE /api/v1/parent/children/:patientId
 */
export const removeChild = async (req: Request, res: Response) => {
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
                error: {
                    code: 'PARENT_NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Delete relationship
        await prisma.parentChild.delete({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
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
