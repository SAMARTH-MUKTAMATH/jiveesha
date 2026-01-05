// AUTO-LOGIN BYPASS FOR DEVELOPMENT - Remove in production
// This file sets up a mock clinician user for testing

export const initAuthBypass = () => {
    // Use 'dev-token' which the backend recognizes in development mode
    const mockToken = 'dev-token';

    // Set tokens in localStorage
    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('refresh_token', mockToken);

    // Only set mock user if no user exists (first time load)
    const existingUser = localStorage.getItem('user');
    if (!existingUser) {
        const mockUser = {
            id: 'clinician-test-123',
            email: 'dr.jane@daira.com',
            role: 'clinician',
            status: 'active',
            profile: {
                first_name: 'Jane',
                last_name: 'Rivera',
                professional_title: 'Clinical Psychologist',
                verification_status: 'verified',
                photo_url: null
            },
            credentials: []
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log('🔓 Auth bypass initialized - Logged in as Dr. Jane Rivera');
    } else {
        console.log('🔓 Auth bypass initialized - Using existing user profile');
    }
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
    initAuthBypass();
}
