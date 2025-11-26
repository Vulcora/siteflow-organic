import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaseStudyMetric } from '../data/caseStudies';

interface MetricsDisplayProps {
  metrics: CaseStudyMetric[];
  variant?: 'hero' | 'card' | 'inline';
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, variant = 'hero' }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  if (variant === 'card') {
    // Compact version for cards - show first 2-3 metrics
    const displayMetrics = metrics.slice(0, 3);
    return (
      <div className="flex flex-wrap gap-4">
        {displayMetrics.map((metric, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">{metric.value}</span>
            <span className="text-xs text-slate-500">{metric.label[lang]}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    // Inline version for smaller spaces
    return (
      <div className="flex flex-wrap gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center gap-2">
            {metric.trend && (
              <span className={metric.trend === 'up' ? 'text-green-500' : 'text-blue-500'}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </span>
            )}
            <span className="text-lg font-bold text-slate-900">{metric.value}</span>
            <span className="text-sm text-slate-500">{metric.label[lang]}</span>
          </div>
        ))}
      </div>
    );
  }

  // Hero variant - large, prominent metrics
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {metric.trend && (
              <span className={metric.trend === 'up' ? 'text-green-400' : 'text-blue-400'}>
                {metric.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </span>
            )}
            <span className="text-3xl md:text-4xl font-bold text-white">{metric.value}</span>
          </div>
          <span className="text-sm text-slate-300">{metric.label[lang]}</span>
        </div>
      ))}
    </div>
  );
};

export default MetricsDisplay;
