import { PrismaClient } from '@prisma/client';
import { generateUniqueConsentToken } from '../src/utils/token-generator';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Generating test token for parent...');

        // 1. Get first person (child)
        const person = await prisma.person.findFirst();
        if (!person) {
            console.error('No persons found in database. Run seeding first.');
            return;
        }

        // 2. Get first school or clinician to be grantor
        const grantor = await prisma.user.findFirst({
            where: { role: 'clinician' }
        });

        if (!grantor) {
            console.error('No clinician found to be grantor.');
            return;
        }

        // 3. Generate token
        const token = await generateUniqueConsentToken(prisma);
        const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // 4. Create AccessGrant meant for a parent
        const grant = await prisma.accessGrant.create({
            data: {
                token,
                grantorType: 'clinician',
                grantorId: grantor.id,
                granteeType: 'parent',
                granteeId: '', // Pending claim
                personId: person.id,
                permissions: JSON.stringify({ view: true, edit: false }),
                accessLevel: 'view',
                status: 'pending',
                tokenExpiresAt,
                grantedByName: 'Test Clinician',
                grantedByEmail: grantor.email,
                notes: 'Generated for parent claim test'
            }
        });

        console.log('\n=======================================');
        console.log('SUCCESS: Test Token Generated');
        console.log(`Token:      ${token}`);
        console.log(`Child:      ${person.firstName} ${person.lastName}`);
        console.log(`Grantor:    ${grant.grantedByName}`);
        console.log('=======================================\n');
        console.log('Use this token in the Parent Portal "Import via Token" modal.');

    } catch (error) {
        console.error('Error generating token:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
