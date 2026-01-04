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

// Mock data for development
const mockPEPs: PEP[] = [
    {
        id: 'pep_1',
        childId: 'child_1',
        childName: 'Emma Johnson',
        status: 'active',
        goalsCount: 5,
        activitiesCount: 12,
        progress: 65,
        createdAt: '2024-11-15T10:00:00Z',
        updatedAt: '2024-12-28T14:30:00Z',
    },
    {
        id: 'pep_2',
        childId: 'child_2',
        childName: 'Liam Smith',
        status: 'draft',
        goalsCount: 3,
        activitiesCount: 6,
        progress: 20,
        createdAt: '2024-12-01T09:00:00Z',
        updatedAt: '2024-12-20T11:00:00Z',
    },
    {
        id: 'pep_3',
        childId: 'child_1',
        childName: 'Emma Johnson',
        status: 'archived',
        goalsCount: 4,
        activitiesCount: 10,
        progress: 100,
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2024-09-15T16:00:00Z',
        archivedAt: '2024-10-01T10:00:00Z',
    },
];

const mockActivities: PEPActivity[] = [
    {
        id: 'activity_1',
        pepId: 'pep_1',
        title: 'Balance Beam Walking',
        description: 'Walk along a low balance beam or line on the floor to improve balance and coordination.',
        category: 'sports',
        domain: 'motor',
        completed: true,
        completedAt: '2024-12-20T10:00:00Z',
        createdAt: '2024-11-15T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z',
    },
    {
        id: 'activity_2',
        pepId: 'pep_1',
        title: 'Rhythm Clapping',
        description: 'Clap along to simple rhythms and songs to develop auditory processing and coordination.',
        category: 'music',
        domain: 'cognitive',
        completed: false,
        createdAt: '2024-11-16T09:00:00Z',
        updatedAt: '2024-11-16T09:00:00Z',
    },
    {
        id: 'activity_3',
        pepId: 'pep_1',
        title: 'Finger Painting',
        description: 'Create art using fingers and hands to explore textures and colors while developing fine motor skills.',
        category: 'arts',
        domain: 'motor',
        completed: true,
        completedAt: '2024-12-18T14:00:00Z',
        createdAt: '2024-11-17T11:00:00Z',
        updatedAt: '2024-12-18T14:00:00Z',
    },
    {
        id: 'activity_4',
        pepId: 'pep_1',
        title: 'Simon Says',
        description: 'Play Simon Says to practice following instructions and improve listening skills.',
        category: 'games',
        domain: 'communication',
        completed: false,
        createdAt: '2024-11-18T10:00:00Z',
        updatedAt: '2024-11-18T10:00:00Z',
    },
    {
        id: 'activity_5',
        pepId: 'pep_1',
        title: 'Nature Walk Exploration',
        description: 'Take a walk in nature to observe plants, animals, and develop sensory awareness.',
        category: 'recreation',
        domain: 'cognitive',
        completed: false,
        createdAt: '2024-11-19T08:00:00Z',
        updatedAt: '2024-11-19T08:00:00Z',
    },
];

class PEPService {
    private mockData: PEP[] = [...mockPEPs];
    private mockActivitiesData: PEPActivity[] = [...mockActivities];

    async getPEPs(childId?: string): Promise<{ success: boolean; data: PEP[] }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/peps', { params });
            return response.data;
        } catch (error) {
            // Return mock data for development
            let data = this.mockData;
            if (childId) {
                data = data.filter(p => p.childId === childId);
            }
            return { success: true, data };
        }
    }

    async getPEP(id: string): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.get(`/parent/peps/${id}`);
            return response.data;
        } catch (error) {
            const pep = this.mockData.find(p => p.id === id);
            if (pep) {
                return { success: true, data: pep };
            }
            throw new Error('PEP not found');
        }
    }

    async createPEP(data: CreatePEPData): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.post('/parent/peps', data);
            return response.data;
        } catch (error) {
            // Create mock PEP
            const newPEP: PEP = {
                id: `pep_${Date.now()}`,
                childId: data.childId,
                childName: 'New Child',
                status: 'draft',
                goalsCount: 0,
                activitiesCount: 0,
                progress: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.mockData.push(newPEP);
            return { success: true, data: newPEP };
        }
    }

    async updatePEPStatus(id: string, status: PEP['status']): Promise<{ success: boolean; data: PEP }> {
        try {
            const response = await api.put(`/parent/peps/${id}/status`, { status });
            return response.data;
        } catch (error) {
            const pepIndex = this.mockData.findIndex(p => p.id === id);
            if (pepIndex !== -1) {
                this.mockData[pepIndex] = { ...this.mockData[pepIndex], status, updatedAt: new Date().toISOString() };
                return { success: true, data: this.mockData[pepIndex] };
            }
            throw new Error('PEP not found');
        }
    }

    async archivePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/peps/${id}/archive`);
            return response.data;
        } catch (error) {
            const pepIndex = this.mockData.findIndex(p => p.id === id);
            if (pepIndex !== -1) {
                this.mockData[pepIndex] = {
                    ...this.mockData[pepIndex],
                    status: 'archived',
                    archivedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                return { success: true };
            }
            throw new Error('PEP not found');
        }
    }

    async unarchivePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/peps/${id}/unarchive`);
            return response.data;
        } catch (error) {
            const pepIndex = this.mockData.findIndex(p => p.id === id);
            if (pepIndex !== -1) {
                this.mockData[pepIndex] = {
                    ...this.mockData[pepIndex],
                    status: 'active',
                    archivedAt: undefined,
                    updatedAt: new Date().toISOString(),
                };
                return { success: true };
            }
            throw new Error('PEP not found');
        }
    }

    async deletePEP(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/peps/${id}`);
            return response.data;
        } catch (error) {
            const pepIndex = this.mockData.findIndex(p => p.id === id);
            if (pepIndex !== -1) {
                this.mockData.splice(pepIndex, 1);
                return { success: true };
            }
            throw new Error('PEP not found');
        }
    }

    async getGoals(pepId: string): Promise<{ success: boolean; data: PEPGoal[] }> {
        try {
            const response = await api.get(`/parent/peps/${pepId}/goals`);
            return response.data;
        } catch (error) {
            // Return empty goals for now
            return { success: true, data: [] };
        }
    }

    // Activity Management Methods
    async getActivities(pepId: string): Promise<{ success: boolean; data: PEPActivity[] }> {
        try {
            const response = await api.get(`/parent/peps/${pepId}/activities`);
            return response.data;
        } catch (error) {
            const activities = this.mockActivitiesData.filter(a => a.pepId === pepId);
            return { success: true, data: activities };
        }
    }

    async createActivity(pepId: string, data: CreateActivityData): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/activities`, data);
            return response.data;
        } catch (error) {
            const newActivity: PEPActivity = {
                id: `activity_${Date.now()}`,
                pepId,
                title: data.title,
                description: data.description,
                category: data.category,
                domain: data.domain,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.mockActivitiesData.push(newActivity);
            return { success: true, data: newActivity };
        }
    }

    async updateActivity(pepId: string, activityId: string, data: Partial<CreateActivityData>): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.put(`/parent/peps/${pepId}/activities/${activityId}`, data);
            return response.data;
        } catch (error) {
            const activityIndex = this.mockActivitiesData.findIndex(a => a.id === activityId);
            if (activityIndex !== -1) {
                this.mockActivitiesData[activityIndex] = {
                    ...this.mockActivitiesData[activityIndex],
                    ...data,
                    updatedAt: new Date().toISOString(),
                };
                return { success: true, data: this.mockActivitiesData[activityIndex] };
            }
            throw new Error('Activity not found');
        }
    }

    async deleteActivity(pepId: string, activityId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/peps/${pepId}/activities/${activityId}`);
            return response.data;
        } catch (error) {
            const activityIndex = this.mockActivitiesData.findIndex(a => a.id === activityId);
            if (activityIndex !== -1) {
                this.mockActivitiesData.splice(activityIndex, 1);
                return { success: true };
            }
            throw new Error('Activity not found');
        }
    }

    async toggleActivityCompletion(pepId: string, activityId: string): Promise<{ success: boolean; data: PEPActivity }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/toggle-completion`);
            return response.data;
        } catch (error) {
            const activityIndex = this.mockActivitiesData.findIndex(a => a.id === activityId);
            if (activityIndex !== -1) {
                const activity = this.mockActivitiesData[activityIndex];
                const nowCompleted = !activity.completed;
                this.mockActivitiesData[activityIndex] = {
                    ...activity,
                    completed: nowCompleted,
                    completedAt: nowCompleted ? new Date().toISOString() : undefined,
                    updatedAt: new Date().toISOString(),
                };
                return { success: true, data: this.mockActivitiesData[activityIndex] };
            }
            throw new Error('Activity not found');
        }
    }

    // Activity Tracking Methods
    private mockNotes: ActivityNote[] = [
        {
            id: 'note_1',
            activityId: 'activity_1',
            note: 'Emma showed great improvement today! She walked the whole beam without help.',
            createdAt: '2024-12-20T10:30:00Z',
        },
        {
            id: 'note_2',
            activityId: 'activity_1',
            note: 'Started with wider beam, moved to narrow beam after 5 minutes.',
            createdAt: '2024-12-18T14:15:00Z',
        },
    ];

    private mockMedia: ActivityMedia[] = [
        {
            id: 'media_1',
            activityId: 'activity_1',
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
            caption: 'First successful walk!',
            uploadedAt: '2024-12-20T10:35:00Z',
        },
    ];

    private mockCompletions: ActivityCompletion[] = [
        {
            id: 'completion_1',
            activityId: 'activity_1',
            completedAt: '2024-12-20T10:30:00Z',
            duration: 15,
            notes: 'Excellent session! No assistance needed.',
        },
        {
            id: 'completion_2',
            activityId: 'activity_1',
            completedAt: '2024-12-18T14:00:00Z',
            duration: 20,
            notes: 'Needed some help at first but improved.',
        },
        {
            id: 'completion_3',
            activityId: 'activity_1',
            completedAt: '2024-12-15T11:00:00Z',
            duration: 10,
        },
    ];

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
            const response = await api.get(`/parent/peps/${pepId}/activities/${activityId}/details`);
            return response.data;
        } catch (error) {
            const activity = this.mockActivitiesData.find(a => a.id === activityId);
            if (activity) {
                return {
                    success: true,
                    data: {
                        activity,
                        notes: this.mockNotes.filter(n => n.activityId === activityId),
                        media: this.mockMedia.filter(m => m.activityId === activityId),
                        completions: this.mockCompletions.filter(c => c.activityId === activityId),
                    },
                };
            }
            throw new Error('Activity not found');
        }
    }

    async addActivityNote(pepId: string, activityId: string, note: string): Promise<{ success: boolean; data: ActivityNote }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/notes`, { note });
            return response.data;
        } catch (error) {
            const newNote: ActivityNote = {
                id: `note_${Date.now()}`,
                activityId,
                note,
                createdAt: new Date().toISOString(),
            };
            this.mockNotes.unshift(newNote);
            return { success: true, data: newNote };
        }
    }

    async deleteActivityNote(pepId: string, activityId: string, noteId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/peps/${pepId}/activities/${activityId}/notes/${noteId}`);
            return response.data;
        } catch (error) {
            const noteIndex = this.mockNotes.findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
                this.mockNotes.splice(noteIndex, 1);
                return { success: true };
            }
            throw new Error('Note not found');
        }
    }

    async uploadActivityMedia(pepId: string, activityId: string, formData: FormData): Promise<{ success: boolean; data: ActivityMedia }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/media`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            // Mock upload
            const newMedia: ActivityMedia = {
                id: `media_${Date.now()}`,
                activityId,
                type: 'photo',
                url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
                caption: formData.get('caption') as string || undefined,
                uploadedAt: new Date().toISOString(),
            };
            this.mockMedia.push(newMedia);
            return { success: true, data: newMedia };
        }
    }

    async deleteActivityMedia(pepId: string, activityId: string, mediaId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`/parent/peps/${pepId}/activities/${activityId}/media/${mediaId}`);
            return response.data;
        } catch (error) {
            const mediaIndex = this.mockMedia.findIndex(m => m.id === mediaId);
            if (mediaIndex !== -1) {
                this.mockMedia.splice(mediaIndex, 1);
                return { success: true };
            }
            throw new Error('Media not found');
        }
    }

    async recordCompletion(pepId: string, activityId: string, data: { duration?: number; notes?: string }): Promise<{ success: boolean; data: ActivityCompletion }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/activities/${activityId}/completions`, data);
            return response.data;
        } catch (error) {
            const newCompletion: ActivityCompletion = {
                id: `completion_${Date.now()}`,
                activityId,
                completedAt: new Date().toISOString(),
                duration: data.duration,
                notes: data.notes,
            };
            this.mockCompletions.unshift(newCompletion);
            return { success: true, data: newCompletion };
        }
    }

    // Progress Tracking Methods
    async getPEPProgress(pepId: string, startDate?: string): Promise<{ success: boolean; data: PEPProgressData }> {
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            const response = await api.get(`/parent/peps/${pepId}/progress`, { params });
            return response.data;
        } catch (error) {
            // Return mock progress data
            return {
                success: true,
                data: {
                    overallProgress: 65,
                    totalActivities: 8,
                    completedActivities: 5,
                    totalCompletions: 15,
                    domainProgress: {
                        motor: 85,
                        social: 45,
                        cognitive: 70,
                        communication: 55,
                        adaptive: 60,
                    },
                    categoryProgress: {
                        sports: 80,
                        music: 50,
                        recreation: 70,
                        arts: 40,
                        games: 65,
                    },
                    recentCompletions: this.mockCompletions.slice(0, 10),
                    completionsByDate: [
                        { date: '2024-12-20', count: 3 },
                        { date: '2024-12-18', count: 2 },
                        { date: '2024-12-15', count: 4 },
                        { date: '2024-12-12', count: 1 },
                        { date: '2024-12-10', count: 2 },
                        { date: '2024-12-08', count: 3 },
                    ],
                },
            };
        }
    }

    async exportPEPReport(pepId: string, format: 'pdf' | 'csv'): Promise<{ success: boolean; url: string }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/export`, { format });
            return response.data;
        } catch (error) {
            // Mock export - show placeholder
            alert(`Export ${format.toUpperCase()} feature coming soon! This will generate a downloadable ${format.toUpperCase()} report.`);
            return { success: false, url: '' };
        }
    }

    async shareProgressWithClinician(pepId: string, clinicianId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/peps/${pepId}/share-progress`, { clinicianId });
            return response.data;
        } catch (error) {
            alert('Share with clinician feature coming soon!');
            return { success: false };
        }
    }
}

export default new PEPService();
