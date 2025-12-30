import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create patient
export const createPatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender,
            place_of_birth,
            address_line1,
            address_line2,
            city,
            state,
            pin_code,
            country,
            primary_language,
            languages_spoken,
            udid_number,
            school_id,
            primary_concerns,
            existing_diagnosis,
            diagnosis_codes,
            developmental_milestones,
            medical_history,
            current_medications,
            allergies,
            family_history,
            referral_source,
            referral_details,
            tags
        } = req.body;

        if (!first_name || !last_name || !date_of_birth) {
            throw new AppError('First name, last name, and date of birth are required', 400, 'VALIDATION_ERROR');
        }

        const patient = await prisma.patient.create({
            data: {
                clinicianId: req.userId!,
                firstName: first_name,
                middleName: middle_name,
                lastName: last_name,
                dateOfBirth: new Date(date_of_birth),
                gender,
                placeOfBirth: place_of_birth,
                addressLine1: address_line1,
                addressLine2: address_line2,
                city,
                state,
                pinCode: pin_code,
                country: country || 'India',
                primaryLanguage: primary_language,
                languagesSpoken: languages_spoken || [],
                udidNumber: udid_number,
                schoolId: school_id,
                primaryConcerns: primary_concerns,
                existingDiagnosis: existing_diagnosis,
                diagnosisCodes: diagnosis_codes || [],
                developmentalMilestones: developmental_milestones,
                medicalHistory: medical_history,
                currentMedications: current_medications || [],
                allergies,
                familyHistory: family_history,
                referralSource: referral_source,
                referralDetails: referral_details,
                status: 'active',
                tags: tags ? {
                    create: tags.map((tag: string) => ({ tag }))
                } : undefined
            },
            include: {
                tags: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: patient.id,
                activityType: 'PATIENT_CREATED',
                description: 'Patient record created',
                createdBy: req.userId!
            }
        });

        res.status(201).json({
            success: true,
            data: formatPatient(patient)
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

        // Build where clause
        const where: any = {
            clinicianId: req.userId,
            deletedAt: null
        };

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            // Note: SQLite with Prisma doesn't support 'mode: insensitive'
            // contains will do case-insensitive search by default in SQLite
            where.OR = [
                { firstName: { contains: search as string } },
                { lastName: { contains: search as string } },
                { udidNumber: { contains: search as string } }
            ];
        }

        // Get total count
        const total = await prisma.patient.count({ where });

        // Get patients
        const patients = await prisma.patient.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { [sort_by as string]: sort_order },
            include: {
                contacts: true,
                tags: true,
                _count: {
                    select: {
                        appointments: true,
                        sessions: true,
                        assessments: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: {
                patients: patients.map(formatPatientWithCounts),
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
        const { id } = req.params;

        const patient = await prisma.patient.findFirst({
            where: {
                id,
                clinicianId: req.userId,
                deletedAt: null
            },
            include: {
                contacts: true,
                tags: true,
                documents: {
                    orderBy: { uploadedAt: 'desc' }
                },
                _count: {
                    select: {
                        appointments: true,
                        sessions: true,
                        assessments: true
                    }
                }
            }
        });

        if (!patient) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: formatPatientFull(patient)
        });
    } catch (error) {
        next(error);
    }
};

// Update patient
export const updatePatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await prisma.patient.findFirst({
            where: { id, clinicianId: req.userId, deletedAt: null }
        });

        if (!existing) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        const patient = await prisma.patient.update({
            where: { id },
            data: {
                firstName: updates.first_name,
                middleName: updates.middle_name,
                lastName: updates.last_name,
                dateOfBirth: updates.date_of_birth ? new Date(updates.date_of_birth) : undefined,
                gender: updates.gender,
                placeOfBirth: updates.place_of_birth,
                addressLine1: updates.address_line1,
                addressLine2: updates.address_line2,
                city: updates.city,
                state: updates.state,
                pinCode: updates.pin_code,
                primaryLanguage: updates.primary_language,
                languagesSpoken: updates.languages_spoken,
                udidNumber: updates.udid_number,
                schoolId: updates.school_id,
                primaryConcerns: updates.primary_concerns,
                existingDiagnosis: updates.existing_diagnosis,
                diagnosisCodes: updates.diagnosis_codes,
                developmentalMilestones: updates.developmental_milestones,
                medicalHistory: updates.medical_history,
                currentMedications: updates.current_medications,
                allergies: updates.allergies,
                familyHistory: updates.family_history,
                referralSource: updates.referral_source,
                referralDetails: updates.referral_details,
                status: updates.status
            },
            include: {
                contacts: true,
                tags: true
            }
        });

        // Log activity
        await prisma.patientActivityLog.create({
            data: {
                patientId: patient.id,
                activityType: 'PATIENT_UPDATED',
                description: 'Patient record updated',
                createdBy: req.userId!
            }
        });

        res.json({
            success: true,
            data: formatPatient(patient)
        });
    } catch (error) {
        next(error);
    }
};

// Soft delete patient
export const deletePatient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const existing = await prisma.patient.findFirst({
            where: { id, clinicianId: req.userId, deletedAt: null }
        });

        if (!existing) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        await prisma.patient.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                status: 'archived'
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
        const { id } = req.params;

        const patient = await prisma.patient.update({
            where: { id },
            data: {
                deletedAt: null,
                status: 'active'
            }
        });

        res.json({
            success: true,
            data: {
                message: 'Patient reactivated successfully',
                patient_id: patient.id
            }
        });
    } catch (error) {
        next(error);
    }
};

// Add contact
export const addContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const {
            contact_type,
            relationship,
            first_name,
            last_name,
            phone,
            alternate_phone,
            email,
            whatsapp_number,
            occupation,
            address_line1,
            address_line2,
            city,
            state,
            pin_code,
            is_primary_contact,
            can_receive_updates,
            preferred_contact_method,
            language_preference
        } = req.body;

        // Verify patient belongs to clinician
        const patient = await prisma.patient.findFirst({
            where: { id, clinicianId: req.userId, deletedAt: null }
        });

        if (!patient) {
            throw new AppError('Patient not found', 404, 'NOT_FOUND');
        }

        const contact = await prisma.patientContact.create({
            data: {
                patientId: id,
                contactType: contact_type,
                relationship,
                firstName: first_name,
                lastName: last_name,
                phone,
                alternatePhone: alternate_phone,
                email,
                whatsappNumber: whatsapp_number,
                occupation,
                addressLine1: address_line1,
                addressLine2: address_line2,
                city,
                state,
                pinCode: pin_code,
                isPrimaryContact: is_primary_contact || false,
                canReceiveUpdates: can_receive_updates !== false,
                preferredContactMethod: preferred_contact_method,
                languagePreference: language_preference
            }
        });

        res.status(201).json({
            success: true,
            data: formatContact(contact)
        });
    } catch (error) {
        next(error);
    }
};

// Update contact
export const updateContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id, contactId } = req.params;
        const updates = req.body;

        const contact = await prisma.patientContact.update({
            where: { id: contactId },
            data: {
                contactType: updates.contact_type,
                relationship: updates.relationship,
                firstName: updates.first_name,
                lastName: updates.last_name,
                phone: updates.phone,
                alternatePhone: updates.alternate_phone,
                email: updates.email,
                whatsappNumber: updates.whatsapp_number,
                occupation: updates.occupation,
                addressLine1: updates.address_line1,
                addressLine2: updates.address_line2,
                city: updates.city,
                state: updates.state,
                pinCode: updates.pin_code,
                isPrimaryContact: updates.is_primary_contact,
                canReceiveUpdates: updates.can_receive_updates,
                preferredContactMethod: updates.preferred_contact_method,
                languagePreference: updates.language_preference
            }
        });

        res.json({
            success: true,
            data: formatContact(contact)
        });
    } catch (error) {
        next(error);
    }
};

// Delete contact
export const deleteContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { contactId } = req.params;

        await prisma.patientContact.delete({
            where: { id: contactId }
        });

        res.json({
            success: true,
            data: {
                message: 'Contact deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get timeline
export const getTimeline = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { limit = '20' } = req.query;

        const activities = await prisma.patientActivityLog.findMany({
            where: { patientId: id },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string)
        });

        res.json({
            success: true,
            data: activities.map(a => ({
                id: a.id,
                activity_type: a.activityType,
                description: a.description,
                metadata: a.metadata,
                created_by: a.createdBy,
                created_at: a.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Add timeline entry
export const addTimelineEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { activity_type, description, metadata } = req.body;

        const activity = await prisma.patientActivityLog.create({
            data: {
                patientId: id,
                activityType: activity_type,
                description,
                metadata,
                createdBy: req.userId!
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: activity.id,
                activity_type: activity.activityType,
                description: activity.description,
                created_at: activity.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper functions
function formatPatient(patient: any) {
    return {
        id: patient.id,
        first_name: patient.firstName,
        middle_name: patient.middleName,
        last_name: patient.lastName,
        full_name: `${patient.firstName} ${patient.lastName}`,
        date_of_birth: patient.dateOfBirth,
        age: calculateAge(patient.dateOfBirth),
        gender: patient.gender,
        status: patient.status,
        primary_concerns: patient.primaryConcerns,
        tags: patient.tags?.map((t: any) => t.tag) || [],
        created_at: patient.createdAt,
        updated_at: patient.updatedAt
    };
}

function formatPatientWithCounts(patient: any) {
    return {
        ...formatPatient(patient),
        contacts: patient.contacts?.map(formatContact) || [],
        stats: {
            appointments: patient._count?.appointments || 0,
            sessions: patient._count?.sessions || 0,
            assessments: patient._count?.assessments || 0
        }
    };
}

function formatPatientFull(patient: any) {
    return {
        id: patient.id,
        first_name: patient.firstName,
        middle_name: patient.middleName,
        last_name: patient.lastName,
        full_name: `${patient.firstName} ${patient.lastName}`,
        date_of_birth: patient.dateOfBirth,
        age: calculateAge(patient.dateOfBirth),
        gender: patient.gender,
        place_of_birth: patient.placeOfBirth,
        address: {
            line1: patient.addressLine1,
            line2: patient.addressLine2,
            city: patient.city,
            state: patient.state,
            pin_code: patient.pinCode,
            country: patient.country
        },
        primary_language: patient.primaryLanguage,
        languages_spoken: patient.languagesSpoken,
        udid_number: patient.udidNumber,
        school_id: patient.schoolId,
        primary_concerns: patient.primaryConcerns,
        existing_diagnosis: patient.existingDiagnosis,
        diagnosis_codes: patient.diagnosisCodes,
        developmental_milestones: patient.developmentalMilestones,
        medical_history: patient.medicalHistory,
        current_medications: patient.currentMedications,
        allergies: patient.allergies,
        family_history: patient.familyHistory,
        status: patient.status,
        referral_source: patient.referralSource,
        referral_details: patient.referralDetails,
        contacts: patient.contacts?.map(formatContact) || [],
        documents: patient.documents?.map((d: any) => ({
            id: d.id,
            type: d.documentType,
            file_name: d.fileName,
            file_url: d.fileUrl,
            uploaded_at: d.uploadedAt
        })) || [],
        tags: patient.tags?.map((t: any) => t.tag) || [],
        stats: {
            appointments: patient._count?.appointments || 0,
            sessions: patient._count?.sessions || 0,
            assessments: patient._count?.assessments || 0
        },
        created_at: patient.createdAt,
        updated_at: patient.updatedAt
    };
}

function formatContact(contact: any) {
    return {
        id: contact.id,
        contact_type: contact.contactType,
        relationship: contact.relationship,
        first_name: contact.firstName,
        last_name: contact.lastName,
        full_name: `${contact.firstName} ${contact.lastName}`,
        phone: contact.phone,
        alternate_phone: contact.alternatePhone,
        email: contact.email,
        whatsapp_number: contact.whatsappNumber,
        occupation: contact.occupation,
        is_primary_contact: contact.isPrimaryContact,
        can_receive_updates: contact.canReceiveUpdates,
        preferred_contact_method: contact.preferredContactMethod
    };
}

function calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
