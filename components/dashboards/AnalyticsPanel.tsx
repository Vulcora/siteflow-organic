import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  ExternalLink,
  Users,
  Eye,
  TrendingDown,
  Clock,
  Info
} from 'lucide-react';

const GA4_PROPERTY_ID = '514316581';

const AnalyticsPanel: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: t('seoPartner.analyticsPanel.metrics.visitors'),
      description: 'Se hur många unika besökare din webbplats har',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: t('seoPartner.analyticsPanel.metrics.pageViews'),
      description: 'Vilka sidor besöks mest',
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: t('seoPartner.analyticsPanel.metrics.bounceRate'),
      description: 'Andel besökare som lämnar direkt',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t('seoPartner.analyticsPanel.metrics.avgDuration'),
      description: 'Hur länge stannar besökare',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {t('seoPartner.analyticsPanel.title')}
            </h3>
            <p className="text-slate-500 mt-1">
              {t('seoPartner.analyticsPanel.subtitle')}
            </p>
            <p className="text-sm text-slate-600 mt-3">
              {t('seoPartner.analyticsPanel.description')}
            </p>

            {/* Property ID */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {t('seoPartner.analyticsPanel.propertyId')}
                </span>
                <code className="text-sm font-mono bg-slate-200 px-2 py-1 rounded">
                  {GA4_PROPERTY_ID}
                </code>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('seoPartner.analyticsPanel.openDashboard')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{feature.title}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Tips</p>
          <p className="mt-1">
            Google Analytics samlar in data om besökare på webbplatsen automatiskt.
            Klicka på knappen ovan för att se fullständig statistik i Google Analytics dashboard.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-medium text-slate-900 mb-3">Snabblänkar</h4>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/explorer?params=_u..nav%3Dmaui&r=all-pages-and-screens`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Sidvisningar
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/explorer?params=_u..nav%3Dmaui&r=traffic-acquisition-overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Trafikkällor
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/explorer?params=_u..nav%3Dmaui&r=user-demographics-overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Demografi
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/explorer?params=_u..nav%3Dmaui&r=realtime-overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Realtid
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
