import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Page, NavItem } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
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
    { label: 'Hem', page: 'home' },
    { label: 'Filosofi', page: 'philosophy' },
    { label: 'För Vem?', page: 'audience' },
    { label: 'Resultat', page: 'results' },
  ];

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
              onClick={() => handleNavClick('login')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 hover:bg-white/10 text-white"
            >
              Logga in
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white hover:shadow-lg hover:shadow-cyan-300/50"
            >
              Starta dialog
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <button 
              key={link.label} 
              onClick={() => handleNavClick(link.page)}
              className={`text-left font-medium py-2 border-b border-slate-50 ${currentPage === link.page ? 'text-blue-600' : 'text-slate-600'}`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('login')}
            className="border border-slate-200 text-slate-700 text-center py-3 rounded-lg font-medium hover:bg-slate-50"
          >
            Logga in
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white text-center py-3 rounded-lg font-medium"
          >
            Starta dialog
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
