import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get dashboard stats for a child
 * GET /api/v1/parent/dashboard/stats?childId=xxx
 */
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { childId } = req.query;

        console.log('=== DASHBOARD STATS REQUEST ===');
        console.log('userId:', userId);
        console.log('childId from query:', childId);
        console.log('typeof childId:', typeof childId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Parent authentication required' }
            });
        }

        const parentId = user.parent.id;
        const personId = childId as string;

        console.log('parentId:', parentId);
        console.log('personId (for query):', personId);

        // Verify parent has access to this child
        if (personId) {
            const relationship = await prisma.parentChildView.findFirst({
                where: { parentId, personId }
            });

            if (!relationship) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'ACCESS_DENIED', message: 'Access denied to this child' }
                });
            }
        }

        // Get active screenings count (completed in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeScreenings = await prisma.screening.count({
            where: {
                personId,
                completedAt: { gte: thirtyDaysAgo }
            }
        });

        // Get active PEPs count
        const activePEPs = await prisma.educationPlan.count({
            where: {
                personId,
                planType: 'PEP',
                status: 'active'
            }
        });

        // Get pending recommendations count
        // const newRecommendations = await prisma.recommendation.count({
        //     where: {
        //         personId,
        //         status: 'pending'
        //     }
        // });
        const newRecommendations = 0;

        // Calculate milestone progress
        // const totalMilestones = await prisma.developmentalMilestone.count({
        //     where: { personId }
        // });

        // const achievedMilestones = await prisma.developmentalMilestone.count({
        //     where: {
        //         personId,
        //         achievedDate: { not: null }
        //     }
        // });

        const milestoneProgress = 0; // totalMilestones > 0
        // ? Math.round((achievedMilestones / totalMilestones) * 100)
        // : 0;

        res.json({
            success: true,
            data: {
                activeScreenings,
                pepsDue: activePEPs,
                newRecommendations,
                milestoneProgress
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'GET_STATS_FAILED', message: 'Failed to retrieve dashboard stats' }
        });
    }
};

/**
 * Get skill progress by domain for a child
 * GET /api/v1/parent/dashboard/skills?childId=xxx
 */
export const getSkillProgress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { childId } = req.query;

        if (!userId || !childId) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'childId is required' }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Parent authentication required' }
            });
        }

        const parentId = user.parent.id;
        const personId = childId as string;

        // Verify access
        const relationship = await prisma.parentChildView.findFirst({
            where: { parentId, personId }
        });

        if (!relationship) {
            return res.status(403).json({
                success: false,
                error: { code: 'ACCESS_DENIED', message: 'Access denied' }
            });
        }

        // Get all active education plans for this child
        const plans = await prisma.educationPlan.findMany({
            where: {
                personId,
                status: 'active'
            },
            include: {
                goals: {
                    where: {
                        progressStatus: { in: ['in_progress', 'completed'] }
                    }
                }
            }
        });

        // Calculate average progress by domain
        const domainProgress: { [key: string]: { total: number; count: number } } = {};

        plans.forEach(plan => {
            plan.goals.forEach(goal => {
                const domain = goal.domain || 'general';
                if (!domainProgress[domain]) {
                    domainProgress[domain] = { total: 0, count: 0 };
                }
                domainProgress[domain].total += goal.currentProgress || 0;
                domainProgress[domain].count += 1;
            });
        });

        // Calculate averages
        const skills = Object.entries(domainProgress).map(([domain, data]) => ({
            domain,
            progress: data.count > 0 ? Math.round(data.total / data.count) : 0,
            goalsCount: data.count
        }));

        res.json({
            success: true,
            data: skills
        });
    } catch (error) {
        console.error('Get skill progress error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'GET_SKILLS_FAILED', message: 'Failed to retrieve skill progress' }
        });
    }
};

/**
 * Get recent activities for a child
 * GET /api/v1/parent/dashboard/activities?childId=xxx
 */
export const getRecentActivities = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { childId } = req.query;

        if (!userId || !childId) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'childId is required' }
            });
        }

        // Get parent from user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Parent authentication required' }
            });
        }

        const parentId = user.parent.id;
        const personId = childId as string;

        // Verify access
        const relationship = await prisma.parentChildView.findFirst({
            where: { parentId, personId }
        });

        if (!relationship) {
            return res.status(403).json({
                success: false,
                error: { code: 'ACCESS_DENIED', message: 'Access denied' }
            });
        }

        // Get recent activities
        const activities = await prisma.activity.findMany({
            where: {
                personId,
                activityType: 'pep'
            },
            orderBy: [
                { lastCompletedAt: 'desc' },
                { createdAt: 'desc' }
            ],
            take: 5
        });

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Get recent activities error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'GET_ACTIVITIES_FAILED', message: 'Failed to retrieve activities' }
        });
    }
};
