
import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Share2, Printer, MoreVertical, 
  FileText, Calendar, User, CheckCircle2, Search, 
  ZoomIn, ZoomOut, RotateCw, Maximize, ChevronLeft, 
  ChevronRight, Info, Clock, ShieldCheck, Mail, X,
  Layout, List, MessageSquare, AlertTriangle, ExternalLink
} from 'lucide-react';

interface ReportViewerProps {
  onBack: () => void;
  onNavigateToPatient?: (id: string) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ onBack, onNavigateToPatient }) => {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sidebarView, setSidebarView] = useState<'thumbnails' | 'outline'>('thumbnails');

  const totalPages = 12;

  const toggleShareModal = () => setShowShareModal(!showShareModal);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-[60]">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[41px] z-50">
        <div className="px-6 py-4 flex flex-col gap-4">
           {/* Top Row: Breadcrumb & Actions */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                       Diagnostic Report - Aarav Kumar
                       <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200">Diagnostic Assessment</span>
                       <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-widest border border-green-200">Completed</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-1 text-xs font-medium text-slate-500">
                       <span>Report ID: REP-DAI-8291-2024</span>
                       <span className="text-slate-300">|</span>
                       <span>Generated: Oct 24, 2024</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="h-10 px-6 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Download size={16} /> Download PDF
                 </button>
                 <button onClick={toggleShareModal} className="h-10 px-4 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                    <Share2 size={16} /> Share
                 </button>
                 <button className="h-10 w-10 border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">
                    <MoreVertical size={18} />
                 </button>
              </div>
           </div>

           {/* Bottom Row: Metadata Bar */}
           <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                       <button onClick={() => onNavigateToPatient?.('aarav')} className="text-xs font-bold text-blue-600 hover:underline">Aarav Kumar</button>
                    </div>
                 </div>
                 <div className="h-8 w-px bg-slate-100" />
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Dr. Rivera" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author</p>
                       <p className="text-xs font-bold text-slate-700">Dr. Jane Rivera</p>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5 text-green-600"><CheckCircle2 size={12} /> Shared with parent (Oct 24)</span>
                 <span>Viewed 3 times</span>
              </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar */}
         <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
            <div className="p-4 border-b border-slate-100 flex gap-1">
               <button 
                 onClick={() => setSidebarView('thumbnails')}
                 className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${sidebarView === 'thumbnails' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <Layout size={14} /> Pages
               </button>
               <button 
                 onClick={() => setSidebarView('outline')}
                 className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${sidebarView === 'outline' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <List size={14} /> Outline
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
               {sidebarView === 'thumbnails' ? (
                 Array.from({ length: totalPages }).map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => setPage(i + 1)}
                     className={`w-full group flex gap-4 p-2 rounded-xl transition-all ${page === i + 1 ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}`}
                   >
                      <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                      <div className={`flex-1 aspect-[3/4] bg-white border shadow-sm rounded-lg relative overflow-hidden ${page === i + 1 ? 'border-blue-300' : 'border-slate-200'}`}>
                         <div className="absolute inset-2 space-y-1">
                            <div className="h-1 w-1/3 bg-slate-200 rounded-full" />
                            <div className="space-y-0.5">
                               <div className="h-0.5 w-full bg-slate-100 rounded-full" />
                               <div className="h-0.5 w-full bg-slate-100 rounded-full" />
                               <div className="h-0.5 w-2/3 bg-slate-100 rounded-full" />
                            </div>
                         </div>
                      </div>
                   </button>
                 ))
               ) : (
                 <div className="space-y-1">
                    {[
                      { l: 'Patient Information', p: 1 },
                      { l: 'Assessment Summary', p: 2 },
                      { l: 'ISAA Results', p: 3 },
                      { l: 'Clinical Observations', p: 5 },
                      { l: 'Recommendations', p: 9 },
                      { l: 'Signatures', p: 12 }
                    ].map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => setPage(item.p)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors truncate"
                      >
                         {item.l}
                      </button>
                    ))}
                 </div>
               )}
            </div>
         </aside>

         {/* Viewer Area */}
         <main className="flex-1 bg-slate-100 flex flex-col relative overflow-hidden">
            {/* Viewer Toolbar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
               <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30" disabled={page === 1}>
                     <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 min-w-[4rem] text-center">
                     {page} / {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30" disabled={page === totalPages}>
                     <ChevronRight size={18} />
                  </button>
               </div>

               <div className="flex items-center gap-2">
                  <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><ZoomOut size={18} /></button>
                  <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-center">{zoom}%</span>
                  <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><ZoomIn size={18} /></button>
               </div>

               <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><RotateCw size={18} /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><Maximize size={18} /></button>
               </div>
            </div>

            {/* Document Surface */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
               <div 
                 className="bg-white shadow-xl transition-transform duration-200 origin-top"
                 style={{ 
                   width: `${800 * (zoom / 100)}px`, 
                   minHeight: `${1131 * (zoom / 100)}px`,
                   height: 'fit-content'
                 }}
               >
                  {/* Simulated Document Content */}
                  <div className="w-full h-full p-[8%] flex flex-col relative overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: '800px', height: '1131px' }}>
                     {/* Watermark */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none font-black text-[120px] -rotate-45 z-0">
                        DEMO
                     </div>

                     <div className="relative z-10 flex-1 flex flex-col">
                        {/* Doc Header */}
                        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-black text-xl rounded-lg">R</div>
                              <div>
                                 <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Rivera Child Development</h2>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Excellence in Pediatric Care</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Diagnostic Report</h1>
                              <p className="text-xs font-bold text-slate-500 mt-1">Confidential Medical Record</p>
                           </div>
                        </div>

                        {/* Doc Body - Dynamic based on page */}
                        {page === 1 ? (
                           <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                                    <p className="text-lg font-bold text-slate-900">Aarav Kumar</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                                    <p className="text-lg font-bold text-slate-900">March 15, 2017 (7 yrs)</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient ID</p>
                                    <p className="text-lg font-bold text-slate-900">#DAI-8291</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessment Date</p>
                                    <p className="text-lg font-bold text-slate-900">October 24, 2024</p>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Reason for Referral</h3>
                                 <p className="text-sm text-slate-700 leading-relaxed text-justify">
                                    Aarav was referred for a comprehensive diagnostic evaluation due to concerns regarding social communication skills, repetitive behaviors, and speech delays reported by parents and school teachers. The purpose of this assessment is to determine diagnostic clarification and identify support needs for educational planning.
                                 </p>
                              </div>

                              <div className="space-y-4">
                                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Assessment Tools Administered</h3>
                                 <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                    <li>Indian Scale for Assessment of Autism (ISAA)</li>
                                    <li>Graded Learning Assessment for Dyslexia (GLAD) - Screening</li>
                                    <li>Clinical Observation and Interview</li>
                                    <li>Parent and Teacher Rating Scales</li>
                                 </ul>
                              </div>
                           </div>
                        ) : (
                           <div className="flex-1 flex items-center justify-center text-slate-300 font-black text-2xl uppercase tracking-widest">
                              Page {page} Preview
                           </div>
                        )}

                        {/* Doc Footer */}
                        <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Page {page} of {totalPages}</span>
                           <span>Report ID: REP-DAI-8291-2024</span>
                           <span>Dr. Jane Rivera</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* Right Sidebar - Context & Actions */}
         <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden xl:flex">
            <div className="p-6 border-b border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Report Information</h3>
               <div className="space-y-4">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Assessment Basis</p>
                     <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                        ISAA Assessment (Oct 20) <ExternalLink size={10} />
                     </button>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Related Records</p>
                     <div className="flex flex-col gap-1 mt-1">
                        <button className="text-xs font-bold text-slate-600 hover:text-blue-600 text-left truncate">Session Notes (3)</button>
                        <button className="text-xs font-bold text-slate-600 hover:text-blue-600 text-left truncate">Parent Interview Data</button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-b border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Access History</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">PK</div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">Mrs. Priya Kumar</p>
                        <p className="text-[10px] text-slate-400">Viewed today, 4:30 PM</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">MS</div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">Mrs. Meena Sharma</p>
                        <p className="text-[10px] text-slate-400">Shared (Pending view)</p>
                     </div>
                  </div>
                  <button className="w-full text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-left">View Full Audit Log</button>
               </div>
            </div>

            <div className="p-6 flex-1 bg-slate-50">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Annotations</h3>
               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4">
                  <div className="flex justify-between mb-2">
                     <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Page 5</span>
                     <span className="text-[10px] text-slate-400">2d ago</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 leading-snug">"Double check the DSM-5 criteria alignment section."</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">— Dr. Sarah Mehta</p>
               </div>
               <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2">
                  <MessageSquare size={14} /> Add Note
               </button>
            </div>
         </aside>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Share Report</h3>
                 <button onClick={toggleShareModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                 <label className="flex items-start gap-3 p-4 border-2 border-[#2563EB] bg-blue-50/30 rounded-2xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                    <div>
                       <span className="text-sm font-bold text-slate-900">Parent (Mrs. Priya Kumar)</span>
                       <p className="text-xs text-slate-500 mt-0.5">priya.kumar@email.com</p>
                    </div>
                 </label>
                 
                 <label className="flex items-start gap-3 p-4 border-2 border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                    <div>
                       <span className="text-sm font-bold text-slate-900">Teacher (Mrs. Meena Sharma)</span>
                       <p className="text-xs text-slate-500 mt-0.5">Requires consent confirmation</p>
                    </div>
                 </label>

                 <div className="pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Security Settings</label>
                    <div className="flex flex-col gap-2">
                       <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                          Password Protect PDF
                       </label>
                       <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                          Expire link after 7 days
                       </label>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-2">
                 <button onClick={toggleShareModal} className="flex-1 h-12 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50">Cancel</button>
                 <button onClick={toggleShareModal} className="flex-1 h-12 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100">Share Securely</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
