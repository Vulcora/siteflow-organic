import React from 'react';
import { TrendingDown, Server, Users, Award } from 'lucide-react';
import Stats from './Stats';
import CTA from './CTA';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface ResultsPageProps {
  onNavigate: (page: Page) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 text-center relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
         </div>
         <div className="container mx-auto px-6 relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-6 border border-blue-500/20 animate-fade-in">
              {t('resultsPage.badge')}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif mb-6 animate-on-scroll">{t('resultsPage.title')}</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto animate-on-scroll stagger-1">
              {t('resultsPage.subtitle')}
            </p>
         </div>
      </div>

      {/* Re-use Stats Component */}
      <Stats />

      {/* Detailed Breakdown */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">

            <div className="animate-slide-left">
              <h2 className="text-3xl font-serif text-slate-900 mb-6">{t('resultsPage.tech.title')}</h2>
              <p className="text-slate-600 mb-6">
                {t('resultsPage.tech.description')}
              </p>

              <ul className="space-y-6">
                <li className="border-l-4 border-green-500 pl-4 animate-on-scroll stagger-1">
                  <div className="font-bold text-slate-900 text-lg">{t('resultsPage.tech.whatsapp.title')}</div>
                  <p className="text-slate-600">{t('resultsPage.tech.whatsapp.description')}</p>
                </li>
                <li className="border-l-4 border-blue-500 pl-4 animate-on-scroll stagger-2">
                  <div className="font-bold text-slate-900 text-lg">{t('resultsPage.tech.discord.title')}</div>
                  <p className="text-slate-600">{t('resultsPage.tech.discord.description')}</p>
                </li>
                <li className="border-l-4 border-red-500 pl-4 animate-on-scroll stagger-3">
                  <div className="font-bold text-slate-900 text-lg">{t('resultsPage.tech.pinterest.title')}</div>
                  <p className="text-slate-600">{t('resultsPage.tech.pinterest.description')}</p>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 animate-slide-right">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('resultsPage.meaning.title')}</h3>

              <div className="space-y-8">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                     <TrendingDown className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900">{t('resultsPage.meaning.reducedDebt.title')}</h4>
                     <p className="text-sm text-slate-600">{t('resultsPage.meaning.reducedDebt.description')}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                     <Server className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900">{t('resultsPage.meaning.optimization.title')}</h4>
                     <p className="text-sm text-slate-600">{t('resultsPage.meaning.optimization.description')}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                     <Award className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900">{t('resultsPage.meaning.aiReady.title')}</h4>
                     <p className="text-sm text-slate-600">{t('resultsPage.meaning.aiReady.description')}</p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA onNavigate={onNavigate} />
    </div>
  );
};

export default ResultsPage;
