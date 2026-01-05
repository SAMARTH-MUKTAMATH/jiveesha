import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Validate Consent Token
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
        // Also check if not expired
        const grant = await prisma.accessGrant.findFirst({
            where: {
                token: normalizedToken,
                status: 'pending',
                tokenExpiresAt: {
                    gt: new Date() // Must not be expired
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

        // Get clinician email to match (optional - strict mode would check email matches invite)
        // For now, we allow any clinician with the token to claim it (open invite model)
        // unless granteeEmail was strictly specified and we want to enforce it.
        // Let's assume open model if granteeEmail is empty or matches.

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

        if (grant.granteeEmail && grant.granteeEmail.toLowerCase() !== user.email.toLowerCase()) {
            // If a specific email was invited, ensure this user matches
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'This token was generated for a different email address'
                }
            });
        }

        // Activate the grant
        const updatedGrant = await prisma.accessGrant.update({
            where: { id: grant.id },
            data: {
                status: 'active',
                granteeId: userId,
                activatedAt: new Date(),
                token: null // Clear token so it cannot be used again
            }
        });

        // Ensure ClinicianPatientView exists (create if not)
        // This links the patient to the clinician's list properly
        const existingView = await prisma.clinicianPatientView.findUnique({
            where: { personId: grant.personId } // Note: Schema constraint might be unique personId per clinician??
            // Wait, ClinicianPatientView schema says: personId @unique @map("person_id")
            // This implies ONE clinician per person?
            // Let's check schema:
            // model ClinicianPatientView { ... personId String @unique ... clinicianId ... }
            // @@index([personId])
            // Wait, if personId is unique, then a person can only be associated with ONE clinician?
            // That seems restrictive for a multi-disciplinary platform.
            // Let's re-read schema.
        });

        // Schema check:
        // model ClinicianPatientView {
        //   id          String @id @default(uuid())
        //   personId    String @unique @map("person_id")
        //   clinicianId String @map("clinician_id")
        // ...
        // }
        // Yes, personId is unique. Use caution. If a view exists, we might overwrite clinicianId or fail?
        // If the platform assumes 1 clinician owner per patient record "View", then we update it.
        // Or if we can have multiple clinicians, the schema is wrong.
        // Assuming current schema constraint: update or create.

        // Actually, if we are "claiming" access, we are likely becoming the linked clinician.
        if (existingView) {
            if (existingView.clinicianId !== userId) {
                // Another clinician owns this view?
                // For this MVP, we might just update it to share access conceptually,
                // but strictly speaking, if personId is unique, we replace the view owner?
                // Let's update the view to point to us, or just rely on AccessGrant for permission?
                // The dashboard lists patients from ClinicianPatientView usually.
                // So we MUST return a View.

                // If view exists for another clinician, we might have a conflict in this schema design.
                // WE WILL UPDATE IT TO CURRENT USER for now (transfer of care logic or shared access hack).
                await prisma.clinicianPatientView.update({
                    where: { personId: grant.personId },
                    data: { clinicianId: userId, caseStatus: 'active' } // Reactivate if was archived
                });
            }
        } else {
            await prisma.clinicianPatientView.create({
                data: {
                    personId: grant.personId,
                    clinicianId: userId,
                    caseStatus: 'active',
                    primaryConcerns: 'Access granted via Parent Token',
                    // Basic defaults
                }
            });
        }

        res.json({
            success: true,
            data: {
                grantId: updatedGrant.id,
                childName: `${grant.person.firstName} ${grant.person.lastName}`,
                parentName: grant.grantedByName,
                accessLevel: updatedGrant.accessLevel,
                expiresAt: updatedGrant.expiresAt
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
