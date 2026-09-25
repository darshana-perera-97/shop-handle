import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// Modern chunks stay on the plugin's default ES2020 / current-browser target.
// Do not set build.target here — plugin-legacy owns that and overrides it.
// Legacy chunks are transpiled to ES5 with polyfills for the targets below.
export default defineConfig({
  plugins: [
    react(),
    legacy({
      // Legacy chunks only. Modern chunks stay on the plugin default
      // (ES2020, Safari 16.4+). Do not set build.target or modernTargets.
      targets: ['iOS >= 9', 'Safari >= 9'],
      renderModernChunks: true,
      modernPolyfills: false,
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:2223',
    },
  },
});
