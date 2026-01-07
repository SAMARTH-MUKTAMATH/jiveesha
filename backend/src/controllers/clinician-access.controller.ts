import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Validate Consent Token (Read-only Preview)
 * POST /api/v1/clinician/access-grants/validate
 */
export const validateConsentToken = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { token } = req.body;

        if (!token) {
            throw new AppError('Token is required', 400, 'VALIDATION_ERROR');
        }

        const normalizedToken = token.trim().toUpperCase();

        // Find pending grant with this token
        const grant = await prisma.accessGrant.findFirst({
            where: {
                token: normalizedToken,
                status: 'pending',
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

        if (grant.granteeEmail && grant.granteeEmail.toLowerCase() !== user.email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'This token was generated for a different email address'
                }
            });
        }

        // Return preview data without activating/saving anything
        res.json({
            success: true,
            data: {
                token: normalizedToken,
                patient: {
                    id: grant.person.id,
                    firstName: grant.person.firstName,
                    lastName: grant.person.lastName,
                    dateOfBirth: grant.person.dateOfBirth,
                    gender: grant.person.gender,
                    fullName: `${grant.person.firstName} ${grant.person.lastName}`
                },
                parent: {
                    name: grant.grantedByName,
                    email: grant.grantedByEmail
                },
                accessLevel: grant.accessLevel,
                expiresAt: grant.tokenExpiresAt
            }
        });

    } catch (error) {
        console.error('Validate consent token error:', error);
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
 * Claim Access Grant (Final Activation)
 * POST /api/v1/clinician/access-grants/claim
 */
export const claimAccessGrant = async (req: Request, res: Response) => {
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
                    tokenExpiresAt: { gt: new Date() }
                },
                include: { person: true }
            });

            if (!grant) {
                throw new AppError('Invalid or expired token', 404, 'INVALID_TOKEN');
            }

            // 2. Verify email if applicable
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

            if (grant.granteeEmail && grant.granteeEmail.toLowerCase() !== user.email.toLowerCase()) {
                throw new AppError('Access denied for this user', 403, 'ACCESS_DENIED');
            }

            // 3. Activate the grant
            const updatedGrant = await tx.accessGrant.update({
                where: { id: grant.id },
                data: {
                    status: 'active',
                    granteeId: userId,
                    activatedAt: new Date(),
                    token: null // Single-use token logic
                }
            });

            // 4. Update or create ClinicianPatientView
            const existingView = await tx.clinicianPatientView.findUnique({
                where: { personId: grant.personId }
            });

            if (existingView) {
                await tx.clinicianPatientView.update({
                    where: { personId: grant.personId },
                    data: { clinicianId: userId, caseStatus: 'active' }
                });
            } else {
                await tx.clinicianPatientView.create({
                    data: {
                        personId: grant.personId,
                        clinicianId: userId,
                        caseStatus: 'active',
                        primaryConcerns: 'Access granted via Parent Token'
                    }
                });
            }

            return { grant: updatedGrant, person: grant.person };
        });

        res.json({
            success: true,
            data: {
                grantId: result.grant.id,
                patientId: result.person.id,
                message: 'Access granted and patient linked successfully'
            }
        });

    } catch (error) {
        console.error('Claim access grant error:', error);
        if (error instanceof AppError) throw error;
        res.status(500).json({
            success: false,
            error: {
                code: 'CLAIM_FAILED',
                message: 'Failed to claim access grant'
            }
        });
    }
};
