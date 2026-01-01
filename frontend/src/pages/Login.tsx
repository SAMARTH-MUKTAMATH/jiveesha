import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, User, Stethoscope } from 'lucide-react';
import authService from '../services/auth.service';

interface LoginFormData {
    email: string;
    password: string;
}

type UserRole = 'parent' | 'clinician';

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<UserRole>('parent');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            setError('');
            await authService.login({ ...data, role });
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.error?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${role === 'parent' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-teal-50 to-emerald-100'}`}>
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">

                {/* Role Selector */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('parent')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'parent'
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Parent
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('clinician')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'clinician'
                                ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Clinician
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${role === 'parent' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {role === 'parent' ? 'Parent Portal' : 'Clinical Access'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {role === 'parent' ? 'Sign in to access your dashboard' : 'Secure login for healthcare providers'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                        <p className="text-sm text-red-800 flex items-center">
                            <span className="mr-2">⚠️</span> {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${role === 'parent' ? 'border-gray-300 focus:ring-blue-500' : 'border-gray-300 focus:ring-teal-500'}`}
                            placeholder={role === 'parent' ? "parent@example.com" : "doctor@clinic.com"}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${role === 'parent' ? 'border-gray-300 focus:ring-blue-500' : 'border-gray-300 focus:ring-teal-500'}`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className={`h-4 w-4 border-gray-300 rounded focus:ring-offset-0 ${role === 'parent' ? 'text-blue-600 focus:ring-blue-500' : 'text-teal-600 focus:ring-teal-500'}`}
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className={`text-sm font-medium hover:underline ${role === 'parent' ? 'text-blue-600' : 'text-teal-600'}`}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] ${role === 'parent'
                                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className={`font-semibold hover:underline ${role === 'parent' ? 'text-blue-600' : 'text-teal-600'}`}>
                            Create {role === 'parent' ? 'a parent' : 'a clinician'} account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
