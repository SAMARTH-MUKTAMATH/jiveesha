
import React, { useState, useEffect } from 'react';
import {
   User, Shield, Clock, Bell, Lock, Eye, Globe,
   CreditCard, AlertTriangle, Camera, CheckCircle2,
   MapPin, Calendar, Smartphone, Mail, ChevronRight,
   Download, Upload, RefreshCw, Printer, LogOut,
   LayoutGrid, HelpCircle, FileText, Trash2, Plus, Loader2
} from 'lucide-react';
import { apiClient, getCurrentUser } from '../services/api';

interface SettingsProfileProps {
   onBack: () => void;
}

interface UserProfile {
   id: string;
   email: string;
   role: string;
   profile: {
      first_name: string;
      last_name: string;
      professional_title: string;
      phone?: string;
   } | null;
}

const SettingsProfile: React.FC<SettingsProfileProps> = ({ onBack }) => {
   const [activeTab, setActiveTab] = useState('Profile');
   const [isEditing, setIsEditing] = useState(false);
   const [user, setUser] = useState<UserProfile | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            // First try to get from localStorage
            const cachedUser = getCurrentUser();
            if (cachedUser) {
               setUser(cachedUser);
            }

            // Then fetch fresh data from API
            const response = await apiClient.getMe();
            if (response.success && response.data) {
               setUser(response.data as any);
            }
         } catch (error) {
            console.error('Failed to fetch user profile:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchUserProfile();
   }, []);

   const userName = user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : 'Dr. User';
   const userEmail = user?.email || 'user@clinic.com';
   const userTitle = user?.profile?.professional_title || 'Healthcare Professional';
   const userPhone = user?.profile?.phone || '+91 00000 00000';

   const tabs = [
      { id: 'Profile', icon: <User size={18} /> },
      { id: 'Credentials', icon: <Shield size={18} /> },
      { id: 'Availability', icon: <Clock size={18} /> },
      { id: 'Notifications', icon: <Bell size={18} /> },
      { id: 'Security', icon: <Lock size={18} /> },
      { id: 'Privacy', icon: <Eye size={18} /> },
      { id: 'Integrations', icon: <Globe size={18} /> },
      { id: 'Billing', icon: <CreditCard size={18} /> }
   ];

   return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">

         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
            <div className="flex items-center gap-4 mb-8">
               <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <ChevronRight size={24} className="rotate-180" />
               </button>
               <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings & Profile</h1>
                  <p className="text-slate-500 font-medium mt-1">Manage your account and preferences</p>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

               {/* Left Sidebar - Navigation */}
               <div className="w-full lg:w-64 shrink-0 space-y-2">
                  {tabs.map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                           ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200'
                           : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                           }`}
                     >
                        {tab.icon}
                        {tab.id}
                     </button>
                  ))}
               </div>

               {/* Main Content Area */}
               <div className="flex-1 min-w-0 space-y-8">

                  {/* PROFILE SECTION */}
                  {activeTab === 'Profile' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-black text-slate-900">Profile Information</h2>

                        {/* Photo Card */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8">
                           <div className="relative group cursor-pointer">
                              <div className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile?.first_name || 'User'}`} alt="Profile" className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Camera className="text-white" size={24} />
                              </div>
                           </div>
                           <div className="text-center sm:text-left space-y-3">
                              <div className="flex gap-3 justify-center sm:justify-start">
                                 <button className="px-4 py-2 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">Change Photo</button>
                                 <button className="px-4 py-2 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                           </div>
                        </div>

                        {/* Personal Info */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Personal Details
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                 <input type="text" defaultValue={userName} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Title</label>
                                 <input type="text" defaultValue={userTitle} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                 <div className="relative">
                                    <input type="email" defaultValue={userEmail} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    <span className="absolute right-3 top-3.5 flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                                       <CheckCircle2 size={12} /> Verified
                                    </span>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                 <div className="relative">
                                    <input type="tel" defaultValue={userPhone} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    <span className="absolute right-3 top-3.5 flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                                       <CheckCircle2 size={12} /> Verified
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Practice Info */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Practice Details
                           </h3>
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Practice/Clinic Name</label>
                                 <input type="text" defaultValue="Rivera Child Development Center" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                                    <input type="text" defaultValue="123 MG Road, Mumbai, MH" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Practice</label>
                                    <select className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
                                       <option>8 years</option><option>10+ years</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specializations</label>
                                 <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border-2 border-slate-100 rounded-xl min-h-[3rem]">
                                    {['ASD', 'ADHD', 'Speech Delays', 'Learning Disabilities'].map(tag => (
                                       <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                          {tag} <button className="hover:text-red-500"><Trash2 size={12} /></button>
                                       </span>
                                    ))}
                                    <button className="px-3 py-1.5 border-2 border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-colors">+ Add</button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Professional Bio
                           </h3>
                           <div className="space-y-2">
                              <textarea
                                 className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                                 defaultValue="Dr. Jane Rivera is a licensed clinical psychologist specializing in autism spectrum disorders and developmental delays in children. With 8 years of experience, she is passionate about early intervention and family-centered care."
                              />
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 <span>Visible on public profile</span>
                                 <span>234 / 500</span>
                              </div>
                           </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                           <button className="px-6 py-3 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                           <button className="px-8 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Save Changes</button>
                        </div>
                     </div>
                  )}

                  {/* CREDENTIALS SECTION */}
                  {activeTab === 'Credentials' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-black text-slate-900">Professional Credentials</h2>

                        <div className="bg-white rounded-[2rem] p-1 border-2 border-green-400/30 shadow-lg shadow-green-100/20">
                           <div className="bg-gradient-to-br from-green-50 to-white rounded-[1.8rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                                    <Shield size={32} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Status</p>
                                    <h3 className="text-xl font-black text-slate-900">VERIFIED PROFESSIONAL</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1">Verified on Oct 25, 2024</p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center md:items-end">
                                 <div className="w-16 h-16 rounded-full border-4 border-green-200 flex items-center justify-center bg-white">
                                    <span className="text-lg font-black text-green-600">98</span>
                                 </div>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Trust Score</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              License Information
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                              {[
                                 { l: 'License Type', v: 'RCI Registered' },
                                 { l: 'Registration Number', v: 'RCI/12345/2020' },
                                 { l: 'Issue Date', v: 'January 15, 2020' },
                                 { l: 'Expiry Date', v: 'January 15, 2025' },
                                 { l: 'Issuing Authority', v: 'Rehabilitation Council of India' },
                                 { l: 'Category', v: 'Clinical Psychologist (RCP)' },
                              ].map(item => (
                                 <div key={item.l} className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.l}</p>
                                    <p className="text-sm font-bold text-slate-800">{item.v}</p>
                                 </div>
                              ))}
                           </div>

                           <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 text-amber-800">
                                 <AlertTriangle size={20} />
                                 <span className="text-sm font-bold">License expires in 92 days</span>
                              </div>
                              <button className="text-xs font-black text-amber-700 uppercase tracking-widest hover:underline">Renew Now</button>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Documents
                           </h3>
                           <div className="space-y-4">
                              {[
                                 { n: 'RCI_Certificate_2020.pdf', s: '2.4 MB' },
                                 { n: 'Degree_Certificate.pdf', s: '3.1 MB' },
                                 { n: 'Aadhaar_Masked.pdf', s: '1.8 MB' }
                              ].map((doc, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                       <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><FileText size={20} /></div>
                                       <div>
                                          <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{doc.n}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.s}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                                          <CheckCircle2 size={12} /> Verified
                                       </span>
                                       <button className="p-2 text-slate-400 hover:text-slate-600"><Download size={16} /></button>
                                    </div>
                                 </div>
                              ))}
                              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                 <Upload size={16} /> Upload New Document
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* AVAILABILITY SECTION */}
                  {activeTab === 'Availability' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-black text-slate-900">Availability & Schedule</h2>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <h3 className="text-lg font-black text-slate-900">Consultation Hours</h3>
                              <button className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline">Copy to all days</button>
                           </div>

                           <div className="space-y-4">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                                 <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl transition-all ${i === 6 ? 'bg-slate-50 opacity-60' : 'bg-white border border-slate-100'}`}>
                                    <div className="flex items-center justify-between w-40">
                                       <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{day}</span>
                                       <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i === 6 ? 'bg-slate-300' : 'bg-[#2563EB]'}`}>
                                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${i === 6 ? 'left-1' : 'right-1'}`} />
                                       </div>
                                    </div>
                                    {i !== 6 && (
                                       <div className="flex items-center gap-3 flex-1">
                                          <select className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none"><option>09:00 AM</option></select>
                                          <span className="text-slate-300 font-bold">-</span>
                                          <select className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none"><option>05:00 PM</option></select>
                                          <button className="ml-auto text-slate-400 hover:text-slate-600"><Plus size={16} /></button>
                                       </div>
                                    )}
                                    {i === 6 && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unavailable</span>}
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
                              Preferences
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Duration</label>
                                 <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"><option>45 minutes</option></select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buffer Time</label>
                                 <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"><option>15 minutes</option></select>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancellation Policy</label>
                                 <textarea className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none resize-none" defaultValue="Cancellations must be made at least 24 hours in advance to avoid a fee." />
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* SECURITY SECTION */}
                  {activeTab === 'Security' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-black text-slate-900">Security Settings</h2>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Password
                           </h3>
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</p>
                                 <div className="flex items-center gap-2 text-slate-800 text-lg font-black tracking-widest">
                                    •••••••• <span className="text-[10px] font-normal text-slate-400 ml-2">Last changed 30 days ago</span>
                                 </div>
                              </div>
                              <button className="px-6 py-2 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 transition-all">Change</button>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <h3 className="text-lg font-black text-slate-900">Two-Factor Authentication</h3>
                              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                                 <CheckCircle2 size={12} /> Active via SMS
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Smartphone size={20} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-800">Text Message (SMS)</p>
                                       <p className="text-xs font-bold text-slate-400">+91 98*** **210</p>
                                    </div>
                                 </div>
                                 <button className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Manage</button>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl opacity-60">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Lock size={20} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-800">Authenticator App</p>
                                       <p className="text-xs font-bold text-slate-400">Google Authenticator, Authy</p>
                                    </div>
                                 </div>
                                 <button className="text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">Setup</button>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Active Sessions
                           </h3>
                           <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-green-50/50 border border-green-100 rounded-xl">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><LayoutGrid size={20} /></div>
                                    <div>
                                       <div className="flex items-center gap-2">
                                          <p className="text-sm font-black text-slate-800">Chrome on Windows</p>
                                          <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-[9px] font-black uppercase">Current</span>
                                       </div>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mumbai, India • 192.168.1.1</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 text-slate-400 rounded-lg"><Smartphone size={20} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-800">Safari on iPhone 13</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mumbai, India • Last active 2h ago</p>
                                    </div>
                                 </div>
                                 <button className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest">End Session</button>
                              </div>
                           </div>
                           <button className="w-full py-3 border-2 border-slate-100 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-100 transition-all">Sign out all other sessions</button>
                        </div>
                     </div>
                  )}

                  {/* BILLING SECTION */}
                  {activeTab === 'Billing' && (
                     <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-black text-slate-900">Billing & Subscription</h2>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                              Current Plan
                           </h3>
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <p className="text-2xl font-black text-slate-900">Professional Plan</p>
                                 <p className="text-sm font-medium text-slate-500">₹4,999/month • Billed monthly</p>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                                 <CheckCircle2 size={12} /> Active
                              </div>
                           </div>
                           <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next billing</p>
                                 <p className="text-sm font-bold text-slate-800">Jan 15, 2025</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient limit</p>
                                 <p className="text-sm font-bold text-slate-800">Unlimited</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage</p>
                                 <p className="text-sm font-bold text-slate-800">50 GB</p>
                              </div>
                           </div>
                           <div className="flex gap-4 pt-4">
                              <button className="px-6 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Upgrade Plan</button>
                              <button className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel Subscription</button>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                           <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">Payment Method</h3>
                           <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                              <div className="flex items-center gap-4">
                                 <div className="p-2 bg-white rounded-lg shadow-sm"><CreditCard size={20} className="text-blue-600" /></div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800">•••• •••• •••• 4242</p>
                                    <p className="text-xs font-bold text-slate-400">Expires 12/2025</p>
                                 </div>
                              </div>
                              <button className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline">Update</button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* DANGER ZONE (Only show on Profile tab) */}
                  {activeTab === 'Profile' && (
                     <div className="border-2 border-red-100 rounded-[2rem] p-8 bg-red-50/30 mt-12">
                        <h3 className="text-lg font-black text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">Irreversible actions regarding your account</p>
                        <div className="flex gap-4">
                           <button className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all">Deactivate Account</button>
                           <button className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100">Delete Account</button>
                        </div>
                     </div>
                  )}

               </div>

               {/* Right Sidebar - Widgets */}
               <aside className="w-full lg:w-72 shrink-0 space-y-8 sticky top-24 h-fit">
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Profile Completion</h3>
                     <div className="flex items-center justify-center mb-6 relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                           <circle cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
                           <circle cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="263.8" strokeDashoffset={263.8 * 0.15} className="text-blue-500" />
                        </svg>
                        <span className="absolute text-xl font-black text-slate-900">85%</span>
                     </div>
                     <div className="space-y-3">
                        {['Basic Info', 'Credentials', 'Photo'].map(i => (
                           <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <CheckCircle2 size={14} className="text-green-500" /> {i}
                           </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                           <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" /> Bio incomplete
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                     <div className="space-y-2">
                        {[
                           { l: 'View Public Profile', i: <Eye size={16} /> },
                           { l: 'Download Credentials', i: <Download size={16} /> },
                           { l: 'Contact Support', i: <HelpCircle size={16} /> },
                           { l: 'Terms of Service', i: <FileText size={16} /> }
                        ].map((act, i) => (
                           <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left text-xs font-bold text-slate-600 group">
                              <div className="flex items-center gap-3">
                                 <span className="text-slate-300 group-hover:text-[#2563EB]">{act.i}</span>
                                 <span>{act.l}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </aside>

            </div>
         </div>
      </div>
   );
};

export default SettingsProfile;
