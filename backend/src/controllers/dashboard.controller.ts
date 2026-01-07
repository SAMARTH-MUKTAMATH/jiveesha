import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get dashboard stats
export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalPatients,
            activePatients,
            todayAppointments,
            pendingCredentials,
            totalAssessments,
            totalSessions
        ] = await Promise.all([
            prisma.clinicianPatientView.count({ where: { clinicianId: req.userId } }),
            prisma.clinicianPatientView.count({ where: { clinicianId: req.userId, caseStatus: 'active' } }),
            prisma.appointment.count({
                where: {
                    clinicianId: req.userId,
                    date: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.credential.count({
                where: { userId: req.userId, verificationStatus: 'pending' }
            }),
            prisma.assessment.count({
                where: { clinicianId: req.userId }
            }),
            prisma.consultationSession.count({
                where: { clinicianId: req.userId }
            })
        ]);

        res.json({
            success: true,
            data: {
                total_patients: totalPatients,
                active_patients: activePatients,
                today_appointments: todayAppointments,
                pending_credentials: pendingCredentials,
                total_assessments: totalAssessments,
                total_sessions: totalSessions,
                metrics: {
                    patients_this_month: activePatients,
                    sessions_this_week: Math.min(totalSessions, 10),
                    completion_rate: 85
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get recent activity
export const getRecentActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { limit = '10' } = req.query;

        const activities = await prisma.auditLog.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string)
        });

        res.json({
            success: true,
            data: activities.map(a => ({
                id: a.id,
                action: a.action,
                resource_type: a.resourceType,
                resource_id: a.resourceId,
                created_at: a.createdAt,
                description: formatActivityDescription(a.action, a.resourceType)
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Get today's schedule
export const getTodaySchedule = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        const appointments = await prisma.appointment.findMany({
            where: {
                clinicianId: req.userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                person: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });

        res.json({
            success: true,
            data: appointments.map(a => ({
                id: a.id,
                person_id: a.person.id,
                patient_name: `${a.person.firstName} ${a.person.lastName}`,
                start_time: a.startTime,
                end_time: a.endTime,
                appointment_type: a.appointmentType,
                format: a.format,
                location: a.locationId,
                status: a.status
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Get pending tasks
export const getPendingTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [pendingCredentials, incompleteAssessments, upcomingAppointments] = await Promise.all([
            prisma.credential.findMany({
                where: { userId: req.userId, verificationStatus: 'pending' },
                select: { id: true, credentialType: true, createdAt: true }
            }),
            prisma.assessment.findMany({
                where: {
                    clinicianId: req.userId,
                    status: 'in_progress'
                },
                include: {
                    person: { select: { firstName: true, lastName: true } }
                },
                take: 5
            }),
            prisma.appointment.findMany({
                where: {
                    clinicianId: req.userId,
                    date: { gte: new Date() },
                    status: 'scheduled'
                },
                include: {
                    person: { select: { firstName: true, lastName: true } }
                },
                orderBy: { date: 'asc' },
                take: 5
            })
        ]);

        const tasks = [
            ...pendingCredentials.map(c => ({
                id: `cred-${c.id}`,
                type: 'credential_verification',
                title: `${c.credentialType} verification pending`,
                priority: 'high',
                created_at: c.createdAt
            })),
            ...incompleteAssessments.map(a => ({
                id: `assess-${a.id}`,
                person_id: a.personId,
                type: 'incomplete_assessment',
                title: `Complete ${a.assessmentType} for ${a.person.firstName} ${a.person.lastName}`,
                priority: 'medium',
                created_at: a.createdAt
            })),
            ...upcomingAppointments.slice(0, 3).map(a => ({
                id: `appt-${a.id}`,
                person_id: a.personId,
                type: 'upcoming_appointment',
                title: `Appointment with ${a.person.firstName} ${a.person.lastName}`,
                priority: 'low',
                date: a.date
            }))
        ];

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

function formatActivityDescription(action: string, resourceType: string | null): string {
    const descriptions: Record<string, string> = {
        'USER_LOGIN': 'Logged in',
        'USER_LOGOUT': 'Logged out',
        'USER_REGISTERED': 'Account created',
        'PROFILE_UPDATED': 'Updated profile',
        'CREDENTIAL_CREATED': 'Added credential',
        'PATIENT_CREATED': 'Added new patient',
        'PATIENT_UPDATED': 'Updated patient record',
        'APPOINTMENT_CREATED': 'Scheduled appointment',
        'SESSION_CREATED': 'Recorded session notes'
    };

    return descriptions[action] || action.replace(/_/g, ' ').toLowerCase();
}
