
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center p-5 rounded-[12px] transition-all duration-200 bg-white shadow-sm border-2 group
        ${isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500/10' 
          : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
        }`}
    >
      <div className={`mr-4 p-3 rounded-xl transition-colors ${isSelected ? 'bg-blue-50' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
        {icon}
      </div>
      
      <div className="flex-1 pr-4">
        <h3 className={`text-[18px] font-bold mb-1 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-snug">
          {description}
        </p>
      </div>

      <div className={`transition-transform duration-200 ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
        <ChevronRight className={isSelected ? 'text-blue-500' : 'text-slate-300'} size={20} />
      </div>
    </button>
  );
};

export default RoleCard;
