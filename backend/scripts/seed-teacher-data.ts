import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting teacher data seed...');

    // 1. Create School
    const school = await prisma.school.create({
        data: {
            name: 'Sunshine Academy',
            schoolType: 'Primary',
            city: 'Mumbai',
            state: 'Maharashtra',
            status: 'active'
        }
    });
    console.log(`Created School: ${school.name}`);

    // 2. Create Teacher
    const teacher = await prisma.teacher.create({
        data: {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            email: 'sarah.jenkins@sunshine.edu',
            schoolId: school.id,
            grades: JSON.stringify(['3', '4']),
            subjects: JSON.stringify(['English', 'Mathematics']),
            status: 'active'
        }
    });
    console.log(`Created Teacher: ${teacher.firstName} ${teacher.lastName}`);

    // 3. Create Students
    const studentsData = [
        { firstName: 'Aarav', lastName: 'Patel', grade: '3', section: 'B', gender: 'Male', dob: new Date('2015-05-15') },
        { firstName: 'Zara', lastName: 'Khan', grade: '3', section: 'B', gender: 'Female', dob: new Date('2015-08-20') },
        { firstName: 'Reyansh', lastName: 'Gupta', grade: '3', section: 'B', gender: 'Male', dob: new Date('2015-02-10') },
        { firstName: 'Ishaan', lastName: 'Kumar', grade: '3', section: 'B', gender: 'Male', dob: new Date('2015-06-22') },
        { firstName: 'Vihaan', lastName: 'Reddy', grade: '3', section: 'B', gender: 'Male', dob: new Date('2015-09-05') },
    ];

    for (const s of studentsData) {
        // Create Person
        const person = await prisma.person.create({
            data: {
                firstName: s.firstName,
                lastName: s.lastName,
                dateOfBirth: s.dob,
                gender: s.gender,
                primaryLanguage: 'English'
            }
        });

        // Create School View (Connect to Teacher)
        await prisma.schoolStudentView.create({
            data: {
                personId: person.id,
                schoolId: school.id,
                primaryTeacherId: teacher.id,
                currentGrade: s.grade,
                section: s.section,
                enrollmentStatus: 'active',
                studentId: `ST-${Math.floor(Math.random() * 10000)}`
            }
        });

        // Add some screenings for variety
        if (s.firstName === 'Zara') {
            // Flagged student
            await prisma.screening.create({
                data: {
                    personId: person.id,
                    screeningType: 'Language',
                    conductedBy: teacher.id,
                    conductedByType: 'teacher',
                    status: 'in_progress',
                    ageAtScreening: 8,
                    totalQuestions: 10,
                    riskLevel: 'High',
                    followUpRequired: true // Urgent Flag
                }
            });
        } else if (s.firstName === 'Reyansh') {
            // Completed student
            await prisma.screening.create({
                data: {
                    personId: person.id,
                    screeningType: 'General',
                    conductedBy: teacher.id,
                    conductedByType: 'teacher',
                    status: 'completed',
                    ageAtScreening: 8,
                    totalQuestions: 10,
                    totalScore: 9,
                    riskLevel: 'Low',
                    completedAt: new Date()
                }
            });
        }
    }

    console.log(`Created ${studentsData.length} students attached to teacher.`);
    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
