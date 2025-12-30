"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...\n');
    // Clean up existing data (for development)
    console.log('Cleaning up existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.patientActivityLog.deleteMany();
    await prisma.sessionAttachment.deleteMany();
    await prisma.consultationSession.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.appointmentHistory.deleteMany();
    await prisma.appointmentReminder.deleteMany();
    await prisma.appointmentParticipant.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.patientTag.deleteMany();
    await prisma.patientDocument.deleteMany();
    await prisma.patientContact.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.clinicianTimeOff.deleteMany();
    await prisma.clinicianAvailability.deleteMany();
    await prisma.practiceLocation.deleteMany();
    await prisma.userPreferences.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.clinicianProfile.deleteMany();
    await prisma.user.deleteMany();
    // Create demo clinician
    console.log('Creating demo clinician...');
    const password = await bcryptjs_1.default.hash('Demo@123', 10);
    const clinician = await prisma.user.create({
        data: {
            email: 'demo@daira.health',
            passwordHash: password,
            role: 'clinician',
            status: 'active',
            emailVerified: true,
            profile: {
                create: {
                    firstName: 'Jane',
                    lastName: 'Rivera',
                    professionalTitle: 'Clinical Psychologist',
                    designation: 'Clinical Psychologist',
                    specializations: JSON.stringify(['ASD', 'ADHD', 'Speech Delays']),
                    languages: JSON.stringify(['English', 'Hindi', 'Marathi']),
                    phone: '+91 98765 43210',
                    yearsOfPractice: 8,
                    bio: 'Dr. Jane Rivera is a licensed clinical psychologist specializing in autism spectrum disorders and developmental delays in children. With over 8 years of experience, she has helped hundreds of families navigate their neurodevelopmental journey.',
                    verificationStatus: 'verified',
                    verifiedAt: new Date()
                }
            }
        }
    });
    console.log(`  ✓ Created user: ${clinician.email}`);
    // Create verified credential
    console.log('Creating credentials...');
    await prisma.credential.create({
        data: {
            userId: clinician.id,
            credentialType: 'RCI',
            credentialNumber: 'RCI/12345/2020',
            issuingAuthority: 'Rehabilitation Council of India',
            issueDate: new Date('2020-01-15'),
            expiryDate: new Date('2025-01-15'),
            verificationStatus: 'verified',
            verifiedAt: new Date()
        }
    });
    console.log('  ✓ Created RCI credential');
    // Create practice location
    console.log('Creating practice locations...');
    const location = await prisma.practiceLocation.create({
        data: {
            clinicianId: clinician.id,
            name: 'Rivera Clinic - Main Branch',
            addressLine1: '123 MG Road',
            addressLine2: 'Near Central Mall',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001',
            roomInfo: 'Room 3',
            isPrimary: true
        }
    });
    console.log(`  ✓ Created location: ${location.name}`);
    // Create availability (Mon-Fri 9-5)
    console.log('Creating availability schedule...');
    for (let day = 1; day <= 5; day++) {
        await prisma.clinicianAvailability.create({
            data: {
                clinicianId: clinician.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '17:00',
                locationId: location.id
            }
        });
    }
    console.log('  ✓ Created Mon-Fri availability');
    // Create user preferences
    await prisma.userPreferences.create({
        data: {
            userId: clinician.id,
            language: 'en',
            timezone: 'Asia/Kolkata',
            theme: 'light'
        }
    });
    // Create demo patients
    console.log('Creating patients...');
    const patient1 = await prisma.patient.create({
        data: {
            clinicianId: clinician.id,
            firstName: 'Aarav',
            lastName: 'Kumar',
            dateOfBirth: new Date('2017-03-15'),
            gender: 'Male',
            primaryLanguage: 'Hindi',
            languagesSpoken: JSON.stringify(['Hindi', 'English']),
            addressLine1: '456 Park Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400002',
            udidNumber: 'MH-01-2024-012345',
            primaryConcerns: 'Speech delay, social interaction difficulties, sensory sensitivities',
            existingDiagnosis: 'ASD Level 1',
            referralSource: 'School referral',
            status: 'active',
            diagnosisCodes: JSON.stringify([]),
            currentMedications: JSON.stringify([]),
            contacts: {
                create: {
                    contactType: 'primary_parent',
                    relationship: 'Mother',
                    firstName: 'Priya',
                    lastName: 'Kumar',
                    phone: '+91 98765 43210',
                    email: 'priya.kumar@email.com',
                    isPrimaryContact: true,
                    canReceiveUpdates: true,
                    preferredContactMethod: 'email'
                }
            },
            tags: {
                create: [
                    { tag: 'ASD' },
                    { tag: 'Speech Delay' },
                    { tag: 'Active' }
                ]
            }
        }
    });
    console.log(`  ✓ Created patient: ${patient1.firstName} ${patient1.lastName}`);
    const patient2 = await prisma.patient.create({
        data: {
            clinicianId: clinician.id,
            firstName: 'Priya',
            lastName: 'Sharma',
            dateOfBirth: new Date('2016-07-22'),
            gender: 'Female',
            primaryLanguage: 'Hindi',
            languagesSpoken: JSON.stringify(['Hindi', 'English']),
            addressLine1: '789 Lake Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400003',
            primaryConcerns: 'ADHD symptoms, attention difficulties, hyperactivity',
            referralSource: 'Parent self-referral',
            status: 'active',
            diagnosisCodes: JSON.stringify([]),
            currentMedications: JSON.stringify([]),
            contacts: {
                create: {
                    contactType: 'primary_parent',
                    relationship: 'Father',
                    firstName: 'Rajesh',
                    lastName: 'Sharma',
                    phone: '+91 98765 43211',
                    email: 'rajesh.sharma@email.com',
                    isPrimaryContact: true
                }
            },
            tags: {
                create: [
                    { tag: 'ADHD' },
                    { tag: 'Active' }
                ]
            }
        }
    });
    console.log(`  ✓ Created patient: ${patient2.firstName} ${patient2.lastName}`);
    const patient3 = await prisma.patient.create({
        data: {
            clinicianId: clinician.id,
            firstName: 'Arjun',
            lastName: 'Patel',
            dateOfBirth: new Date('2018-11-08'),
            gender: 'Male',
            primaryLanguage: 'Gujarati',
            languagesSpoken: JSON.stringify(['Gujarati', 'Hindi', 'English']),
            addressLine1: '321 Garden View',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400004',
            primaryConcerns: 'Developmental delays, motor skill difficulties',
            referralSource: 'Pediatrician referral',
            status: 'active',
            diagnosisCodes: JSON.stringify([]),
            currentMedications: JSON.stringify([]),
            contacts: {
                create: {
                    contactType: 'primary_parent',
                    relationship: 'Mother',
                    firstName: 'Meera',
                    lastName: 'Patel',
                    phone: '+91 98765 43212',
                    email: 'meera.patel@email.com',
                    isPrimaryContact: true
                }
            },
            tags: {
                create: [
                    { tag: 'Developmental Delay' },
                    { tag: 'New' }
                ]
            }
        }
    });
    console.log(`  ✓ Created patient: ${patient3.firstName} ${patient3.lastName}`);
    // Create appointments
    console.log('Creating appointments...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    await prisma.appointment.create({
        data: {
            patientId: patient1.id,
            clinicianId: clinician.id,
            date: tomorrow,
            startTime: '10:30',
            endTime: '11:15',
            appointmentType: 'Speech Therapy',
            format: 'In-Person',
            locationId: location.id,
            status: 'scheduled',
            notes: 'Focus on sentence construction and social communication'
        }
    });
    await prisma.appointment.create({
        data: {
            patientId: patient2.id,
            clinicianId: clinician.id,
            date: tomorrow,
            startTime: '14:00',
            endTime: '14:45',
            appointmentType: 'Follow-up Session',
            format: 'In-Person',
            locationId: location.id,
            status: 'scheduled',
            notes: 'Review ADHD management strategies'
        }
    });
    console.log('  ✓ Created 2 appointments');
    // Create consultation sessions (past)
    console.log('Creating consultation sessions...');
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    await prisma.consultationSession.create({
        data: {
            patientId: patient1.id,
            clinicianId: clinician.id,
            sessionDate: lastWeek,
            duration: 45,
            sessionType: 'Speech Therapy',
            format: 'In-Person',
            location: 'Room 3',
            notes: 'Good progress on expressive language. Patient using 3-4 word phrases consistently. Continue focusing on turn-taking in conversation.'
        }
    });
    await prisma.consultationSession.create({
        data: {
            patientId: patient2.id,
            clinicianId: clinician.id,
            sessionDate: lastWeek,
            duration: 45,
            sessionType: 'Behavioral Assessment',
            format: 'In-Person',
            location: 'Room 3',
            notes: 'Completed initial ADHD behavioral assessment. Parents report improvement with structured routines at home.'
        }
    });
    console.log('  ✓ Created 2 consultation sessions');
    // Create assessments
    console.log('Creating assessments...');
    await prisma.assessment.create({
        data: {
            patientId: patient1.id,
            assessmentType: 'ISAA',
            status: 'completed',
            responses: JSON.stringify({ q1: 2, q2: 1, q3: 3, q4: 2 }),
            totalScore: 72,
            domainScores: JSON.stringify({
                social: 18,
                motor: 56,
                communication: 20,
                self_help: 28
            }),
            interpretation: 'Mild ASD indicators. Level 1 - Requiring Support. Strong motor skills observed. Areas for focus: social communication and self-help skills.',
            completedAt: new Date('2024-10-20')
        }
    });
    await prisma.assessment.create({
        data: {
            patientId: patient2.id,
            assessmentType: 'ADHD',
            status: 'in_progress',
            responses: JSON.stringify({ q1: 3, q2: 2, q3: 3 }),
            currentQuestion: 15
        }
    });
    console.log('  ✓ Created 2 assessments');
    // Create audit logs
    await prisma.auditLog.create({
        data: {
            userId: clinician.id,
            action: 'USER_LOGIN',
            details: JSON.stringify({ source: 'seed_data' })
        }
    });
    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('   Email:    demo@daira.health');
    console.log('   Password: Demo@123\n');
}
main()
    .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map