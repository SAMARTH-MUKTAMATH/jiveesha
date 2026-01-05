import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createParentUser() {
    console.log('👤 Creating parent user for login...');

    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: 'parent@test.com',
                passwordHash: hashedPassword,
                role: 'parent',
                status: 'active',
                emailVerified: true
            }
        });

        // Create parent profile
        const parent = await prisma.parent.create({
            data: {
                userId: user.id,
                phone: '+1234567890',
                preferredLanguage: 'en',
                emailNotifications: true,
                smsNotifications: false,
                accountStatus: 'active'
            }
        });

        console.log('');
        console.log('✅ Parent user created successfully!');
        console.log('');
        console.log('📧 Login credentials:');
        console.log('   Email: parent@test.com');
        console.log('   Password: password123');
        console.log('');
        console.log('🎯 User ID:', user.id);
        console.log('🎯 Parent ID:', parent.id);
        console.log('');
        console.log('Now you can:');
        console.log('1. Login to the app');
        console.log('2. Add your own children');
        console.log('3. Create PEPs');
        console.log('4. Add activities');
    } catch (error) {
        console.error('❌ Error creating parent user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createParentUser()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
