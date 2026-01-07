import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface ScreeningResultsProps {
    studentId: string;
    onNavigate: (view: string, params?: any) => void;
}

const ScreeningResults: React.FC<ScreeningResultsProps> = ({ studentId, onNavigate }) => {
    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        fetchResults();
    }, [studentId]);

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to load results');
            const data = await response.json();
            setProfileData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const screeningId = profileData.screening?.id;
            console.log('DEBUG: handleDownload screeningId:', screeningId);
            if (!screeningId) {
                const debugInfo = JSON.stringify(profileData.screening, null, 2);
                console.error('Missing screening ID. Full profileData:', profileData);
                alert(`Debug Info:\n${debugInfo}\n\nID missing.`);
                return;
            }

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/teacher/screenings/${screeningId}/report`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Screening_Report_${profileData.student.firstName}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            console.error('Download error:', error);
            alert('Failed to download report: ' + error.message);
        }
    };

    const handleShare = async () => {
        const email = prompt("Enter parent email address to share report:");
        if (!email) return;

        try {
            const screeningId = profileData.screening?.id;
            if (!screeningId) {
                alert("No screening data available.");
                return;
            }

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/teacher/screenings/${screeningId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) throw new Error('Sharing failed');

            alert('Report shared successfully!');
        } catch (error: any) {
            console.error('Share error:', error);
            alert('Failed to share report: ' + error.message);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !profileData) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
                <h3 className="text-lg font-bold">Error loading results</h3>
                <p className="text-slate-500 mb-4">{error}</p>
                <button onClick={() => onNavigate('my-students')} className="text-blue-600 font-bold">Back to Students</button>
            </div>
        </div>
    );

    const { student, phaseProgress, parsedResults } = profileData;
    console.log('DEBUG: profileData:', profileData);
    console.log('DEBUG: screening:', profileData.screening);
    console.log('DEBUG: parsedResults:', parsedResults);

    return (
        <div className="bg-slate-50 min-h-screen font-display pb-12">
            <Navbar
                teacherName={profileData.teacher.name}
                teacherAssignment={profileData.teacher.assignment}
                schoolName={profileData.school.name}
                onNavigate={onNavigate}
                activeView="my-students"
            />

            <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <button onClick={() => onNavigate('student-profile', { studentId })} className="hover:text-blue-600">Student Profile</button>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="font-medium text-slate-900">Screening Results</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Screening Report</h1>
                        <p className="text-slate-500">Comprehensive assessment findings for {student.firstName} {student.lastName}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Download PDF
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">share</span>
                            Share with Parent
                        </button>
                    </div>
                </div>

                {/* Patient / Student Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h2>
                            <p className="text-sm text-slate-500">ID: {student.studentId} • Grade {student.grade}-{student.section}</p>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Assessment</p>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${(student.riskLevel || 'low') === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                            (student.riskLevel || 'low') === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                            <span className="h-2 w-2 rounded-full bg-current"></span>
                            {(student.riskLevel || 'low').toUpperCase()} RISK
                        </div>
                    </div>
                    <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completion Status</p>
                        <p className="text-sm font-bold text-slate-900">
                            {(student.screeningStatus || 'pending') === 'completed' ? 'Fully Screened' : 'Partial Screening'}
                        </p>
                    </div>
                </div>

                {/* Phase Reports */}
                <div className="space-y-6">
                    {/* Phase 1 */}
                    <ReportSection
                        title="Phase 1: Initial Observations"
                        icon="fact_check"
                        status={phaseProgress[1]?.status}
                        findings="Initial screening through teacher-led checklist. Observation focusing on behavioral and preliminary learning benchmarks."
                        results={[
                            { label: 'Checklist Score', value: 'High Correlation', status: 'flagged' }
                        ]}
                    />

                    {/* Phase 2 */}
                    <ReportSection
                        title="Phase 2: Technical Analysis"
                        icon="science"
                        status={phaseProgress[2]?.status}
                        findings="Multi-modal analysis involving speech patterns, handwriting fluidity, and visual attention/gaze metrics."
                        results={[
                            {
                                label: 'Speech Patterns',
                                value: parsedResults?.speech?.score || 'Not Assessed',
                                status: parsedResults?.speech?.status || 'normal'
                            },
                            {
                                label: 'Handwriting',
                                value: parsedResults?.handwriting?.score ? `Score: ${parsedResults.handwriting.score} - ${parsedResults.handwriting.alignment}` : 'Not Assessed',
                                status: parsedResults?.handwriting?.status || 'normal'
                            },
                            {
                                label: 'Gaze Metrics',
                                value: parsedResults?.gaze?.fixation ? `Fixation: ${parsedResults.gaze.fixation}` : 'Not Assessed',
                                status: parsedResults?.gaze?.status || 'normal'
                            }
                        ]}
                    />

                    {/* Phase 3 */}
                    <ReportSection
                        title="Phase 3: Clinical Screening"
                        icon="medical_services"
                        status={phaseProgress[3]?.status}
                        findings="Structured clinical assessments for Academic Skills (ASMA), Specific Learning Disabilities (SLD), and ADHD."
                        results={[
                            { label: 'ASMA', value: 'Score: 78/100 (Proficient)', status: 'normal' },
                            { label: 'SLD Screening', value: 'Moderate risk for Dyslexia characteristics', status: 'moderate' },
                            { label: 'ADHD (Vanderbilt)', value: 'Inattentive sub-type metrics elevated', status: 'flagged' }
                        ]}
                    />

                    {/* Phase 4 */}
                    <ReportSection
                        title="Phase 4: Game-based Verification"
                        icon="sports_esports"
                        status={phaseProgress[4]?.status}
                        findings="Verification of preliminary findings through gamified interaction in core subject areas (Maths, English) and Regional Language."
                        results={[
                            { label: 'English Game', value: 'Comprehesion strength verified', status: 'normal' },
                            { label: 'Maths Game', value: 'Number sense: Strong', status: 'normal' },
                            { label: 'Regional Hub', value: 'Fluency: Moderate', status: 'moderate' }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

interface ReportSectionProps {
    title: string;
    icon: string;
    status: string;
    findings: string;
    results: Array<{ label: string, value: string, status: 'normal' | 'moderate' | 'flagged' }>;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, icon, status, findings, results }) => {
    if (!status || status === 'pending') return null;

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{title}</h3>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Completed</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
            </div>
            <div className="p-6">
                <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Findings</p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        {findings}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Metric Summary</p>
                    <div className="space-y-3">
                        {results.map((res, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                <span className="text-sm font-medium text-slate-600">{res.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-900">{res.value}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${res.status === 'flagged' ? 'bg-red-50 text-red-700 border border-red-100' :
                                        res.status === 'moderate' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        }`}>
                                        {res.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScreeningResults;
