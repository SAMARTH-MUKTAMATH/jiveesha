import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, Activity, Clock, Users, Baby, PlayCircle,
    CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';

import screeningService from '../services/screening.service';
import childrenService from '../services/children.service';
import type { ScreeningType } from '../services/screening.service';
import type { Child } from '../services/children.service';

export default function ScreeningSelect() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedChildId = searchParams.get('childId');

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [screeningTypes, setScreeningTypes] = useState<ScreeningType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [childrenRes, typesRes] = await Promise.all([
                childrenService.getChildren(),
                screeningService.getScreeningTypes(),
            ]);

            if (childrenRes.success) {
                setChildren(childrenRes.data);
                if (preSelectedChildId) {
                    const child = childrenRes.data.find(c => c.id === preSelectedChildId);
                    if (child) setSelectedChild(child);
                } else if (childrenRes.data.length === 1) {
                    setSelectedChild(childrenRes.data[0]);
                }
            }

            if (typesRes.success) {
                setScreeningTypes(typesRes.data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to load data:', error);
            setLoading(false);
        }
    };

    const handleStartScreening = async (screeningTypeId: string) => {
        if (!selectedChild) {
            alert('Please select a child first');
            return;
        }

        try {
            const response = await screeningService.startScreening({
                childId: selectedChild.id,
                screeningTypeId,
            });

            if (response.success) {
                navigate(`/screening/${response.data.id}/start`);
            }
        } catch (error) {
            console.error('Failed to start screening:', error);
            alert('Failed to start screening. Please try again.');
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        const age = childrenService.calculateAge(dateOfBirth);
        if (age.years === 0) {
            return `${age.months} months`;
        }
        return `${age.years} years`;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'developmental':
                return Baby;
            case 'behavioral':
                return Activity;
            case 'social':
                return Users;
            default:
                return Activity;
        }
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading screenings...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                        Developmental Screening
                    </p>
                    <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                        Start a New Screening
                    </h1>
                    <p className="text-slate-600 text-base">
                        Choose a screening tool to track your child's developmental progress
                    </p>
                </div>

                {/* Child Selection */}
                {children.length > 1 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Select Child</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {children.map((child) => (
                                <button
                                    key={child.id}
                                    onClick={() => setSelectedChild(child)}
                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedChild?.id === child.id
                                        ? 'border-[#2563EB] bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                                        {getInitials(child.firstName, child.lastName)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900">{child.firstName} {child.lastName}</p>
                                        <p className="text-sm text-slate-600">{calculateAge(child.dateOfBirth)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {children.length === 1 && selectedChild && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                        <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                            {getInitials(selectedChild.firstName, selectedChild.lastName)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">
                                Screening for: {selectedChild.firstName} {selectedChild.lastName}
                            </p>
                            <p className="text-sm text-slate-600">
                                Age: {calculateAge(selectedChild.dateOfBirth)}
                            </p>
                        </div>
                    </div>
                )}

                {/* No Children State */}
                {children.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                        <AlertCircle className="mx-auto text-amber-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Children Added</h3>
                        <p className="text-slate-700 mb-4">
                            You need to add a child before starting a screening.
                        </p>
                        <button
                            onClick={() => navigate('/onboarding/add-child')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Add Child
                        </button>
                    </div>
                )}

                {/* Screening Types Grid */}
                {children.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {screeningTypes.map((type) => {
                            const Icon = getCategoryIcon(type.category);

                            return (
                                <div
                                    key={type.id}
                                    className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 relative">
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-xs font-bold text-slate-700 capitalize">
                                                {type.category}
                                            </span>
                                        </div>
                                        <Icon className="text-[#2563EB] mb-3" size={32} />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{type.name}</h3>
                                        <p className="text-sm text-slate-700 line-clamp-2">{type.description}</p>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users size={16} className="text-[#2563EB]" />
                                            <span className="font-medium">Age Range: {type.ageRange}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock size={16} className="text-[#2563EB]" />
                                            <span className="font-medium">Duration: {type.duration}</span>
                                        </div>

                                        <button
                                            onClick={() => handleStartScreening(type.id)}
                                            disabled={!selectedChild}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <PlayCircle size={18} />
                                            <span>Start Screening</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Placeholder for when no screening types */}
                {screeningTypes.length === 0 && children.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <Activity className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No Screening Types Available
                        </h3>
                        <p className="text-slate-600">
                            Screening tools will appear here once configured by your administrator.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
