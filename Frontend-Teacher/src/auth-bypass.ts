// AUTO-LOGIN BYPASS FOR DEVELOPMENT
// This file sets up a mock teacher user for testing since backend routes don't exist yet

export const initAuthBypass = () => {
    // Check if already logged in
    if (localStorage.getItem('auth_token')) {
        console.log('🔓 Auth bypass: User already logged in');
        return;
    }

    const mockData = {
        token: 'mock-jwt-token-for-dev',
        user: {
            id: 'dev-teacher-id',
            email: 'teacher@demo.com',
            role: 'teacher',
            teacher: {
                id: 'dev-teacher-profile-id',
                firstName: 'Sarah',
                lastName: 'Jenkins',
                assignment: 'Grade 3 - Section B',
                school: {
                    id: 'dev-school-id',
                    name: 'Demo International School'
                }
            }
        }
    };

    // Set tokens in localStorage to match TeacherLogin.tsx logic
    localStorage.setItem('auth_token', mockData.token);
    localStorage.setItem('user', JSON.stringify(mockData.user));
    localStorage.setItem('role', 'teacher');

    console.log('🔓 Auth bypass initialized - Logged in as Ms. Sarah Jenkins');

    // Force reload to apply changes if we just set them
    if (window.location.pathname === '/' || window.location.pathname === '/login') {
        // Optional: redirect logic if needed, but simply setting storage might be enough 
        // if done before app mount.
    }
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
    initAuthBypass();
}
