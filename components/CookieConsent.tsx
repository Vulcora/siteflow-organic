import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const GA_MEASUREMENT_ID = 'G-4GV1L9Y8PP';

interface CookieConsentProps {
  onNavigate?: (page: string) => void;
}

// Initialize Google Analytics
const initializeGA = () => {
  if (typeof window === 'undefined') return;
  if ((window as any).gaInitialized) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  (window as any).gaInitialized = true;
};

// Remove GA cookies
const removeGACookies = () => {
  const cookies = document.cookie.split(';');
  const gaCookies = ['_ga', '_gid', '_gat', '_ga_' + GA_MEASUREMENT_ID.replace('G-', '')];

  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    if (gaCookies.some(gaCookie => cookieName.startsWith(gaCookie))) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
};

const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');

    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
        // Trigger animation after mount
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsVisible(true));
        });
      }, 800);
      return () => clearTimeout(timer);
    }

    if (consent === 'all') {
      initializeGA();
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    initializeGA();
    closeBanner();
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie_consent', 'necessary');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    removeGACookies();
    closeBanner();
  };

  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      handleAcceptAll();
    } else {
      handleRejectAll();
    }
  };

  const closeBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Subtle gradient shadow above banner */}
      <div className="h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Icon & Text */}
            <div className="flex items-start gap-3 flex-grow">
              <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {t('cookies.description')}{' '}
                  <button
                    onClick={() => onNavigate?.('privacy')}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    {t('cookies.learnMore')}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </div>

            {/* Buttons - Equal prominence per GDPR best practices */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
              {/* Reject - Same visual weight as Accept */}
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 hover:border-slate-300"
              >
                {t('cookies.rejectAll')}
              </button>

              {/* Customize */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 hover:border-slate-300 inline-flex items-center justify-center gap-1.5"
              >
                {t('cookies.customize')}
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Accept */}
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>

          {/* Expandable Details Section */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showDetails ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 border-t border-slate-100">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-slate-900">
                        {t('cookies.necessary.title')}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                        {t('cookies.required')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t('cookies.necessary.description')}
                    </p>
                  </div>
                  {/* Always on toggle - disabled */}
                  <div className="flex-shrink-0">
                    <div className="w-11 h-6 bg-blue-500 rounded-full flex items-center justify-end px-0.5 cursor-not-allowed">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-slate-900">
                        {t('cookies.analytics.title')}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        {t('cookies.optional')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t('cookies.analytics.description')}
                    </p>
                  </div>
                  {/* Toggleable */}
                  <button
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`flex-shrink-0 w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                      analyticsEnabled
                        ? 'bg-blue-500 justify-end'
                        : 'bg-slate-300 justify-start'
                    }`}
                    aria-label={analyticsEnabled ? 'Disable analytics' : 'Enable analytics'}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform" />
                  </button>
                </div>
              </div>

              {/* Save Preferences Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {t('cookies.savePreferences')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
