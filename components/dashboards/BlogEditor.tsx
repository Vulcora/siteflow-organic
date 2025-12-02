import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Save,
  X,
  Plus,
  Trash2,
  Image,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { BlogPost, BlogSection } from '../../data/blogPosts';

interface BlogEditorProps {
  post: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const defaultAuthor = {
  name: 'SEO Partner',
  role: { sv: 'SEO Partner', en: 'SEO Partner' },
  avatar: '/team-avatars/default.jpg'
};

const createEmptySection = (): BlogSection => ({
  id: `section-${Date.now()}`,
  heading: { sv: '', en: '' },
  content: { sv: '', en: '' },
});

const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [slug, setSlug] = useState(post?.slug || '');
  const [titleSv, setTitleSv] = useState(post?.title.sv || '');
  const [titleEn, setTitleEn] = useState(post?.title.en || '');
  const [excerptSv, setExcerptSv] = useState(post?.excerpt.sv || '');
  const [excerptEn, setExcerptEn] = useState(post?.excerpt.en || '');
  const [heroImageSrc, setHeroImageSrc] = useState(post?.heroImage?.src || '');
  const [heroImageAltSv, setHeroImageAltSv] = useState(post?.heroImage?.alt.sv || '');
  const [heroImageAltEn, setHeroImageAltEn] = useState(post?.heroImage?.alt.en || '');
  const [readTimeMinutes, setReadTimeMinutes] = useState(post?.readTimeMinutes || 5);
  const [tags, setTags] = useState(post?.tags.join(', ') || '');
  const [sections, setSections] = useState<BlogSection[]>(
    post?.sections || [createEmptySection()]
  );

  // Auto-generate slug from Swedish title
  useEffect(() => {
    if (!post && titleSv) {
      const generatedSlug = titleSv
        .toLowerCase()
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [titleSv, post]);

  const handleAddSection = () => {
    setSections([...sections, createEmptySection()]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (
    index: number,
    field: 'heading' | 'content',
    lang: 'sv' | 'en',
    value: string
  ) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      [field]: {
        ...updated[index][field],
        [lang]: value,
      },
    };
    setSections(updated);
  };

  const handleSectionImageChange = (index: number, src: string) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      image: src ? {
        src,
        alt: { sv: '', en: '' }
      } : undefined,
    };
    setSections(updated);
  };

  const handleSave = () => {
    const blogPost: BlogPost = {
      slug,
      title: { sv: titleSv, en: titleEn },
      excerpt: { sv: excerptSv, en: excerptEn },
      heroImage: {
        src: heroImageSrc,
        alt: { sv: heroImageAltSv, en: heroImageAltEn },
      },
      publishDate: post?.publishDate || new Date().toISOString().split('T')[0],
      readTimeMinutes,
      author: post?.author || defaultAuthor,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      sections,
    };

    onSave(blogPost);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isValid = slug && titleSv && titleEn && excerptSv && excerptEn;

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="space-y-6 p-1">
        {/* Markdown tip */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{t('seoPartner.blogEditor.markdownTip')}</span>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.slug')}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={t('seoPartner.blogEditor.slugPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>

          {/* Title SV */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.titleSv')} *
            </label>
            <input
              type="text"
              value={titleSv}
              onChange={(e) => setTitleSv(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>

          {/* Title EN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.titleEn')} *
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>

          {/* Excerpt SV */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.excerptSv')} *
            </label>
            <textarea
              value={excerptSv}
              onChange={(e) => setExcerptSv(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm resize-none"
            />
          </div>

          {/* Excerpt EN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.excerptEn')} *
            </label>
            <textarea
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <Image className="w-4 h-4" />
            {t('seoPartner.blogEditor.heroImage')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={heroImageSrc}
              onChange={(e) => setHeroImageSrc(e.target.value)}
              placeholder={t('seoPartner.blogEditor.heroImagePlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
            <input
              type="text"
              value={heroImageAltSv}
              onChange={(e) => setHeroImageAltSv(e.target.value)}
              placeholder={t('seoPartner.blogEditor.heroImageAltSv')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
            <input
              type="text"
              value={heroImageAltEn}
              onChange={(e) => setHeroImageAltEn(e.target.value)}
              placeholder={t('seoPartner.blogEditor.heroImageAltEn')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.readTime')}
            </label>
            <input
              type="number"
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(parseInt(e.target.value) || 5)}
              min={1}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('seoPartner.blogEditor.tags')}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t('seoPartner.blogEditor.tagsPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-900">{t('seoPartner.blogEditor.sections')}</h4>
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              {t('seoPartner.blogEditor.addSection')}
            </button>
          </div>

          {sections.map((section, index) => (
            <div
              key={section.id}
              className="p-4 bg-slate-50 rounded-lg space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Section {index + 1}
                </span>
                {sections.length > 1 && (
                  <button
                    onClick={() => handleRemoveSection(index)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={section.heading.sv}
                  onChange={(e) =>
                    handleSectionChange(index, 'heading', 'sv', e.target.value)
                  }
                  placeholder={t('seoPartner.blogEditor.sectionHeadingSv')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                />
                <input
                  type="text"
                  value={section.heading.en}
                  onChange={(e) =>
                    handleSectionChange(index, 'heading', 'en', e.target.value)
                  }
                  placeholder={t('seoPartner.blogEditor.sectionHeadingEn')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea
                  value={section.content.sv}
                  onChange={(e) =>
                    handleSectionChange(index, 'content', 'sv', e.target.value)
                  }
                  placeholder={t('seoPartner.blogEditor.sectionContentSv')}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm resize-none font-mono"
                />
                <textarea
                  value={section.content.en}
                  onChange={(e) =>
                    handleSectionChange(index, 'content', 'en', e.target.value)
                  }
                  placeholder={t('seoPartner.blogEditor.sectionContentEn')}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm resize-none font-mono"
                />
              </div>

              <input
                type="text"
                value={section.image?.src || ''}
                onChange={(e) => handleSectionImageChange(index, e.target.value)}
                placeholder={t('seoPartner.blogEditor.sectionImage')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
          >
            {t('seoPartner.blogEditor.cancel')}
          </button>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                {t('seoPartner.blogEditor.saved')}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isValid
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {t('seoPartner.blogEditor.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
