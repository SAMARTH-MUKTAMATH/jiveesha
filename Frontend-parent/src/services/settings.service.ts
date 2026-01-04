import api from './api';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationPreferences {
    emailNotifications: {
        screeningReminders: boolean;
        pepUpdates: boolean;
        consentRequests: boolean;
        clinicianMessages: boolean;
        weeklyDigest: boolean;
    };
    smsNotifications: {
        screeningReminders: boolean;
        urgentAlerts: boolean;
    };
    pushNotifications: {
        enabled: boolean;
    };
}

export interface PrivacySettings {
    dataSharing: {
        shareWithClinicians: boolean;
        shareForResearch: boolean;
        shareAnonymousData: boolean;
    };
    visibility: {
        profileVisible: boolean;
        showActivityStatus: boolean;
    };
}

export interface UserPreferences {
    language: string; // e.g., "en", "hi", "ta"
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Mock data for development
const mockProfile: UserProfile = {
    id: 'user_1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 98765 43210',
    photoUrl: undefined,
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
};

const mockNotificationPrefs: NotificationPreferences = {
    emailNotifications: {
        screeningReminders: true,
        pepUpdates: true,
        consentRequests: true,
        clinicianMessages: true,
        weeklyDigest: false,
    },
    smsNotifications: {
        screeningReminders: true,
        urgentAlerts: true,
    },
    pushNotifications: {
        enabled: true,
    },
};

const mockPrivacySettings: PrivacySettings = {
    dataSharing: {
        shareWithClinicians: true,
        shareForResearch: false,
        shareAnonymousData: true,
    },
    visibility: {
        profileVisible: true,
        showActivityStatus: true,
    },
};

const mockPreferences: UserPreferences = {
    language: 'en',
    timezone: 'Asia/Kolkata',
    theme: 'light',
};

class SettingsService {
    private profile: UserProfile = { ...mockProfile };
    private notificationPrefs: NotificationPreferences = { ...mockNotificationPrefs };
    private privacySettings: PrivacySettings = { ...mockPrivacySettings };
    private preferences: UserPreferences = { ...mockPreferences };

    async getProfile(): Promise<{ success: boolean; data: UserProfile }> {
        try {
            const response = await api.get('/parent/auth/me');
            if (response.data?.success && response.data?.data) {
                const apiData = response.data.data;
                // Transform backend response to match UserProfile interface
                const profile: UserProfile = {
                    id: apiData.id,
                    firstName: apiData.firstName || '',
                    lastName: apiData.lastName || '',
                    email: apiData.email || '',
                    phone: apiData.parent?.phone || undefined,
                    photoUrl: apiData.parent?.photoUrl || undefined,
                    createdAt: apiData.parent?.createdAt || new Date().toISOString(),
                    updatedAt: apiData.parent?.updatedAt || new Date().toISOString(),
                };
                return { success: true, data: profile };
            }
            return response.data;
        } catch (error) {
            console.error('Failed to fetch profile from backend:', error);
            // Only use mock data as last resort fallback
            return { success: true, data: this.profile };
        }
    }

    async updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean; data: UserProfile }> {
        try {
            const response = await api.put('/parent/auth/profile', {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            });
            if (response.data?.success) {
                // Update local profile with the new data
                this.profile = { ...this.profile, ...data, updatedAt: new Date().toISOString() };
                return { success: true, data: this.profile };
            }
            return response.data;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }

    async updatePassword(data: UpdatePasswordData): Promise<{ success: boolean }> {
        try {
            const response = await api.post('/parent/auth/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to change password:', error);
            throw error;
        }
    }

    async uploadPhoto(file: File): Promise<{ success: boolean; photoUrl: string }> {
        try {
            const formData = new FormData();
            formData.append('photo', file);
            const response = await api.post('/parent/profile/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            // Mock upload - create object URL
            const photoUrl = URL.createObjectURL(file);
            this.profile.photoUrl = photoUrl;
            return { success: true, photoUrl };
        }
    }

    async getNotificationPreferences(): Promise<{ success: boolean; data: NotificationPreferences }> {
        try {
            const response = await api.get('/parent/settings/notifications');
            return response.data;
        } catch (error) {
            return { success: true, data: this.notificationPrefs };
        }
    }

    async updateNotificationPreferences(data: NotificationPreferences): Promise<{ success: boolean }> {
        try {
            const response = await api.put('/parent/settings/notifications', data);
            return response.data;
        } catch (error) {
            this.notificationPrefs = { ...data };
            return { success: true };
        }
    }

    async getPrivacySettings(): Promise<{ success: boolean; data: PrivacySettings }> {
        try {
            const response = await api.get('/parent/settings/privacy');
            return response.data;
        } catch (error) {
            return { success: true, data: this.privacySettings };
        }
    }

    async updatePrivacySettings(data: PrivacySettings): Promise<{ success: boolean }> {
        try {
            const response = await api.put('/parent/settings/privacy', data);
            return response.data;
        } catch (error) {
            this.privacySettings = { ...data };
            return { success: true };
        }
    }

    async getPreferences(): Promise<{ success: boolean; data: UserPreferences }> {
        try {
            const response = await api.get('/parent/settings/preferences');
            return response.data;
        } catch (error) {
            return { success: true, data: this.preferences };
        }
    }

    async updatePreferences(data: UserPreferences): Promise<{ success: boolean }> {
        try {
            const response = await api.put('/parent/settings/preferences', data);
            return response.data;
        } catch (error) {
            this.preferences = { ...data };
            return { success: true };
        }
    }

    async exportData(): Promise<{ success: boolean; downloadUrl: string }> {
        try {
            const response = await api.post('/parent/account/export');
            return response.data;
        } catch (error) {
            alert('Data export feature coming soon! Your data will be prepared for download.');
            return { success: false, downloadUrl: '' };
        }
    }

    async deleteAccount(password: string): Promise<{ success: boolean }> {
        try {
            const response = await api.post('/parent/account/delete', { password });
            return response.data;
        } catch (error) {
            // Mock validation
            if (password !== 'delete') {
                throw new Error('Invalid password');
            }
            return { success: true };
        }
    }
}

export default new SettingsService();
