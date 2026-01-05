import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { transformToPatient } from '../utils/transformers';
import { toSnakeCase } from '../utils/case-transformer';

const prisma = new PrismaClient();

// Create patient (Person + ClinicianPatientView)
export const createPatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const data = toSnakeCase(req.body);

        if (!data.first_name || !data.last_name || !data.date_of_birth) {
            throw new AppError('First name, last name, and date of birth are required', 400, 'VALIDATION_ERROR');
        }

        console.log('[Backend] Creating patient with data:', JSON.stringify(data, null, 2));
        console.log('[Backend] Resolved case status:', data.status || data.case_status || 'active');

        const result = await prisma.$transaction(async (tx) => {
            // Create Person
            const person = await tx.person.create({
                data: {
                    firstName: data.first_name,
                    middleName: data.middle_name,
                    lastName: data.last_name,
                    dateOfBirth: new Date(data.date_of_birth),
                    gender: data.gender,
                    placeOfBirth: data.place_of_birth,
                    addressLine1: data.address_line1,
                    addressLine2: data.address_line2,
                    city: data.city,
                    state: data.state,
                    pinCode: data.pin_code,
                    country: data.country || 'India',
                    primaryLanguage: data.primary_language,
                    languagesSpoken: data.languages_spoken ? JSON.stringify(data.languages_spoken) : '[]',
                    udidNumber: data.udid_number
                }
            });

            // Create ClinicianPatientView
            const view = await tx.clinicianPatientView.create({
                data: {
                    personId: person.id,
                    clinicianId: req.userId!,
                    primaryConcerns: data.primary_concerns,
                    presentingProblems: data.presenting_problems,
                    existingDiagnosis: data.existing_diagnosis,
                    diagnosisCodes: data.diagnosis_codes ? JSON.stringify(data.diagnosis_codes) : '[]',
                    medicalHistory: data.medical_history,
                    familyHistory: data.family_history,
                    currentMedications: data.current_medications ? JSON.stringify(data.current_medications) : '[]',
                    allergies: data.allergies,
                    referralSource: data.referral_source,
                    referralNotes: data.referral_details,
                    // Use status from request if provided (mapped from 'status' or 'case_status'), default to active
                    caseStatus: data.status || data.case_status || 'active'
                }
            });

            return { person, view };
        });

        const completeView = await prisma.clinicianPatientView.findUnique({
            where: { id: result.view.id },
            include: { person: true }
        });

        const patient = transformToPatient(completeView!);

        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// Get patients with filters and pagination
export const getPatients = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            page = '1',
            limit = '20',
            status,
            search,
            sort_by = 'createdAt',
            sort_order = 'desc'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {
            clinicianId: req.userId
        };

        if (status && status !== 'all') {
            where.caseStatus = status;
        }

        // For search, we need to filter on person
        let personWhere: any = { deletedAt: null };
        if (search) {
            personWhere.OR = [
                { firstName: { contains: search as string } },
                { lastName: { contains: search as string } },
                { udidNumber: { contains: search as string } }
            ];
        }

        // Get total count
        const total = await prisma.clinicianPatientView.count({
            where: {
                ...where,
                person: personWhere
            }
        });

        // Get patients
        const views = await prisma.clinicianPatientView.findMany({
            where: {
                ...where,
                person: personWhere
            },
            skip,
            take: limitNum,
            orderBy: { [sort_by as string]: sort_order },
            include: {
                person: true
            }
        });

        const patients = views.map(transformToPatient);

        res.json({
            success: true,
            data: {
                patients,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    total_pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single patient
export const getPatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: personId } = req.params;

        const view = await prisma.clinicianPatientView.findFirst({
            where: {
                personId,
                clinicianId: req.userId,
                person: {
                    deletedAt: null
                }
            },
            include: {
                person: {
                    include: {
                        contacts: true,
                        tags: true,
                        activities: {
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        },
                        _count: {
                            select: {
                                appointments: true,
                                sessions: true,
                                assessments: true
                            }
                        }
                    }
                }
            }
        });

        if (!view) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        console.log('[DEBUG] Raw view from DB:', JSON.stringify({
            personId: view.person.id,
            firstName: view.person.firstName,
            lastName: view.person.lastName,
            contactsCount: (view.person as any).contacts?.length || 0,
            tagsCount: (view.person as any).tags?.length || 0,
            activitiesCount: (view.person as any).activities?.length || 0
        }));

        const patient = transformToPatient(view);

        console.log('[DEBUG] Transformed patient data:', JSON.stringify({
            id: patient.id,
            full_name: (patient as any).full_name,
            age: (patient as any).age,
            contactsCount: (patient as any).contacts?.length || 0,
            statsPresent: !!(patient as any).stats
        }));

        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// Update patient
export const updatePatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: personId } = req.params;
        const updates = toSnakeCase(req.body);

        const existing = await prisma.clinicianPatientView.findFirst({
            where: {
                personId,
                clinicianId: req.userId
            }
        });

        if (!existing) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        await prisma.$transaction(async (tx) => {
            // Update Person (demographic data)
            const personUpdates: any = {};
            if (updates.first_name !== undefined) personUpdates.firstName = updates.first_name;
            if (updates.last_name !== undefined) personUpdates.lastName = updates.last_name;
            if (updates.middle_name !== undefined) personUpdates.middleName = updates.middle_name;
            if (updates.date_of_birth !== undefined) personUpdates.dateOfBirth = new Date(updates.date_of_birth);
            if (updates.gender !== undefined) personUpdates.gender = updates.gender;
            if (updates.place_of_birth !== undefined) personUpdates.placeOfBirth = updates.place_of_birth;
            if (updates.address_line1 !== undefined) personUpdates.addressLine1 = updates.address_line1;
            if (updates.address_line2 !== undefined) personUpdates.addressLine2 = updates.address_line2;
            if (updates.city !== undefined) personUpdates.city = updates.city;
            if (updates.state !== undefined) personUpdates.state = updates.state;
            if (updates.pin_code !== undefined) personUpdates.pinCode = updates.pin_code;
            if (updates.primary_language !== undefined) personUpdates.primaryLanguage = updates.primary_language;
            if (updates.languages_spoken !== undefined) personUpdates.languagesSpoken = JSON.stringify(updates.languages_spoken);
            if (updates.udid_number !== undefined) personUpdates.udidNumber = updates.udid_number;

            if (Object.keys(personUpdates).length > 0) {
                await tx.person.update({
                    where: { id: personId },
                    data: personUpdates
                });
            }

            // Update ClinicianPatientView (clinical data)
            const viewUpdates: any = {};
            if (updates.primary_concerns !== undefined) viewUpdates.primaryConcerns = updates.primary_concerns;
            if (updates.presenting_problems !== undefined) viewUpdates.presentingProblems = updates.presenting_problems;
            if (updates.existing_diagnosis !== undefined) viewUpdates.existingDiagnosis = updates.existing_diagnosis;
            if (updates.diagnosis_codes !== undefined) viewUpdates.diagnosisCodes = JSON.stringify(updates.diagnosis_codes);
            if (updates.medical_history !== undefined) viewUpdates.medicalHistory = updates.medical_history;
            if (updates.family_history !== undefined) viewUpdates.familyHistory = updates.family_history;
            if (updates.current_medications !== undefined) viewUpdates.currentMedications = JSON.stringify(updates.current_medications);
            if (updates.allergies !== undefined) viewUpdates.allergies = updates.allergies;
            if (updates.referral_source !== undefined) viewUpdates.referralSource = updates.referral_source;
            if (updates.case_status !== undefined) viewUpdates.caseStatus = updates.case_status;

            if (Object.keys(viewUpdates).length > 0) {
                await tx.clinicianPatientView.update({
                    where: { id: existing.id },
                    data: viewUpdates
                });
            }
        });

        const updated = await prisma.clinicianPatientView.findFirst({
            where: { personId },
            include: { person: true }
        });

        const patient = transformToPatient(updated!);

        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// Soft delete patient
export const deletePatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: personId } = req.params;

        const existing = await prisma.clinicianPatientView.findFirst({
            where: {
                personId,
                clinicianId: req.userId
            }
        });

        if (!existing) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        // Check if person has other views
        const hasParentView = await prisma.parentChildView.findFirst({
            where: { personId }
        });

        await prisma.$transaction(async (tx) => {
            // Delete clinician view
            await tx.clinicianPatientView.delete({
                where: { id: existing.id }
            });

            // If no other views exist, soft delete person
            if (!hasParentView) {
                await tx.person.update({
                    where: { id: personId },
                    data: { deletedAt: new Date() }
                });
            }
        });

        res.json({
            success: true,
            data: {
                message: 'Patient archived successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Reactivate patient
export const reactivatePatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id: personId } = req.params;

        await prisma.person.update({
            where: { id: personId },
            data: { deletedAt: null }
        });

        res.json({
            success: true,
            data: {
                message: 'Patient reactivated successfully',
                person_id: personId
            }
        });
    } catch (error) {
        next(error);
    }
};
