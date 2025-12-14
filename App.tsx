import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CookieConsent from './components/CookieConsent';
import Process from './components/Process';
import Stats from './components/Stats';
import Philosophy from './components/Philosophy';
import Testimonials from './components/Testimonials';
import BlogPreview from './components/BlogPreview';
import Integrations from './components/Integrations';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Lazy load pages that aren't shown on initial render
const PhilosophyPage = lazy(() => import('./components/PhilosophyPage'));
const AudiencePage = lazy(() => import('./components/AudiencePage'));
const ResultsPage = lazy(() => import('./components/ResultsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const CaseStudiesPage = lazy(() => import('./components/CaseStudiesPage'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const FlowboardingPage = lazy(() => import('./components/FlowboardingPage'));

import { Page } from './types';

// Smooth loading fallback with delayed appearance
const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center page-loader">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="h-2 w-24 rounded-full skeleton-pulse"></div>
    </div>
  </div>
);

// Page transition wrapper
const PageWrapper: React.FC<{ children: React.ReactNode; pageKey: string }> = ({ children, pageKey }) => (
  <div key={pageKey} className="page-fade-in">
    {children}
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);
  const [currentCaseStudySlug, setCurrentCaseStudySlug] = useState<string | null>(null);

  // Handle side effects of navigation (SEO Title + Scroll)
  useEffect(() => {
    window.scrollTo(0, 0);

    const titles: Record<Page, string> = {
      home: 'Siteflow | Digitala system som flödar naturligt',
      philosophy: 'Vår Filosofi | Siteflow',
      audience: 'För Vem? | Siteflow',
      results: 'Resultat & Case | Siteflow',
      contact: 'Starta Dialog | Siteflow',
      blog: 'Blogg | Siteflow',
      blogPost: 'Blogg | Siteflow',
      caseStudies: 'Kundcase | Siteflow',
      caseStudy: 'Kundcase | Siteflow',
      privacy: 'Integritetspolicy | Siteflow',
      terms: 'Användarvillkor | Siteflow',
      notFound: '404 - Sidan hittades inte | Siteflow',
      flowboarding: 'Flowboarding - Vår Process | Siteflow',
    };

    document.title = titles[currentPage] || 'Siteflow';
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'blogPost') {
      setCurrentBlogSlug(null);
    }
    if (page !== 'caseStudy') {
      setCurrentCaseStudySlug(null);
    }
  };

  const handleSelectBlogPost = (slug: string) => {
    setCurrentBlogSlug(slug);
    setCurrentPage('blogPost');
  };

  const handleBackToBlog = () => {
    setCurrentBlogSlug(null);
    setCurrentPage('blog');
  };

  const handleSelectCaseStudy = (slug: string) => {
    setCurrentCaseStudySlug(slug);
    setCurrentPage('caseStudy');
  };

  const handleBackToCaseStudies = () => {
    setCurrentCaseStudySlug(null);
    setCurrentPage('caseStudies');
  };

  const renderPage = () => {
    // Create unique key for page transitions
    const pageKey = currentPage === 'blogPost'
      ? `blogPost-${currentBlogSlug}`
      : currentPage === 'caseStudy'
        ? `caseStudy-${currentCaseStudySlug}`
        : currentPage;

    switch (currentPage) {
      case 'home':
        return (
          <PageWrapper pageKey={pageKey}>
            <Hero onNavigate={handleNavigate} />
            <Stats />
            <Philosophy onNavigate={handleNavigate} />
            <Process />
            <BlogPreview onNavigate={handleNavigate} onSelectPost={handleSelectBlogPost} />
            <Testimonials />
            <Integrations />
            <CTA onNavigate={handleNavigate} />
            <FAQ />
          </PageWrapper>
        );
      case 'philosophy':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><PhilosophyPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'audience':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><AudiencePage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'results':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><ResultsPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'contact':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><ContactPage /></Suspense></PageWrapper>;
      case 'blog':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><BlogPage onNavigate={handleNavigate} onSelectPost={handleSelectBlogPost} /></Suspense></PageWrapper>;
      case 'blogPost':
        return currentBlogSlug ? (
          <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><BlogPostPage slug={currentBlogSlug} onNavigate={handleNavigate} onBack={handleBackToBlog} /></Suspense></PageWrapper>
        ) : null;
      case 'caseStudies':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><CaseStudiesPage onNavigate={handleNavigate} onSelectCase={handleSelectCaseStudy} /></Suspense></PageWrapper>;
      case 'caseStudy':
        return currentCaseStudySlug ? (
          <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><CaseStudyPage slug={currentCaseStudySlug} onNavigate={handleNavigate} onBack={handleBackToCaseStudies} /></Suspense></PageWrapper>
        ) : null;
      case 'privacy':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><PrivacyPolicyPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'terms':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><TermsOfServicePage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'notFound':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><NotFoundPage setCurrentPage={handleNavigate} /></Suspense></PageWrapper>;
      case 'flowboarding':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><FlowboardingPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      default:
        return <PageWrapper pageKey="home"><Hero onNavigate={handleNavigate} /></PageWrapper>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <CookieConsent onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
