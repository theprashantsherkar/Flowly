# @flowly/web

The Flowly web client — React 18 + ReactFlow + Zustand + Tailwind, built with Vite.

```bash
npm run dev       # dev server on http://localhost:3000
npm run build     # production build to dist/
npm run preview   # preview the production build
```

Migrated from Create React App to Vite. Source files use `.js` extensions but
contain JSX; `vite.config.js` configures esbuild to treat `src/**/*.js` as JSX.
