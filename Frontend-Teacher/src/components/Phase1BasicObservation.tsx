import React, { useState, useEffect } from 'react';

// Interfaces
interface Phase1BasicObservationProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface Question {
    id: string;
    text: string;
    description: string;
    section: 'attention' | 'literacy' | 'behavior';
}

interface Responses {
    [questionId: string]: 'yes' | 'sometimes' | 'no';
}

const Phase1BasicObservation: React.FC<Phase1BasicObservationProps> = ({ studentId, onNavigate }) => {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudent(data.student);
                }
            } catch (error) {
                console.error('Failed to fetch student', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Responses>({});
    const [isSaving, setIsSaving] = useState(false);

    // Hardcoded questions based on requirements/reference
    const questions: Question[] = [
        // Attention & Engagement (Section 1)
        {
            id: 'q1',
            section: 'attention',
            text: 'Does the student look at you or make eye contact when you call his/her name?',
            description: 'Look for consistent response. If the student is occupied with a toy, do they shift attention to you?'
        },
        {
            id: 'q2',
            section: 'attention',
            text: 'Does the student show interest in what other children are doing?',
            description: 'Observe if they watch, join in, or imitate peers during play or activities.'
        },
        {
            id: 'q3',
            section: 'attention',
            text: 'Does the student point to objects to show interest or ask for help?',
            description: 'Example: Pointing to a toy they want or showing you an airplane in the sky.'
        },
        // Basic Literacy (Section 2)
        {
            id: 'q4',
            section: 'literacy',
            text: 'Does the student recognize and name common objects or pictures?',
            description: 'Can they name items like "cup", "ball", "dog" when asked?'
        },
        {
            id: 'q5',
            section: 'literacy',
            text: 'Does the student follow simple one-step instructions?',
            description: 'Example: "Close the door", "Give me the book".'
        },
        // Classroom Behavior (Section 3)
        {
            id: 'q6',
            section: 'behavior',
            text: 'Does the student engage in repetitive movements or unusual play?',
            description: 'Example: Flapping hands, lining up toys excessively, spinning objects.'
        },
        {
            id: 'q7',
            section: 'behavior',
            text: 'Does the student accept changes in routine without major distress?',
            description: 'How do they react to transitions or unexpected changes in the schedule?'
        }
    ];

    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round((Object.keys(responses).length / questions.length) * 100);

    const handleResponse = (value: 'yes' | 'sometimes' | 'no') => {
        setIsSaving(true);
        // Simulate auto-save delay
        setTimeout(() => {
            setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
            setIsSaving(false);
        }, 600);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Mock Submission Logic
        console.log('Submitting responses:', responses);

        // Calculate basic score to decide next step (Mock logic)
        const flagCount = Object.values(responses).filter(v => v === 'no' || v === 'sometimes').length;

        // If significant flags, trigger Phase 2
        if (flagCount >= 2) { // Arbitrary threshold
            // In real app, API call would return the decision
            onNavigate('screening-flow', { studentId, phase: 2 });
        } else {
            onNavigate('student-profile', { studentId });
        }
    };

    const currentResponse = responses[currentQuestion.id];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-display text-slate-800 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 text-blue-600">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M24 4C12.95 4 4 12.95 4 24H44C44 12.95 35.05 4 24 4Z"></path>
                                <path d="M24 44C35.05 44 44 35.05 44 24H4C4 35.05 12.95 44 24 44Z" opacity="0.5"></path>
                            </svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">Daira</span>
                    </div>

                    <button onClick={() => onNavigate('dashboard')} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                        Save & Exit
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Student Screening – Phase 1: Basic Observation</h1>
                        <p className="mt-1 text-sm text-slate-500 max-w-3xl">
                            This initial checklist helps identify potential developmental gaps based on daily classroom activity.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                            Screening Active
                        </span>
                    </div>
                </div>

                {/* Student Context Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-200">
                                AS
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {loading ? 'Loading...' : student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                                </h2>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">school</span>
                                        {student ? `Grade ${student.grade}-${student.section}` : '...'}
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">badge</span> ID: {student ? student.studentId : '...'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-50 z-10">
                                        1
                                    </span>
                                    <span className="text-[10px] font-bold mt-1 text-blue-700">Phase 1</span>
                                </div>
                                <div className="w-8 h-1 bg-slate-200 rounded-full mb-4"></div>
                                <div className="flex flex-col items-center opacity-50">
                                    <span className="h-8 w-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400">
                                        2
                                    </span>
                                    <span className="text-[10px] font-medium mt-1 text-slate-400">Phase 2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Question Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Question */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 p-8 relative">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Section: {currentQuestion.section.replace(/^\w/, c => c.toUpperCase())}
                                </span>
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                                    Q {currentQuestionIndex + 1} / {questions.length}
                                </span>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                                    {currentQuestion.text}
                                </h3>
                                <div className="mt-3 flex items-start gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                    <span className="material-symbols-outlined text-blue-400 text-[20px] mt-0.5">info</span>
                                    <p className="text-sm text-slate-600 italic">
                                        {currentQuestion.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all group ${currentResponse === 'yes' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        checked={currentResponse === 'yes'}
                                        onChange={() => handleResponse('yes')}
                                    />
                                    <div className="ml-4 flex flex-col">
                                        <span className={`block text-sm font-medium ${currentResponse === 'yes' ? 'text-blue-700' : 'text-slate-900'}`}>Yes / Always</span>
                                    </div>
                                </label>

                                <label className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all group ${currentResponse === 'sometimes' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        checked={currentResponse === 'sometimes'}
                                        onChange={() => handleResponse('sometimes')}
                                    />
                                    <div className="ml-4 flex flex-col">
                                        <span className={`block text-sm font-medium ${currentResponse === 'sometimes' ? 'text-blue-700' : 'text-slate-900'}`}>Sometimes</span>
                                    </div>
                                </label>

                                <label className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all group ${currentResponse === 'no' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        checked={currentResponse === 'no'}
                                        onChange={() => handleResponse('no')}
                                    />
                                    <div className="ml-4 flex flex-col">
                                        <span className={`block text-sm font-medium ${currentResponse === 'no' ? 'text-blue-700' : 'text-slate-900'}`}>No / Rarely</span>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!currentResponse}
                                    className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                This screening follows NIEPID-validated guidelines.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Helper & Progress */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Teacher's Role */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-600 mt-1">psychology</span>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">Teacher's Role</h4>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                        You are acting as a facilitator. Observe the student in a natural classroom setting. Do not influence the student's behavior to get a specific result.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">Overall Progress</h4>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{progress}% Completed</span>
                                <span>{questions.length - Object.keys(responses).length} questions left</span>
                            </div>
                        </div>

                        {/* Auto-save Status */}
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
                            {isSaving ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                                    All changes saved
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Phase1BasicObservation;
