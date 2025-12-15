import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown, Code, Server, Users, Wrench, Sparkles, BookOpen, Briefcase, Target, Lightbulb, Newspaper } from 'lucide-react';
import { Page } from '../types';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface DropdownItem {
  label: string;
  description?: string;
  page: Page;
  icon?: React.ReactNode;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setMobileExpandedDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpandedDropdown(null);
    window.scrollTo(0, 0);
  };

  const handleDropdownEnter = (dropdownId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdownId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileDropdown = (dropdownId: string) => {
    setMobileExpandedDropdown(mobileExpandedDropdown === dropdownId ? null : dropdownId);
  };

  // Define dropdowns with their items
  const dropdowns: Record<string, NavDropdown> = {
    services: {
      label: t('nav.services'),
      items: [
        {
          label: t('nav.servicesItems.webDevelopment'),
          description: t('nav.servicesItems.webDevelopmentDesc'),
          page: 'webDevelopment' as Page,
          icon: <Code className="w-5 h-5" />,
        },
        {
          label: t('nav.servicesItems.systemDevelopment'),
          description: t('nav.servicesItems.systemDevelopmentDesc'),
          page: 'systemDevelopment' as Page,
          icon: <Server className="w-5 h-5" />,
        },
        {
          label: t('nav.servicesItems.consulting'),
          description: t('nav.servicesItems.consultingDesc'),
          page: 'consulting' as Page,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: t('nav.servicesItems.maintenance'),
          description: t('nav.servicesItems.maintenanceDesc'),
          page: 'maintenance' as Page,
          icon: <Wrench className="w-5 h-5" />,
        },
      ],
    },
    aboutUs: {
      label: t('nav.aboutUs'),
      items: [
        {
          label: t('nav.flowboarding'),
          description: t('nav.flowboardingDesc'),
          page: 'flowboarding',
          icon: <Sparkles className="w-5 h-5" />,
        },
        {
          label: t('nav.philosophy'),
          description: t('nav.philosophyDesc'),
          page: 'philosophy',
          icon: <Lightbulb className="w-5 h-5" />,
        },
        {
          label: t('nav.audience'),
          description: t('nav.audienceDesc'),
          page: 'audience',
          icon: <Target className="w-5 h-5" />,
        },
      ],
    },
    inspiration: {
      label: t('nav.inspiration'),
      items: [
        {
          label: t('nav.caseStudies'),
          description: t('nav.caseStudiesDesc'),
          page: 'caseStudies',
          icon: <Briefcase className="w-5 h-5" />,
        },
        {
          label: t('nav.blog'),
          description: t('nav.blogDesc'),
          page: 'blog',
          icon: <BookOpen className="w-5 h-5" />,
        },
        {
          label: t('nav.press'),
          description: t('nav.pressDesc'),
          page: 'press',
          icon: <Newspaper className="w-5 h-5" />,
        },
      ],
    },
  };

  const isItemActive = (items: DropdownItem[]) => {
    return items.some(item => item.page === currentPage);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
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
        <div className="hidden lg:flex items-center space-x-1">
          {/* Home link */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'text-blue-400 bg-blue-400/10'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            {t('nav.home')}
          </button>

          {/* Dropdown menus */}
          {Object.entries(dropdowns).map(([key, dropdown]) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleDropdownEnter(key)}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isItemActive(dropdown.items)
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {dropdown.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
                  activeDropdown === key
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-2">
                  {dropdown.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavClick(item.page)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left group ${
                        currentPage === item.page
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        currentPage === item.page
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 text-white flex items-center gap-2"
              aria-label={i18n.language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{i18n.language === 'sv' ? 'EN' : 'SV'}</span>
            </button>
            <button
              onClick={() => handleNavClick('login')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20 hover:bg-white/10 text-white"
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white hover:shadow-lg hover:shadow-cyan-400/30"
            >
              {t('nav.contact')}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white focus:outline-none p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-1">
            {/* Home link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </button>

            {/* Mobile dropdowns */}
            {Object.entries(dropdowns).map(([key, dropdown]) => (
              <div key={key} className="border-b border-slate-100 last:border-b-0">
                <button
                  onClick={() => toggleMobileDropdown(key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                    isItemActive(dropdown.items) ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  <span>{dropdown.label}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      mobileExpandedDropdown === key ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileExpandedDropdown === key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-4 pb-2 space-y-1">
                    {dropdown.items.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavClick(item.page)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                          currentPage === item.page
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${
                          currentPage === item.page
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-400">{item.description}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile action buttons */}
            <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{i18n.language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}</span>
              </button>
              <button
                onClick={() => handleNavClick('login')}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white font-medium transition-all"
              >
                {t('nav.contact')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
