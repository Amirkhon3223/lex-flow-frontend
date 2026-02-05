import * as Sentry from '@sentry/react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/ui/button';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: FallbackProps) {
  const handleReportIssue = () => {
    Sentry.showReportDialog({
      eventId: Sentry.lastEventId(),
      title: 'Report an Issue',
      subtitle: 'Our team has been notified. You can provide additional details below.',
      subtitle2: '',
      labelName: 'Name',
      labelEmail: 'Email',
      labelComments: 'What happened?',
      labelClose: 'Close',
      labelSubmit: 'Submit Report',
      successMessage: 'Thank you for your feedback!',
    });
  };

  const handleGoToDashboard = () => {
    window.location.href = '/';
  };

  const handleRefresh = () => {
    resetError();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Our team has been notified and is working on a fix.
          </p>
        </div>

        {import.meta.env.DEV && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
            <p className="mb-2 text-sm font-medium text-destructive">Error Details (dev only):</p>
            <pre className="overflow-auto text-xs text-muted-foreground">
              {error.message}
            </pre>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button onClick={handleGoToDashboard} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>

          {import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN && (
            <Button onClick={handleReportIssue} variant="default" className="gap-2">
              Report Issue
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error, componentStack) => {
        // Log to console in development
        if (import.meta.env.DEV) {
          console.error('ErrorBoundary caught an error:', error);
          console.error('Component stack:', componentStack);
        }
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
