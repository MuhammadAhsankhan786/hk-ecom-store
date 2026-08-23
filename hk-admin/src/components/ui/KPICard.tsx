import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: React.ReactNode;
  isGoldHighlight?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
  isGoldHighlight = false
}) => {
  return (
    <div className={`p-5 rounded-xl border transition-all hk-card-hover ${
      isGoldHighlight 
        ? 'bg-[#111111] text-white border-[#111111] shadow-md' 
        : 'bg-white text-[#111111] border-[#E8E5DE] shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isGoldHighlight ? 'text-[#D4AF37]' : 'text-[#6B6B6B]'}`}>
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${isGoldHighlight ? 'bg-[#222222] text-[#D4AF37]' : 'bg-[#F8F7F3] text-[#111111]'}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        {change && (
          <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            changeType === 'positive' 
              ? 'bg-emerald-50 text-emerald-700' 
              : changeType === 'negative' 
                ? 'bg-rose-50 text-rose-700' 
                : 'bg-gray-100 text-gray-700'
          }`}>
            {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
            {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </div>
        )}
      </div>

      {subtitle && (
        <p className={`mt-1.5 text-xs ${isGoldHighlight ? 'text-gray-400' : 'text-[#6B6B6B]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default KPICard;
