const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: string;
        email: string;
        role: string;
        status: string;
        profile: {
            first_name: string;
            last_name: string;
            professional_title: string;
            verification_status: string;
            photo_url: string | null;
        } | null;
    };
}

interface User {
    id: string;
    email: string;
    role: string;
    status: string;
    profile: any;
    credentials: any[];
}

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string;
    age: number;
    gender: string;
    status: string;
    primary_concerns: string;
    tags: string[];
    contacts: any[];
    stats: {
        appointments: number;
        sessions: number;
        assessments: number;
    };
}

class ApiClient {
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...(options.headers as Record<string, string>),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle token expiry
                if (response.status === 401 && data.error?.code === 'TOKEN_EXPIRED') {
                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        // Retry the original request
                        return this.request(endpoint, options);
                    }
                    // Redirect to login
                    window.location.href = '/';
                }
                throw data;
            }

            return data;
        } catch (error: any) {
            if (error.error) {
                throw error;
            }
            throw {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: 'Failed to connect to server. Please check your connection.',
                },
            };
        }
    }

    private async refreshToken(): Promise<boolean> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.data.access_token);
                localStorage.setItem('refresh_token', data.data.refresh_token);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // ============================================
    // Auth endpoints
    // ============================================

    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        const response = await this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success && response.data) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    }

    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        professionalTitle?: string;
        phone?: string;
    }): Promise<ApiResponse<any>> {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                first_name: data.firstName,
                last_name: data.lastName,
                professional_title: data.professionalTitle,
                phone: data.phone,
            }),
        });
    }

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            await this.request('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    }

    async getMe(): Promise<ApiResponse<User>> {
        return this.request('/auth/me');
    }

    // ============================================
    // Patient endpoints
    // ============================================

    async getPatients(params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<ApiResponse<{ patients: Patient[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.status && params.status !== 'all') queryParams.set('status', params.status);
        if (params?.search) queryParams.set('search', params.search);

        const queryString = queryParams.toString();
        return this.request(`/patients${queryString ? `?${queryString}` : ''}`);
    }

    async getPatient(id: string): Promise<ApiResponse<Patient>> {
        return this.request(`/patients/${id}`);
    }

    async createPatient(data: any): Promise<ApiResponse<Patient>> {
        return this.request('/patients', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updatePatient(id: string, data: any): Promise<ApiResponse<Patient>> {
        return this.request(`/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deletePatient(id: string): Promise<ApiResponse<any>> {
        return this.request(`/patients/${id}`, {
            method: 'DELETE',
        });
    }

    // ============================================
    // Dashboard endpoints
    // ============================================

    async getDashboardStats(): Promise<ApiResponse<any>> {
        return this.request('/dashboard/stats');
    }

    async getRecentActivity(): Promise<ApiResponse<any>> {
        return this.request('/dashboard/recent-activity');
    }

    async getTodaySchedule(): Promise<ApiResponse<any>> {
        return this.request('/dashboard/today-schedule');
    }

    async getPendingTasks(): Promise<ApiResponse<any>> {
        return this.request('/dashboard/pending-tasks');
    }

    // ============================================
    // Appointments endpoints
    // ============================================

    async getAppointments(params?: {
        patientId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<ApiResponse<any[]>> {
        const queryParams = new URLSearchParams();
        if (params?.patientId) queryParams.set('patient_id', params.patientId);
        if (params?.fromDate) queryParams.set('from_date', params.fromDate);
        if (params?.toDate) queryParams.set('to_date', params.toDate);

        const queryString = queryParams.toString();
        return this.request(`/appointments${queryString ? `?${queryString}` : ''}`);
    }

    async getCalendarAppointments(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return this.request(`/appointments/calendar?start_date=${startDate}&end_date=${endDate}`);
    }

    async createAppointment(data: any): Promise<ApiResponse<any>> {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAvailableSlots(date: string, duration?: number): Promise<ApiResponse<any>> {
        return this.request(`/appointments/slots?date=${date}${duration ? `&duration=${duration}` : ''}`);
    }

    // ============================================
    // Credentials endpoints
    // ============================================

    async getCredentials(): Promise<ApiResponse<any[]>> {
        return this.request('/credentials');
    }

    async uploadCredential(formData: FormData): Promise<ApiResponse<any>> {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/credentials`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return response.json();
    }

    // ============================================
    // Profile endpoints
    // ============================================

    async getProfile(): Promise<ApiResponse<any>> {
        return this.request('/clinician/profile');
    }

    async updateProfile(data: any): Promise<ApiResponse<any>> {
        return this.request('/clinician/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getLocations(): Promise<ApiResponse<any[]>> {
        return this.request('/clinician/locations');
    }

    async getAvailability(): Promise<ApiResponse<any[]>> {
        return this.request('/clinician/availability');
    }

    async updateAvailability(availability: any[]): Promise<ApiResponse<any>> {
        return this.request('/clinician/availability', {
            method: 'PUT',
            body: JSON.stringify({ availability }),
        });
    }

    // ============================================
    // Settings endpoints
    // ============================================

    async getPreferences(): Promise<ApiResponse<any>> {
        return this.request('/settings/preferences');
    }

    async updatePreferences(data: any): Promise<ApiResponse<any>> {
        return this.request('/settings/preferences', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new ApiClient();

// Helper to check if user is logged in
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
};

// Helper to get current user
export const getCurrentUser = (): any => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
