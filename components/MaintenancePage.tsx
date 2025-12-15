import React, { useRef, useEffect, useState } from 'react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface MaintenancePageProps {
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

// Animated SVG Icons
const MonitoringIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="monitoringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    {/* Eye outline */}
    <path
      d="M40 25C25 25 15 40 15 40S25 55 40 55S65 40 65 40S55 25 40 25Z"
      fill="none"
      stroke="url(#monitoringGrad)"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <animate attributeName="stroke-dasharray" values="0,200;150,200;0,200" dur="3s" repeatCount="indefinite" />
    </path>
    {/* Pupil */}
    <circle cx="40" cy="40" r="8" fill="url(#monitoringGrad)">
      <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Scanning line */}
    <line x1="20" y1="40" x2="60" y2="40" stroke="#F97316" strokeWidth="2" opacity="0.5">
      <animate attributeName="y1" values="30;50;30" dur="2s" repeatCount="indefinite" />
      <animate attributeName="y2" values="30;50;30" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
    </line>
  </svg>
);

const UpdatesIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="updatesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    {/* Download box/package */}
    <rect x="22" y="30" width="36" height="32" rx="4" fill="none" stroke="url(#updatesGrad)" strokeWidth="3" />
    <path d="M22 42 L58 42" stroke="url(#updatesGrad)" strokeWidth="3" />
    {/* Arrow pointing down into box */}
    <g>
      <path d="M40 12 L40 36" stroke="url(#updatesGrad)" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d" values="M40 8 L40 32;M40 16 L40 40;M40 8 L40 32" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M32 28 L40 36 L48 28" fill="none" stroke="url(#updatesGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="d" values="M32 24 L40 32 L48 24;M32 32 L40 40 L48 32;M32 24 L40 32 L48 24" dur="1.5s" repeatCount="indefinite" />
      </path>
      <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
    </g>
    {/* Version dots */}
    <circle cx="32" cy="52" r="3" fill="url(#updatesGrad)">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="52" r="3" fill="url(#updatesGrad)">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.3s" />
    </circle>
    <circle cx="48" cy="52" r="3" fill="url(#updatesGrad)">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.6s" />
    </circle>
  </svg>
);

const SecurityIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    {/* Shield */}
    <path
      d="M40 12L18 22V38C18 52 28 62 40 68C52 62 62 52 62 38V22L40 12Z"
      fill="none"
      stroke="url(#securityGrad)"
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Checkmark */}
    <path
      d="M28 40L36 48L52 32"
      fill="none"
      stroke="url(#securityGrad)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate attributeName="stroke-dasharray" values="0,50;50,0" dur="1.5s" repeatCount="indefinite" />
    </path>
    {/* Glow effect */}
    <path
      d="M40 12L18 22V38C18 52 28 62 40 68C52 62 62 52 62 38V22L40 12Z"
      fill="url(#securityGrad)"
      opacity="0.1"
    >
      <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const SupportIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="supportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    {/* Headphone band */}
    <path
      d="M20 45C20 32 28 22 40 22S60 32 60 45"
      fill="none"
      stroke="url(#supportGrad)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Left ear cup */}
    <rect x="14" y="40" width="12" height="18" rx="4" fill="url(#supportGrad)">
      <animate attributeName="y" values="40;42;40" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Right ear cup */}
    <rect x="54" y="40" width="12" height="18" rx="4" fill="url(#supportGrad)">
      <animate attributeName="y" values="40;42;40" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Sound waves left */}
    <path d="M10 46C6 49 6 53 10 56" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0;0.6;0" dur="1.5s" repeatCount="indefinite" />
    </path>
    {/* Sound waves right */}
    <path d="M70 46C74 49 74 53 70 56" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0;0.6;0" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
    </path>
  </svg>
);

const featureIcons: Record<string, React.FC> = {
  monitoring: MonitoringIcon,
  updates: UpdatesIcon,
  security: SecurityIcon,
  support: SupportIcon,
};

const MaintenancePage: React.FC<MaintenancePageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const featuresRef = useInView(0.1);
  const plansRef = useInView(0.1);

  const features = [
    { iconKey: 'monitoring', title: t('maintenancePage.features.monitoring.title'), desc: t('maintenancePage.features.monitoring.description') },
    { iconKey: 'updates', title: t('maintenancePage.features.updates.title'), desc: t('maintenancePage.features.updates.description') },
    { iconKey: 'security', title: t('maintenancePage.features.security.title'), desc: t('maintenancePage.features.security.description') },
    { iconKey: 'support', title: t('maintenancePage.features.support.title'), desc: t('maintenancePage.features.support.description') },
  ];

  const plans = [
    {
      name: t('maintenancePage.plans.basic.name'),
      description: t('maintenancePage.plans.basic.description'),
      features: [
        t('maintenancePage.plans.basic.feature1'),
        t('maintenancePage.plans.basic.feature2'),
        t('maintenancePage.plans.basic.feature3'),
        t('maintenancePage.plans.basic.feature4'),
      ],
      highlighted: false,
    },
    {
      name: t('maintenancePage.plans.professional.name'),
      description: t('maintenancePage.plans.professional.description'),
      features: [
        t('maintenancePage.plans.professional.feature1'),
        t('maintenancePage.plans.professional.feature2'),
        t('maintenancePage.plans.professional.feature3'),
        t('maintenancePage.plans.professional.feature4'),
        t('maintenancePage.plans.professional.feature5'),
      ],
      highlighted: true,
    },
    {
      name: t('maintenancePage.plans.enterprise.name'),
      description: t('maintenancePage.plans.enterprise.description'),
      features: [
        t('maintenancePage.plans.enterprise.feature1'),
        t('maintenancePage.plans.enterprise.feature2'),
        t('maintenancePage.plans.enterprise.feature3'),
        t('maintenancePage.plans.enterprise.feature4'),
        t('maintenancePage.plans.enterprise.feature5'),
        t('maintenancePage.plans.enterprise.feature6'),
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-slate-900 to-red-900/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              {t('maintenancePage.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t('maintenancePage.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              {t('maintenancePage.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300"
              >
                {t('maintenancePage.cta.button')}
              </button>
              <button
                onClick={() => onNavigate('flowboarding')}
                className="px-8 py-4 rounded-full text-white font-semibold border border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                {t('maintenancePage.cta.secondaryButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Icon grid */}
      <section className="py-24 bg-white" ref={featuresRef.ref}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const IconComponent = featureIcons[feature.iconKey];
              return (
                <div
                  key={i}
                  className={`text-center transition-all duration-500 ${
                    featuresRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-3">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans - Pricing cards */}
      <section className="py-24 bg-slate-50" ref={plansRef.ref}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 text-center mb-4">
            {t('maintenancePage.plansSection.title')}
          </h2>
          <p className="text-slate-600 text-center text-lg mb-16 max-w-2xl mx-auto">
            {t('maintenancePage.plansSection.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl transition-all duration-500 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white p-[2px]'
                    : 'bg-white border border-slate-200'
                } ${plansRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`h-full rounded-3xl p-8 ${plan.highlighted ? 'bg-gradient-to-br from-orange-500 to-red-500' : ''}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-4 bg-white text-orange-600 text-sm font-semibold rounded-full shadow-lg border-2 border-orange-500">
                      {t('maintenancePage.mostPopular')}
                    </div>
                  )}

                  <h3 className={`text-2xl font-serif mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-6 text-sm ${plan.highlighted ? 'text-orange-100' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-orange-500'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm ${plan.highlighted ? 'text-orange-100' : 'text-slate-600'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onNavigate('contact')}
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-white text-orange-600 hover:shadow-lg'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                    }`}
                  >
                    {t('maintenancePage.plansSection.button')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-orange-600 via-orange-700 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {t('maintenancePage.cta.title')}
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
            {t('maintenancePage.cta.description')}
          </p>

          <button
            onClick={() => onNavigate('contact')}
            className="group px-10 py-5 bg-white rounded-full text-orange-600 font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              {t('maintenancePage.cta.button')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default MaintenancePage;
