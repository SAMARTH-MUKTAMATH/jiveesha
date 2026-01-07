import React, { useState } from 'react';
import Navbar from './Navbar';

// Interfaces
interface Phase2MultiModalProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

interface ModalityTask {
    id: string;
    title: string;
    description: string;
    icon: string;
    colorClass: string; // e.g., 'bg-indigo-50 text-indigo-600'
    status: 'pending' | 'completed' | 'flagged';
    actionType: 'upload' | 'record' | 'checklist';
}

const Phase2MultiModal: React.FC<Phase2MultiModalProps> = ({ studentId, onNavigate }) => {
    const [student, setStudent] = useState<any>(null);
    const [teacher, setTeacher] = useState<any>(null);
    const [school, setSchool] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    React.useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudent(data.student);
                    setTeacher(data.teacher);
                    setSchool(data.school);

                    // Update task status from metadata
                    if (data.student.screening?.metadata) {
                        const metadata = typeof data.student.screening.metadata === 'string'
                            ? JSON.parse(data.student.screening.metadata)
                            : data.student.screening.metadata;

                        const phase2Progress = metadata.phaseProgress?.[2]?.subTasks || {};

                        setTasks(prev => prev.map(t => {
                            if (phase2Progress[t.id] === 'completed') {
                                return { ...t, status: 'completed' };
                            }
                            return t;
                        }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch student', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    const [tasks, setTasks] = useState<ModalityTask[]>([
        {
            id: 'handwriting',
            title: 'Handwriting Sample',
            description: 'Upload a clear photo of student\'s recent handwriting for motor analysis.',
            icon: 'draw',
            colorClass: 'bg-indigo-50 text-indigo-600',
            status: 'pending',
            actionType: 'upload'
        },
        {
            id: 'speech',
            title: 'Speech Recording',
            description: 'Record student reading a standard passage to analyze articulation.',
            icon: 'mic',
            colorClass: 'bg-orange-50 text-orange-600',
            status: 'pending',
            actionType: 'record'
        },
        {
            id: 'gaze',
            title: 'Gaze Tracking',
            description: 'Analyze visual focus and tracking patterns during on-screen tasks.',
            icon: 'visibility',
            colorClass: 'bg-emerald-50 text-emerald-600',
            status: 'pending',
            actionType: 'checklist'
        }
    ]);

    const completedCount = tasks.filter(t => t.status !== 'pending').length;
    const totalTasks = tasks.length;
    const progress = Math.round((completedCount / totalTasks) * 100);

    const handleTaskAction = (task: ModalityTask) => {
        if (task.id === 'speech') {
            onNavigate('phase2-speech', { studentId });
        } else if (task.id === 'handwriting') {
            onNavigate('phase2-handwriting', { studentId });
        } else if (task.id === 'gaze') {
            onNavigate('phase2-gaze', { studentId });
        }
    };

    const handleCompletePhase = async () => {
        setLoading(true);
        try {
            if (student?.screening?.id) {
                const token = localStorage.getItem('auth_token');

                // Get current metadata
                const response = await fetch(`${API_BASE_URL}/teacher/screenings/${student.screening.id}`, { // Assuming endpoint to get full screening details, or just use what we have
                    // Actually we should fetch fresh or trust current. Let's send update directly.
                });
                // Optimization: just send update.

                const currentMetadata = typeof student.screening.metadata === 'string'
                    ? JSON.parse(student.screening.metadata)
                    : (student.screening.metadata || {});

                const updatedMetadata = {
                    ...currentMetadata,
                    currentPhase: 3,
                    nextPhase: 3,
                    phaseProgress: {
                        ...(currentMetadata.phaseProgress || {}),
                        2: {
                            status: 'completed',
                            subTasks: currentMetadata.phaseProgress?.[2]?.subTasks || { handwriting: 'completed', speech: 'completed', gaze: 'completed' }
                        }
                    }
                };

                await fetch(`${API_BASE_URL}/teacher/screenings/${student.screening.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        metadata: updatedMetadata
                    })
                });
            }
        } catch (error) {
            console.error('Error completing phase:', error);
        } finally {
            setLoading(false);
            onNavigate('student-profile', { studentId });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/80 via-white to-white  text-slate-900  font-display flex flex-col">
            {/* Header */}
            {/* Header */}
            <Navbar
                teacherName={teacher?.name || 'Teacher'}
                teacherAssignment={teacher?.assignment || 'Assignment'}
                schoolName={school?.name || 'School'}
                onNavigate={onNavigate}
                activeView="screening-flow"
            />

            <main className="flex-grow w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col gap-8">

                {/* Phase Info */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50  text-purple-600  border border-purple-100  uppercase tracking-wider">
                                    Technical Screening
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900  tracking-tight">Phase 2: Multi-Modal Analysis</h2>
                            <p className="text-gray-500  mt-2 text-sm max-w-3xl flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                                Complete checks across these domains to rule out or identify sensory/motor issues.
                            </p>
                        </div>
                    </div>

                    {/* Student & Status Card */}
                    <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-5 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-100  flex items-center justify-center text-gray-600  font-bold border border-gray-200 ">
                                {student ? `${student.firstName?.[0]}${student.lastName?.[0]}` : '...'}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 ">
                                    {loading ? 'Loading...' : student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span>ID: <span className="font-mono text-gray-700 ">
                                        {student ? student.studentId : '...'}
                                    </span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 divide-x divide-gray-100 ">
                            <div className="px-4 text-center hidden sm:block">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Previous</p>
                                <p className="font-bold text-gray-700  flex items-center gap-1">
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                    Phase 1 Clear
                                </p>
                            </div>
                            <div className="pl-6">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Progress</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100  rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 ">{progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modality Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white  rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200  p-5 flex flex-col gap-4 group hover:border-blue-200  transition-colors">
                            <div className="flex justify-between items-start">
                                <div className={`size-10 rounded-lg flex items-center justify-center ${task.colorClass}`}>
                                    <span className="material-symbols-outlined">{task.icon}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${task.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' :
                                    task.status === 'flagged' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-gray-100 text-gray-500 border-gray-200   '
                                    }`}>
                                    {task.status === 'completed' ? 'Passed' : task.status === 'flagged' ? 'Flagged' : 'Pending'}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 ">{task.title}</h4>
                                <p className="text-xs text-gray-500  mt-1">{task.description}</p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50  flex flex-col gap-3">
                                {task.status === 'pending' ? (
                                    <button
                                        onClick={() => handleTaskAction(task)}
                                        className="w-full py-2 rounded-lg bg-blue-50  text-blue-600  hover:bg-blue-100  transition-all font-semibold text-sm flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {task.actionType === 'record' ? 'mic' : task.actionType === 'upload' ? 'upload_file' : 'checklist'}
                                        </span>
                                        {task.actionType === 'record' ? 'Start Recording' : task.actionType === 'upload' ? 'Upload Evidence' : 'Start Screening'}
                                    </button>
                                ) : (
                                    <button className="w-full py-2 rounded-lg bg-gray-50  text-gray-400 cursor-default font-medium text-sm flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">lock</span>
                                        Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Completion Action */}
                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-200  pt-6">
                    <div className="flex items-start gap-2 max-w-lg">
                        <span className="material-symbols-outlined text-gray-400 text-[20px] mt-0.5">info</span>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            <strong>Note:</strong> Flagged items in Phase 2 may automatically trigger a referral for specialist evaluation (Phase 3) or adjust the learning plan.
                        </p>
                    </div>
                    <button
                        onClick={handleCompletePhase}
                        disabled={completedCount < totalTasks}
                        className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Submit Phase 2 Results
                    </button>
                </div>

            </main>
        </div>
    );
};

export default Phase2MultiModal;
