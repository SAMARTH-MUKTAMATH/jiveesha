import React, { useState } from 'react';
import {
    ArrowLeft,
    School,
    Mail,
    MessageSquare,
    Printer,
    CheckCircle,
    UserX,
    Info,
    Search,
    BellRing
} from 'lucide-react';

interface TeacherStudentListProps {
    onBack: () => void;
    teacherId?: string;
    teacherName?: string;
    className?: string;
}

interface Student {
    id: string;
    name: string;
    initials: string;
    dob: string;
    guardianName: string;
    guardianContact: string;
    screeningStatus: 'Screened' | 'Not Attended' | 'Pending';
    consentGiven: boolean;
    autoConsented?: boolean;
    initialsColor: string;
}

const TeacherStudentList: React.FC<TeacherStudentListProps> = ({
    onBack,
    teacherId,
    teacherName: propTeacherName,
    className
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teacher, setTeacher] = useState<any>(null);

    // Fetch Teacher Details
    React.useEffect(() => {
        if (!teacherId || teacherId.startsWith('T-')) return; // Don't fetch for default/mock

        const fetchTeacher = async () => {
            try {
                // Assuming api is imported from services/api like in TeachersDirectory
                const { api } = await import('../services/api');
                const response = await api.get(`/school/teachers/${teacherId}`);
                if (response.data?.data) {
                    const fetchedTeacher = response.data.data;
                    setTeacher(fetchedTeacher);

                    // Map primaryStudents to Student interface
                    if (fetchedTeacher.primaryStudents) {
                        const mappedStudents: Student[] = fetchedTeacher.primaryStudents.map((view: any) => {
                            const person = view.person;
                            const contact = person.contacts?.[0] || {};
                            const latestScreening = person.screenings?.[0];

                            // Determine status
                            let status: 'Screened' | 'Not Attended' | 'Pending' = 'Not Attended';
                            if (latestScreening) {
                                status = latestScreening.status === 'completed' ? 'Screened' : 'Pending';
                            }

                            // Initials logic
                            const initials = `${person.firstName[0] || ''}${person.lastName[0] || ''}`.toUpperCase();
                            const colors = ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600', 'bg-green-100 text-green-600'];
                            const randomColor = colors[Math.floor(Math.random() * colors.length)];

                            return {
                                id: person.id, // Use Person ID or view ID? Using Person ID for now as it's more universal
                                name: `${person.firstName} ${person.lastName}`,
                                initials,
                                dob: new Date(person.dateOfBirth).toLocaleDateString(),
                                guardianName: contact.firstName ? `${contact.firstName} ${contact.lastName}` : 'Unknown Guardian',
                                guardianContact: contact.phone || contact.email || 'No contact info',
                                screeningStatus: status,
                                consentGiven: false, // Defaulting to false as per schema limitations for now
                                autoConsented: false,
                                initialsColor: randomColor
                            };
                        });
                        setStudents(mappedStudents);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch teacher:', error);
            }
        };

        fetchTeacher();
    }, [teacherId]);

    // Use fetched data or fallback props
    const displayTeacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : (propTeacherName || 'Sarah Jenkins');
    const displayEmail = teacher?.email || 's.jenkins@daira-school.edu';
    const displayId = teacher?.employeeId || teacherId || '88214'; // Show 6-digit employeeId if available
    const displayAssignment = teacher && teacher.subjects ? JSON.parse(teacher.subjects)[0] || 'Unassigned' : 'Grade 3A';

    // Initial state can be empty array if fetching rows
    const [students, setStudents] = useState<Student[]>([]);

    // Derived State
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery)
    );

    const studentsWithConsent = students.filter(s => s.consentGiven).length;
    const notAttendedCount = students.filter(s => s.screeningStatus === 'Not Attended').length;

    // Handlers
    const handleToggleConsent = (studentId: string) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, consentGiven: !s.consentGiven } : s
        ));
    };

    return (
        <div className={`flex flex-col w-full h-full ${className || ''}`}>

            {/* Breadcrumb - Keeping concise */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 font-medium text-gray-500 hover:text-[#135bec] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Teachers
                </button>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span className="font-medium text-[#135bec]">Student List</span>
            </div>

            {/* Teacher Profile Card */}
            <div className="glass-card rounded-2xl p-6 lg:p-8 mb-8 border border-white/50 dark:border-gray-700 shadow-sm relative overflow-hidden bg-white/90 backdrop-blur-md">
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-6 md:items-center relative z-10">
                    <div
                        className="size-20 lg:size-24 rounded-full border-4 border-white dark:border-gray-600 shadow-md bg-cover bg-center shrink-0"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9-Mizh7NGaIFRsNY0LHN8ExI6CUTjyV7JDe3-a1Dt5BF0GapH5NjveB8pcEAE6TuCkrFb2rT2ui3iPuAr-6pveGxNDJurhQTVZE351L1J_0_HX67w01O8qmIhxT0As4WZuH76MAl2DEog-YwxKfNjkgzVFPzR1mNBw82kPnoo8i4KiTFyHQRpcj7cAY0c9SAKIS5yygQQuAe6getSqvDSLPux29DnkOrKCi-x7PWIMXlDQvvJKNDXXnjA0dtw5uGHZ1M_CWSRHYVo")' }}
                    >
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#111318] dark:text-white mb-1">{displayTeacherName}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[#135bec] font-medium">
                                        <School size={16} />
                                        {displayAssignment}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail size={16} />
                                        {displayEmail}
                                    </span>
                                    <span className="hidden sm:inline text-gray-300">|</span>
                                    <span>ID: {displayId}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-[#dbdfe6] dark:border-gray-600 text-[#111318] dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all">
                                    <MessageSquare size={18} />
                                    Message
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#135bec] text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-all">
                                    <Printer size={18} />
                                    Print List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-[#dbdfe6] dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Students with Consent</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">{studentsWithConsent}<span className="text-lg text-gray-400 font-normal">/{students.length}</span></h3>
                        </div>
                    </div>
                    <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-[#dbdfe6] dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Attended Screening</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">{notAttendedCount}</h3>
                            {notAttendedCount > 0 && (
                                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded mb-1">Action Needed</span>
                            )}
                        </div>
                    </div>
                    <div className="size-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <UserX size={24} />
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 flex flex-col justify-center">
                    <div className="flex items-start gap-3">
                        <Info size={16} className="text-[#135bec] mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-[#135bec] mb-1">Auto-Consent Policy Active</h4>
                            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                If parental consent is not explicitly denied within <span className="font-bold">7 days</span> of the request, the system defaults to <span className="font-bold">'Consent Given'</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Roster Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Student Roster</h3>
                    <div className="relative w-full sm:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search size={20} />
                        </span>
                        <input
                            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Search student by name or ID..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Head (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-[#f0f2f4] dark:border-gray-700">
                    <div className="col-span-4">Student Name & ID</div>
                    <div className="col-span-3">Parent / Guardian</div>
                    <div className="col-span-2">Screening Status</div>
                    <div className="col-span-3 text-right">Parental Consent</div>
                </div>

                {/* List Content */}
                <div className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                    {filteredStudents.map(student => (
                        <div
                            key={student.id}
                            className={`group hover:bg-blue-50/30 dark:hover:bg-gray-800/30 transition-colors p-4 md:px-6 md:py-4 ${student.autoConsented ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}
                        >
                            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-center">

                                {/* Student Info */}
                                <div className="w-full md:col-span-4 flex items-center gap-3 mb-3 md:mb-0">
                                    <div className={`size-10 rounded-full ${student.initialsColor} flex items-center justify-center font-bold text-sm`}>
                                        {student.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#111318] dark:text-white">{student.name}</p>
                                        <p className="text-xs text-gray-500">ID: {student.id} • DOB: {student.dob}</p>
                                    </div>
                                </div>

                                {/* Guardian Info */}
                                <div className="w-full md:col-span-3 flex md:flex-col justify-between md:justify-center mb-2 md:mb-0">
                                    <span className="md:hidden text-xs text-gray-500 font-medium">Guardian:</span>
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{student.guardianName}</p>
                                        <p className="text-xs text-gray-400">{student.guardianContact}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="w-full md:col-span-2 flex md:block justify-between items-center mb-2 md:mb-0">
                                    <span className="md:hidden text-xs text-gray-500 font-medium">Status:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.screeningStatus === 'Screened' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                        student.screeningStatus === 'Not Attended' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {student.screeningStatus}
                                    </span>
                                </div>

                                {/* Consent Checkbox */}
                                <div className="w-full md:col-span-3 flex items-center justify-between md:justify-end gap-3">
                                    {/* Notify Parent Button for Not Attended */}
                                    {student.screeningStatus === 'Not Attended' && !student.consentGiven && (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#135bec] border border-blue-200 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-300 transition-all dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/40">
                                            <BellRing size={16} />
                                            Notify Parent
                                        </button>
                                    )}

                                    {/* Auto-Consent Badge */}
                                    {student.autoConsented && (
                                        <div className="flex flex-col items-end md:mr-3">
                                            <span className="md:hidden text-sm font-medium text-gray-700 dark:text-gray-300">Consent Given</span>
                                            <span className="text-[10px] text-[#135bec] font-medium bg-blue-100 dark:bg-blue-900/40 px-1.5 rounded">Auto-Consented</span>
                                        </div>
                                    )}

                                    {/* Toggle Switch */}
                                    <div className="flex items-center">
                                        <span className="md:hidden text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">{!student.autoConsented ? 'Consent Given' : ''}</span>
                                        <label className="flex items-center cursor-pointer relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={student.consentGiven}
                                                onChange={() => handleToggleConsent(student.id)}
                                            />
                                            <div className={`w-11 h-6 rounded-full border transition-colors duration-200 ease-in-out ${student.consentGiven ? 'bg-[#135bec] border-[#135bec]' : 'bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-600'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm ${student.consentGiven ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-[#f0f2f4] dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredStudents.length} of {students.length} students</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherStudentList;
