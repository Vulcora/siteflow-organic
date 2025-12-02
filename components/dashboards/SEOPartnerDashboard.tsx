import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  ExternalLink,
  Bot,
  Briefcase
} from 'lucide-react';
import StatsCard from './StatsCard';
import BlogManager from './BlogManager';
import AnalyticsPanel from './AnalyticsPanel';
import AIAssistant from './AIAssistant';
import CaseStudyManager from './CaseStudyManager';
import { getAllBlogPosts } from '../../data/blogPosts';
import { getAllCaseStudies } from '../../data/caseStudies';

type Tab = 'overview' | 'aiAssistant' | 'blog' | 'analytics' | 'caseStudies';

const SEOPartnerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const blogPosts = getAllBlogPosts();
  const caseStudies = getAllCaseStudies();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t('seoPartner.nav.overview'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'aiAssistant', label: t('seoPartner.nav.aiAssistant'), icon: <Bot className="w-4 h-4" /> },
    { id: 'blog', label: t('seoPartner.nav.blogManager'), icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: t('seoPartner.nav.analytics'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'caseStudies', label: t('seoPartner.nav.caseStudies'), icon: <Briefcase className="w-4 h-4" /> },
  ];

  const lastPublished = blogPosts.length > 0
    ? new Date(blogPosts[0].publishDate).toLocaleDateString('sv-SE')
    : '-';

  const renderContent = () => {
    switch (activeTab) {
      case 'aiAssistant':
        return <AIAssistant />;
      case 'blog':
        return <BlogManager />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'caseStudies':
        return <CaseStudyManager />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('seoPartner.totalPosts')}
          value={blogPosts.length}
          icon={<FileText className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title={t('seoPartner.lastPublished')}
          value={lastPublished}
          icon={<Calendar className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title={t('seoPartner.analytics')}
          value="GA4"
          icon={<BarChart3 className="w-5 h-5" />}
          color="amber"
        />
        <StatsCard
          title={t('seoPartner.totalCases')}
          value={caseStudies.length}
          icon={<Briefcase className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">{t('seoPartner.blogPosts')}</h3>
            <button
              onClick={() => setActiveTab('blog')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('dashboard.viewAll')}
            </button>
          </div>
          {blogPosts.length === 0 ? (
            <p className="text-slate-500 text-sm">{t('seoPartner.noPostsYet')}</p>
          ) : (
            <div className="space-y-3">
              {blogPosts.slice(0, 3).map((post) => (
                <div key={post.slug} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {post.title.sv}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(post.publishDate).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Case Studies */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">{t('seoPartner.caseStudiesTitle')}</h3>
            <button
              onClick={() => setActiveTab('caseStudies')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('dashboard.viewAll')}
            </button>
          </div>
          {caseStudies.length === 0 ? (
            <p className="text-slate-500 text-sm">{t('seoPartner.noCasesYet')}</p>
          ) : (
            <div className="space-y-3">
              {caseStudies.slice(0, 3).map((caseStudy) => (
                <div key={caseStudy.slug} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {caseStudy.title.sv}
                    </p>
                    <p className="text-xs text-slate-500">
                      {caseStudy.client.industry.sv}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Quick Link */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Google Analytics</h3>
              <p className="text-xs text-slate-500">GA4 Property</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            {t('seoPartner.analyticsPanel.description')}
          </p>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('seoPartner.viewAnalytics')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">{t('seoPartner.title')}</h2>
        <p className="text-purple-200 mt-1">{t('seoPartner.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default SEOPartnerDashboard;
