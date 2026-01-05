export interface DashboardStats {
    activeScreenings: number;
    pepsDue: number;
    newRecommendations: number;
    milestoneProgress: number;
}

export interface SkillProgress {
    domain: string;
    progress: number;
    goalsCount: number;
}

export interface RecentActivity {
    id: string;
    activityName: string;
    domain: string;
    description: string;
    completionCount: number;
    lastCompletedAt: string | null;
}

export interface NextAction {
    id: string;
    type: 'screening' | 'pep' | 'appointment';
    title: string;
    description: string;
    dueDate: string;
    childId: string;
    childName: string;
    urgent: boolean;
}

export interface RecentMessage {
    id: string;
    from: string;
    fromRole: string;
    preview: string;
    timestamp: string;
    read: boolean;
}

class DashboardService {
    async getStats(childId?: string): Promise<{ success: boolean; data: DashboardStats }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/dashboard/stats', { params });
            return response.data;
        } catch (error) {
            // Return default stats if API fails
            return {
                success: true,
                data: {
                    activeScreenings: 0,
                    pepsDue: 0,
                    newRecommendations: 0,
                    milestoneProgress: 0,
                },
            };
        }
    }

    async getSkillProgress(childId: string): Promise<{ success: boolean; data: SkillProgress[] }> {
        try {
            const response = await api.get('/parent/dashboard/skills', { params: { childId } });
            return response.data;
        } catch (error) {
            return { success: true, data: [] };
        }
    }

    async getRecentActivities(childId: string): Promise<{ success: boolean; data: RecentActivity[] }> {
        try {
            const response = await api.get('/parent/dashboard/activities', { params: { childId } });
            return response.data;
        } catch (error) {
            return { success: true, data: [] };
        }
    }

    async getNextAction(childId?: string): Promise<{ success: boolean; data: NextAction | null }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/dashboard/next-action', { params });
            return response.data;
        } catch (error) {
            return { success: true, data: null };
        }
    }

    async getRecentMessages(): Promise<{ success: boolean; data: RecentMessage[] }> {
        try {
            const response = await api.get('/parent/messages/recent');
            return response.data;
        } catch (error) {
            return { success: true, data: [] };
        }
    }

    async getMilestones(childId: string): Promise<{ success: boolean; data: any[] }> {
        try {
            const response = await api.get(`/parent/children/${childId}/milestones`);
            return response.data;
        } catch (error) {
            return { success: true, data: [] };
        }
    }
}

export default new DashboardService();
