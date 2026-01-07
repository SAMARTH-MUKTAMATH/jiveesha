import api from './api';

export interface PEPGoal {
    id: string;
    pepId: string;
    title: string;
    description: string;
    domain: string; // motor, social, cognitive, communication, adaptive
    status: 'not_started' | 'in_progress' | 'achieved';
    targetDate?: string;
    progress: number;
    activitiesCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface PEP {
    id: string;
    childId: string;
    childName: string;
    status: 'active' | 'draft' | 'archived';
    goalsCount: number;
    activitiesCount: number;
    progress: number; // 0-100
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
}

export interface PEPActivity {
    id: string;
    pepId: string;
    title: string;
    description: string;
    category: 'sports' | 'music' | 'recreation' | 'arts' | 'games';
    domain: 'motor' | 'social' | 'cognitive' | 'communication' | 'adaptive';
    completed: boolean;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePEPData {
    childId: string;
}

export interface CreateActivityData {
    title: string;
    description: string;
    category: 'sports' | 'music' | 'recreation' | 'arts' | 'games';
    domain: 'motor' | 'social' | 'cognitive' | 'communication' | 'adaptive';
}

export interface ActivityNote {
    id: string;
    activityId: string;
    note: string;
    createdAt: string;
}

export interface ActivityMedia {
    id: string;
    activityId: string;
    type: 'photo' | 'video';
    url: string;
    caption?: string;
    uploadedAt: string;
}

export interface ActivityCompletion {
    id: string;
    activityId: string;
    completedAt: string;
    duration?: number; // minutes
    notes?: string;
}

export interface PEPProgressData {
    overallProgress: number; // 0-100
    totalActivities: number;
    completedActivities: number;
    totalCompletions: number;
    domainProgress: {
        motor: number;
        social: number;
        cognitive: number;
        communication: number;
        adaptive: number;
    };
    categoryProgress: {
        sports: number;
        music: number;
        recreation: number;
        arts: number;
        games: number;
    };
    recentCompletions: ActivityCompletion[];
    completionsByDate: { date: string; count: number }[];
}


class PEPService {
    async getPEPs(childId?: string): Promise<{ success: boolean; data: PEP[] }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/pep', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch PEPs:', error);
            return { success: false, data: [] };
        }
    }

    async getPEP(id: string): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.get(`/parent/pep/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch PEP:', error);
            throw error;
        }
    }

    async createPEP(data: CreatePEPData): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.post('/parent/pep', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create PEP:', error);
            throw error;
        }
    }

    async updatePEPStatus(id: string, status: PEP['status']): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.put(`/parent/pep/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Failed to update PEP status:', error);
            throw error;
        }
    }

    async archivePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/pep/${id}/archive`);
            return response.data;
        } catch (error) {
            console.error('Failed to archive PEP:', error);
            throw error;
        }
    }

    async unarchivePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/pep/${id}/unarchive`);
            return response.data;
        } catch (error) {
            console.error('Failed to unarchive PEP:', error);
            throw error;
        }
    }

    async deletePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/pep/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete PEP:', error);
            throw error;
        }
    }

    async getGoals(pepId: string): Promise<{ success: boolean; data: PEPGoal[] }> {
        try {
            const response = await api.get(`/parent/pep/${pepId}/goals`);
            return response.data;
        } catch (error) {
            // Return empty goals for now
            return { success: true, data: [] };
        }
    }

    // Activity Management Methods
    async getActivities(pepId: string): Promise<{ success: boolean; data: PEPActivity[] }> {
        try {
            const response = await api.get(`/parent/pep/${pepId}/activities`);

            // Transform backend data to match frontend interface
            const isToday = (dateString?: string) => {
                if (!dateString) return false;
                const date = new Date(dateString);
                const today = new Date();
                return date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
            };

            const activities = response.data.data.map((activity: any) => {
                const completedAt = activity.lastCompletedAt || activity.completedAt;
                const completedToday = isToday(completedAt);

                return {
                    ...activity,
                    title: activity.activityName || activity.title,
                    category: activity.category || 'sports',
                    completed: (activity.completionCount > 0 || activity.completed) && completedToday,
                    completedAt: completedAt
                };
            });

            return { success: true, data: activities };
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            return { success: false, data: [] };
        }
    }

    async createActivity(pepId: string, data: CreateActivityData): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/activities`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to create activity:', error);
            throw error;
        }
    }

    async updateActivity(pepId: string, activityId: string, data: Partial<CreateActivityData>): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.put(`/parent/pep/${pepId}/activities/${activityId}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update activity:', error);
            throw error;
        }
    }

    async deleteActivity(pepId: string, activityId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/pep/${pepId}/activities/${activityId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete activity:', error);
            throw error;
        }
    }

    async toggleActivityCompletion(pepId: string, activityId: string): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/activities/${activityId}/toggle-completion`);
            return response.data;
        } catch (error) {
            console.error('Failed to toggle activity completion:', error);
            throw error;
        }
    }

    // Activity Tracking Methods




    async getActivityDetails(pepId: string, activityId: string): Promise<{
        success: boolean;
        data: {
            activity: PEPActivity;
            notes: ActivityNote[];
            media: ActivityMedia[];
            completions: ActivityCompletion[];
        };
    }> {
        try {
            const response = await api.get(`/parent/pep/${pepId}/activities/${activityId}/details`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch activity details:', error);
            throw error;
        }
    }

    async addActivityNote(pepId: string, activityId: string, note: string): Promise<{ success: boolean; data: ActivityNote }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/activities/${activityId}/notes`, { note });
            return response.data;
        } catch (error) {
            console.error('Failed to add note:', error);
            throw error;
        }
    }

    async deleteActivityNote(pepId: string, activityId: string, noteId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/pep/${pepId}/activities/${activityId}/notes/${noteId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete note:', error);
            throw error;
        }
    }

    async uploadActivityMedia(pepId: string, activityId: string, formData: FormData): Promise<{ success: boolean; data: ActivityMedia }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/activities/${activityId}/media`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to upload media:', error);
            throw error;
        }
    }

    async deleteActivityMedia(pepId: string, activityId: string, mediaId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/pep/${pepId}/activities/${activityId}/media/${mediaId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete media:', error);
            throw error;
        }
    }

    async recordCompletion(pepId: string, activityId: string, data: { duration?: number; notes?: string }): Promise<{ success: boolean; data: ActivityCompletion }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/activities/${activityId}/completions`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to record completion:', error);
            throw error;
        }
    }

    // Progress Tracking Methods
    async getPEPProgress(pepId: string, startDate?: string): Promise<{ success: boolean; data: PEPProgressData }> {
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            const response = await api.get(`/parent/pep/${pepId}/progress`, { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch PEP progress:', error);
            throw error;
        }
    }

    async exportPEPReport(pepId: string, format: 'pdf' | 'csv'): Promise<{ success: boolean; url: string }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/export`, { format });
            return response.data;
        } catch (error) {
            // Mock export - show placeholder
            alert(`Export ${format.toUpperCase()} feature coming soon! This will generate a downloadable ${format.toUpperCase()} report.`);
            return { success: false, url: '' };
        }
    }

    async shareProgressWithClinician(pepId: string, clinicianId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/pep/${pepId}/share-progress`, { clinicianId });
            return response.data;
        } catch (error) {
            alert('Share with clinician feature coming soon!');
            return { success: false };
        }
    }
}

export default new PEPService();
