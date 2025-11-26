import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaseStudy } from '../data/caseStudies';
import MetricsDisplay from './MetricsDisplay';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: () => void;
  index?: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy, onClick, index = 0 }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  return (
    <article
      onClick={onClick}
      className={`group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 animate-on-scroll stagger-${index + 1}`}
    >
      {/* Hero Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={caseStudy.heroImage.src}
          alt={caseStudy.heroImage.alt[lang]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Industry Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700">
            <Building2 className="w-3 h-3" />
            {caseStudy.client.industry[lang]}
          </span>
        </div>

        {/* Metrics Preview on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-3">
            {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <span className="text-lg font-bold text-blue-600">{metric.value}</span>
                <span className="text-xs text-slate-500 ml-1.5">{metric.label[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Client Name or Anonymous */}
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
          {caseStudy.client.name || t('caseStudies.anonymous')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {caseStudy.title[lang]}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {caseStudy.excerpt[lang]}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {caseStudy.tags.length > 3 && (
            <span className="text-xs text-slate-400">+{caseStudy.tags.length - 3}</span>
          )}
        </div>

        {/* Read More Link */}
        <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
          <span>{t('caseStudies.viewCase')}</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
