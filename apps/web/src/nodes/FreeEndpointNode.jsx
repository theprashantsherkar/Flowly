import { Handle, Position } from 'reactflow';

/**
 * The free end of an arrow/line. Unlike a shape, it has no body — just a small
 * grab dot the user can drag to move the loose end (or select + delete). The
 * Handle is a centered, pointer-transparent anchor so React Flow has somewhere to
 * terminate the edge while the surrounding node stays draggable.
 */
export function FreeEndpointNode({ selected }) {
  return (
    <div
      className="group relative flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      title="Drag to move this end · Delete to remove the arrow"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full border transition ${
          selected
            ? 'border-accent bg-accent shadow-[0_0_0_3px_rgba(99,102,241,0.3)]'
            : 'border-slate-300/80 bg-slate-600 opacity-60 group-hover:border-accent group-hover:opacity-100'
        }`}
      />
      <Handle
        id="free"
        type="source"
        position={Position.Left}
        className="!min-h-0 !min-w-0 !border-0 !bg-transparent"
        style={{ left: '50%', top: '50%', width: 6, height: 6, transform: 'translate(-50%, -50%)', opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  );
}
