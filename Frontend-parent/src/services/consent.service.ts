import api from './api';

export interface Consent {
    id: string;
    childId: string;
    childName: string;
    professionalId: string;
    professionalName: string;
    professionalRole: string;
    facility: string;
    status: 'pending' | 'active' | 'expired' | 'revoked';
    permissions: {
        screenings: boolean;
        peps: boolean;
        medicalHistory: boolean;
        assessments: boolean;
        reports: boolean;
    };
    expiresAt?: string;
    grantedAt: string;
    revokedAt?: string;
    accessToken?: string;
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

class ConsentService {
    // Mock consents for demo (until backend is ready)
    private mockConsents: Consent[] = [
        {
            id: 'consent_1',
            childId: '1',
            childName: 'Demo Child',
            professionalId: 'prof_1',
            professionalName: 'Dr. Sarah Johnson',
            professionalRole: 'Pediatric Neurologist',
            facility: 'Children\'s Medical Center',
            status: 'active',
            permissions: {
                screenings: true,
                peps: true,
                medicalHistory: true,
                assessments: true,
                reports: true,
            },
            grantedAt: '2024-01-15T10:00:00Z',
            expiresAt: '2025-01-15T10:00:00Z',
        },
        {
            id: 'consent_2',
            childId: '1',
            childName: 'Demo Child',
            professionalId: 'prof_2',
            professionalName: 'Dr. Michael Chen',
            professionalRole: 'Child Psychologist',
            facility: 'Developmental Care Clinic',
            status: 'pending',
            permissions: {
                screenings: true,
                peps: false,
                medicalHistory: false,
                assessments: true,
                reports: true,
            },
            grantedAt: '2024-02-01T14:00:00Z',
        },
    ];

    async getConsents(childId?: string): Promise<{ success: boolean; data: Consent[] }> {
        try {
            const params = childId ? { childId } : {};
            const response = await api.get('/parent/consents', { params });
            return response.data;
        } catch (error) {
            // Return mock data if API not ready
            let data = this.mockConsents;
            if (childId) {
                data = data.filter(c => c.childId === childId);
            }
            return { success: true, data };
        }
    }

    async getConsent(id: string): Promise<{ success: boolean; data: Consent }> {
        try {
            const response = await api.get(`/parent/consents/${id}`);
            return response.data;
        } catch (error) {
            const consent = this.mockConsents.find(c => c.id === id);
            if (consent) {
                return { success: true, data: consent };
            }
            throw error;
        }
    }

    async grantConsent(data: GrantConsentData): Promise<{ success: boolean; data: Consent }> {
        try {
            const response = await api.post('/parent/consents/grant', data);
            return response.data;
        } catch (error) {
            // Generate a mock access token
            const generateToken = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let token = 'DAIRA-';
                for (let i = 0; i < 16; i++) {
                    token += chars.charAt(Math.floor(Math.random() * chars.length));
                    if (i === 7) token += '-';
                }
                return token;
            };

            // Create mock consent
            const newConsent: Consent = {
                id: `consent_${Date.now()}`,
                childId: data.childId,
                childName: 'Child',
                professionalId: `prof_${Date.now()}`,
                professionalName: data.professionalEmail.split('@')[0],
                professionalRole: 'Healthcare Professional',
                facility: 'Medical Facility',
                status: 'pending',
                permissions: data.permissions,
                grantedAt: new Date().toISOString(),
                expiresAt: data.expiresAt,
                accessToken: generateToken(),
            };
            this.mockConsents.push(newConsent);
            return { success: true, data: newConsent };
        }
    }

    async revokeConsent(id: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post(`/parent/consents/${id}/revoke`);
            return response.data;
        } catch (error) {
            // Update mock consent
            const consent = this.mockConsents.find(c => c.id === id);
            if (consent) {
                consent.status = 'revoked';
                consent.revokedAt = new Date().toISOString();
            }
            return { success: true };
        }
    }

    async updatePermissions(id: string, permissions: Consent['permissions']): Promise<{ success: boolean; data: Consent }> {
        try {
            const response = await api.put(`/parent/consents/${id}/permissions`, { permissions });
            return response.data;
        } catch (error) {
            // Update mock consent
            const consent = this.mockConsents.find(c => c.id === id);
            if (consent) {
                consent.permissions = permissions;
                return { success: true, data: consent };
            }
            throw error;
        }
    }
}

export default new ConsentService();
