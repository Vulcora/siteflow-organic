import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Page } from '../types';
import { getAllBlogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';
import CTA from './CTA';

interface BlogPageProps {
  onNavigate: (page: Page) => void;
  onSelectPost: (slug: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectPost }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const allPosts = getAllBlogPosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const postsPerPage = isMobile ? 3 : 6;

  // Filter posts based on search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts;

    const query = searchQuery.toLowerCase();
    return allPosts.filter(post =>
      post.title[lang].toLowerCase().includes(query) ||
      post.excerpt[lang].toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allPosts, searchQuery, lang]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, postsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/ilustration/3.png')] bg-cover bg-center opacity-10"></div>

        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-4 animate-fade-in">
            {t('blog.badge')}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 animate-on-scroll">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-on-scroll stagger-1">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      {/* Search & Blog Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-slate-500 mt-2 text-center">
                {filteredPosts.length} {t('blog.resultsFound')}
              </p>
            )}
          </div>

          {/* Blog Grid */}
          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {paginatedPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  onClick={() => onSelectPost(post.slug)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">{t('blog.noResults')}</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? 'border-slate-100 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                aria-label={t('pagination.previous')}
              >
                <ChevronLeft className={`w-5 h-5 ${currentPage === 1 ? 'text-slate-300' : 'text-slate-600'}`} />
              </button>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={totalPages <= 1}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? totalPages <= 1
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages <= 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages || totalPages <= 1
                    ? 'border-slate-100 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                aria-label={t('pagination.next')}
              >
                <ChevronRight className={`w-5 h-5 ${currentPage === totalPages || totalPages <= 1 ? 'text-slate-300' : 'text-slate-600'}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTA onNavigate={onNavigate} />
    </div>
  );
};

export default BlogPage;
