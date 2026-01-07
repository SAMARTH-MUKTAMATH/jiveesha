export type IEPStatus = 'draft' | 'active' | 'archived' | 'expired';
export type GoalPriority = 'High' | 'Medium' | 'Low';
export type GoalProgressStatus = 'not_started' | 'in_progress' | 'on_track' | 'needs_support' | 'regressing' | 'achieved';
export type PlacementType = 'General Ed' | 'Resource Room' | 'Self-contained';
export type ServiceType = 'Direct' | 'Consultation';

export interface IEP {
    id: string;
    patientId: string;
    academicYear: string;
    status: IEPStatus;
    academicPerformance?: string;
    functionalPerformance?: string;
    strengths?: string;
    concerns?: string;
    impactOfDisability?: string;
    placementType?: PlacementType;
    placementPercentage?: number;
    placementJustification?: string;
    lreJustification?: string;
    schoolName?: string;
    grade?: string;
    teacher?: string;
    startDate: string;
    endDate: string;
    nextReviewDate?: string;
    lastReviewDate?: string;
    overallProgress: number;
    signedByParent: boolean;
    parentSignedAt?: string;
    parentSignature?: string;
    signedByClinician: boolean;
    clinicianSignedAt?: string;
    clinicianSignature?: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    goals?: IEPGoal[];
    accommodations?: IEPAccommodation[];
    services?: IEPService[];
    teamMembers?: IEPTeamMember[];
    progressReports?: IEPProgressReport[];
}

export interface IEPGoal {
    id: string;
    iepId: string;
    goalNumber: number;
    domain: string;
    priority: GoalPriority;
    goalStatement: string;
    baselineData: string;
    targetCriteria: string;
    targetDate?: string;
    measurementMethod?: string;
    currentProgress: number;
    progressStatus: GoalProgressStatus;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    objectives?: IEPObjective[];
    progressUpdates?: GoalProgressUpdate[];
}

export interface IEPObjective {
    id: string;
    goalId: string;
    objectiveNumber: number;
    objectiveText: string;
    criteria?: string;
    targetDate?: string;
    status: string;
    achievedDate?: string;
}

export interface GoalProgressUpdate {
    id: string;
    goalId: string;
    updateDate: string;
    progressPercentage: number;
    status: string;
    notes?: string;
    evidence?: string;
    updatedBy: string;
}

export interface IEPAccommodation {
    id: string;
    iepId: string;
    category: string;
    accommodationText: string;
    frequency?: string;
}

export interface IEPService {
    id: string;
    iepId: string;
    serviceName: string;
    provider?: string;
    frequency: string;
    duration: number;
    serviceType: ServiceType;
    setting: string;
    startDate: string;
    endDate: string;
    sessionsCompleted: number;
    totalSessionsPlanned?: number;
}

export interface IEPTeamMember {
    id: string;
    iepId: string;
    memberType: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    organization?: string;
    signed: boolean;
    signedAt?: string;
    signature?: string;
}

export interface IEPProgressReport {
    id: string;
    iepId: string;
    reportDate: string;
    reportingPeriod: string;
    overallProgress: number;
    summary: string;
    createdBy: string;
    createdAt: string;
}

export interface IEPWithDetails extends IEP {
    patientName?: string;
    clinicianName?: string;
    goalsCount?: number;
    accommodationsCount?: number;
    servicesCount?: number;
}
