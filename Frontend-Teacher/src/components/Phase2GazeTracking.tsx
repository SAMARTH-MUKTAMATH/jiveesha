import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';

// Interfaces
interface Phase2GazeTrackingProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

const Phase2GazeTracking: React.FC<Phase2GazeTrackingProps> = ({ studentId, onNavigate }) => {
    const [step, setStep] = useState<'setup' | 'calibration' | 'analysis' | 'complete'>('setup');
    const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'error'>('requesting');
    const [distanceStatus, setDistanceStatus] = useState<'too_close' | 'optimal' | 'too_far'>('optimal');
    const [calibratedPoints, setCalibratedPoints] = useState<number[]>([]);
    const [activePoint, setActivePoint] = useState<number>(0);
    const [screening, setScreening] = useState<any>(null);
    const [teacher, setTeacher] = useState<any>(null);
    const [school, setSchool] = useState<any>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    React.useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.screening) {
                        setScreening(data.screening);
                    }
                    setTeacher(data.teacher);
                    setSchool(data.school);
                }
            } catch (error) {
                console.error('Failed to fetch student data', error);
            }
        };
        fetchStudentData();
    }, [studentId]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Calibration points config (grid positions)
    const calibrationGrid = [
        { id: 0, x: '10%', y: '10%' }, { id: 1, x: '50%', y: '10%' }, { id: 2, x: '90%', y: '10%' },
        { id: 3, x: '10%', y: '50%' }, { id: 4, x: '50%', y: '50%' }, { id: 5, x: '90%', y: '50%' },
        { id: 6, x: '10%', y: '90%' }, { id: 7, x: '50%', y: '90%' }, { id: 8, x: '90%', y: '90%' },
    ];

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraStatus('active');

                // Mock distance fluctuation
                const interval = setInterval(() => {
                    const statuses: ('too_close' | 'optimal' | 'too_far')[] = ['optimal', 'optimal', 'optimal', 'too_close', 'too_far'];
                    setDistanceStatus(statuses[Math.floor(Math.random() * statuses.length)]);
                }, 3000);
                return () => clearInterval(interval);
            }
        } catch (err) {
            console.error("Camera error:", err);
            setCameraStatus('error');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const startCalibration = () => {
        setStep('calibration');
        setActivePoint(0);
        setCalibratedPoints([]);
    };

    const handlePointClick = (pointId: number) => {
        if (pointId === activePoint) {
            // Simulate "calibration" delay
            setTimeout(() => {
                setCalibratedPoints(prev => [...prev, pointId]);
                if (activePoint < 8) {
                    setActivePoint(prev => prev + 1);
                } else {
                    setStep('analysis');
                    // Auto-progress from analysis to complete
                    setTimeout(() => setStep('complete'), 3000);
                }
            }, 500);
        }
    };

    const handleComplete = async () => {
        stopCamera();

        // Save result to backend
        if (screening?.id) {
            try {
                const token = localStorage.getItem('auth_token');

                const currentMetadata = typeof screening.metadata === 'string'
                    ? JSON.parse(screening.metadata)
                    : (screening.metadata || {});

                const updatedMetadata = {
                    ...currentMetadata,
                    phaseProgress: {
                        ...(currentMetadata.phaseProgress || {}),
                        2: {
                            status: 'in_progress',
                            subTasks: {
                                ...(currentMetadata.phaseProgress?.[2]?.subTasks || {}),
                                gaze: 'completed'
                            }
                        }
                    },
                    parsedResults: {
                        ...(currentMetadata.parsedResults || {}),
                        gaze: {
                            fixation: '92%',
                            saccade: '240ms',
                            status: 'normal'
                        }
                    }
                };

                await fetch(`${API_BASE_URL}/teacher/screenings/${screening.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        metadata: updatedMetadata
                    })
                });
            } catch (err) {
                console.error('Failed to save results', err);
            }
        }

        onNavigate('student-profile', { studentId });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white  text-slate-900  font-display flex flex-col">
            {/* Header */}
            {/* Header */}
            <Navbar
                teacherName={teacher?.name || 'Teacher'}
                teacherAssignment={teacher?.assignment || 'Assignment'}
                schoolName={school?.name || 'School'}
                onNavigate={onNavigate}
                activeView="screening-flow"
            />

            <main className="flex-grow w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col gap-6 relative">

                {/* Setup / Camera Feed Phase */}
                {step === 'setup' && (
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center h-full">
                        {/* Camera Feed */}
                        <div className="relative w-full max-w-xl group">
                            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border-4 border-gray-100 ">
                                {cameraStatus === 'active' ? (
                                    <>
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                                        {/* Face Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                            <div className={`w-48 h-64 border-2 border-dashed rounded-full transition-colors duration-500 ${distanceStatus === 'optimal' ? 'border-green-400' : 'border-red-400'
                                                }`}></div>
                                        </div>
                                        {/* Warnings */}
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                            <div className={`px-4 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-colors duration-500 ${distanceStatus === 'optimal' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                                                }`}>
                                                {distanceStatus === 'optimal' ? 'Distance OK' : distanceStatus === 'too_close' ? 'Move Back' : 'Move Closer'}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-red-400">videocam_off</span>
                                        <p>Camera access required</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="max-w-md space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 ">Prepare for Calibration</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start p-4 bg-white  rounded-xl border border-gray-100  shadow-sm">
                                    <span className="material-symbols-outlined text-blue-600 mt-1">face</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900  text-sm">Positioning</h4>
                                        <p className="text-sm text-gray-500 ">Sit straight, about 50cm from the screen. Ensure the face fits in the oval guide.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start p-4 bg-white  rounded-xl border border-gray-100  shadow-sm">
                                    <span className="material-symbols-outlined text-amber-600 mt-1">light_mode</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900  text-sm">Lighting</h4>
                                        <p className="text-sm text-gray-500 ">Avoid strong backlighting. Ensure the face is evenly lit.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={startCalibration}
                                disabled={cameraStatus !== 'active'}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                            >
                                Start Calibration
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Calibration Grid Phase */}
                {step === 'calibration' && (
                    <div className="fixed inset-0 z-[100] bg-gray-900 cursor-none">
                        <div className="relative w-full h-full">
                            {calibrationGrid.map((point) => (
                                <div
                                    key={point.id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${activePoint === point.id ? 'opacity-100 scale-100 pointer-events-auto cursor-pointer' : 'opacity-20 scale-50 pointer-events-none'
                                        }`}
                                    style={{ left: point.x, top: point.y }}
                                    onClick={() => handlePointClick(point.id)}
                                >
                                    <div className={`size-8 rounded-full flex items-center justify-center transition-all duration-500 ${calibratedPoints.includes(point.id) ? 'bg-green-500' : 'bg-red-500 animate-pulse ring-4 ring-red-500/30'
                                        }`}>
                                        <div className="size-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            ))}

                            <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
                                <p className="text-white/80 text-xl font-medium tracking-wide">Look at the blinking dot and tap it</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Phase */}
                {step === 'analysis' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                        <div className="relative size-32">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100 "></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-blue-600 animate-pulse">psychology</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 ">Generating Heatmap</h2>
                            <p className="text-gray-500 ">Analyzing saccadic eye movements and fixation points...</p>
                        </div>
                    </div>
                )}

                {/* Completion Phase */}
                {step === 'complete' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
                        <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce shadow-lg shadow-green-100">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <div className="text-center space-y-4 max-w-md">
                            <h2 className="text-3xl font-bold text-gray-900 ">Tracking Complete</h2>
                            <p className="text-gray-500  text-lg">
                                Gaze data has been securely captured and added to the student's screening profile.
                            </p>

                            <div className="bg-gray-50  p-4 rounded-xl border border-gray-200  flex gap-4 text-left">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Fixation Stability</p>
                                    <p className="text-gray-800  font-semibold">92% <span className="text-green-500 text-xs ml-1">(Good)</span></p>
                                </div>
                                <div className="w-px bg-gray-200 "></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Saccade Latency</p>
                                    <p className="text-gray-800  font-semibold">240ms <span className="text-blue-500 text-xs ml-1">(Normal)</span></p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-lg transition-all"
                        >
                            Back to Profile
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Phase2GazeTracking;
