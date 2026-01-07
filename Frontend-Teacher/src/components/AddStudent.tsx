import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface AddStudentProps {
    onNavigate: (view: string, data?: any) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teacherData, setTeacherData] = useState<any>(null);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
                const response = await fetch(`${API_BASE_URL}/teacher/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTeacherData(data.teacher);
                    setTeacherProfile(data.teacher); // Set teacherProfile
                    // Update formData based on fetched teacherProfile
                    setFormData(prev => ({
                        ...prev,
                        grade: data.teacher?.assignment?.split(' ')[1] || prev.grade,
                        section: data.teacher?.assignment?.split(' ')[3] || prev.section
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch teacher profile', err);
            }
        };
        fetchTeacherProfile();
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentId: '', // Roll number
        dateOfBirth: '',
        gender: 'other',
        grade: teacherProfile?.assignment?.split(' ')[1] || '3', // Default or fetch from teacher assignment
        section: teacherProfile?.assignment?.split(' ')[3] || '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        address: '', // New field
        languagePreference: 'en', // New field
        medicalHistory: '',
        currentConcerns: '',
        developmentalNotes: ''
    });

    const steps = [
        { label: 'Basic Info', icon: 'person' },
        { label: 'Details', icon: 'description' },
        { label: 'Guardian Info', icon: 'family_restroom' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('auth_token');
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

            const response = await fetch(`${API_BASE_URL}/teacher/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add student');
            }

            // Success!
            onNavigate('my-students');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {teacherData && (
                <Navbar
                    teacherName={`${teacherData.firstName} ${teacherData.lastName}`}
                    teacherAssignment={teacherData.assignment}
                    schoolName={teacherData.school.name}
                    onNavigate={onNavigate}
                    activeView="my-students"
                />
            )}

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Stepper */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                    <div className="flex justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
                        <div className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-300 -z-0" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                        {steps.map((step, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`size-10 rounded-full flex items-center justify-center border-2 transition-all ${index <= currentStep ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${index <= currentStep ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    {error && (
                        <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8">
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <section>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-blue-600"></span>
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">First Name</label>
                                            <input
                                                type="text" name="firstName" required
                                                value={formData.firstName} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. Liam"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Last Name</label>
                                            <input
                                                type="text" name="lastName" required
                                                value={formData.lastName} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. Johnson"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
                                        <input
                                            type="date" name="dateOfBirth" required
                                            value={formData.dateOfBirth} onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                                        <select
                                            name="gender" value={formData.gender} onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <section>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-blue-600"></span>
                                        School & Medical Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Student ID / Roll No</label>
                                            <input
                                                type="text" name="studentId" required
                                                value={formData.studentId} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. ST-2024-001"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Grade</label>
                                            <input
                                                type="text" name="grade" required
                                                value={formData.grade} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. 3"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Section</label>
                                            <input
                                                type="text" name="section"
                                                value={formData.section} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. B"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Medical History</label>
                                            <textarea
                                                name="medicalHistory" rows={2}
                                                value={formData.medicalHistory} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                                                placeholder="Any known diagnoses or chronic conditions..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Concerns</label>
                                            <textarea
                                                name="currentConcerns" rows={2}
                                                value={formData.currentConcerns} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                                                placeholder="Primary behaviors or learning difficulties noticed..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <section>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-blue-600"></span>
                                        Emergency Contact / Guardian
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Guardian Full Name</label>
                                            <input
                                                type="text" name="guardianName" required
                                                value={formData.guardianName} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                placeholder="e.g. Sarah Johnson"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                                                <input
                                                    type="tel" name="guardianPhone" required
                                                    value={formData.guardianPhone} onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                    placeholder="e.g. +91 9876543210"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address (Optional)</label>
                                                <input
                                                    type="email" name="guardianEmail"
                                                    value={formData.guardianEmail} onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                                    placeholder="e.g. sarah.j@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Developmental Notes</label>
                                            <textarea
                                                name="developmentalNotes" rows={3}
                                                value={formData.developmentalNotes} onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                                                placeholder="Additional observations from parents or previous teachers..."
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                    <span className="material-symbols-outlined text-amber-600">info</span>
                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                        Adding this student will create their digital profile. Screening can begin only after parental consent is confirmed in the student list.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={currentStep === 0 ? () => onNavigate('my-students') : prevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                {currentStep === 0 ? 'Cancel' : 'Back'}
                            </button>

                            {currentStep === steps.length - 1 ? (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                    )}
                                    Confirm & Add Student
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                                >
                                    Continue
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddStudent;
