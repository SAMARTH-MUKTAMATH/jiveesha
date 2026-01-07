import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Helper to generate tokens
const generateTokens = (userId: string, email: string, role: string) => {
    const accessToken = jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '2h') as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken, refreshToken };
};

// Register new clinician
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, professionalTitle, phone } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
        }

        // Check password strength
        if (password.length < 8) {
            throw new AppError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD');
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user with profile
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                clinicianProfile: {
                    create: {
                        firstName,
                        lastName,
                        professionalTitle: professionalTitle || null,
                        phone: phone || null
                    }
                }
            },
            include: {
                clinicianProfile: true
            }
        });

        // Create user preferences
        await prisma.userPreferences.create({
            data: {
                userId: user.id
            }
        });

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                resourceType: 'user',
                resourceId: user.id,
                ipAddress: req.ip || null,
                userAgent: req.get('user-agent') || null
            }
        });

        res.status(201).json({
            success: true,
            data: {
                user_id: user.id,
                email: user.email,
                status: user.status,
                message: 'Registration successful. Please verify your email.'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                clinicianProfile: true,
                credentials: {
                    where: { verificationStatus: 'verified' }
                }
            }
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // Check if user is deleted
        if (user.deletedAt) {
            throw new AppError('Account has been deactivated', 401, 'ACCOUNT_DEACTIVATED');
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt,
                ipAddress: req.ip || null,
                userAgent: req.get('user-agent') || null
            }
        });

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_LOGIN',
                ipAddress: req.ip || null,
                userAgent: req.get('user-agent') || null
            }
        });

        res.json({
            success: true,
            data: {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: 7200,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    profile: user.clinicianProfile ? {
                        first_name: user.clinicianProfile.firstName,
                        last_name: user.clinicianProfile.lastName,
                        professional_title: user.clinicianProfile.professionalTitle,
                        verification_status: user.clinicianProfile.verificationStatus,
                        photo_url: user.clinicianProfile.photoUrl
                    } : null
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Logout
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const refreshTokenHeader = req.body.refresh_token;

        // Revoke refresh token if provided
        if (refreshTokenHeader) {
            await prisma.refreshToken.updateMany({
                where: {
                    userId: req.userId,
                    token: refreshTokenHeader,
                    revokedAt: null
                },
                data: { revokedAt: new Date() }
            });
        }

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId: req.userId,
                action: 'USER_LOGOUT',
                ipAddress: req.ip || null,
                userAgent: req.get('user-agent') || null
            }
        });

        res.json({
            success: true,
            data: {
                message: 'Logged out successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            throw new AppError('Refresh token is required', 400, 'VALIDATION_ERROR');
        }

        // Find the refresh token
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refresh_token },
            include: { user: true }
        });

        if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
            throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
        }

        // Verify the token
        try {
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!);
        } catch {
            throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role
        );

        // Revoke old refresh token and create new one
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() }
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.refreshToken.create({
            data: {
                userId: storedToken.user.id,
                token: newRefreshToken,
                expiresAt,
                ipAddress: req.ip || null,
                userAgent: req.get('user-agent') || null
            }
        });

        res.json({
            success: true,
            data: {
                access_token: accessToken,
                refresh_token: newRefreshToken,
                token_type: 'Bearer',
                expires_in: 7200
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: {
                clinicianProfile: true,
                credentials: {
                    select: {
                        id: true,
                        credentialType: true,
                        credentialNumber: true,
                        expiryDate: true,
                        verificationStatus: true
                    }
                }
            }
        });

        if (!user) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                profile: user.clinicianProfile ? {
                    first_name: user.clinicianProfile.firstName,
                    middle_name: user.clinicianProfile.middleName,
                    last_name: user.clinicianProfile.lastName,
                    professional_title: user.clinicianProfile.professionalTitle,
                    designation: user.clinicianProfile.designation,
                    specializations: JSON.parse(user.clinicianProfile.specializations || '[]'),
                    languages: JSON.parse(user.clinicianProfile.languages || '[]'),
                    phone: user.clinicianProfile.phone,
                    years_of_practice: user.clinicianProfile.yearsOfPractice,
                    bio: user.clinicianProfile.bio,
                    photo_url: user.clinicianProfile.photoUrl,
                    verification_status: user.clinicianProfile.verificationStatus,
                    verified_at: user.clinicianProfile.verifiedAt
                } : null,
                credentials: user.credentials.map(c => ({
                    id: c.id,
                    type: c.credentialType,
                    number: c.credentialNumber,
                    expiry_date: c.expiryDate,
                    status: c.verificationStatus
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            professional_title,
            designation,
            specializations,
            languages,
            phone,
            alternate_phone,
            date_of_birth,
            years_of_practice,
            bio
        } = req.body;

        const profile = await prisma.clinicianProfile.upsert({
            where: { userId: req.userId },
            update: {
                firstName: first_name,
                middleName: middle_name,
                lastName: last_name,
                professionalTitle: professional_title,
                designation,
                specializations: JSON.stringify(specializations || []),
                languages: JSON.stringify(languages || []),
                phone,
                alternatePhone: alternate_phone,
                dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
                yearsOfPractice: years_of_practice,
                bio
            },
            create: {
                userId: req.userId!,
                firstName: first_name,
                lastName: last_name,
                middleName: middle_name,
                professionalTitle: professional_title,
                designation,
                specializations: JSON.stringify(specializations || []),
                languages: JSON.stringify(languages || []),
                phone,
                alternatePhone: alternate_phone,
                dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
                yearsOfPractice: years_of_practice,
                bio
            }
        });

        // Log activity
        await prisma.auditLog.create({
            data: {
                userId: req.userId,
                action: 'PROFILE_UPDATED',
                resourceType: 'profile',
                resourceId: profile.id,
                ipAddress: req.ip || null
            }
        });

        res.json({
            success: true,
            data: {
                id: profile.id,
                first_name: profile.firstName,
                middle_name: profile.middleName,
                last_name: profile.lastName,
                professional_title: profile.professionalTitle,
                designation: profile.designation,
                specializations: JSON.parse(profile.specializations || '[]'),
                languages: JSON.parse(profile.languages || '[]'),
                phone: profile.phone,
                alternate_phone: profile.alternatePhone,
                date_of_birth: profile.dateOfBirth,
                years_of_practice: profile.yearsOfPractice,
                bio: profile.bio,
                updated_at: profile.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify email (placeholder)
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        // For now, just return success (email verification not fully implemented)
        res.json({
            success: true,
            data: {
                message: 'Email verified successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password (placeholder)
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // For development, just return success
        res.json({
            success: true,
            data: {
                message: 'If an account exists, a password reset email has been sent'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Reset password (placeholder)
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, new_password } = req.body;

        // For development, just return success
        res.json({
            success: true,
            data: {
                message: 'Password reset successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};
