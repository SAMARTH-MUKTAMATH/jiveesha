import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkParentData() {
    try {
        const parentId = 'a7eae539-a807-464e-b87b-9b6274bb8bc2';

        // Check if parent exists
        const parent = await prisma.user.findUnique({
            where: { id: parentId }
        });

        console.log('\n=== PARENT DATA CHECK ===');
        console.log('Parent exists:', !!parent);
        if (parent) {
            console.log('Parent email:', parent.email);
            console.log('Parent name:', parent.firstName, parent.lastName);
        }

        // Check children (access grants)
        const children = await prisma.accessGrant.findMany({
            where: {
                granteeId: parentId,
                status: 'active'
            },
            include: {
                person: true
            }
        });

        console.log('\nChildren count:', children.length);
        if (children.length > 0) {
            console.log('\nChildren:');
            children.forEach((grant, index) => {
                console.log(`${index + 1}. ${grant.person.firstName} ${grant.person.lastName} (ID: ${grant.person.id})`);
            });
        }

        console.log('========================\n');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkParentData();
