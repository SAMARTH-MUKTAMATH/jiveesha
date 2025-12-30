import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get profile
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const profile = await prisma.clinicianProfile.findUnique({
            where: { userId: req.userId }
        });

        if (!profile) {
            throw new AppError('Profile not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: {
                id: profile.id,
                first_name: profile.firstName,
                middle_name: profile.middleName,
                last_name: profile.lastName,
                professional_title: profile.professionalTitle,
                designation: profile.designation,
                specializations: profile.specializations,
                languages: profile.languages,
                phone: profile.phone,
                alternate_phone: profile.alternatePhone,
                date_of_birth: profile.dateOfBirth,
                years_of_practice: profile.yearsOfPractice,
                bio: profile.bio,
                photo_url: profile.photoUrl,
                verification_status: profile.verificationStatus,
                verified_at: profile.verifiedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const updates = req.body;

        const profile = await prisma.clinicianProfile.upsert({
            where: { userId: req.userId },
            update: {
                firstName: updates.first_name,
                middleName: updates.middle_name,
                lastName: updates.last_name,
                professionalTitle: updates.professional_title,
                designation: updates.designation,
                specializations: updates.specializations || [],
                languages: updates.languages || [],
                phone: updates.phone,
                alternatePhone: updates.alternate_phone,
                dateOfBirth: updates.date_of_birth ? new Date(updates.date_of_birth) : null,
                yearsOfPractice: updates.years_of_practice,
                bio: updates.bio
            },
            create: {
                userId: req.userId!,
                firstName: updates.first_name || '',
                lastName: updates.last_name || '',
                middleName: updates.middle_name,
                professionalTitle: updates.professional_title,
                designation: updates.designation,
                specializations: updates.specializations || [],
                languages: updates.languages || [],
                phone: updates.phone,
                alternatePhone: updates.alternate_phone,
                dateOfBirth: updates.date_of_birth ? new Date(updates.date_of_birth) : null,
                yearsOfPractice: updates.years_of_practice,
                bio: updates.bio
            }
        });

        res.json({
            success: true,
            data: {
                id: profile.id,
                updated_at: profile.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Upload photo
export const uploadPhoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400, 'VALIDATION_ERROR');
        }

        const photoUrl = `/uploads/photos/${req.file.filename}`;

        await prisma.clinicianProfile.update({
            where: { userId: req.userId },
            data: { photoUrl }
        });

        res.json({
            success: true,
            data: {
                photo_url: photoUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get locations
export const getLocations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const locations = await prisma.practiceLocation.findMany({
            where: { clinicianId: req.userId },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }]
        });

        res.json({
            success: true,
            data: locations.map(loc => ({
                id: loc.id,
                name: loc.name,
                address_line1: loc.addressLine1,
                address_line2: loc.addressLine2,
                city: loc.city,
                state: loc.state,
                pin_code: loc.pinCode,
                country: loc.country,
                room_info: loc.roomInfo,
                is_primary: loc.isPrimary
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Create location
export const createLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, address_line1, address_line2, city, state, pin_code, country, room_info, is_primary } = req.body;

        if (!name) {
            throw new AppError('Location name is required', 400, 'VALIDATION_ERROR');
        }

        // If this is primary, unset other primary locations
        if (is_primary) {
            await prisma.practiceLocation.updateMany({
                where: { clinicianId: req.userId },
                data: { isPrimary: false }
            });
        }

        const location = await prisma.practiceLocation.create({
            data: {
                clinicianId: req.userId!,
                name,
                addressLine1: address_line1,
                addressLine2: address_line2,
                city,
                state,
                pinCode: pin_code,
                country: country || 'India',
                roomInfo: room_info,
                isPrimary: is_primary || false
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: location.id,
                name: location.name,
                is_primary: location.isPrimary,
                created_at: location.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update location
export const updateLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.is_primary) {
            await prisma.practiceLocation.updateMany({
                where: { clinicianId: req.userId },
                data: { isPrimary: false }
            });
        }

        const location = await prisma.practiceLocation.update({
            where: { id },
            data: {
                name: updates.name,
                addressLine1: updates.address_line1,
                addressLine2: updates.address_line2,
                city: updates.city,
                state: updates.state,
                pinCode: updates.pin_code,
                country: updates.country,
                roomInfo: updates.room_info,
                isPrimary: updates.is_primary
            }
        });

        res.json({
            success: true,
            data: {
                id: location.id,
                updated_at: location.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete location
export const deleteLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.practiceLocation.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Location deleted successfully' }
        });
    } catch (error) {
        next(error);
    }
};

// Get availability
export const getAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const availability = await prisma.clinicianAvailability.findMany({
            where: { clinicianId: req.userId, isActive: true },
            include: { location: true },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
        });

        res.json({
            success: true,
            data: availability.map(a => ({
                id: a.id,
                day_of_week: a.dayOfWeek,
                start_time: a.startTime,
                end_time: a.endTime,
                location_id: a.locationId,
                location_name: a.location?.name
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Update availability
export const updateAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { availability } = req.body;

        // Delete existing availability
        await prisma.clinicianAvailability.deleteMany({
            where: { clinicianId: req.userId }
        });

        // Create new availability
        if (availability && availability.length > 0) {
            await prisma.clinicianAvailability.createMany({
                data: availability.map((a: any) => ({
                    clinicianId: req.userId!,
                    dayOfWeek: a.day_of_week,
                    startTime: a.start_time,
                    endTime: a.end_time,
                    locationId: a.location_id || null,
                    isActive: true
                }))
            });
        }

        res.json({
            success: true,
            data: {
                message: 'Availability updated successfully',
                updated_count: availability?.length || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get time off
export const getTimeOff = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const timeOff = await prisma.clinicianTimeOff.findMany({
            where: { clinicianId: req.userId },
            orderBy: { startDate: 'asc' }
        });

        res.json({
            success: true,
            data: timeOff.map(t => ({
                id: t.id,
                start_date: t.startDate,
                end_date: t.endDate,
                reason: t.reason,
                all_day: t.allDay,
                start_time: t.startTime,
                end_time: t.endTime
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Create time off
export const createTimeOff = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date, reason, all_day, start_time, end_time } = req.body;

        const timeOff = await prisma.clinicianTimeOff.create({
            data: {
                clinicianId: req.userId!,
                startDate: new Date(start_date),
                endDate: new Date(end_date),
                reason,
                allDay: all_day !== false,
                startTime: start_time,
                endTime: end_time
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: timeOff.id,
                start_date: timeOff.startDate,
                end_date: timeOff.endDate
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete time off
export const deleteTimeOff = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.clinicianTimeOff.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Time off deleted successfully' }
        });
    } catch (error) {
        next(error);
    }
};
