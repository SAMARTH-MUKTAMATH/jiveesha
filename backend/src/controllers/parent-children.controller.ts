import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { transformToChild } from '../utils/transformers';
import { toSnakeCase } from '../utils/case-transformer';

const prisma = new PrismaClient();

/**
 * GET /api/v1/parent/children
 * Get all children for authenticated parent
 */
export const getChildren = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        // Get parent profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Get all children views for this parent
        const views = await prisma.parentChildView.findMany({
            where: { parentId: user.parent.id },
            include: { person: true },
            orderBy: { addedAt: 'desc' }
        });

        // Transform to Child interface (snake_case, middleware will convert to camelCase)
        const children = views.map(transformToChild);

        console.log('[DEBUG] getChildren returning:', JSON.stringify(children.map(c => ({ id: c.id, name: `${c.first_name} ${c.last_name}` })), null, 2));

        res.json({
            success: true,
            data: children
        });
    } catch (error) {
        console.error('Error fetching children:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch children'
            }
        });
    }
};

/**
 * GET /api/v1/parent/children/:id
 * Get single child by person ID
 */
export const getChild = async (req: Request, res: Response) => {
    try {
        const { personId } = req.params;
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Find view for this parent and person
        console.log('getChild - Looking for personId:', personId, 'parentId:', user.parent.id);
        const view = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
                personId
            },
            include: { person: true }
        });

        console.log('getChild - Found view:', view ? {
            viewId: view.id,
            personId: view.personId,
            firstName: view.person.firstName,
            lastName: view.person.lastName
        } : 'null');

        if (!view) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Child not found'
                }
            });
        }

        const child = transformToChild(view);

        res.json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Error fetching child:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch child'
            }
        });
    }
};

/**
 * POST /api/v1/parent/children
 * Add new child
 */
export const addChild = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        // Get parent profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Convert request body to snake_case
        const data = toSnakeCase(req.body);

        // Validate required fields
        if (!data.first_name || !data.last_name || !data.date_of_birth || !data.gender) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields',
                    details: ['firstName, lastName, dateOfBirth, and gender are required']
                }
            });
        }

        // Create Person + ParentChildView in transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Person
            const person = await tx.person.create({
                data: {
                    firstName: data.first_name,
                    lastName: data.last_name,
                    middleName: data.middle_name,
                    dateOfBirth: new Date(data.date_of_birth),
                    gender: data.gender,
                    placeOfBirth: data.place_of_birth,
                    addressLine1: data.address_line1,
                    addressLine2: data.address_line2,
                    city: data.city,
                    state: data.state,
                    pinCode: data.pin_code,
                    country: data.country || 'India',
                    udidNumber: data.udid_number,
                    primaryLanguage: data.primary_language,
                    languagesSpoken: data.languages_spoken ? JSON.stringify(data.languages_spoken) : '[]'
                }
            });

            // 2. Create ParentChildView
            const view = await tx.parentChildView.create({
                data: {
                    personId: person.id,
                    parentId: user.parent!.id,
                    nickname: data.nickname,
                    medicalHistory: data.medical_history,
                    currentConcerns: data.current_concerns,
                    developmentalNotes: data.developmental_notes,
                    parentNotes: data.parent_notes,
                    allergyNotes: data.allergy_notes,
                    relationshipType: data.relationship_type || 'parent',
                    isPrimaryCaregiver: data.is_primary_caregiver !== undefined ? data.is_primary_caregiver : true,
                    preferredContactMethod: data.preferred_contact_method,
                    reminderPreferences: data.reminder_preferences ? JSON.stringify(data.reminder_preferences) : '{}'
                }
            });

            return { person, view };
        });

        // Fetch complete view with person
        const completeView = await prisma.parentChildView.findUnique({
            where: { id: result.view.id },
            include: { person: true }
        });

        const child = transformToChild(completeView!);

        res.status(201).json({
            success: true,
            data: child,
            message: 'Child added successfully'
        });
    } catch (error) {
        console.error('Error adding child:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add child'
            }
        });
    }
};

/**
 * PUT /api/v1/parent/children/:id
 * Update child
 */
export const updateChild = async (req: Request, res: Response) => {
    try {
        const { id: personId } = req.params;
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Verify ownership
        const existing = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
                personId
            }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Child not found'
                }
            });
        }

        // Convert request body to snake_case
        const updates = toSnakeCase(req.body);

        // Update in transaction
        await prisma.$transaction(async (tx) => {
            // Person updates (demographic data)
            const personUpdates: any = {};
            if (updates.first_name !== undefined) personUpdates.firstName = updates.first_name;
            if (updates.last_name !== undefined) personUpdates.lastName = updates.last_name;
            if (updates.middle_name !== undefined) personUpdates.middleName = updates.middle_name;
            if (updates.date_of_birth !== undefined) personUpdates.dateOfBirth = new Date(updates.date_of_birth);
            if (updates.gender !== undefined) personUpdates.gender = updates.gender;
            if (updates.place_of_birth !== undefined) personUpdates.placeOfBirth = updates.place_of_birth;
            if (updates.address_line1 !== undefined) personUpdates.addressLine1 = updates.address_line1;
            if (updates.address_line2 !== undefined) personUpdates.addressLine2 = updates.address_line2;
            if (updates.city !== undefined) personUpdates.city = updates.city;
            if (updates.state !== undefined) personUpdates.state = updates.state;
            if (updates.pin_code !== undefined) personUpdates.pinCode = updates.pin_code;
            if (updates.country !== undefined) personUpdates.country = updates.country;
            if (updates.udid_number !== undefined) personUpdates.udidNumber = updates.udid_number;
            if (updates.primary_language !== undefined) personUpdates.primaryLanguage = updates.primary_language;
            if (updates.languages_spoken !== undefined) personUpdates.languagesSpoken = JSON.stringify(updates.languages_spoken);

            if (Object.keys(personUpdates).length > 0) {
                await tx.person.update({
                    where: { id: personId },
                    data: personUpdates
                });
            }

            // View updates (parent-specific data)
            const viewUpdates: any = {};
            if (updates.nickname !== undefined) viewUpdates.nickname = updates.nickname;
            if (updates.medical_history !== undefined) viewUpdates.medicalHistory = updates.medical_history;
            if (updates.current_concerns !== undefined) viewUpdates.currentConcerns = updates.current_concerns;
            if (updates.developmental_notes !== undefined) viewUpdates.developmentalNotes = updates.developmental_notes;
            if (updates.parent_notes !== undefined) viewUpdates.parentNotes = updates.parent_notes;
            if (updates.allergy_notes !== undefined) viewUpdates.allergyNotes = updates.allergy_notes;
            if (updates.relationship_type !== undefined) viewUpdates.relationshipType = updates.relationship_type;
            if (updates.is_primary_caregiver !== undefined) viewUpdates.isPrimaryCaregiver = updates.is_primary_caregiver;
            if (updates.preferred_contact_method !== undefined) viewUpdates.preferredContactMethod = updates.preferred_contact_method;
            if (updates.reminder_preferences !== undefined) viewUpdates.reminderPreferences = JSON.stringify(updates.reminder_preferences);

            if (Object.keys(viewUpdates).length > 0) {
                await tx.parentChildView.update({
                    where: { id: existing.id },
                    data: viewUpdates
                });
            }
        });

        // Fetch updated data
        const updated = await prisma.parentChildView.findFirst({
            where: { personId },
            include: { person: true }
        });

        const child = transformToChild(updated!);

        res.json({
            success: true,
            data: child,
            message: 'Child updated successfully'
        });
    } catch (error) {
        console.error('Error updating child:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update child'
            }
        });
    }
};

/**
 * DELETE /api/v1/parent/children/:id
 * Delete child (soft delete Person if no other views exist)
 */
export const deleteChild = async (req: Request, res: Response) => {
    try {
        const { id: personId } = req.params;
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true }
        });

        if (!user || !user.parent) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Parent profile not found'
                }
            });
        }

        // Verify ownership
        const existing = await prisma.parentChildView.findFirst({
            where: {
                parentId: user.parent.id,
                personId
            }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Child not found'
                }
            });
        }

        // Check if person has other views
        const hasClinicianView = await prisma.clinicianPatientView.findFirst({
            where: { personId }
        });

        const hasSchoolView = await prisma.schoolStudentView.findFirst({
            where: { personId }
        });

        await prisma.$transaction(async (tx) => {
            // Delete parent view
            await tx.parentChildView.delete({
                where: { id: existing.id }
            });

            // If no other views exist, soft delete person
            if (!hasClinicianView && !hasSchoolView) {
                await tx.person.update({
                    where: { id: personId },
                    data: { deletedAt: new Date() }
                });
            }
        });

        res.json({
            success: true,
            data: null,
            message: 'Child deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting child:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete child'
            }
        });
    }
};
