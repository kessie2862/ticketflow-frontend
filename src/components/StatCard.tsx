// src/components/StatCard.tsx

import { ArrowUpRight, Clock, Hash, CheckCircle2, Circle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  accent?: 'blue' | 'green' | 'default' | 'indigo';
  isTime?: boolean;
}

export const StatCard = ({ title, value, isTime = false }: StatCardProps) => {
  const getIcon = () => {
    if (title.toLowerCase().includes('total'))
      return <Hash className="w-5 h-5 text-indigo-600" />;
    if (title.toLowerCase().includes('time'))
      return <Clock className="w-5 h-5 text-amber-600" />;
    if (title.toLowerCase().includes('resolved'))
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    if (title.toLowerCase().includes('open'))
      return <Circle className="w-5 h-5 text-blue-600" />;
    return <ArrowUpRight className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {value ?? (isTime ? 'N/A' : '0')}
            </p>
            {isTime && value !== 'N/A' && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                avg
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};
