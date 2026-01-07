import React, { useState } from 'react';
import logo from '@common/logo.png';

// Interfaces based on requirements
interface TeacherLoginProps {
    onLoginSuccess: (data: { token: string; user: any }) => void;
    onNavigate: (view: string) => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: 'teacher';
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
            assignment: string;
            school: {
                id: string;
                name: string;
            };
        };
    };
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    // Use environment variable or default for API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleBypassLogin = () => {
        const mockData: LoginResponse = {
            token: 'mock-jwt-token-for-dev',
            user: {
                id: 'dev-teacher-id',
                email: 'teacher@demo.com',
                role: 'teacher',
                teacher: {
                    id: 'dev-teacher-profile-id',
                    firstName: 'Demo',
                    lastName: 'Teacher',
                    assignment: 'Grade 1 - Section A',
                    school: {
                        id: 'dev-school-id',
                        name: 'Demo International School'
                    }
                }
            }
        };

        // Store auth data
        localStorage.setItem('auth_token', mockData.token);
        localStorage.setItem('user', JSON.stringify(mockData.user));
        localStorage.setItem('role', 'teacher');

        onLoginSuccess(mockData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/teacher/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store auth data
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('role', 'teacher');

            if (rememberMe) {
                localStorage.setItem('rememberED_email', formData.email);
            }

            onLoginSuccess(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50 text-slate-900 font-display">
            {/* Top Navigation */}
            <header className="w-full px-6 py-4 lg:px-10 flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Daira Logo" className="h-12 w-auto" />
                </div>
                <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-blue-50 text-[#135bec] hover:bg-blue-100 transition-colors text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="mr-2 material-symbols-outlined text-[18px]">help</span>
                    <span className="truncate">Help & Support</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 relative z-0">
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 "></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -z-10 "></div>

                <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden">
                    <div className="px-8 pt-10 pb-8">
                        {/* Headline */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-[#135bec]">
                                <span className="material-symbols-outlined text-[28px]">school</span>
                            </div>
                            <h1 className="text-slate-900 tracking-tight text-[28px] font-bold leading-tight text-center">Teacher Login</h1>
                            <p className="text-slate-500 text-sm font-normal leading-normal pt-2 text-center max-w-xs">
                                Welcome to the Daira Teacher Portal. Please enter your credentials to manage your class.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Error Alert */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-slate-900 text-sm font-semibold leading-normal">Email Address</p>
                                </div>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex w-full rounded-lg text-slate-900 border border-slate-200 bg-white h-12 px-4 placeholder:text-slate-400 text-base focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                                        placeholder="teacher@school.edu"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </label>

                            {/* Password Field */}
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-slate-900 text-sm font-semibold leading-normal">Password</p>
                                </div>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex w-full rounded-lg text-slate-900 border border-slate-200 bg-white h-12 px-4 placeholder:text-slate-400 text-base focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all pr-12"
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center rounded-r-lg focus:outline-none"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
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
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-slate-600 ">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => onNavigate('forgot-password')}
                                    className="text-sm font-medium text-[#135bec] hover:text-blue-700 hover:underline decoration-2 underline-offset-2 transition-all"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#135bec] hover:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="truncate">Log In to Portal</span>
                                        <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleBypassLogin}
                                className="w-full mt-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors dashed border border-slate-300 flex items-center justify-center gap-2"
                            >
                                <span>⚡️</span> Bypass Login (Dev Mode)
                            </button>
                        </form>

                        {/* Info Note - Replaces "Switch account" */}
                        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-100 ">
                            <span className="material-symbols-outlined text-[20px] shrink-0">info</span>
                            <p className="leading-relaxed">Teachers cannot register themselves. If you don't have an account, please contact your school administrator.</p>
                        </div>
                    </div>

                    {/* Secure Login Footer in Card */}
                    <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-center gap-2">
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

export default TeacherLogin;
