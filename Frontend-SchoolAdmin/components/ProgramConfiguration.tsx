import React, { useState } from 'react';
import {
    Sliders,
    Save,
    Shield,
    ShieldAlert,
    Lock,
    School,
    Edit2,
    Eye,
    ClipboardCheck,
    BrainCircuit,
    AlertTriangle,
    History,
    RotateCcw,
    Calendar,
    Wrench,
    CheckCircle
} from 'lucide-react';

interface ProgramConfigurationProps {
    onBack: () => void;
    onNavigateToConsent?: () => void;
    onViewAuditLog?: () => void;
    user?: any;
}

interface PhaseConfig {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

const ProgramConfiguration: React.FC<ProgramConfigurationProps> = ({ onNavigateToConsent, onViewAuditLog, user }) => {
    // State for Phases
    const [phases, setPhases] = useState<PhaseConfig[]>([
        { id: '1', name: 'Phase 1', description: 'Initial Screen', active: true },
        { id: '2', name: 'Phase 2', description: 'Observation', active: true },
        { id: '3', name: 'Phase 3', description: 'Deep Dive', active: true },
        { id: '4', name: 'Phase 4', description: 'Assessment', active: true },
    ]);

    // State for other settings
    const [gradeStart, setGradeStart] = useState('Kindergarten');
    const [gradeEnd, setGradeEnd] = useState('Grade 5');
    const [languages, setLanguages] = useState(['English', 'Spanish']);
    const [newLanguage, setNewLanguage] = useState('');
    const [currentTerm, setCurrentTerm] = useState('Fall 2023 - Spring 2024');
    const [cutoffDate, setCutoffDate] = useState('2024-05-30');

    const togglePhase = (id: string) => {
        setPhases(phases.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const addLanguage = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newLanguage.trim()) {
            if (!languages.includes(newLanguage.trim())) {
                setLanguages([...languages, newLanguage.trim()]);
            }
            setNewLanguage('');
        }
    };

    const removeLanguage = (lang: string) => {
        setLanguages(languages.filter(l => l !== lang));
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-40 py-8">

            {/* Page Title & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wide">System Admin</span>
                        <span className="material-symbols-outlined text-slate-400 text-xs">chevron_right</span>
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800 uppercase tracking-wide">Configuration</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Program Configuration</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Sliders size={16} />
                        <p className="text-base font-medium">Screening Governance & Rules Engine</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onNavigateToConsent}
                        className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold border border-indigo-200 shadow-sm transition-all text-sm"
                    >
                        <CheckCircle size={20} />
                        <span>Consent & Compliance</span>
                    </button>
                    <button onClick={onViewAuditLog} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 hover:bg-slate-50 transition-all shadow-sm text-slate-600 dark:text-slate-300 font-semibold" title="View Audit Log">
                        <History size={18} />
                        <span className="hidden md:inline">Audit Log</span>
                    </button>
                    <button
                        onClick={() => console.log('Save Changes')}
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 hover:bg-primary-dark transition-all shadow-md font-bold"
                    >
                        <Save size={18} />
                        <span>Save Configuration</span>
                    </button>
                    <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 hover:text-red-600 hover:border-red-200 transition-all shadow-sm text-slate-600 dark:text-slate-300 font-semibold" title="Reset All">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column (Settings & Roles) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Screening Program Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-primary p-2 rounded-lg">
                                    <Wrench size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Screening Program Settings</h3>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Enabled Phases */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Enabled Phases</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {phases.map((phase) => (
                                        <div
                                            key={phase.id}
                                            className={`border rounded-lg p-4 flex items-center justify-between transition-colors bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer ${phase.active ? 'border-blue-200' : 'border-slate-200 dark:border-slate-700'}`}
                                            onClick={() => togglePhase(phase.id)}
                                        >
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{phase.name}</p>
                                                <p className="text-xs text-slate-500">{phase.description}</p>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${phase.active ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${phase.active ? 'translate-x-5' : ''}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Grade Range */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Grade Range Covered</label>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={gradeStart}
                                        onChange={(e) => setGradeStart(e.target.value)}
                                        className="form-select block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm py-2.5"
                                    >
                                        <option>Kindergarten</option>
                                        <option>Grade 1</option>
                                        <option>Grade 2</option>
                                    </select>
                                    <span className="text-slate-400">to</span>
                                    <select
                                        value={gradeEnd}
                                        onChange={(e) => setGradeEnd(e.target.value)}
                                        className="form-select block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm py-2.5"
                                    >
                                        <option>Grade 5</option>
                                        <option>Grade 6</option>
                                        <option>Grade 8</option>
                                    </select>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5">Students outside this range will be flagged as exceptions.</p>
                            </div>

                            {/* Language Options */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language Options</label>
                                <div className="relative">
                                    <div className="flex flex-wrap gap-2 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 min-h-[42px]">
                                        {languages.map((lang) => (
                                            <span key={lang} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${lang === 'English' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                {lang} {lang === 'English' && '(Default)'}
                                                <button
                                                    className={`ml-1 focus:outline-none ${lang === 'English' ? 'text-blue-500 hover:text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                                                    type="button"
                                                    onClick={() => removeLanguage(lang)}
                                                >×</button>
                                            </span>
                                        ))}
                                        <input
                                            className="flex-1 border-none focus:ring-0 p-0 text-sm min-w-[100px] bg-transparent outline-none"
                                            placeholder="Add language..."
                                            type="text"
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            onKeyDown={addLanguage}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5">Includes regional dialect support.</p>
                            </div>

                            {/* Academic Calendar */}
                            <div className="col-span-1 md:col-span-2 border-t border-slate-100 dark:border-slate-700 pt-6 mt-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Academic Calendar & Deadlines</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Current Term</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <Calendar size={18} />
                                            </span>
                                            <input
                                                className="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm py-2.5 dark:bg-slate-800 dark:border-slate-600"
                                                type="text"
                                                value={currentTerm}
                                                onChange={(e) => setCurrentTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Hard Cut-off Date</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <Calendar size={18} />
                                            </span>
                                            <input
                                                className="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm py-2.5 dark:bg-slate-800 dark:border-slate-600"
                                                type="date"
                                                value={cutoffDate}
                                                onChange={(e) => setCutoffDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roles & Permissions */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 p-2 rounded-lg">
                                    <Shield size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Roles & Permissions</h3>
                            </div>
                            <button className="text-sm text-primary hover:text-blue-700 font-medium" onClick={() => console.log('Manage Users')}>Manage Users</button>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-900/30 text-xs text-slate-500 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-700">Role</th>
                                        <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-700">Access Level</th>
                                        <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-700">Key Permissions</th>
                                        <th className="px-6 py-3 border-b border-slate-100 dark:border-slate-700"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert size={16} className="text-slate-400" />
                                                School Admin
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-bold">Full Access</span></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Configure Program, Manage Users, View All Data</td>
                                        <td className="px-6 py-4 text-right"><Lock size={16} className="text-slate-300" /></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <School size={16} className="text-slate-400" />
                                                Teacher
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-bold">Facilitator</span></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Conduct Screenings, View Assigned Students</td>
                                        <td className="px-6 py-4 text-right"><Edit2 size={16} className="text-primary cursor-pointer hover:bg-slate-100 p-1 rounded" onClick={() => console.log('Edit Role')} /></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-slate-400" />
                                                Specialist
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded font-bold">View-Only</span></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Review Flagged Cases, Add Notes</td>
                                        <td className="px-6 py-4 text-right"><Edit2 size={16} className="text-primary cursor-pointer hover:bg-slate-100 p-1 rounded" onClick={() => console.log('Edit Role')} /></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <ClipboardCheck size={16} className="text-slate-400" />
                                                Data Auditor
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-bold">Audit</span></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">View Logs, Export Reports, No Edits</td>
                                        <td className="px-6 py-4 text-right"><Edit2 size={16} className="text-primary cursor-pointer hover:bg-slate-100 p-1 rounded" onClick={() => console.log('Edit Role')} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (Rules & Warning) */}
                <div className="flex flex-col gap-6">

                    {/* Threshold & Logic Rules */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-fit">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 p-2 rounded-lg">
                                    <BrainCircuit size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Threshold & Logic Rules</h3>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 text-xs text-slate-500 flex gap-2 items-start border border-slate-100 dark:border-slate-700">
                                <Lock size={14} className="mt-0.5" />
                                <p>These rules define the automated progression of students. Edits are restricted to Admins and require a logged reason.</p>
                            </div>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Phase 4 Pass Threshold</p>
                                        <p className="text-xs text-slate-500">Minimum score to clear screening</p>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded">80%</span>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-700" />
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Grade Downgrade Rule</p>
                                        <p className="text-xs text-slate-500">If student struggles in current grade</p>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded">-2 Grades</span>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-700" />
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Grade Recovery Rule</p>
                                        <p className="text-xs text-slate-500">If student excels in lower grade</p>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded">+1 Grade</span>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-700" />
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Referral Trigger</p>
                                        <p className="text-xs text-slate-500">Conditions for specialist referral</p>
                                    </div>
                                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 px-3 py-1 rounded text-xs">2x Fail</span>
                                </div>
                            </div>
                            <button
                                onClick={() => console.log('Request Rule Change')}
                                className="w-full mt-2 flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 py-2 rounded-lg transition-colors border border-dashed border-slate-300 dark:border-slate-600"
                            >
                                <Edit2 size={18} />
                                <span className="text-sm font-semibold">Request Rule Change</span>
                            </button>
                        </div>
                    </div>

                    {/* Governance Warning */}
                    <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
                        <div className="flex gap-4">
                            <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                            <div>
                                <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">Governance Warning</h4>
                                <p className="text-sm text-red-900 dark:text-red-100 leading-relaxed">
                                    Changes to program rules affect <strong>all future screenings</strong> immediately. Every modification is immutable and recorded in the permanent audit review log for compliance verification.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-slate-500 italic">Configuration Version 2.4.1 — Last updated by {user?.name || 'Admin'} on {new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} Daira Education Platform. All rights reserved. <br className="hidden md:inline" />Strictly confidential. FERPA/HIPAA Compliant.</p>
                </div>
            </footer>

        </div>
    );
};

export default ProgramConfiguration;
