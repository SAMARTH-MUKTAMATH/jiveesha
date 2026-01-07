import apiClient from './api';

export interface AccessGrant {
    id: string;
    childId: string;
    childName: string;
    clinicianId?: string;
    clinicianName?: string;
    clinicianEmail: string;
    status: 'pending' | 'active' | 'revoked' | 'expired';
    permissions: {
        viewDemographics: boolean;
        viewMedical: boolean;
        viewScreenings: boolean;
        viewAssessments: boolean;
        viewReports: boolean;
        editNotes: boolean;
    };
    accessLevel: 'view' | 'edit';
    token?: string;
    tokenExpiresAt?: string;
    grantedAt: string;
    activatedAt?: string;
    revokedAt?: string;
    expiresAt?: string;
    lastAccessedAt?: string;
}

export interface CreateGrantRequest {
    childId: string;
    clinicianEmail: string;
    permissions: {
        viewDemographics: boolean;
        viewMedical: boolean;
        viewScreenings: boolean;
        viewAssessments: boolean;
        viewReports: boolean;
        editNotes: boolean;
    };
    accessLevel: 'view' | 'edit';
    expiresAt?: string;
}

export interface CreateGrantResponse {
    id: string;
    token: string;
    tokenExpiresAt: string;
}

export const consentService = {
    // Get all access grants
    getAll: async (): Promise<AccessGrant[]> => {
        const response = await apiClient.get('/parent/access-grants');
        return response.data.data;
    },

    // Get single grant details
    getById: async (id: string): Promise<AccessGrant> => {
        const response = await apiClient.get(`/parent/access-grants/${id}`);
        return response.data.data;
    },

    // Create new access grant
    create: async (data: CreateGrantRequest): Promise<CreateGrantResponse> => {
        const response = await apiClient.post('/parent/access-grants', data);
        return response.data.data;
    },

    // Revoke access grant
    revoke: async (id: string): Promise<void> => {
        await apiClient.delete(`/parent/access-grants/${id}`);
    },

    // Validate consent token for importing/claiming a child
    validateToken: async (token: string): Promise<any> => {
        const response = await apiClient.post('/parent/access-grants/validate', { token });
        return response.data;
    },

    // Claim access for a child using a token
    claimToken: async (token: string): Promise<any> => {
        const response = await apiClient.post('/parent/access-grants/claim', { token });
        return response.data;
    }
};

// Export verified
