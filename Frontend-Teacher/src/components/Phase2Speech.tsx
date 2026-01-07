import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';

// Interfaces
interface Phase2SpeechProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

const Phase2Speech: React.FC<Phase2SpeechProps> = ({ studentId, onNavigate }) => {
    const [recordingState, setRecordingState] = useState<'idle' | 'detecting_noise' | 'recording' | 'paused' | 'review' | 'uploading' | 'completed'>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [noiseLevel, setNoiseLevel] = useState('low'); // low, med, high
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
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

    const timerRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startNoiseDetection = async () => {
        setRecordingState('detecting_noise');
        // Mock noise detection delay
        setTimeout(() => {
            setRecordingState('idle'); // In real app, would allow start if noise is low
        }, 1500);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setRecordingState('recording');

            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or error occurred.");
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.pause();
            setRecordingState('paused');
            if (timerRef.current) clearInterval(timerRef.current);
        } else if (mediaRecorderRef.current && recordingState === 'paused') {
            mediaRecorderRef.current.resume();
            setRecordingState('recording');
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop stream
            setRecordingState('review');
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setRecordingState('idle');
    };

    const handleSubmit = () => {
        setRecordingState('uploading');
        // Mock API call then save to backend
        setTimeout(async () => {

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
                                    speech: 'completed'
                                }
                            }
                        },
                        parsedResults: {
                            ...(currentMetadata.parsedResults || {}),
                            speech: {
                                score: 'Phonological difficulty noted',
                                clarity: 'Moderate',
                                duration: '45s',
                                status: 'flagged'
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

            setRecordingState('completed');
            setTimeout(() => {
                onNavigate('student-profile', { studentId });
            }, 1000);
        }, 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white  text-slate-900  font-display flex flex-col">
            {/* Header */}
            {/* Header */}
            <Navbar
                teacherName={teacher?.name || 'Teacher'}
                teacherAssignment={teacher?.assignment || 'Assignment'}
                schoolName={school?.name || 'School'}
                onNavigate={onNavigate}
                activeView="screening-flow"
            />

            <main className="flex-grow w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col gap-6">

                <div className="flex flex-col md:flex-row gap-6 h-full">

                    {/* Left: Reading Material */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-6 flex-grow">
                            <h3 className="text-lg font-bold text-gray-900  mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">menu_book</span>
                                Rainbow Passage
                            </h3>
                            <div className="prose  max-w-none text-gray-700  leading-loose text-lg font-medium font-serif">
                                <p>
                                    "When the sunlight strikes raindrops in the air, they act like a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="w-full md:w-96 flex flex-col gap-4">

                        {/* Instruction Card */}
                        <div className="bg-blue-50  p-4 rounded-xl border border-blue-100 ">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-blue-600 ">info</span>
                                <div>
                                    <h4 className="font-bold text-blue-900  text-sm">Instructions</h4>
                                    <p className="text-xs text-blue-800  mt-1">
                                        Ensure a quiet environment. Ask the student to read the passage naturally.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recorder Card */}
                        <div className="bg-white  rounded-xl shadow-card border border-gray-200  p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">

                            {/* Visualizer / Status */}
                            <div className="w-full h-32 bg-gray-50  rounded-lg flex items-center justify-center relative overflow-hidden">
                                {recordingState === 'detecting_noise' && (
                                    <div className="flex flex-col items-center text-gray-500 animate-pulse">
                                        <span className="material-symbols-outlined">graphic_eq</span>
                                        <span className="text-xs font-semibold mt-2">Checking ambient noise...</span>
                                    </div>
                                )}

                                {recordingState === 'recording' && (
                                    <div className="flex items-center gap-1 h-12">
                                        {[...Array(10)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 bg-red-500 rounded-full animate-pulse"
                                                style={{
                                                    height: `${Math.random() * 100}%`,
                                                    animationDuration: `${0.2 + Math.random() * 0.5}s`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                {recordingState === 'paused' && (
                                    <div className="flex flex-col items-center text-amber-500">
                                        <span className="material-symbols-outlined text-4xl">pause_circle</span>
                                        <span className="text-xs font-bold mt-1">PAUSED</span>
                                    </div>
                                )}

                                {(recordingState === 'review' || recordingState === 'uploading' || recordingState === 'completed') && (
                                    <div className="flex flex-col items-center text-blue-600">
                                        <span className="material-symbols-outlined text-4xl">audio_file</span>
                                        <span className="text-xs font-bold mt-1">Audio Captured</span>
                                    </div>
                                )}

                                {recordingState === 'idle' && (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <span className="material-symbols-outlined text-4xl">mic_off</span>
                                        <span className="text-xs font-medium mt-1">Ready to Record</span>
                                    </div>
                                )}
                            </div>

                            {/* Timer */}
                            <div className="text-3xl font-mono font-bold text-gray-800  tracking-widest">
                                {formatTime(recordingTime)}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4 w-full justify-center">
                                {recordingState === 'idle' ? (
                                    <button
                                        onClick={startRecording}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="size-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center border-4 border-red-50 group-hover:scale-105 transition-transform shadow-lg shadow-red-500/10">
                                            <span className="material-symbols-outlined text-3xl icon-fill">mic</span>
                                        </div>
                                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider mt-1">Record</span>
                                    </button>
                                ) : recordingState === 'review' || recordingState === 'completed' ? (
                                    <div className="w-full flex flex-col gap-3">
                                        <audio controls src={audioUrl || undefined} className="w-full h-8" />
                                        <div className="flex gap-3 mt-2">
                                            {recordingState !== 'completed' && (
                                                <>
                                                    <button onClick={deleteRecording} className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm">
                                                        Reset
                                                    </button>
                                                    <button onClick={handleSubmit} className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-md">
                                                        Submit
                                                    </button>
                                                </>
                                            )}
                                            {recordingState === 'completed' && (
                                                <div className="w-full py-2 bg-green-50 text-green-700 font-bold text-sm text-center rounded-lg border border-green-200 flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-sm icon-fill">check_circle</span>
                                                    Saved Successfully
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={pauseRecording}
                                            className="size-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                                            title={recordingState === 'paused' ? "Resume" : "Pause"}
                                        >
                                            <span className="material-symbols-outlined text-2xl">
                                                {recordingState === 'paused' ? 'play_arrow' : 'pause'}
                                            </span>
                                        </button>

                                        <button
                                            onClick={stopRecording}
                                            className="size-16 rounded-full bg-gray-800 hover:bg-black text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                        >
                                            <span className="material-symbols-outlined text-3xl">stop</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Phase2Speech;
