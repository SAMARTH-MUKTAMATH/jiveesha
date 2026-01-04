import api from './api';

export interface Resource {
    id: string;
    title: string;
    description: string;
    category: 'article' | 'video' | 'document' | 'tool' | 'link';
    topics: string[]; // e.g., ["autism", "motor-skills"]
    author?: string;
    publishedDate?: string;
    thumbnailUrl?: string;
    resourceUrl: string; // Download URL or external link
    isPremium: boolean;
    isFavorite: boolean;
    downloadCount: number;
    viewCount: number;
    duration?: string; // For videos: "15:30"
    fileSize?: string; // For documents: "2.5 MB"
    createdAt: string;
    updatedAt: string;
}

export interface ResourceFilters {
    category?: string;
    topic?: string;
    search?: string;
}

// Mock data for development
const mockResources: Resource[] = [
    {
        id: 'res_1',
        title: 'Understanding Early Signs of Autism Spectrum Disorder',
        description: 'A comprehensive guide to recognizing early developmental signs that may indicate autism in toddlers and young children.',
        category: 'article',
        topics: ['autism-spectrum-disorder', 'early-intervention'],
        author: 'Dr. Sarah Mitchell',
        publishedDate: '2024-11-15T00:00:00Z',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
        resourceUrl: 'https://example.com/articles/autism-signs',
        isPremium: false,
        isFavorite: true,
        downloadCount: 0,
        viewCount: 1250,
        createdAt: '2024-11-15T00:00:00Z',
        updatedAt: '2024-11-15T00:00:00Z',
    },
    {
        id: 'res_2',
        title: 'Motor Skills Development Activities for Toddlers',
        description: 'Video tutorial demonstrating fun activities to improve fine and gross motor skills in children aged 1-3 years.',
        category: 'video',
        topics: ['motor-skills-development', 'therapy-techniques'],
        author: 'Play Therapy Center',
        publishedDate: '2024-10-20T00:00:00Z',
        thumbnailUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        resourceUrl: 'https://youtube.com/watch?example',
        isPremium: false,
        isFavorite: false,
        downloadCount: 0,
        viewCount: 3420,
        duration: '18:45',
        createdAt: '2024-10-20T00:00:00Z',
        updatedAt: '2024-10-20T00:00:00Z',
    },
    {
        id: 'res_3',
        title: 'ADHD Daily Routine Checklist',
        description: 'Printable daily routine checklist designed to help children with ADHD stay organized and focused throughout the day.',
        category: 'document',
        topics: ['adhd', 'behavioral-support'],
        author: 'Child Development Network',
        publishedDate: '2024-12-01T00:00:00Z',
        resourceUrl: 'https://example.com/downloads/adhd-checklist.pdf',
        isPremium: false,
        isFavorite: true,
        downloadCount: 890,
        viewCount: 2100,
        fileSize: '1.2 MB',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z',
    },
    {
        id: 'res_4',
        title: 'Speech Milestone Tracker Tool',
        description: 'Interactive tool to track your child\'s speech and language development milestones from birth to 5 years.',
        category: 'tool',
        topics: ['speech-&-language-delays', 'educational-strategies'],
        author: 'Daira Platform',
        publishedDate: '2024-09-10T00:00:00Z',
        resourceUrl: 'https://example.com/tools/speech-tracker',
        isPremium: false,
        isFavorite: false,
        downloadCount: 0,
        viewCount: 1580,
        createdAt: '2024-09-10T00:00:00Z',
        updatedAt: '2024-09-10T00:00:00Z',
    },
    {
        id: 'res_5',
        title: 'Autism Society of America',
        description: 'National organization providing resources, support groups, and advocacy for individuals with autism and their families.',
        category: 'link',
        topics: ['autism-spectrum-disorder', 'parent-training'],
        publishedDate: '2024-08-15T00:00:00Z',
        resourceUrl: 'https://www.autism-society.org',
        isPremium: false,
        isFavorite: false,
        downloadCount: 0,
        viewCount: 890,
        createdAt: '2024-08-15T00:00:00Z',
        updatedAt: '2024-08-15T00:00:00Z',
    },
    {
        id: 'res_6',
        title: 'Social Skills Training Video Series',
        description: 'Series of videos teaching social interaction skills through role-playing and guided activities for children aged 4-8.',
        category: 'video',
        topics: ['social-skills', 'therapy-techniques'],
        author: 'Behavioral Therapy Institute',
        publishedDate: '2024-11-28T00:00:00Z',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400',
        resourceUrl: 'https://youtube.com/playlist?example',
        isPremium: true,
        isFavorite: false,
        downloadCount: 0,
        viewCount: 2340,
        duration: '1:25:00',
        createdAt: '2024-11-28T00:00:00Z',
        updatedAt: '2024-11-28T00:00:00Z',
    },
    {
        id: 'res_7',
        title: 'Parent Guide to ABA Therapy',
        description: 'Complete guide explaining Applied Behavior Analysis therapy techniques parents can use at home.',
        category: 'document',
        topics: ['therapy-techniques', 'parent-training'],
        author: 'Dr. James Rodriguez',
        publishedDate: '2024-10-05T00:00:00Z',
        resourceUrl: 'https://example.com/downloads/aba-guide.pdf',
        isPremium: false,
        isFavorite: true,
        downloadCount: 1456,
        viewCount: 3890,
        fileSize: '3.8 MB',
        createdAt: '2024-10-05T00:00:00Z',
        updatedAt: '2024-10-05T00:00:00Z',
    },
    {
        id: 'res_8',
        title: 'Managing ADHD in the Classroom',
        description: 'Strategies for parents to work with teachers to support children with ADHD in educational settings.',
        category: 'article',
        topics: ['adhd', 'educational-strategies'],
        author: 'Educational Psychology Today',
        publishedDate: '2024-12-10T00:00:00Z',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
        resourceUrl: 'https://example.com/articles/adhd-classroom',
        isPremium: false,
        isFavorite: false,
        downloadCount: 0,
        viewCount: 780,
        createdAt: '2024-12-10T00:00:00Z',
        updatedAt: '2024-12-10T00:00:00Z',
    },
];

class ResourceService {
    private mockData: Resource[] = [...mockResources];

    async getResources(filters?: ResourceFilters): Promise<{ success: boolean; data: Resource[] }> {
        try {
            const params = filters || {};
            const response = await api.get('/parent/resources', { params });
            return response.data;
        } catch (error) {
            // Return mock data as fallback
            return { success: true, data: this.mockData };
        }
    }

    async getResource(id: string): Promise<{ success: boolean; data: Resource }> {
        try {
            const response = await api.get(`/parent/resources/${id}`);
            return response.data;
        } catch (error) {
            const resource = this.mockData.find(r => r.id === id);
            if (resource) {
                return { success: true, data: resource };
            }
            throw new Error('Resource not found');
        }
    }

    async toggleFavorite(id: string): Promise<{ success: boolean; data: Resource }> {
        try {
            const response = await api.post(`/parent/resources/${id}/favorite`);
            return response.data;
        } catch (error) {
            const resourceIndex = this.mockData.findIndex(r => r.id === id);
            if (resourceIndex !== -1) {
                this.mockData[resourceIndex].isFavorite = !this.mockData[resourceIndex].isFavorite;
                return { success: true, data: this.mockData[resourceIndex] };
            }
            throw new Error('Resource not found');
        }
    }

    async getFavorites(): Promise<{ success: boolean; data: Resource[] }> {
        try {
            const response = await api.get('/parent/resources/favorites');
            return response.data;
        } catch (error) {
            const favorites = this.mockData.filter(r => r.isFavorite);
            return { success: true, data: favorites };
        }
    }

    async trackView(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/resources/${id}/view`);
            return response.data;
        } catch (error) {
            const resourceIndex = this.mockData.findIndex(r => r.id === id);
            if (resourceIndex !== -1) {
                this.mockData[resourceIndex].viewCount += 1;
            }
            return { success: true };
        }
    }

    async trackDownload(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/resources/${id}/download`);
            return response.data;
        } catch (error) {
            const resourceIndex = this.mockData.findIndex(r => r.id === id);
            if (resourceIndex !== -1) {
                this.mockData[resourceIndex].downloadCount += 1;
            }
            return { success: true };
        }
    }

    async shareResource(id: string, clinicianIds: string[]): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/resources/${id}/share`, { clinicianIds });
            return response.data;
        } catch (error) {
            alert('Share with clinician feature coming soon!');
            return { success: false };
        }
    }
}

export default new ResourceService();
