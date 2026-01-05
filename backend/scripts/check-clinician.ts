
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClinicianEmail() {
    try {
        console.log('Checking for clinician users...');
        const clinicians = await prisma.user.findMany({
            where: { role: 'clinician' }
        });

        clinicians.forEach(c => {
            console.log(`ID: ${c.id}`);
            console.log(`Email: ${c.email}`);
            console.log(`Status: ${c.status}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkClinicianEmail();
