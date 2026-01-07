const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
    try {
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const user = await prisma.user.create({
            data: {
                email: 'parent@test.com',
                passwordHash: hashedPassword,
                role: 'parent',
                status: 'active',
                emailVerified: true,
                parent: {
                    create: {
                        phone: '+91-9876543210',
                        preferredLanguage: 'en'
                    }
                }
            },
            include: { parent: true }
        });
        console.log('✅ Created parent user:', user.email);
        console.log('📧 Login: parent@test.com / Password123!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
})();
