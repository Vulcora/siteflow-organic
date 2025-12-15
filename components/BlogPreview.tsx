import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock } from 'lucide-react';
import { getBlogPostBySlug, BlogPost } from '../data/blogPosts';
import { Page } from '../types';

// Featured posts to display on the landing page
const FEATURED_SLUGS = ['system-som-haller', 'system-zoo', 'tekniken-bakom-siteflow'];

interface BlogPreviewProps {
  onNavigate: (page: Page) => void;
  onSelectPost: (slug: string) => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ onNavigate, onSelectPost }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  // Get specific featured blog posts
  const posts = FEATURED_SLUGS
    .map(slug => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== undefined);
  const [featuredPost, ...secondaryPosts] = posts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === 'sv' ? 'sv-SE' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  const handlePostClick = (post: BlogPost) => {
    onSelectPost(post.slug);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-3 block animate-fade-in">
            {t('blogPreview.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 animate-on-scroll">
            {t('blogPreview.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-on-scroll stagger-1">
            {t('blogPreview.description')}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* Featured Post - Large Card (spans 2 columns on lg) */}
          {featuredPost && (
            <article
              onClick={() => handlePostClick(featuredPost)}
              className="lg:col-span-2 lg:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer animate-slide-left"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={featuredPost.heroImage.src}
                  alt={featuredPost.heroImage.alt[lang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20" />
              </div>

              {/* Content Overlay */}
              <div className="relative h-full min-h-[400px] lg:min-h-[500px] flex flex-col justify-end p-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {featuredPost.title[lang]}
                </h3>

                {/* Excerpt */}
                <p className="text-white/80 text-base md:text-lg mb-6 line-clamp-2 max-w-2xl">
                  {featuredPost.excerpt[lang]}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                      loading="lazy"
                    />
                    <span className="font-medium text-white/90">{featuredPost.author.name}</span>
                  </div>
                  <span className="text-white/50">·</span>
                  <span>{formatDate(featuredPost.publishDate)}</span>
                  <span className="text-white/50">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTimeMinutes} {t('blogPreview.minRead')}</span>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Secondary Posts - Stacked on the right */}
          {secondaryPosts.map((post, index) => (
            <article
              key={post.slug}
              onClick={() => handlePostClick(post)}
              className={`bg-slate-50 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-right stagger-${index + 1}`}
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={post.heroImage.src}
                  alt={post.heroImage.alt[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title[lang]}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{formatDate(post.publishDate)}</span>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTimeMinutes} {t('blogPreview.minRead')}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center animate-on-scroll stagger-3">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:gap-4 group"
          >
            {t('blogPreview.viewAll')}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
