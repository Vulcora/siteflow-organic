import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'cyan';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    cyan: 'bg-cyan-50 text-cyan-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`w-4 h-4 ${!trendUp && 'rotate-90'}`} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
