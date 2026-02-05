import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { initializeAnalytics } from '@/shared/utils/analytics';
import { initSentry } from '@/app/config/sentry';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import './index.css';
import './styles/calendar.css';
import App from './App.tsx';

// Initialize Sentry error tracking (must be first)
initSentry();

// Initialize Google Analytics (only in production with valid config)
initializeAnalytics();

// Register Service Worker (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically (every 60 minutes)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProvider>
);
