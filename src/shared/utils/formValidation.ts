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
      return i18nService.t('COMMON.ERRORS.REQUIRED', { field: fieldName });
    }
    return null;
  },

  email: (value: string, _fieldName: string = 'Email'): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return i18nService.t('COMMON.ERRORS.INVALID_EMAIL');
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return i18nService.t('COMMON.ERRORS.MIN_LENGTH', { field: fieldName, min });
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return i18nService.t('COMMON.ERRORS.MAX_LENGTH', { field: fieldName, max });
    }
    return null;
  },

  exactLength: (value: string, len: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length !== len) {
      return i18nService.t('COMMON.ERRORS.MIN_LENGTH', { field: fieldName, min: len });
    }
    return null;
  },

  oneOf: (value: string, allowed: string[], fieldName: string): string | null => {
    if (!value) return null;
    if (!allowed.includes(value)) {
      return i18nService.t('COMMON.ERRORS.ONE_OF', { field: fieldName, options: allowed.join(', ') });
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Password' });
    if (value.length < 8) {
      return i18nService.t('COMMON.ERRORS.PASSWORD_MIN');
    }
    return null;
  },

  passwordMatch: (_password: string, _confirmPassword: string): string | null => {
    if (_password !== _confirmPassword) {
      return i18nService.t('COMMON.ERRORS.PASSWORDS_NOT_MATCH');
    }
    return null;
  },

  phone: (value: string, _fieldName: string = 'Phone'): string | null => {
    if (!value) return null;
    // Allow various phone formats
    const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(value)) {
      return i18nService.t('COMMON.ERRORS.INVALID_PHONE');
    }
    return null;
  },
};

/**
 * Parse API error response and extract field errors
 */
export function parseApiErrors(error: unknown): FormErrors {
  const errors: FormErrors = {};

  if (!error) return errors;

  // Handle Axios error structure
  const axiosError = error as { response?: { data?: { message?: string; error?: string; errors?: FieldError[] } } };

  if (axiosError.response?.data) {
    const data = axiosError.response.data;

    // If server returns field-specific errors
    if (data.errors && Array.isArray(data.errors)) {
      for (const fieldError of data.errors) {
        errors[fieldError.field] = fieldError.message;
      }
    }

    // Parse common error patterns from message
    if (data.message || data.error) {
      const message = data.message || data.error || '';

      // Map common backend error messages to fields with translated messages
      const errorMappings: [RegExp, string, string][] = [
        [/email.*already.*exists|duplicate.*email/i, 'email', i18nService.t('COMMON.ERRORS.EMAIL_EXISTS')],
        [/email.*required/i, 'email', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Email' })],
        [/invalid.*email/i, 'email', i18nService.t('COMMON.ERRORS.INVALID_EMAIL')],
        [/password.*required/i, 'password', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Password' })],
        [/password.*short|password.*min/i, 'password', i18nService.t('COMMON.ERRORS.PASSWORD_MIN')],
        [/passwords.*match|confirm.*password/i, 'confirmPassword', i18nService.t('COMMON.ERRORS.PASSWORDS_NOT_MATCH')],
        [/firstName.*required|first.*name.*required/i, 'firstName', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'First Name' })],
        [/lastName.*required|last.*name.*required/i, 'lastName', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Last Name' })],
        [/phone.*required/i, 'phone', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Phone' })],
        [/title.*required/i, 'title', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Title' })],
        [/client.*required|clientId.*required/i, 'clientId', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Client' })],
        [/type.*required/i, 'type', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Type' })],
        [/category.*required/i, 'category', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Category' })],
        [/date.*required/i, 'date', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Date' })],
        [/time.*required/i, 'time', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Time' })],
        [/invalid.*credentials|wrong.*password/i, 'password', i18nService.t('COMMON.ERRORS.INVALID_CREDENTIALS')],
        [/user.*not.*found/i, 'email', i18nService.t('COMMON.ERRORS.USER_NOT_FOUND')],
        [/2fa.*code.*invalid|invalid.*code/i, 'code', i18nService.t('COMMON.ERRORS.INVALID_CODE')],
        [/code.*required/i, 'code', i18nService.t('COMMON.ERRORS.REQUIRED', { field: 'Code' })],
      ];

      for (const [pattern, field, errorMessage] of errorMappings) {
        if (pattern.test(message)) {
          errors[field] = errorMessage;
        }
      }

      // If no specific field matched, add general error
      if (Object.keys(errors).length === 0 && message) {
        errors._general = message;
      }
    }
  }

  // Handle string error
  if (typeof error === 'string') {
    errors._general = error;
  }

  // Handle Error object
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
