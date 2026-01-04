import api from './api';

export interface JournalEntry {
    id: string;
    childId: string;
    childName: string;
    parentId: string;
    parentName: string;

    // Entry Type - CRITICAL
    entryType: 'general' | 'pep';

    // PEP-specific fields (only if entryType === 'pep')
    pepId?: string;
    pepActivityId?: string;
    activityTitle?: string;
    activityCompletion?: boolean;
    activityDuration?: number;
    activityCategory?: string; // sports, music, etc.
    activityDomain?: string; // motor, social, etc.

    // Content
    caption: string;
    mediaType: 'photo' | 'video' | 'document' | 'none';
    mediaUrls: string[];

    // Metadata
    timestamp: string;
    createdAt: string;
    updatedAt: string;
    editedAt?: string;

    // Visibility
    visibility: 'private' | 'shared';
    sharedWithClinicianIds: string[];

    // Tags & Mood
    tags: string[]; // milestone, concern, achievement, motor-skill, social-skill
    mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
}

export interface CreateGeneralEntryData {
    childId: string;
    caption: string;
    mediaUrls?: string[];
    tags?: string[];
    mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
    visibility?: 'private' | 'shared';
}

export interface CreatePEPEntryData {
    childId: string;
    pepId: string;
    pepActivityId: string;
    activityTitle: string;
    activityCompletion: boolean;
    activityDuration?: number;
    activityCategory: string;
    activityDomain: string;
    caption: string;
    mediaUrls?: string[];
}

export interface JournalFilters {
    type?: 'all' | 'general' | 'pep';
    childId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}

// Mock data for development
const mockEntries: JournalEntry[] = [
    {
        id: 'journal_1',
        childId: 'child_1',
        childName: 'Arjun Kumar',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'general',
        caption: 'Arjun said his first complete sentence today! "I want milk please" - so proud of his progress with speech therapy.',
        mediaType: 'photo',
        mediaUrls: ['https://picsum.photos/seed/journal1/400/400'],
        timestamp: '2024-12-28T09:30:00Z',
        createdAt: '2024-12-28T09:30:00Z',
        updatedAt: '2024-12-28T09:30:00Z',
        visibility: 'shared',
        sharedWithClinicianIds: ['clinician_1'],
        tags: ['milestone', 'speech'],
        mood: 'celebrating',
    },
    {
        id: 'journal_2',
        childId: 'child_1',
        childName: 'Arjun Kumar',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'pep',
        pepId: 'pep_1',
        pepActivityId: 'activity_1',
        activityTitle: 'Ball Catching Practice',
        activityCompletion: true,
        activityDuration: 25,
        activityCategory: 'sports',
        activityDomain: 'motor',
        caption: 'Great session with ball catching today! Arjun caught 8 out of 10 throws - his hand-eye coordination is improving significantly.',
        mediaType: 'photo',
        mediaUrls: ['https://picsum.photos/seed/journal2/400/400', 'https://picsum.photos/seed/journal2b/400/400'],
        timestamp: '2024-12-27T15:45:00Z',
        createdAt: '2024-12-27T15:45:00Z',
        updatedAt: '2024-12-27T15:45:00Z',
        visibility: 'shared',
        sharedWithClinicianIds: ['clinician_1'],
        tags: ['motor-skill', 'achievement'],
        mood: 'happy',
    },
    {
        id: 'journal_3',
        childId: 'child_2',
        childName: 'Priya Patel',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'general',
        caption: 'Priya had a challenging morning with transitions. She struggled moving from breakfast to getting dressed. Need to discuss strategies with Dr. Sharma.',
        mediaType: 'none',
        mediaUrls: [],
        timestamp: '2024-12-26T08:15:00Z',
        createdAt: '2024-12-26T08:15:00Z',
        updatedAt: '2024-12-26T08:15:00Z',
        visibility: 'private',
        sharedWithClinicianIds: [],
        tags: ['concern', 'transitions'],
        mood: 'concerned',
    },
    {
        id: 'journal_4',
        childId: 'child_1',
        childName: 'Arjun Kumar',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'pep',
        pepId: 'pep_1',
        pepActivityId: 'activity_3',
        activityTitle: 'Social Circle Time',
        activityCompletion: true,
        activityDuration: 15,
        activityCategory: 'games',
        activityDomain: 'social',
        caption: 'Played turn-taking games with sister. Arjun waited patiently for 3 turns without prompting!',
        mediaType: 'video',
        mediaUrls: ['https://example.com/video1.mp4'],
        timestamp: '2024-12-25T14:00:00Z',
        createdAt: '2024-12-25T14:00:00Z',
        updatedAt: '2024-12-25T14:00:00Z',
        visibility: 'shared',
        sharedWithClinicianIds: ['clinician_1', 'clinician_2'],
        tags: ['social-skill', 'milestone'],
        mood: 'celebrating',
    },
    {
        id: 'journal_5',
        childId: 'child_2',
        childName: 'Priya Patel',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'pep',
        pepId: 'pep_2',
        pepActivityId: 'activity_5',
        activityTitle: 'Music & Movement',
        activityCompletion: true,
        activityDuration: 20,
        activityCategory: 'music',
        activityDomain: 'motor',
        caption: 'Priya loved the rhythm shaker activity. She followed the beat for the entire song!',
        mediaType: 'photo',
        mediaUrls: ['https://picsum.photos/seed/journal5/400/400', 'https://picsum.photos/seed/journal5b/400/400', 'https://picsum.photos/seed/journal5c/400/400'],
        timestamp: '2024-12-24T11:30:00Z',
        createdAt: '2024-12-24T11:30:00Z',
        updatedAt: '2024-12-24T11:30:00Z',
        visibility: 'shared',
        sharedWithClinicianIds: ['clinician_1'],
        tags: ['achievement', 'rhythm'],
        mood: 'happy',
    },
    {
        id: 'journal_6',
        childId: 'child_1',
        childName: 'Arjun Kumar',
        parentId: 'parent_1',
        parentName: 'Sarah Johnson',
        entryType: 'general',
        caption: 'Regular day at home. Arjun played independently with blocks for 20 minutes - a new record for focused play!',
        mediaType: 'photo',
        mediaUrls: ['https://picsum.photos/seed/journal6/400/400'],
        timestamp: '2024-12-23T16:00:00Z',
        createdAt: '2024-12-23T16:00:00Z',
        updatedAt: '2024-12-23T16:00:00Z',
        visibility: 'private',
        sharedWithClinicianIds: [],
        tags: ['daily-update', 'independent-play'],
        mood: 'neutral',
    },
];

class JournalService {
    private entries: JournalEntry[] = [...mockEntries];

    async getEntries(filters?: JournalFilters): Promise<{ success: boolean; data: JournalEntry[] }> {
        try {
            const params = filters || {};
            const response = await api.get('/parent/journal', { params });
            return response.data;
        } catch (error) {
            // Return mock data sorted by timestamp (newest first)
            let filtered = [...this.entries].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            if (filters?.type && filters.type !== 'all') {
                filtered = filtered.filter(e => e.entryType === filters.type);
            }
            if (filters?.childId) {
                filtered = filtered.filter(e => e.childId === filters.childId);
            }
            if (filters?.search) {
                const query = filters.search.toLowerCase();
                filtered = filtered.filter(e =>
                    e.caption.toLowerCase().includes(query) ||
                    e.childName.toLowerCase().includes(query) ||
                    e.activityTitle?.toLowerCase().includes(query)
                );
            }

            return { success: true, data: filtered };
        }
    }

    async getEntry(id: string): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            const response = await api.get(`/parent/journal/${id}`);
            return response.data;
        } catch (error) {
            const entry = this.entries.find(e => e.id === id);
            if (entry) {
                return { success: true, data: entry };
            }
            throw new Error('Entry not found');
        }
    }

    async createGeneralEntry(data: CreateGeneralEntryData): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            const response = await api.post('/parent/journal', {
                ...data,
                entryType: 'general',
            });
            return response.data;
        } catch (error) {
            const newEntry: JournalEntry = {
                id: `journal_${Date.now()}`,
                childId: data.childId,
                childName: 'Child', // Would come from API
                parentId: 'parent_1',
                parentName: 'Sarah Johnson',
                entryType: 'general',
                caption: data.caption,
                mediaType: data.mediaUrls && data.mediaUrls.length > 0 ? 'photo' : 'none',
                mediaUrls: data.mediaUrls || [],
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                visibility: data.visibility || 'private',
                sharedWithClinicianIds: [],
                tags: data.tags || [],
                mood: data.mood,
            };
            this.entries.unshift(newEntry);
            return { success: true, data: newEntry };
        }
    }

    async createPEPEntry(data: CreatePEPEntryData): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            const response = await api.post('/parent/journal/pep', {
                ...data,
                entryType: 'pep',
            });
            return response.data;
        } catch (error) {
            const newEntry: JournalEntry = {
                id: `journal_${Date.now()}`,
                childId: data.childId,
                childName: 'Child', // Would come from API
                parentId: 'parent_1',
                parentName: 'Sarah Johnson',
                entryType: 'pep',
                pepId: data.pepId,
                pepActivityId: data.pepActivityId,
                activityTitle: data.activityTitle,
                activityCompletion: data.activityCompletion,
                activityDuration: data.activityDuration,
                activityCategory: data.activityCategory,
                activityDomain: data.activityDomain,
                caption: data.caption,
                mediaType: data.mediaUrls && data.mediaUrls.length > 0 ? 'photo' : 'none',
                mediaUrls: data.mediaUrls || [],
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                visibility: 'shared',
                sharedWithClinicianIds: [],
                tags: [],
            };
            this.entries.unshift(newEntry);
            return { success: true, data: newEntry };
        }
    }

    async updateEntry(id: string, data: Partial<JournalEntry>): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            const response = await api.put(`/parent/journal/${id}`, data);
            return response.data;
        } catch (error) {
            const index = this.entries.findIndex(e => e.id === id);
            if (index !== -1) {
                this.entries[index] = {
                    ...this.entries[index],
                    ...data,
                    updatedAt: new Date().toISOString(),
                    editedAt: new Date().toISOString(),
                };
                return { success: true, data: this.entries[index] };
            }
            throw new Error('Entry not found');
        }
    }

    async deleteEntry(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/journal/${id}`);
            return response.data;
        } catch (error) {
            const index = this.entries.findIndex(e => e.id === id);
            if (index !== -1) {
                this.entries.splice(index, 1);
                return { success: true };
            }
            throw new Error('Entry not found');
        }
    }

    async uploadMedia(file: File): Promise<{ success: boolean; url: string }> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/parent/journal/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            // Mock upload - create object URL
            const url = URL.createObjectURL(file);
            return { success: true, url };
        }
    }
}

export default new JournalService();
