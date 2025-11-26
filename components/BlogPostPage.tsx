import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';
import { getBlogPostBySlug } from '../data/blogPosts';
import AuthorCard from './AuthorCard';
import TableOfContents from './TableOfContents';
import CTA from './CTA';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate, onBack }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const post = getBlogPostBySlug(slug);

  // SEO: Dynamic meta tags and structured data
  useEffect(() => {
    if (!post) return;

    const siteUrl = 'https://siteflow.se';
    const postUrl = `${siteUrl}/blogg/${post.slug}`;
    const imageUrl = post.heroImage.src.startsWith('http')
      ? post.heroImage.src
      : `${siteUrl}${post.heroImage.src}`;

    // Update document title
    document.title = `${post.title[lang]} | Siteflow Blogg`;

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
    setMetaTag('description', post.excerpt[lang]);
    setMetaTag('author', post.author.name);
    setMetaTag('keywords', post.tags.join(', '));

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', postUrl);

    // Open Graph tags
    setMetaTag('og:title', post.title[lang], true);
    setMetaTag('og:description', post.excerpt[lang], true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:url', postUrl, true);
    setMetaTag('og:type', 'article', true);
    setMetaTag('og:site_name', 'Siteflow', true);
    setMetaTag('og:locale', lang === 'sv' ? 'sv_SE' : 'en_US', true);
    setMetaTag('article:published_time', post.publishDate, true);
    setMetaTag('article:author', post.author.name, true);
    post.tags.forEach((tag, i) => setMetaTag(`article:tag:${i}`, tag, true));

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', post.title[lang]);
    setMetaTag('twitter:description', post.excerpt[lang]);
    setMetaTag('twitter:image', imageUrl);

    // JSON-LD Structured Data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title[lang],
      'description': post.excerpt[lang],
      'image': imageUrl,
      'datePublished': post.publishDate,
      'dateModified': post.publishDate,
      'author': {
        '@type': 'Person',
        'name': post.author.name,
        'jobTitle': post.author.role[lang]
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
        '@id': postUrl
      },
      'wordCount': post.sections.reduce((acc, s) => acc + s.content[lang].split(' ').length, 0),
      'timeRequired': `PT${post.readTimeMinutes}M`,
      'keywords': post.tags.join(', '),
      'articleSection': post.tags[0] || 'Technology',
      'inLanguage': lang === 'sv' ? 'sv-SE' : 'en-US'
    };

    let scriptTag = document.querySelector('script[data-blog-jsonld]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-blog-jsonld', 'true');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    // Cleanup on unmount
    return () => {
      document.title = 'Blogg | Siteflow';
      // Remove JSON-LD
      const ldScript = document.querySelector('script[data-blog-jsonld]');
      if (ldScript) ldScript.remove();
    };
  }, [post, lang]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Post not found</h1>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700"
          >
            {t('blog.backToList')}
          </button>
        </div>
      </div>
    );
  }

  // Format date for display and datetime attribute
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="min-h-screen" itemScope itemType="https://schema.org/BlogPosting">
      {/* Hidden SEO metadata */}
      <meta itemProp="headline" content={post.title[lang]} />
      <meta itemProp="description" content={post.excerpt[lang]} />
      <meta itemProp="datePublished" content={post.publishDate} />
      <meta itemProp="author" content={post.author.name} />

      {/* Hero Section */}
      <header className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={post.heroImage.src}
            alt={post.heroImage.alt[lang]}
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
              <span>{t('blog.backToList')}</span>
            </button>
          </nav>

          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Artikeltaggar">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl md:text-5xl font-serif mb-6 leading-tight animate-fade-in"
              itemProp="name"
            >
              {post.title[lang]}
            </h1>

            {/* Meta info with semantic markup */}
            <div className="flex flex-wrap items-center gap-6 text-slate-300">
              <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="font-medium text-white" itemProp="name">{post.author.name}</span>
                  <span className="block text-sm text-slate-400" itemProp="jobTitle">{post.author.role[lang]}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <time
                  dateTime={post.publishDate}
                  className="flex items-center gap-1.5"
                  itemProp="datePublished"
                >
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishDate)}
                </time>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTimeMinutes} {t('blog.readTime')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Table of Contents - Sticky sidebar (desktop only) */}
            <aside className="hidden lg:block lg:w-64 shrink-0" aria-label="Innehållsförteckning">
              <TableOfContents sections={post.sections} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl" itemProp="articleBody">
              {post.sections.map((section, index) => (
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
                      // Check if paragraph starts with bullet points
                      if (paragraph.includes('\n•') || paragraph.startsWith('•')) {
                        const lines = paragraph.split('\n');
                        const intro = lines[0].startsWith('•') ? null : lines[0];
                        const items = lines.filter(l => l.startsWith('•'));

                        return (
                          <div key={pIndex} className="mb-4">
                            {intro && <p className="text-slate-600 leading-relaxed mb-3">{intro}</p>}
                            <ul className="space-y-2 text-slate-600 list-none">
                              {items.map((item, iIndex) => (
                                <li key={iIndex} className="flex items-start">
                                  <span className="text-blue-500 mr-3 mt-1.5" aria-hidden="true">•</span>
                                  <span>{item.replace('• ', '')}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      // Check if it's a numbered list
                      if (/^\d+\./.test(paragraph)) {
                        const items = paragraph.split('\n').filter(l => l.trim());
                        return (
                          <ol key={pIndex} className="space-y-3 text-slate-600 mb-4 list-decimal list-inside">
                            {items.map((item, iIndex) => (
                              <li key={iIndex} className="leading-relaxed">
                                {item.replace(/^\d+\.\s*/, '')}
                              </li>
                            ))}
                          </ol>
                        );
                      }

                      // Check if it's a quote (starts with ")
                      if (paragraph.startsWith('"') || paragraph.startsWith('"')) {
                        return (
                          <blockquote key={pIndex} className="border-l-4 border-blue-500 pl-6 my-6 italic text-slate-700">
                            {paragraph}
                          </blockquote>
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA onNavigate={onNavigate} />
    </article>
  );
};

export default BlogPostPage;
