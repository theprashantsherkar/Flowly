/**
 * An animated SVG that shows what Flowly does: shapes pop in, connectors draw
 * themselves, and two collaborator cursors move around the canvas — hinting at
 * real-time multiplayer. Pure CSS keyframes, no dependencies.
 */
export function HeroAnimation() {
  return (
    <div className="relative w-full">
      <style>{`
        @keyframes fly-pop { 0% { opacity: 0; transform: scale(.7); } 60% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fly-draw { to { stroke-dashoffset: 0; } }
        @keyframes fly-c1 { 0%{transform:translate(60px,150px)} 20%{transform:translate(230px,70px)} 45%{transform:translate(250px,175px)} 70%{transform:translate(380px,265px)} 100%{transform:translate(60px,150px)} }
        @keyframes fly-c2 { 0%{transform:translate(360px,90px)} 30%{transform:translate(250px,255px)} 55%{transform:translate(110px,175px)} 80%{transform:translate(300px,60px)} 100%{transform:translate(360px,90px)} }
        @keyframes fly-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(0,-6px)} }
        .fly-node { animation: fly-pop .7s cubic-bezier(.2,.8,.3,1) both; transform-box: fill-box; transform-origin: center; }
        .fly-edge { stroke-dasharray: 260; stroke-dashoffset: 260; animation: fly-draw 1s ease-out forwards; }
        .fly-cursor { animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      `}</style>

      <div style={{ animation: 'fly-float 6s ease-in-out infinite' }}>
        <svg viewBox="0 0 460 340" className="w-full drop-shadow-2xl">
          <defs>
            <marker id="fly-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
            </marker>
          </defs>

          {/* Connectors (draw in after the nodes they join) */}
          <path className="fly-edge" style={{ animationDelay: '.5s' }} d="M130,172 C160,172 160,66 180,66"
            fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#fly-arrow)" />
          <path className="fly-edge" style={{ animationDelay: '.9s' }} d="M245,90 C245,110 250,120 250,140"
            fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#fly-arrow)" />
          <path className="fly-edge" style={{ animationDelay: '1.3s' }} d="M312,190 C340,190 345,250 350,262"
            fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" markerEnd="url(#fly-arrow)" />

          {/* Start (terminator) */}
          <g className="fly-node" style={{ animationDelay: '0s' }}>
            <rect x="20" y="150" width="110" height="44" rx="22" fill="rgba(16,185,129,.16)" stroke="#10b981" strokeWidth="2" />
            <text x="75" y="177" textAnchor="middle" fill="#d1fae5" fontSize="14" fontFamily="Inter, sans-serif">Start</text>
          </g>

          {/* Process */}
          <g className="fly-node" style={{ animationDelay: '.4s' }}>
            <rect x="180" y="42" width="130" height="48" rx="6" fill="rgba(99,102,241,.16)" stroke="#6366f1" strokeWidth="2" />
            <text x="245" y="71" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontFamily="Inter, sans-serif">Plan work</text>
          </g>

          {/* Decision (diamond) */}
          <g className="fly-node" style={{ animationDelay: '.8s' }}>
            <polygon points="250,142 312,190 250,238 188,190" fill="rgba(217,70,239,.16)" stroke="#d946ef" strokeWidth="2" />
            <text x="250" y="195" textAnchor="middle" fill="#fae8ff" fontSize="13" fontFamily="Inter, sans-serif">Approve?</text>
          </g>

          {/* Ship (process) */}
          <g className="fly-node" style={{ animationDelay: '1.2s' }}>
            <rect x="345" y="240" width="105" height="46" rx="6" fill="rgba(14,165,233,.16)" stroke="#0ea5e9" strokeWidth="2" />
            <text x="397" y="268" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontFamily="Inter, sans-serif">Ship</text>
          </g>

          {/* Collaborator cursors */}
          <g className="fly-cursor" style={{ animation: 'fly-c1 9s infinite' }}>
            <path d="M0,0 L0,16 L4,12 L7,18 L9,17 L6,11 L11,11 Z" fill="#6366f1" stroke="#fff" strokeWidth=".7" />
            <rect x="12" y="10" width="42" height="16" rx="8" fill="#6366f1" />
            <text x="33" y="22" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Inter, sans-serif">Aria</text>
          </g>
          <g className="fly-cursor" style={{ animation: 'fly-c2 11s infinite' }}>
            <path d="M0,0 L0,16 L4,12 L7,18 L9,17 L6,11 L11,11 Z" fill="#f43f5e" stroke="#fff" strokeWidth=".7" />
            <rect x="12" y="10" width="40" height="16" rx="8" fill="#f43f5e" />
            <text x="32" y="22" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Inter, sans-serif">Max</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
