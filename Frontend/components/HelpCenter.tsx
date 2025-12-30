
import React, { useState } from 'react';
import { 
  Search, ArrowLeft, Play, MessageCircle, Mail, Phone, 
  Users, FileText, ChevronDown, ChevronRight, Star, 
  BookOpen, Download, LayoutGrid, Rocket, Info, Check, 
  ExternalLink, Zap, LifeBuoy
} from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    { q: 'How do I add my first patient?', a: 'To add a patient, navigate to the Patients page and click the "+ New Patient" button. You can add patients via consent token or manually create a profile if you have the necessary permissions.' },
    { q: 'How do I verify my credentials?', a: 'Go to Settings > Credentials. Enter your RCI/NMC registration number and upload the required certificates. Verification typically takes 24-48 hours.' },
    { q: 'Can I import patient data?', a: 'Yes, you can import data via CSV for bulk uploads or connect with supported school LMS platforms in the Integrations settings.' },
    { q: 'How do I schedule appointments?', a: 'Use the Calendar view in the Dashboard or go to a Patient Profile and click "Schedule Session". You can set your availability in Settings.' },
    { q: 'What browsers are supported?', a: 'Daira is optimized for the latest versions of Chrome, Firefox, Safari, and Edge. We recommend Chrome for the best experience.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-50">
        <LifeBuoy size={16} className="text-amber-600" />
      </div>

      <div className="bg-white border-b border-slate-100 pb-12 pt-8">
         <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
            <button onClick={onBack} className="absolute left-6 top-24 lg:left-12 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
               <ArrowLeft size={18} /> Back
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Help & Resources</h1>
            <p className="text-lg text-slate-500 font-medium mb-8">Get support and learn how to use Daira effectively</p>
            
            <div className="relative max-w-2xl mx-auto mb-6">
               <input 
                 type="text" 
                 placeholder="Search for help articles, guides, and tutorials..." 
                 className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-semibold outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-sm"
               />
               <Search className="absolute left-5 top-5 text-slate-400" size={24} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm font-medium text-slate-500">
               <span className="font-bold text-slate-400 uppercase tracking-widest text-xs mr-2">Popular:</span>
               {['Getting Started', 'Assessment Tools', 'IEP Builder', 'Patient Management'].map(tag => (
                 <button key={tag} className="hover:text-[#2563EB] hover:underline transition-colors">{tag}</button>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-12 space-y-16">
         
         {/* Quick Help Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'Getting Started', d: 'New to Daira? Start here', i: <Rocket size={32} />, c: 'bg-blue-50 text-blue-600' },
              { t: 'Video Tutorials', d: 'Watch step-by-step guides', i: <Play size={32} />, c: 'bg-red-50 text-red-500' },
              { t: 'Contact Support', d: 'Chat with our team', i: <MessageCircle size={32} />, c: 'bg-green-50 text-green-600' },
              { t: 'Community Forum', d: 'Connect with professionals', i: <Users size={32} />, c: 'bg-purple-50 text-purple-600' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${card.c}`}>
                    {card.i}
                 </div>
                 <h3 className="text-lg font-black text-slate-900 mb-1">{card.t}</h3>
                 <p className="text-sm font-medium text-slate-500 mb-4">{card.d}</p>
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-[#2563EB] flex items-center gap-1 transition-colors">
                    View <ArrowLeft size={12} className="rotate-180" />
                 </span>
              </div>
            ))}
         </div>

         <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-12">
               {/* Featured Guides */}
               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-black text-slate-900">Featured Guides</h2>
                     <button className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { t: 'How to Conduct Your First Assessment', d: 'Complete walkthrough of the ISAA process', tag: 'Popular', time: '10 min' },
                       { t: 'Creating Effective IEPs', d: 'Step-by-step guide to building comprehensive IEPs', tag: 'New', time: '15 min' },
                       { t: 'Managing Consent & Data Access', d: 'Understanding HIPAA compliance and patient consent', time: '8 min' },
                       { t: 'Using Clinical Interventions Module', d: 'Track therapy plans and monitor progress', time: '12 min' }
                     ].map((guide, i) => (
                       <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-200 transition-all group cursor-pointer">
                          <div className="flex justify-between items-start mb-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <FileText size={20} />
                             </div>
                             {guide.tag && <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${guide.tag === 'Popular' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{guide.tag}</span>}
                          </div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">{guide.t}</h3>
                          <p className="text-sm font-medium text-slate-500 mb-4">{guide.d}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{guide.time} read</p>
                       </div>
                     ))}
                  </div>
               </section>

               {/* FAQs */}
               <section>
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
                  <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
                     {faqs.map((faq, i) => (
                       <div key={i} className="border-b border-slate-100 last:border-0">
                          <button 
                            onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group"
                          >
                             <span className={`text-base font-bold transition-colors ${expandedFaq === i ? 'text-[#2563EB]' : 'text-slate-800'}`}>{faq.q}</span>
                             <ChevronDown size={20} className={`text-slate-300 transition-transform ${expandedFaq === i ? 'rotate-180 text-[#2563EB]' : ''}`} />
                          </button>
                          {expandedFaq === i && (
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                               <p className="text-sm font-medium text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-200">{faq.a}</p>
                               <div className="flex gap-2 mt-4 pl-4">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Was this helpful?</span>
                                  <button className="text-slate-400 hover:text-green-600"><Star size={14} /></button>
                               </div>
                            </div>
                          )}
                       </div>
                     ))}
                     <button className="w-full py-4 text-xs font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest transition-colors">View All FAQs</button>
                  </div>
               </section>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 space-y-8">
               {/* Quick Links */}
               <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Links</h3>
                  <div className="space-y-2">
                     {['Documentation', 'Video Library', 'FAQs', 'Contact Support', 'Community Forum'].map(l => (
                       <button key={l} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-[#2563EB]">{l}</span>
                          <ChevronRight size={14} className="text-slate-200 group-hover:text-[#2563EB]" />
                       </button>
                     ))}
                  </div>
               </div>

               {/* Clinical Resources */}
               <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Clinical Resources</h3>
                  <div className="space-y-4">
                     {[
                       { t: 'Assessment Manual', s: '8.5 MB' },
                       { t: 'IEP Writing Guide', s: '2.1 MB' },
                       { t: 'DSM-5 Ref Card', s: 'Online' }
                     ].map((res, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                          <div className="p-2 bg-white/10 rounded-lg"><Download size={16} /></div>
                          <div>
                             <p className="text-xs font-bold">{res.t}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{res.s}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">Browse Library</button>
               </div>

               {/* System Status */}
               <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <div>
                     <p className="text-xs font-black text-green-800 uppercase tracking-tight">System Operational</p>
                     <p className="text-[10px] font-bold text-green-600">Updated 2m ago</p>
                  </div>
               </div>
            </aside>
         </div>

         {/* Support Channels */}
         <section className="pb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Get Support</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group cursor-pointer">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <MessageCircle size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Live Chat</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">Available Mon-Fri, 9AM-6PM</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Start Chat</button>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group cursor-pointer">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Mail size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Email Support</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">Response within 24 hours</p>
                  <button className="px-6 py-2 border-2 border-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Send Email</button>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group cursor-pointer">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Phone size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Phone Support</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">+91 80 1234 5678</p>
                  <button className="px-6 py-2 border-2 border-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Call Now</button>
               </div>
            </div>
         </section>

      </div>
    </div>
  );
};

export default HelpCenter;
