import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Upload, File, X } from 'lucide-react';
import { useCreateDocument, useProjects } from '../../src/hooks/useApi';

interface UploadDocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultProjectId?: string;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({
  onSuccess,
  onCancel,
  defaultProjectId,
}) => {
  const { t } = useTranslation();
  const createDocument = useCreateDocument();
  const { data: projects = [] } = useProjects();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: 'other' as 'contract' | 'specification' | 'design' | 'report' | 'invoice' | 'other',
    projectId: defaultProjectId || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for demo)
      if (file.size > 10 * 1024 * 1024) {
        setError('Filen är för stor. Max storlek är 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError('Välj en fil att ladda upp');
      return;
    }

    if (!formData.projectId) {
      setError('Projekt måste väljas');
      return;
    }

    try {
      // In a real app, you would upload the file to a storage service first
      // and get back a file path/URL. For now, we'll simulate this.
      const simulatedFilePath = `/uploads/${Date.now()}_${selectedFile.name}`;

      await createDocument.mutateAsync({
        name: selectedFile.name,
        description: formData.description || undefined,
        filePath: simulatedFilePath,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type || undefined,
        category: formData.category,
        projectId: formData.projectId,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda upp dokument');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-slate-700 mb-2">
          Fil <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <label htmlFor="file" className="cursor-pointer">
              <span className="text-sm text-slate-600">
                Klicka för att välja fil eller dra och släpp
              </span>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">Max 10MB</p>
          </div>
        ) : (
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Selection */}
      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 mb-2">
          Projekt <span className="text-red-500">*</span>
        </label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={!!defaultProjectId}
        >
          <option value="">Välj projekt</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="other">Övrigt</option>
          <option value="contract">Avtal</option>
          <option value="specification">Specifikation</option>
          <option value="design">Design</option>
          <option value="report">Rapport</option>
          <option value="invoice">Faktura</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
          Beskrivning (valfritt)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Beskriv dokumentet..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={createDocument.isPending}
          >
            Avbryt
          </button>
        )}
        <button
          type="submit"
          disabled={createDocument.isPending || !selectedFile}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createDocument.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Laddar upp...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Ladda upp
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UploadDocumentForm;
