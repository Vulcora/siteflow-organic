import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Download,
  Eye,
  Grid3X3,
  List,
  ChevronRight,
  Home,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  X,
  Building2,
  Calendar,
  HardDrive,
  MoreVertical,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useDocuments, useProjects, useCompanies } from '../../src/hooks/useApi';

// File type icons mapping
const getFileIcon = (mimeType: string | undefined, fileName: string) => {
  if (!mimeType) {
    // Guess from extension
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')) {
      return <FileImage className="w-full h-full text-purple-500" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-full h-full text-red-500" />;
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) {
      return <FileText className="w-full h-full text-blue-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-full h-full text-green-500" />;
    }
    return <File className="w-full h-full text-slate-400" />;
  }

  if (mimeType.startsWith('image/')) {
    return <FileImage className="w-full h-full text-purple-500" />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo className="w-full h-full text-pink-500" />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio className="w-full h-full text-amber-500" />;
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="w-full h-full text-red-500" />;
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') {
    return <FileSpreadsheet className="w-full h-full text-green-500" />;
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return <FileText className="w-full h-full text-blue-500" />;
  }
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('compressed')) {
    return <FileArchive className="w-full h-full text-amber-600" />;
  }
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('html')) {
    return <FileCode className="w-full h-full text-emerald-500" />;
  }
  return <File className="w-full h-full text-slate-400" />;
};

// Format file size
const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Category config
const categoryConfig: Record<string, { label: string; color: string }> = {
  contract: { label: 'Kontrakt', color: 'bg-blue-100 text-blue-700' },
  specification: { label: 'Specifikation', color: 'bg-purple-100 text-purple-700' },
  design: { label: 'Design', color: 'bg-pink-100 text-pink-700' },
  report: { label: 'Rapport', color: 'bg-green-100 text-green-700' },
  invoice: { label: 'Faktura', color: 'bg-amber-100 text-amber-700' },
  other: { label: 'Övrigt', color: 'bg-slate-100 text-slate-700' },
};

type SortField = 'name' | 'date' | 'size' | 'category';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';
type BrowseLevel = 'root' | 'company' | 'project' | 'category';

interface BreadcrumbItem {
  id: string;
  name: string;
  level: BrowseLevel;
}

interface FileItem {
  id: string;
  name: string;
  description?: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  category: string;
  projectId: string;
  projectName?: string;
  companyId?: string;
  companyName?: string;
  insertedAt?: string;
}

const AdminFileBrowser: React.FC = () => {
  const { t } = useTranslation();
  const { data: documents = [], isLoading: loadingDocs } = useDocuments();
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [contextMenuFile, setContextMenuFile] = useState<string | null>(null);

  const isLoading = loadingDocs || loadingProjects || loadingCompanies;

  // Enrich documents with project and company info
  const enrichedDocuments = useMemo(() => {
    return documents.map((doc: any) => {
      const project = projects.find((p: any) => p.id === doc.projectId);
      const company = project ? companies.find((c: any) => c.id === project.companyId) : null;
      return {
        ...doc,
        projectName: project?.name || 'Okänt projekt',
        companyId: project?.companyId,
        companyName: company?.name || 'Okänt företag',
      } as FileItem;
    });
  }, [documents, projects, companies]);

  // Current level and filtering
  const currentLevel = breadcrumbs.length === 0 ? 'root' : breadcrumbs[breadcrumbs.length - 1].level;
  const currentId = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null;

  // Get folders for current level
  const folders = useMemo(() => {
    if (currentLevel === 'root') {
      // Show companies as folders
      const companiesWithDocs = new Set(enrichedDocuments.map(d => d.companyId));
      return companies
        .filter((c: any) => companiesWithDocs.has(c.id))
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          type: 'company' as const,
          count: enrichedDocuments.filter(d => d.companyId === c.id).length,
        }));
    }
    if (currentLevel === 'company') {
      // Show projects for this company
      const projectIds = new Set(enrichedDocuments.filter(d => d.companyId === currentId).map(d => d.projectId));
      return projects
        .filter((p: any) => projectIds.has(p.id))
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          type: 'project' as const,
          count: enrichedDocuments.filter(d => d.projectId === p.id).length,
        }));
    }
    if (currentLevel === 'project') {
      // Show categories for this project
      const categories = new Set(enrichedDocuments.filter(d => d.projectId === currentId).map(d => d.category));
      return Array.from(categories).map(cat => ({
        id: cat,
        name: categoryConfig[cat]?.label || cat,
        type: 'category' as const,
        count: enrichedDocuments.filter(d => d.projectId === currentId && d.category === cat).length,
      }));
    }
    return [];
  }, [currentLevel, currentId, enrichedDocuments, companies, projects]);

  // Get files for current level
  const files = useMemo(() => {
    let filtered = enrichedDocuments;

    // Filter by navigation level
    if (currentLevel === 'company') {
      filtered = filtered.filter(d => d.companyId === currentId);
    } else if (currentLevel === 'project') {
      filtered = filtered.filter(d => d.projectId === currentId);
    } else if (currentLevel === 'category') {
      const projectId = breadcrumbs.find(b => b.level === 'project')?.id;
      filtered = filtered.filter(d => d.projectId === projectId && d.category === currentId);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.projectName?.toLowerCase().includes(query) ||
        d.companyName?.toLowerCase().includes(query)
      );
    }

    // Filter by category (global filter)
    if (selectedCategory) {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.insertedAt || 0).getTime() - new Date(b.insertedAt || 0).getTime();
          break;
        case 'size':
          comparison = (a.fileSize || 0) - (b.fileSize || 0);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [enrichedDocuments, currentLevel, currentId, breadcrumbs, searchQuery, selectedCategory, sortField, sortDirection]);

  // Navigation handlers
  const navigateTo = (item: { id: string; name: string; type: 'company' | 'project' | 'category' }) => {
    const levelMap = {
      company: 'company' as BrowseLevel,
      project: 'project' as BrowseLevel,
      category: 'category' as BrowseLevel,
    };
    setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name, level: levelMap[item.type] }]);
  };

  const navigateToIndex = (index: number) => {
    if (index < 0) {
      setBreadcrumbs([]);
    } else {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDownload = (file: FileItem) => {
    window.open(file.filePath, '_blank');
  };

  const handlePreview = (file: FileItem) => {
    setPreviewFile(file);
  };

  const canPreview = (mimeType: string | undefined) => {
    if (!mimeType) return false;
    return mimeType.startsWith('image/') || mimeType === 'application/pdf';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-slate-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {t('admin.fileBrowser.empty.title')}
        </h3>
        <p className="text-slate-500">
          {t('admin.fileBrowser.empty.message')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('admin.fileBrowser.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('admin.fileBrowser.subtitle', { count: documents.length })}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('admin.fileBrowser.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('admin.fileBrowser.allCategories')}</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 mt-4 text-sm">
          <button
            onClick={() => navigateToIndex(-1)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              breadcrumbs.length === 0
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t('admin.fileBrowser.allFiles')}</span>
          </button>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => navigateToIndex(index)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Folders section */}
        {folders.length > 0 && currentLevel !== 'category' && (
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              {currentLevel === 'root' && t('admin.fileBrowser.companies')}
              {currentLevel === 'company' && t('admin.fileBrowser.projects')}
              {currentLevel === 'project' && t('admin.fileBrowser.categories')}
            </h3>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'
              : 'space-y-2'
            }>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => navigateTo(folder)}
                  className={`group text-left transition-all ${
                    viewMode === 'grid'
                      ? 'p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                      : 'w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center gap-3'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="w-12 h-12 mb-2 text-amber-500 group-hover:text-amber-600 transition-colors">
                        <FolderOpen className="w-full h-full" />
                      </div>
                      <p className="font-medium text-slate-900 truncate text-sm group-hover:text-blue-600">
                        {folder.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {folder.count} {t('admin.fileBrowser.files')}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 text-amber-500 flex-shrink-0">
                        <FolderOpen className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate group-hover:text-blue-600">
                          {folder.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {folder.count} {t('admin.fileBrowser.files')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Files section */}
        {files.length > 0 && (
          <div className="p-4">
            {/* Sort header for list view */}
            {viewMode === 'list' && (
              <div className="flex items-center gap-4 pb-3 mb-3 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase">
                <button
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-700 min-w-[200px]"
                >
                  {t('admin.fileBrowser.sortName')}
                  {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </button>
                <button
                  onClick={() => toggleSort('category')}
                  className="flex items-center gap-1 hover:text-slate-700 w-28"
                >
                  {t('admin.fileBrowser.sortCategory')}
                  {sortField === 'category' && (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </button>
                <button
                  onClick={() => toggleSort('size')}
                  className="flex items-center gap-1 hover:text-slate-700 w-20"
                >
                  {t('admin.fileBrowser.sortSize')}
                  {sortField === 'size' && (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </button>
                <button
                  onClick={() => toggleSort('date')}
                  className="flex items-center gap-1 hover:text-slate-700 flex-1"
                >
                  {t('admin.fileBrowser.sortDate')}
                  {sortField === 'date' && (sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </button>
                <span className="w-24 text-right">{t('admin.fileBrowser.actions')}</span>
              </div>
            )}

            {/* Files grid/list */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'
              : 'space-y-1'
            }>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`group relative ${
                    viewMode === 'grid'
                      ? 'p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md transition-all cursor-pointer'
                      : 'flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors'
                  }`}
                  onClick={() => canPreview(file.mimeType) ? handlePreview(file) : handleDownload(file)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid view */}
                      <div className="w-12 h-12 mb-3 mx-auto">
                        {getFileIcon(file.mimeType, file.name)}
                      </div>
                      <p className="font-medium text-slate-900 text-sm truncate text-center group-hover:text-blue-600">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 text-center mt-1">
                        {formatFileSize(file.fileSize)}
                      </p>
                      <div className="mt-2 flex justify-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryConfig[file.category]?.color || 'bg-slate-100 text-slate-600'}`}>
                          {categoryConfig[file.category]?.label || file.category}
                        </span>
                      </div>
                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-slate-900/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {canPreview(file.mimeType) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePreview(file); }}
                            className="p-2 bg-white rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                          className="p-2 bg-white rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List view */}
                      <div className="w-10 h-10 flex-shrink-0">
                        {getFileIcon(file.mimeType, file.name)}
                      </div>
                      <div className="min-w-[200px]">
                        <p className="font-medium text-slate-900 truncate group-hover:text-blue-600">
                          {file.name}
                        </p>
                        {file.description && (
                          <p className="text-xs text-slate-500 truncate">{file.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full w-28 text-center ${categoryConfig[file.category]?.color || 'bg-slate-100 text-slate-600'}`}>
                        {categoryConfig[file.category]?.label || file.category}
                      </span>
                      <span className="text-sm text-slate-500 w-20">
                        {formatFileSize(file.fileSize)}
                      </span>
                      <span className="text-sm text-slate-500 flex-1">
                        {file.insertedAt ? new Date(file.insertedAt).toLocaleDateString('sv-SE') : '-'}
                      </span>
                      <div className="w-24 flex items-center justify-end gap-1">
                        {canPreview(file.mimeType) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePreview(file); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {folders.length === 0 && files.length === 0 && (
          <div className="p-12 text-center">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{t('admin.fileBrowser.noFiles')}</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                  {getFileIcon(previewFile.mimeType, previewFile.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{previewFile.name}</h3>
                  <p className="text-sm text-slate-500">
                    {formatFileSize(previewFile.fileSize)} • {previewFile.projectName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewFile)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('admin.fileBrowser.download')}
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Preview content */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)] flex items-center justify-center bg-slate-100">
              {previewFile.mimeType?.startsWith('image/') ? (
                <img
                  src={previewFile.filePath}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              ) : previewFile.mimeType === 'application/pdf' ? (
                <iframe
                  src={previewFile.filePath}
                  className="w-full h-[70vh] rounded-lg"
                  title={previewFile.name}
                />
              ) : (
                <div className="text-center py-12">
                  <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('admin.fileBrowser.previewNotAvailable')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFileBrowser;
