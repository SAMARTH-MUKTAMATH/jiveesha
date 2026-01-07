import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


// Interfaces
interface MyStudentsListProps {
    onNavigate: (view: string, data?: any) => void;
}

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    grade: string;
    section: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;

    screeningStatus: 'not_screened' | 'in_progress' | 'completed';
    currentPhase: 1 | 2 | 3 | 4 | null;
    lastScreeningDate: string | null;
    screeningResult: string | null;

    screeningConsent: boolean;
    consentDate: string | null;

    urgentFlag: boolean;
    hasPEP: boolean;

    phaseProgress: {
        phase1: boolean;
        phase2: boolean;
        phase3: boolean;
        phase4: boolean;
    };
}

interface FilterCounts {
    all: number;
    pending: number;
    completed: number;
    flagged: number;
    consentAwaiting: number;
    pepIssued: number;
}

const MyStudentsList: React.FC<MyStudentsListProps> = ({ onNavigate }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [teacherData, setTeacherData] = useState<any>(null);
    const [filterCounts, setFilterCounts] = useState<FilterCounts>({
        all: 0,
        pending: 0,
        completed: 0,
        flagged: 0,
        consentAwaiting: 0,
        pepIssued: 0
    });

    const location = useLocation();

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter') || 'all';
        setSelectedFilter(filter);
        fetchStudents(filter);
    }, [location.search]);

    const fetchStudents = async (filterOverride?: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_BASE_URL}/teacher/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStudents(data.students);
                setTeacherData(data.teacher);
                calculateFilterCounts(data.students);

                // Use override if provided, otherwise explicit fallback to current state
                const activeFilter = typeof filterOverride === 'string' ? filterOverride : selectedFilter;
                applyFilters(data.students, activeFilter, searchQuery);
            } else {
                throw new Error('Failed to load students');
            }
            return;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch students');
        } finally {
            setIsLoading(false);
        }


    };

    const calculateFilterCounts = (studentList: Student[]) => {
        setFilterCounts({
            all: studentList.length,
            pending: studentList.filter(s => s.screeningStatus === 'not_screened').length,
            completed: studentList.filter(s => s.screeningStatus === 'completed').length,
            flagged: studentList.filter(s => s.urgentFlag || s.screeningResult === 'flag_raised').length,
            consentAwaiting: studentList.filter(s => !s.screeningConsent).length,
            pepIssued: studentList.filter(s => s.hasPEP).length
        });
    };

    const applyFilters = (studentList: Student[], filter: string, query: string) => {
        let filtered = [...studentList];

        // Apply filter
        switch (filter) {
            case 'pending':
                filtered = filtered.filter(s => s.screeningStatus === 'not_screened');
                break;
            case 'completed':
                filtered = filtered.filter(s => s.screeningStatus === 'completed');
                break;
            case 'flagged':
                filtered = filtered.filter(s => s.urgentFlag || s.screeningResult === 'flag_raised');
                break;
            case 'consentAwaiting':
                filtered = filtered.filter(s => !s.screeningConsent);
                break;
            case 'pepIssued':
                filtered = filtered.filter(s => s.hasPEP);
                break;
        }

        // Apply search
        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(s =>
                s.firstName.toLowerCase().includes(lowerQuery) ||
                s.lastName.toLowerCase().includes(lowerQuery) ||
                s.studentId.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredStudents(filtered);
    };

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        applyFilters(students, filter, searchQuery);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(students, selectedFilter, query);
    };

    const handleViewStudent = (studentId: string) => {
        onNavigate('student-profile', { studentId });
    };

    const handleStartScreening = (student: Student) => {
        if (!student.screeningConsent) {
            alert('Screening consent is required. Please request consent from parent/guardian.');
            return;
        }
        onNavigate('screening-flow', { studentId: student.id, phase: 1 });
    };

    const handleResumeScreening = (student: Student) => {
        onNavigate('screening-flow', { studentId: student.id, phase: student.currentPhase || 1 });
    };

    const handleRequestConsent = (student: Student) => {
        alert('Consent request feature coming soon');
    };

    const PhaseIndicator = ({ completed, phaseNumber, isCurrent }: any) => {
        let bgClass = "bg-slate-200 text-slate-400 ";
        if (completed) bgClass = "bg-emerald-500 text-white";
        else if (isCurrent) bgClass = "bg-amber-500 text-white ring-2 ring-amber-100 ";

        return (
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${bgClass} transition-all`}>
                {completed ? (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                ) : isCurrent ? (
                    <span className="material-symbols-outlined text-[14px]">priority_high</span>
                ) : (
                    <span className="text-[10px]">{phaseNumber}</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-slate-50  min-h-screen font-display">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {isLoading ? (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Loading students...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center max-w-md p-6 bg-white  rounded-xl shadow-sm border border-slate-200 ">
                            <span className="material-symbols-outlined text-4xl text-red-500 mb-3">error</span>
                            <h3 className="text-lg font-bold text-slate-900 ">Unable to load students</h3>
                            <p className="text-slate-500  mt-2 mb-4">{error}</p>
                            <button
                                onClick={() => fetchStudents()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Page Title & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">My Students</h1>
                                <p className="text-sm text-slate-500">Manage and track screening progress for your class.</p>
                            </div>
                            <button
                                onClick={() => onNavigate('add-student')}
                                className="flex items-center gap-2 bg-[#135bec] hover:bg-[#0f4bc4] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all w-fit"
                            >
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                Create Student
                            </button>
                        </div>

                        {/* Controls Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Search name or ID..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200  text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none  "
                                />
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'All', count: filterCounts.all },
                                    { id: 'pending', label: 'Pending', count: filterCounts.pending },
                                    { id: 'completed', label: 'Completed', count: filterCounts.completed },
                                    { id: 'flagged', label: 'Flagged', count: filterCounts.flagged },
                                    { id: 'consentAwaiting', label: 'Consent Awaiting', count: filterCounts.consentAwaiting },
                                    { id: 'pepIssued', label: 'PEP Issued', count: filterCounts.pepIssued },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleFilterChange(tab.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${selectedFilter === tab.id
                                            ? 'bg-slate-800 text-white border-slate-800  '
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50   '
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Student Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredStudents.map(student => (
                                <article key={student.id} className={`flex flex-col justify-between rounded-xl bg-white  shadow-sm border hover:shadow-lg transition-all duration-300 ${student.urgentFlag ? 'border-red-200 ring-1 ring-red-100 ' : 'border-slate-100 '}`}>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 ">{student.firstName} {student.lastName}</h3>
                                                    <p className="text-xs text-slate-500 font-medium">ID: {student.studentId} • Grade {student.grade}-{student.section}</p>
                                                </div>
                                            </div>

                                            {/* Top Badge */}
                                            {!student.screeningConsent ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 border border-slate-200   ">
                                                    Consent Required
                                                </span>
                                            ) : student.urgentFlag ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600 border border-red-100  ">
                                                    Flagged
                                                </span>
                                            ) : student.screeningStatus === 'completed' ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-600 border border-green-100  ">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600 border border-amber-100  ">
                                                    In Progress
                                                </span>
                                            )}
                                        </div>

                                        {/* Phase Progress */}
                                        {student.screeningConsent && (
                                            <div className="mb-5">
                                                <div className="flex items-center justify-between text-xs font-medium text-slate-500  mb-2">
                                                    <span>Screening Process</span>
                                                    <span>
                                                        {student.screeningStatus === 'not_screened' ? 'Not Started' :
                                                            student.screeningStatus === 'completed' ? 'All Phases Done' :
                                                                `Phase ${student.currentPhase} Active`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center w-full">
                                                    <PhaseIndicator completed={student.phaseProgress.phase1} phaseNumber={1} isCurrent={student.currentPhase === 1} />
                                                    <div className={`flex-1 h-0.5 mx-1 ${student.phaseProgress.phase1 ? 'bg-emerald-500' : 'bg-slate-200 '}`}></div>

                                                    <PhaseIndicator completed={student.phaseProgress.phase2} phaseNumber={2} isCurrent={student.currentPhase === 2} />
                                                    <div className={`flex-1 h-0.5 mx-1 ${student.phaseProgress.phase2 ? 'bg-emerald-500' : 'bg-slate-200 '}`}></div>

                                                    <PhaseIndicator completed={student.phaseProgress.phase3} phaseNumber={3} isCurrent={student.currentPhase === 3} />
                                                    <div className={`flex-1 h-0.5 mx-1 ${student.phaseProgress.phase3 ? 'bg-emerald-500' : 'bg-slate-200 '}`}></div>

                                                    <PhaseIndicator completed={student.phaseProgress.phase4} phaseNumber={4} isCurrent={student.currentPhase === 4} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Info / Accommodations Box */}
                                        {!student.screeningConsent ? (
                                            <div className="bg-blue-50  rounded-lg p-3 flex flex-col gap-1 text-sm border border-blue-100 ">
                                                <div className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">info</span>
                                                    <p className="text-xs text-slate-700  leading-relaxed">
                                                        Parent consent is required before screening can begin.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : student.hasPEP ? (
                                            <div className="bg-slate-50  rounded-lg p-3 flex flex-col gap-2 text-sm border border-slate-100 ">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600 ">Accommodations:</span>
                                                    <span className="font-bold text-slate-900 ">Active</span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="p-4 border-t border-slate-100  bg-slate-50/50  rounded-b-xl flex gap-3">
                                        {!student.screeningConsent ? (
                                            <button
                                                onClick={() => handleRequestConsent(student)}
                                                className="flex-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">send</span>
                                                Request Consent
                                            </button>
                                        ) : student.screeningStatus === 'completed' ? (
                                            <button
                                                onClick={() => onNavigate('screening-results', { studentId: student.id })}
                                                className="flex-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">assignment</span>
                                                View Results
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => student.screeningStatus === 'in_progress' ? handleResumeScreening(student) : handleStartScreening(student)}
                                                className="flex-1 bg-[#135bec] hover:bg-[#0f4bc4] text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                                {student.screeningStatus === 'in_progress' ? 'Resume Screening' : 'Start Screening'}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleViewStudent(student.id)}
                                            className="p-2 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg bg-white"
                                            title="View Profile"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredStudents.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 ">No students found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div >
    );
};


export default MyStudentsList;
