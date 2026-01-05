import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUniqueConsentToken } from '../utils/token-generator';

const prisma = new PrismaClient();

/**
 * Grant access (parent creates access token for clinician)
 * POST /api/v1/consent/grant
 */
export const grantConsent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            personId,
            clinicianEmail,
            permissions,
            accessLevel,
            expiresInDays,
            notes
        } = req.body;

        // Validate required fields
        if (!personId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'personId is required'
                }
            });
        }

        // Get parent profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: true
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

        // Verify parent has access to this person
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

        // Generate unique token
        const token = await generateUniqueConsentToken(prisma);

        // Calculate expiration
        const tokenExpiresAt = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Default 90 days

        const expiresAt = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
            : null;

        // Get user's clinician profile for name
        const clinicianProfile = await prisma.clinicianProfile.findUnique({
            where: { userId }
        });

        // Create access grant
        const grant = await prisma.accessGrant.create({
            data: {
                token,
                grantorType: 'parent',
                grantorId: user.parent.id,
                granteeType: 'clinician',
                granteeId: clinicianEmail || '',
                personId,
                permissions: JSON.stringify(permissions || {
                    view: true,
                    edit: false,
                    assessments: true,
                    reports: true,
                    iep: false
                }),
                accessLevel: accessLevel || 'view',
                status: 'pending',
                tokenExpiresAt,
                expiresAt,
                grantedByName: user.email || 'Parent',
                grantedByEmail: user.email,
                granteeEmail: clinicianEmail || null,
                notes: notes || null
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
            data: grant,
            message: 'Access granted successfully'
        });
    } catch (error) {
        console.error('Grant consent error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GRANT_CONSENT_FAILED',
                message: 'Failed to grant consent'
            }
        });
    }
};

/**
 * Claim access (clinician activates token)
 * POST /api/v1/consent/claim
 */
export const claimConsent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Token is required'
                }
            });
        }

        // Find access grant
        const grant = await prisma.accessGrant.findUnique({
            where: { token },
            include: {
                person: true
            }
        });

        if (!grant) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired token'
                }
            });
        }

        // Check status
        if (grant.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'TOKEN_ALREADY_USED',
                    message: 'This token has already been used or revoked'
                }
            });
        }

        // Check expiration
        if (grant.tokenExpiresAt && new Date() > grant.tokenExpiresAt) {
            await prisma.accessGrant.update({
                where: { id: grant.id },
                data: { status: 'expired' }
            });

            return res.status(400).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'This token has expired'
                }
            });
        }

        // Activate access grant
        const updated = await prisma.accessGrant.update({
            where: { id: grant.id },
            data: {
                granteeId: userId,
                status: 'active',
                activatedAt: new Date()
            },
            include: {
                person: true
            }
        });

        res.json({
            success: true,
            data: updated,
            message: 'Access claimed successfully'
        });
    } catch (error) {
        console.error('Claim consent error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CLAIM_CONSENT_FAILED',
                message: 'Failed to claim consent'
            }
        });
    }
};

/**
 * Revoke access (parent removes access)
 * POST /api/v1/consent/:id/revoke
 */
export const revokeConsent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { reason } = req.body;

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

        // Find access grant
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
        const updated = await prisma.accessGrant.update({
            where: { id },
            data: {
                status: 'revoked',
                revokedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: updated,
            message: 'Access revoked successfully'
        });
    } catch (error) {
        console.error('Revoke consent error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'REVOKE_CONSENT_FAILED',
                message: 'Failed to revoke consent'
            }
        });
    }
};

/**
 * Get access grants granted by parent
 * GET /api/v1/consent/granted
 */
export const getGrantedConsents = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { status } = req.query;

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

        const where: any = {
            grantorType: 'parent',
            grantorId: user.parent.id
        };
        if (status) where.status = status as string;

        const grants = await prisma.accessGrant.findMany({
            where,
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

        res.json({
            success: true,
            data: grants
        });
    } catch (error) {
        console.error('Get granted consents error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CONSENTS_FAILED',
                message: 'Failed to retrieve consents'
            }
        });
    }
};

/**
 * Get access grants received by clinician
 * GET /api/v1/consent/received
 */
export const getReceivedConsents = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { status } = req.query;

        const where: any = {
            granteeType: 'clinician',
            granteeId: userId
        };
        if (status) where.status = status as string;

        const grants = await prisma.accessGrant.findMany({
            where,
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                }
            },
            orderBy: { activatedAt: 'desc' }
        });

        res.json({
            success: true,
            data: grants
        });
    } catch (error) {
        console.error('Get received consents error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CONSENTS_FAILED',
                message: 'Failed to retrieve consents'
            }
        });
    }
};

/**
 * Update access permissions
 * PUT /api/v1/consent/:id/permissions
 */
export const updatePermissions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { permissions, accessLevel } = req.body;

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

        if (!grant || grant.grantorId !== user.parent.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have permission to update this access'
                }
            });
        }

        const updated = await prisma.accessGrant.update({
            where: { id },
            data: {
                permissions: permissions ? JSON.stringify(permissions) : grant.permissions,
                accessLevel: accessLevel || grant.accessLevel
            }
        });

        res.json({
            success: true,
            data: updated,
            message: 'Permissions updated successfully'
        });
    } catch (error) {
        console.error('Update permissions error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PERMISSIONS_FAILED',
                message: 'Failed to update permissions'
            }
        });
    }
};

/**
 * Check access status
 * GET /api/v1/consent/check/:personId/:clinicianId
 */
export const checkConsentStatus = async (req: Request, res: Response) => {
    try {
        const { personId, clinicianId } = req.params;

        const grant = await prisma.accessGrant.findFirst({
            where: {
                personId,
                granteeType: 'clinician',
                granteeId: clinicianId,
                status: 'active'
            }
        });

        res.json({
            success: true,
            hasConsent: !!grant,
            consent: grant || null
        });
    } catch (error) {
        console.error('Check consent error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CHECK_CONSENT_FAILED',
                message: 'Failed to check consent'
            }
        });
    }
};

/**
 * Resend access invitation
 * POST /api/v1/consent/:id/resend
 */
export const resendInvitation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

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

        if (grant.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'GRANT_NOT_PENDING',
                    message: 'Can only resend invitations for pending grants'
                }
            });
        }

        // TODO: Send email in production
        // await sendConsentEmail(grant.granteeId, grant.token, grant);

        res.json({
            success: true,
            message: 'Invitation resent successfully'
        });
    } catch (error) {
        console.error('Resend invitation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'RESEND_FAILED',
                message: 'Failed to resend invitation'
            }
        });
    }
};
