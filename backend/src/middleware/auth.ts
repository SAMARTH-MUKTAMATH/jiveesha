import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userRole?: string;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authentication token provided', 401, 'NO_TOKEN');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AppError('No authentication token provided', 401, 'NO_TOKEN');
        }

        // DEVELOPMENT MODE BYPASS - Allow dev-token for testing
        if (process.env.NODE_ENV !== 'production') {
            if (token === 'dev-token') {
                // Find or use the first clinician user
                const clinician = await prisma.user.findFirst({
                    where: { role: 'clinician' },
                    select: { id: true, email: true, role: true }
                });

                if (clinician) {
                    req.userId = clinician.id;
                    req.userEmail = clinician.email;
                    req.userRole = clinician.role;
                    return next();
                }
            } else if (token === 'dev-token-parent') {
                // Find or use the first parent user
                const parent = await prisma.user.findFirst({
                    where: { role: 'parent' },
                    select: { id: true, email: true, role: true }
                });

                if (parent) {
                    req.userId = parent.id;
                    req.userEmail = parent.email;
                    req.userRole = parent.role;
                    return next();
                }
            }
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: string;
        };

        // Check if user exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, status: true, deletedAt: true }
        });

        if (!user || user.deletedAt) {
            throw new AppError('User not found', 401, 'USER_NOT_FOUND');
        }

        // Attach user info to request
        req.userId = user.id;
        req.userEmail = user.email;
        req.userRole = user.role;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED'));
        }
        next(error);
    }
};

export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: string;
        };

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        // Silently continue without auth
        next();
    }
};

export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
        }
        next();
    };
};
