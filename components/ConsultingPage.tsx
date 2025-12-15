import React, { useRef, useEffect, useState } from 'react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface ConsultingPageProps {
  onNavigate: (page: Page) => void;
}

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Animerade SVG-ikoner för konsulttjänster
const AuditIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="auditGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Förstoringsglas */}
    <circle cx="26" cy="26" r="14" fill="none" stroke="url(#auditGradient)" strokeWidth="4">
      <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="26" cy="26" r="8" fill="#EDE9FE" />
    <line x1="36" y1="36" x2="48" y2="48" stroke="url(#auditGradient)" strokeWidth="4" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" values="0 42 42;5 42 42;0 42 42" dur="2s" repeatCount="indefinite" />
    </line>
    {/* Checkmarks inne i förstoringsglaset */}
    <path d="M20 26 L24 30 L32 22" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

const ArchitectureIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="archGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Byggnad/struktur */}
    <rect x="10" y="35" width="40" height="18" rx="2" fill="url(#archGradient)" />
    <rect x="15" y="22" width="30" height="15" rx="2" fill="url(#archGradient)" opacity="0.8" />
    <rect x="22" y="12" width="16" height="12" rx="2" fill="url(#archGradient)" opacity="0.6" />
    {/* Ritnings-linjer */}
    <path d="M5 30 L55 30" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="4,2">
      <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M5 42 L55 42" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="4,2">
      <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" begin="0.3s" />
    </path>
    {/* Fönster */}
    <rect x="18" y="40" width="6" height="8" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="36" y="40" width="6" height="8" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" begin="0.5s" />
    </rect>
  </svg>
);

const ScalingIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="scalingGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Graf bakgrund */}
    <rect x="8" y="10" width="44" height="40" rx="3" fill="#EDE9FE" opacity="0.5" />
    {/* Växande linje */}
    <path d="M12 45 Q20 40, 25 35 T38 20 T52 12" fill="none" stroke="url(#scalingGradient)" strokeWidth="3" strokeLinecap="round">
      <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Datapunkter */}
    <circle cx="12" cy="45" r="3" fill="#8B5CF6">
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="25" cy="35" r="3" fill="#8B5CF6">
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.3s" />
    </circle>
    <circle cx="38" cy="20" r="3" fill="#8B5CF6">
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.6s" />
    </circle>
    <circle cx="52" cy="12" r="3" fill="#8B5CF6">
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.9s" />
    </circle>
    {/* Pil upp */}
    <path d="M50 18 L50 8 M46 12 L50 8 L54 12" stroke="url(#scalingGradient)" strokeWidth="2" fill="none" strokeLinecap="round">
      <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const TrainingIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="trainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Bok/lärobok */}
    <path d="M10 15 L30 10 L50 15 L50 50 L30 45 L10 50 Z" fill="url(#trainGradient)" />
    <path d="M30 10 L30 45" stroke="white" strokeWidth="2" />
    {/* Sidor */}
    <path d="M12 18 L28 14" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M12 24 L28 20" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M12 30 L28 26" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M32 14 L48 18" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M32 20 L48 24" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M32 26 L48 30" stroke="white" strokeWidth="1" opacity="0.5" />
    {/* Ljus/kunskap */}
    <circle cx="30" cy="5" r="0" fill="#FBBF24">
      <animate attributeName="r" values="0;6;0" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Studentmössa */}
    <path d="M30 2 L42 8 L30 14 L18 8 Z" fill="#8B5CF6">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    {/* Pratbubbla */}
    <path d="M10 15 L50 15 Q55 15, 55 20 L55 38 Q55 43, 50 43 L25 43 L15 52 L15 43 L10 43 Q5 43, 5 38 L5 20 Q5 15, 10 15" fill="white" opacity="0.9" />
    {/* Prickar för att visa pågående konversation */}
    <circle cx="20" cy="29" r="3" fill="#8B5CF6">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="30" cy="29" r="3" fill="#8B5CF6">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
    </circle>
    <circle cx="40" cy="29" r="3" fill="#8B5CF6">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
    </circle>
  </svg>
);

// Service ikoner map
const serviceIcons: Record<string, React.FC> = {
  audit: AuditIcon,
  architecture: ArchitectureIcon,
  scaling: ScalingIcon,
  training: TrainingIcon,
};

const ConsultingPage: React.FC<ConsultingPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const servicesRef = useInView(0.1);
  const approachRef = useInView(0.1);
  const benefitsRef = useInView(0.1);

  const services = [
    { key: 'audit', title: t('consultingPage.services.audit.title'), desc: t('consultingPage.services.audit.description') },
    { key: 'architecture', title: t('consultingPage.services.architecture.title'), desc: t('consultingPage.services.architecture.description') },
    { key: 'scaling', title: t('consultingPage.services.scaling.title'), desc: t('consultingPage.services.scaling.description') },
    { key: 'training', title: t('consultingPage.services.training.title'), desc: t('consultingPage.services.training.description') },
  ];

  const approach = [
    { num: '01', title: t('consultingPage.approach.step1.title'), desc: t('consultingPage.approach.step1.description') },
    { num: '02', title: t('consultingPage.approach.step2.title'), desc: t('consultingPage.approach.step2.description') },
    { num: '03', title: t('consultingPage.approach.step3.title'), desc: t('consultingPage.approach.step3.description') },
    { num: '04', title: t('consultingPage.approach.step4.title'), desc: t('consultingPage.approach.step4.description') },
  ];

  const benefits = [
    t('consultingPage.benefits.item1'),
    t('consultingPage.benefits.item2'),
    t('consultingPage.benefits.item3'),
    t('consultingPage.benefits.item4'),
    t('consultingPage.benefits.item5'),
    t('consultingPage.benefits.item6'),
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-slate-900 to-indigo-900/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              {t('consultingPage.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t('consultingPage.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              {t('consultingPage.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
              >
                {t('consultingPage.cta.button')}
              </button>
              <button
                onClick={() => onNavigate('caseStudies')}
                className="px-8 py-4 rounded-full text-white font-semibold border border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                {t('consultingPage.cta.secondaryButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services - Large icon cards */}
      <section className="py-24 bg-white" ref={servicesRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const IconComponent = serviceIcons[service.key];
              return (
                <div
                  key={i}
                  className={`group flex gap-6 p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-500 ${
                    servicesRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-16 h-16 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach - Numbered steps with connecting line */}
      <section className="py-24 bg-slate-50" ref={approachRef.ref}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 text-center mb-16">
            {t('consultingPage.approachSection.title')}
          </h2>

          <div className="relative">
            {/* Horizontal line on desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>

            <div className="grid md:grid-cols-4 gap-8">
              {approach.map((step, i) => (
                <div
                  key={i}
                  className={`relative text-center transition-all duration-500 ${
                    approachRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Two column with card */}
      <section className="py-24 bg-white" ref={benefitsRef.ref}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
                {t('consultingPage.benefitsSection.title')}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {t('consultingPage.benefitsSection.subtitle')}
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 transition-all duration-500 ${
                      benefitsRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className={`bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl transition-all duration-700 ${
              benefitsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="w-16 h-16 mb-6">
                <ChatIcon />
              </div>
              <h3 className="text-2xl font-serif mb-4">{t('consultingPage.benefitsSection.cardTitle')}</h3>
              <p className="text-purple-100 mb-8">{t('consultingPage.benefitsSection.cardDescription')}</p>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-4 bg-white rounded-full text-purple-600 font-semibold hover:shadow-lg transition-all duration-300"
              >
                {t('consultingPage.benefitsSection.cardButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Simple and clean */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {t('consultingPage.cta.title')}
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            {t('consultingPage.cta.description')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                {t('consultingPage.cta.button')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onNavigate('caseStudies')}
              className="px-10 py-5 rounded-full text-white font-semibold text-lg border border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              {t('consultingPage.cta.secondaryButton')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultingPage;
