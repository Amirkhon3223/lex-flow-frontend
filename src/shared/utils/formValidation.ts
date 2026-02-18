/**
 * Form validation utilities and API error handling
 */

import { i18nService } from '@/app/services/i18n/i18n.service';

export interface FieldError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

/**
 * Validation rules matching backend binding tags
 */
export const validators = {
  required: (value: string | undefined | null, fieldName: string): string | null => {
    if (!value || value.trim() === '') {
      return i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', fieldName);
    }
    return null;
  },

  email: (value: string, fieldName: string = 'Email'): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return i18nService.t('COMMON.ERRORS.INVALID_EMAIL');
    }
    void fieldName;
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return i18nService
        .t('COMMON.ERRORS.MIN_LENGTH')
        .replace('{{field}}', fieldName)
        .replace('{{min}}', String(min));
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return i18nService
        .t('COMMON.ERRORS.MAX_LENGTH')
        .replace('{{field}}', fieldName)
        .replace('{{max}}', String(max));
    }
    return null;
  },

  exactLength: (value: string, len: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length !== len) {
      return i18nService
        .t('COMMON.ERRORS.EXACT_LENGTH')
        .replace('{{field}}', fieldName)
        .replace('{{len}}', String(len));
    }
    return null;
  },

  oneOf: (value: string, allowed: string[], fieldName: string): string | null => {
    if (!value) return null;
    if (!allowed.includes(value)) {
      return i18nService
        .t('COMMON.ERRORS.ONE_OF')
        .replace('{{field}}', fieldName)
        .replace('{{values}}', allowed.join(', '));
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return i18nService.t('COMMON.ERRORS.PASSWORD_REQUIRED');
    if (value.length < 8) {
      return i18nService.t('COMMON.ERRORS.PASSWORD_MIN');
    }
    return null;
  },

  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return i18nService.t('COMMON.ERRORS.PASSWORDS_NOT_MATCH');
    }
    return null;
  },

  phone: (value: string, fieldName: string = 'Phone'): string | null => {
    if (!value) return null;
    // Allow various phone formats
    const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(value)) {
      return i18nService.t('COMMON.ERRORS.INVALID_PHONE');
    }
    void fieldName;
    return null;
  },
};

/**
 * Parse API error response and extract field errors
 */
export function parseApiErrors(error: unknown): FormErrors {
  const errors: FormErrors = {};

  if (!error) return errors;

  const axiosError = error as { response?: { data?: { code?: string; message?: string; error?: string; errors?: FieldError[] } } };

  if (axiosError.response?.data) {
    const data = axiosError.response.data;

    if (data.errors && Array.isArray(data.errors)) {
      for (const fieldError of data.errors) {
        errors[fieldError.field] = fieldError.message;
      }
    }

    if (data.code) {
      const codeMappings: Record<string, [string, () => string]> = {
        INVALID_CREDENTIALS: ['_general', () => i18nService.t('COMMON.ERRORS.INVALID_CREDENTIALS')],
        EMAIL_EXISTS: ['email', () => i18nService.t('COMMON.ERRORS.EMAIL_EXISTS')],
        CLIENT_EMAIL_EXISTS: ['email', () => i18nService.t('COMMON.ERRORS.EMAIL_EXISTS')],
        EMAIL_REQUIRED: ['email', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', 'Email')],
        INVALID_EMAIL: ['email', () => i18nService.t('COMMON.ERRORS.INVALID_EMAIL')],
        PASSWORD_REQUIRED: ['password', () => i18nService.t('AUTH.ERRORS.PASSWORD_REQUIRED')],
        WEAK_PASSWORD: ['password', () => i18nService.t('AUTH.ERRORS.PASSWORD_MIN_LENGTH')],
        PASSWORD_MISMATCH: ['confirmPassword', () => i18nService.t('AUTH.ERRORS.PASSWORDS_NOT_MATCH')],
        TWO_FA_INVALID_CODE: ['code', () => i18nService.t('AUTH.ERRORS.INVALID_CODE')],
        TWO_FA_REQUIRED: ['_general', () => i18nService.t('AUTH.ERRORS.TWO_FA_REQUIRED')],
        TOKEN_EXPIRED: ['_general', () => i18nService.t('COMMON.ERRORS.SESSION_EXPIRED')],
        TOKEN_INVALID: ['_general', () => i18nService.t('COMMON.ERRORS.SESSION_EXPIRED')],
        PLAN_LIMIT_REACHED: ['_general', () => i18nService.t('COMMON.ERRORS.PLAN_LIMIT')],
        INSUFFICIENT_TOKENS: ['_general', () => i18nService.t('COMMON.ERRORS.INSUFFICIENT_TOKENS')],
        DAILY_LIMIT_REACHED: ['_general', () => i18nService.t('COMMON.ERRORS.DAILY_LIMIT')],
        RESOURCE_NOT_FOUND: ['_general', () => i18nService.t('COMMON.ERRORS.NOT_FOUND')],
        RATE_LIMIT_EXCEEDED: ['_general', () => i18nService.t('COMMON.ERRORS.RATE_LIMIT')],
        STORAGE_LIMIT_REACHED: ['_general', () => i18nService.t('COMMON.ERRORS.STORAGE_LIMIT')],
        INVALID_FILE_TYPE: ['_general', () => i18nService.t('COMMON.ERRORS.INVALID_FILE_TYPE')],
        FILE_TOO_LARGE: ['_general', () => i18nService.t('COMMON.ERRORS.FILE_TOO_LARGE')],
      };

      const mapping = codeMappings[data.code];
      if (mapping) {
        const [field, getErrorMessage] = mapping;
        errors[field] = getErrorMessage();
        return errors;
      }
    }

    if (data.message || data.error) {
      const message = data.message || data.error || '';

      const errorMappings: [RegExp, string, () => string][] = [
        [/invalid email or password/i, '_general', () => i18nService.t('COMMON.ERRORS.INVALID_CREDENTIALS')],
        [/invalid.*credentials|wrong.*password/i, '_general', () => i18nService.t('COMMON.ERRORS.INVALID_CREDENTIALS')],
        [/user.*not.*found/i, '_general', () => i18nService.t('COMMON.ERRORS.INVALID_CREDENTIALS')],
        [/email.*already.*exists|duplicate.*email/i, 'email', () => i18nService.t('COMMON.ERRORS.EMAIL_EXISTS')],
        [/email.*required/i, 'email', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', 'Email')],
        [/invalid.*email.*format|email.*invalid/i, 'email', () => i18nService.t('COMMON.ERRORS.INVALID_EMAIL')],
        [/password.*required/i, 'password', () => i18nService.t('AUTH.ERRORS.PASSWORD_REQUIRED')],
        [/password.*short|password.*min/i, 'password', () => i18nService.t('AUTH.ERRORS.PASSWORD_MIN_LENGTH')],
        [/passwords.*match|confirm.*password/i, 'confirmPassword', () => i18nService.t('AUTH.ERRORS.PASSWORDS_NOT_MATCH')],
        [/firstName.*required|first.*name.*required/i, 'firstName', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('AUTH.FIRST_NAME'))],
        [/lastName.*required|last.*name.*required/i, 'lastName', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('AUTH.LAST_NAME'))],
        [/phone.*required/i, 'phone', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('SETTINGS.PROFILE.PHONE'))],
        [/title.*required/i, 'title', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('CASES.FIELDS.TITLE'))],
        [/client.*required|clientId.*required/i, 'clientId', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('CASES.FIELDS.CLIENT'))],
        [/type.*required/i, 'type', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('DOCUMENTS.TYPE'))],
        [/category.*required/i, 'category', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('CASES.CATEGORY'))],
        [/date.*required/i, 'date', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('CALENDAR.DATE'))],
        [/time.*required/i, 'time', () => i18nService.t('COMMON.ERRORS.REQUIRED').replace('{{field}}', i18nService.t('CALENDAR.TIME'))],
        [/2fa.*code.*invalid|invalid.*code/i, 'code', () => i18nService.t('AUTH.ERRORS.INVALID_CODE')],
        [/code.*required/i, 'code', () => i18nService.t('AUTH.ERRORS.CODE_REQUIRED')],
      ];

      for (const [pattern, field, getErrorMessage] of errorMappings) {
        if (pattern.test(message)) {
          errors[field] = getErrorMessage();
          break;
        }
      }

      if (Object.keys(errors).length === 0 && message) {
        errors._general = message;
      }
    }
  }

  if (typeof error === 'string') {
    errors._general = error;
  }

  if (error instanceof Error && !Object.keys(errors).length) {
    errors._general = error.message;
  }

  return errors;
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: FormErrors, field: string): string | undefined {
  return errors[field];
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Clear specific field error
 */
export function clearFieldError(errors: FormErrors, field: string): FormErrors {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
}

/**
 * Validate multiple fields and return errors
 */
export function validateFields(validations: Array<{ field: string; error: string | null }>): FormErrors {
  const errors: FormErrors = {};
  for (const { field, error } of validations) {
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}
