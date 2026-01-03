import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import authService from '../services/auth.service';

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            setError('');
            await authService.login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-[#2563EB]" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Sign in to your Daira parent account</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700 animate-in shake duration-300">
                        <XCircle className="shrink-0" size={20} />
                        <div className="text-sm">
                            <p className="font-bold">{error}</p>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
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
                                className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-wider"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                                className="w-full h-12 pl-11 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB]"
                        />
                        <div className="text-sm">
                            <span className="font-medium text-slate-700">Remember me</span>
                        </div>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-12 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
              ${loading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-[#2563EB] hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Signing in...
                            </>
                        ) : (
                            <>
                                <Lock size={18} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-[#2563EB] hover:text-blue-700">
                            Create one now
                        </Link>
                    </p>
                </div>

                {/* Trust Message */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                        🔒 Your data is encrypted and secure. We're committed to protecting your family's privacy.
                    </p>
                </div>
            </div>
        </div>
    );
}
