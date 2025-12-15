import React from 'react';
import ContactForm from './ContactForm';
import ImageGrid from './ImageGrid';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">

       {/* New Split Hero Section */}
       <section className="pt-32 pb-20 bg-slate-900 relative overflow-hidden">
          {/* Abstract BG */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Text Content */}
                <div className="lg:w-1/2 text-white animate-slide-left">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-6 border border-blue-500/20 animate-fade-in">
                        {t('contactPage.badge')}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
                        {t('contactPage.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">{t('contactPage.titleHighlight')}</span>
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
                        {t('contactPage.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                         <a href="#contact-form" className="px-8 py-4 bg-white text-slate-900 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                            {t('contactPage.startDialog')} <ArrowRight className="w-4 h-4" />
                         </a>
                    </div>

                     {/* Team Contact Info */}
                    <div className="pt-8 mt-4">
                        <div className="flex items-center gap-6">
                            <div className="text-sm text-slate-300">
                                <p className="font-medium">{t('contactPage.directContact')}</p>
                                <p className="text-slate-500 text-xs">{t('contactPage.responseTime')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image - "Meeting/Human" vibe */}
                <div className="lg:w-1/2 relative animate-slide-right">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                        <img
                            src="/behind-the-scen/anders-working.jpg"
                            alt="Siteflow office"
                            width="800"
                            height="600"
                            fetchPriority="high"
                            className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="font-serif text-xl italic">"{t('contactPage.quote')}"</p>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-50"></div>
                </div>
            </div>
          </div>
       </section>

       {/* "Behind the scenes" - Using Shared Component */}
       <ImageGrid />

       {/* Contact Form */}
       <div id="contact-form">
         <ContactForm />
       </div>

       {/* Direct Contact Info */}
       <div className="bg-slate-50 border-t border-slate-200 py-20">
           <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 animate-on-scroll stagger-1">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{t('contactPage.email.title')}</h3>
                        <p className="text-slate-500 text-sm mb-2">{t('contactPage.email.subtitle')}</p>
                        <a href="mailto:hello@siteflow.se" className="text-blue-600 hover:text-blue-700 font-medium">hello@siteflow.se</a>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 border-l border-r border-slate-200/50 animate-on-scroll stagger-2">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                            <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{t('contactPage.phone.title')}</h3>
                        <p className="text-slate-500 text-sm mb-2">{t('contactPage.phone.subtitle')}</p>
                        <a href="tel:+46701234567" className="text-blue-600 hover:text-blue-700 font-medium">{t('contactPage.phone.number')}</a>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 animate-on-scroll stagger-3">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{t('contactPage.location.title')}</h3>
                        <p className="text-slate-500 text-sm mb-2">{t('contactPage.location.subtitle')}</p>
                        <span className="text-slate-700 font-medium">{t('contactPage.location.city')}</span>
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};

export default ContactPage;
