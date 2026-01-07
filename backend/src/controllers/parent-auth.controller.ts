import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Parent registration
 * POST /api/v1/parent/auth/register
 */
export const register = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phone,
            preferredLanguage,
            emergencyContact,
            emergencyPhone,
            relationshipToChild
        } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['email, password, firstName, and lastName are required']
                }
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'EMAIL_EXISTS',
                    message: 'Email already registered'
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and parent profile in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user account
            // NOTE: User model in v2.0 only contains auth fields
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role: 'parent',
                    status: 'active',
                    emailVerified: false
                }
            });

            // Create parent profile
            // NOTE: Parent model doesn't have names or relationshipToChild
            const parent = await tx.parent.create({
                data: {
                    userId: user.id,
                    phone,
                    preferredLanguage: preferredLanguage || 'en',
                    emergencyContact,
                    emergencyPhone
                }
            });

            // Create clinician profile (for name storage - shared between clinicians and parents in this design)
            await tx.clinicianProfile.create({
                data: {
                    userId: user.id,
                    firstName,
                    lastName,
                    professionalTitle: 'Parent'
                }
            });

            return { user, parent };
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: result.user.id,
                role: 'parent',
                parentId: result.parent.id
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role
                },
                parent: result.parent,
                token
            },
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Parent registration error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'REGISTRATION_FAILED',
                message: 'Failed to register parent account',
                details: error instanceof Error ? error.message : String(error)
            }
        });
    }
};

/**
 * Parent login
 * POST /api/v1/parent/auth/login
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Email and password are required'
                }
            });
        }

        // Find user with parent profile
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                parent: true,
                clinicianProfile: true
            }
        });

        if (!user || user.role !== 'parent') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }
            });
        }

        // Check account status
        if (user.parent?.accountStatus !== 'active') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCOUNT_SUSPENDED',
                    message: 'Your account has been suspended'
                }
            });
        }

        // Update last login
        await prisma.parent.update({
            where: { id: user.parent.id },
            data: { lastLoginAt: new Date() }
        });

        // Generate token
        const token = jwt.sign(
            {
                userId: user.id,
                role: 'parent',
                parentId: user.parent.id
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.clinicianProfile?.firstName,
                    lastName: user.clinicianProfile?.lastName
                },
                parent: user.parent,
                token
            }
        });
    } catch (error) {
        console.error('Parent login error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'LOGIN_FAILED',
                message: 'Failed to login'
            }
        });
    }
};

/**
 * Get parent profile
 * GET /api/v1/parent/auth/me
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: {
                    include: {
                        childViews: {
                            include: {
                                person: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        gender: true
                                    }
                                }
                            }
                        }
                    }
                },
                clinicianProfile: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        // Transform children data
        const children = user.parent?.childViews?.map(view => ({
            id: view.person.id,
            firstName: view.person.firstName,
            lastName: view.person.lastName,
            dateOfBirth: view.person.dateOfBirth,
            gender: view.person.gender,
            relationship: view.relationshipType
        })) || [];

        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.clinicianProfile?.firstName,
                lastName: user.clinicianProfile?.lastName,
                parent: user.parent,
                children
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PROFILE_FAILED',
                message: 'Failed to retrieve profile'
            }
        });
    }
};

/**
 * Update parent profile
 * PUT /api/v1/parent/auth/profile
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            firstName,
            lastName,
            phone,
            emergencyContact,
            emergencyPhone,
            preferredLanguage,
            emailNotifications,
            smsNotifications
        } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true, clinicianProfile: true }
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

        // Update in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update profile name
            if (firstName || lastName) {
                await tx.clinicianProfile.update({
                    where: { userId },
                    data: {
                        firstName: firstName || user.clinicianProfile?.firstName,
                        lastName: lastName || user.clinicianProfile?.lastName
                    }
                });
            }

            // Update parent-specific fields
            const parent = await tx.parent.update({
                where: { id: user.parent!.id },
                data: {
                    phone,
                    emergencyContact,
                    emergencyPhone,
                    preferredLanguage,
                    emailNotifications,
                    smsNotifications
                }
            });

            return parent;
        });

        res.json({
            success: true,
            data: result,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PROFILE_FAILED',
                message: 'Failed to update profile'
            }
        });
    }
};

/**
 * Change password
 * POST /api/v1/parent/auth/change-password
 */
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Current password and new password are required'
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_PASSWORD',
                    message: 'Current password is incorrect'
                }
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword }
        });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CHANGE_PASSWORD_FAILED',
                message: 'Failed to change password'
            }
        });
    }
};
