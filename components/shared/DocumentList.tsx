import React, { useState } from 'react';
import {
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  Download,
  Loader2,
  AlertCircle,
  Upload,
  FolderOpen,
} from 'lucide-react';
import { useDocuments } from '../../src/hooks/useApi';
import Modal from './Modal';
import UploadDocumentForm from '../forms/UploadDocumentForm';

interface DocumentListProps {
  projectId?: string;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  projectId,
  onUploadClick,
  showUploadButton = true,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: documents = [], isLoading, error } = useDocuments(
    projectId ? { projectId } : undefined
  );

  const getFileIcon = (mimeType?: string, category?: string) => {
    if (!mimeType && !category) return <File className="w-5 h-5" />;

    // Check category first
    if (category) {
      switch (category) {
        case 'contract':
          return <FileText className="w-5 h-5 text-blue-600" />;
        case 'specification':
          return <FileCode className="w-5 h-5 text-purple-600" />;
        case 'design':
          return <ImageIcon className="w-5 h-5 text-pink-600" />;
        case 'report':
          return <FileText className="w-5 h-5 text-green-600" />;
        case 'invoice':
          return <FileSpreadsheet className="w-5 h-5 text-orange-600" />;
        default:
          return <File className="w-5 h-5 text-slate-600" />;
      }
    }

    // Check mime type
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    if (mimeType?.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    }
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    }
    if (mimeType?.includes('document') || mimeType?.includes('word')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }

    return <File className="w-5 h-5 text-slate-600" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      contract: 'Avtal',
      specification: 'Specifikation',
      design: 'Design',
      report: 'Rapport',
      invoice: 'Faktura',
      other: 'Övrigt',
    };
    return labels[category] || category;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Okänd storlek';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (filePath: string, fileName: string) => {
    // In a real app, this would trigger a download from the server
    // For now, we'll just show an alert
    console.log('Download:', filePath, fileName);
    alert(`I en riktig app skulle "${fileName}" laddas ner här.`);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error instanceof Error ? error.message : 'Failed to load documents'}</span>
        </div>
      </div>
    );
  }

  // Group documents by category
  const documentsByCategory = documents.reduce((acc: Record<string, any[]>, doc: any) => {
    const category = doc.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {});

  const categories = Object.keys(documentsByCategory).sort();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Dokument ({documents.length})
        </h3>
        {showUploadButton && (
          <button
            onClick={onUploadClick || (() => setIsUploadModalOpen(true))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Ladda upp
          </button>
        )}
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Inga dokument än
          </h3>
          <p className="text-slate-500 mb-6">
            Ladda upp dokument för att börja
          </p>
          {showUploadButton && (
            <button
              onClick={onUploadClick || (() => setIsUploadModalOpen(true))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Ladda upp första dokumentet
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-xl border border-slate-200">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="font-semibold text-slate-900">
                  {getCategoryLabel(category)} ({documentsByCategory[category].length})
                </h4>
              </div>
              <div className="divide-y divide-slate-100">
                {documentsByCategory[category].map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.mimeType, doc.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{doc.name}</p>
                        {doc.description && (
                          <p className="text-sm text-slate-600 truncate">{doc.description}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(doc.filePath, doc.name)}
                      className="flex-shrink-0 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ladda ner"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Ladda upp dokument"
        size="md"
      >
        <UploadDocumentForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setIsUploadModalOpen(false)}
          defaultProjectId={projectId}
        />
      </Modal>
    </div>
  );
};

export default DocumentList;
