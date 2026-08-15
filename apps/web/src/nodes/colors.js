export const SWATCHES = [
  '#2563eb',
  '#0ea5e9',
  '#0891b2',
  '#14b8a6',
  '#10b981',
  '#d97706',
  '#f59e0b',
  '#f43f5e',
  '#e2e8f0',
];

/** Convert a #rrggbb hex color to an rgba() string with the given alpha. */
export function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
