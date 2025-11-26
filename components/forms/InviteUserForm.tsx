import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import { useCreateInvitation, useCompanies } from '../../src/hooks/useApi';

interface InviteUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultCompanyId?: string;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ onSuccess, onCancel, defaultCompanyId }) => {
  const { t } = useTranslation();
  const createInvitation = useCreateInvitation();
  const { data: companies = [] } = useCompanies();

  const [formData, setFormData] = useState({
    email: '',
    companyId: defaultCompanyId || '',
    role: 'customer' as 'customer',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('E-postadress krävs');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Ogiltig e-postadress');
      return;
    }

    if (!formData.companyId) {
      setError('Företag måste väljas');
      return;
    }

    try {
      await createInvitation.mutateAsync({
        email: formData.email,
        companyId: formData.companyId,
        role: formData.role,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skicka inbjudan');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          E-postadress <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="exempel@foretagsmail.se"
            required
          />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          En inbjudan skickas till denna e-postadress
        </p>
      </div>

      {/* Company Select */}
      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-slate-700 mb-2">
          Företag <span className="text-red-500">*</span>
        </label>
        <select
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={!!defaultCompanyId}
        >
          <option value="">Välj företag</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name} {company.orgNumber && `(${company.orgNumber})`}
            </option>
          ))}
        </select>
      </div>

      {/* Role Display */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Roll
        </label>
        <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-slate-500" />
            <span>Kund</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Användaren får tillgång till kundportalen
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          disabled={createInvitation.isPending}
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={createInvitation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {createInvitation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Skickar inbjudan...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Skicka inbjudan
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InviteUserForm;
