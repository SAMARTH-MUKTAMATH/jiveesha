import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUniqueConsentToken } from '../utils/token-generator';

const prisma = new PrismaClient();

/**
 * Transform AccessGrant from DB to frontend format
 */
const transformAccessGrant = (grant: any) => {
    const permissions = typeof grant.permissions === 'string'
        ? JSON.parse(grant.permissions)
        : grant.permissions;

    return {
        id: grant.id,
        childId: grant.personId,
        childName: grant.person ? `${grant.person.firstName} ${grant.person.lastName}` : 'Unknown',
        clinicianId: grant.granteeId,
        clinicianName: grant.granteeId && grant.status === 'active' ? grant.granteeEmail : null,
        clinicianEmail: grant.granteeEmail || '',
        status: grant.status,
        permissions: {
            viewDemographics: permissions.view || false,
            viewMedical: permissions.edit || false,
            viewScreenings: permissions.assessments || false,
            viewAssessments: permissions.assessments || false,
            viewReports: permissions.reports || false,
            editNotes: permissions.edit || false
        },
        accessLevel: grant.accessLevel,
        token: grant.status === 'pending' ? grant.token : undefined,
        tokenExpiresAt: grant.tokenExpiresAt?.toISOString(),
        grantedAt: grant.grantedAt.toISOString(),
        activatedAt: grant.activatedAt?.toISOString(),
        revokedAt: grant.revokedAt?.toISOString(),
        expiresAt: grant.expiresAt?.toISOString(),
        lastAccessedAt: grant.lastAccessedAt?.toISOString()
    };
};

/**
 * GET /api/v1/parent/access-grants
 * Get all access grants created by the parent
 */
export const getAllAccessGrants = async (req: Request, res: Response) => {
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

        const grants = await prisma.accessGrant.findMany({
            where: {
                grantorType: 'parent',
                grantorId: user.parent.id
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { grantedAt: 'desc' }
        });

        const transformed = grants.map(transformAccessGrant);

        res.json({
            success: true,
            data: transformed
        });
    } catch (error) {
        console.error('Get access grants error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_GRANTS_FAILED',
                message: 'Failed to retrieve access grants'
            }
        });
    }
};

/**
 * GET /api/v1/parent/access-grants/:id
 * Get single access grant details
 */
export const getAccessGrantById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

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

        const grant = await prisma.accessGrant.findUnique({
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

        if (!grant || grant.grantorId !== user.parent.id) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GRANT_NOT_FOUND',
                    message: 'Access grant not found'
                }
            });
        }

        const transformed = transformAccessGrant(grant);

        res.json({
            success: true,
            data: transformed
        });
    } catch (error) {
        console.error('Get access grant error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_GRANT_FAILED',
                message: 'Failed to retrieve access grant'
            }
        });
    }
};

/**
 * POST /api/v1/parent/access-grants
 * Create new access grant
 */
export const createAccessGrant = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            childId,
            clinicianEmail,
            permissions,
            accessLevel,
            expiresAt
        } = req.body;

        // Validate required fields
        if (!childId || !clinicianEmail) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'childId and clinicianEmail are required'
                }
            });
        }

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

        // Verify parent has access to this child
        const relationship = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
                personId: childId
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

        // Generate unique token
        const token = await generateUniqueConsentToken(prisma);

        // Token expires in 7 days
        const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Transform permissions from frontend format to backend format
        const backendPermissions = {
            view: permissions.viewDemographics || false,
            edit: permissions.editNotes || false,
            assessments: permissions.viewAssessments || permissions.viewScreenings || false,
            reports: permissions.viewReports || false,
            iep: false
        };

        // Create access grant
        const grant = await prisma.accessGrant.create({
            data: {
                token,
                grantorType: 'parent',
                grantorId: user.parent.id,
                granteeType: 'clinician',
                granteeId: '',
                personId: childId,
                permissions: JSON.stringify(backendPermissions),
                accessLevel: accessLevel || 'view',
                status: 'pending',
                tokenExpiresAt,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                grantedByName: `${user.firstName} ${user.lastName}`,
                grantedByEmail: user.email,
                granteeEmail: clinicianEmail,
                notes: null
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
            data: {
                id: grant.id,
                token: grant.token,
                tokenExpiresAt: grant.tokenExpiresAt.toISOString()
            }
        });
    } catch (error) {
        console.error('Create access grant error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_GRANT_FAILED',
                message: 'Failed to create access grant'
            }
        });
    }
};

/**
 * DELETE /api/v1/parent/access-grants/:id
 * Revoke access grant
 */
export const revokeAccessGrant = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

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

        const grant = await prisma.accessGrant.findUnique({
            where: { id }
        });

        if (!grant) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'GRANT_NOT_FOUND',
                    message: 'Access grant not found'
                }
            });
        }

        // Verify ownership
        if (grant.grantorId !== user.parent.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have permission to revoke this access'
                }
            });
        }

        // Revoke access
        await prisma.accessGrant.update({
            where: { id },
            data: {
                status: 'revoked',
                revokedAt: new Date()
            }
        });

        res.json({
            success: true,
            message: 'Access revoked successfully'
        });
    } catch (error) {
        console.error('Revoke access grant error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'REVOKE_GRANT_FAILED',
                message: 'Failed to revoke access grant'
            }
        });
    }
};
