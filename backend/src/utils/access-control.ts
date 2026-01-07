import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AccessorType = 'parent' | 'clinician' | 'school';

/**
 * Check if accessor has permission to access person
 * Checks both direct ownership (via view) and granted access
 */
export async function checkPersonAccess(
    accessorType: AccessorType,
    accessorId: string,
    personId: string
): Promise<boolean> {
    // Check direct ownership via view
    if (accessorType === 'parent') {
        const view = await prisma.parentChildView.findFirst({
            where: {
                parentId: accessorId,
                personId
            }
        });
        if (view) return true;
    }

    if (accessorType === 'clinician') {
        const view = await prisma.clinicianPatientView.findFirst({
            where: {
                clinicianId: accessorId,
                personId
            }
        });
        if (view) return true;
    }

    if (accessorType === 'school') {
        const view = await prisma.schoolStudentView.findFirst({
            where: {
                schoolId: accessorId,
                personId
            }
        });
        if (view) return true;
    }

    // Check access grant
    const grant = await prisma.accessGrant.findFirst({
        where: {
            granteeType: accessorType,
            granteeId: accessorId,
            personId,
            status: 'active',
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        }
    });

    return !!grant;
}

/**
 * Get access permissions for a person
 * Returns detailed permission object
 */
export async function getPersonPermissions(
    accessorType: AccessorType,
    accessorId: string,
    personId: string
) {
    // Check if owner (full permissions)
    let isOwner = false;

    if (accessorType === 'parent') {
        const view = await prisma.parentChildView.findFirst({
            where: { parentId: accessorId, personId }
        });
        isOwner = !!view;
    } else if (accessorType === 'clinician') {
        const view = await prisma.clinicianPatientView.findFirst({
            where: { clinicianId: accessorId, personId }
        });
        isOwner = !!view;
    } else if (accessorType === 'school') {
        const view = await prisma.schoolStudentView.findFirst({
            where: { schoolId: accessorId, personId }
        });
        isOwner = !!view;
    }

    if (isOwner) {
        return {
            canView: true,
            canEdit: true,
            canDelete: true,
            canShare: true,
            isOwner: true
        };
    }

    // Check grant permissions
    const grant = await prisma.accessGrant.findFirst({
        where: {
            granteeType: accessorType,
            granteeId: accessorId,
            personId,
            status: 'active',
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        }
    });

    if (!grant) {
        return {
            canView: false,
            canEdit: false,
            canDelete: false,
            canShare: false,
            isOwner: false
        };
    }

    const permissions = JSON.parse(grant.permissions || '{}');

    return {
        canView: permissions.view || permissions.viewDemographics || false,
        canEdit: permissions.edit || permissions.editNotes || false,
        canDelete: false, // Never allow delete via grant
        canShare: false,   // Never allow sharing via grant
        isOwner: false,
        customPermissions: permissions
    };
}

/**
 * Require person access or throw error
 * Middleware helper function
 */
export async function requirePersonAccess(
    accessorType: AccessorType,
    accessorId: string,
    personId: string
): Promise<void> {
    const hasAccess = await checkPersonAccess(accessorType, accessorId, personId);

    if (!hasAccess) {
        throw new Error('ACCESS_DENIED');
    }
}
