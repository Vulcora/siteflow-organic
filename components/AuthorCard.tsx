import React from 'react';
import { useTranslation } from 'react-i18next';
import { BlogAuthor } from '../data/blogPosts';

interface AuthorCardProps {
  author: BlogAuthor;
  date: string;
  readTime: number;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, date, readTime }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  const formattedDate = new Date(date).toLocaleDateString(
    lang === 'sv' ? 'sv-SE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="flex items-center gap-4">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-14 h-14 rounded-full border-2 border-white/20 object-cover"
      />
      <div>
        <p className="font-medium text-white">{author.name}</p>
        <p className="text-sm text-slate-300">{author.role[lang]}</p>
        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
          <span>{formattedDate}</span>
          <span className="text-slate-600">•</span>
          <span>{readTime} {t('blog.readTime')}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
