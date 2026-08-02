import { Handle, Position } from 'reactflow';

const isVertical = (position) =>
  position === Position.Left || position === Position.Right;

export const BaseNode = ({ title, icon, accent = 'bg-accent', handles = [], children, style }) => {
  const countsBySide = handles.reduce((acc, h) => {
    acc[h.position] = (acc[h.position] || 0) + 1;
    return acc;
  }, {});
  const seenBySide = {};

  return (
    <div
      className="relative rounded-xl border border-borderSoft bg-panel text-slate-100 shadow-node min-w-[220px]"
      style={style}
    >
      {handles.map((h) => {
        const total = countsBySide[h.position];
        const index = seenBySide[h.position] || 0;
        seenBySide[h.position] = index + 1;
        const offset = `${((index + 1) / (total + 1)) * 100}%`;
        const placement = isVertical(h.position) ? { top: offset } : { left: offset };
        return (
          <Handle
            key={h.id}
            type={h.type}
            position={h.position}
            id={h.id}
            style={{ ...placement, ...(h.style || {}) }}
          />
        );
      })}

      <div className={`flex items-center gap-2 rounded-t-xl px-3 py-2 text-sm font-semibold ${accent}`}>
        {icon && <span className="text-base leading-none">{icon}</span>}
        <span>{title}</span>
      </div>

      <div className="flex flex-col gap-2 px-3 py-3">{children}</div>
    </div>
  );
};
