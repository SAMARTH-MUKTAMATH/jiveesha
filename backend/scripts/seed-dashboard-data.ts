import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDashboardData() {
    try {
        console.log('🌱 Seeding dashboard data...');

        // Get the first clinician user
        const clinician = await prisma.user.findFirst({
            where: { role: 'clinician' }
        });

        if (!clinician) {
            console.error('❌ No clinician found. Please create a clinician user first.');
            return;
        }

        console.log(`✅ Found clinician: ${clinician.email}`);

        // Get existing patients through clinician view
        const patientViews = await prisma.clinicianPatientView.findMany({
            where: { clinicianId: clinician.id },
            include: { person: true },
            take: 5
        });

        if (patientViews.length === 0) {
            console.error('❌ No patients found. Please create patients first.');
            return;
        }

        const patients = patientViews.map(v => v.person);
        console.log(`✅ Found ${patients.length} patients`);


        // Create upcoming appointments
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        console.log('\\n📅 Creating appointments...');

        const appointments = [];

        // Today's appointments
        if (patients[0]) {
            const apt1 = await prisma.appointment.create({
                data: {
                    personId: patients[0].id,
                    clinicianId: clinician.id,
                    date: today,
                    startTime: '10:00',
                    endTime: '11:00',
                    appointmentType: 'Initial Assessment',
                    format: 'in-person',
                    status: 'scheduled',
                    notes: 'First assessment session'
                }
            });
            appointments.push(apt1);
            console.log(`  ✓ Created appointment for ${patients[0].firstName} ${patients[0].lastName} - Today 10:00 AM`);
        }

        if (patients[1]) {
            const apt2 = await prisma.appointment.create({
                data: {
                    personId: patients[1].id,
                    clinicianId: clinician.id,
                    date: today,
                    startTime: '14:00',
                    endTime: '15:00',
                    appointmentType: 'Follow-up',
                    format: 'virtual',
                    status: 'scheduled',
                    notes: 'Progress review'
                }
            });
            appointments.push(apt2);
            console.log(`  ✓ Created appointment for ${patients[1].firstName} ${patients[1].lastName} - Today 2:00 PM`);
        }

        // Tomorrow's appointment
        if (patients[2]) {
            const apt3 = await prisma.appointment.create({
                data: {
                    personId: patients[2].id,
                    clinicianId: clinician.id,
                    date: tomorrow,
                    startTime: '09:00',
                    endTime: '10:00',
                    appointmentType: 'ISAA Assessment',
                    format: 'in-person',
                    status: 'scheduled',
                    notes: 'ISAA screening'
                }
            });
            appointments.push(apt3);
            console.log(`  ✓ Created appointment for ${patients[2].firstName} ${patients[2].lastName} - Tomorrow 9:00 AM`);
        }

        // Next week's appointment
        if (patients[3]) {
            const apt4 = await prisma.appointment.create({
                data: {
                    personId: patients[3].id,
                    clinicianId: clinician.id,
                    date: nextWeek,
                    startTime: '11:00',
                    endTime: '12:00',
                    appointmentType: 'Consultation',
                    format: 'virtual',
                    status: 'scheduled',
                    notes: 'Parent consultation'
                }
            });
            appointments.push(apt4);
            console.log(`  ✓ Created appointment for ${patients[3].firstName} ${patients[3].lastName} - Next week`);
        }

        // Create incomplete assessments
        console.log('\\n📋 Creating incomplete assessments...');

        const assessments = [];

        if (patients[0]) {
            const assessment1 = await prisma.assessment.create({
                data: {
                    personId: patients[0].id,
                    clinicianId: clinician.id,
                    assessmentType: 'ISAA',
                    status: 'in_progress',
                    administeredBy: clinician.id,
                    responses: JSON.stringify({ completed: 15, total: 40 })
                }
            });
            assessments.push(assessment1);
            console.log(`  ✓ Created incomplete ISAA assessment for ${patients[0].firstName} ${patients[0].lastName}`);
        }

        if (patients[1]) {
            const assessment2 = await prisma.assessment.create({
                data: {
                    personId: patients[1].id,
                    clinicianId: clinician.id,
                    assessmentType: 'ADHD',
                    status: 'in_progress',
                    administeredBy: clinician.id,
                    responses: JSON.stringify({ completed: 8, total: 20 })
                }
            });
            assessments.push(assessment2);
            console.log(`  ✓ Created incomplete ADHD assessment for ${patients[1].firstName} ${patients[1].lastName}`);
        }

        console.log('\\n✅ Dashboard data seeded successfully!');
        console.log(`\\n📊 Summary:`);
        console.log(`   - ${appointments.length} appointments created`);
        console.log(`   - ${assessments.length} incomplete assessments created`);
        console.log(`\\n🎯 Daily Worklist should now show:`);
        console.log(`   - ${appointments.filter(a => a.date.toDateString() === today.toDateString()).length} appointments for today`);
        console.log(`   - ${appointments.filter(a => a.date > today).length} upcoming appointments`);
        console.log(`   - ${assessments.length} incomplete assessments`);

    } catch (error) {
        console.error('❌ Error seeding dashboard data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDashboardData();
