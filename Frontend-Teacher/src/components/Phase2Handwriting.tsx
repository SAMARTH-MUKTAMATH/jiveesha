import React, { useState, useRef } from 'react';
import Navbar from './Navbar';

// Interfaces
interface Phase2HandwritingProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

const Phase2Handwriting: React.FC<Phase2HandwritingProps> = ({ studentId, onNavigate }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
    const [rotation, setRotation] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        // Validate file type
        if (!selectedFile.type.match('image.*') && selectedFile.type !== 'application/pdf') {
            alert('Please upload an image or PDF file.');
            return;
        }

        setFile(selectedFile);
        // Create preview URL for images
        if (selectedFile.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null); // No preview for PDF yet (simplified)
        }
        setRotation(0);
        setUploadStatus('idle');
    };

    const handleUpload = () => {
        setUploadStatus('uploading');

        // Mock Upload + Analysis sequence
        setTimeout(() => setUploadStatus('analyzing'), 1500);
        setTimeout(async () => {
            setUploadStatus('success');

            // Save result to backend
            if (screening?.id) {
                try {
                    const token = localStorage.getItem('auth_token');

                    // Prepare updated metadata
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
                                    handwriting: 'completed'
                                }
                            }
                        },
                        parsedResults: {
                            ...(currentMetadata.parsedResults || {}),
                            handwriting: {
                                score: '85%',
                                alignment: 'Moderate',
                                fileUrl: 'mock-url-for-demo', // In real app, from upload response
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
        }, 3500);
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
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

            <main className="flex-grow w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col gap-6">

                {/* Instruction Card */}
                <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900  mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">edit_note</span>
                            Writing Prompt
                        </h3>
                        <div className="bg-blue-50  p-4 rounded-lg border border-blue-100  text-blue-800  font-serif italic text-lg leading-relaxed text-center">
                            "The quick brown fox jumps over the lazy dog."
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Ask the student to copy this sentence on a blank sheet of paper. Ensure good lighting when capturing the photo.
                        </p>
                    </div>
                    <div className="w-px bg-gray-200  hidden md:block"></div>
                    <div className="md:w-1/3 flex flex-col gap-3 justify-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600 ">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                            <span>Use black or blue ink</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 ">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                            <span>Ensure full page is visible</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 ">
                            <span className="material-symbols-outlined text-red-500 text-[18px]">cancel</span>
                            <span>Avoid shadows on text</span>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start h-full">

                    {/* Drop Zone */}
                    <div className="h-full">
                        {!file || uploadStatus === 'success' ? (
                            <div
                                className={`h-64 lg:h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${isDragOver
                                    ? 'border-blue-500 bg-blue-50 '
                                    : 'border-gray-300  bg-gray-50  hover:border-blue-400'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                </div>
                                <h4 className="font-bold text-gray-900  text-lg mb-1">Upload Sample</h4>
                                <p className="text-gray-500 text-sm mb-4">Drag & drop or click to browse</p>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Supports JPG, PNG, PDF</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileInput}
                                />
                            </div>
                        ) : (
                            <div className="border border-gray-200  bg-white  rounded-xl p-4 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800  text-sm">Preview</h4>
                                    <div className="flex gap-2">
                                        <button onClick={handleRotate} className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Rotate">
                                            <span className="material-symbols-outlined">rotate_right</span>
                                        </button>
                                        <button onClick={() => setFile(null)} className="p-1 hover:bg-gray-100 rounded text-red-500" title="Remove">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-grow bg-gray-100  rounded-lg flex items-center justify-center overflow-hidden relative min-h-[240px]">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-[300px] object-contain transition-transform duration-300"
                                            style={{ transform: `rotate(${rotation}deg)` }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <span className="material-symbols-outlined text-4xl mb-2">picture_as_pdf</span>
                                            <span>{file.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status / Results */}
                    <div className="space-y-4">
                        {uploadStatus === 'idle' && !file && (
                            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm p-8 border border-gray-100 rounded-xl bg-gray-50/50">
                                Waiting for upload...
                            </div>
                        )}

                        {file && uploadStatus === 'idle' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpload}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">upload</span>
                                    Upload & Analyze
                                </button>
                            </div>
                        )}

                        {uploadStatus === 'uploading' && (
                            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 py-12">
                                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="text-gray-600 font-medium animate-pulse">Uploading sample...</p>
                            </div>
                        )}

                        {uploadStatus === 'analyzing' && (
                            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 py-12">
                                <div className="relative">
                                    <div className="size-16 rounded-full bg-purple-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-purple-600 text-3xl animate-bounce">psychology</span>
                                    </div>
                                    <div className="absolute top-0 right-0">
                                        <span className="flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-900 font-bold mb-1">Analyzing Handwriting</p>
                                    <p className="text-xs text-gray-500">Checking letter formation, spacing, and line alignment...</p>
                                </div>
                            </div>
                        )}

                        {uploadStatus === 'success' && (
                            <div className="bg-white rounded-xl shadow-card border border-green-200 overflow-hidden">
                                <div className="p-4 bg-green-50/50 border-b border-green-100 flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center border border-green-200">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-800 text-sm">Analysis Complete</p>
                                        <p className="text-[10px] text-green-600">Sample verified and stored</p>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Legibility Score</span>
                                            <span className="font-bold text-gray-900">High (85%)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Line Alignment</span>
                                            <span className="font-bold text-gray-900">Moderate</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => onNavigate('student-profile', { studentId })}
                                            className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm"
                                        >
                                            Back to Profile
                                        </button>
                                        <button
                                            onClick={() => onNavigate('screening-results', { studentId })}
                                            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
                                        >
                                            View Full Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {uploadStatus === 'error' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                                <h4 className="font-bold text-red-700">Upload Failed</h4>
                                <p className="text-sm text-red-600 mb-4">The file could not be processed. Please try again.</p>
                                <button onClick={() => setUploadStatus('idle')} className="px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 text-sm font-bold shadow-sm">
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Phase2Handwriting;
