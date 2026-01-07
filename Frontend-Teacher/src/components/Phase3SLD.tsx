import React, { useState } from 'react';

// Interfaces
interface Phase3SLDProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

type SectionType = 'reading' | 'writing';

interface Question {
    id: number;
    textEn: string;
    textHi: string;
    section: SectionType;
}

const sldQuestions: Record<SectionType, Question[]> = {
    reading: [
        {
            id: 101,
            textEn: "Has difficulty reading words that are not in their vocabulary?",
            textHi: "\u0915\u094d\u092f\u093e \u0909\u0928\u094d\u0939\u0947\u0902 \u091ec\u0938\u094b\u0902 \u0915\u094b \u092a\u0922\u093c\u0928\u0947 \u092e\u0947\u0902 \u0915\u0920\u093f\u0928\u093e\u0908 \u0939\u094b\u0924\u0940 \u0939\u0948 \u091c\u094b \u0909\u0928\u0915\u0947 \u0936\u092c\u094d\u0926\u0915\u094b\u0937 \u092e\u0947\u0902 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902?",
            section: 'reading'
        },
        {
            id: 102,
            textEn: "Confuses similar looking words (e.g., 'was' and 'saw')?",
            textHi: "\u0915\u094d\u092f\u093e \u0938\u092e\u093e\u0928 \u0926\u093f\u0916\u0928\u0947 \u0935\u093e\u0932\u0947 \u0936\u092c\u094d\u0926\u094b\u0902 \u092e\u0947\u0902 \u092d\u094d\u0930\u092e\u093f\u0924 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902 (\u091c\u0948\u0938\u0947 'was' \u0914\u0930 'saw')?",
            section: 'reading'
        },
        {
            id: 103,
            textEn: "Losses place while reading or skips lines?",
            textHi: "\u0915\u094d\u092f\u093e \u092a\u0922\u093c\u0924\u0947 \u0938\u092e\u092f \u091c\u0917\u0939 \u092d\u0942\u0932 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902 \u092f\u093e \u0932\u093e\u0907\u0928\u0947\u0902 \u091b\u094b\u0922\u093c \u0926\u0947\u0924\u0947 \u0939\u0948\u0902?",
            section: 'reading'
        }
    ],
    writing: [
        {
            id: 201,
            textEn: "Makes frequent spelling errors in simple words?",
            textHi: "\u0915\u094d\u092f\u093e \u0938\u0930\u0932 \u0936\u092c\u094d\u0926\u094b\u0902 \u092e\u0947\u0902 \u092c\u093e\u0930-\u092c\u093e\u0930 \u0935\u0930\u094d\u0924\u0928\u0940 (spelling) \u0915\u0940 \u0917\u0932\u0924\u093f\u092f\u093e\u0901 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902?",
            section: 'writing'
        },
        {
            id: 202,
            textEn: "Has poor handwriting compared to peers?",
            textHi: "\u0915\u094d\u092f\u093e \u0938\u093e\u0925\u093f\u092f\u094b\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u092e\u0947\u0902 \u0932\u093f\u0916\u093e\u0935\u091f \u0936\u0915\u093e\u0930\u093e\u092c \u0939\u0948?",
            section: 'writing'
        },
        {
            id: 203,
            textEn: "Struggles to organize thoughts on paper?",
            textHi: "\u0915\u094d\u092f\u093e \u0915\u093e\u0917\u091c \u092a\u0930 \u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u0915\u094b \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093f\u0924 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0938\u0902\u0918\u0930\u094d\u0937 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902?",
            section: 'writing'
        }
    ]
};

const Phase3SLD: React.FC<Phase3SLDProps> = ({ studentId, onNavigate }) => {
    const [currentSection, setCurrentSection] = useState<SectionType>('reading');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

    const currentQuestions = sldQuestions[currentSection];
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + (currentSection === 'writing' ? sldQuestions.reading.length : 0)) / (sldQuestions.reading.length + sldQuestions.writing.length)) * 100);

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // End of section
            if (currentSection === 'reading') {
                setCurrentSection('writing');
                setCurrentQuestionIndex(0);
                window.scrollTo(0, 0);
            } else {
                // End of all sections
                setSubmissionStatus('submitting');
                // Mock API
                setTimeout(() => {
                    setSubmissionStatus('complete');
                }, 1500);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else if (currentSection === 'writing') {
            setCurrentSection('reading');
            setCurrentQuestionIndex(sldQuestions.reading.length - 1);
        }
    };

    if (submissionStatus === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white  flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce shadow-lg mb-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900  mb-2">SLD Screening Completed</h2>
                <p className="text-gray-500  mb-8 max-w-md">
                    Both Reading and Writing assessments have been successfully recorded. Processing results...
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white  text-slate-900  font-display flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95  backdrop-blur-md border-b border-gray-200  px-4 lg:px-8 py-3 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate('dashboard')} className="text-gray-500 hover:text-gray-900  transition">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-800 ">SLD Screening</h1>
                            <p className="text-xs text-gray-400 font-medium">Specific Learning Disability Assessment</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200  hover:bg-gray-50  text-xs font-bold uppercase transition"
                    >
                        <span className="material-symbols-outlined text-[16px]">translate</span>
                        {language === 'en' ? 'Hindi' : 'English'}
                    </button>
                </div>
            </header>

            <main className="flex-grow w-full max-w-4xl mx-auto p-4 lg:p-8 flex flex-col gap-6">

                {/* Section Tabs */}
                <div className="flex w-full bg-white  rounded-xl p-1 shadow-sm border border-gray-200 ">
                    <div className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold text-center transition-all ${currentSection === 'reading'
                        ? 'bg-blue-50  text-blue-600  shadow-sm'
                        : 'text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                            Reading & Decoding
                        </div>
                    </div>
                    <div className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold text-center transition-all ${currentSection === 'writing'
                        ? 'bg-purple-50  text-purple-600  shadow-sm'
                        : 'text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">edit_note</span>
                            Writing & Spelling
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full bg-gray-100  rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentSection === 'reading' ? 'bg-blue-600' : 'bg-purple-600'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Question Card */}
                <div className={`bg-white  rounded-2xl shadow-lg border p-6 md:p-10 relative overflow-hidden transition-all duration-500 ${currentSection === 'reading'
                    ? 'shadow-blue-500/5 border-blue-100 '
                    : 'shadow-purple-500/5 border-purple-100 '
                    }`}>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <span>Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
                        <span className={currentSection === 'reading' ? 'text-blue-500' : 'text-purple-500'}>
                            {currentSection === 'reading' ? 'Reading Domain' : 'Writing Domain'}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900  leading-tight mb-2">
                        {language === 'en' ? currentQuestion.textEn : currentQuestion.textHi}
                    </h2>
                    {language === 'hi' && <p className="text-lg text-gray-400 mb-6">{currentQuestion.textEn}</p>}

                    <div className="mt-8 grid grid-cols-1 gap-3">
                        {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((option) => (
                            <label
                                key={option}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === option
                                    ? (currentSection === 'reading'
                                        ? 'border-blue-500 bg-blue-50  text-blue-700 '
                                        : 'border-purple-500 bg-purple-50  text-purple-700 ')
                                    : 'border-gray-100  hover:bg-gray-50 '
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
                                <div className={`size-5 rounded-full border-2 mr-3 flex items-center justify-center ${answers[currentQuestion.id] === option
                                    ? (currentSection === 'reading' ? 'border-blue-500' : 'border-purple-500')
                                    : 'border-gray-300'
                                    }`}>
                                    {answers[currentQuestion.id] === option && <div className={`size-2.5 rounded-full ${currentSection === 'reading' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>}
                                </div>
                                <span className="font-semibold">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-auto pt-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0 && currentSection === 'reading'}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        className={`px-8 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none ${currentSection === 'reading'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                    >
                        {currentSection === 'reading' && currentQuestionIndex === currentQuestions.length - 1 ? 'Next Section' : currentSection === 'writing' && currentQuestionIndex === currentQuestions.length - 1 ? 'Submit' : 'Next'}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>

            </main>
        </div>
    );
};

export default Phase3SLD;
