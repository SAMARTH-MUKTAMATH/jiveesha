
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listLatestGrants() {
    try {
        console.log('Fetching latest 5 access grants...');
        const grants = await prisma.accessGrant.findMany({
            take: 5,
            orderBy: { grantedAt: 'desc' },
            include: {
                person: { select: { firstName: true, lastName: true } }
            }
        });

        console.log('Found grants:');
        grants.forEach((g: any) => {
            console.log('------------------------------------------------');
            console.log(`ID: ${g.id}`);
            console.log(`Token: "${g.token}"`);
            console.log(`Status: ${g.status}`);
            console.log(`Child: ${g.person.firstName} ${g.person.lastName}`);
            console.log(`Granted By: ${g.grantedByEmail}`);
            console.log(`Grantee Email (Restriction): "${g.granteeEmail}"`);
            console.log(`Expires: ${g.tokenExpiresAt}`);
            console.log(`Created (GrantedAt): ${g.grantedAt}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listLatestGrants();
