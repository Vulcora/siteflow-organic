import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  Search,
  ExternalLink
} from 'lucide-react';
import { getAllBlogPosts, BlogPost } from '../../data/blogPosts';
import BlogEditor from './BlogEditor';
import Modal from '../shared/Modal';

const BlogManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [localPosts, setLocalPosts] = useState<BlogPost[]>(() => {
    // Load any locally stored posts
    const stored = localStorage.getItem('seo_blog_drafts');
    return stored ? JSON.parse(stored) : [];
  });

  const allPosts = [...getAllBlogPosts(), ...localPosts];

  const filteredPosts = allPosts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title[lang].toLowerCase().includes(query) ||
      post.excerpt[lang].toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleSavePost = (post: BlogPost) => {
    const isExisting = localPosts.some((p) => p.slug === post.slug);
    let updatedPosts: BlogPost[];

    if (isExisting) {
      updatedPosts = localPosts.map((p) => (p.slug === post.slug ? post : p));
    } else {
      updatedPosts = [...localPosts, post];
    }

    setLocalPosts(updatedPosts);
    localStorage.setItem('seo_blog_drafts', JSON.stringify(updatedPosts));
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (slug: string) => {
    if (!confirm(t('seoPartner.blogManager.confirmDelete'))) return;

    const updatedPosts = localPosts.filter((p) => p.slug !== slug);
    setLocalPosts(updatedPosts);
    localStorage.setItem('seo_blog_drafts', JSON.stringify(updatedPosts));
  };

  const isLocalPost = (slug: string) => {
    return localPosts.some((p) => p.slug === slug);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t('seoPartner.blogManager.title')}
          </h3>
          <p className="text-sm text-slate-500">
            {t('seoPartner.blogManager.subtitle')}
          </p>
        </div>
        <button
          onClick={handleNewPost}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('seoPartner.blogManager.newPost')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('blog.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-slate-700"
        />
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">{t('seoPartner.noPostsYet')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {post.heroImage?.src ? (
                      <img
                        src={post.heroImage.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900 truncate">
                          {post.title[lang]}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                          {post.excerpt[lang]}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                          isLocalPost(post.slug)
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {isLocalPost(post.slug)
                          ? t('seoPartner.draft')
                          : t('seoPartner.published')}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishDate).toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTimeMinutes} {t('seoPartner.blogManager.readTime')}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          {post.tags.slice(0, 2).join(', ')}
                          {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('seoPartner.blogManager.editPost')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {isLocalPost(post.slug) && (
                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('seoPartner.blogManager.deletePost')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        title={editingPost ? t('seoPartner.blogEditor.editPost') : t('seoPartner.blogEditor.newPost')}
        size="xl"
      >
        <BlogEditor
          post={editingPost}
          onSave={handleSavePost}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingPost(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default BlogManager;
