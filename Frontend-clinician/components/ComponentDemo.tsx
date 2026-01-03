
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, AlertTriangle, Loader, Box } from 'lucide-react';
import ErrorPage from './ErrorPage';
import EmptyState from './EmptyState';
import { PageSkeleton, CardGridSkeleton, TableSkeleton, ProfileLoading } from './LoadingStates';

interface ComponentDemoProps {
  onBack: () => void;
}

const ComponentDemo: React.FC<ComponentDemoProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'errors' | 'empty' | 'loading'>('errors');
  const [previewItem, setPreviewItem] = useState<string>('404');

  const categories = [
    { id: 'errors', label: 'Error Pages', icon: <AlertTriangle size={18} /> },
    { id: 'empty', label: 'Empty States', icon: <Box size={18} /> },
    { id: 'loading', label: 'Loading States', icon: <Loader size={18} /> },
  ];

  const items = {
    errors: ['404', '500', '403', '401', '503', '429'],
    empty: ['patients', 'appointments', 'reports', 'messages', 'search', 'done'],
    loading: ['page', 'cards', 'table', 'profile']
  };

  const renderPreview = () => {
    if (activeCategory === 'errors') {
      return <ErrorPage code={parseInt(previewItem) as any} onBack={() => {}} onDashboard={() => {}} />;
    }
    if (activeCategory === 'empty') {
      return <EmptyState type={previewItem as any} onAction={() => {}} />;
    }
    if (activeCategory === 'loading') {
      if (previewItem === 'page') return <PageSkeleton />;
      if (previewItem === 'cards') return <div className="p-8"><CardGridSkeleton /></div>;
      if (previewItem === 'table') return <div className="p-8"><TableSkeleton /></div>;
      if (previewItem === 'profile') return <div className="bg-white min-h-screen"><ProfileLoading /></div>;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar Controls */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-100">
           <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#2563EB] uppercase tracking-widest mb-6 transition-colors">
              <ArrowLeft size={14} /> Back to App
           </button>
           <h1 className="text-2xl font-black text-slate-900">System Design</h1>
           <p className="text-xs font-medium text-slate-400 mt-1">Component Library & States</p>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id as any); setPreviewItem(items[cat.id as keyof typeof items][0]); }}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    activeCategory === cat.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                   {cat.icon} {cat.label}
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {items[activeCategory].map(item => (
             <button
               key={item}
               onClick={() => setPreviewItem(item)}
               className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between ${
                 previewItem === item ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'
               }`}
             >
                {item}
                {previewItem === item && <ChevronRight size={14} />}
             </button>
           ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative overflow-auto bg-slate-100/50">
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 z-50 pointer-events-none shadow-sm">
            Previewing: {activeCategory} / {previewItem}
         </div>
         {renderPreview()}
      </div>
    </div>
  );
};

export default ComponentDemo;
