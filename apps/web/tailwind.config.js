/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cool neutral base with a formal blue accent (Linear/Vercel-esque).
        canvas: '#0b0d12',
        panel: '#141821',
        panelLight: '#1b2029',
        borderSoft: '#262b36',
        accent: '#2563eb',
        accentHover: '#1d4ed8',
        destructive: '#dc2626',
      },
      boxShadow: {
        node: '0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
