import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Bundle the shared package straight from its TypeScript source. This keeps the
// web app self-contained (no separate "build @flowly/shared" step), so it builds
// cleanly on Vercel with the root directory set to apps/web.
const sharedSrc = fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@flowly/shared': sharedSrc,
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Forward API calls to the Express backend during local dev.
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
