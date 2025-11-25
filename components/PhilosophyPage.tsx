import React from 'react';
import { Waves, Zap, BrainCircuit, Activity } from 'lucide-react';
import CTA from './CTA';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface PhilosophyPageProps {
  onNavigate: (page: Page) => void;
}

const PhilosophyPage: React.FC<PhilosophyPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 bg-[url('/ilustration/2.png')] bg-cover bg-center opacity-10"></div>

         <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-4 animate-fade-in">
              {t('philosophyPage.badge')}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif mb-6 animate-on-scroll">{t('philosophyPage.title')}</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-on-scroll stagger-1">
              {t('philosophyPage.subtitle')}
            </p>
         </div>
      </div>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg prose-slate mx-auto">
            <p className="text-2xl font-serif text-slate-800 leading-relaxed mb-8 italic animate-on-scroll">
              "{t('philosophyPage.intro.quote')}"
            </p>
            <p className="text-slate-600 mb-6 animate-on-scroll stagger-1">
              {t('philosophyPage.intro.paragraph1')}
            </p>
            <p className="text-slate-600 mb-6 animate-on-scroll stagger-2">
              {t('philosophyPage.intro.paragraph2')}
            </p>
          </div>
        </div>
      </section>

      {/* The Three Flows */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-slate-900 mb-4 animate-on-scroll">{t('philosophyPage.flows.title')}</h2>
            <p className="text-slate-600 animate-on-scroll stagger-1">{t('philosophyPage.flows.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-on-scroll stagger-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('philosophyPage.flows.dataFlow.title')}</h3>
              <p className="text-slate-600 text-sm">
                {t('philosophyPage.flows.dataFlow.description')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-on-scroll stagger-2">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('philosophyPage.flows.workFlow.title')}</h3>
              <p className="text-slate-600 text-sm">
                {t('philosophyPage.flows.workFlow.description')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-on-scroll stagger-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('philosophyPage.flows.energyFlow.title')}</h3>
              <p className="text-slate-600 text-sm">
                {t('philosophyPage.flows.energyFlow.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-slide-left">
              <h2 className="text-3xl font-serif text-slate-900 mb-6">{t('philosophyPage.tech.title')}</h2>
              <p className="text-slate-600 mb-4">
                {t('philosophyPage.tech.description')}
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <BrainCircuit className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <strong className="block text-slate-900">{t('philosophyPage.tech.feature1.title')}</strong>
                    <span className="text-sm text-slate-500">{t('philosophyPage.tech.feature1.description')}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Activity className="w-5 h-5 text-teal-500 mr-3 mt-1" />
                  <div>
                    <strong className="block text-slate-900">{t('philosophyPage.tech.feature2.title')}</strong>
                    <span className="text-sm text-slate-500">{t('philosophyPage.tech.feature2.description')}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                  <div>
                    <strong className="block text-slate-900">{t('philosophyPage.tech.feature3.title')}</strong>
                    <span className="text-sm text-slate-500">{t('philosophyPage.tech.feature3.description')}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 animate-slide-right">
              <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold mb-4">{t('philosophyPage.tech.whyElixir.title')}</h3>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  {t('philosophyPage.tech.whyElixir.description')}
                </p>
                <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                  <code className="text-xs text-blue-200 font-mono block">
                    defmodule Flow do<br/>
                    &nbsp;&nbsp;def handle_traffic(millions) do<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Stream.run(millions)<br/>
                    &nbsp;&nbsp;end<br/>
                    end
                  </code>
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

export default PhilosophyPage;
