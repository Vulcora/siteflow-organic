import { describe, it, expect } from 'vitest';
import {
  websiteFormSchema,
  systemFormSchema,
  getFormSchema,
  FormType,
  FormField,
} from './formSchema';

describe('formSchema', () => {
  describe('websiteFormSchema', () => {
    it('should have correct form type', () => {
      expect(websiteFormSchema.formType).toBe('website');
    });

    it('should have 8 sections', () => {
      expect(websiteFormSchema.sections).toHaveLength(8);
    });

    it('should have all required section keys', () => {
      const sectionKeys = websiteFormSchema.sections.map((s) => s.key);
      expect(sectionKeys).toContain('basic_info');
      expect(sectionKeys).toContain('current_situation');
      expect(sectionKeys).toContain('goals');
      expect(sectionKeys).toContain('design');
      expect(sectionKeys).toContain('content');
      expect(sectionKeys).toContain('functionality');
      expect(sectionKeys).toContain('technical');
      expect(sectionKeys).toContain('budget_timeline');
    });

    it('should have required fields in basic_info section', () => {
      const basicInfo = websiteFormSchema.sections.find((s) => s.key === 'basic_info');
      expect(basicInfo).toBeDefined();

      const requiredFields = basicInfo!.fields.filter((f) => f.required);
      expect(requiredFields.length).toBeGreaterThanOrEqual(2);

      const companyNameField = basicInfo!.fields.find((f) => f.key === 'company_name');
      expect(companyNameField).toBeDefined();
      expect(companyNameField?.required).toBe(true);
      expect(companyNameField?.type).toBe('text');
    });

    it('should have conditional fields in current_situation', () => {
      const currentSituation = websiteFormSchema.sections.find(
        (s) => s.key === 'current_situation'
      );
      expect(currentSituation).toBeDefined();

      const urlField = currentSituation!.fields.find((f) => f.key === 'existing_website_url');
      expect(urlField).toBeDefined();
      expect(urlField?.dependsOn).toBeDefined();
      expect(urlField?.dependsOn?.field).toBe('has_existing_website');
      expect(urlField?.dependsOn?.value).toBe('yes');
    });

    it('should have options for radio/select fields', () => {
      const goals = websiteFormSchema.sections.find((s) => s.key === 'goals');
      const primaryGoal = goals!.fields.find((f) => f.key === 'primary_goal');

      expect(primaryGoal).toBeDefined();
      expect(primaryGoal?.type).toBe('radio');
      expect(primaryGoal?.options).toBeDefined();
      expect(primaryGoal?.options?.length).toBeGreaterThan(3);
    });
  });

  describe('systemFormSchema', () => {
    it('should have correct form type', () => {
      expect(systemFormSchema.formType).toBe('system');
    });

    it('should have 9 sections', () => {
      expect(systemFormSchema.sections).toHaveLength(9);
    });

    it('should have all required section keys', () => {
      const sectionKeys = systemFormSchema.sections.map((s) => s.key);
      expect(sectionKeys).toContain('overview');
      expect(sectionKeys).toContain('current_systems');
      expect(sectionKeys).toContain('requirements');
      expect(sectionKeys).toContain('users');
      expect(sectionKeys).toContain('data');
      expect(sectionKeys).toContain('performance');
      expect(sectionKeys).toContain('security');
      expect(sectionKeys).toContain('support');
      expect(sectionKeys).toContain('budget_timeline');
    });

    it('should have required fields in overview section', () => {
      const overview = systemFormSchema.sections.find((s) => s.key === 'overview');
      expect(overview).toBeDefined();

      const systemTypeField = overview!.fields.find((f) => f.key === 'system_type');
      expect(systemTypeField).toBeDefined();
      expect(systemTypeField?.required).toBe(true);
    });

    it('should have multiselect fields where appropriate', () => {
      const users = systemFormSchema.sections.find((s) => s.key === 'users');
      const userTypes = users!.fields.find((f) => f.key === 'user_types');

      expect(userTypes).toBeDefined();
      expect(userTypes?.type).toBe('multiselect');
      expect(userTypes?.options?.length).toBeGreaterThan(2);
    });
  });

  describe('getFormSchema', () => {
    it('should return website schema for "website" type', () => {
      const schema = getFormSchema('website');
      expect(schema.formType).toBe('website');
      expect(schema.sections).toHaveLength(8);
    });

    it('should return system schema for "system" type', () => {
      const schema = getFormSchema('system');
      expect(schema.formType).toBe('system');
      expect(schema.sections).toHaveLength(9);
    });

    it('should return combined schema for "both" type', () => {
      const schema = getFormSchema('both');
      expect(schema.formType).toBe('both');
      // Should have sections from both website (8) and system (9)
      expect(schema.sections).toHaveLength(17);
    });
  });

  describe('field validation', () => {
    const getAllFields = (): FormField[] => {
      const websiteFields = websiteFormSchema.sections.flatMap((s) => s.fields);
      const systemFields = systemFormSchema.sections.flatMap((s) => s.fields);
      return [...websiteFields, ...systemFields];
    };

    it('all fields should have a key', () => {
      const fields = getAllFields();
      fields.forEach((field) => {
        expect(field.key).toBeDefined();
        expect(field.key.length).toBeGreaterThan(0);
      });
    });

    it('all fields should have a valid type', () => {
      const validTypes = [
        'text',
        'textarea',
        'email',
        'phone',
        'url',
        'select',
        'radio',
        'checkbox',
        'multiselect',
      ];
      const fields = getAllFields();
      fields.forEach((field) => {
        expect(validTypes).toContain(field.type);
      });
    });

    it('fields with options should have at least one option', () => {
      const fieldsWithOptions = getAllFields().filter((f) => f.options);
      fieldsWithOptions.forEach((field) => {
        expect(field.options!.length).toBeGreaterThan(0);
      });
    });

    it('options should have value and translationKey', () => {
      const fieldsWithOptions = getAllFields().filter((f) => f.options);
      fieldsWithOptions.forEach((field) => {
        field.options!.forEach((option) => {
          expect(option.value).toBeDefined();
          expect(option.translationKey).toBeDefined();
        });
      });
    });

    it('conditional fields should reference existing fields', () => {
      // Check all fields in all sections
      websiteFormSchema.sections.forEach((section) => {
        const fieldKeys = section.fields.map((f) => f.key);
        section.fields.forEach((field) => {
          if (field.dependsOn) {
            expect(fieldKeys).toContain(field.dependsOn.field);
          }
        });
      });
    });
  });

  describe('uniqueness', () => {
    it('website schema should have unique section keys', () => {
      const sectionKeys = websiteFormSchema.sections.map((s) => s.key);
      const uniqueKeys = new Set(sectionKeys);
      expect(uniqueKeys.size).toBe(sectionKeys.length);
    });

    it('system schema should have unique section keys', () => {
      const sectionKeys = systemFormSchema.sections.map((s) => s.key);
      const uniqueKeys = new Set(sectionKeys);
      expect(uniqueKeys.size).toBe(sectionKeys.length);
    });

    it('fields within sections should have unique keys', () => {
      [...websiteFormSchema.sections, ...systemFormSchema.sections].forEach((section) => {
        const fieldKeys = section.fields.map((f) => f.key);
        const uniqueKeys = new Set(fieldKeys);
        expect(uniqueKeys.size).toBe(fieldKeys.length);
      });
    });
  });
});
