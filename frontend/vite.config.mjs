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
      targets: ['ios >= 9'],
      renderModernChunks: true,
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
