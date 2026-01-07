import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        // In a real app with auth, we'd get the teacher ID from the token
        // const teacherId = req.user?.id; 

        // For development, find the first available teacher
        const teacher = await prisma.teacher.findFirst({
            include: {
                school: true,
                primaryStudents: true // To get student count
            }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'No teacher profile found. Please seed the database.' });
        }

        const teacherData = {
            id: teacher.id,
            name: `Ms. ${teacher.firstName} ${teacher.lastName}`,
            assignment: `${teacher.grades ? JSON.parse(teacher.grades).join(', ') : 'Grade 3'} - ${teacher.subjects ? JSON.parse(teacher.subjects)[0] : 'General'}`,
            school: {
                name: teacher.school.name,
                district: teacher.school.city || 'District'
            }
        };

        // Fetch students for this teacher to generate stats
        const studentViews = await prisma.schoolStudentView.findMany({
            where: { primaryTeacherId: teacher.id },
            include: {
                person: {
                    include: {
                        screenings: true,
                        parentViews: { // To check for consent
                            select: { id: true }
                        }
                    }
                }
            }
        });

        // Calculate Stats
        const totalStudents = studentViews.length;
        const pendingScreenings = studentViews.filter(sv =>
            !sv.person.screenings.some(s => s.status === 'completed' || s.status === 'in_progress')
        ).length;

        const completedToday = await prisma.screening.count({
            where: {
                conductedBy: teacher.id,
                status: 'completed',
                updatedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        const flagged = studentViews.filter(sv =>
            sv.person.screenings.some(s => s.riskLevel === 'High' || s.followUpRequired)
        ).length;

        // Map Detailed Students List (Limit 5 for dashboard)
        const students = studentViews.slice(0, 5).map(sv => {
            const latestScreening = sv.person.screenings[0]; // Assuming ordered or just pick one
            const hasConsent = sv.person.parentViews.length > 0; // Rough proxy for consent if parent exists

            return {
                id: sv.person.id,
                name: `${sv.person.firstName} ${sv.person.lastName}`,
                grade: sv.currentGrade || 'N/A',
                section: sv.section || 'A',
                screeningStatus: latestScreening ? latestScreening.status : 'not_screened',
                lastScreening: latestScreening ? latestScreening.updatedAt.toISOString().split('T')[0] : null,
                consentStatus: hasConsent,
                urgentFlag: latestScreening?.riskLevel === 'High' || latestScreening?.followUpRequired || false
            };
        });

        // Mock Recent Activity (since we don't have a dedicated activity table for this yet)
        const recentActivity = [
            { id: 'a1', type: 'screening_completed', studentName: 'Reyansh Gupta', timestamp: '2h ago', message: 'Completed Phase 2 Assessment' },
        ]; // Keep this minimal/mocked for now as requested activity schema is complex

        res.json({
            teacher: teacherData,
            stats: {
                totalStudents,
                pendingScreenings,
                completedToday,
                flagged
            },
            students,
            recentActivity
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const teacher = await prisma.teacher.findFirst({
            include: { school: true }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found' });
        }

        const studentViews = await prisma.schoolStudentView.findMany({
            where: { primaryTeacherId: teacher.id },
            include: {
                person: {
                    include: {
                        screenings: true,
                        parentViews: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const students = studentViews.map(sv => {
            const latestScreening = sv.person.screenings[0];
            const hasConsent = sv.person.parentViews.length > 0;

            return {
                id: sv.person.id,
                firstName: sv.person.firstName,
                lastName: sv.person.lastName,
                studentId: sv.studentId || 'N/A',
                grade: sv.currentGrade || 'N/A',
                section: sv.section || 'N/A',
                dateOfBirth: sv.person.dateOfBirth.toISOString().split('T')[0],
                guardianName: 'Parent', // Placeholder
                guardianPhone: '555-0000', // Placeholder
                screeningStatus: latestScreening ? latestScreening.status : 'not_screened',
                currentPhase: latestScreening ? 1 : null,
                lastScreeningDate: latestScreening ? latestScreening.updatedAt.toISOString().split('T')[0] : null,
                screeningResult: latestScreening?.riskLevel === 'High' ? 'flag_raised' : null,
                screeningConsent: hasConsent,
                consentDate: hasConsent ? '2023-01-01' : null,
                urgentFlag: latestScreening?.riskLevel === 'High' || latestScreening?.followUpRequired || false,
                hasPEP: false,
                phaseProgress: { phase1: !!latestScreening, phase2: false, phase3: false, phase4: false }
            };
        });

        const teacherData = {
            name: `Ms. ${teacher.firstName} ${teacher.lastName}`,
            assignment: `${teacher.grades ? JSON.parse(teacher.grades).join(', ') : 'Grade 3'} - ${teacher.subjects ? JSON.parse(teacher.subjects)[0] : 'General'}`,
            school: { name: teacher.school.name }
        };

        res.json({ students, teacher: teacherData });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
};

export const addStudent = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, dateOfBirth, gender, grade, section, guardianName, guardianPhone, guardianEmail } = req.body;

        // 1. Find the current teacher (Mock auth for now)
        const teacher = await prisma.teacher.findFirst({
            include: { school: true }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // 2. Create the student (Person + School View) in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create Person
            const person = await tx.person.create({
                data: {
                    firstName,
                    lastName,
                    dateOfBirth: new Date(dateOfBirth),
                    gender: gender || 'Not Specified',
                    primaryLanguage: 'English' // Default
                }
            });

            // Create School View
            const schoolView = await tx.schoolStudentView.create({
                data: {
                    personId: person.id,
                    schoolId: teacher.schoolId,
                    primaryTeacherId: teacher.id,
                    currentGrade: grade,
                    section: section,
                    studentId: `ST-${Math.floor(Math.random() * 10000)}`, // Generate random ID
                    enrollmentStatus: 'active'
                }
            });

            // Optional: Create Parent View if contact info provided
            if (guardianName && guardianPhone) {
                // Check if user/parent already exists (simplified logic for now)
                // In a real flow, we'd check phone/email to link existing parents

                // Create dummy User/Parent account for now or just store contact
                // For now, simpler to just add as a Contact
                await tx.contact.create({
                    data: {
                        personId: person.id,
                        contactType: 'guardian',
                        firstName: guardianName.split(' ')[0],
                        lastName: guardianName.split(' ').slice(1).join(' ') || '',
                        phone: guardianPhone,
                        email: guardianEmail,
                        isPrimaryContact: true
                    }
                });
            }

            return { person, schoolView };
        });

        res.status(201).json({
            message: 'Student added successfully',
            student: {
                id: result.person.id,
                name: `${result.person.firstName} ${result.person.lastName}`
            }
        });

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Failed to add student' });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Fetch student with full details
        const person = await prisma.person.findUnique({
            where: { id },
            include: {
                schoolViews: {
                    include: { school: true, primaryTeacher: true }
                },
                parentViews: {
                    include: { parent: { include: { user: true } } }
                },
                screenings: {
                    orderBy: { createdAt: 'desc' }
                },
                documents: true,
                contacts: true
            }
        });

        if (!person) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get the relevant school view (assuming single school context for now)
        const schoolView = person.schoolViews[0];
        const latestScreening = person.screenings[0];
        const hasConsent = person.parentViews.length > 0;

        // Construct response object matching Frontend StudentProfileData interface
        const responseData = {
            student: {
                id: person.id,
                firstName: person.firstName,
                lastName: person.lastName,
                studentId: schoolView?.studentId || 'N/A',
                dateOfBirth: person.dateOfBirth.toISOString().split('T')[0],
                age: new Date().getFullYear() - person.dateOfBirth.getFullYear(), // Approx
                grade: schoolView?.currentGrade || 'N/A',
                section: schoolView?.section || 'N/A',
                gender: person.gender,
                riskLevel: latestScreening?.riskLevel === 'High' ? 'high' : 'low',
                flags: latestScreening?.followUpRequired ? ['Screening Follow-up'] : []
            },
            guardian: {
                name: person.contacts.find(c => c.contactType === 'guardian')?.firstName || 'Parent',
                phone: person.contacts.find(c => c.contactType === 'guardian')?.phone || 'N/A',
                email: person.contacts.find(c => c.contactType === 'guardian')?.email || '',
                relationship: 'Guardian'
            },
            school: {
                name: schoolView?.school.name || 'Unknown School',
                district: schoolView?.school.city || 'District'
            },
            teacher: {
                name: schoolView?.primaryTeacher ? `${schoolView.primaryTeacher.firstName} ${schoolView.primaryTeacher.lastName}` : 'Unknown Teacher',
                assignment: schoolView?.primaryTeacher ? 'Class Teacher' : 'N/A'
            },
            screening: {
                status: latestScreening ? latestScreening.status : 'not_screened',
                currentPhase: latestScreening ? 1 : null,
                lastScreeningDate: latestScreening ? latestScreening.updatedAt.toISOString().split('T')[0] : null,
                nextPhase: latestScreening ? 2 : 1,
                consentStatus: hasConsent,
                consentDate: hasConsent ? '2023-01-01' : null
            },
            history: person.screenings.map(s => ({
                id: s.id,
                title: `${s.screeningType} Screening`,
                date: s.createdAt.toISOString().split('T')[0],
                status: s.status,
                description: `Risk Level: ${s.riskLevel || 'None'}`
            })),
            notes: [], // Implement notes table later
            attachments: [],
            consentLogs: [],
            phaseProgress: {}
        };

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student profile' });
    }
};
