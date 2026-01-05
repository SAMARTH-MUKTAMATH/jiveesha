import { Patient } from './patient.interface';

export interface Child {
    id: string;
    parentId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory?: string;
    currentConcerns?: string;
    developmentalNotes?: string;
    linkedPatientId?: string;  // Links to patients table
    createdAt: string;
    updatedAt: string;

    // Populated relations
    linkedPatient?: Patient;
}

export interface CreateChildData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory?: string;
    currentConcerns?: string;
    developmentalNotes?: string;
}

export interface UpdateChildData {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    medicalHistory?: string;
    currentConcerns?: string;
    developmentalNotes?: string;
}

export interface ChildWithStats extends Child {
    pepsCount?: number;
    screeningsCount?: number;
    journalEntriesCount?: number;
}
