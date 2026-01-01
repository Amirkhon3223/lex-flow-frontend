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
    // Target modern browsers for smaller bundles
    target: 'esnext',

    // Enable minification
    minify: 'esbuild',

    // CSS code splitting
    cssCodeSplit: true,

    // Sourcemaps только для debugging (можно отключить в prod)
    sourcemap: false,

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

        manualChunks(id) {
          // React core (самый важный vendor chunk)
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }

          // React Router (отдельно от react-core)
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }

          // TanStack Query (отдельный chunk)
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'tanstack-query';
          }

          // Charts (очень тяжелая библиотека - отдельно)
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }

          // Radix UI компоненты (большой набор)
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }

          // Lucide icons (объединить с UI)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          // Forms (react-hook-form + zod)
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms';
          }

          // State management (zustand)
          if (id.includes('node_modules/zustand')) {
            return 'state';
          }

          // HTTP (axios)
          if (id.includes('node_modules/axios')) {
            return 'http';
          }

          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'date-utils';
          }

          // Other node_modules -> common vendor
          if (id.includes('node_modules')) {
            return 'vendor-common';
          }
        },
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
    ],
  },
});