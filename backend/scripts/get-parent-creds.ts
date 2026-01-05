
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findParentEmail() {
    try {
        console.log('Finding Parent User credentials...');
        const parent = await prisma.parent.findFirst({
            include: { user: true }
        });

        if (!parent) {
            console.error('No parent found.');
            return;
        }

        console.log(`\n✅ Use these credentials to login to Parent Portal:`);
        console.log(`   Email:    ${parent.user.email}`);
        console.log(`   Password: (Try 'password123' or the one you registered with if this is your account)`);
        console.log(`\n   User ID: ${parent.user.id}`);
        console.log(`   Child Linked: ${parent.id}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

findParentEmail();
