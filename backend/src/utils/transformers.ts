import { Person, ParentChildView, ClinicianPatientView } from '@prisma/client';

/**
 * Transform ParentChildView + Person to Child response
 * Returns object that will be auto-converted to camelCase by middleware
 */
export function transformToChild(
    view: ParentChildView & { person: Person }
) {
    return {
        // Person fields
        id: view.person.id,
        first_name: view.person.firstName,
        last_name: view.person.lastName,
        middle_name: view.person.middleName,
        date_of_birth: view.person.dateOfBirth.toISOString(),
        gender: view.person.gender,
        place_of_birth: view.person.placeOfBirth,
        address_line1: view.person.addressLine1,
        address_line2: view.person.addressLine2,
        city: view.person.city,
        state: view.person.state,
        pin_code: view.person.pinCode,
        country: view.person.country,
        udid_number: view.person.udidNumber,
        primary_language: view.person.primaryLanguage,
        languages_spoken: JSON.parse(view.person.languagesSpoken || '[]'),

        profile_picture_url: null, // Field missing in schema v2.0 Person model

        // View fields
        view_id: view.id,
        parent_id: view.parentId,
        nickname: view.nickname,
        medical_history: view.medicalHistory,
        current_concerns: view.currentConcerns,
        developmental_notes: view.developmentalNotes,
        parent_notes: view.parentNotes,
        allergy_notes: view.allergyNotes,
        relationship_type: view.relationshipType,
        is_primary_caregiver: view.isPrimaryCaregiver,
        preferred_contact_method: view.preferredContactMethod,
        reminder_preferences: JSON.parse(view.reminderPreferences || '{}'),

        // Timestamps
        added_at: view.addedAt.toISOString(),
        created_at: view.person.createdAt.toISOString(),
        updated_at: view.person.updatedAt.toISOString()
    };
}

/**
 * Transform ClinicianPatientView + Person to Patient response
 * Returns object that will be auto-converted to camelCase by middleware
 */
export function transformToPatient(
    view: ClinicianPatientView & { person: Person }
) {
    return {
        // Person fields
        id: view.person.id,
        first_name: view.person.firstName,
        last_name: view.person.lastName,
        middle_name: view.person.middleName,
        date_of_birth: view.person.dateOfBirth.toISOString(),
        gender: view.person.gender,
        place_of_birth: view.person.placeOfBirth,
        address_line1: view.person.addressLine1,
        address_line2: view.person.addressLine2,
        city: view.person.city,
        state: view.person.state,
        pin_code: view.person.pinCode,
        country: view.person.country,
        udid_number: view.person.udidNumber,
        aadhaar_encrypted: view.person.aadhaarEncrypted,
        primary_language: view.person.primaryLanguage,
        languages_spoken: JSON.parse(view.person.languagesSpoken || '[]'),

        // Clinical view fields
        view_id: view.id,
        clinician_id: view.clinicianId,
        primary_concerns: view.primaryConcerns,
        presenting_problems: view.presentingProblems,
        chief_complaint: view.chiefComplaint,
        existing_diagnosis: view.existingDiagnosis,
        diagnosis_codes: JSON.parse(view.diagnosisCodes || '[]'),
        diagnosis_date: view.diagnosisDate?.toISOString(),
        developmental_history: view.developmentalHistory,
        birth_history: view.birthHistory,
        medical_history: view.medicalHistory,
        family_history: view.familyHistory,
        social_history: view.socialHistory,
        current_medications: JSON.parse(view.currentMedications || '[]'),
        allergies: view.allergies,
        immunization_status: view.immunizationStatus,
        treatment_plan: view.treatmentPlan,
        clinical_notes: view.clinicalNotes,
        case_status: view.caseStatus,
        admitted_at: view.admittedAt.toISOString(),
        discharged_at: view.dischargedAt?.toISOString(),
        referral_source: view.referralSource,
        referral_date: view.referralDate?.toISOString(),
        referral_notes: view.referralNotes,
        created_at: view.createdAt.toISOString(),
        updated_at: view.updatedAt.toISOString(),

        // Expanded fields
        contacts: (view.person as any).contacts?.length > 0
            ? (view.person as any).contacts
            : ((view.person as any).parentViews?.map((pv: any) => ({
                id: pv.parent.id,
                first_name: pv.parent.user?.clinicianProfile?.firstName || 'Parent',
                last_name: pv.parent.user?.clinicianProfile?.lastName || '',
                phone: pv.parent.phone,
                email: pv.parent.user?.email,
                address: [
                    view.person.addressLine1,
                    view.person.addressLine2,
                    view.person.city,
                    view.person.state,
                    view.person.pinCode
                ].filter(Boolean).join(', ') || 'No address',
                relationship: pv.relationshipType,
                is_primary_contact: pv.isPrimaryCaregiver,
                contact_type: 'Guardian'
            })) || []),
        stats: {
            appointments: (view.person as any)._count?.appointments || 0,
            sessions: (view.person as any)._count?.sessions || 0,
            assessments: (view.person as any)._count?.assessments || 0
        },

        // Computed fields
        full_name: `${view.person.firstName} ${view.person.lastName}`.trim(),
        age: Math.floor((Date.now() - new Date(view.person.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),

        // Additional fields expected by frontend
        tags: (view.person as any).tags?.map((t: any) => t.tag) || [],
        school_info: {
            name: null,
            grade: null,
            teacher: null
        },
        activity_log: (view.person as any).activities || [],
        interventions: [],
        latest_iep: null,
        latest_assessments: []
    };
}
