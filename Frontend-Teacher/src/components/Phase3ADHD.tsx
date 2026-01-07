import React, { useState } from 'react';

// Interfaces
interface Phase3ADHDProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface Question {
    id: number;
    textEn: string;
    textHi: string;
    category: 'Inattention' | 'Hyperactivity' | 'Impulsivity';
    explanation: string;
}

const adhdQuestions: Question[] = [
    {
        id: 1,
        textEn: "Does the child fail to give close attention to details or make careless mistakes in schoolwork?",
        textHi: "क्या बच्चा स्कूल के काम में बारीकियों पर ध्यान देने में विफल रहता है या लापरवाही से गलतियाँ करता है?",
        category: "Inattention",
        explanation: "Inattention to detail is a core symptom of ADHD."
    },
    {
        id: 2,
        textEn: "Does the child have difficulty sustaining attention in tasks or play activities?",
        textHi: "क्या बच्चे को कार्यों या खेल गतिविधियों में ध्यान बनाए रखने में कठिनाई होती है?",
        category: "Inattention",
        explanation: "Difficulty sustaining focus over time."
    },
    {
        id: 3,
        textEn: "Does the child fidget with hands or feet or squirm in seat?",
        textHi: "क्या बच्चा हाथों या पैरों से बेचैनी दिखाता है या अपनी सीट पर छटपटाता है?",
        category: "Hyperactivity",
        explanation: "Physical restlessness and fidgeting."
    },
    {
        id: 4,
        textEn: "Does the child often leave their seat in situations when remaining seated is expected?",
        textHi: "क्या बच्चा अक्सर उन स्थितियों में अपनी सीट छोड़ देता है जब बैठे रहने की उम्मीद की जाती है?",
        category: "Hyperactivity",
        explanation: "Inability to stay seated when required."
    },
    {
        id: 5,
        textEn: "Does the child blurts out answers before questions have been completed?",
        textHi: "क्या बच्चा सवाल पूरा होने से पहले ही जवाब दे देता है?",
        category: "Impulsivity",
        explanation: "Impulsive responding without waiting."
    }
];

const Phase3ADHD: React.FC<Phase3ADHDProps> = ({ studentId, onNavigate }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

    const currentQuestion = adhdQuestions[currentQuestionIndex];
    const totalQuestions = adhdQuestions.length;
    const progress = Math.round(((currentQuestionIndex) / totalQuestions) * 100);

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setSubmissionStatus('submitting');
            // Mock API
            setTimeout(() => {
                setSubmissionStatus('complete');
            }, 1000);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (submissionStatus === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white  flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce shadow-lg mb-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900  mb-2">ADHD Screening Done</h2>
                <p className="text-gray-500  mb-8 max-w-md">
                    Results have been recorded. Taking you back to the student profile.
                </p>
                <button
                    onClick={() => onNavigate('student-profile', { studentId })}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white  text-slate-900  font-display flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95  backdrop-blur-md border-b border-gray-200  px-4 lg:px-8 py-3 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate('student-profile', { studentId })} className="text-gray-500 hover:text-gray-900  transition">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-800 ">ADHD Assessment</h1>
                            <p className="text-xs text-gray-400 font-medium">Inattention & Hyperactivity</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200  hover:bg-gray-50  text-xs font-bold uppercase transition"
                        >
                            <span className="material-symbols-outlined text-[16px]">translate</span>
                            {language === 'en' ? 'Hindi' : 'English'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-4xl mx-auto p-4 lg:p-8 flex flex-col gap-6">

                {/* Progress Bar */}
                <div className="w-full bg-gray-100  rounded-full h-1.5 mb-2">
                    <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <span>{currentQuestion.category}</span>
                </div>

                {/* Question Card */}
                <div className="bg-white  rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10 relative overflow-hidden transition-all">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900  leading-tight mb-2">
                            {language === 'en' ? currentQuestion.textEn : currentQuestion.textHi}
                        </h2>
                        {language === 'hi' && <p className="text-lg text-gray-400 mb-6">{currentQuestion.textEn}</p>}

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((option) => (
                                <label
                                    key={option}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === option
                                        ? 'border-blue-500 bg-blue-50  text-blue-700  shadow-md transform scale-[1.02]'
                                        : 'border-gray-100  hover:border-blue-200 hover:bg-gray-50 '
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option}
                                        checked={answers[currentQuestion.id] === option}
                                        onChange={() => handleOptionSelect(option)}
                                        className="sr-only"
                                    />
                                    <div className={`size-5 rounded-full border-2 mr-3 flex items-center justify-center ${answers[currentQuestion.id] === option ? 'border-blue-500' : 'border-gray-300'
                                        }`}>
                                        {answers[currentQuestion.id] === option && <div className="size-2.5 rounded-full bg-blue-500"></div>}
                                    </div>
                                    <span className="font-semibold">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-auto pt-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        className="px-8 py-3 bg-blue-600 text-white  rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Finish Phase 3' : 'Next Question'}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>

            </main>
        </div>
    );
};

export default Phase3ADHD;
