import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MousePointer2,
  ExternalLink,
  MousePointer,
  ScrollText,
  Video,
  Info,
  Flame
} from 'lucide-react';

const CLARITY_PROJECT_ID = 'uezswo28mn';

const ClarityPanel: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Flame className="w-5 h-5" />,
      title: t('seoPartner.clarityPanel.features.heatmaps'),
      description: t('seoPartner.clarityPanel.features.heatmapsDesc'),
      color: 'red',
    },
    {
      icon: <ScrollText className="w-5 h-5" />,
      title: t('seoPartner.clarityPanel.features.scrollMaps'),
      description: t('seoPartner.clarityPanel.features.scrollMapsDesc'),
      color: 'blue',
    },
    {
      icon: <Video className="w-5 h-5" />,
      title: t('seoPartner.clarityPanel.features.recordings'),
      description: t('seoPartner.clarityPanel.features.recordingsDesc'),
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      red: { bg: 'bg-red-50', text: 'text-red-600' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MousePointer2 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {t('seoPartner.clarityPanel.title')}
            </h3>
            <p className="text-slate-500 mt-1">
              {t('seoPartner.clarityPanel.subtitle')}
            </p>
            <p className="text-sm text-slate-600 mt-3">
              {t('seoPartner.clarityPanel.description')}
            </p>

            {/* Project ID */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Project ID</span>
                <code className="text-sm font-mono bg-slate-200 px-2 py-1 rounded">
                  {CLARITY_PROJECT_ID}
                </code>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('seoPartner.clarityPanel.openDashboard')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const colorClasses = getColorClasses(feature.color);
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center ${colorClasses.text} mb-3`}>
                {feature.icon}
              </div>
              <h4 className="font-medium text-slate-900">{feature.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-medium text-slate-900 mb-3">Snabblänkar</h4>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/heatmaps`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-red-700 transition-colors"
          >
            <Flame className="w-3 h-3" />
            Heatmaps
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/recordings`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-purple-700 transition-colors"
          >
            <Video className="w-3 h-3" />
            Inspelningar
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/insights`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 transition-colors"
          >
            <MousePointer className="w-3 h-3" />
            Insikter
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-700">
          <p className="font-medium">Om Microsoft Clarity</p>
          <p className="mt-1">
            Clarity är ett gratis verktyg från Microsoft som samlar in data om hur användare
            interagerar med din webbplats. Det inkluderar heatmaps som visar var användare
            klickar mest, scroll-kartor som visar hur långt de scrollar, och inspelningar
            av faktiska användarsessioner.
          </p>
          <p className="mt-2">
            All data är anonym och GDPR-kompatibel. Clarity-scriptet är redan installerat
            på webbplatsen.
          </p>
        </div>
      </div>

      {/* Sample Metrics (placeholder) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4">Vanliga insikter från Clarity</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">Dead clicks</p>
            <p className="text-xs text-slate-500 mt-1">Klick som inte leder någonstans</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">Rage clicks</p>
            <p className="text-xs text-slate-500 mt-1">Frustrerade upprepade klick</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">Scroll depth</p>
            <p className="text-xs text-slate-500 mt-1">Hur långt användare scrollar</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">Quick backs</p>
            <p className="text-xs text-slate-500 mt-1">Snabba backar till föregående sida</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClarityPanel;
