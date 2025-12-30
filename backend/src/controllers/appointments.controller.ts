import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create appointment
export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            patient_id,
            date,
            start_time,
            end_time,
            appointment_type,
            format,
            location_id,
            notes
        } = req.body;

        if (!patient_id || !date || !start_time || !end_time || !appointment_type) {
            throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient_id,
                clinicianId: req.userId!,
                date: new Date(date),
                startTime: start_time,
                endTime: end_time,
                appointmentType: appointment_type,
                format: format || 'In-Person',
                locationId: location_id,
                notes,
                status: 'scheduled'
            },
            include: {
                patient: { select: { firstName: true, lastName: true } },
                location: { select: { name: true } }
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: patient_id,
                activityType: 'APPOINTMENT_SCHEDULED',
                description: `${appointment_type} appointment scheduled for ${date}`,
                createdBy: req.userId!
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: appointment.id,
                patient_id: appointment.patientId,
                patient_name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                date: appointment.date,
                start_time: appointment.startTime,
                end_time: appointment.endTime,
                appointment_type: appointment.appointmentType,
                format: appointment.format,
                location: appointment.location?.name,
                status: appointment.status,
                created_at: appointment.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get appointments
export const getAppointments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { patient_id, status, from_date, to_date } = req.query;

        const where: any = { clinicianId: req.userId };

        if (patient_id) where.patientId = patient_id;
        if (status) where.status = status;
        if (from_date || to_date) {
            where.date = {};
            if (from_date) where.date.gte = new Date(from_date as string);
            if (to_date) where.date.lte = new Date(to_date as string);
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { select: { id: true, firstName: true, lastName: true } },
                location: { select: { name: true } }
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        });

        res.json({
            success: true,
            data: appointments.map(formatAppointment)
        });
    } catch (error) {
        next(error);
    }
};

// Get calendar appointments
export const getCalendarAppointments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date, view = 'week' } = req.query;

        if (!start_date || !end_date) {
            throw new AppError('start_date and end_date are required', 400, 'VALIDATION_ERROR');
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                clinicianId: req.userId,
                date: {
                    gte: new Date(start_date as string),
                    lte: new Date(end_date as string)
                }
            },
            include: {
                patient: { select: { id: true, firstName: true, lastName: true } },
                location: { select: { name: true } }
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        });

        res.json({
            success: true,
            data: {
                appointments: appointments.map(formatAppointment),
                view
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single appointment
export const getAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findFirst({
            where: { id, clinicianId: req.userId },
            include: {
                patient: { select: { id: true, firstName: true, lastName: true } },
                location: true,
                participants: true,
                history: { orderBy: { changedAt: 'desc' } }
            }
        });

        if (!appointment) {
            throw new AppError('Appointment not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: {
                ...formatAppointment(appointment),
                location_details: appointment.location,
                participants: appointment.participants,
                history: appointment.history
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update appointment
export const updateAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await prisma.appointment.findFirst({
            where: { id, clinicianId: req.userId }
        });

        if (!existing) {
            throw new AppError('Appointment not found', 404, 'NOT_FOUND');
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                date: updates.date ? new Date(updates.date) : undefined,
                startTime: updates.start_time,
                endTime: updates.end_time,
                appointmentType: updates.appointment_type,
                format: updates.format,
                locationId: updates.location_id,
                notes: updates.notes,
                status: updates.status
            },
            include: {
                patient: { select: { firstName: true, lastName: true } }
            }
        });

        // Log history
        await prisma.appointmentHistory.create({
            data: {
                appointmentId: id,
                changeType: 'updated',
                oldValue: JSON.stringify(existing),
                changedBy: req.userId!,
                reason: updates.reason
            }
        });

        res.json({
            success: true,
            data: formatAppointment(appointment)
        });
    } catch (error) {
        next(error);
    }
};

// Cancel appointment
export const cancelAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status: 'cancelled' }
        });

        await prisma.appointmentHistory.create({
            data: {
                appointmentId: id,
                changeType: 'cancelled',
                reason,
                changedBy: req.userId!
            }
        });

        res.json({
            success: true,
            data: { message: 'Appointment cancelled successfully' }
        });
    } catch (error) {
        next(error);
    }
};

// Get available slots
export const getAvailableSlots = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date, duration = '45' } = req.query;

        if (!date) {
            throw new AppError('date is required', 400, 'VALIDATION_ERROR');
        }

        const targetDate = new Date(date as string);
        const dayOfWeek = targetDate.getDay();
        const durationMinutes = parseInt(duration as string);

        // Get availability for this day
        const availability = await prisma.clinicianAvailability.findMany({
            where: {
                clinicianId: req.userId,
                dayOfWeek,
                isActive: true
            }
        });

        // Get existing appointments for this day
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                clinicianId: req.userId,
                date: targetDate,
                status: { in: ['scheduled', 'confirmed'] }
            }
        });

        // Generate available slots
        const slots: Array<{ start_time: string; end_time: string; available: boolean }> = [];

        for (const avail of availability) {
            let currentTime = parseTime(avail.startTime);
            const endTime = parseTime(avail.endTime);

            while (currentTime + durationMinutes <= endTime) {
                const slotStart = formatTime(currentTime);
                const slotEnd = formatTime(currentTime + durationMinutes);

                const isBooked = existingAppointments.some(apt => {
                    const aptStart = parseTime(apt.startTime);
                    const aptEnd = parseTime(apt.endTime);
                    return (currentTime >= aptStart && currentTime < aptEnd) ||
                        (currentTime + durationMinutes > aptStart && currentTime + durationMinutes <= aptEnd);
                });

                slots.push({
                    start_time: slotStart,
                    end_time: slotEnd,
                    available: !isBooked
                });

                currentTime += 30; // 30-minute increments
            }
        }

        res.json({
            success: true,
            data: {
                date,
                duration: durationMinutes,
                slots
            }
        });
    } catch (error) {
        next(error);
    }
};

function formatAppointment(apt: any) {
    return {
        id: apt.id,
        patient_id: apt.patientId,
        patient_name: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : null,
        date: apt.date,
        start_time: apt.startTime,
        end_time: apt.endTime,
        appointment_type: apt.appointmentType,
        format: apt.format,
        location: apt.location?.name,
        location_id: apt.locationId,
        status: apt.status,
        notes: apt.notes,
        created_at: apt.createdAt
    };
}

function parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
