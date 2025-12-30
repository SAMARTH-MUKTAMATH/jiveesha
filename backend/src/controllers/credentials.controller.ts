import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create credential
export const createCredential = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            credential_type,
            credential_number,
            issuing_authority,
            issue_date,
            expiry_date
        } = req.body;

        if (!credential_type) {
            throw new AppError('Credential type is required', 400, 'VALIDATION_ERROR');
        }

        const documentUrl = req.file ? `/uploads/credentials/${req.file.filename}` : null;

        const credential = await prisma.credential.create({
            data: {
                userId: req.userId!,
                credentialType: credential_type,
                credentialNumber: credential_number,
                issuingAuthority: issuing_authority,
                issueDate: issue_date ? new Date(issue_date) : null,
                expiryDate: expiry_date ? new Date(expiry_date) : null,
                documentUrl,
                verificationStatus: 'pending'
            }
        });

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId: req.userId,
                action: 'CREDENTIAL_CREATED',
                resourceType: 'credential',
                resourceId: credential.id
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: credential.id,
                credential_type: credential.credentialType,
                credential_number: credential.credentialNumber,
                issuing_authority: credential.issuingAuthority,
                issue_date: credential.issueDate,
                expiry_date: credential.expiryDate,
                document_url: credential.documentUrl,
                verification_status: credential.verificationStatus,
                created_at: credential.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all credentials for user
export const getCredentials = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const credentials = await prisma.credential.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: credentials.map(c => ({
                id: c.id,
                credential_type: c.credentialType,
                credential_number: c.credentialNumber,
                issuing_authority: c.issuingAuthority,
                issue_date: c.issueDate,
                expiry_date: c.expiryDate,
                document_url: c.documentUrl,
                verification_status: c.verificationStatus,
                verification_notes: c.verificationNotes,
                verified_at: c.verifiedAt,
                created_at: c.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Get single credential
export const getCredential = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const credential = await prisma.credential.findFirst({
            where: { id, userId: req.userId }
        });

        if (!credential) {
            throw new AppError('Credential not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: {
                id: credential.id,
                credential_type: credential.credentialType,
                credential_number: credential.credentialNumber,
                issuing_authority: credential.issuingAuthority,
                issue_date: credential.issueDate,
                expiry_date: credential.expiryDate,
                document_url: credential.documentUrl,
                verification_status: credential.verificationStatus,
                verification_notes: credential.verificationNotes,
                verified_at: credential.verifiedAt,
                rejection_reason: credential.rejectionReason,
                created_at: credential.createdAt,
                updated_at: credential.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update credential
export const updateCredential = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const {
            credential_type,
            credential_number,
            issuing_authority,
            issue_date,
            expiry_date
        } = req.body;

        const existing = await prisma.credential.findFirst({
            where: { id, userId: req.userId }
        });

        if (!existing) {
            throw new AppError('Credential not found', 404, 'NOT_FOUND');
        }

        const documentUrl = req.file
            ? `/uploads/credentials/${req.file.filename}`
            : existing.documentUrl;

        const credential = await prisma.credential.update({
            where: { id },
            data: {
                credentialType: credential_type || existing.credentialType,
                credentialNumber: credential_number,
                issuingAuthority: issuing_authority,
                issueDate: issue_date ? new Date(issue_date) : existing.issueDate,
                expiryDate: expiry_date ? new Date(expiry_date) : existing.expiryDate,
                documentUrl,
                // Reset verification when credential is updated
                verificationStatus: 'pending',
                verifiedAt: null,
                verifiedBy: null
            }
        });

        res.json({
            success: true,
            data: {
                id: credential.id,
                credential_type: credential.credentialType,
                credential_number: credential.credentialNumber,
                verification_status: credential.verificationStatus,
                updated_at: credential.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete credential
export const deleteCredential = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const existing = await prisma.credential.findFirst({
            where: { id, userId: req.userId }
        });

        if (!existing) {
            throw new AppError('Credential not found', 404, 'NOT_FOUND');
        }

        await prisma.credential.delete({ where: { id } });

        res.json({
            success: true,
            data: {
                message: 'Credential deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};
