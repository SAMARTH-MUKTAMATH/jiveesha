import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Validate Consent Token for Parent (Read-only Preview)
 * POST /api/v1/parent/access-grants/validate
 */
export const validateConsentTokenForParent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { token } = req.body;

        if (!token) {
            throw new AppError('Token is required', 400, 'VALIDATION_ERROR');
        }

        const normalizedToken = token.trim().toUpperCase();

        // Find pending grant with this token meant for a parent
        const grant = await prisma.accessGrant.findFirst({
            where: {
                token: normalizedToken,
                status: 'pending',
                granteeType: 'parent',
                tokenExpiresAt: {
                    gt: new Date()
                }
            },
            include: {
                person: true
            }
        });

        if (!grant) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired consent token'
                }
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

        // If granteeEmail was specified, enforce it
        if (grant.granteeEmail && grant.granteeEmail.toLowerCase() !== user.email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'This token was generated for a different email address'
                }
            });
        }

        // Return preview data
        res.json({
            success: true,
            data: {
                token: normalizedToken,
                child: {
                    id: grant.person.id,
                    firstName: grant.person.firstName,
                    lastName: grant.person.lastName,
                    dateOfBirth: grant.person.dateOfBirth,
                    gender: grant.person.gender,
                    fullName: `${grant.person.firstName} ${grant.person.lastName}`
                },
                grantor: {
                    name: grant.grantedByName,
                    type: grant.grantorType
                },
                accessLevel: grant.accessLevel,
                expiresAt: grant.tokenExpiresAt
            }
        });

    } catch (error) {
        console.error('Validate parent consent token error:', error);
        if (error instanceof AppError) throw error;
        res.status(500).json({
            success: false,
            error: {
                code: 'VALIDATION_FAILED',
                message: 'Failed to validate token'
            }
        });
    }
};

/**
 * Claim Child Access for Parent (Final Activation)
 * POST /api/v1/parent/access-grants/claim
 */
export const claimChildAccess = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { token } = req.body;

        if (!token) {
            throw new AppError('Token is required', 400, 'VALIDATION_ERROR');
        }

        const normalizedToken = token.trim().toUpperCase();

        // Transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find and verify grant again
            const grant = await tx.accessGrant.findFirst({
                where: {
                    token: normalizedToken,
                    status: 'pending',
                    granteeType: 'parent',
                    tokenExpiresAt: { gt: new Date() }
                },
                include: { person: true }
            });

            if (!grant) {
                throw new AppError('Invalid or expired token', 404, 'INVALID_TOKEN');
            }

            // 2. Verify user and get parent profile
            const user = await tx.user.findUnique({
                where: { id: userId },
                include: { parent: true }
            });

            if (!user || !user.parent) {
                throw new AppError('Parent profile not found', 404, 'PARENT_NOT_FOUND');
            }

            if (grant.granteeEmail && grant.granteeEmail.toLowerCase() !== user.email.toLowerCase()) {
                throw new AppError('Access denied for this user', 403, 'ACCESS_DENIED');
            }

            // 3. Activate the grant
            const updatedGrant = await tx.accessGrant.update({
                where: { id: grant.id },
                data: {
                    status: 'active',
                    granteeId: user.parent.id, // Linked to parent ID
                    activatedAt: new Date(),
                    token: null // Single-use
                }
            });

            // 4. Update or create ParentChildView to link the parent to the child
            const existingView = await tx.parentChildView.findFirst({
                where: {
                    personId: grant.personId,
                    parentId: user.parent.id
                }
            });

            if (!existingView) {
                await tx.parentChildView.create({
                    data: {
                        personId: grant.personId,
                        parentId: user.parent.id,
                        relationshipType: 'guardian', // Default
                        isPrimaryCaregiver: false,
                        currentConcerns: 'Added via Token'
                    }
                });
            }

            return { grant: updatedGrant, person: grant.person };
        });

        res.json({
            success: true,
            data: {
                grantId: result.grant.id,
                childId: result.person.id,
                message: 'Child added successfully to your profile'
            }
        });

    } catch (error) {
        console.error('Claim parent access grant error:', error);
        if (error instanceof AppError) throw error;
        res.status(500).json({
            success: false,
            error: {
                code: 'CLAIM_FAILED',
                message: 'Failed to claim child access'
            }
        });
    }
};
