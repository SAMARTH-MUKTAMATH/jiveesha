import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Creating test clinician user...');

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const user = await prisma.user.create({
        data: {
            email: 'dr.jane@daira.com',
            passwordHash: hashedPassword,
            role: 'clinician',
            status: 'active',
            emailVerified: true,
            clinicianProfile: {
                create: {
                    firstName: 'Dr. Jane',
                    lastName: 'Rivera',
                    professionalTitle: 'Clinical Psychologist',
                    specializations: JSON.stringify(['ASD', 'ADHD', 'Speech Delays']),
                    languages: JSON.stringify(['English', 'Hindi']),
                    phone: '+91-9876543210',
                    yearsOfPractice: 8,
                    bio: 'Clinical psychologist specializing in neurodevelopmental disorders',
                    verificationStatus: 'verified',
                    verifiedAt: new Date()
                }
            }
        },
        include: {
            clinicianProfile: true
        }
    });

    console.log('✅ Created clinician user:', user.email);
    console.log('📧 Login credentials:');
    console.log('   Email: dr.jane@daira.com');
    console.log('   Password: Password123!');
    console.log('🔓 Dev-token bypass will now work!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
