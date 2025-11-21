import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-serif text-slate-900 mb-2">Logga in</h2>
                <p className="text-slate-600 text-sm">Få tillgång till ditt konto</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    E-postadress
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="din@email.se"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="••••••••"
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
                    <span className="ml-2 text-slate-600">Kom ihåg mig</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Glömt lösenord?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-300/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Logga in</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">eller</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <button className="w-full py-3 px-6 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  <span>Fortsätt med Google</span>
                </button>
                <button className="w-full py-3 px-6 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5" />
                  <span>Fortsätt med GitHub</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center text-sm text-slate-600">
                Har du inget konto?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Skapa konto
                </a>
              </div>
            </div>

          {/* Security Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              🔒 Din information är säkrad med 256-bitars kryptering
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LoginPage;
