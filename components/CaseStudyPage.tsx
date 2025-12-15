import React, { useEffect } from 'react';
import { ArrowLeft, Building2, Clock, Quote, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';
import { getCaseStudyBySlug } from '../data/caseStudies';
import MetricsDisplay from './MetricsDisplay';
import CTA from './CTA';

interface CaseStudyPageProps {
  slug: string;
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug, onNavigate, onBack }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const caseStudy = getCaseStudyBySlug(slug);

  // SEO: Dynamic meta tags and structured data
  useEffect(() => {
    if (!caseStudy) return;

    const siteUrl = 'https://siteflow.se';
    const caseUrl = `${siteUrl}/kundcase/${caseStudy.slug}`;
    const imageUrl = caseStudy.heroImage.src.startsWith('http')
      ? caseStudy.heroImage.src
      : `${siteUrl}${caseStudy.heroImage.src}`;

    // Update document title
    document.title = `${caseStudy.title[lang]} | Siteflow Kundcase`;

    // Helper to create/update meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', caseStudy.excerpt[lang]);
    setMetaTag('keywords', [...caseStudy.tags, caseStudy.client.industry[lang]].join(', '));

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', caseUrl);

    // Open Graph tags
    setMetaTag('og:title', caseStudy.title[lang], true);
    setMetaTag('og:description', caseStudy.excerpt[lang], true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:url', caseUrl, true);
    setMetaTag('og:type', 'article', true);
    setMetaTag('og:site_name', 'Siteflow', true);
    setMetaTag('og:locale', lang === 'sv' ? 'sv_SE' : 'en_US', true);
    setMetaTag('article:published_time', caseStudy.publishDate, true);
    caseStudy.tags.forEach((tag, i) => setMetaTag(`article:tag:${i}`, tag, true));

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', caseStudy.title[lang]);
    setMetaTag('twitter:description', caseStudy.excerpt[lang]);
    setMetaTag('twitter:image', imageUrl);

    // JSON-LD Structured Data - Using Article schema for case studies
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': caseStudy.title[lang],
      'description': caseStudy.excerpt[lang],
      'image': imageUrl,
      'datePublished': caseStudy.publishDate,
      'dateModified': caseStudy.publishDate,
      'author': {
        '@type': 'Organization',
        'name': 'Siteflow',
        'url': siteUrl
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Siteflow',
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/logo.png`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': caseUrl
      },
      'about': {
        '@type': 'Thing',
        'name': caseStudy.client.industry[lang]
      },
      'keywords': caseStudy.tags.join(', '),
      'articleSection': 'Case Study',
      'inLanguage': lang === 'sv' ? 'sv-SE' : 'en-US'
    };

    let scriptTag = document.querySelector('script[data-casestudy-jsonld]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-casestudy-jsonld', 'true');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    // Cleanup on unmount
    return () => {
      document.title = 'Kundcase | Siteflow';
      const ldScript = document.querySelector('script[data-casestudy-jsonld]');
      if (ldScript) ldScript.remove();
    };
  }, [caseStudy, lang]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Case study not found</h1>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700"
          >
            {t('caseStudies.backToList')}
          </button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="min-h-screen" itemScope itemType="https://schema.org/Article">
      {/* Hidden SEO metadata */}
      <meta itemProp="headline" content={caseStudy.title[lang]} />
      <meta itemProp="description" content={caseStudy.excerpt[lang]} />
      <meta itemProp="datePublished" content={caseStudy.publishDate} />

      {/* Hero Section */}
      <header className="bg-slate-900 text-white pt-32 pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={caseStudy.heroImage.src}
            alt={caseStudy.heroImage.alt[lang]}
            className="w-full h-full object-cover opacity-20"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          {/* Back button */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{t('caseStudies.backToList')}</span>
            </button>
          </nav>

          <div>
            {/* Industry Badge & Duration */}
            <div className="flex flex-wrap items-center gap-3 mb-4" role="list" aria-label="Case study metadata">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium"
                role="listitem"
              >
                <Building2 className="w-3 h-3" aria-hidden="true" />
                <span itemProp="about">{caseStudy.client.industry[lang]}</span>
              </span>
              {caseStudy.duration && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium"
                  role="listitem"
                >
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {caseStudy.duration[lang]}
                </span>
              )}
              <time
                dateTime={caseStudy.publishDate}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium"
                itemProp="datePublished"
                role="listitem"
              >
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {formatDate(caseStudy.publishDate)}
              </time>
            </div>

            {/* Client Name */}
            <div className="text-slate-400 text-sm mb-2">
              {caseStudy.client.name || t('caseStudies.anonymous')}
              {caseStudy.client.size && ` · ${caseStudy.client.size[lang]}`}
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-serif mb-8 leading-tight animate-fade-in"
              itemProp="name"
            >
              {caseStudy.title[lang]}
            </h1>

            {/* Metrics */}
            <MetricsDisplay metrics={caseStudy.metrics} variant="hero" />
          </div>
        </div>
      </header>

      {/* Challenge & Solution Summary */}
      <section className="py-16 bg-slate-50" aria-labelledby="challenge-solution-heading">
        <h2 id="challenge-solution-heading" className="sr-only">
          {lang === 'sv' ? 'Utmaning och lösning' : 'Challenge and Solution'}
        </h2>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Challenge */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold" aria-hidden="true">1</span>
                {t('caseStudies.challenge')}
              </h3>
              <p className="text-slate-600 leading-relaxed">{caseStudy.challenge[lang]}</p>
            </div>

            {/* Solution */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold" aria-hidden="true">2</span>
                {t('caseStudies.solution')}
              </h3>
              <p className="text-slate-600 leading-relaxed">{caseStudy.solution[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0" aria-label={lang === 'sv' ? 'Projektinformation' : 'Project information'}>
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Services */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    {t('caseStudies.services')}
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.services.map((service, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" aria-hidden="true"></span>
                        {service[lang]}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    {t('caseStudies.technologies')}
                  </h3>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                    {caseStudy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200"
                        role="listitem"
                        itemProp="keywords"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Client Info */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    {t('caseStudies.industry')}
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{lang === 'sv' ? 'Bransch' : 'Industry'}:</dt>
                      <dd className="text-slate-700">{caseStudy.client.industry[lang]}</dd>
                    </div>
                    {caseStudy.client.size && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">{lang === 'sv' ? 'Storlek' : 'Size'}:</dt>
                        <dd className="text-slate-700">{caseStudy.client.size[lang]}</dd>
                      </div>
                    )}
                    {caseStudy.duration && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">{t('caseStudies.duration')}:</dt>
                        <dd className="text-slate-700">{caseStudy.duration[lang]}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1" itemProp="articleBody">
              {caseStudy.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-12 animate-on-scroll"
                  aria-labelledby={section.heading[lang] ? `heading-${section.id}` : undefined}
                >
                  {section.heading[lang] && (
                    <h2
                      id={`heading-${section.id}`}
                      className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6"
                    >
                      {section.heading[lang]}
                    </h2>
                  )}

                  {/* Render content with proper formatting */}
                  <div className="prose prose-lg prose-slate max-w-none">
                    {section.content[lang].split('\n\n').map((paragraph, pIndex) => {
                      // Helper function to parse bold markdown
                      const parseBold = (text: string) => {
                        if (!text.includes('**')) return text;
                        const parts = text.split(/\*\*(.*?)\*\*/g);
                        return parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="font-bold text-slate-900">{part}</strong>
                          ) : (
                            part
                          )
                        );
                      };

                      // Check if paragraph starts with bullet points
                      if (paragraph.includes('\n•') || paragraph.startsWith('•')) {
                        const lines = paragraph.split('\n');
                        const intro = lines[0].startsWith('•') ? null : lines[0];
                        const items = lines.filter(l => l.startsWith('•'));

                        return (
                          <div key={pIndex} className="mb-4">
                            {intro && <p className="text-slate-600 leading-relaxed mb-3">{parseBold(intro)}</p>}
                            <ul className="space-y-2 text-slate-600 list-none">
                              {items.map((item, iIndex) => (
                                <li key={iIndex} className="flex items-start">
                                  <span className="text-blue-500 mr-3 mt-1.5" aria-hidden="true">•</span>
                                  <span>{parseBold(item.replace('• ', ''))}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      // Check if it contains bold text (**text**)
                      if (paragraph.includes('**')) {
                        return (
                          <p key={pIndex} className="text-slate-600 leading-relaxed mb-4">
                            {parseBold(paragraph)}
                          </p>
                        );
                      }

                      // Regular paragraph
                      return (
                        <p key={pIndex} className="text-slate-600 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Section Image with figure and figcaption for SEO */}
                  {section.image && (
                    <figure className="my-10">
                      <img
                        src={section.image.src}
                        alt={section.image.alt[lang]}
                        className="rounded-xl shadow-lg w-full"
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption className="sr-only">{section.image.alt[lang]}</figcaption>
                    </figure>
                  )}
                </section>
              ))}

              {/* Testimonial */}
              {caseStudy.testimonial && (
                <aside
                  className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 my-12"
                  aria-labelledby="testimonial-heading"
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <h2 id="testimonial-heading" className="sr-only">{t('caseStudies.testimonial')}</h2>
                  <Quote className="w-10 h-10 text-blue-400 mb-6" aria-hidden="true" />
                  <blockquote
                    className="text-xl md:text-2xl font-serif leading-relaxed mb-6"
                    itemProp="reviewBody"
                  >
                    "{caseStudy.testimonial.quote[lang]}"
                  </blockquote>
                  <div className="flex items-center gap-4" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <div
                      className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 font-bold"
                      aria-hidden="true"
                    >
                      {caseStudy.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold" itemProp="name">{caseStudy.testimonial.author}</div>
                      <div className="text-slate-400 text-sm" itemProp="jobTitle">{caseStudy.testimonial.role[lang]}</div>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA onNavigate={onNavigate} />
    </article>
  );
};

export default CaseStudyPage;
