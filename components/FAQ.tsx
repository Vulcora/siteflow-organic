import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = t('faq.questions', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-3 block animate-fade-in">{t('faq.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 animate-on-scroll">
            {t('faq.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed animate-on-scroll stagger-1">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 animate-on-scroll stagger-${Math.min(index + 1, 4)}`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-blue-500 flex-shrink-0 ml-4" aria-hidden="true" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" aria-hidden="true" />
                )}
              </button>

              <div
                className={`px-6 text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
