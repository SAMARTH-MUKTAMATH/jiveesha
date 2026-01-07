import React, { useState } from 'react';
import {
    Download,
    Calendar,
    TrendingUp,
    AlertTriangle,
    AlertCircle,
    Clock,
    CheckCircle,
    Mic,
    Ear,
    Lightbulb,
    Wrench,
    ChevronDown,
    School
} from 'lucide-react';

interface ScreeningAnalyticsProps {
    onBack?: () => void;
    onNavigateToReports: () => void;
    onBuildCustomReport: () => void;
    user?: any;
}

interface FilterOptions {
    gender: string;
    ageGroup: string;
    socioEconomic: string;
    dateRange: string;
}

const ScreeningAnalytics: React.FC<ScreeningAnalyticsProps> = ({
    onNavigateToReports,
    onBuildCustomReport,
    user
}) => {
    const [filters] = useState<FilterOptions>({
        gender: 'All Genders',
        ageGroup: 'Age Group: 5-10',
        socioEconomic: 'Socio-economic Markers',
        dateRange: 'Last 30 Days'
    });

    const [presentationMode, setPresentationMode] = useState(false);

    // Helper for filter buttons
    const FilterButton = ({ value }: { label: string, value: string }) => (
        <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 hover:border-primary/50 transition-colors shadow-sm text-slate-600 dark:text-slate-300">
            <span className="text-sm font-medium">{value}</span>
            <ChevronDown size={18} />
        </button>
    );

    return (
        <div className={`flex flex-col w-full h-full ${presentationMode ? 'presentation-mode' : ''}`}>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">School Screening Analytics</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <School size={16} />
                        <p className="text-base font-medium">{user?.schoolProfile?.schoolName || 'School Dashboard'}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <p className="text-base">{new Date().getFullYear()} Statistics</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div
                        className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer select-none group"
                        onClick={() => setPresentationMode(!presentationMode)}
                    >
                        <div className={`w-9 h-5 rounded-full relative transition-colors ${presentationMode ? 'bg-[#135bec]' : 'bg-slate-200'} group-hover:bg-slate-300`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${presentationMode ? 'left-5' : 'left-1'}`}></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Presentation Mode</span>
                    </div>
                    <button
                        onClick={onNavigateToReports}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#135bec] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Download size={20} />
                        <span>Download Center</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
                <FilterButton label="Gender" value={filters.gender} />
                <FilterButton label="Age Group" value={filters.ageGroup} />
                <FilterButton label="Socio-economic" value={filters.socioEconomic} />

                <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 hover:border-primary/50 transition-colors shadow-sm text-slate-600 dark:text-slate-300 ml-auto">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{filters.dateRange}</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* KPI Card 1 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Screened</p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp size={14} /> +5%
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1,240</p>
                    <p className="text-xs text-slate-400 mt-1">Students processed this semester</p>
                </div>

                {/* KPI Card 2 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Completion Rate</p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp size={14} /> +2%
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">92%</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#135bec] h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                </div>

                {/* KPI Card 3 */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 flex flex-col gap-1 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <AlertTriangle size={120} className="text-amber-500" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Flags Raised</p>
                        <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp size={14} /> +1.5%
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 relative z-10">14%</p>
                    <p className="text-xs text-slate-400 mt-1 relative z-10">Requires further attention</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

                {/* 1. Trend Analysis (Spans 2 cols on large) */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trend Analysis</h3>
                            <p className="text-sm text-slate-500">Month-over-Month Screening Volume</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#135bec]">+12%</p>
                            <p className="text-xs text-slate-500">Growth vs Last Semester</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[250px] relative">
                        {/* Chart SVG */}
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 250">
                            {/* Grid Lines */}
                            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                            {/* Area Gradient */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Path */}
                            <path d="M0 180 C100 180, 150 100, 200 120 C250 140, 300 80, 400 90 C500 100, 550 40, 650 60 C750 80, 800 20, 800 20 V 250 H 0 V 180 Z" fill="url(#chartGradient)"></path>
                            <path d="M0 180 C100 180, 150 100, 200 120 C250 140, 300 80, 400 90 C500 100, 550 40, 650 60 C750 80, 800 20, 800 20" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                            {/* Data Points */}
                            <circle cx="200" cy="120" fill="white" r="4" stroke="#135bec" strokeWidth="2"></circle>
                            <circle cx="400" cy="90" fill="white" r="4" stroke="#135bec" strokeWidth="2"></circle>
                            <circle cx="650" cy="60" fill="white" r="4" stroke="#135bec" strokeWidth="2"></circle>
                        </svg>
                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-xs text-slate-400 font-medium mt-4 px-2">
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* 2. Section-wise Performance */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Section Performance</h3>
                    <p className="text-sm text-slate-500 mb-6">Completion % by Class</p>
                    <div className="flex items-end justify-between h-[200px] gap-2">
                        {/* Bars */}
                        {[
                            { label: "1A", height: "40%" },
                            { label: "1B", height: "70%" },
                            { label: "1C", height: "90%" },
                            { label: "2A", height: "55%" },
                            { label: "2B", height: "95%" },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative h-[150px] overflow-hidden">
                                    <div
                                        className="absolute bottom-0 w-full bg-blue-300 dark:bg-blue-800 transition-all duration-500 group-hover:bg-[#135bec]"
                                        style={{ height: item.height }}
                                    ></div>
                                </div>
                                <span className="text-xs font-bold text-slate-500 group-hover:text-[#135bec]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Identification Rate vs National */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Identification Rate</h3>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Benchmarking</span>
                    </div>
                    <div className="flex flex-col gap-6 mt-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.schoolProfile?.schoolName || 'Your School'}</span>
                                <span className="text-sm font-bold text-[#135bec]">14%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div className="bg-[#135bec] h-3 rounded-full relative" style={{ width: '65%' }}>
                                    <div className="absolute right-0 -top-1 h-5 w-0.5 bg-white"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">National Average</span>
                                <span className="text-sm font-bold text-slate-500">12%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div className="bg-slate-400 h-3 rounded-full relative" style={{ width: '55%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 bg-blue-50 dark:bg-slate-700/50 p-3 rounded-lg flex items-start gap-3">
                        <CheckCircle size={16} className="text-[#135bec] mt-0.5" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Your identification rate is slightly higher than the national average, indicating robust screening sensitivity.</p>
                    </div>
                </div>

                {/* 4. Aggregated Diagnostic Status (Donut) */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic Status</h3>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Lock Anonymized Data
                        </p>
                    </div>
                    <div className="relative size-48 mt-4">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background Circle */}
                            <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                            {/* Segment 1 (Blue) */}
                            <path className="text-[#135bec]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="40, 100" strokeWidth="3.8"></path>
                            {/* Segment 2 (Purple) */}
                            <path className="text-indigo-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-40" strokeWidth="3.8"></path>
                            {/* Segment 3 (Teal) */}
                            <path className="text-teal-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-65" strokeWidth="3.8"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">174</span>
                            <span className="text-xs text-slate-500">Flags</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-6 w-full px-2">
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-[#135bec]"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Speech (40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-indigo-400"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Hearing (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-teal-400"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Vision (15%)</span>
                        </div>
                    </div>
                </div>

                {/* 5. Screening Completion Lag-time */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Completion Lag-time</h3>
                        <button className="text-[#135bec] text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 flex items-center justify-center font-bold text-xs">4B</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Grade 4B</p>
                                    <p className="text-xs text-red-500 font-medium">14 days behind</p>
                                </div>
                            </div>
                            <AlertCircle size={20} className="text-red-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 flex items-center justify-center font-bold text-xs">3A</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Grade 3A</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">5 days behind</p>
                                </div>
                            </div>
                            <Clock size={20} className="text-amber-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 flex items-center justify-center font-bold text-xs shadow-sm">1A</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Grade 1A</p>
                                    <p className="text-xs text-emerald-600 font-medium">On Schedule</p>
                                </div>
                            </div>
                            <CheckCircle size={20} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* 6. Resource Needs Report */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Resource Needs</h3>
                    <p className="text-sm text-slate-500 mb-4">Allocations based on flags</p>
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#135bec]">
                                <Mic size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Speech Therapist</p>
                                <p className="text-xs text-slate-500">High demand in Grade 1</p>
                            </div>
                            <button className="bg-[#135bec]/10 hover:bg-[#135bec] hover:text-white text-[#135bec] text-xs font-bold px-3 py-1.5 rounded transition-colors">
                                Allocate
                            </button>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                            <div className="size-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Ear size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Audiologist</p>
                                <p className="text-xs text-slate-500">Moderate demand</p>
                            </div>
                            <button className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded transition-colors">
                                Review
                            </button>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-xs font-medium">
                                <Lightbulb size={16} />
                                <span>Suggestion: Hire 1 part-time speech therapist.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Report Builder CTA */}
            <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                {/* Abstract decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#135bec]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -ml-12 -mb-12"></div>

                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">Need specific insights?</h2>
                    <p className="text-slate-400 max-w-lg">Use the Custom Report Builder to filter by unique parameters and generate tailored PDFs for your next board meeting.</p>
                </div>
                <button
                    onClick={onBuildCustomReport}
                    className="relative z-10 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                    <Wrench size={20} />
                    Build Custom Report
                </button>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                <p className="text-sm text-slate-400">© 2023 Daira Education Platform. All rights reserved. <br className="hidden md:inline" />Strictly confidential. FERPA/HIPAA Compliant.</p>
            </footer>

        </div>
    );
};

export default ScreeningAnalytics;
