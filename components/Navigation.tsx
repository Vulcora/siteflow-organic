import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Page, NavItem } from '../types';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavItem[] = [
    { label: t('nav.home'), page: 'home' },
    { label: t('nav.flowboarding'), page: 'flowboarding' },
    { label: t('nav.philosophy'), page: 'philosophy' },
    { label: t('nav.audience'), page: 'audience' },
    { label: t('nav.caseStudies'), page: 'caseStudies' },
    { label: t('nav.blog'), page: 'blog' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <button onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group focus:outline-none">
          <img
            src="/logos/siteflow-logo/site flow.svg"
            alt="Siteflow logo"
            width="40"
            height="40"
            className="h-10 w-auto transition-opacity"
          />
          <span className="text-2xl font-serif font-semibold tracking-tight transition-colors text-white">
            Siteflow
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.page)}
              className={`text-sm font-medium hover:text-blue-400 transition-colors ${
                currentPage === link.page
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 hover:bg-white/10 text-white flex items-center gap-2"
              aria-label={i18n.language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{i18n.language === 'sv' ? 'EN' : 'SV'}</span>
            </button>
            <button
              onClick={() => handleNavClick('login')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 hover:bg-white/10 text-white"
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white hover:shadow-lg hover:shadow-cyan-300/50"
            >
              {t('nav.contact')}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col space-y-4 transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {navLinks.map((link, index) => (
          <button
            key={link.label}
            onClick={() => handleNavClick(link.page)}
            className={`text-left font-medium py-2 border-b border-slate-50 transition-all duration-300 ${currentPage === link.page ? 'text-blue-600' : 'text-slate-600'}`}
            style={{ transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms' }}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={toggleLanguage}
          className="border border-slate-200 text-slate-700 text-center py-3 rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-all duration-300"
          aria-label={i18n.language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}
          style={{ transitionDelay: isMobileMenuOpen ? `${navLinks.length * 50}ms` : '0ms' }}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>{i18n.language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}</span>
        </button>
        <button
          onClick={() => handleNavClick('login')}
          className="border border-slate-200 text-slate-700 text-center py-3 rounded-lg font-medium hover:bg-slate-50 transition-all duration-300"
          style={{ transitionDelay: isMobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : '0ms' }}
        >
          {t('nav.login')}
        </button>
        <button
          onClick={() => handleNavClick('contact')}
          className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white text-center py-3 rounded-lg font-medium transition-all duration-300"
          style={{ transitionDelay: isMobileMenuOpen ? `${(navLinks.length + 2) * 50}ms` : '0ms' }}
        >
          {t('nav.contact')}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
