
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, FolderOpen, Calendar,
  Video, FileText, MessageSquare, Plus, ArrowRight,
  TrendingUp, BookOpen, Settings
} from 'lucide-react';
import { apiClient } from '../services/api';

interface DashboardProps {
  onManageCredentials?: () => void;
  onEditProfile?: () => void;
  onPatientClick?: (id: string) => void;
  onMessagesClick?: () => void;
  onTriageClick?: () => void;
  onScheduleClick?: () => void;
  onNewPatient?: () => void;
  onEditPatientConsent?: (patientId: string) => void;
}

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  pendingConsents: number;
  urgentAlerts: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onManageCredentials, onEditProfile, onPatientClick, onMessagesClick, onTriageClick, onScheduleClick, onNewPatient, onEditPatientConsent }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    pendingConsents: 0,
    urgentAlerts: 0
  });
  const [worklist, setWorklist] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Watch for changes in localStorage (when returning from settings)
  useEffect(() => {
    const handleStorageChange = () => {

      const cachedUser = localStorage.getItem('user');
      const updatedAt = localStorage.getItem('updatedAt');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);

          setUser(parsedUser);
          // Force a refresh if profile was recently updated
          if (updatedAt) {
            const updateTime = new Date(updatedAt).getTime();
            const now = new Date().getTime();
            if (now - updateTime < 10000) { // Updated within last 10 seconds
              console.log('[Dashboard] Recent update detected, refreshing...');
              setRefreshKey(prev => prev + 1);
            }
          }
        } catch (e) {
          console.error('Failed to parse cached user');
        }
      }
    };

    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('[Dashboard] Profile update event received:', event.detail);
      setUser(event.detail);
      setRefreshKey(prev => prev + 1);
    };

    const handlePatientAdded = () => {
      console.log('✅ [Dashboard] "patientAdded" event received! Triggering refresh...');
      // Force re-fetch by updating refreshKey
      setRefreshKey(prev => prev + 1);
      // Also manually call fetch to be sure
      fetchDashboardData();
    };

    // Check immediately on mount
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('patientAdded', handlePatientAdded as EventListener);
    // Also check on component visibility change (when coming back from another view)
    window.addEventListener('visibilitychange', handleStorageChange);
    // Check on focus (when returning to tab)
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('patientAdded', handlePatientAdded as EventListener);
      window.removeEventListener('visibilitychange', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Set mock token for testing (since auth is bypassed)
      if (!localStorage.getItem('access_token')) {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6ImNsaW5pY2lhbiJ9.test';
        localStorage.setItem('access_token', mockToken);
      }

      // Fetch user profile
      const userResponse = await apiClient.getMe();
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
        // Sync to localStorage and notify other components
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: userResponse.data }));
      }

      // Fetch dashboard stats
      // Fetch fresh patients list for real-time stats (more reliable than stats endpoint for now)
      const patientsRes = await apiClient.getPatients();

      let total = 0;
      let active = 0;

      if (patientsRes.success && patientsRes.data) {
        // Handle both response structures just in case (api.ts says it returns { patients: [] })
        const patientsList = Array.isArray(patientsRes.data) ? patientsRes.data : patientsRes.data.patients;

        if (Array.isArray(patientsList)) {
          // Log first patient to see structure
          if (patientsList.length > 0) {
            console.log('[Dashboard] First patient sample:', patientsList[0]);
          }

          total = patientsList.length;

          const checkStatus = (p: any, statusType: string) => {
            const val = (p.case_status || p.caseStatus || p.status || '').toLowerCase();
            return val === statusType;
          };

          active = patientsList.filter((p: any) => checkStatus(p, 'active') || checkStatus(p, 'pending')).length;

          // Calculate pending consents specifically
          const pending = patientsList.filter((p: any) => checkStatus(p, 'pending')).length;

          console.log(`[Dashboard] Real-time stats: ${total} total, ${active} active, ${pending} pending consents`);

          setStats(prev => ({
            ...prev,
            totalPatients: total,
            activePatients: active,
            pendingConsents: pending
          }));
        }
      } else {
        // Fallback to stats endpoint if patients list fails
        const statsRes = await apiClient.getDashboardStats();
        if (statsRes.success && statsRes.data) {
          total = statsRes.data.total_patients || 0;
          active = statsRes.data.active_patients || 0;
        }
      }

      setStats(prev => ({
        ...prev,
        totalPatients: total,
        activePatients: active,
      }));


      // Fetch pending tasks for worklist
      const tasksRes = await apiClient.getPendingTasks();
      if (tasksRes.success && tasksRes.data) {
        // Handle flat array from backend
        if (Array.isArray(tasksRes.data)) {
          // Extract upcoming appointments first
          const upcoming = tasksRes.data
            .filter((t: any) => t.type === 'upcoming_appointment')
            .map((t: any) => ({
              id: t.id,
              patientId: t.personId || t.patientId || t.person_id || t.patient_id,
              patient: t.title?.replace(/^Appointment with /, ''),
              type: 'Appointment',
              date: t.date,
              time: t.date ? new Date(t.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD', // Format time from date
              format: 'In-person', // Default since tasks doesn't have format
              active: false
            }));

          setUpcomingSchedule(upcoming);

          // Filter for worklist (excluding appointments)
          const mappedTasks = tasksRes.data.map((task: any) => {
            // Map based on task type
            switch (task.type) {
              case 'new_patient_review':
                return {
                  id: task.id,
                  patientId: task.personId || task.patientId || task.person_id || task.patient_id,
                  priority: 'HIGH',
                  priorityColor: 'bg-red-100 text-red-600',
                  name: task.title,
                  task: 'NEW PATIENT',
                  due: 'Action Required',
                  action: 'Review',
                  isReview: true
                };
              case 'credential_verification':
                return {
                  id: task.id,
                  patientId: '',
                  priority: 'HIGH',
                  priorityColor: 'bg-red-100 text-red-600',
                  name: task.title,
                  task: 'CREDENTIAL',
                  due: 'Pending',
                  action: 'Verify'
                };
              case 'incomplete_assessment':
                return {
                  id: task.id,
                  patientId: task.personId || task.patientId || task.person_id || task.patient_id,
                  priority: 'MEDIUM',
                  priorityColor: 'bg-amber-100 text-amber-600',
                  name: task.title,
                  task: 'ASSESSMENT',
                  due: 'In Progress',
                  action: 'Continue'
                };
              // Upcoming appointments are handled separately above
              default:
                return null;
            }
          }).filter(Boolean); // Remove nulls

          setWorklist(mappedTasks);
        } else {
          setWorklist([]);
        }
      }

      // Fetch today's schedule
      const scheduleRes = await apiClient.getTodaySchedule();
      if (scheduleRes.success && scheduleRes.data) {
        const mappedSchedule = scheduleRes.data.map((apt: any) => ({
          id: apt.id,
          patientId: apt.personId || apt.person_id || apt.patientId || apt.patient_id,
          time: apt.startTime || apt.start_time,
          patient: apt.patientName || apt.patient_name,
          type: apt.appointmentType || apt.appointment_type || 'Appointment',
          format: apt.format || 'In-person',
          location: apt.locationId || apt.location,
          status: apt.status,
          active: apt.status === 'in_progress'
        }));
        setSchedule(mappedSchedule);

        // Update the KPI dashboard stat for today's appointments
        setStats(prev => ({
          ...prev,
          todayAppointments: mappedSchedule.length
        }));
      }

      // Fetch recent activity
      const activityRes = await apiClient.getRecentActivity();
      if (activityRes.success && activityRes.data) {
        setRecentActivity(activityRes.data.map((act: any) => ({
          id: act.resource_id || act.id,
          color: getActivityColor(act.action),
          title: act.details || act.description || act.action,
          time: formatRelativeTime(new Date(act.created_at)),
          detail: act.description,
          action: getActivityAction(act.resource_type)
        })));
      }


    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  // Helper functions
  const getActivityColor = (action: string) => {
    const colors: Record<string, string> = {
      'USER_LOGIN': 'bg-blue-500',
      'PATIENT_CREATED': 'bg-green-500',
      'PATIENT_UPDATED': 'bg-purple-500',
      'APPOINTMENT_CREATED': 'bg-amber-500',
      'SESSION_CREATED': 'bg-teal-500'
    };
    return colors[action] || 'bg-slate-400';
  };

  const getActivityAction = (resourceType: string | null) => {
    if (resourceType === 'patient') return 'View Patient';
    if (resourceType === 'appointment') return 'View Appointment';
    return 'View Details';
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Get logged-in user info with photo handling

  const rawUserName = user?.profile?.firstName || user?.profile?.first_name || 'Doctor';
  const userName = rawUserName.replace(/^Dr\.\s+/i, '');
  const userTitle = user?.profile?.professionalTitle || user?.profile?.professional_title || 'Healthcare Professional';
  const userSeed = user?.profile?.first_name || user?.profile?.firstName || 'User';

  // Get profile photo - check localStorage first, then API, then fallback to generated avatar
  const getProfilePhoto = () => {
    const storedPhoto = localStorage.getItem('clinician_photo');
    const apiPhoto = user?.profile?.photo_url;

    if (storedPhoto && storedPhoto.startsWith('data:')) {
      return storedPhoto;
    }
    if (apiPhoto && apiPhoto !== 'photo_exists' && apiPhoto.startsWith('http')) {
      return apiPhoto;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`;
  };

  const handleCompleteTask = async (task: any) => {
    if (task.isReview && task.patientId) {
      // Open Patient Onboarding consent step for this patient
      if (onEditPatientConsent) {
        onEditPatientConsent(task.patientId);
      }
    } else {
      // Default action
      if (task.patientId) onPatientClick?.(task.patientId);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="w-full bg-gradient-to-r from-[#F0F7FF] to-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good morning, Dr. {userName}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onManageCredentials}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors"
              >
                <CheckCircle2 size={14} /> ✓ Verified • {userTitle}
              </button>
              <span className="text-sm text-slate-400 font-medium">Last active: Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { id: 'consents', icon: <Clock size={20} />, value: String(stats.pendingConsents || 0), label: 'Pending Consents', sub: 'Awaiting approval', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', urgency: stats.pendingConsents > 0 ? 'Orange' : undefined },
            { id: 'active', icon: <FolderOpen size={20} />, value: String(stats.activePatients || stats.totalPatients || 0), label: 'Active Cases', sub: `${stats.totalPatients} total patients`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { id: 'schedule', icon: <Calendar size={20} />, value: String(stats.todayAppointments || 0), label: "Appointments", sub: 'View schedule', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', action: onScheduleClick },
          ].map((kpi) => (
            <div
              key={kpi.id}
              onClick={kpi.action}
              className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group ${kpi.action ? 'hover:border-blue-300 ring-4 ring-transparent hover:ring-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  {kpi.icon}
                </div>
                {kpi.urgency && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${kpi.id === 'alerts' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    Critical
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className="text-sm font-bold text-slate-800">{kpi.label}</div>
                <div className="text-xs text-slate-400 font-medium">{kpi.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-Column Content */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column (70%) */}
          <div className="flex-1 space-y-8 min-w-0">

            {/* Daily Worklist */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-slate-900">Daily Worklist</h2>
                  <div className="flex gap-2">
                    {[`All (${worklist.length})`, `High Priority (${worklist.filter(w => w.priority === 'HIGH').length})`, `Due Today (${worklist.length})`].map((f, i) => (
                      <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-[#2563EB] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-400 font-medium">Prioritized tasks for today</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Task Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Time</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {worklist.length > 0 ? (
                      worklist.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.priorityColor}`}>
                              {row.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPatientClick?.(row.patientId || row.id)}>
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                {row.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800 hover:text-[#2563EB]">{row.name}</div>
                                {row.age && <div className="text-[11px] text-slate-400 font-semibold uppercase">{row.age}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.task}</td>
                          <td className={`px-6 py-4 text-sm font-bold ${row.priority === 'HIGH' ? 'text-red-500' : 'text-slate-500'}`}>{row.due}</td>
                          <td className="px-6 py-4 text-right">
                            {row.isReview ? (
                              <button
                                onClick={() => handleCompleteTask(row)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg hover:bg-green-100 hover:text-green-700 transition-all border border-amber-200 hover:border-green-200"
                              >
                                Pending
                              </button>
                            ) : (
                              <button
                                onClick={() => onPatientClick?.(row.patientId || row.id)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-lg hover:bg-[#2563EB] hover:text-white transition-all"
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 size={32} className="text-green-500" />
                            <p className="text-sm font-bold text-slate-600">All caught up!</p>
                            <p className="text-xs text-slate-400">No pending tasks at the moment</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-[#2563EB] uppercase tracking-widest border-t border-slate-50 transition-colors">
                View All Tasks
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                <select className="text-xs font-bold text-slate-400 border-none bg-transparent focus:ring-0 uppercase tracking-wider outline-none">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                </select>
              </div>

              <div className="space-y-10 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />

                {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className={`w-4 h-4 rounded-full ${act.color} ring-4 ring-white shrink-0 mt-1`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{act.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{act.detail}</p>
                      <button onClick={() => act.id && onPatientClick?.(act.id)} className="text-[11px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest mt-2">{act.action}</button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-sm text-slate-400">
                    No recent activity to show
                  </div>
                )}
              </div>
              <button className="w-full mt-10 text-xs font-bold text-slate-400 hover:text-[#2563EB] uppercase tracking-widest transition-colors">
                View All Activity
              </button>
            </div>

            {/* Quick Resources Card */}
            <div className="bg-[#2563EB] rounded-3xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen size={20} /> Quick Resources
              </h2>
              <ul className="space-y-3">
                {['DSM-5 Criteria', 'ISAA Manual', 'IEP Templates', 'Assessment Protocols'].map((r, i) => (
                  <li key={i}>
                    <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group text-sm font-semibold">
                      {r} <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="w-full lg:w-[320px] space-y-8">

            {/* Today's Schedule Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="px-2 py-1 text-[10px] font-bold bg-white text-slate-800 rounded shadow-sm">Day</button>
                  <button className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">Week</button>
                </div>
              </div>
              {/* Date Header - Compact */}
              <div className="flex items-center gap-3 mb-4 bg-slate-50 py-2 px-3 rounded-xl border border-slate-100">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-[#2563EB] border border-slate-100">
                  <Calendar size={16} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-black text-slate-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="space-y-2">
                {[...schedule, ...upcomingSchedule].length > 0 ? (
                  <>
                    {/* Today's Items */}
                    {schedule.map((item, i) => (
                      <div key={`today-${i}`} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all bg-white">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                            <span className="text-[10px] font-bold uppercase">{item.time?.includes(' ') ? item.time.split(' ')[1] : 'AM'}</span>
                            <span className="text-sm font-black">{item.time?.includes(' ') ? item.time.split(' ')[0] : (item.time || '--:--')}</span>
                          </div>
                          <div>
                            <div onClick={() => onPatientClick?.(item.patientId)} className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600">{item.patient}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                              {item.active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                              TODAY • {item.type}
                            </div>
                          </div>
                        </div>
                        <button className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:border group-hover:border-blue-200 group-hover:text-blue-600'}`}>
                          {item.active ? 'Join' : 'View'}
                        </button>
                      </div>
                    ))}

                    {/* Upcoming Items */}
                    {upcomingSchedule.map((item, i) => (
                      <div key={`up-${i}`} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span className="text-sm font-black text-slate-700">{new Date(item.date).getDate()}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-700">{item.patient}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.time} • {item.type}</div>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200">
                          Prior
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-sm font-bold text-slate-400">No appointments scheduled</p>
                    <p className="text-[10px] font-medium text-slate-300 mt-1">Check back later or add new</p>
                  </div>
                )}
              </div>
              <button onClick={onScheduleClick} className="w-full mt-6 text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-widest">View Full Calendar</button>
            </div>

            {/* Messages Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Messages</h2>
              </div>

              <div className="space-y-4">
                {/* Placeholder for real messages integration */}
                <div className="text-center py-6 text-sm text-slate-400">
                  No new messages
                </div>
              </div>
              <button onClick={onMessagesClick} className="w-full mt-6 text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-widest">View All Messages</button>
            </div>

            {/* Case Stats Mini Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Your Cases</h2>
              <div className="flex items-center justify-center mb-6 relative">
                <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 relative">
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 60%, 50% 50%)' }} />
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 30%, 50% 50%)' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{stats.totalPatients || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Active</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Active Cases', val: stats.activePatients, color: 'bg-green-500' },
                  { label: 'Today\'s Appointments', val: stats.todayAppointments, color: 'bg-blue-500' },
                  { label: 'Pending Tasks', val: worklist.length, color: 'bg-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                      <span className="font-semibold text-slate-600">{stat.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">{stat.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                View Patient Registry
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Bottom Quick Stats Bar */}
      <div className="sticky bottom-0 w-full h-14 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40 hidden md:block">
        <div className="max-w-[1440px] mx-auto h-full px-12 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span className="text-slate-500">This Week: <span className="text-[#2563EB]">12 assessments completed</span></span>
            <span className="text-slate-200">|</span>
            <span>5 IEPs created</span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-green-500" /> 89% goal achievement rate</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Avg. response time: 2.5 hrs</span>
            <button className="text-slate-300 hover:text-slate-500"><Settings size={14} /></button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
