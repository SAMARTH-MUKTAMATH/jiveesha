export type ScreeningType = 'M-CHAT-R' | 'M-CHAT-F' | 'ASQ-3' | 'ASQ-SE-2';
export type ScreeningStatus = 'in_progress' | 'completed' | 'abandoned';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ScreenerResult = 'pass' | 'fail' | 'follow_up_needed';

export interface ParentScreening {
    id: string;
    parentId: string;
    patientId: string;
    screeningType: ScreeningType;
    ageAtScreening: number;
    status: ScreeningStatus;
    currentQuestion: number;
    totalQuestions: number;
    responses: Record<string, any>;
    totalScore?: number;
    riskLevel?: RiskLevel;
    screenerResult?: ScreenerResult;
    recommendations?: string;
    followUpRequired: boolean;
    professionalReferral: boolean;
    mchatInitialScore?: number;
    mchatFollowUpScore?: number;
    startedAt: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ScreeningResponse {
    id: string;
    screeningId: string;
    questionId: string;
    questionText: string;
    answer: string;
    answerValue: number;
    isFollowUp: boolean;
    parentFollowUpAnswer?: string;
    answeredAt: string;
}

export interface MChatQuestion {
    id: string;
    questionNumber: number;
    questionText: string;
    isInitialScreener: boolean;
    isFollowUp: boolean;
    criticalItem: boolean;
    scoringKey: string;
    followUpPrompt?: string;
    createdAt: string;
}

export interface ASQQuestion {
    id: string;
    ageRange: string;
    domain: string;
    questionNumber: number;
    questionText: string;
    yesValue: number;
    sometimesValue: number;
    notYetValue: number;
    createdAt: string;
}

export interface StartScreeningData {
    patientId: string;
    screeningType: ScreeningType;
    ageAtScreening: number;
}

export interface SubmitResponseData {
    questionId: string;
    answer: string | number | boolean;
}

export interface CompleteScreeningData {
    responses: Record<string, any>;
}

export interface ScreeningTypeInfo {
    id: ScreeningType;
    name: string;
    description: string;
    ageRange: { min: number; max: number };
    duration: string;
    questionCount: number;
}

export interface ScreeningWithChild extends ParentScreening {
    childName?: string;
    childAge?: number;
}
