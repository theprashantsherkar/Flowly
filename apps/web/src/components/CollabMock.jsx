/** A small static "product screenshot" of a shared board with live cursors. */
export function CollabMock() {
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <rect x="0" y="0" width="440" height="300" rx="12" fill="#0b0d12" stroke="#262b36" />
      {/* window chrome */}
      <circle cx="20" cy="20" r="4" fill="#334155" />
      <circle cx="34" cy="20" r="4" fill="#334155" />
      <circle cx="48" cy="20" r="4" fill="#334155" />
      {/* avatar stack */}
      <g transform="translate(360,12)">
        <circle cx="0" cy="8" r="10" fill="#2563eb" stroke="#0b0d12" strokeWidth="2" />
        <circle cx="16" cy="8" r="10" fill="#f43f5e" stroke="#0b0d12" strokeWidth="2" />
        <circle cx="32" cy="8" r="10" fill="#10b981" stroke="#0b0d12" strokeWidth="2" />
      </g>

      {/* board content */}
      <line x1="150" y1="95" x2="150" y2="150" stroke="#64748b" strokeWidth="2" />
      <line x1="245" y1="180" x2="300" y2="180" stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      <rect x="95" y="60" width="110" height="40" rx="8" fill="rgba(37,99,235,.16)" stroke="#2563eb" strokeWidth="2" />
      <text x="150" y="85" textAnchor="middle" fill="#dbeafe" fontSize="13" fontFamily="Inter, sans-serif">Idea</text>
      <polygon points="150,150 195,180 150,210 105,180" fill="rgba(217,119,6,.16)" stroke="#d97706" strokeWidth="2" />
      <text x="150" y="185" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="Inter, sans-serif">Review</text>
      <rect x="300" y="160" width="100" height="40" rx="8" fill="rgba(16,185,129,.16)" stroke="#10b981" strokeWidth="2" />
      <text x="350" y="185" textAnchor="middle" fill="#d1fae5" fontSize="13" fontFamily="Inter, sans-serif">Done</text>

      {/* cursors */}
      <g transform="translate(210,120)">
        <path d="M0,0 L0,14 L4,10 L6,15 L8,14 L6,9 L11,9 Z" fill="#2563eb" stroke="#fff" strokeWidth=".6" />
        <rect x="11" y="9" width="38" height="14" rx="7" fill="#2563eb" />
        <text x="30" y="19" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Inter, sans-serif">Aria</text>
      </g>
      <g transform="translate(300,120)">
        <path d="M0,0 L0,14 L4,10 L6,15 L8,14 L6,9 L11,9 Z" fill="#f43f5e" stroke="#fff" strokeWidth=".6" />
        <rect x="11" y="9" width="36" height="14" rx="7" fill="#f43f5e" />
        <text x="29" y="19" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Inter, sans-serif">Max</text>
      </g>
    </svg>
  );
}
