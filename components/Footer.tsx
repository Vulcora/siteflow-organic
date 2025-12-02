import React, { useState } from 'react';
import { Linkedin, Twitter, Mail, Shield, Award, Server, Lock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    // Simulate API call - replace with actual backend integration
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      setStatus('success');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 800);
  };

  const securityBadges = [
    { icon: Shield, label: t('security.gdpr') },
    { icon: Award, label: t('security.iso') },
    { icon: Server, label: t('security.dataEu') },
    { icon: Lock, label: t('security.encrypted') },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('newsletter.title')}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {t('newsletter.description')}
            </p>

            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-400/10 rounded-lg py-3 px-4">
                <CheckCircle className="w-5 h-5" />
                <span>{t('newsletter.success')}</span>
              </div>
            ) : status === 'error' ? (
              <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 rounded-lg py-3 px-4">
                <AlertCircle className="w-5 h-5" />
                <span>{t('newsletter.error')}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  className="flex-grow px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('newsletter.button')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-10">
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

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-b border-slate-800 mb-8">
          {securityBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-slate-500 text-sm">
              <badge.icon className="w-4 h-4" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Copyright and Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
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
