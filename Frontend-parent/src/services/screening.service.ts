import api from './api';

export interface ScreeningType {
    id: string;
    name: string;
    description: string;
    ageRange: string;
    duration: string;
    category: string;
}

export interface Screening {
    id: string;
    childId: string;
    screeningTypeId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    responses: Record<string, any>;
    startedAt?: string;
    completedAt?: string;
    results?: any;
}

export interface StartScreeningData {
    childId: string;
    screeningTypeId: string;
}

class ScreeningService {
    // Mock screening types for now (until backend is ready)
    private mockScreeningTypes: ScreeningType[] = [
        {
            id: 'mchat',
            name: 'M-CHAT-R/F',
            description: 'Modified Checklist for Autism in Toddlers - Revised with Follow-Up',
            ageRange: '16-30 months',
            duration: '5-10 minutes',
            category: 'developmental'
        },
        {
            id: 'asq',
            name: 'ASQ-3',
            description: 'Ages and Stages Questionnaire - Third Edition',
            ageRange: '1 month - 5.5 years',
            duration: '10-15 minutes',
            category: 'developmental'
        },
        {
            id: 'peds',
            name: 'PEDS',
            description: 'Parents\' Evaluation of Developmental Status',
            ageRange: '0-8 years',
            duration: '5-10 minutes',
            category: 'developmental'
        }
    ];

    async getScreeningTypes(): Promise<{ success: boolean; data: ScreeningType[] }> {
        try {
            const response = await api.get('/parent/screenings/types');
            return response.data;
        } catch (error) {
            // Return mock data if API not ready
            return { success: true, data: this.mockScreeningTypes };
        }
    }

    async startScreening(data: StartScreeningData): Promise<{ success: boolean; data: Screening }> {
        try {
            const response = await api.post('/parent/screenings/start', data);
            return response.data;
        } catch (error) {
            // Return mock screening if API not ready
            const mockScreening: Screening = {
                id: `screening_${Date.now()}`,
                childId: data.childId,
                screeningTypeId: data.screeningTypeId,
                status: 'in_progress',
                progress: 0,
                responses: {},
                startedAt: new Date().toISOString()
            };
            // Store in localStorage for demo
            localStorage.setItem(`screening_${mockScreening.id}`, JSON.stringify(mockScreening));
            return { success: true, data: mockScreening };
        }
    }

    async getScreening(id: string): Promise<{ success: boolean; data: Screening }> {
        try {
            const response = await api.get(`/parent/screenings/${id}`);
            return response.data;
        } catch (error) {
            // Try localStorage first
            const stored = localStorage.getItem(`screening_${id}`);
            if (stored) {
                return { success: true, data: JSON.parse(stored) };
            }
            throw error;
        }
    }

    async saveProgress(id: string, responses: Record<string, any>, progress: number): Promise<{ success: boolean }> {
        try {
            const response = await api.put(`/parent/screenings/${id}/progress`, { responses, progress });
            return response.data;
        } catch (error) {
            // Save to localStorage for demo
            const stored = localStorage.getItem(`screening_${id}`);
            if (stored) {
                const screening = JSON.parse(stored);
                screening.responses = responses;
                screening.progress = progress;
                localStorage.setItem(`screening_${id}`, JSON.stringify(screening));
            }
            return { success: true };
        }
    }

    async completeScreening(id: string, responses: Record<string, any>): Promise<{ success: boolean; data: any }> {
        try {
            const response = await api.post(`/parent/screenings/${id}/complete`, { responses });
            return response.data;
        } catch (error) {
            // Update localStorage for demo
            const stored = localStorage.getItem(`screening_${id}`);
            if (stored) {
                const screening = JSON.parse(stored);
                screening.status = 'completed';
                screening.progress = 100;
                screening.responses = responses;
                screening.completedAt = new Date().toISOString();
                localStorage.setItem(`screening_${id}`, JSON.stringify(screening));
                return { success: true, data: screening };
            }
            throw error;
        }
    }

    async getScreeningHistory(childId?: string): Promise<{ success: boolean; data: Screening[] }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/screenings', { params });
            return response.data;
        } catch (error) {
            // Return empty for now
            return { success: true, data: [] };
        }
    }
}

export default new ScreeningService();
