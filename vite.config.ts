import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }

          // Charts (очень тяжелая библиотека)
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }

          // Radix UI компоненты
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }

          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }

          // Forms
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms';
          }

          // State management
          if (id.includes('node_modules/zustand')) {
            return 'state';
          }

          // HTTP
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
        },
      },
    },
    // Увеличиваем chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});