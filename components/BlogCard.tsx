import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BlogPost } from '../data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick, index }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  const formattedDate = new Date(post.publishDate).toLocaleDateString(
    lang === 'sv' ? 'sv-SE' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <article
      className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group animate-on-scroll stagger-${Math.min(index + 1, 4)}`}
      onClick={onClick}
    >
      {/* Hero Image */}
      <div className="aspect-video overflow-hidden relative">
        <img
          src={post.heroImage.src}
          alt={post.heroImage.alt[lang]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title[lang]}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {post.excerpt[lang]}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="text-slate-700 font-medium text-xs">{post.author.name}</span>
              <span className="text-slate-400 text-xs">{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{post.readTimeMinutes} min</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
