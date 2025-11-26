import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const handleBlogClick = () => {
    if (onNavigate) {
      onNavigate('blog');
      window.scrollTo(0, 0);
    }
  };

  const handlePrivacyClick = () => {
    if (onNavigate) {
      onNavigate('privacy');
      window.scrollTo(0, 0);
    }
  };

  const handleTermsClick = () => {
    if (onNavigate) {
      onNavigate('terms');
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src="/logos/siteflow-logo/site flow.svg" alt="Siteflow" width="32" height="32" className="h-8 w-auto" />
            <span className="text-xl font-serif text-white">Siteflow</span>
          </div>
          <div className="flex items-center space-x-6">
            {onNavigate && (
              <button
                onClick={handleBlogClick}
                className="hover:text-white transition-colors text-sm"
              >
                {t('nav.blog')}
              </button>
            )}
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" aria-hidden="true" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" aria-hidden="true" /></a>
            <a href="mailto:hello@siteflow.se" aria-label="Skicka e-post" className="hover:text-white transition-colors"><Mail className="w-5 h-5" aria-hidden="true" /></a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm border-t border-slate-900 pt-8">
          <p>&copy; {new Date().getFullYear()} Siteflow AB. {t('footer.rights')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {onNavigate ? (
              <>
                <button onClick={handlePrivacyClick} className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</button>
                <button onClick={handleTermsClick} className="hover:text-white transition-colors">{t('footer.terms')}</button>
              </>
            ) : (
              <>
                <a href="#" className="hover:text-white">{t('footer.privacyPolicy')}</a>
                <a href="#" className="hover:text-white">{t('footer.terms')}</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
