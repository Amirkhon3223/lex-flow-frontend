/**
 * Form validation utilities and API error handling
 */

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
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string, fieldName: string = 'Email'): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  },

  exactLength: (value: string, len: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length !== len) {
      return `${fieldName} must be exactly ${len} characters`;
    }
    return null;
  },

  oneOf: (value: string, allowed: string[], fieldName: string): string | null => {
    if (!value) return null;
    if (!allowed.includes(value)) {
      return `${fieldName} must be one of: ${allowed.join(', ')}`;
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  },

  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  },

  phone: (value: string, fieldName: string = 'Phone'): string | null => {
    if (!value) return null;
    // Allow various phone formats
    const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(value)) {
      return `${fieldName} must be a valid phone number`;
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

      // Map common backend error messages to fields
      const errorMappings: [RegExp, string, string][] = [
        [/email.*already.*exists|duplicate.*email/i, 'email', 'Email already exists'],
        [/email.*required/i, 'email', 'Email is required'],
        [/invalid.*email/i, 'email', 'Invalid email format'],
        [/password.*required/i, 'password', 'Password is required'],
        [/password.*short|password.*min/i, 'password', 'Password must be at least 8 characters'],
        [/passwords.*match|confirm.*password/i, 'confirmPassword', 'Passwords do not match'],
        [/firstName.*required|first.*name.*required/i, 'firstName', 'First name is required'],
        [/lastName.*required|last.*name.*required/i, 'lastName', 'Last name is required'],
        [/phone.*required/i, 'phone', 'Phone is required'],
        [/title.*required/i, 'title', 'Title is required'],
        [/client.*required|clientId.*required/i, 'clientId', 'Client is required'],
        [/type.*required/i, 'type', 'Type is required'],
        [/category.*required/i, 'category', 'Category is required'],
        [/date.*required/i, 'date', 'Date is required'],
        [/time.*required/i, 'time', 'Time is required'],
        [/invalid.*credentials|wrong.*password/i, 'password', 'Invalid email or password'],
        [/user.*not.*found/i, 'email', 'User not found'],
        [/2fa.*code.*invalid|invalid.*code/i, 'code', 'Invalid verification code'],
        [/code.*required/i, 'code', 'Verification code is required'],
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
