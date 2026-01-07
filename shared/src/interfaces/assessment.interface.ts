export type AssessmentType = 'ISAA' | 'ADHD' | 'GLAD' | 'ASD-Deep-Dive' | 'CARS' | 'GARS' | 'other';
export type AssessmentStatus = 'in_progress' | 'completed' | 'abandoned';
export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe';

export interface Assessment {
    id: string;
    patientId: string;
    clinicianId: string;
    assessmentType: AssessmentType;
    status: AssessmentStatus;
    responses: Record<string, any>;
    currentDomain?: string;
    currentQuestion?: number;
    totalQuestions?: number;
    totalScore?: number;
    domainScores?: Record<string, number>;
    interpretation?: string;
    severityLevel?: SeverityLevel;
    dsm5Criteria?: Record<string, any>;
    recommendations?: string;
    administeredBy: string;
    administeredDate?: string;
    duration?: number;
    completedAt?: string;
    baselineAssessmentId?: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    evidence?: AssessmentEvidence[];
}

export interface AssessmentEvidence {
    id: string;
    assessmentId: string;
    evidenceType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    description?: string;
    timestamp?: string;
    uploadedAt: string;
}

export interface CreateAssessmentData {
    patientId: string;
    assessmentType: AssessmentType;
}

export interface UpdateAssessmentData {
    responses?: Record<string, any>;
    currentDomain?: string;
    currentQuestion?: number;
    status?: AssessmentStatus;
}

export interface CompleteAssessmentData {
    totalScore: number;
    domainScores?: Record<string, number>;
    interpretation?: string;
    severityLevel?: SeverityLevel;
    dsm5Criteria?: Record<string, any>;
    recommendations?: string;
}

export interface AssessmentWithDetails extends Assessment {
    patientName?: string;
    clinicianName?: string;
}
