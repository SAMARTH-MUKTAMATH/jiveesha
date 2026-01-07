import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Calendar, Users, FileText, Loader2, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import Stepper from '../components/Stepper';
import childrenService from '../services/children.service';
import type { AddChildData } from '../services/children.service';

interface FormData extends AddChildData {
    relationshipType?: string;
}

const steps = [
    { label: 'Basic Info', description: 'Name and birthday' },
    { label: 'Details', description: 'Gender and concerns' },
    { label: 'Review', description: 'Confirm information' },
];

export default function AddChild() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm<FormData>();

    const formData = watch();

    const nextStep = async () => {
        console.log('nextStep called. Current step:', currentStep);
        // Clear any previous errors first
        setError('');

        // Validate current step before proceeding
        let fieldsToValidate: (keyof FormData)[] = [];

        if (currentStep === 0) {
            // Step 1: Basic Info - validate required fields
            fieldsToValidate = ['firstName', 'lastName', 'dateOfBirth'];
        } else if (currentStep === 1) {
            // Step 2: Details - validate required fields
            fieldsToValidate = ['gender'];
        }

        // Trigger validation only for the current step's required fields
        if (fieldsToValidate.length > 0) {
            const isValid = await trigger(fieldsToValidate);

            if (!isValid) {
                setError('Please fill in all required fields before continuing.');
                return;
            }
        }

        // If validation passes, move to next step
        if (currentStep < steps.length - 1) {
            console.log('Moving to step:', currentStep + 1);
            setCurrentStep(currentStep + 1);
            // Small delay to ensure UI updates before button type changes
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setError(''); // Clear errors when going back
        }
    };

    const onSubmit = async (data: FormData, e?: React.BaseSyntheticEvent) => {
        console.log('AddChild onSubmit触发. currentStep:', currentStep);
        e?.preventDefault();

        // Prevent accidental submission via Enter key from earlier steps
        if (currentStep !== steps.length - 1) {
            console.log('Blocking submission, moving to next step instead.');
            setCurrentStep(step => step + 1);
            return;
        }

        console.log('Submitting data:', data);
        try {
            setLoading(true);
            setError('');

            await childrenService.addChild(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to add child. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = () => {
        if (formData.dateOfBirth) {
            const age = childrenService.calculateAge(formData.dateOfBirth);
            return `${age.years} years, ${age.months} months`;
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <Heart className="text-[#2563EB]" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Add Your Child</h1>
                    <p className="text-slate-600">Help us understand your child's developmental needs</p>
                </div>

                {/* Stepper */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700 animate-in shake duration-300">
                            <p className="text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentStep !== steps.length - 1) {
                                console.log('Enter key blocked on step', currentStep);
                                e.preventDefault();
                            }
                        }}
                        className="space-y-6"
                    >
                        {/* Step 1: Basic Info */}
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Information</h2>

                                {/* First Name */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            {...register('firstName', { required: 'First name is required' })}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            {...register('lastName', { required: 'Last name is required' })}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    {errors.lastName && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lastName.message}</p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            {...register('dateOfBirth', { required: 'Date of birth is required' })}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        />
                                    </div>
                                    {errors.dateOfBirth && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.dateOfBirth.message}</p>
                                    )}
                                    {formData.dateOfBirth && (
                                        <p className="mt-1.5 text-sm text-slate-600">
                                            Age: <span className="font-semibold">{calculateAge()}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Additional Details</h2>

                                {/* Gender */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <select
                                            {...register('gender', { required: 'Please select gender' })}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    {errors.gender && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.gender.message}</p>
                                    )}
                                </div>

                                {/* Relationship */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Relationship to Child
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <select
                                            {...register('relationshipType', { required: 'Please select relationship' })}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select relationship</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Father">Father</option>
                                            <option value="Guardian">Guardian</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {errors.relationshipType && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.relationshipType.message}</p>
                                    )}
                                </div>

                                {/* Medical History */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Medical History <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <textarea
                                            {...register('medicalHistory')}
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                            placeholder="Any relevant medical history, diagnoses, or conditions..."
                                        />
                                    </div>
                                </div>

                                {/* Current Concerns */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Current Concerns <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <textarea
                                            {...register('currentConcerns')}
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                            placeholder="What developmental areas are you concerned about?"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Review Information</h2>

                                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Child's Name</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {formData.firstName} {formData.lastName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {formData.dateOfBirth}
                                            {formData.dateOfBirth && (
                                                <span className="text-sm font-normal text-slate-600 ml-2">
                                                    ({calculateAge()})
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Gender</p>
                                        <p className="text-lg font-semibold text-slate-900 capitalize">
                                            {formData.gender || 'Not specified'}
                                        </p>
                                    </div>

                                    {formData.medicalHistory && (
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Medical History</p>
                                            <p className="text-slate-900">{formData.medicalHistory}</p>
                                        </div>
                                    )}

                                    {formData.currentConcerns && (
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Current Concerns</p>
                                            <p className="text-slate-900">{formData.currentConcerns}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm text-slate-700">
                                        By adding your child, you can access screening tools, track progress, and create
                                        personalized education plans.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        nextStep();
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    Next
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {
                                        console.log('Submit button clicked!');
                                        handleSubmit(onSubmit)();
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            Add Child
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Skip Link */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                        Skip and add later
                    </button>
                </div>
            </div>
        </div>
    );
}
