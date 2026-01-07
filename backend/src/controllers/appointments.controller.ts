import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { toSnakeCase } from '../utils/case-transformer';

const prisma = new PrismaClient();

// Create appointment
export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const data = toSnakeCase(req.body);

        if (!data.person_id || !data.date || !data.start_time || !data.end_time || !data.appointment_type) {
            throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
        }

        const appointment = await prisma.appointment.create({
            data: {
                personId: data.person_id,
                clinicianId: req.userId!,
                date: new Date(data.date),
                startTime: data.start_time,
                endTime: data.end_time,
                appointmentType: data.appointment_type,
                format: data.format || 'In-Person',
                locationId: data.location_id,
                notes: data.notes,
                status: 'scheduled'
            },
            include: {
                person: { select: { firstName: true, lastName: true } },
                location: { select: { name: true } }
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: appointment.id,
                person_id: appointment.personId,
                person_name: `${appointment.person.firstName} ${appointment.person.lastName}`,
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
        const { person_id, status, from_date, to_date } = req.query;

        const where: any = { clinicianId: req.userId };

        if (person_id) where.personId = person_id;
        if (status) where.status = status;
        if (from_date || to_date) {
            where.date = {};
            if (from_date) where.date.gte = new Date(from_date as string);
            if (to_date) where.date.lte = new Date(to_date as string);
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                person: { select: { id: true, firstName: true, lastName: true } },
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
                person: { select: { id: true, firstName: true, lastName: true } },
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
                person: { select: { id: true, firstName: true, lastName: true } },
                location: true
            }
        });

        if (!appointment) {
            throw new AppError('Appointment not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: {
                ...formatAppointment(appointment),
                location_details: appointment.location
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
        const updates = toSnakeCase(req.body);

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
                person: { select: { firstName: true, lastName: true } }
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

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status: 'cancelled' }
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
        person_id: apt.personId,
        person_name: apt.person ? `${apt.person.firstName} ${apt.person.lastName}` : null,
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
