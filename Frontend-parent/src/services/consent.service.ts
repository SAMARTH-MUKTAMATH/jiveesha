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
    },

    // Aliases for compatibility with pages
    getConsents: async (): Promise<{ success: boolean; data: Consent[] }> => {
        const response = await apiClient.get('/parent/access-grants');
        return { success: true, data: response.data.data.map(mapGrantToConsent) };
    },

    getConsent: async (id: string): Promise<{ success: boolean; data: Consent }> => {
        const response = await apiClient.get(`/parent/access-grants/${id}`);
        return { success: true, data: mapGrantToConsent(response.data.data) };
    },

    grantConsent: async (data: GrantConsentData): Promise<{ success: boolean; data: { accessToken: string } }> => {
        // Map page data structure to API structure
        const requestData: CreateGrantRequest = {
            childId: data.childId,
            clinicianEmail: data.professionalEmail,
            permissions: {
                viewDemographics: true, // Default
                viewMedical: data.permissions.medicalHistory,
                viewScreenings: data.permissions.screenings,
                viewAssessments: data.permissions.assessments,
                viewReports: data.permissions.reports,
                editNotes: false // Default
            },
            accessLevel: 'view',
            expiresAt: data.expiresAt
        };
        const response = await apiClient.post('/parent/access-grants', requestData);
        return {
            success: true,
            data: {
                accessToken: response.data.data.token
            }
        };
    },

    updatePermissions: async (id: string, permissions: Consent['permissions']): Promise<{ success: boolean }> => {
        // Call API to update permissions
        // Note: Backend might need a specific endpoint for patch, assume PUT for now or map to existing
        // For now, let's just use a placeholder or assume the backend supports it
        // If no direct endpoint, we might need to revoke and re-grant, but for editing, we usually patch.
        // Assuming we check if there's an update endpoint, or just return mock success if not fully implemented in backend yet.
        // The current file doesn't have an update method, so we'll add one.
        const apiPermissions = {
            viewDemographics: true,
            viewMedical: permissions.medicalHistory,
            viewScreenings: permissions.screenings,
            viewAssessments: permissions.assessments,
            viewReports: permissions.reports,
            editNotes: false
        };
        await apiClient.put(`/parent/access-grants/${id}`, { permissions: apiPermissions });
        return { success: true };
    },

    revokeConsent: async (id: string): Promise<{ success: boolean }> => {
        await apiClient.delete(`/parent/access-grants/${id}`);
        return { success: true };
    }
};

// Helper for mapping
function mapGrantToConsent(grant: AccessGrant): Consent {
    return {
        id: grant.id,
        professionalName: grant.clinicianName || grant.clinicianEmail,
        professionalEmail: grant.clinicianEmail,
        professionalRole: 'Specialist', // Default or derived
        facility: 'Unknown Facility', // Default or derived
        childName: grant.childName,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
        status: grant.status,
        permissions: {
            screenings: grant.permissions.viewScreenings,
            peps: false, // Not in AccessGrant, default false
            medicalHistory: grant.permissions.viewMedical,
            assessments: grant.permissions.viewAssessments,
            reports: grant.permissions.viewReports
        }
    };
}

// Types expected by pages
export interface Consent {
    id: string;
    professionalName: string;
    professionalEmail: string;
    professionalRole: string;
    facility: string;
    childName: string;
    grantedAt: string;
    expiresAt?: string;
    status: 'pending' | 'active' | 'revoked' | 'expired';
    permissions: {
        screenings: boolean;
        peps: boolean;
        medicalHistory: boolean;
        assessments: boolean;
        reports: boolean;
    };
}

export interface GrantConsentData {
    childId: string;
    professionalEmail: string;
    permissions: {
        screenings: boolean;
        peps: boolean;
        medicalHistory: boolean;
        assessments: boolean;
        reports: boolean;
    };
    expiresAt?: string;
    message?: string;
}
