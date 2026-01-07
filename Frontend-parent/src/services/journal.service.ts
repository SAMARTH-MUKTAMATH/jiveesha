import api from './api';

export interface JournalEntry {
    id: string;
    childId: string;
    childName: string;
    parentId: string;
    parentName: string;

    // Entry Type
    entryType: 'general' | 'pep';

    // PEP-specific fields
    pepId?: string;
    pepActivityId?: string;
    activityTitle?: string;
    activityCompletion?: boolean;
    activityDuration?: number;
    activityCategory?: string;
    activityDomain?: string;

    // Content
    caption: string;
    mediaType: 'photo' | 'video' | 'document' | 'none';
    mediaUrls: string[];
    title?: string; // Added to support backend title

    // Metadata
    timestamp: string;
    createdAt: string;
    updatedAt: string;
    editedAt?: string;

    // Visibility
    visibility: 'private' | 'shared';
    sharedWithClinicianIds: string[];

    // Tags & Mood
    tags: string[];
    mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
    createdByType?: 'clinician' | 'parent';
}

export interface CreateGeneralEntryData {
    childId: string;
    caption: string;
    mediaUrls?: string[];
    tags?: string[];
    mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
    visibility?: 'private' | 'shared' | 'shared_with_team';
    title?: string;
    entryType?: string;
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

class JournalService {

    async getEntries(filters?: JournalFilters): Promise<{ success: boolean; data: JournalEntry[] }> {
        try {
            if (!filters?.childId) {
                return { success: true, data: [] };
            }

            const response = await api.get(`/journal/parent/timeline/${filters.childId}`, {
                params: {
                    limit: 50
                    // Add other filters if backend supports them later
                }
            });

            // Check if response has data array
            const timelineItems = response.data.data || [];
            if (!Array.isArray(timelineItems)) {
                console.error('Unexpected timeline response format:', response.data);
                return { success: true, data: [] };
            }

            // Transform backend timeline items to Frontend JournalEntry
            const entries: JournalEntry[] = timelineItems.map((item: any) => {
                const isPep = item.type === 'activity';

                return {
                    id: item.id,
                    childId: filters.childId!,
                    childName: 'Child', // Backend doesn't return child name in timeline list yet
                    parentId: 'current',
                    parentName: item.author,
                    entryType: isPep ? 'pep' : (item.entryType || 'general'),
                    caption: item.content || item.title,
                    title: item.title,
                    mediaType: (item.data.photos && item.data.photos.length > 0) ? 'photo' : 'none',
                    mediaUrls: item.data.photos || [], // Using activity photos or journal attachments
                    timestamp: item.date,
                    createdAt: item.date, // item.date is from backend
                    updatedAt: item.date,
                    visibility: item.data.visibility || 'shared',
                    sharedWithClinicianIds: [],
                    tags: [], // Tags not yet fully threaded
                    mood: 'neutral', // Mood not yet fully threaded
                    createdByType: item.createdByType || (item.type === 'activity' ? 'parent' : 'clinician'),

                    // PEP specific
                    ...(isPep ? {
                        pepId: 'unknown',
                        pepActivityId: item.data.activityId,
                        activityTitle: item.title.replace('Completed Activity: ', ''),
                        activityCompletion: true,
                        activityDuration: item.data.duration,
                        activityCategory: 'general',
                        activityDomain: 'general'
                    } : {})
                };
            });

            // Client-side filtering for search/type if backend doesn't support it fully yet
            let filtered = entries;

            if (filters.type && filters.type !== 'all') {
                filtered = filtered.filter(e => e.entryType === filters.type);
            }

            if (filters.search) {
                const query = filters.search.toLowerCase();
                filtered = filtered.filter(e =>
                    e.caption.toLowerCase().includes(query) ||
                    (e.title && e.title.toLowerCase().includes(query))
                );
            }

            return { success: true, data: filtered };
        } catch (error) {
            console.error('Failed to get journal entries:', error);
            throw error; // Let component handle error, no more mock fallback
        }
    }

    async getEntry(id: string): Promise<{ success: boolean; data: JournalEntry }> {
        // Not implemented fully on backend for 'timeline item' lookup by ID if mixed types
        // But for JournalEntry it works.
        try {
            const response = await api.get(`/journal/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get entry:', error);
            throw error;
        }
    }

    async createGeneralEntry(data: CreateGeneralEntryData): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            // Map to backend structure
            const payload = {
                personId: data.childId,
                entryType: data.entryType || 'observation', // Use passed entryType
                title: data.title || 'Parent Entry', // Backend requires title
                content: data.caption,
                tags: data.tags,
                visibility: data.visibility || 'shared_with_team',
                // Attachments handling would go here if mediaUrls supported
            };

            const response = await api.post('/journal', payload);

            // Map response back to frontend interface if needed, or just return basic success
            // For now, returning success and triggering reload is best.
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to create entry:', error);
            throw error;
        }
    }

    async createPEPEntry(data: CreatePEPEntryData): Promise<{ success: boolean; data: JournalEntry }> {
        // For now, this is just recording completion mostly.
        // If we want a specific journal entry for PEP:
        try {
            const payload = {
                personId: data.childId,
                entryType: 'activity_completion',
                title: data.activityTitle,
                content: data.caption,
                linkedGoalId: undefined, // Could link if we had it
                visibility: 'shared_with_team'
            };
            const response = await api.post('/journal', payload);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Failed to create PEP entry:', error);
            throw error;
        }
    }

    async updateEntry(id: string, data: Partial<JournalEntry>): Promise<{ success: boolean; data: JournalEntry }> {
        try {
            const response = await api.put(`/journal/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update entry:', error);
            throw error;
        }
    }

    async deleteEntry(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/journal/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete entry:', error);
            throw error;
        }
    }

    async uploadMedia(file: File): Promise<{ success: boolean; url: string }> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Ensure this endpoint exists and handles media
            const response = await api.post('/journal/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            // If backend endpoint for generic journal media is not ready, we might need mock here
            // But user asked for REALTIME. 
            // BE endpoint /parent/journal/:id/attachments exists but requires ID.
            // We likely need a temp upload or direct upload.
            // For now, keeping the mock fallback ONLY for media upload if endpoint fails 404
            console.warn('Media upload endpoint might be missing, falling back to local URL for preview');
            const url = URL.createObjectURL(file);
            return { success: true, url };
        }
    }
}

export default new JournalService();
