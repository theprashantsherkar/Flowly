import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The project was migrated from Create React App: many source files use `.js`
// extensions but contain JSX. Tell esbuild to treat every `src/**/*.js` file as
// JSX so we don't have to rename the whole tree.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Forward API calls to the NestJS backend (added in Phase 1).
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
