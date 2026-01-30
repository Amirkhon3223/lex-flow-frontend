import type { ReactNode } from 'react';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/ui/utils';

interface FormFieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

/**
 * Wrapper component for form fields with label and error display
 */
export function FormFieldWrapper({
  label,
  error,
  required,
  children,
  className,
  htmlFor,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className={cn(error && '[&>input]:border-destructive [&>input]:ring-destructive/20 [&>textarea]:border-destructive [&>select]:border-destructive [&_button]:border-destructive')}>
        {children}
      </div>
      {error && (
        <p className="text-destructive text-xs font-medium animate-in fade-in-0 slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Simple inline error message
 */
export function FieldError({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <p className="text-destructive text-xs font-medium mt-1 animate-in fade-in-0 slide-in-from-top-1">
      {error}
    </p>
  );
}

/**
 * General form error (for non-field-specific errors)
 */
export function FormError({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4 animate-in fade-in-0 slide-in-from-top-2">
      {error}
    </div>
  );
}
