import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    ArrowLeft, Save, X, User, Calendar, Users as GenderIcon,
    FileText, Loader2, AlertCircle, Trash2, Camera
} from 'lucide-react';

import childrenService from '../services/children.service';
import type { Child, AddChildData } from '../services/children.service';

interface EditFormData extends AddChildData { }

export default function EditChild() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [child, setChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<EditFormData>();

    useEffect(() => {
        if (id) {
            loadChild(id);
        }
    }, [id]);

    const loadChild = async (childId: string) => {
        try {
            const response = await childrenService.getChild(childId);
            if (response.success) {
                setChild(response.data);
                // Pre-fill form with existing data - format date for input
                const formattedDate = response.data.dateOfBirth.split('T')[0];
                reset({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    dateOfBirth: formattedDate,
                    gender: response.data.gender,
                    medicalHistory: response.data.medicalHistory || '',
                    currentConcerns: response.data.currentConcerns || '',
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load child:', error);
            setError('Failed to load child information');
            setLoading(false);
        }
    };

    const onSubmit = async (data: EditFormData) => {
        if (!id) return;

        try {
            setSaving(true);
            setError('');

            await childrenService.updateChild(id, data);
            navigate(`/children/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to update child. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        try {
            setDeleting(true);
            await childrenService.deleteChild(id);
            navigate('/children');
        } catch (error) {
            console.error('Failed to delete child:', error);
            setError('Failed to delete child. Please try again.');
            setDeleting(false);
        }
    };

    const calculateAge = () => {
        if (child) {
            const age = childrenService.calculateAge(child.dateOfBirth);
            if (age.years === 0) {
                return `${age.months} months old`;
            }
            return `${age.years} years, ${age.months} months old`;
        }
        return '';
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading child information...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!child) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Child Not Found</h2>
                        <p className="text-slate-600 mb-6">The child you're trying to edit doesn't exist.</p>
                        <button
                            onClick={() => navigate('/children')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to Children List
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-[800px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/children/${id}`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Profile</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Edit Child Information
                            </h1>
                            <p className="text-slate-600">
                                Update information for <strong>{child.firstName} {child.lastName}</strong>
                                {' '}({calculateAge()})
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold transition-all"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Edit Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    First Name <span className="text-red-500">*</span>
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

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    Last Name <span className="text-red-500">*</span>
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
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                Date of Birth <span className="text-red-500">*</span>
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
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <GenderIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
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

                        {/* Medical History */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                Medical History <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <textarea
                                    {...register('medicalHistory')}
                                    rows={4}
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
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                    placeholder="What developmental areas are you concerned about?"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => navigate(`/children/${id}`)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>

                            <button
                                type="submit"
                                disabled={saving || !isDirty}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {!isDirty && (
                            <p className="text-sm text-slate-500 text-center -mt-3">
                                Make changes to enable the save button
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Enhanced Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Delete Child Profile</h3>
                                <p className="text-sm text-slate-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-900 font-semibold mb-2">
                                You are about to permanently delete:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1 ml-4">
                                <li>• <strong>{child.firstName} {child.lastName}</strong>'s profile</li>
                                <li>• All screening results and assessments</li>
                                <li>• All PEP plans and progress data</li>
                                <li>• All milestone tracking information</li>
                                <li>• All associated documents and notes</li>
                            </ul>
                        </div>

                        <p className="text-slate-700 mb-6 text-sm">
                            Are you absolutely sure you want to proceed with deleting this child's profile?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        <span>Delete Permanently</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
