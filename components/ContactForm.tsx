import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contactPage.contactForm.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contactPage.contactForm.required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('contactPage.contactForm.invalidEmail');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contactPage.contactForm.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState('submitting');

    // Simulate a short delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create mailto link with form data
    const subject = encodeURIComponent(`Kontaktformulär: ${formData.name}`);
    const body = encodeURIComponent(
      `Namn: ${formData.name}\n` +
      `E-post: ${formData.email}\n` +
      `Företag: ${formData.company || 'Ej angivet'}\n` +
      `Telefon: ${formData.phone || 'Ej angivet'}\n\n` +
      `Meddelande:\n${formData.message}`
    );

    window.location.href = `mailto:hello@siteflow.se?subject=${subject}&body=${body}`;
    setFormState('success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    });
    setErrors({});
    setFormState('idle');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-700 text-xs tracking-widest uppercase mb-4 border border-teal-200">
            {t('contactPage.contactForm.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
            {t('contactPage.contactForm.title')}
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {t('contactPage.contactForm.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-10 animate-on-scroll">

            {formState === 'idle' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      {t('contactPage.contactForm.nameLabel')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contactPage.contactForm.namePlaceholder')}
                      className={`w-full border rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      {t('contactPage.contactForm.emailLabel')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contactPage.contactForm.emailPlaceholder')}
                      className={`w-full border rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Company & Phone in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                      {t('contactPage.contactForm.companyLabel')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t('contactPage.contactForm.companyPlaceholder')}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      {t('contactPage.contactForm.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contactPage.contactForm.phonePlaceholder')}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('contactPage.contactForm.messageLabel')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contactPage.contactForm.messagePlaceholder')}
                    className={`w-full border rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                >
                  <span>{t('contactPage.contactForm.submitButton')}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {formState === 'submitting' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-md border border-slate-100">
                    <Send className="w-8 h-8 text-teal-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-slate-900 font-medium text-lg">{t('contactPage.contactForm.submitting')}</p>
              </div>
            )}

            {formState === 'success' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
                <div className="bg-green-100 p-5 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-xl mb-2">{t('contactPage.contactForm.successTitle')}</h4>
                  <p className="text-slate-500 max-w-sm">{t('contactPage.contactForm.successMessage')}</p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-teal-600 font-medium hover:underline flex items-center space-x-1 mt-2"
                >
                  <span>{t('contactPage.contactForm.sendAnother')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {formState === 'error' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
                <div className="bg-red-100 p-5 rounded-full">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-xl mb-2">{t('contactPage.contactForm.errorTitle')}</h4>
                  <p className="text-slate-500 max-w-sm">{t('contactPage.contactForm.errorMessage')}</p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-teal-600 font-medium hover:underline mt-2"
                >
                  {t('contactPage.contactForm.tryAgain')}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
