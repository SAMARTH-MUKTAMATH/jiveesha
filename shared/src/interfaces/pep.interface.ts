export type PEPStatus = 'active' | 'completed' | 'archived';
export type ActivityType = 'home_activity' | 'educational_game' | 'sensory_play' | 'reading' | 'outdoor';
export type ActivityDomain = 'communication' | 'social' | 'academic' | 'motor' | 'self_care' | 'behavior';
export type ProgressStatus = 'not_started' | 'in_progress' | 'achieved' | 'regression';
export type ChildEngagement = 'high' | 'medium' | 'low';

export interface PEP {
    id: string;
    parentId: string;
    patientId: string;
    planName: string;
    focusAreas: string[];
    startDate: string;
    endDate?: string;
    linkedIEPId?: string;
    status: PEPStatus;
    overallProgress: number;
    description?: string;
    parentNotes?: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    goals?: PEPGoal[];
    activities?: PEPActivity[];
}

export interface PEPGoal {
    id: string;
    pepId: string;
    goalNumber: number;
    domain: ActivityDomain;
    goalStatement: string;
    linkedIEPGoalId?: string;
    targetDate?: string;
    targetCriteria?: string;
    currentProgress: number;
    progressStatus: ProgressStatus;
    milestones: Array<{ name: string; completed: boolean; date?: string }>;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    activities?: PEPActivity[];
    progressUpdates?: PEPGoalProgress[];
}

export interface PEPActivity {
    id: string;
    pepId: string;
    goalId?: string;
    activityName: string;
    activityType: ActivityType;
    description: string;
    instructions?: string;
    materials?: string[];
    duration?: number;
    frequency?: string;
    linkedResourceId?: string;
    completionCount: number;
    lastCompletedAt?: string;
    parentNotes?: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    completions?: ActivityCompletion[];
}

export interface ActivityCompletion {
    id: string;
    activityId: string;
    completedAt: string;
    duration?: number;
    childEngagement?: ChildEngagement;
    parentObservations?: string;
    challengesFaced?: string;
    successesNoted?: string;
    photos?: string[];
    videos?: string[];
}

export interface PEPGoalProgress {
    id: string;
    goalId: string;
    updateDate: string;
    progressPercentage: number;
    status: ProgressStatus;
    notes?: string;
    observations?: string;
}

export interface CreatePEPData {
    patientId: string;
    planName: string;
    focusAreas: string[];
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface UpdatePEPData {
    planName?: string;
    focusAreas?: string[];
    startDate?: string;
    endDate?: string;
    status?: PEPStatus;
    description?: string;
    parentNotes?: string;
}

export interface CreatePEPGoalData {
    goalNumber: number;
    domain: ActivityDomain;
    goalStatement: string;
    targetDate?: string;
    targetCriteria?: string;
}

export interface UpdatePEPGoalData {
    goalStatement?: string;
    targetDate?: string;
    targetCriteria?: string;
    currentProgress?: number;
    progressStatus?: ProgressStatus;
}

export interface CreatePEPActivityData {
    goalId?: string;
    activityName: string;
    activityType: ActivityType;
    description: string;
    instructions?: string;
    materials?: string[];
    duration?: number;
    frequency?: string;
    linkedResourceId?: string;
}

export interface UpdatePEPActivityData {
    activityName?: string;
    activityType?: ActivityType;
    description?: string;
    instructions?: string;
    materials?: string[];
    duration?: number;
    frequency?: string;
    parentNotes?: string;
}

export interface RecordCompletionData {
    duration?: number;
    childEngagement?: ChildEngagement;
    parentObservations?: string;
    challengesFaced?: string;
    successesNoted?: string;
    photos?: string[];
    videos?: string[];
}

export interface PEPProgress {
    overallProgress: number;
    goalsProgress: Array<{ goalId: string; progress: number }>;
    domainProgress: Record<ActivityDomain, number>;
    activityTypeProgress: Record<ActivityType, number>;
    completionsByDate: Array<{ date: string; count: number }>;
    recentCompletions: ActivityCompletion[];
    totalActivities: number;
    completedActivities: number;
}

export interface PEPWithDetails extends PEP {
    childName?: string;
    goalsCount?: number;
    activitiesCount?: number;
    completionsCount?: number;
}
