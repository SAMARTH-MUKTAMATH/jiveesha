import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTeachers() {
    try {
        const teacher = await prisma.user.findFirst({
            where: { role: 'teacher' }
        });

        if (teacher) {
            console.log(teacher.id);
        } else {
            console.log('No teacher found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTeachers();
