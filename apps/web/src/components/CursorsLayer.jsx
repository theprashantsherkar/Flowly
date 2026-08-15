import { useViewport } from 'reactflow';

/**
 * Renders other users' live cursors, translating their flow-space coordinates
 * to screen space using the current viewport. Sits inside <ReactFlow>.
 */
export function CursorsLayer({ cursors }) {
  const { x, y, zoom } = useViewport();

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {cursors
        .filter((c) => c.cursor)
        .map((c) => {
          const left = x + c.cursor.x * zoom;
          const top = y + c.cursor.y * zoom;
          return (
            <div
              key={c.clientId}
              className="absolute -translate-x-1 -translate-y-1 transition-transform duration-75"
              style={{ transform: `translate(${left}px, ${top}px)` }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1,1 L1,15 L5,11 L8,17 L10,16 L7,10 L12,10 Z" fill={c.color} stroke="#fff" strokeWidth="1" />
              </svg>
              <span
                className="ml-3 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white shadow"
                style={{ background: c.color }}
              >
                {c.name}
              </span>
            </div>
          );
        })}
    </div>
  );
}
