import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // In a real app, infer schoolId from auth token.
        // For dev/demo, picking the first school.
        const school = await prisma.school.findFirst();

        if (!school) {
            return res.status(404).json({ message: 'No school found' });
        }

        const schoolId = school.id;

        // 1. Total Students
        const totalStudents = await prisma.schoolStudentView.count({
            where: { schoolId }
        });

        // 2. Screened Students (Unique persons screened who are in this school)
        // We find screenings where the person is in the school.
        const screenedStudents = await prisma.screening.groupBy({
            by: ['personId'],
            where: {
                person: {
                    schoolViews: {
                        some: { schoolId }
                    }
                }
            }
        });
        const totalScreened = screenedStudents.length;

        // 3. Flags/Risk Levels
        const highRisk = await prisma.screening.count({
            where: {
                person: { schoolViews: { some: { schoolId } } },
                riskLevel: { in: ['High', 'high', 'Severe'] }
            }
        });

        const moderateRisk = await prisma.screening.count({
            where: {
                person: { schoolViews: { some: { schoolId } } },
                riskLevel: { in: ['Moderate', 'moderate'] }
            }
        });

        const flagsRaised = highRisk + moderateRisk;

        const completionRate = totalStudents > 0 ? Math.round((totalScreened / totalStudents) * 100) : 0;

        // 4. Disorder Prevalence (Risk by Grade)
        // We need to group by grade and then count risk levels.

        // Fetch all students with their grade and latest screening
        const studentsWithScreenings = await prisma.schoolStudentView.findMany({
            where: { schoolId },
            select: {
                currentGrade: true,
                person: {
                    select: {
                        screenings: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            select: { riskLevel: true }
                        }
                    }
                }
            }
        });

        // Group by Grade and calc distribution
        const gradeStats: Record<string, { high: number, moderate: number, low: number, total: number }> = {};

        studentsWithScreenings.forEach(student => {
            const grade = student.currentGrade || 'Unknown';
            if (!gradeStats[grade]) {
                gradeStats[grade] = { high: 0, moderate: 0, low: 0, total: 0 };
            }

            const screening = student.person.screenings[0];
            if (screening) {
                const risk = screening.riskLevel?.toLowerCase() || 'low';
                if (risk === 'high' || risk === 'severe') gradeStats[grade].high++;
                else if (risk === 'moderate') gradeStats[grade].moderate++;
                else gradeStats[grade].low++;

                gradeStats[grade].total++;
            }
        });

        const chartData = Object.entries(gradeStats)
            .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true })) // Sort natural (Grade 1, Grade 2, Grade 10)
            .map(([grade, stats]) => {
                const total = stats.total || 1; // Avoid div by zero
                const lowPct = Math.round((stats.low / total) * 100);
                const modPct = Math.round((stats.moderate / total) * 100);
                // The rest is High.

                return {
                    label: grade.replace('Grade ', 'G'), // Shorten 'Grade 1' to 'G1'
                    totalCount: stats.total,
                    counts: stats,
                    percentages: {
                        low: lowPct,
                        moderate: modPct,
                        high: 100 - lowPct - modPct
                    }
                };
            });

        // Normalize bar heights for visual chart (0-100%)
        const maxStudentsInGrade = Math.max(...chartData.map(d => d.totalCount), 10); // Min 10 scale
        const disorderPrevalence = chartData.map(d => ({
            ...d,
            barHeight: Math.min(Math.round((d.totalCount / maxStudentsInGrade) * 100), 100) // Scale to max
        }));

        res.json({
            stats: {
                schoolName: school.name,
                totalStudentsScreened: totalScreened,
                totalStudents,
                completionRate,
                flagsRaised,
                criticalAlerts: highRisk,
                trend: '+5%',
                disorderPrevalence // New field
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new teacher
export const createTeacher = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, assignment, status } = req.body;

        // Hash password
        // Use a default password for invited teachers
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('ChangeMe123!', salt);

        // 1. Create User (Identity)
        // Ensure unique email check handles race conditions or duplicate constraints naturally (Prisma throws)
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: 'teacher',
                status: 'active',
                emailVerified: true
            }
        });

        // 2. Find School (Default logic)
        const school = await prisma.school.findFirst();
        if (!school) {
            throw new Error('No school found in database');
        }

        // Generate secure 6-digit Employee ID
        let employeeId = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 5) {
            // Generate random 6-digit number between 100000 and 999999
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            employeeId = randomNum.toString();

            // Check if exists
            const existing = await prisma.teacher.findFirst({ where: { employeeId } });
            if (!existing) isUnique = true;
            attempts++;
        }

        if (!isUnique) throw new Error('Failed to generate unique Teacher ID');

        // 3. Create Teacher Profile linked to School
        const teacher = await prisma.teacher.create({
            data: {
                schoolId: school.id,
                firstName,
                lastName,
                email,
                phone,
                employeeId,
                status: status || 'active',
                subjects: JSON.stringify(assignment ? [assignment] : []), // Map assignment to subjects
                grades: '[]'
            }
        });

        res.status(201).json({
            success: true,
            message: 'Teacher invited successfully',
            data: {
                id: teacher.id,
                userId: user.id,
                name: `${firstName} ${lastName}`,
                email,
                assignment,
                status,
                employeeId // Return the generated ID
            }
        });
    } catch (error) {
        console.error('Error creating teacher:', error);
        // Handle unique constraint violation
        if ((error as any).code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create teacher'
        });
    }
};

export const getSchoolTeachers = async (req: Request, res: Response) => {
    try {
        const school = await prisma.school.findFirst();
        if (!school) return res.status(404).json({ message: 'No school found' });

        const teachers = await prisma.teacher.findMany({
            where: { schoolId: school.id },
            include: {
                _count: {
                    select: { primaryStudents: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Try to find matching User for last login info (by email)
        const emails = teachers.map(t => t.email).filter((e): e is string => !!e);
        const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true, lastLoginAt: true, status: true }
        });

        const userMap = new Map(users.map((u: { email: string; lastLoginAt: Date | null; status: string }) => [u.email, u]));

        const data = teachers.map((t: any) => {
            const user = t.email ? userMap.get(t.email) : null;
            return {
                ...t,
                user: user ? { lastLogin: user.lastLoginAt } : { lastLogin: null },
                status: user ? user.status : t.status
            };
        });

        res.json({ data });

    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { primaryStudents: true }
                },
                primaryStudents: {
                    include: {
                        person: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                dateOfBirth: true,
                                screenings: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                    select: {
                                        status: true,
                                        createdAt: true
                                    }
                                },
                                contacts: {
                                    where: { isPrimaryContact: true },
                                    take: 1,
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        phone: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Get user status if available
        let status = teacher.status;
        if (teacher.email) {
            const user = await prisma.user.findUnique({
                where: { email: teacher.email },
                select: { status: true }
            });
            if (user) status = user.status;
        }

        res.json({
            data: {
                ...teacher,
                status
            }
        });

    } catch (error) {
        console.error('Error fetching teacher details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
