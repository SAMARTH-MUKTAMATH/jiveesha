import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const grants = await prisma.accessGrant.findMany({
        where: { status: 'pending' },
        select: {
            id: true,
            token: true,
            grantedByEmail: true,
            granteeEmail: true,
            personId: true,
            tokenExpiresAt: true,
            grantedAt: true
        },
        take: 5
    });

    console.log('\n=== PENDING ACCESS TOKENS ===');
    console.log(`Found ${grants.length} pending tokens\n`);

    grants.forEach((grant, i) => {
        console.log(`Token ${i + 1}:`);
        console.log(`  Token: ${grant.token}`);
        console.log(`  From: ${grant.grantedByEmail}`);
        console.log(`  To: ${grant.granteeEmail || 'Any clinician'}`);
        console.log(`  Expires: ${grant.tokenExpiresAt}`);
        console.log(`  Created: ${grant.grantedAt}`);
        console.log('');
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
