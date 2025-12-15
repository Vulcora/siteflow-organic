import React, { useRef, useEffect, useState } from 'react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface SystemDevelopmentPageProps {
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

// Animerade SVG-ikoner för features
const ScalabilityIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="scaleGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Graf-bakgrund */}
    <rect x="10" y="15" width="60" height="50" rx="4" fill="#F0FDFA" />
    {/* Grid-linjer */}
    <g stroke="#99F6E4" strokeWidth="0.5">
      <line x1="10" y1="30" x2="70" y2="30" />
      <line x1="10" y1="45" x2="70" y2="45" />
    </g>
    {/* Växande staplar */}
    <rect x="18" y="50" width="8" height="10" rx="2" fill="url(#scaleGradient)" opacity="0.4">
      <animate attributeName="height" values="10;15;10" dur="2s" repeatCount="indefinite" />
      <animate attributeName="y" values="50;45;50" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="30" y="40" width="8" height="20" rx="2" fill="url(#scaleGradient)" opacity="0.6">
      <animate attributeName="height" values="20;28;20" dur="2s" repeatCount="indefinite" begin="0.2s" />
      <animate attributeName="y" values="40;32;40" dur="2s" repeatCount="indefinite" begin="0.2s" />
    </rect>
    <rect x="42" y="30" width="8" height="30" rx="2" fill="url(#scaleGradient)" opacity="0.8">
      <animate attributeName="height" values="30;38;30" dur="2s" repeatCount="indefinite" begin="0.4s" />
      <animate attributeName="y" values="30;22;30" dur="2s" repeatCount="indefinite" begin="0.4s" />
    </rect>
    <rect x="54" y="22" width="8" height="38" rx="2" fill="url(#scaleGradient)">
      <animate attributeName="height" values="38;45;38" dur="2s" repeatCount="indefinite" begin="0.6s" />
      <animate attributeName="y" values="22;15;22" dur="2s" repeatCount="indefinite" begin="0.6s" />
    </rect>
    {/* Pil upp */}
    <g>
      <path d="M65 20 L65 10 M61 14 L65 10 L69 14" stroke="url(#scaleGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,5;0,0;0,0;0,5" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

const SelfHealingIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="healGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Cirkulär pil */}
    <circle cx="40" cy="40" r="28" fill="none" stroke="#CCFBF1" strokeWidth="6" />
    <path
      d="M40 12 A28 28 0 1 1 12 40"
      fill="none"
      stroke="url(#healGradient)"
      strokeWidth="6"
      strokeLinecap="round"
    >
      <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="3s" repeatCount="indefinite" />
    </path>
    {/* Pilspets */}
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="3s" repeatCount="indefinite" />
      <path d="M36 8 L40 12 L44 8" stroke="url(#healGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {/* Checkmark i mitten */}
    <circle cx="40" cy="40" r="14" fill="#F0FDFA" />
    <path
      d="M32 40 L38 46 L50 32"
      fill="none"
      stroke="url(#healGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate attributeName="stroke-dasharray" values="0,30;30,0" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

const RealtimeIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="realtimeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="realtimeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Bakgrundscirkel */}
    <circle cx="40" cy="40" r="32" fill="#FEF9C3" opacity="0.5">
      <animate attributeName="r" values="30;34;30" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Blixt */}
    <g filter="url(#realtimeGlow)">
      <path
        d="M44 15 L28 42 L38 42 L34 65 L54 34 L42 34 L48 15 Z"
        fill="url(#realtimeGradient)"
      >
        <animate attributeName="opacity" values="1;0.6;1" dur="0.4s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Pulserande vågor */}
    <circle cx="40" cy="40" r="20" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0">
      <animate attributeName="r" values="20;35;35" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="40" r="20" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0">
      <animate attributeName="r" values="20;35;35" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
      <animate attributeName="opacity" values="0.6;0;0" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
    </circle>
  </svg>
);

const CostEfficientIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="costGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    {/* Mynt-stapel */}
    <g>
      {/* Bas-mynt */}
      <ellipse cx="40" cy="58" rx="20" ry="6" fill="#BBF7D0" />
      <rect x="20" y="52" width="40" height="6" fill="#BBF7D0" />
      <ellipse cx="40" cy="52" rx="20" ry="6" fill="url(#costGradient)" />

      {/* Mynt 2 */}
      <ellipse cx="40" cy="48" rx="20" ry="6" fill="#BBF7D0">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <rect x="20" y="42" width="40" height="6" fill="#BBF7D0" />
      <ellipse cx="40" cy="42" rx="20" ry="6" fill="url(#costGradient)">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" begin="0.2s" />
      </ellipse>

      {/* Mynt 3 */}
      <ellipse cx="40" cy="38" rx="20" ry="6" fill="#BBF7D0">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" begin="0.4s" />
      </ellipse>
      <rect x="20" y="32" width="40" height="6" fill="#BBF7D0" />
      <ellipse cx="40" cy="32" rx="20" ry="6" fill="url(#costGradient)">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" begin="0.4s" />
      </ellipse>
    </g>
    {/* Pil nedåt (lägre kostnader) */}
    <g>
      <path d="M62 14 L62 26 M58 22 L62 26 L66 22" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,-3;0,3;0,-3" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Procent-symbol */}
    <text x="58" y="38" fill="#16A34A" fontSize="12" fontWeight="bold" fontFamily="Arial">%</text>
  </svg>
);

// Use case ikoner
const SaasIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="saasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Moln */}
    <path
      d="M45 38 C50 38 52 34 52 30 C52 26 48 23 44 24 C43 19 38 16 33 17 C28 18 25 22 25 27 C20 27 17 31 17 35 C17 39 20 42 25 42 L45 42 C48 42 50 40 50 38"
      fill="url(#saasGradient)"
    >
      <animate attributeName="d" dur="4s" repeatCount="indefinite"
        values="M45 38 C50 38 52 34 52 30 C52 26 48 23 44 24 C43 19 38 16 33 17 C28 18 25 22 25 27 C20 27 17 31 17 35 C17 39 20 42 25 42 L45 42 C48 42 50 40 50 38;
                M45 36 C50 36 52 32 52 28 C52 24 48 21 44 22 C43 17 38 14 33 15 C28 16 25 20 25 25 C20 25 17 29 17 33 C17 37 20 40 25 40 L45 40 C48 40 50 38 50 36;
                M45 38 C50 38 52 34 52 30 C52 26 48 23 44 24 C43 19 38 16 33 17 C28 18 25 22 25 27 C20 27 17 31 17 35 C17 39 20 42 25 42 L45 42 C48 42 50 40 50 38"/>
    </path>
    {/* Pil upp */}
    <path d="M30 50 L30 44 M27 47 L30 44 L33 47" stroke="url(#saasGradient)" strokeWidth="2" fill="none" strokeLinecap="round">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

const PortalIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Byggnad */}
    <rect x="15" y="20" width="30" height="30" rx="2" fill="url(#portalGradient)" />
    <rect x="12" y="15" width="36" height="8" rx="2" fill="url(#portalGradient)" opacity="0.8" />
    {/* Fönster */}
    <rect x="20" y="26" width="6" height="6" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="34" y="26" width="6" height="6" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" begin="0.5s" />
    </rect>
    <rect x="20" y="36" width="6" height="6" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" begin="1s" />
    </rect>
    <rect x="34" y="36" width="6" height="6" rx="1" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" begin="1.5s" />
    </rect>
    {/* Dörr */}
    <rect x="27" y="38" width="6" height="12" rx="1" fill="white" />
  </svg>
);

const IntegrationIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="integrationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Noder */}
    <circle cx="30" cy="30" r="10" fill="url(#integrationGradient)" />
    <circle cx="12" cy="18" r="6" fill="url(#integrationGradient)" opacity="0.7" />
    <circle cx="48" cy="18" r="6" fill="url(#integrationGradient)" opacity="0.7" />
    <circle cx="12" cy="42" r="6" fill="url(#integrationGradient)" opacity="0.7" />
    <circle cx="48" cy="42" r="6" fill="url(#integrationGradient)" opacity="0.7" />
    {/* Kopplingslinjer */}
    <g stroke="url(#integrationGradient)" strokeWidth="2" fill="none" strokeDasharray="4,2">
      <line x1="17" y1="21" x2="22" y2="25">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="43" y1="21" x2="38" y2="25">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" begin="0.25s" />
      </line>
      <line x1="17" y1="39" x2="22" y2="35">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" begin="0.5s" />
      </line>
      <line x1="43" y1="39" x2="38" y2="35">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" begin="0.75s" />
      </line>
    </g>
  </svg>
);

const AutomationIcon = () => (
  <svg viewBox="0 0 60 60" className="w-full h-full">
    <defs>
      <linearGradient id="automationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Kugghjul */}
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="8s" repeatCount="indefinite" />
      <circle cx="30" cy="30" r="8" fill="none" stroke="url(#automationGradient)" strokeWidth="4" />
      <circle cx="30" cy="30" r="3" fill="url(#automationGradient)" />
      {/* Kuggar */}
      <rect x="28" y="14" width="4" height="8" rx="1" fill="url(#automationGradient)" />
      <rect x="28" y="38" width="4" height="8" rx="1" fill="url(#automationGradient)" />
      <rect x="14" y="28" width="8" height="4" rx="1" fill="url(#automationGradient)" />
      <rect x="38" y="28" width="8" height="4" rx="1" fill="url(#automationGradient)" />
      <rect x="17" y="17" width="4" height="8" rx="1" fill="url(#automationGradient)" transform="rotate(45 19 21)" />
      <rect x="39" y="17" width="4" height="8" rx="1" fill="url(#automationGradient)" transform="rotate(-45 41 21)" />
      <rect x="17" y="35" width="4" height="8" rx="1" fill="url(#automationGradient)" transform="rotate(-45 19 39)" />
      <rect x="39" y="35" width="4" height="8" rx="1" fill="url(#automationGradient)" transform="rotate(45 41 39)" />
    </g>
  </svg>
);

// Feature och use case ikoner map
const featureIcons: Record<string, React.FC> = {
  scalability: ScalabilityIcon,
  selfHealing: SelfHealingIcon,
  realtime: RealtimeIcon,
  costEfficient: CostEfficientIcon,
};

const useCaseIcons: Record<string, React.FC> = {
  saas: SaasIcon,
  portal: PortalIcon,
  integration: IntegrationIcon,
  automation: AutomationIcon,
};

// Tech stack logos - officiella logotyper via CDN
const techLogos = {
  elixir: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg',
  phoenix: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phoenix/phoenix-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
};

const SystemDevelopmentPage: React.FC<SystemDevelopmentPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const featuresRef = useInView(0.1);
  const useCasesRef = useInView(0.1);
  const techRef = useInView(0.1);

  const features = [
    {
      key: 'scalability',
      title: t('systemDevelopmentPage.features.scalability.title'),
      description: t('systemDevelopmentPage.features.scalability.description'),
    },
    {
      key: 'selfHealing',
      title: t('systemDevelopmentPage.features.selfHealing.title'),
      description: t('systemDevelopmentPage.features.selfHealing.description'),
    },
    {
      key: 'realtime',
      title: t('systemDevelopmentPage.features.realtime.title'),
      description: t('systemDevelopmentPage.features.realtime.description'),
    },
    {
      key: 'costEfficient',
      title: t('systemDevelopmentPage.features.costEfficient.title'),
      description: t('systemDevelopmentPage.features.costEfficient.description'),
    },
  ];

  const useCases = [
    { key: 'saas', title: t('systemDevelopmentPage.useCases.saas.title'), desc: t('systemDevelopmentPage.useCases.saas.description') },
    { key: 'portal', title: t('systemDevelopmentPage.useCases.portal.title'), desc: t('systemDevelopmentPage.useCases.portal.description') },
    { key: 'integration', title: t('systemDevelopmentPage.useCases.integration.title'), desc: t('systemDevelopmentPage.useCases.integration.description') },
    { key: 'automation', title: t('systemDevelopmentPage.useCases.automation.title'), desc: t('systemDevelopmentPage.useCases.automation.description') },
  ];

  const techStack = [
    {
      name: 'Elixir / Phoenix',
      logo: techLogos.elixir,
      desc: t('systemDevelopmentPage.techSection.elixir'),
      bgColor: 'bg-purple-50',
    },
    {
      name: 'PostgreSQL',
      logo: techLogos.postgresql,
      desc: t('systemDevelopmentPage.techSection.postgres'),
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Ash Framework',
      logo: techLogos.phoenix,
      desc: t('systemDevelopmentPage.techSection.ash'),
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Cloud Native',
      logo: techLogos.docker,
      desc: t('systemDevelopmentPage.techSection.cloud'),
      bgColor: 'bg-sky-50',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero - Dark with animated gradient */}
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 via-slate-900 to-blue-900/50"></div>
          {/* Animated grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              {t('systemDevelopmentPage.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t('systemDevelopmentPage.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              {t('systemDevelopmentPage.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300"
              >
                {t('systemDevelopmentPage.cta.button')}
              </button>
              <button
                onClick={() => onNavigate('flowboarding')}
                className="px-8 py-4 rounded-full text-white font-semibold border border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                {t('systemDevelopmentPage.cta.secondaryButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Large cards with animated SVG icons */}
      <section className="py-24 bg-slate-50" ref={featuresRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const IconComponent = featureIcons[feature.key];
              return (
                <div
                  key={i}
                  className={`group relative bg-white rounded-3xl p-10 overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                    featuresRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 mb-6">
                      <IconComponent />
                    </div>
                    <h3 className="text-2xl font-serif text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases - With animated SVG icons */}
      <section className="py-24 bg-slate-900" ref={useCasesRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {t('systemDevelopmentPage.useCasesSection.title')}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('systemDevelopmentPage.useCasesSection.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, i) => {
              const IconComponent = useCaseIcons[useCase.key];
              return (
                <div
                  key={i}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 hover:bg-slate-800 transition-all duration-300 ${
                    useCasesRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 mb-4">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                  <p className="text-slate-400 text-sm">{useCase.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack - With official logos */}
      <section className="py-24 bg-white" ref={techRef.ref}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${techRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transition: 'all 0.6s ease-out' }}>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
                {t('systemDevelopmentPage.techSection.title')}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {t('systemDevelopmentPage.techSection.subtitle')}
              </p>

              <div className="space-y-6">
                {techStack.map((tech, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 ${
                      techRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
                    }`}
                    style={{ transition: 'all 0.4s ease-out', transitionDelay: `${i * 100 + 200}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${tech.bgColor} flex items-center justify-center flex-shrink-0 p-2`}>
                      <img src={tech.logo} alt={tech.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{tech.name}</h4>
                      <p className="text-slate-600 text-sm">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual representation */}
            <div className={`relative ${techRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transition: 'all 0.6s ease-out', transitionDelay: '300ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                  <code>{`defmodule MyApp.User do
  use Ash.Resource

  attributes do
    uuid_primary_key :id
    attribute :email, :string
    attribute :name, :string
  end

  actions do
    defaults [:create, :read, :update]
  end
end`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {t('systemDevelopmentPage.cta.title')}
          </h2>
          <p className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto">
            {t('systemDevelopmentPage.cta.description')}
          </p>

          <button
            onClick={() => onNavigate('contact')}
            className="group px-10 py-5 bg-white rounded-full text-teal-600 font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              {t('systemDevelopmentPage.cta.button')}
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

export default SystemDevelopmentPage;
