import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
    role: 'parent' | 'clinician';
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    preferredLanguage?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            email: string;
            role: string;
            firstName?: string;
            lastName?: string;
        };
        parent?: any; // Only present for parent login
        token: string; // Unified token field name mapping if needed, but backend responses differ slightly
    } | any; // Allow flexibility as we unify
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<any> {
        let endpoint = '/parent/auth/login';
        if (credentials.role === 'clinician') {
            endpoint = '/auth/login';
        }

        // We remove 'role' from credentials before sending if the backend doesn't expect it in the body
        // But for clarity in this service, we passed it in.
        // The backends likely just want { email, password }
        const { role, ...loginData } = credentials;

        const response = await api.post(endpoint, loginData);

        if (response.data.success) {
            // Normalize response data
            const data = response.data.data;
            const token = data.token || data.access_token; // Parent uses 'token', Clinician uses 'access_token'

            // Normalize user object
            const user = data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userRole', role); // Persist role for UI logic
        }
        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/parent/auth/register', data);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem('userRole', 'parent');
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getUserRole() {
        return localStorage.getItem('userRole');
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

export default new AuthService();
