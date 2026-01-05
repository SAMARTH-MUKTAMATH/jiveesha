
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findParentForChild() {
    try {
        const childName = 'Anikaet Irkal';
        console.log(`Finding parent for child: ${childName}...`);

        const children = await prisma.person.findMany({
            where: {
                OR: [
                    { firstName: { contains: 'Anikaet' }, lastName: { contains: 'Irkal' } },
                    { firstName: { contains: 'Anikaet' } },
                    { lastName: { contains: 'Irkal' } }
                ]
            },
            include: {
                parentViews: {
                    include: {
                        parent: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (children.length === 0) {
            console.error(`No child found matching "${childName}".`);
            return;
        }

        for (const child of children) {
            console.log(`\nFound Child: ${child.firstName} ${child.lastName} (${child.id})`);
            if (child.parentViews.length === 0) {
                console.log('  - No parent linked to this child.');
            } else {
                for (const view of child.parentViews) {
                    const u = view.parent.user as any;
                    // Safely access fields that might be missing in strict types but present in DB/schema extensions
                    const firstName = u.firstName || u.first_name || 'Unknown';
                    const lastName = u.lastName || u.last_name || '';

                    console.log(`  - Linked Parent: ${firstName} ${lastName}`);
                    console.log(`    Email: ${u.email}`);
                    console.log(`    User ID: ${u.id}`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

findParentForChild();
