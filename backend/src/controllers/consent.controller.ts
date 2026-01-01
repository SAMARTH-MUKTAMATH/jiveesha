import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUniqueConsentToken } from '../utils/token-generator';

const prisma = new PrismaClient();

/**
 * Grant consent (parent creates access token)
 * POST /api/v1/consent/grant
 */
export const grantConsent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            patientId,
            clinicianEmail,
            permissions,
            accessLevel,
            expiresInDays,
            notes
        } = req.body;

        // Validate required fields
        if (!patientId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'patientId is required'
                }
            });
        }

        // Get parent profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: true,
                profile: true
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

        // Verify parent has access to this child
        const relationship = await prisma.parentChild.findUnique({
            where: {
                parentId_patientId: {
                    parentId: user.parent.id,
                    patientId
                }
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

        // Check if parent can provide consent
        if (!relationship.canConsent) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'CANNOT_CONSENT',
                    message: 'You do not have permission to grant consent for this child'
                }
            });
        }

        // Generate unique token
        const token = await generateUniqueConsentToken(prisma);

        // Calculate expiration
        const expiresAt = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Default 90 days

        // Create consent grant
        const consent = await prisma.consentGrant.create({
            data: {
                token,
                parentId: user.parent.id,
                patientId,
                clinicianEmail,
                grantedByName: `${user.profile?.firstName} ${user.profile?.lastName}`,
                grantedByEmail: user.email,
                permissions: JSON.stringify(permissions || {
                    view: true,
                    edit: false,
                    assessments: true,
                    reports: true,
                    iep: false
                }),
                accessLevel: accessLevel || 'view',
                status: 'pending',
                expiresAt,
                notes,
                auditLog: JSON.stringify([
                    {
                        action: 'created',
                        timestamp: new Date(),
                        userId: user.id,
                        notes: 'Consent grant created'
                    }
                ])
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

        res.status(201).json({
            success: true,
            data: consent,
            message: 'Consent granted successfully'
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
 * Claim consent (clinician activates token)
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

        // Find consent grant
        const consent = await prisma.consentGrant.findUnique({
            where: { token },
            include: {
                patient: true
            }
        });

        if (!consent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired token'
                }
            });
        }

        // Check status
        if (consent.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'TOKEN_ALREADY_USED',
                    message: 'This token has already been used or revoked'
                }
            });
        }

        // Check expiration
        if (consent.expiresAt && new Date() > consent.expiresAt) {
            await prisma.consentGrant.update({
                where: { id: consent.id },
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

        // Get clinician info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });

        // Activate consent
        const auditLog = consent.auditLog ? JSON.parse(consent.auditLog as string) : [];
        auditLog.push({
            action: 'activated',
            timestamp: new Date(),
            userId: user?.id,
            clinicianName: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
            notes: 'Consent activated by clinician'
        });

        const updated = await prisma.consentGrant.update({
            where: { id: consent.id },
            data: {
                clinicianId: userId,
                status: 'active',
                activatedAt: new Date(),
                auditLog: JSON.stringify(auditLog)
            },
            include: {
                patient: true,
                parent: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: consent.patientId,
                activityType: 'consent_granted',
                description: `Consent granted to ${user?.profile?.firstName} ${user?.profile?.lastName}`,
                metadata: JSON.stringify({ consentId: consent.id }),
                createdBy: userId
            }
        });

        res.json({
            success: true,
            data: updated,
            message: 'Consent claimed successfully'
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
 * Revoke consent (parent removes access)
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

        // Find consent
        const consent = await prisma.consentGrant.findUnique({
            where: { id }
        });

        if (!consent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'CONSENT_NOT_FOUND',
                    message: 'Consent not found'
                }
            });
        }

        // Verify ownership
        if (consent.parentId !== user.parent.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have permission to revoke this consent'
                }
            });
        }

        // Revoke consent
        const auditLog = consent.auditLog ? JSON.parse(consent.auditLog as string) : [];
        auditLog.push({
            action: 'revoked',
            timestamp: new Date(),
            userId: user.id,
            reason,
            notes: 'Consent revoked by parent'
        });

        const updated = await prisma.consentGrant.update({
            where: { id },
            data: {
                status: 'revoked',
                revokedAt: new Date(),
                auditLog: JSON.stringify(auditLog)
            }
        });

        // Log activity
        if (consent.patientId) {
            await prisma.patientActivityLog.create({
                data: {
                    patientId: consent.patientId,
                    activityType: 'consent_revoked',
                    description: 'Parent revoked clinician access',
                    metadata: JSON.stringify({ consentId: consent.id }),
                    createdBy: userId
                }
            });
        }

        res.json({
            success: true,
            data: updated,
            message: 'Consent revoked successfully'
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
 * Get consents granted by parent
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

        const where: any = { parentId: user.parent.id };
        if (status) where.status = status as string;

        const consents = await prisma.consentGrant.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
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
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: consents
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
 * Get consents received by clinician
 * GET /api/v1/consent/received
 */
export const getReceivedConsents = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { status } = req.query;

        const where: any = { clinicianId: userId };
        if (status) where.status = status as string;

        const consents = await prisma.consentGrant.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { activatedAt: 'desc' }
        });

        res.json({
            success: true,
            data: consents
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
 * Update consent permissions
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

        const consent = await prisma.consentGrant.findUnique({
            where: { id }
        });

        if (!consent || consent.parentId !== user.parent.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have permission to update this consent'
                }
            });
        }

        const auditLog = consent.auditLog ? JSON.parse(consent.auditLog as string) : [];
        auditLog.push({
            action: 'permissions_updated',
            timestamp: new Date(),
            userId: user.id,
            oldPermissions: consent.permissions,
            newPermissions: permissions,
            notes: 'Permissions updated by parent'
        });

        const updated = await prisma.consentGrant.update({
            where: { id },
            data: {
                permissions: permissions ? JSON.stringify(permissions) : consent.permissions,
                accessLevel: accessLevel || consent.accessLevel,
                auditLog: JSON.stringify(auditLog)
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
 * Check consent status
 * GET /api/v1/consent/check/:patientId/:clinicianId
 */
export const checkConsentStatus = async (req: Request, res: Response) => {
    try {
        const { patientId, clinicianId } = req.params;

        const consent = await prisma.consentGrant.findFirst({
            where: {
                patientId,
                clinicianId,
                status: 'active'
            }
        });

        res.json({
            success: true,
            hasConsent: !!consent,
            consent: consent || null
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
 * Resend consent invitation
 * POST /api/v1/consent/:id/resend
 */
export const resendInvitation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const consent = await prisma.consentGrant.findUnique({
            where: { id }
        });

        if (!consent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'CONSENT_NOT_FOUND',
                    message: 'Consent not found'
                }
            });
        }

        if (consent.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'CONSENT_NOT_PENDING',
                    message: 'Can only resend invitations for pending consents'
                }
            });
        }

        // TODO: Send email in production
        // await sendConsentEmail(consent.clinicianEmail, consent.token, consent);

        const auditLog = consent.auditLog ? JSON.parse(consent.auditLog as string) : [];
        auditLog.push({
            action: 'invitation_resent',
            timestamp: new Date(),
            notes: 'Invitation email resent'
        });

        await prisma.consentGrant.update({
            where: { id },
            data: { auditLog: JSON.stringify(auditLog) }
        });

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
