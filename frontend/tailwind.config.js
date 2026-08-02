/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0f1420',
        panel: '#1C2536',
        panelLight: '#243044',
        accent: '#6366f1',
        accentHover: '#4f46e5',
        borderSoft: '#2d3a52',
      },
      boxShadow: {
        node: '0 4px 14px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
