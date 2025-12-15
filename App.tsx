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
const WebDevelopmentPage = lazy(() => import('./components/WebDevelopmentPage'));
const SystemDevelopmentPage = lazy(() => import('./components/SystemDevelopmentPage'));
const ConsultingPage = lazy(() => import('./components/ConsultingPage'));
const MaintenancePage = lazy(() => import('./components/MaintenancePage'));
const PressPage = lazy(() => import('./components/PressPage'));

import { Page } from './types';

// Skeleton loading component - mimics page structure with shimmer effect
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50">
    {/* Hero skeleton */}
    <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 skeleton-shimmer">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <div className="h-4 w-32 bg-slate-700/50 rounded-full mb-6"></div>
          <div className="h-12 w-3/4 bg-slate-700/50 rounded-lg mb-4"></div>
          <div className="h-12 w-1/2 bg-slate-700/50 rounded-lg mb-8"></div>
          <div className="h-5 w-full bg-slate-700/30 rounded mb-3"></div>
          <div className="h-5 w-2/3 bg-slate-700/30 rounded mb-8"></div>
          <div className="flex gap-4">
            <div className="h-12 w-36 bg-slate-700/50 rounded-full"></div>
            <div className="h-12 w-36 bg-slate-700/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    {/* Content skeleton */}
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm skeleton-shimmer" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="h-12 w-12 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
            <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Page transition wrapper - smooth entrance
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
      webDevelopment: 'Webbutveckling | Siteflow',
      systemDevelopment: 'Systemutveckling | Siteflow',
      consulting: 'Konsulttjänster | Siteflow',
      maintenance: 'Drift & Underhåll | Siteflow',
      press: 'Press & Media | Siteflow',
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
      case 'webDevelopment':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><WebDevelopmentPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'systemDevelopment':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><SystemDevelopmentPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'consulting':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><ConsultingPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'maintenance':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><MaintenancePage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
      case 'press':
        return <PageWrapper pageKey={pageKey}><Suspense fallback={<PageLoader />}><PressPage onNavigate={handleNavigate} /></Suspense></PageWrapper>;
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
