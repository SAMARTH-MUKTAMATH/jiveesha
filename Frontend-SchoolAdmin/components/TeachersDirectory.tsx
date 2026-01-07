import React, { useState } from 'react';
import { api } from '../services/api';
import Modal from './Modal';
import {
    Users,
    Download,
    UserPlus,
    IdCard,
    CheckCircle,
    CalendarOff,
    Search,
    Mail,
    TrendingUp,
    Share,
    Loader2,
    ShieldCheck
} from 'lucide-react';

interface TeachersDirectoryProps {
    onBack: () => void;
    onViewTeacher: (teacherId: string) => void;
}

interface Teacher {
    id: string;
    name: string;
    email: string;
    assignment: string;
    role: string;
    status: 'Active' | 'On Leave' | 'Inactive' | 'Invited';
    photo?: string;
    initials?: string;
    lastChanged: string;
    color?: string;
    phone?: string;
}

// No mock data

const TeachersDirectory: React.FC<TeachersDirectoryProps> = ({
    onViewTeacher,
}) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTeachers, setTotalTeachers] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Teachers
    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                search: searchQuery
            };
            if (filterStatus !== 'All') {
                params.status = filterStatus;
            }

            const response = await api.get('/school/teachers-activity', { params });
            const { data, meta } = response.data;

            // Map API data to UI model
            const mappedTeachers = data.map((t: any) => ({
                id: t.id,
                name: `${t.firstName} ${t.lastName}`,
                email: t.email,
                phone: t.phone,
                assignment: t.assignment || 'Unassigned',
                role: 'Teacher',
                status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Active',
                initials: `${t.firstName[0]}${t.lastName[0]}`,
                color: 'bg-blue-100 text-blue-600',
                lastChanged: new Date(t.updatedAt).toLocaleDateString(),
            }));

            setTeachers(mappedTeachers);
            setTotalPages(Math.max(meta?.totalPages || 1, 1));
            setTotalTeachers(meta?.total || data?.length || 0);
        } catch (error) {
            console.warn("Backend unavailable or error");
            setTeachers([]);
            setTotalPages(1);
            setTotalTeachers(0);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTeachers();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, searchQuery, filterStatus]);

    // Handlers
    const handleAddTeacher = () => {
        setEditingTeacher(null);
        setIsModalOpen(true);
    };

    const handleManageCredentials = (teacherId: string) => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (teacher) {
            setEditingTeacher(teacher);
            setIsModalOpen(true);
        }
    };

    const submitTeacher = async (data: any, invite: boolean) => {
        setIsSubmitting(true);

        // Prepare local object in case of fallback
        const newLocalTeacher: Teacher = {
            id: editingTeacher?.id || `local-${Date.now()}`,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            assignment: data.assignment,
            role: 'Teacher',
            status: invite ? 'Invited' : 'Active', // Default logic based on action
            initials: `${data.firstName?.[0]}${data.lastName?.[0]}`,
            color: 'bg-blue-100 text-blue-600',
            lastChanged: new Date().toLocaleDateString()
        };

        try {
            if (editingTeacher && !editingTeacher.id.startsWith('mock-') && !editingTeacher.id.startsWith('local-')) {
                // Only try to update real entities on backend
                await api.put(`/teachers/${editingTeacher.id}`, data);
            } else if (!editingTeacher) {
                // Try to create on backend
                if (invite) data.status = 'invited';
                await api.post('/school/teachers', data);
            } else {
                // Mock teacher update - simulate success
                await new Promise(r => setTimeout(r, 500));
            }

            // Success flow
            alert(invite ? 'Teacher invited successfully!' : 'Teacher saved successfully!');
            fetchTeachers(); // Refresh list (which will pick up new backend data)
        } catch (error) {
            console.warn("Backend action failed, falling back to local state update");

            // Fallback: Update local state directly so UI reflects change
            setTeachers(prev => {
                if (editingTeacher) {
                    return prev.map(t => t.id === editingTeacher.id ? { ...t, ...newLocalTeacher, id: t.id } : t);
                } else {
                    return [newLocalTeacher, ...prev];
                }
            });
            setTotalTeachers(prev => prev + (editingTeacher ? 0 : 1));

            alert(invite ? 'Teacher invited successfully! (Offline Mode)' : 'Teacher saved successfully! (Offline Mode)');
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    const handleSaveOnly = (e: React.MouseEvent) => {
        e.preventDefault();
        const form = document.querySelector('#teacher-form') as HTMLFormElement;
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            assignment: formData.get('assignment') as string,
            assignment: formData.get('assignment') as string,
            // employeeId removed from manual input
            status: formData.get('status') as string || 'active',
        };
        submitTeacher(data, false);
    };

    const handleInvite = (e: React.MouseEvent) => {
        e.preventDefault();
        const form = document.querySelector('#teacher-form') as HTMLFormElement;
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            assignment: formData.get('assignment') as string,
            assignment: formData.get('assignment') as string,
            // employeeId removed from manual input
            status: formData.get('status') as string || 'invited',
        };
        submitTeacher(data, true);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Assignment', 'Status'];
        const csvContent = [
            headers.join(','),
            ...teachers.map(t => [t.id, t.name, t.email, t.phone || '', t.assignment, t.status].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'teachers_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Hero Card */}
            <div className="glass-card rounded-2xl p-6 lg:p-8 mb-8 border border-white/50 dark:border-gray-700 shadow-sm relative overflow-hidden bg-white/90 backdrop-blur-md">
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-6 md:items-center relative z-10">
                    <div className="size-20 lg:size-24 rounded-2xl bg-gradient-to-br from-blue-500 to-[#135bec] flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none text-white shrink-0">
                        <Users size={40} />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#111318] dark:text-white mb-1">Teachers Directory</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        Manage teaching staff, assignments, and schedules
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-[#dbdfe6] dark:border-gray-600 text-[#111318] dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
                                >
                                    <Download size={18} />
                                    Export CSV
                                </button>
                                <button
                                    onClick={handleAddTeacher}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#135bec] text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-all"
                                >
                                    <UserPlus size={18} />
                                    Add Teacher
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
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">{totalTeachers}</h3>
                        </div>
                    </div>
                    <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <IdCard size={24} />
                    </div>
                </div>
                {/* Other KPI cards can be dynamic too, but keeping static for now as requested only dynamic counts for list */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-[#dbdfe6] dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Today</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">--</h3>
                        </div>
                    </div>
                    <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-[#dbdfe6] dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">On Leave</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h3 className="text-3xl font-bold text-[#111318] dark:text-white">--</h3>
                            <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded mb-1">Subs Needed</span>
                        </div>
                    </div>
                    <div className="size-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <CalendarOff size={24} />
                    </div>
                </div>
            </div>

            {/* Directory List */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm overflow-hidden">
                {/* List Header */}
                <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">All Teachers</h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Search size={20} />
                            </span>
                            <input
                                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Search teacher by name or ID..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#135bec]/20"
                        >
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="on leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table Headers (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-[#f0f2f4] dark:border-gray-700">
                    <div className="col-span-3">Teacher Name & ID</div>
                    <div className="col-span-2">Assignment</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-center">View Profile</div>
                    <div className="col-span-3 text-right">Credentials Management</div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="w-8 h-8 border-4 border-[#135bec] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className={`group hover:bg-blue-50/30 dark:hover:bg-gray-800/30 transition-colors p-4 md:px-6 md:py-4 ${teacher.status === 'On Leave' ? 'bg-orange-50/20 dark:bg-orange-900/5' : ''}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="relative">
                                            {teacher.photo ? (
                                                <img
                                                    src={teacher.photo}
                                                    alt={teacher.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700 shadow-sm"
                                                />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${teacher.color || 'bg-gray-100 text-gray-600'} border border-white dark:border-gray-700 shadow-sm`}>
                                                    {teacher.initials}
                                                </div>
                                            )}
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${teacher.status === 'Active' ? 'bg-green-500' :
                                                teacher.status === 'On Leave' ? 'bg-orange-400' : 'bg-gray-400'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">
                                                {teacher.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 flex-[1.5]">
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Assignment</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{teacher.assignment}</div>
                                        </div>
                                        <div className="flex-1 hidden md:block">
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Role</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">{teacher.role}</div>
                                        </div>
                                        <div className="flex-1 hidden lg:block">
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Last Changed</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                                <CalendarOff size={14} className="text-gray-400" />
                                                {teacher.lastChanged}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleManageCredentials(teacher.id)}
                                            className="p-2 text-gray-400 hover:text-[#135bec] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                            title="Manage Credentials"
                                        >
                                            <div className="w-4 h-4 rounded border border-current flex items-center justify-center text-[10px] font-bold">...</div>
                                        </button>
                                        <button
                                            onClick={() => onViewTeacher(teacher.id)}
                                            className="px-3 py-1.5 text-xs font-semibold text-[#135bec] bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#f0f2f4] dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Showing {teachers.length} of {totalTeachers} teachers</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >Prev</button>
                        <span className="flex items-center text-sm text-gray-500">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >Next</button>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Teacher */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTeacher(null); }}
                title={editingTeacher ? "Manage Educator Profile" : "Invite New Educator"}
                size="lg"
            >
                <form id="teacher-form" className="flex flex-col gap-6">
                    {!editingTeacher && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-[#135bec]">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <h4 className="text-[#135bec] dark:text-blue-300 text-sm font-bold mb-1">Quick Invite</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Enter the educator's details to send them a secure access link. They will be able to set up their profile immediately.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">First Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <Users size={16} />
                                    </div>
                                    <input
                                        name="firstName"
                                        defaultValue={editingTeacher?.name.split(' ')[0]}
                                        required
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="Jane"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <Users size={16} />
                                    </div>
                                    <input
                                        name="lastName"
                                        defaultValue={editingTeacher?.name.split(' ').slice(1).join(' ')}
                                        required
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingTeacher?.email}
                                    required
                                    disabled={!!editingTeacher}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="jane.doe@school.edu"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-0.5">
                                            <Share size={12} className="rotate-90" />
                                        </div>
                                    </div>
                                    <input
                                        name="phone"
                                        type="tel"
                                        defaultValue={editingTeacher?.phone}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role / Assignment</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <TrendingUp size={16} />
                                    </div>
                                    <input
                                        name="assignment"
                                        defaultValue={editingTeacher?.assignment}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="e.g. Grade 3A, Counselor"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Employee ID Input Removed for Creation - Displays only if editing */}
                            {editingTeacher && (
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Employee ID</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                            <IdCard size={16} />
                                        </div>
                                        <input
                                            name="employeeId"
                                            defaultValue={editingTeacher?.id.replace(/^T-/, '')} // Ensure clean ID display if using T- prefix logic elsewhere
                                            disabled
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none transition-all text-sm font-medium opacity-70 cursor-not-allowed"
                                            placeholder="Auto-generated"
                                        />
                                    </div>
                                </div>
                            )}
                            {editingTeacher && (
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <select
                                            name="status"
                                            defaultValue={editingTeacher?.status.toLowerCase()}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium appearance-none"
                                        >
                                            <option value="active">Active</option>
                                            <option value="on leave">On Leave</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>

                        {!editingTeacher ? (
                            <button
                                type="button"
                                onClick={handleInvite}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-[#135bec] hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveOnly}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-[#135bec] hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeachersDirectory;
