import React from 'react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface PressPageProps {
  onNavigate: (page: Page) => void;
}

const PressPage: React.FC<PressPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const logos = [
    {
      name: t('pressPage.logos.primary.name'),
      description: t('pressPage.logos.primary.description'),
      preview: '/logos/siteflow-logo/site flow.svg',
      darkBg: false,
    },
    {
      name: t('pressPage.logos.dark.name'),
      description: t('pressPage.logos.dark.description'),
      preview: '/logos/siteflow-logo/site flow.svg',
      darkBg: true,
    },
    {
      name: t('pressPage.logos.icon.name'),
      description: t('pressPage.logos.icon.description'),
      preview: '/logos/siteflow-logo/site flow.svg',
      darkBg: false,
    },
  ];

  const colors = [
    { name: 'Primary Blue', hex: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Cyan', hex: '#06b6d4', class: 'bg-cyan-500' },
    { name: 'Teal', hex: '#14b8a6', class: 'bg-teal-500' },
    { name: 'Slate Dark', hex: '#0f172a', class: 'bg-slate-900' },
    { name: 'Slate', hex: '#64748b', class: 'bg-slate-500' },
    { name: 'White', hex: '#ffffff', class: 'bg-white border border-slate-200' },
  ];

  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900 to-slate-800/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-slate-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-slate-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
              {t('pressPage.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t('pressPage.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('pressPage.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Logos - Download cards */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-slate-900 mb-12">{t('pressPage.logosSection.title')}</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`h-40 flex items-center justify-center p-8 ${
                    logo.darkBg ? 'bg-slate-900' : 'bg-slate-50'
                  }`}
                >
                  <img
                    src={logo.preview}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-1">{logo.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{logo.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload('/logos/siteflow-logo/site flow.svg', 'siteflow-logo.svg')}
                      className="flex-1 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      SVG
                    </button>
                    <button
                      onClick={() => handleDownload('/logos/siteflow-logo/site flow.png', 'siteflow-logo.png')}
                      className="flex-1 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleDownload('/logos/siteflow-logo/site flow.svg', 'siteflow-brand-assets.zip')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-full text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('pressPage.logosSection.downloadAll')}
          </button>
        </div>
      </section>

      {/* Colors - Simple swatches */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-slate-900 mb-12">{t('pressPage.colorsSection.title')}</h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {colors.map((color, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => navigator.clipboard.writeText(color.hex)}>
                <div className={`aspect-square rounded-2xl ${color.class} shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}></div>
                <div className="mt-3 text-center">
                  <div className="font-medium text-slate-900 text-sm">{color.name}</div>
                  <div className="text-slate-500 text-xs font-mono">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-6 text-center">{t('pressPage.colorsSection.clickToCopy')}</p>
        </div>
      </section>

      {/* Guidelines - Do's and Don'ts */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-slate-900 mb-12">{t('pressPage.guidelinesSection.title')}</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-900">{t('pressPage.guidelines.do.title')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-green-800">
                  <span className="text-green-500 mt-1">✓</span>
                  {t('pressPage.guidelines.do.item1')}
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <span className="text-green-500 mt-1">✓</span>
                  {t('pressPage.guidelines.do.item2')}
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <span className="text-green-500 mt-1">✓</span>
                  {t('pressPage.guidelines.do.item3')}
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-900">{t('pressPage.guidelines.dont.title')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-red-800">
                  <span className="text-red-500 mt-1">✗</span>
                  {t('pressPage.guidelines.dont.item1')}
                </li>
                <li className="flex items-start gap-3 text-red-800">
                  <span className="text-red-500 mt-1">✗</span>
                  {t('pressPage.guidelines.dont.item2')}
                </li>
                <li className="flex items-start gap-3 text-red-800">
                  <span className="text-red-500 mt-1">✗</span>
                  {t('pressPage.guidelines.dont.item3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-slate-900 mb-8">{t('pressPage.companySection.title')}</h2>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {t('pressPage.companySection.description')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-slate-500 mb-1">{t('pressPage.companySection.founded')}</div>
                <div className="font-semibold text-slate-900">2024</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{t('pressPage.companySection.location')}</div>
                <div className="font-semibold text-slate-900">Stockholm</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{t('pressPage.companySection.focus')}</div>
                <div className="font-semibold text-slate-900">{t('pressPage.companySection.focusDescription')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{t('pressPage.companySection.contact')}</div>
                <div className="font-semibold text-slate-900">press@siteflow.se</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            {t('pressPage.cta.title')}
          </h2>
          <p className="text-slate-300 mb-8">
            {t('pressPage.cta.description')}
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 bg-white rounded-full text-slate-900 font-semibold hover:shadow-lg transition-all duration-300"
          >
            {t('pressPage.cta.button')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PressPage;
