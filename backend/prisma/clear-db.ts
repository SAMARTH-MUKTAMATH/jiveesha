import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('🗑️  Clearing all data from database...');

    try {
        // Delete in reverse order of dependencies
        console.log('Deleting journal entries...');
        await prisma.journalAttachment.deleteMany();
        await prisma.journalEntry.deleteMany();

        console.log('Deleting messages and conversations...');
        await prisma.message.deleteMany();
        await prisma.conversation.deleteMany();

        console.log('Deleting notifications...');
        await prisma.notification.deleteMany();

        console.log('Deleting reports and resources...');
        await prisma.report.deleteMany();
        await prisma.resource.deleteMany();

        console.log('Deleting interventions...');
        await prisma.interventionProgress.deleteMany();
        await prisma.interventionStrategy.deleteMany();
        await prisma.intervention.deleteMany();

        console.log('Deleting sessions...');
        await prisma.sessionParticipant.deleteMany();
        await prisma.sessionAttachment.deleteMany();
        await prisma.consultationSession.deleteMany();

        console.log('Deleting progress records...');
        await prisma.progressRecord.deleteMany();
        await prisma.activityCompletion.deleteMany();
        await prisma.activity.deleteMany();

        console.log('Deleting education plans...');
        await prisma.teamMember.deleteMany();
        await prisma.service.deleteMany();
        await prisma.accommodation.deleteMany();
        await prisma.goalProgressUpdate.deleteMany();
        await prisma.goalObjective.deleteMany();
        await prisma.educationGoal.deleteMany();
        await prisma.educationPlan.deleteMany();

        console.log('Deleting assessments...');
        await prisma.assessmentEvidence.deleteMany();
        await prisma.assessment.deleteMany();

        console.log('Deleting screenings...');
        await prisma.screeningResponse.deleteMany();
        await prisma.screening.deleteMany();
        await prisma.mChatQuestion.deleteMany();
        await prisma.aSQQuestion.deleteMany();

        console.log('Deleting appointments...');
        await prisma.appointment.deleteMany();

        console.log('Deleting clinician data...');
        await prisma.clinicianTimeOff.deleteMany();
        await prisma.clinicianAvailability.deleteMany();
        await prisma.practiceLocation.deleteMany();

        console.log('Deleting access grants...');
        await prisma.accessGrant.deleteMany();

        console.log('Deleting views...');
        await prisma.parentChildView.deleteMany();
        await prisma.clinicianPatientView.deleteMany();
        await prisma.schoolStudentView.deleteMany();

        console.log('Deleting audit logs...');
        await prisma.auditLog.deleteMany();

        console.log('Deleting tags, documents, contacts...');
        await prisma.tag.deleteMany();
        await prisma.document.deleteMany();
        await prisma.contact.deleteMany();

        console.log('Deleting user preferences...');
        await prisma.userPreferences.deleteMany();

        console.log('Deleting credentials and tokens...');
        await prisma.refreshToken.deleteMany();
        await prisma.credential.deleteMany();

        console.log('Deleting school data...');
        await prisma.teacher.deleteMany();
        await prisma.school.deleteMany();

        console.log('Deleting persons and users...');
        await prisma.person.deleteMany();
        await prisma.parent.deleteMany();
        await prisma.clinicianProfile.deleteMany();
        await prisma.user.deleteMany();

        console.log('');
        console.log('✅ Database cleared successfully!');
        console.log('📊 All tables are now empty.');
        console.log('');
        console.log('You can now start fresh by:');
        console.log('1. Adding children through the UI');
        console.log('2. Creating PEPs');
        console.log('3. Adding activities');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
