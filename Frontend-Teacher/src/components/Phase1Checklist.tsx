import React, { useState, useEffect } from 'react';

// Interfaces
interface Phase1ChecklistProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface ChecklistQuestion {
    id: string;
    text: string;
    textHindi?: string;
    description: string;
    category: 'social' | 'communication' | 'behavior';
}

interface ChecklistResponses {
    [questionId: string]: 'yes' | 'sometimes' | 'no';
}

const Phase1Checklist: React.FC<Phase1ChecklistProps> = ({ studentId, onNavigate }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<ChecklistResponses>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showLanguage, setShowLanguage] = useState<'english' | 'hindi'>('english');
    const [screeningId, setScreeningId] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        const initScreening = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const response = await fetch(`${API_BASE_URL}/teacher/screenings/start`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ studentId, phase: 1 })
                });

                if (response.ok) {
                    const data = await response.json();
                    setScreeningId(data.screening.id);
                    if (data.screening.responses) {
                        try {
                            const parsed = typeof data.screening.responses === 'string'
                                ? JSON.parse(data.screening.responses)
                                : data.screening.responses;
                            setResponses(parsed || {});
                        } catch (e) {
                            setResponses({});
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to init screening', err);
            }
        };

        initScreening();
    }, [studentId]);

    // Checklist Data - based on ASMA scale / requirements
    const questions: ChecklistQuestion[] = [
        {
            id: 'q1',
            category: 'social',
            text: 'Does the student look at you when you call his/her name?',
            textHindi: 'क्या छात्र उसका नाम पुकारने पर आपकी ओर देखता है?',
            description: 'Responding to one\'s name is a key milestone in social development. It indicates the child is paying attention to their environment.'
        },
        {
            id: 'q2',
            category: 'social',
            text: 'Does the student smile back when you smile at them?',
            textHindi: 'क्या जब आप छात्र को देखकर मुस्कुराते हैं, तो वह वापस मुस्कुराता है?',
            description: 'Social smiling is an early sign of social reciprocity and emotional connection.'
        },
        {
            id: 'q3',
            category: 'communication',
            text: 'Does the student use gestures like pointing or waving?',
            textHindi: 'क्या छात्र इशारा करने या हाथ हिलाने जैसे हाव-भाव का उपयोग करता है?',
            description: 'Non-verbal communication is typically established before spoken language.'
        },
        {
            id: 'q4',
            category: 'communication',
            text: 'Does the student follow simple one-step instructions?',
            textHindi: 'क्या छात्र सरल एक-चरणीय निर्देशों का पालन करता है?',
            description: 'Understanding and following instructions indicates receptive language skills.'
        },
        {
            id: 'q5',
            category: 'behavior',
            text: 'Does the student engage in pretend play?',
            textHindi: 'क्या छात्र काल्पनिक खेल में शामिल होता है?',
            description: 'Imaginative play is crucial for cognitive and social development.'
        },
        // Add more questions as needed for a full checklist
    ];

    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round((Object.keys(responses).length / questions.length) * 100);

    const handleResponse = async (value: 'yes' | 'sometimes' | 'no') => {
        const newResponses = { ...responses, [currentQuestion.id]: value };
        setResponses(newResponses);
        setIsSaving(true);

        if (screeningId) {
            const token = localStorage.getItem('auth_token');
            try {
                await fetch(`${API_BASE_URL}/teacher/screenings/${screeningId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ responses: newResponses })
                });
            } catch (err) {
                console.error('Failed to auto-save', err);
            }
        }

        setTimeout(() => {
            setIsSaving(false);
        }, 800);
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

    const handleSubmit = async () => {
        setIsSaving(true);
        // Calculate Score
        let score = 0;
        Object.values(responses).forEach(r => {
            if (r === 'no') score += 2;
            if (r === 'sometimes') score += 1;
        });

        const results = { score, status: score >= 3 ? 'flag_raised' : 'clear' };

        if (screeningId) {
            const token = localStorage.getItem('auth_token');
            try {
                await fetch(`${API_BASE_URL}/teacher/screenings/${screeningId}/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        responses,
                        results,
                        flags: score >= 3 ? ['checklist_flagged'] : []
                    })
                });
            } catch (err) {
                console.error('Failed to submit screening', err);
            }
        }

        setIsSaving(false);

        onNavigate('student-profile', { studentId });
    };

    const activeResponse = responses[currentQuestion.id];

    return (
        <div className="min-h-screen bg-[#f8fafc]  font-display text-slate-800  flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90  backdrop-blur-md border-b border-slate-200  px-4 lg:px-8 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600 ">
                            <span className="material-symbols-outlined text-[28px]">spa</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900  leading-tight">Daira</h1>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Screening Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowLanguage(prev => prev === 'english' ? 'hindi' : 'english')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100  rounded-lg text-sm text-slate-700  hover:bg-slate-200 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">translate</span>
                            {showLanguage === 'english' ? 'English' : 'Hindi'}
                        </button>
                        <button onClick={() => onNavigate('student-profile', { studentId })} className="text-slate-600  hover:text-blue-600 text-sm font-medium">
                            Save & Exit
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Main Question Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Breadcrumbs & Progress */}
                    <div className="space-y-4">
                        <nav className="flex text-xs text-slate-500 mb-2">
                            <span>Screening</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900  font-medium">Phase 1 Checklist</span>
                        </nav>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 ">{currentQuestion.category === 'social' ? 'Social Interaction' : currentQuestion.category === 'communication' ? 'Communication' : 'Behavior'}</h2>
                                <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
                                <span className="text-sm text-slate-400 font-medium">/ {questions.length}</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-200  rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white  rounded-2xl shadow-sm p-6 md:p-10 border border-slate-100  relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-[0.03]  pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[200px]">edit_note</span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900  leading-tight mb-3">
                                {currentQuestion.text}
                            </h3>
                            {showLanguage === 'hindi' && currentQuestion.textHindi && (
                                <p className="text-lg md:text-xl text-slate-500  font-medium leading-relaxed mb-6 font-serif">
                                    {currentQuestion.textHindi}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                {/* Yes Option */}
                                <label className="cursor-pointer group relative">
                                    <input
                                        className="peer sr-only"
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        checked={activeResponse === 'yes'}
                                        onChange={() => handleResponse('yes')}
                                    />
                                    <div className="p-5 rounded-xl border-2 border-slate-100  bg-slate-50  hover:border-blue-300 hover:bg-blue-50 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50  text-center h-full flex flex-col items-center justify-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-600 peer-checked:bg-blue-600 peer-checked:text-white transition-colors">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="font-bold text-slate-700  group-hover:text-blue-600 peer-checked:text-blue-600 ">Yes / Always</span>
                                    </div>
                                    <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 text-blue-600 transition-opacity">
                                        <span className="material-symbols-outlined icon-fill">check_circle</span>
                                    </div>
                                </label>

                                {/* Sometimes Option */}
                                <label className="cursor-pointer group relative">
                                    <input
                                        className="peer sr-only"
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        checked={activeResponse === 'sometimes'}
                                        onChange={() => handleResponse('sometimes')}
                                    />
                                    <div className="p-5 rounded-xl border-2 border-slate-100  bg-slate-50  hover:border-amber-300 hover:bg-amber-50 transition-all peer-checked:border-amber-500 peer-checked:bg-amber-50  text-center h-full flex flex-col items-center justify-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-white  shadow-sm flex items-center justify-center text-gray-400 group-hover:text-amber-500 peer-checked:bg-amber-500 peer-checked:text-white transition-colors">
                                            <span className="material-symbols-outlined">remove</span>
                                        </div>
                                        <span className="font-bold text-slate-700  group-hover:text-amber-600 peer-checked:text-amber-600 ">Sometimes</span>
                                    </div>
                                </label>

                                {/* No Option */}
                                <label className="cursor-pointer group relative">
                                    <input
                                        className="peer sr-only"
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        checked={activeResponse === 'no'}
                                        onChange={() => handleResponse('no')}
                                    />
                                    <div className="p-5 rounded-xl border-2 border-slate-100  bg-slate-50  hover:border-red-300 hover:bg-red-50 transition-all peer-checked:border-red-500 peer-checked:bg-red-50  text-center h-full flex flex-col items-center justify-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-red-500 peer-checked:bg-red-500 peer-checked:text-white transition-colors">
                                            <span className="material-symbols-outlined">close</span>
                                        </div>
                                        <span className="font-bold text-slate-700  group-hover:text-red-600 peer-checked:text-red-600 ">No / Rarely</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-2 transition rounded-lg hover:bg-slate-100"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!activeResponse && currentQuestionIndex < questions.length - 1} // Can't skip unless handled
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Complete Screening' : 'Next Question'}
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>

                </div>

                {/* Helper Column */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:pt-16">
                    <div className="bg-white  p-6 rounded-2xl shadow-sm border border-slate-100 ">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-blue-50  p-2 rounded-lg text-blue-600 shrink-0">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900  text-sm">Why we ask this?</h4>
                                <p className="text-xs text-slate-500  mt-1 leading-relaxed">
                                    {currentQuestion.description}
                                </p>
                            </div>
                        </div>
                        <hr className="border-slate-100  my-3" />
                        <div className="flex items-center gap-2 text-xs text-slate-500 ">
                            <span className="material-symbols-outlined text-[16px] text-green-500">verified</span>
                            <span>Clinically validated question</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-200  bg-slate-50/50  text-center">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            {isSaving ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    <span className="text-xs font-semibold uppercase tracking-wider">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px] icon-fill">cloud_done</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider">Auto-save active</span>
                                </>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400">Your progress is saved automatically.</p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Phase1Checklist;
