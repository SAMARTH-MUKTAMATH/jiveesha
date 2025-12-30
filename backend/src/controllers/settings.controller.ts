import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get preferences
export const getPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let prefs = await prisma.userPreferences.findUnique({
            where: { userId: req.userId }
        });

        if (!prefs) {
            prefs = await prisma.userPreferences.create({
                data: { userId: req.userId! }
            });
        }

        res.json({
            success: true,
            data: {
                language: prefs.language,
                timezone: prefs.timezone,
                date_format: prefs.dateFormat,
                time_format: prefs.timeFormat,
                theme: prefs.theme
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update preferences
export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { language, timezone, date_format, time_format, theme } = req.body;

        const prefs = await prisma.userPreferences.upsert({
            where: { userId: req.userId },
            update: {
                language,
                timezone,
                dateFormat: date_format,
                timeFormat: time_format,
                theme
            },
            create: {
                userId: req.userId!,
                language,
                timezone,
                dateFormat: date_format,
                timeFormat: time_format,
                theme
            }
        });

        res.json({
            success: true,
            data: {
                language: prefs.language,
                timezone: prefs.timezone,
                date_format: prefs.dateFormat,
                time_format: prefs.timeFormat,
                theme: prefs.theme,
                updated_at: prefs.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get notification settings
export const getNotificationSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let prefs = await prisma.userPreferences.findUnique({
            where: { userId: req.userId }
        });

        if (!prefs) {
            prefs = await prisma.userPreferences.create({
                data: { userId: req.userId! }
            });
        }

        res.json({
            success: true,
            data: {
                email: prefs.notificationEmail,
                sms: prefs.notificationSms,
                push: prefs.notificationPush,
                settings: prefs.notificationSettings
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update notification settings
export const updateNotificationSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, sms, push, settings } = req.body;

        const prefs = await prisma.userPreferences.upsert({
            where: { userId: req.userId },
            update: {
                notificationEmail: email,
                notificationSms: sms,
                notificationPush: push,
                notificationSettings: settings || {}
            },
            create: {
                userId: req.userId!,
                notificationEmail: email,
                notificationSms: sms,
                notificationPush: push,
                notificationSettings: settings || {}
            }
        });

        res.json({
            success: true,
            data: {
                email: prefs.notificationEmail,
                sms: prefs.notificationSms,
                push: prefs.notificationPush,
                updated_at: prefs.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};
