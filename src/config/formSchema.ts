/**
 * Form Schema Configuration
 * Defines the structure of dynamic project questionnaires
 */

export type FormType = 'website' | 'system' | 'both';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'url'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'multiselect';

export interface FormFieldOption {
  value: string;
  translationKey: string;
}

export interface FormField {
  key: string;
  type: FieldType;
  required?: boolean;
  dependsOn?: {
    field: string;
    value: string | string[];
  };
  options?: FormFieldOption[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FormSection {
  key: string;
  fields: FormField[];
}

export interface FormSchema {
  formType: FormType;
  sections: FormSection[];
}

// Website Form Schema
export const websiteFormSchema: FormSchema = {
  formType: 'website',
  sections: [
    {
      key: 'basic_info',
      fields: [
        { key: 'company_name', type: 'text', required: true },
        { key: 'contact_person', type: 'text', required: true },
        { key: 'contact_email', type: 'email', required: true },
        { key: 'contact_phone', type: 'phone' },
      ],
    },
    {
      key: 'current_situation',
      fields: [
        {
          key: 'has_existing_website',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', translationKey: 'yes' },
            { value: 'no', translationKey: 'no' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
        {
          key: 'existing_website_url',
          type: 'url',
          dependsOn: { field: 'has_existing_website', value: 'yes' },
        },
        {
          key: 'existing_website_issues',
          type: 'multiselect',
          dependsOn: { field: 'has_existing_website', value: 'yes' },
          options: [
            { value: 'outdated_design', translationKey: 'outdated_design' },
            { value: 'poor_mobile_experience', translationKey: 'poor_mobile_experience' },
            { value: 'slow_loading', translationKey: 'slow_loading' },
            { value: 'hard_to_update', translationKey: 'hard_to_update' },
            { value: 'poor_seo', translationKey: 'poor_seo' },
            { value: 'not_converting', translationKey: 'not_converting' },
            { value: 'other', translationKey: 'other' },
          ],
        },
      ],
    },
    {
      key: 'goals',
      fields: [
        {
          key: 'primary_goal',
          type: 'radio',
          required: true,
          options: [
            { value: 'lead_generation', translationKey: 'lead_generation' },
            { value: 'sales', translationKey: 'sales' },
            { value: 'information', translationKey: 'information' },
            { value: 'recruitment', translationKey: 'recruitment' },
            { value: 'branding', translationKey: 'branding' },
            { value: 'support', translationKey: 'support' },
          ],
        },
        { key: 'target_audience', type: 'textarea', required: true },
        { key: 'unique_selling_points', type: 'textarea' },
        { key: 'competitor_websites', type: 'textarea' },
      ],
    },
    {
      key: 'design',
      fields: [
        {
          key: 'has_brand_guidelines',
          type: 'radio',
          options: [
            { value: 'yes_complete', translationKey: 'yes_complete' },
            { value: 'yes_partial', translationKey: 'yes_partial' },
            { value: 'no_but_assets', translationKey: 'no_but_assets' },
            { value: 'no_nothing', translationKey: 'no_nothing' },
          ],
        },
        {
          key: 'design_preferences',
          type: 'multiselect',
          options: [
            { value: 'minimalist', translationKey: 'minimalist' },
            { value: 'modern', translationKey: 'modern' },
            { value: 'classic', translationKey: 'classic' },
            { value: 'playful', translationKey: 'playful' },
            { value: 'luxury', translationKey: 'luxury' },
          ],
        },
        { key: 'inspiration_websites', type: 'textarea' },
        { key: 'colors', type: 'textarea' },
      ],
    },
    {
      key: 'content',
      fields: [
        {
          key: 'content_status',
          type: 'radio',
          required: true,
          options: [
            { value: 'all_ready', translationKey: 'all_ready' },
            { value: 'partially_ready', translationKey: 'partially_ready' },
            { value: 'needs_help', translationKey: 'needs_help' },
            { value: 'needs_full_service', translationKey: 'needs_full_service' },
          ],
        },
        {
          key: 'pages_needed',
          type: 'multiselect',
          required: true,
          options: [
            { value: 'home', translationKey: 'home' },
            { value: 'about', translationKey: 'about' },
            { value: 'services', translationKey: 'services' },
            { value: 'portfolio', translationKey: 'portfolio' },
            { value: 'blog', translationKey: 'blog' },
            { value: 'contact', translationKey: 'contact' },
            { value: 'faq', translationKey: 'faq' },
            { value: 'careers', translationKey: 'careers' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        {
          key: 'languages',
          type: 'radio',
          required: true,
          options: [
            { value: 'swedish', translationKey: 'swedish' },
            { value: 'english', translationKey: 'english' },
            { value: 'both', translationKey: 'both' },
            { value: 'other', translationKey: 'other' },
          ],
        },
      ],
    },
    {
      key: 'functionality',
      fields: [
        {
          key: 'features_needed',
          type: 'multiselect',
          options: [
            { value: 'contact_form', translationKey: 'contact_form' },
            { value: 'newsletter', translationKey: 'newsletter' },
            { value: 'booking', translationKey: 'booking' },
            { value: 'ecommerce', translationKey: 'ecommerce' },
            { value: 'member_area', translationKey: 'member_area' },
            { value: 'search', translationKey: 'search' },
            { value: 'chat', translationKey: 'chat' },
            { value: 'maps', translationKey: 'maps' },
            { value: 'video', translationKey: 'video' },
            { value: 'social_feed', translationKey: 'social_feed' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        {
          key: 'integrations_needed',
          type: 'multiselect',
          options: [
            { value: 'crm', translationKey: 'crm' },
            { value: 'email_marketing', translationKey: 'email_marketing' },
            { value: 'analytics', translationKey: 'analytics' },
            { value: 'payment', translationKey: 'payment' },
            { value: 'erp', translationKey: 'erp' },
            { value: 'other', translationKey: 'other' },
          ],
        },
      ],
    },
    {
      key: 'technical',
      fields: [
        {
          key: 'hosting_preference',
          type: 'radio',
          options: [
            { value: 'you_handle', translationKey: 'you_handle' },
            { value: 'we_have', translationKey: 'we_have' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
        {
          key: 'domain_status',
          type: 'radio',
          options: [
            { value: 'yes_keep', translationKey: 'yes_keep' },
            { value: 'yes_change', translationKey: 'yes_change' },
            { value: 'no', translationKey: 'no' },
          ],
        },
        {
          key: 'cms_preference',
          type: 'radio',
          options: [
            { value: 'no_preference', translationKey: 'no_preference' },
            { value: 'wordpress', translationKey: 'wordpress' },
            { value: 'custom', translationKey: 'custom' },
            { value: 'other', translationKey: 'other' },
          ],
        },
      ],
    },
    {
      key: 'budget_timeline',
      fields: [
        {
          key: 'budget_range',
          type: 'radio',
          required: true,
          options: [
            { value: 'small', translationKey: 'small' },
            { value: 'medium', translationKey: 'medium' },
            { value: 'large', translationKey: 'large' },
            { value: 'enterprise', translationKey: 'enterprise' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
        { key: 'deadline', type: 'text' },
        { key: 'launch_date', type: 'text' },
        {
          key: 'priority',
          type: 'radio',
          required: true,
          options: [
            { value: 'quality', translationKey: 'quality' },
            { value: 'speed', translationKey: 'speed' },
            { value: 'price', translationKey: 'price' },
          ],
        },
      ],
    },
  ],
};

// System Form Schema
export const systemFormSchema: FormSchema = {
  formType: 'system',
  sections: [
    {
      key: 'overview',
      fields: [
        {
          key: 'system_type',
          type: 'radio',
          required: true,
          options: [
            { value: 'internal_tool', translationKey: 'internal_tool' },
            { value: 'customer_portal', translationKey: 'customer_portal' },
            { value: 'saas', translationKey: 'saas' },
            { value: 'mobile_app', translationKey: 'mobile_app' },
            { value: 'api', translationKey: 'api' },
            { value: 'automation', translationKey: 'automation' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        { key: 'problem_description', type: 'textarea', required: true },
        { key: 'expected_outcome', type: 'textarea', required: true },
      ],
    },
    {
      key: 'current_systems',
      fields: [
        {
          key: 'existing_systems',
          type: 'multiselect',
          options: [
            { value: 'excel', translationKey: 'excel' },
            { value: 'custom_system', translationKey: 'custom_system' },
            { value: 'saas_tools', translationKey: 'saas_tools' },
            { value: 'paper_based', translationKey: 'paper_based' },
            { value: 'erp', translationKey: 'erp' },
            { value: 'crm', translationKey: 'crm' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        { key: 'pain_points', type: 'textarea' },
        {
          key: 'data_to_migrate',
          type: 'radio',
          options: [
            { value: 'yes_much', translationKey: 'yes_much' },
            { value: 'yes_some', translationKey: 'yes_some' },
            { value: 'no', translationKey: 'no' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
      ],
    },
    {
      key: 'requirements',
      fields: [
        { key: 'must_have_features', type: 'textarea', required: true },
        { key: 'nice_to_have_features', type: 'textarea' },
        { key: 'workflow_description', type: 'textarea' },
      ],
    },
    {
      key: 'users',
      fields: [
        {
          key: 'user_count',
          type: 'radio',
          required: true,
          options: [
            { value: 'small', translationKey: 'small' },
            { value: 'medium', translationKey: 'medium' },
            { value: 'large', translationKey: 'large' },
            { value: 'enterprise', translationKey: 'enterprise' },
          ],
        },
        {
          key: 'user_types',
          type: 'multiselect',
          required: true,
          options: [
            { value: 'admin', translationKey: 'admin' },
            { value: 'internal_users', translationKey: 'internal_users' },
            { value: 'customers', translationKey: 'customers' },
            { value: 'partners', translationKey: 'partners' },
            { value: 'public', translationKey: 'public' },
          ],
        },
        {
          key: 'access_requirements',
          type: 'multiselect',
          options: [
            { value: 'sso', translationKey: 'sso' },
            { value: 'mfa', translationKey: 'mfa' },
            { value: 'role_based', translationKey: 'role_based' },
            { value: 'audit_log', translationKey: 'audit_log' },
            { value: 'ip_restriction', translationKey: 'ip_restriction' },
          ],
        },
      ],
    },
    {
      key: 'data',
      fields: [
        {
          key: 'data_types',
          type: 'multiselect',
          required: true,
          options: [
            { value: 'customer_data', translationKey: 'customer_data' },
            { value: 'financial_data', translationKey: 'financial_data' },
            { value: 'product_data', translationKey: 'product_data' },
            { value: 'documents', translationKey: 'documents' },
            { value: 'sensitive_personal_data', translationKey: 'sensitive_personal_data' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        {
          key: 'integrations_needed',
          type: 'multiselect',
          options: [
            { value: 'accounting', translationKey: 'accounting' },
            { value: 'crm', translationKey: 'crm' },
            { value: 'erp', translationKey: 'erp' },
            { value: 'email', translationKey: 'email' },
            { value: 'payment', translationKey: 'payment' },
            { value: 'logistics', translationKey: 'logistics' },
            { value: 'api_external', translationKey: 'api_external' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        { key: 'reporting_needs', type: 'textarea' },
      ],
    },
    {
      key: 'performance',
      fields: [
        {
          key: 'availability_requirements',
          type: 'radio',
          required: true,
          options: [
            { value: 'standard', translationKey: 'standard' },
            { value: 'high', translationKey: 'high' },
            { value: 'critical', translationKey: 'critical' },
          ],
        },
        {
          key: 'expected_load',
          type: 'radio',
          options: [
            { value: 'low', translationKey: 'low' },
            { value: 'medium', translationKey: 'medium' },
            { value: 'high', translationKey: 'high' },
            { value: 'very_high', translationKey: 'very_high' },
          ],
        },
        {
          key: 'scaling_needs',
          type: 'radio',
          options: [
            { value: 'stable', translationKey: 'stable' },
            { value: 'growing', translationKey: 'growing' },
            { value: 'peaks', translationKey: 'peaks' },
            { value: 'unpredictable', translationKey: 'unpredictable' },
          ],
        },
      ],
    },
    {
      key: 'security',
      fields: [
        {
          key: 'compliance_requirements',
          type: 'multiselect',
          options: [
            { value: 'gdpr', translationKey: 'gdpr' },
            { value: 'pci_dss', translationKey: 'pci_dss' },
            { value: 'hipaa', translationKey: 'hipaa' },
            { value: 'iso27001', translationKey: 'iso27001' },
            { value: 'none', translationKey: 'none' },
            { value: 'other', translationKey: 'other' },
          ],
        },
        {
          key: 'data_location',
          type: 'radio',
          required: true,
          options: [
            { value: 'sweden', translationKey: 'sweden' },
            { value: 'eu', translationKey: 'eu' },
            { value: 'anywhere', translationKey: 'anywhere' },
            { value: 'on_premise', translationKey: 'on_premise' },
          ],
        },
        {
          key: 'backup_requirements',
          type: 'radio',
          options: [
            { value: 'standard', translationKey: 'standard' },
            { value: 'frequent', translationKey: 'frequent' },
            { value: 'realtime', translationKey: 'realtime' },
            { value: 'custom', translationKey: 'custom' },
          ],
        },
      ],
    },
    {
      key: 'support',
      fields: [
        {
          key: 'support_level',
          type: 'radio',
          options: [
            { value: 'self_service', translationKey: 'self_service' },
            { value: 'business_hours', translationKey: 'business_hours' },
            { value: 'extended', translationKey: 'extended' },
            { value: '24_7', translationKey: '24_7' },
          ],
        },
        {
          key: 'training_needs',
          type: 'multiselect',
          options: [
            { value: 'none', translationKey: 'none' },
            { value: 'documentation', translationKey: 'documentation' },
            { value: 'video', translationKey: 'video' },
            { value: 'onsite', translationKey: 'onsite' },
            { value: 'ongoing', translationKey: 'ongoing' },
          ],
        },
        {
          key: 'maintenance_preference',
          type: 'radio',
          options: [
            { value: 'fully_managed', translationKey: 'fully_managed' },
            { value: 'shared', translationKey: 'shared' },
            { value: 'self_managed', translationKey: 'self_managed' },
          ],
        },
      ],
    },
    {
      key: 'budget_timeline',
      fields: [
        {
          key: 'budget_range',
          type: 'radio',
          required: true,
          options: [
            { value: 'small', translationKey: 'small' },
            { value: 'medium', translationKey: 'medium' },
            { value: 'large', translationKey: 'large' },
            { value: 'enterprise', translationKey: 'enterprise' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
        {
          key: 'timeline_flexibility',
          type: 'radio',
          required: true,
          options: [
            { value: 'fixed', translationKey: 'fixed' },
            { value: 'flexible', translationKey: 'flexible' },
            { value: 'asap', translationKey: 'asap' },
          ],
        },
        {
          key: 'mvp_approach',
          type: 'radio',
          options: [
            { value: 'yes', translationKey: 'yes' },
            { value: 'no', translationKey: 'no' },
            { value: 'unsure', translationKey: 'unsure' },
          ],
        },
      ],
    },
  ],
};

// Helper function to get schema by form type
export function getFormSchema(formType: FormType): FormSchema {
  switch (formType) {
    case 'website':
      return websiteFormSchema;
    case 'system':
      return systemFormSchema;
    case 'both':
      // For 'both', return a combined schema
      return {
        formType: 'both',
        sections: [
          ...websiteFormSchema.sections,
          ...systemFormSchema.sections,
        ],
      };
  }
}

// Helper to get section translation key prefix
export function getSectionTranslationPath(formType: FormType, sectionKey: string): string {
  if (formType === 'website') {
    return `projectForm.website.${sectionKey}`;
  } else if (formType === 'system') {
    return `projectForm.system.${sectionKey}`;
  }
  return `projectForm.sections.${sectionKey}`;
}
