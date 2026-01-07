import React, { useState } from 'react';
import logo from '@common/logo.png';
import { api } from '../services/api';

interface SchoolAdminLoginProps {
    onLogin: (user?: any) => void;
    onSignup: () => void;
}

const SchoolAdminLogin: React.FC<SchoolAdminLoginProps> = ({ onLogin, onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/school-auth/login', {
                email,
                password
            });

            // FIXED: Backend returns { success: true, data: { token, user } }
            // We need to extract from response.data.data, not response.data
            const { token, user } = response.data.data || response.data;

            // Log for debugging
            console.log("Login successful, user data:", user);

            if (!token) {
                throw new Error('No access token received from server');
            }

            // Store auth data
            localStorage.setItem('school_admin_token', token);
            localStorage.setItem('school_admin_user', JSON.stringify(user));

            if (rememberMe) {
                localStorage.setItem('remember_email', email);
            } else {
                localStorage.removeItem('remember_email');
            }

            // Success
            onLogin(user); // Pass user data to parent
        } catch (err: any) {
            console.error("Login Error:", err);

            // REMOVED: Mock fallback. It was causing issues effectively masking
            // real backend errors and storing invalid tokens.
            // If the backend is down, we want the user to know.


            if (err.response) {
                if (err.response.data && err.response.data.error && err.response.data.error.message) {
                    setError(err.response.data.error.message);
                } else if (err.response.status === 401) {
                    setError('Invalid email or password.');
                } else if (err.response.status === 403) {
                    // Start of the error message for pending/rejected
                    setError(err.response.data.message || 'Account not verified.');
                } else {
                    setError(err.response.data.message || 'Login failed. Please try again.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            if (loading) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-white font-display">
            <header className="w-full px-6 py-4 lg:px-10 flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Daira Logo" className="h-12 w-auto" />
                </div>
                <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-blue-50 dark:bg-slate-800 text-[#135bec] hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="mr-2 material-symbols-outlined text-[18px]">help</span>
                    <span className="truncate">Help & Support</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 relative z-0">
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 dark:bg-blue-900/10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -z-10 dark:bg-purple-900/10"></div>

                <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-white/50 dark:border-slate-700 overflow-hidden">
                    <div className="px-8 pt-10 pb-8">
                        {/* Headline */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-[#135bec]">
                                <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
                            </div>
                            <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">School Admin Login</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal pt-2 text-center max-w-xs">
                                Welcome back. Please enter your email and password to access the dashboard.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Error Alert */}
                            {error && (
                                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-lg text-sm mb-4 border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">Email Address</p>
                                </div>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                                        placeholder="name@school.edu"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </label>

                            {/* Password Field */}
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">Password</p>
                                </div>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all pr-12"
                                        placeholder="Enter your secure password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center rounded-r-lg focus:outline-none"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                            </label>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                                </label>
                                <button type="button" className="text-sm font-medium text-[#135bec] hover:text-blue-700 hover:underline decoration-2 underline-offset-2 transition-all">
                                    Forgot password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#135bec] hover:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="truncate">Log In to Dashboard</span>
                                        <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white dark:bg-slate-800 px-3 text-slate-500 dark:text-slate-400">or</span>
                            </div>
                        </div>

                        {/* Secondary Action */}
                        <div className="flex flex-col gap-4">
                            <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-bold leading-normal transition-all">
                                <span className="material-symbols-outlined mr-2 text-[18px]">switch_account</span>
                                <span className="truncate">Switch Account</span>
                            </button>

                            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                Don't have an account?{' '}
                                <button
                                    onClick={onSignup}
                                    className="text-[#135bec] hover:text-blue-700 font-bold hover:underline"
                                >
                                    Sign up
                                </button>
                            </p>

                            {/* Dev Bypass Button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const mockUser = {
                                            id: 'school-admin-dev',
                                            name: 'Sarah Jenkins',
                                            email: 'admin@school.edu',
                                            role: 'ADMIN',
                                            schoolProfile: {
                                                schoolName: 'Greenwood High',
                                                schoolId: 'SCH-001'
                                            }
                                        };
                                        localStorage.setItem('school_admin_token', 'dev-token-bypass');
                                        localStorage.setItem('school_admin_user', JSON.stringify(mockUser));
                                        onLogin(mockUser);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors dashed-border"
                                >
                                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                                    [DEV] Connect as Admin
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Secure Login Footer in Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 px-8 py-4 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-green-500 text-[16px]">lock</span>
                        <p className="text-xs text-slate-500 font-medium">Secure SSL Encrypted Connection</p>
                    </div>
                </div>
            </main>

            {/* Page Footer */}
            <footer className="w-full py-6 text-center">
                <div className="flex justify-center gap-6 mb-4">
                    <a className="text-sm text-slate-500 hover:text-[#135bec] transition-colors" href="#">Privacy Policy</a>
                    <a className="text-sm text-slate-500 hover:text-[#135bec] transition-colors" href="#">Terms of Service</a>
                    <a className="text-sm text-slate-500 hover:text-[#135bec] transition-colors" href="#">Contact Support</a>
                </div>
                <p className="text-xs text-slate-400">© 2024 Daira Education Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SchoolAdminLogin;
