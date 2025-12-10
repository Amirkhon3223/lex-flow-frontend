import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/app/providers/theme-provider';
import './index.css';
import './styles/calendar.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
);
