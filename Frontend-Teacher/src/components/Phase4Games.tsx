import React, { useState } from 'react';

// Interfaces
interface Phase4GamesProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface GameTask {
    id: string;
    title: string;
    description: string;
    icon: string;
    colorClass: string;
    status: 'pending' | 'completed' | 'flagged';
}

const Phase4Games: React.FC<Phase4GamesProps> = ({ studentId, onNavigate }) => {
    const [tasks, setTasks] = useState<GameTask[]>([
        {
            id: 'english',
            title: 'English Literacy Game',
            description: 'Interactive word recognition and sentence building quest.',
            icon: 'menu_book',
            colorClass: 'bg-indigo-50 text-indigo-600',
            status: 'pending'
        },
        {
            id: 'maths',
            title: 'Mathematics Puzzle',
            description: 'Gamified numeracy assessment with pattern recognition.',
            icon: 'calculate',
            colorClass: 'bg-emerald-50 text-emerald-600',
            status: 'pending'
        },
        {
            id: 'regional',
            title: 'Regional Language Game',
            description: 'Native language fluency and comprehension challenge.',
            icon: 'translate',
            colorClass: 'bg-orange-50 text-orange-600',
            status: 'pending'
        }
    ]);

    const completedCount = tasks.filter(t => t.status !== 'pending').length;
    const totalTasks = tasks.length;
    const progress = Math.round((completedCount / totalTasks) * 100);

    const handleTaskAction = (task: GameTask) => {
        // Mock completion
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
    };

    const handleCompletePhase = () => {
        onNavigate('student-profile', { studentId });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-display flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate('student-profile', { studentId })} className="text-slate-500 hover:text-slate-900">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-bold">Phase 4: Game-based Assessment</h1>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col gap-8">
                <div>
                    <h2 className="text-2xl font-bold">Learning Games</h2>
                    <p className="text-slate-500">Engage the student with these interactive screening games.</p>
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined">sports_esports</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Overall Progress</p>
                            <p className="text-xs text-slate-500">{completedCount} of {totalTasks} games completed</p>
                        </div>
                    </div>
                    <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className={`size-12 rounded-lg flex items-center justify-center ${task.colorClass}`}>
                                    <span className="material-symbols-outlined text-2xl">{task.icon}</span>
                                </div>
                                {task.status === 'completed' && (
                                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">DONE</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                            </div>
                            <button
                                onClick={() => handleTaskAction(task)}
                                disabled={task.status === 'completed'}
                                className={`mt-auto w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${task.status === 'completed'
                                        ? 'bg-slate-50 text-slate-400 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">{task.status === 'completed' ? 'check_circle' : 'play_arrow'}</span>
                                {task.status === 'completed' ? 'Completed' : 'Launch Game'}
                            </button>
                        </div>
                    ))}
                </div>

                {completedCount === totalTasks && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleCompletePhase}
                            className="px-12 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1"
                        >
                            Submit Phase 4 Results
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Phase4Games;
