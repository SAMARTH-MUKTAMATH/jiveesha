import api from './api';

export interface Child {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    photo?: string;
    medicalHistory?: string;
    currentConcerns?: string;
    createdAt: string;
}

export interface AddChildData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    photo?: string;
    medicalHistory?: string;
    currentConcerns?: string;
}

class ChildrenService {
    async addChild(data: AddChildData): Promise<{ success: boolean; data: Child }> {
        const response = await api.post('/parent/children', data);
        return response.data;
    }

    async getChildren(): Promise<{ success: boolean; data: Child[] }> {
        const response = await api.get('/parent/children');
        return response.data;
    }

    async getChild(id: string): Promise<{ success: boolean; data: Child }> {
        const response = await api.get(`/parent/children/${id}`);
        return response.data;
    }

    async updateChild(id: string, data: Partial<AddChildData>): Promise<{ success: boolean; data: Child }> {
        const response = await api.put(`/parent/children/${id}`, data);
        return response.data;
    }

    async deleteChild(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/parent/children/${id}`);
        return response.data;
    }

    calculateAge(dateOfBirth: string): { years: number; months: number } {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months };
    }
}

export default new ChildrenService();
