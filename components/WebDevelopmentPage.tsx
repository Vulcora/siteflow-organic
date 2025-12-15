import React, { useRef, useEffect, useState } from 'react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface WebDevelopmentPageProps {
  onNavigate: (page: Page) => void;
}

// Hook för intersection observer
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
const PerformanceIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="boltGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Bakgrundscirkel */}
    <circle cx="40" cy="40" r="35" fill="#FEF3C7" opacity="0.5">
      <animate attributeName="r" values="33;36;33" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Blixt */}
    <g filter="url(#boltGlow)">
      <path
        d="M44 15 L30 38 L38 38 L34 65 L52 35 L42 35 L48 15 Z"
        fill="url(#boltGradient)"
      >
        <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Gnistor */}
    <circle cx="25" cy="25" r="2" fill="#FBBF24">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0s" />
      <animate attributeName="r" values="1;3;1" dur="1.5s" repeatCount="indefinite" begin="0s" />
    </circle>
    <circle cx="58" cy="30" r="2" fill="#FBBF24">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
      <animate attributeName="r" values="1;3;1" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
    </circle>
    <circle cx="55" cy="55" r="2" fill="#FBBF24">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1s" />
      <animate attributeName="r" values="1;3;1" dur="1.5s" repeatCount="indefinite" begin="1s" />
    </circle>
  </svg>
);

const ResponsiveIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Desktop */}
    <g>
      <rect x="8" y="18" width="34" height="24" rx="2" fill="none" stroke="url(#deviceGradient)" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="12" y="22" width="26" height="16" rx="1" fill="#DBEAFE" />
      <rect x="18" y="42" width="22" height="3" rx="1" fill="url(#deviceGradient)" />
      {/* Skärminnehåll */}
      <rect x="14" y="24" width="10" height="2" fill="#3B82F6" opacity="0.6" />
      <rect x="14" y="28" width="22" height="1" fill="#93C5FD" />
      <rect x="14" y="31" width="18" height="1" fill="#93C5FD" />
      <rect x="14" y="34" width="20" height="1" fill="#93C5FD" />
    </g>
    {/* Tablet */}
    <g>
      <animate attributeName="transform" values="translate(0,2);translate(0,-2);translate(0,2)" dur="4s" repeatCount="indefinite" />
      <rect x="48" y="20" width="18" height="26" rx="2" fill="none" stroke="url(#deviceGradient)" strokeWidth="2">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" begin="1s" />
      </rect>
      <rect x="51" y="24" width="12" height="17" rx="1" fill="#DBEAFE" />
      <circle cx="57" cy="43" r="1.5" fill="url(#deviceGradient)" />
      {/* Skärminnehåll */}
      <rect x="52" y="26" width="6" height="1.5" fill="#3B82F6" opacity="0.6" />
      <rect x="52" y="29" width="10" height="1" fill="#93C5FD" />
      <rect x="52" y="32" width="8" height="1" fill="#93C5FD" />
    </g>
    {/* Mobil */}
    <g>
      <animate attributeName="transform" values="translate(0,-2);translate(0,2);translate(0,-2)" dur="4s" repeatCount="indefinite" begin="0.5s" />
      <rect x="52" y="50" width="12" height="20" rx="2" fill="none" stroke="url(#deviceGradient)" strokeWidth="2">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="2s" />
      </rect>
      <rect x="54" y="53" width="8" height="13" rx="1" fill="#DBEAFE" />
      <circle cx="58" cy="68" r="1" fill="url(#deviceGradient)" />
      {/* Skärminnehåll */}
      <rect x="55" y="55" width="4" height="1" fill="#3B82F6" opacity="0.6" />
      <rect x="55" y="57" width="6" height="0.5" fill="#93C5FD" />
      <rect x="55" y="59" width="5" height="0.5" fill="#93C5FD" />
    </g>
    {/* Synk-linjer */}
    <path d="M42 32 Q46 32 48 28" stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2">
      <animate attributeName="stroke-dashoffset" values="0;-8" dur="1s" repeatCount="indefinite" />
    </path>
    <path d="M66 46 Q68 50 66 54" stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2">
      <animate attributeName="stroke-dashoffset" values="0;-8" dur="1s" repeatCount="indefinite" begin="0.3s" />
    </path>
  </svg>
);

const SeoIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="seoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    </defs>
    {/* Sökfält bakgrund */}
    <rect x="10" y="28" width="48" height="24" rx="12" fill="#D1FAE5" />
    <rect x="12" y="30" width="44" height="20" rx="10" fill="white" stroke="#10B981" strokeWidth="2" />
    {/* Söktext animerad */}
    <g>
      <rect x="20" y="38" width="0" height="4" rx="2" fill="#10B981">
        <animate attributeName="width" values="0;25;25;0" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="38" width="2" height="4" fill="#10B981">
        <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="x" values="20;45;45;20" dur="4s" repeatCount="indefinite" />
      </rect>
    </g>
    {/* Förstoringsglas */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;5,-5;0,0" dur="2s" repeatCount="indefinite" />
      <circle cx="58" cy="35" r="12" fill="none" stroke="url(#seoGradient)" strokeWidth="3" />
      <line x1="66" y1="43" x2="74" y2="51" stroke="url(#seoGradient)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="35" r="8" fill="#D1FAE5" opacity="0.5">
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
    {/* Ranking-staplar */}
    <g>
      <rect x="16" y="62" width="8" height="10" rx="1" fill="#10B981" opacity="0.4">
        <animate attributeName="height" values="6;10;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y" values="66;62;66" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="58" width="8" height="14" rx="1" fill="#10B981" opacity="0.6">
        <animate attributeName="height" values="10;14;10" dur="2s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y" values="62;58;62" dur="2s" repeatCount="indefinite" begin="0.3s" />
      </rect>
      <rect x="40" y="54" width="8" height="18" rx="1" fill="#10B981" opacity="0.8">
        <animate attributeName="height" values="14;18;14" dur="2s" repeatCount="indefinite" begin="0.6s" />
        <animate attributeName="y" values="58;54;58" dur="2s" repeatCount="indefinite" begin="0.6s" />
      </rect>
      <rect x="52" y="50" width="8" height="22" rx="1" fill="url(#seoGradient)">
        <animate attributeName="height" values="18;22;18" dur="2s" repeatCount="indefinite" begin="0.9s" />
        <animate attributeName="y" values="54;50;54" dur="2s" repeatCount="indefinite" begin="0.9s" />
      </rect>
    </g>
    {/* Pil upp */}
    <path d="M68 60 L68 52 M64 56 L68 52 L72 56" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,5;0,0;0,0;0,5" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const SecurityIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Skyddscirkel */}
    <circle cx="40" cy="42" r="32" fill="none" stroke="#E9D5FF" strokeWidth="2" strokeDasharray="4,4">
      <animateTransform attributeName="transform" type="rotate" from="0 40 42" to="360 40 42" dur="20s" repeatCount="indefinite" />
    </circle>
    {/* Sköld */}
    <g filter="url(#shieldGlow)">
      <path
        d="M40 12 L58 20 L58 38 C58 52 40 64 40 64 C40 64 22 52 22 38 L22 20 Z"
        fill="url(#shieldGradient)"
      >
        <animate attributeName="d"
          values="M40 12 L58 20 L58 38 C58 52 40 64 40 64 C40 64 22 52 22 38 L22 20 Z;
                  M40 10 L60 19 L60 39 C60 54 40 66 40 66 C40 66 20 54 20 39 L20 19 Z;
                  M40 12 L58 20 L58 38 C58 52 40 64 40 64 C40 64 22 52 22 38 L22 20 Z"
          dur="3s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Inre sköld */}
    <path
      d="M40 18 L52 24 L52 36 C52 46 40 55 40 55 C40 55 28 46 28 36 L28 24 Z"
      fill="#DDD6FE"
      opacity="0.5"
    />
    {/* Checkmark */}
    <g>
      <path
        d="M32 38 L38 44 L50 30"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="30"
        strokeDashoffset="30"
      >
        <animate attributeName="stroke-dashoffset" values="30;0;0;30" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Pulsande ringar */}
    <circle cx="40" cy="40" r="25" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0">
      <animate attributeName="r" values="25;38;38" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="40" r="25" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0">
      <animate attributeName="r" values="25;38;38" dur="2s" repeatCount="indefinite" begin="1s" />
      <animate attributeName="opacity" values="0.6;0;0" dur="2s" repeatCount="indefinite" begin="1s" />
    </circle>
    {/* Lås-ikon */}
    <g transform="translate(54, 52)">
      <rect x="0" y="4" width="12" height="10" rx="2" fill="#8B5CF6" />
      <path d="M2 4 L2 2 C2 -1 10 -1 10 2 L10 4" fill="none" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="6" cy="9" r="1.5" fill="white" />
    </g>
  </svg>
);

// Tech stack logos - officiella logotyper via CDN
const techLogos = {
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  phoenix: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phoenix/phoenix-original.svg',
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
};

// Feature icon komponenter map
const featureIcons: Record<string, React.FC> = {
  performance: PerformanceIcon,
  responsive: ResponsiveIcon,
  seo: SeoIcon,
  security: SecurityIcon,
};

const WebDevelopmentPage: React.FC<WebDevelopmentPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const featuresRef = useInView(0.1);
  const techRef = useInView(0.1);
  const showcaseRef = useInView(0.1);
  const benefitsRef = useInView(0.1);

  const features = [
    {
      key: 'performance',
      title: t('webDevelopmentPage.features.performance.title'),
      description: t('webDevelopmentPage.features.performance.description'),
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    },
    {
      key: 'responsive',
      title: t('webDevelopmentPage.features.responsive.title'),
      description: t('webDevelopmentPage.features.responsive.description'),
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    },
    {
      key: 'seo',
      title: t('webDevelopmentPage.features.seo.title'),
      description: t('webDevelopmentPage.features.seo.description'),
      color: 'from-green-400 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
    },
    {
      key: 'security',
      title: t('webDevelopmentPage.features.security.title'),
      description: t('webDevelopmentPage.features.security.description'),
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    },
  ];

  const technologies = [
    {
      name: 'React',
      logo: techLogos.react,
      desc: t('webDevelopmentPage.tech.react'),
      color: 'hover:border-cyan-400 hover:shadow-cyan-100'
    },
    {
      name: 'Phoenix LiveView',
      logo: techLogos.phoenix,
      desc: t('webDevelopmentPage.tech.liveview'),
      color: 'hover:border-orange-400 hover:shadow-orange-100'
    },
    {
      name: 'Tailwind CSS',
      logo: techLogos.tailwind,
      desc: t('webDevelopmentPage.tech.tailwind'),
      color: 'hover:border-cyan-400 hover:shadow-cyan-100'
    },
    {
      name: 'TypeScript',
      logo: techLogos.typescript,
      desc: t('webDevelopmentPage.tech.typescript'),
      color: 'hover:border-blue-400 hover:shadow-blue-100'
    },
  ];

  const showcaseItems = [
    {
      title: t('webDevelopmentPage.showcase.ecommerce.title'),
      description: t('webDevelopmentPage.showcase.ecommerce.description'),
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      tags: ['React', 'E-handel', 'Headless CMS'],
    },
    {
      title: t('webDevelopmentPage.showcase.webapp.title'),
      description: t('webDevelopmentPage.showcase.webapp.description'),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tags: ['Phoenix', 'Real-time', 'Dashboard'],
    },
    {
      title: t('webDevelopmentPage.showcase.corporate.title'),
      description: t('webDevelopmentPage.showcase.corporate.description'),
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      tags: ['SEO', 'Performance', 'Tillgänglighet'],
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-slate-900 to-cyan-900/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {t('webDevelopmentPage.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t('webDevelopmentPage.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              {t('webDevelopmentPage.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
              >
                {t('webDevelopmentPage.cta.button')}
              </button>
              <button
                onClick={() => onNavigate('caseStudies')}
                className="px-8 py-4 rounded-full text-white font-semibold border border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                {t('webDevelopmentPage.cta.secondaryButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Bento Grid Style with Animated SVGs */}
      <section className="py-24 bg-white" ref={featuresRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">
              {t('webDevelopmentPage.featuresSection.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('webDevelopmentPage.featuresSection.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const IconComponent = featureIcons[feature.key];
              return (
                <div
                  key={i}
                  className={`group relative ${feature.bgColor} rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
                    featuresRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-20 h-20 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Section - Text + Image */}
      <section className="py-24 bg-slate-50" ref={showcaseRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">
              {t('webDevelopmentPage.showcaseSection.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('webDevelopmentPage.showcaseSection.subtitle')}
            </p>
          </div>

          <div className="space-y-24">
            {showcaseItems.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center ${
                  showcaseRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 150}ms`, transition: 'all 0.6s ease-out' }}
              >
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[3/2]"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900">{item.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{item.description}</p>
                  <button
                    onClick={() => onNavigate('caseStudies')}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300"
                  >
                    {t('webDevelopmentPage.showcaseSection.learnMore')}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white" ref={benefitsRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${benefitsRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transition: 'all 0.6s ease-out' }}>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
                {t('webDevelopmentPage.benefitsSection.title')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {t('webDevelopmentPage.benefitsSection.description')}
              </p>

              <div className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {t(`webDevelopmentPage.benefitsSection.benefit${num}.title`)}
                      </h4>
                      <p className="text-slate-600">
                        {t(`webDevelopmentPage.benefitsSection.benefit${num}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative ${benefitsRef.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transition: 'all 0.6s ease-out', transitionDelay: '200ms' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Cards with SVG logos */}
      <section className="py-24 bg-slate-900 relative overflow-hidden" ref={techRef.ref}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {t('webDevelopmentPage.techSection.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('webDevelopmentPage.techSection.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, i) => (
              <div
                key={i}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-opacity-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default text-center ${tech.color} ${
                  techRef.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">{tech.name}</h4>
                <p className="text-sm text-slate-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Full width gradient */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {t('webDevelopmentPage.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            {t('webDevelopmentPage.cta.description')}
          </p>

          <button
            onClick={() => onNavigate('contact')}
            className="group px-10 py-5 bg-white rounded-full text-blue-600 font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              {t('webDevelopmentPage.cta.button')}
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

export default WebDevelopmentPage;
