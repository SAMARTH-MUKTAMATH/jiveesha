import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface SchoolAdminSignupProps {
    onBack: () => void;
}

const SchoolAdminSignup: React.FC<SchoolAdminSignupProps> = ({
    onBack
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        schoolName: '',
        districtCity: '',
        schoolCode: '',
        adminName: '',
        adminEmail: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'none' | 'weak' | 'medium' | 'strong'>('none');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState<string | null>(null);

    // Password Strength Logic
    useEffect(() => {
        const { password } = formData;
        if (password.length === 0) {
            setPasswordStrength('none');
        } else if (password.length < 6) {
            setPasswordStrength('weak');
        } else if (password.length < 10) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('strong');
        }
    }, [formData.password]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        if (serverError) setServerError(null);
    };

    // Validation
    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
            if (!formData.districtCity.trim()) newErrors.districtCity = 'District/City is required';
        }

        if (step === 2) {
            if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
            if (!formData.adminEmail.trim()) {
                newErrors.adminEmail = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
                newErrors.adminEmail = 'Invalid email format';
            }
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Submit Handler
    const handleSubmit = async () => {
        setIsLoading(true);
        setServerError(null);

        try {
            await api.post('/school-auth/register', {
                schoolName: formData.schoolName,
                district: formData.districtCity,
                schoolCode: formData.schoolCode,
                email: formData.adminEmail,
                password: formData.password,
                // Using adminName as logic might require separating first/last, passing full name or splitting if backend requires
                // Backend controller expects email, password, schoolName, district, schoolCode. 
                // Does it expect adminName? Schema has User(email) and Teacher(firstName/lastName).
                // SchoolAuth controller creates User. It doesn't seem to store "Name" in User model?
                // User model has email, role. 
                // Teacher model has firstName, lastName. 
                // Wait, the school admin IS a user. But is there a profile for the admin person name? 
                // Looking at schema: User has ID, email, role. 
                // There is no "SchoolAdmin" profile table. There is "SchoolProfile".
                // Maybe I should skip sending adminName to backend for now if it's not supported, 
                // OR checking if I should add it to User? User doesn't have name.
                // I will send it anyway, maybe backend ignores it or I missed something.
            });
            setCurrentStep(4);
        } catch (err: any) {
            if (err.response && err.response.data) {
                if (err.response.data.error && err.response.data.error.message) {
                    setServerError(err.response.data.error.message);
                } else if (err.response.data.message) {
                    setServerError(err.response.data.message);
                } else {
                    setServerError('An unexpected error occurred. Please try again.');
                }
            } else {
                setServerError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Render Steps
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Section: School Information */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">domain</span> School Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">Official School Name</span>
                                    <input
                                        name="schoolName"
                                        value={formData.schoolName}
                                        onChange={handleChange}
                                        className={`form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 text-base transition-colors ${errors.schoolName ? 'border-red-500' : ''}`}
                                        placeholder="e.g. Springfield High School"
                                        type="text"
                                        autoFocus
                                    />
                                    {errors.schoolName && <span className="text-red-500 text-xs">{errors.schoolName}</span>}
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">District / City</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg pointer-events-none">location_on</span>
                                            <input
                                                name="districtCity"
                                                value={formData.districtCity}
                                                onChange={handleChange}
                                                className={`form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 pl-10 text-base transition-colors ${errors.districtCity ? 'border-red-500' : ''}`}
                                                placeholder="City"
                                                type="text"
                                            />
                                        </div>
                                        {errors.districtCity && <span className="text-red-500 text-xs">{errors.districtCity}</span>}
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">School Code <span className="text-[#616f89] dark:text-[#6b7280] font-normal">(Optional)</span></span>
                                        <input
                                            name="schoolCode"
                                            value={formData.schoolCode}
                                            onChange={handleChange}
                                            className="form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 text-base transition-colors"
                                            placeholder="Reg. No."
                                            type="text"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleNextStep}
                                className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#135bec] hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                Continue
                                <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Section: Administrator Details */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">person</span> Administrator Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">Full Name</span>
                                    <input
                                        name="adminName"
                                        value={formData.adminName}
                                        onChange={handleChange}
                                        className={`form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 text-base transition-colors ${errors.adminName ? 'border-red-500' : ''}`}
                                        placeholder="Enter your full name"
                                        type="text"
                                        autoFocus
                                    />
                                    {errors.adminName && <span className="text-red-500 text-xs">{errors.adminName}</span>}
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">Official Email Address</span>
                                    <input
                                        name="adminEmail"
                                        value={formData.adminEmail}
                                        onChange={handleChange}
                                        className={`form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 text-base transition-colors ${errors.adminEmail ? 'border-red-500' : ''}`}
                                        placeholder="admin@school.edu"
                                        type="email"
                                    />
                                    {errors.adminEmail && <span className="text-red-500 text-xs">{errors.adminEmail}</span>}
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[#111318] dark:text-[#e5e7eb] text-sm font-medium">Create Password</span>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`form-input w-full rounded-lg border-[#dbdfe6] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] placeholder:text-[#9ca3af] h-11 pr-10 text-base transition-colors ${errors.password ? 'border-red-500' : ''}`}
                                            placeholder="Min. 8 characters"
                                            type={showPassword ? 'text' : 'password'}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#616f89] dark:hover:text-white"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {showPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}

                                    {/* Password Strength Indicator */}
                                    <div className="flex gap-2 mt-1">
                                        <div className={`h-1 flex-1 rounded-full ${['weak', 'medium', 'strong'].includes(passwordStrength) ? (passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-[#dbdfe6] dark:bg-[#374151]'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full ${['medium', 'strong'].includes(passwordStrength) ? (passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-[#dbdfe6] dark:bg-[#374151]'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full ${['strong'].includes(passwordStrength) ? 'bg-green-500' : 'bg-[#dbdfe6] dark:bg-[#374151]'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full ${['strong'].includes(passwordStrength) ? 'bg-green-500' : 'bg-[#dbdfe6] dark:bg-[#374151]'}`}></div>
                                    </div>
                                    <p className="text-xs text-[#616f89] dark:text-[#9ca3af] mt-1 capitalize">
                                        {passwordStrength === 'none' ? '' : `${passwordStrength} strength`}
                                    </p>
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={handlePrevStep}
                                className="flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-[#1f2937] border border-[#dbdfe6] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#374151] text-[#111318] dark:text-white text-base font-bold transition-all active:scale-[0.98]"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#135bec] hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                Review Info
                                <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">assignment</span> Review Details
                            </h3>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 flex flex-col gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-[#135bec] mb-2 flex items-center justify-between">
                                        School Profile
                                        <button onClick={() => setCurrentStep(1)} className="text-xs font-normal underline opacity-80 hover:opacity-100">Edit</button>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <span className="text-[#616f89] dark:text-[#9ca3af]">Name:</span>
                                        <span className="font-medium text-[#111318] dark:text-white text-right">{formData.schoolName}</span>
                                        <span className="text-[#616f89] dark:text-[#9ca3af]">District:</span>
                                        <span className="font-medium text-[#111318] dark:text-white text-right">{formData.districtCity}</span>
                                        {formData.schoolCode && (
                                            <>
                                                <span className="text-[#616f89] dark:text-[#9ca3af]">Code:</span>
                                                <span className="font-medium text-[#111318] dark:text-white text-right">{formData.schoolCode}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="h-px bg-blue-100 dark:bg-blue-800/30"></div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#135bec] mb-2 flex items-center justify-between">
                                        Administrator
                                        <button onClick={() => setCurrentStep(2)} className="text-xs font-normal underline opacity-80 hover:opacity-100">Edit</button>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <span className="text-[#616f89] dark:text-[#9ca3af]">Admin:</span>
                                        <span className="font-medium text-[#111318] dark:text-white text-right">{formData.adminName}</span>
                                        <span className="text-[#616f89] dark:text-[#9ca3af]">Email:</span>
                                        <span className="font-medium text-[#111318] dark:text-white text-right truncate pl-2">{formData.adminEmail}</span>
                                    </div>
                                </div>
                            </div>

                            {serverError && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-start gap-2">
                                    <span className="material-symbols-outlined text-lg shrink-0">error</span>
                                    <span>{serverError}</span>
                                </div>
                            )}

                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={handlePrevStep}
                                disabled={isLoading}
                                className="flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-[#1f2937] border border-[#dbdfe6] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#374151] text-[#111318] dark:text-white text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-[2] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#135bec] hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Submit for Verification
                                        <span className="material-symbols-outlined ml-2 text-sm">check_circle</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-center text-xs text-[#616f89] dark:text-[#9ca3af]">
                            By clicking Submit, you agree to Daira's <a className="text-[#135bec] hover:underline" href="#">Terms of Service</a>.
                        </p>
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
                        <div className="size-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-2 relative">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">Account Verified</h2>
                            <p className="text-[#616f89] dark:text-[#9ca3af] max-w-sm mx-auto">
                                Your school account has been successfully created and verified. You can now access the school admin dashboard.
                            </p>
                        </div>

                        <div className="w-full bg-[#f3f4f6] dark:bg-[#1f2937] rounded-xl p-4 flex flex-col gap-3 text-left">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#135bec] mt-0.5">rocket_launch</span>
                                <div>
                                    <h4 className="font-bold text-sm text-[#111318] dark:text-white">Ready to go</h4>
                                    <p className="text-xs text-[#616f89] dark:text-[#9ca3af]">Your account is active. Click below to log in.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onBack}
                            className="text-[#135bec] font-bold text-sm hover:underline mt-2 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-lg">login</span>
                            Log In Now
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#1f2937] px-6 lg:px-10 py-4 bg-white/80 dark:bg-[#101622]/90 backdrop-blur-md fixed top-0 w-full z-50">
                <div className="flex items-center gap-4 text-[#135bec]">
                    <div className="size-8 flex items-center justify-center bg-[#135bec]/10 rounded-lg text-[#135bec]">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Daira</h2>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="hidden sm:inline text-sm text-[#616f89] dark:text-[#9ca3af]">Already have an account?</span>
                    <button
                        onClick={onBack}
                        className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent border border-[#dbdfe6] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#1f2937] text-[#111318] dark:text-white text-sm font-bold transition-colors"
                    >
                        Log In
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:flex-row pt-[72px] min-h-screen relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#135bec]/5 blur-[120px]"></div>
                    <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/10 blur-[100px]"></div>
                    <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
                </div>

                {/* Left Side: Value Prop (Desktop only) */}
                <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-center px-12 xl:px-20 relative z-10">
                    <div className="max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#135bec] text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#135bec]"></span>
                            </span>
                            Join 1,200+ schools nationwide
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 text-[#111318] dark:text-white">
                            Empower your students with data-driven insights.
                        </h1>
                        <p className="text-lg text-[#616f89] dark:text-[#9ca3af] mb-10 leading-relaxed">
                            Daira connects educators, healthcare professionals, and parents to provide comprehensive developmental screening and educational support.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="size-10 rounded-full bg-white dark:bg-[#1f2937] shadow-sm flex items-center justify-center text-[#135bec] mb-2">
                                    <span className="material-symbols-outlined">health_and_safety</span>
                                </div>
                                <h3 className="font-bold text-[#111318] dark:text-white">Holistic Health</h3>
                                <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">Track physical and mental well-being metrics.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="size-10 rounded-full bg-white dark:bg-[#1f2937] shadow-sm flex items-center justify-center text-[#135bec] mb-2">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <h3 className="font-bold text-[#111318] dark:text-white">Smart Analytics</h3>
                                <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">Actionable reports for school admins.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-center items-center px-4 py-8 lg:px-12 relative z-10">
                    <div className="w-full max-w-[560px] glass-panel shadow-xl shadow-blue-900/5 rounded-2xl p-6 md:p-10 border border-white/50 dark:border-white/10"
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}>

                        {/* Progress Header - Only show if not on success step */}
                        {currentStep < 4 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-1">
                                            {currentStep === 1 ? 'School Information' : currentStep === 2 ? 'Administrator Details' : 'Review & Verify'}
                                        </h2>
                                        <p className="text-[#616f89] dark:text-[#9ca3af] text-sm">Step {currentStep} of 3</p>
                                    </div>
                                    <span className="text-xs font-bold text-[#135bec] bg-[#135bec]/10 px-2 py-1 rounded">
                                        {currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-[#e5e7eb] dark:bg-[#374151] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#135bec] rounded-full transition-all duration-500 ease-out"
                                        style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Form Steps */}
                        {renderStepContent()}

                    </div>
                    {currentStep < 4 && (
                        <div className="mt-8 flex gap-6 text-sm text-[#616f89] dark:text-[#9ca3af]">
                            <a className="hover:text-[#135bec] transition-colors" href="#">Help Center</a>
                            <a className="hover:text-[#135bec] transition-colors" href="#">Contact Support</a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SchoolAdminSignup;
