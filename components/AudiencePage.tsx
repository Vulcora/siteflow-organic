import React from 'react';
import { Target, TrendingUp, Eye, HeartHandshake, AlertTriangle } from 'lucide-react';
import CTA from './CTA';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface AudiencePageProps {
  onNavigate: (page: Page) => void;
}

const AudiencePage: React.FC<AudiencePageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
         </div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-6 border border-blue-500/20 animate-fade-in">
              {t('audiencePage.badge')}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif mb-6 animate-on-scroll">{t('audiencePage.title')}</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto animate-on-scroll stagger-1">
              {t('audiencePage.subtitle')}
            </p>
         </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-8 animate-slide-left">
               <h2 className="text-3xl font-serif text-slate-900">{t('audiencePage.target.title')}</h2>
               <p className="text-slate-600 leading-relaxed">
                 {t('audiencePage.target.description')}
               </p>

               <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0 mr-4">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t('audiencePage.target.visionary.title')}</h3>
                      <p className="text-sm text-slate-500">{t('audiencePage.target.visionary.description')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 shrink-0 mr-4">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t('audiencePage.target.growing.title')}</h3>
                      <p className="text-sm text-slate-500">{t('audiencePage.target.growing.description')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0 mr-4">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t('audiencePage.target.costAware.title')}</h3>
                      <p className="text-sm text-slate-500">{t('audiencePage.target.costAware.description')}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-center animate-slide-right">
              <h3 className="text-2xl font-serif mb-6">{t('audiencePage.promise.title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-slate-300">
                  <HeartHandshake className="w-5 h-5 text-blue-400 mr-3 mt-1 shrink-0" />
                  <span><strong>{t('audiencePage.promise.workWithYou.title')}</strong> {t('audiencePage.promise.workWithYou.description')}</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-3 mt-1 shrink-0" />
                  <span><strong>{t('audiencePage.promise.predictableCosts.title')}</strong> {t('audiencePage.promise.predictableCosts.description')}</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <Eye className="w-5 h-5 text-purple-400 mr-3 mt-1 shrink-0" />
                  <span><strong>{t('audiencePage.promise.clarity.title')}</strong> {t('audiencePage.promise.clarity.description')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* What we are NOT */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-4xl mx-auto animate-on-scroll">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-slate-900 mb-4">{t('audiencePage.notFor.title')}</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              {t('audiencePage.notFor.description')}
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
               <div className="bg-white p-4 rounded-lg shadow-sm animate-on-scroll stagger-1">
                 <h3 className="font-bold text-slate-900 mb-1">{t('audiencePage.notFor.notCheapest.title')}</h3>
                 <p className="text-xs text-slate-500">{t('audiencePage.notFor.notCheapest.description')}</p>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm animate-on-scroll stagger-2">
                 <h3 className="font-bold text-slate-900 mb-1">{t('audiencePage.notFor.notFastest.title')}</h3>
                 <p className="text-xs text-slate-500">{t('audiencePage.notFor.notFastest.description')}</p>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm animate-on-scroll stagger-3">
                 <h3 className="font-bold text-slate-900 mb-1">{t('audiencePage.notFor.notSalesy.title')}</h3>
                 <p className="text-xs text-slate-500">{t('audiencePage.notFor.notSalesy.description')}</p>
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

export default AudiencePage;
