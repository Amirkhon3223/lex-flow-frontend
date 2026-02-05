'use client';

import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast as sonnerToast } from 'sonner';
import type { ToasterProps, ExternalToast } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
          title: 'group-[.toast]:font-semibold',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg',
          success:
            'group-[.toaster]:border-green-500/20 group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-950/20',
          error:
            'group-[.toaster]:border-red-500/20 group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950/20',
          warning:
            'group-[.toaster]:border-amber-500/20 group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-950/20',
          info: 'group-[.toaster]:border-blue-500/20 group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950/20',
        },
      }}
      style={
        {
          '--normal-bg': 'hsl(var(--popover))',
          '--normal-text': 'hsl(var(--popover-foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(142 71% 45% / 0.1)',
          '--success-text': 'hsl(142 71% 35%)',
          '--success-border': 'hsl(142 71% 45% / 0.2)',
          '--error-bg': 'hsl(0 84% 60% / 0.1)',
          '--error-text': 'hsl(0 84% 40%)',
          '--error-border': 'hsl(0 84% 60% / 0.2)',
        } as React.CSSProperties
      }
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />,
        loading: <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />,
      }}
      closeButton
      {...props}
    />
  );
};

/**
 * Enhanced toast functions with consistent styling
 */
interface ToastOptions extends ExternalToast {
  description?: string;
}

const toast = {
  /** Show a success toast */
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
    });
  },

  /** Show an error toast */
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
    });
  },

  /** Show a warning toast */
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
    });
  },

  /** Show an info toast */
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
    });
  },

  /** Show a loading toast that can be updated */
  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      ...options,
    });
  },

  /** Show a promise toast that updates based on promise state */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  /** Dismiss a specific toast or all toasts */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /** Show a custom toast */
  custom: sonnerToast.custom,
};

export { Toaster, toast };
