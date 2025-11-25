import React, { useState } from 'react';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('images/abstract-flow.jpg')] bg-cover bg-center opacity-20 mix-blend-screen"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Login Form Section */}
      <section className="min-h-screen flex items-center justify-center py-12 px-6 relative z-10">
        <div className="w-full max-w-md">

            {/* Login Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 animate-scale-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4 animate-fade-in border-2 border-cyan-400">
                  <img src="/logos/siteflow-logo/favicon.svg" alt="Siteflow" width="40" height="40" className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-serif text-slate-900 mb-2 animate-on-scroll">{t('loginPage.title')}</h1>
                <p className="text-slate-600 text-sm animate-on-scroll stagger-1">{t('loginPage.subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('loginPage.emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder={t('loginPage.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('loginPage.passwordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder={t('loginPage.passwordPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-400"
                    />
                    <span className="ml-2 text-slate-600">{t('loginPage.rememberMe')}</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    {t('loginPage.forgotPassword')}
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-300/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>{t('loginPage.loginButton')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">{t('loginPage.or')}</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <button className="w-full py-3 px-6 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" className="w-5 h-5" />
                  <span>{t('loginPage.continueWithGoogle')}</span>
                </button>
                <button className="w-full py-3 px-6 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <img src="https://github.com/favicon.ico" alt="GitHub" width="20" height="20" className="w-5 h-5" />
                  <span>{t('loginPage.continueWithGithub')}</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center text-sm text-slate-600">
                {t('loginPage.noAccount')}{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('loginPage.createAccount')}
                </a>
              </div>
            </div>

          {/* Security Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              {t('loginPage.securityNote')}
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LoginPage;
