import React from 'react';
import { useTranslation } from 'react-i18next';

const ImageGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-3 block animate-fade-in">{t('imageGrid.badge')}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 animate-on-scroll">{t('imageGrid.title')}</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-on-scroll stagger-1">
                {t('imageGrid.description')}
            </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[500px]">

            {/* Large item - The 'Hero' asset */}
            <div className="col-span-2 md:row-span-2 h-64 md:h-auto relative rounded-2xl overflow-hidden group animate-slide-left">
                <img
                    src="/behind-the-scen/anders-coding.jpg"
                    alt="Siteflow Architect Coding"
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900">
                    {t('imageGrid.labels.liveArchitecture')}
                </div>
            </div>

            {/* Wide item */}
            <div className="col-span-2 h-48 md:h-auto relative rounded-2xl overflow-hidden group animate-slide-right stagger-1">
                <img
                    src="/behind-the-scen/architecting.jpg"
                    alt="Strategic Planning"
                    width="800"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900">
                    {t('imageGrid.labels.flowDesign')}
                </div>
            </div>

            {/* Small item 1 */}
            <div className="h-48 md:h-auto relative rounded-2xl overflow-hidden group animate-scale-in stagger-2">
                <img
                    src="/behind-the-scen/lookingatipad.jpg"
                    alt="Detail work"
                    width="400"
                    height="300"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Small item 2 */}
            <div className="h-48 md:h-auto relative rounded-2xl overflow-hidden group bg-slate-100 flex items-center justify-center animate-scale-in stagger-3">
                 <div className="text-center p-4">
                    <p className="font-serif text-4xl text-blue-600 mb-1">100%</p>
                    <p className="text-xs uppercase tracking-widest text-slate-500">In-House</p>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;
