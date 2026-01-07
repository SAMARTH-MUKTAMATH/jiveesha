
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.user.findFirst({
        where: { role: 'parent' },
        include: { parent: true, clinicianProfile: true }
    });

    const c = await prisma.user.findFirst({
        where: { role: 'clinician' },
        include: { clinicianProfile: true }
    });

    console.log('--- CURRENT LOGGED IN USERS (Via Dev Bypass) ---');
    console.log(`PARENT:    ${p?.clinicianProfile?.firstName} ${p?.clinicianProfile?.lastName} (${p?.email})`);
    console.log(`CLINICIAN: ${c?.clinicianProfile?.firstName} ${c?.clinicianProfile?.lastName} (${c?.email})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
