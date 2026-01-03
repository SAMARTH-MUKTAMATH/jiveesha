
import React from 'react';

// Generic Skeleton Primitive
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
);

// Page Loading (Full Screen)
export const PageSkeleton = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
    {/* Header */}
    <div className="h-20 bg-white border-b border-slate-100 px-12 flex items-center justify-between">
       <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-24 h-8" />
       </div>
       <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-10 rounded-lg" />
       </div>
    </div>
    
    <div className="flex-1 p-12">
       <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-4">
             <Skeleton className="h-32 rounded-3xl" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-8">
             <div className="h-48 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4 pt-4">
                   <Skeleton className="h-20 w-32" />
                   <Skeleton className="h-20 w-32" />
                   <Skeleton className="h-20 w-32" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-64 rounded-3xl" />
                <Skeleton className="h-64 rounded-3xl" />
             </div>
          </div>
       </div>
    </div>
  </div>
);

// Card Grid Skeleton (e.g., Reports, Interventions)
export const CardGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
         <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 flex-1">
               <Skeleton className="h-5 w-3/4" />
               <Skeleton className="h-3 w-1/2" />
            </div>
         </div>
         <Skeleton className="h-24 w-full rounded-xl" />
         <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
         </div>
      </div>
    ))}
  </div>
);

// Table Skeleton (e.g., Patient Registry)
export const TableSkeleton = () => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-6 space-y-6">
     <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
     </div>
     <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
           <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                 <Skeleton className="h-4 w-1/4" />
                 <Skeleton className="h-3 w-1/6" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
           </div>
        ))}
     </div>
  </div>
);

// Profile Loading State
export const ProfileLoading = () => (
   <div className="animate-in fade-in duration-500">
      <div className="h-64 bg-slate-200 w-full relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      </div>
      <div className="max-w-[1440px] mx-auto px-12 -mt-16 relative">
         <div className="flex gap-8">
            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg">
               <Skeleton className="w-full h-full rounded-[1.2rem]" />
            </div>
            <div className="pt-20 space-y-2">
               <Skeleton className="h-8 w-64" />
               <Skeleton className="h-4 w-48" />
            </div>
         </div>
      </div>
   </div>
);
