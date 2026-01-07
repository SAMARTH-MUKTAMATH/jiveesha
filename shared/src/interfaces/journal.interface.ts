export type JournalEntryType = 'milestone' | 'observation' | 'concern' | 'success' | 'parent_note' | 'general' | 'pep';
export type JournalVisibility = 'clinician_only' | 'shared_with_parent';
export type CreatedByType = 'clinician' | 'parent';

export interface JournalEntry {
    id: string;
    patientId: string;
    entryType: JournalEntryType;
    title: string;
    content: string;
    tags: string[];
    linkedSessionId?: string;
    linkedGoalId?: string;
    linkedInterventionId?: string;
    visibility: JournalVisibility;
    createdBy: string;
    createdByType: CreatedByType;
    createdByName: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    attachments?: JournalAttachment[];
}

export interface JournalAttachment {
    id: string;
    entryId: string;
    fileType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
}

export interface CreateJournalEntryData {
    patientId: string;
    entryType: JournalEntryType;
    title: string;
    content: string;
    tags?: string[];
    linkedSessionId?: string;
    linkedGoalId?: string;
    linkedInterventionId?: string;
    visibility?: JournalVisibility;
}

export interface UpdateJournalEntryData {
    title?: string;
    content?: string;
    tags?: string[];
    visibility?: JournalVisibility;
}

export interface JournalFilters {
    entryType?: JournalEntryType;
    visibility?: JournalVisibility;
    createdByType?: CreatedByType;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
}

export interface JournalEntryWithDetails extends JournalEntry {
    patientName?: string;
    attachmentCount?: number;
}
