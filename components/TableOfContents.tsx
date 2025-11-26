import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'lucide-react';
import { BlogSection } from '../data/blogPosts';

interface TableOfContentsProps {
  sections: BlogSection[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ sections }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const [activeSection, setActiveSection] = useState<string>('');

  // Filter sections that have headings
  const headings = sections.filter(s => s.heading[lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    headings.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-28 bg-slate-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t('blog.tableOfContents')}
        </h3>
      </div>
      <ul className="space-y-2">
        {headings.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-sm text-left w-full py-1.5 px-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'text-blue-600 bg-blue-50 font-medium'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              {section.heading[lang]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
