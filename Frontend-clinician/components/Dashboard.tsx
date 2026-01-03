
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, FolderOpen, Calendar,
  Video, FileText, MessageSquare, Plus, ArrowRight,
  TrendingUp, BookOpen, Settings
} from 'lucide-react';
import { apiClient } from '../services/api';

interface DashboardProps {
  onManageCredentials?: () => void;
  onPatientClick?: (id: string) => void;
  onMessagesClick?: () => void;
  onTriageClick?: () => void;
  onScheduleClick?: () => void;
  onNewPatient?: () => void;
}

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  pendingConsents: number;
  urgentAlerts: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onManageCredentials, onPatientClick, onMessagesClick, onTriageClick, onScheduleClick, onNewPatient }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    pendingConsents: 0,
    urgentAlerts: 0
  });
  const [worklist, setWorklist] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await apiClient.getDashboardStats();
        if (statsRes.success && statsRes.data) {
          // Map snake_case from API to camelCase
          setStats({
            totalPatients: statsRes.data.total_patients || 0,
            activePatients: statsRes.data.active_patients || 0,
            todayAppointments: statsRes.data.today_appointments || 0,
            pendingConsents: statsRes.data.pending_credentials || 0,
            urgentAlerts: 0 // No triage system yet
          });
        }

        // Fetch pending tasks for worklist
        const tasksRes = await apiClient.getPendingTasks();
        if (tasksRes.success && tasksRes.data) {
          setWorklist(tasksRes.data.map((task: any) => ({
            id: task.id,
            patientId: task.patient_id, // Use actual patient_id from API
            priority: task.priority === 'high' ? 'HIGH' : task.priority === 'medium' ? 'MEDIUM' : 'LOW',
            priorityColor: task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600',
            name: task.title,
            task: task.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            due: task.date ? new Date(task.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Today',
            action: task.type === 'upcoming_appointment' ? 'View' : 'Start'
          })));
        }

        // Fetch today's schedule
        const scheduleRes = await apiClient.getTodaySchedule();
        if (scheduleRes.success && scheduleRes.data) {
          setSchedule(scheduleRes.data.map((apt: any) => ({
            id: apt.id,
            patientId: apt.patient_id,
            time: apt.start_time,
            patient: apt.patient_name,
            type: apt.appointment_type || 'Appointment',
            format: apt.format || 'In-person',
            location: apt.location,
            status: apt.status,
            active: apt.status === 'in_progress'
          })));
        }

        // Fetch recent activity
        const activityRes = await apiClient.getRecentActivity();
        if (activityRes.success && activityRes.data) {
          setRecentActivity(activityRes.data.map((act: any) => ({
            id: act.resource_id || act.id,
            color: getActivityColor(act.action),
            title: act.description || act.action,
            time: formatRelativeTime(new Date(act.created_at)),
            detail: `${act.resource_type || ''} ${act.action}`.trim(),
            action: getActivityAction(act.resource_type)
          })));
        }

        // Fallback: If no tasks from API, fetch patients directly
        if (!tasksRes.data?.length) {
          const patientsRes = await apiClient.getPatients({ limit: 4 });
          if (patientsRes.success && patientsRes.data?.patients) {
            setWorklist(patientsRes.data.patients.map((p: any) => ({
              id: p.id,
              patientId: p.id,
              priority: 'MEDIUM',
              priorityColor: 'bg-amber-100 text-amber-600',
              name: p.full_name || `${p.first_name} ${p.last_name}`,
              age: p.age ? `${p.age} yrs` : '',
              task: 'Review Patient',
              due: 'Today',
              action: 'View'
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Get logged-in user info
  const getStoredUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  };
  const user = getStoredUser();
  const userName = user?.profile?.first_name || 'Doctor';
  const userTitle = user?.profile?.professional_title || 'Healthcare Professional';
  const userSeed = user?.profile?.first_name || 'User';

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
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <button className="text-sm font-bold text-[#2563EB] hover:underline">Edit Profile</button>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-blue-50">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`} alt={`Dr. ${userName}`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { id: 'consents', icon: <Clock size={20} />, value: String(stats.pendingConsents || 0), label: 'Pending Consents', sub: 'Awaiting approval', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', urgency: stats.pendingConsents > 0 ? 'Orange' : undefined },
            { id: 'alerts', icon: <AlertTriangle size={20} className="animate-pulse" />, value: String(stats.urgentAlerts || 0), label: 'Triage Alerts', sub: 'Urgent attention required', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', urgency: stats.urgentAlerts > 0 ? 'Red' : undefined, action: onTriageClick },
            { id: 'active', icon: <FolderOpen size={20} />, value: String(stats.activePatients || stats.totalPatients || 0), label: 'Active Cases', sub: `${stats.totalPatients} total patients`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { id: 'schedule', icon: <Calendar size={20} />, value: String(stats.todayAppointments || 0), label: "Today's Appointments", sub: 'View schedule', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', action: onScheduleClick },
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
                    {worklist.length > 0 ? worklist.map((row, i) => (
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
                          <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-lg hover:bg-[#2563EB] hover:text-white transition-all">
                            {row.action}
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                          No pending tasks. You're all caught up!
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

            {/* Quick Actions Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'New Patient', icon: <Plus size={18} />, primary: true, onClick: onNewPatient },
                { label: 'Generate Report', icon: <FileText size={18} /> },
                { label: 'Schedule', icon: <Calendar size={18} />, onClick: onScheduleClick },
                { label: 'Clinical resources', icon: <BookOpen size={18} /> },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${btn.primary ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'}`}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>

              <div className="space-y-4">
                {schedule.length > 0 ? schedule.map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 bg-slate-50/50 ${item.active ? 'border-blue-500 bg-blue-50/30' : item.format === 'video_call' ? 'border-green-400' : 'border-slate-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                      {item.format === 'video_call' && <Video size={14} className="text-green-600" />}
                    </div>
                    <div onClick={() => onPatientClick?.(item.patientId)} className="text-sm font-bold text-slate-800 cursor-pointer hover:text-[#2563EB]">{item.patient}</div>
                    <div className="text-xs font-medium text-slate-500 mb-3">{item.type}</div>
                    <div className="flex flex-wrap gap-2">
                      <button className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.active ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                        {item.format === 'video_call' ? 'Join Call' : 'Start'}
                      </button>
                      <button className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase">Notes</button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-sm text-slate-400">
                    No appointments scheduled for today
                  </div>
                )}
              </div>
              <button onClick={onScheduleClick} className="w-full mt-6 text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-widest">View Full Calendar</button>
            </div>

            {/* Messages Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">2 new</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Mrs. Kumar', sub: 'Question about therapy schedule', msg: 'Hi Dr. Rivera, I wanted to ask if...', time: '1 hr ago', unread: true },
                  { name: 'Mr. Sharma', sub: 'Progress update', msg: 'Thank you for the detailed report...', time: 'Yesterday' },
                ].map((msg, i) => (
                  <div key={i} onClick={onMessagesClick} className={`p-3 rounded-xl border transition-all cursor-pointer ${msg.unread ? 'bg-blue-50/50 border-blue-100' : 'border-transparent hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${msg.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{msg.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{msg.time}</span>
                    </div>
                    <p className={`text-xs truncate ${msg.unread ? 'font-bold text-slate-700' : 'text-slate-500'}`}>{msg.sub}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.msg}</p>
                  </div>
                ))}
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

            {/* Resources Card */}
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
    </div>
  );
};

export default Dashboard;
