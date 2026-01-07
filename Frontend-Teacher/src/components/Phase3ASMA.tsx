import React, { useState } from 'react';

// Interfaces
interface Phase3ASMAProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface Question {
    id: number;
    textEn: string;
    textHi: string;
    category: 'Social' | 'Communication' | 'Behavior';
    explanation: string;
}

const asmaQuestions: Question[] = [
    {
        id: 1,
        textEn: "Does the child make eye contact when you speak to them?",
        textHi: "क्या बच्चा बात करते समय आपसे आँखें मिलाता है?",
        category: "Social",
        explanation: "Eye contact is a key indicator of social engagement and attention."
    },
    {
        id: 2,
        textEn: "Does the child respond to their name when called?",
        textHi: "क्या बच्चा नाम पुकारे जाने पर प्रतिक्रिया देता है?",
        category: "Social",
        explanation: "A lack of response to name by 12 months can be an early red flag."
    },
    {
        id: 3,
        textEn: "Does the child point to objects to show interest?",
        textHi: "क्या बच्चा रुचि दिखाने के लिए वस्तुओं की ओर इशारा करता है?",
        category: "Communication",
        explanation: "Joint attention (pointing to share interest) is crucial for social development."
    },
    {
        id: 4,
        textEn: "Does the child engage in pretend play?",
        textHi: "क्या बच्चा बनावटी खेल (pretend play) में शामिल होता है?",
        category: "Social",
        explanation: "Imaginative play demonstrates symbolic thinking and social understanding."
    },
    {
        id: 5,
        textEn: "Does the child flap hands or rock body repeatedly?",
        textHi: "क्या बच्चा बार-बार हाथ हिलाता है या शरीर को झुलाता है?",
        category: "Behavior",
        explanation: "Repetitive motor mannerisms are common in autism spectrum disorders."
    },
    // ... In a real app, all 18 questions would be listed. subset for demo.
    {
        id: 6,
        textEn: "Does the child get upset by minor changes in routine?",
        textHi: "क्या बच्चा दिनचर्या में मामूली बदलाव से परेशान हो जाता है?",
        category: "Behavior",
        explanation: "Rigidity and need for sameness are core diagnostic features."
    },
    {
        id: 7,
        textEn: "Does the child repeat words or phrases immediately (echolalia)?",
        textHi: "क्या बच्चा शब्दों या वाक्यांशों को तुरंत दोहराता है?",
        category: "Communication",
        explanation: "Echolalia can indicate different processing of language."
    },
    {
        id: 8,
        textEn: "Does the child smile back when you smile at them?",
        textHi: "जब आप मुस्कुराते हैं तो क्या बच्चा वापस मुस्कुराता है?",
        category: "Social",
        explanation: "Social smiling is a fundamental reciprocal interaction."
    }
];

const Phase3ASMA: React.FC<Phase3ASMAProps> = ({ studentId, onNavigate }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

    const currentQuestion = asmaQuestions[currentQuestionIndex];
    const totalQuestions = asmaQuestions.length; // Using subset length for demo
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
            }, 1500);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const toggleAudio = () => {
        setIsAudioPlaying(!isAudioPlaying);
        // In real app, would trigger TTS
    };

    if (submissionStatus === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white  flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce shadow-lg mb-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900  mb-2">Screening Completed</h2>
                <p className="text-gray-500  mb-8 max-w-md">
                    Thank you. The ASMA screening data has been securely recorded. The system will now analyze the results.
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
                        <button onClick={() => onNavigate('dashboard')} className="text-gray-500 hover:text-gray-900  transition">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-800 ">ASMA Screening</h1>
                            <p className="text-xs text-gray-400 font-medium">Autism Spectrum Screening</p>
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
                        <button
                            onClick={toggleAudio}
                            className={`flex items-center justify-center size-8 rounded-full border transition ${isAudioPlaying
                                ? 'bg-blue-100 text-blue-600 border-blue-200 animate-pulse'
                                : 'bg-white text-gray-400 border-gray-200 hover:text-blue-500'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">volume_up</span>
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
                <div className="bg-white  rounded-2xl shadow-lg shadow-blue-500/5 border border-white/50  p-6 md:p-10 relative overflow-hidden transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-9xl text-blue-600">psychology</span>
                    </div>

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

                {/* Context Card */}
                <div className="bg-blue-50/50  rounded-xl p-5 border border-blue-100  flex gap-4 items-start">
                    <span className="material-symbols-outlined text-blue-500 mt-0.5">lightbulb</span>
                    <div>
                        <h4 className="font-bold text-blue-900  text-sm mb-1">Why ask this?</h4>
                        <p className="text-sm text-blue-800  leading-relaxed">
                            {currentQuestion.explanation}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-auto pt-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        className="px-8 py-3 bg-gray-900  text-white  rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all flex items-center gap-2"
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Next Question'}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>

            </main>
        </div>
    );
};

export default Phase3ASMA;
