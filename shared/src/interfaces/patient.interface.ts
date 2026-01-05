export type PatientStatus = 'active' | 'inactive' | 'discharged';

export interface Patient {
    id: string;
    clinicianId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    placeOfBirth?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country: string;
    primaryLanguage?: string;
    languagesSpoken: string[];
    udidNumber?: string;
    aadhaarEncrypted?: string;
    schoolId?: string;
    primaryConcerns?: string;
    existingDiagnosis?: string;
    diagnosisCodes: string[];
    developmentalMilestones?: string;
    medicalHistory?: string;
    currentMedications: string[];
    allergies?: string;
    familyHistory?: string;
    status: PatientStatus;
    referralSource?: string;
    referralDetails?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface CreatePatientData {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    placeOfBirth?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
    primaryLanguage?: string;
    languagesSpoken?: string[];
    udidNumber?: string;
    aadhaarEncrypted?: string;
    schoolId?: string;
    primaryConcerns?: string;
    existingDiagnosis?: string;
    diagnosisCodes?: string[];
    developmentalMilestones?: string;
    medicalHistory?: string;
    currentMedications?: string[];
    allergies?: string;
    familyHistory?: string;
    referralSource?: string;
    referralDetails?: string;
}

export interface UpdatePatientData {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    placeOfBirth?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
    primaryLanguage?: string;
    languagesSpoken?: string[];
    udidNumber?: string;
    status?: PatientStatus;
    primaryConcerns?: string;
    existingDiagnosis?: string;
    diagnosisCodes?: string[];
    developmentalMilestones?: string;
    medicalHistory?: string;
    currentMedications?: string[];
    allergies?: string;
    familyHistory?: string;
}

export type RelationshipType = 'mother' | 'father' | 'guardian' | 'other';

export interface ParentChild {
    id: string;
    parentId: string;
    patientId: string;
    relationshipType: RelationshipType;
    isPrimary: boolean;
    canConsent: boolean;
    addedAt: string;
}
