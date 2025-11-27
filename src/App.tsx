import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { I18nProvider } from '@/shared/context/I18nContext';
import { Toaster } from '@/shared/ui/sonner';
import { router } from './app/router';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors expand />
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
