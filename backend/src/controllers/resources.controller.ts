import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all resources (with filtering)
 * GET /api/v1/parent/resources
 */
export const getResources = async (req: Request, res: Response) => {
    try {
        const {
            resourceType,
            category,
            ageRange,
            difficulty,
            search,
            featured
        } = req.query;

        const where: any = { isPublished: true };

        if (resourceType) where.resourceType = resourceType as string;
        if (category) where.category = category as string;
        if (ageRange) where.ageRange = ageRange as string;
        if (difficulty) where.difficulty = difficulty as string;
        if (featured === 'true') where.isFeatured = true;

        // SQLite doesn't support case-insensitive contains, use basic contains
        if (search) {
            where.OR = [
                { title: { contains: search as string } },
                { description: { contains: search as string } }
            ];
        }

        const resources = await prisma.resource.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' },
                { views: 'desc' }
            ]
        });

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_RESOURCES_FAILED',
                message: 'Failed to retrieve resources'
            }
        });
    }
};

/**
 * Get resource by ID (increments view count)
 * GET /api/v1/parent/resources/:id
 */
export const getResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'Resource not found'
                }
            });
        }

        // Increment view count
        await prisma.resource.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        console.error('Get resource error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_RESOURCE_FAILED',
                message: 'Failed to retrieve resource'
            }
        });
    }
};

/**
 * Get featured resources
 * GET /api/v1/parent/resources/featured
 */
export const getFeaturedResources = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;

        const resources = await prisma.resource.findMany({
            where: {
                isPublished: true,
                isFeatured: true
            },
            orderBy: { views: 'desc' },
            take: Number(limit)
        });

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        console.error('Get featured resources error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_FEATURED_FAILED',
                message: 'Failed to retrieve featured resources'
            }
        });
    }
};

/**
 * Get resources by category
 * GET /api/v1/parent/resources/category/:category
 */
export const getResourcesByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const resources = await prisma.resource.findMany({
            where: {
                category,
                isPublished: true
            },
            orderBy: { views: 'desc' }
        });

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        console.error('Get resources by category error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CATEGORY_FAILED',
                message: 'Failed to retrieve resources'
            }
        });
    }
};
