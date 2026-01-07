
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMockToken() {
    try {
        console.log('Finding a parent and child...');
        const parent = await prisma.parent.findFirst({
            include: { user: true }
        });

        if (!parent) {
            console.error('No parent found in DB. Please seed the database first.');
            return;
        }

        const child = await prisma.person.findFirst({
            where: {
                parentViews: {
                    some: {
                        parentId: parent.id
                    }
                }
            }
        });

        if (!child) {
            console.error('No child found for this parent.');
            return;
        }

        // Check if user has names, if not filter or use email
        const user = parent.user;
        const firstName = (user as any).firstName || (user as any).first_name || 'Parent';
        const lastName = (user as any).lastName || (user as any).last_name || 'User';

        console.log(`Found Parent: ${firstName} ${lastName} (${parent.id})`);
        console.log(`Found Child: ${child.firstName} ${child.lastName} (${child.id})`);

        const token = '12345678'; // Fixed 8-char token

        console.log(`Creating AccessGrant with token: ${token}`);

        const grant = await prisma.accessGrant.create({
            data: {
                token: token,
                grantorType: 'parent',
                grantorId: parent.id,
                granteeType: 'clinician',
                granteeId: '', // Unclaimed
                personId: child.id,
                permissions: JSON.stringify({ view: true, edit: true }),
                accessLevel: 'full',
                status: 'pending',
                tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
                grantedByName: `${firstName} ${lastName}`,
                grantedByEmail: parent.user.email,
                granteeEmail: '', // Open invite
            }
        });

        console.log('AccessGrant created successfully:', grant.id);
        console.log('You can now use token "12345678" in the Consent Center.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createMockToken();
