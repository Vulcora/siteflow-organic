import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Plus,
  Edit3,
  Eye,
  Calendar,
  Tag,
  Search,
  Building2
} from 'lucide-react';
import { getAllCaseStudies, CaseStudy } from '../../data/caseStudies';

const CaseStudyManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const allCases = getAllCaseStudies();

  const filteredCases = allCases.filter((caseStudy) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      caseStudy.title[lang].toLowerCase().includes(query) ||
      caseStudy.excerpt[lang].toLowerCase().includes(query) ||
      caseStudy.client.industry[lang].toLowerCase().includes(query)
    );
  });

  const handleNewCase = () => {
    alert(t('seoPartner.caseStudyManager.comingSoon'));
  };

  const handleEditCase = () => {
    alert(t('seoPartner.caseStudyManager.comingSoon'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t('seoPartner.caseStudyManager.title')}
          </h3>
          <p className="text-sm text-slate-500">
            {t('seoPartner.caseStudyManager.subtitle')}
          </p>
        </div>
        <button
          onClick={handleNewCase}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('seoPartner.caseStudyManager.newCase')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('caseStudies.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-slate-700"
        />
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">{t('seoPartner.caseStudyManager.noCasesYet')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCases.map((caseStudy) => (
              <div
                key={caseStudy.slug}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {caseStudy.heroImage?.src ? (
                      <img
                        src={caseStudy.heroImage.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900 truncate">
                          {caseStudy.title[lang]}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                          {caseStudy.excerpt[lang]}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {t('seoPartner.published')}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {caseStudy.client.industry[lang]}
                      </span>
                      {caseStudy.duration && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {caseStudy.duration[lang]}
                        </span>
                      )}
                      {caseStudy.tags && caseStudy.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          {caseStudy.tags.slice(0, 2).join(', ')}
                          {caseStudy.tags.length > 2 && ` +${caseStudy.tags.length - 2}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={`/case-study/${caseStudy.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleEditCase}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('seoPartner.caseStudyManager.editCase')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudyManager;
