import { useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeResizer, NodeToolbar } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { SHAPE_MAP } from '@flowly/shared';
import { useStore } from '../store';
import { ShapeSvg } from './ShapeSvg';
import { SWATCHES, hexToRgba } from './colors';

const SIDES = [
  ['top', Position.Top],
  ['right', Position.Right],
  ['bottom', Position.Bottom],
  ['left', Position.Left],
];

export function ShapeNode({ id, data, selected }) {
  const def = SHAPE_MAP[data.shape] || SHAPE_MAP.process;
  const color = data.color || def.defaultColor;
  const updateNodeField = useStore((s) => s.updateNodeField);
  const deleteNode = useStore((s) => s.deleteNode);

  const [editing, setEditing] = useState(false);
  const textareaRef = useRef(null);
  const label = data.label ?? '';

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const isText = def.key === 'text';
  const isNote = def.key === 'note';
  const fill = isNote ? hexToRgba(color, 0.92) : isText ? 'transparent' : hexToRgba(color, 0.14);
  const textColor = isNote ? '#1c1917' : '#e2e8f0';
  const isRound = def.key === 'connector';
  const isArrow = def.key === 'arrow';

  return (
    <div className="group relative h-full w-full">
      <NodeResizer
        color={color}
        isVisible={selected}
        minWidth={isRound ? 48 : 72}
        minHeight={isRound ? 48 : 36}
        keepAspectRatio={isRound}
      />

      <NodeToolbar isVisible={selected} className="flex items-center gap-1.5 rounded-lg border border-borderSoft bg-panel p-1.5 shadow-node">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            title="Set color"
            onClick={() => updateNodeField(id, 'color', c)}
            className="h-4 w-4 rounded-full border border-black/40 transition hover:scale-110"
            style={{ background: c }}
          />
        ))}
        <span className="mx-0.5 h-4 w-px bg-borderSoft" />
        <button
          type="button"
          title="Delete"
          onClick={() => deleteNode(id)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-500/15 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </NodeToolbar>

      {!isText && <ShapeSvg shape={def.key} stroke={color} fill={fill} />}

      {!isArrow &&
        SIDES.map(([name, position]) => (
          <Handle
            key={name}
            id={name}
            type="source"
            position={position}
            className="!h-2.5 !w-2.5 !border-2 !bg-panel opacity-0 transition-opacity group-hover:opacity-100"
            style={{ borderColor: color }}
          />
        ))}

      <div
        className="absolute inset-0 flex items-center justify-center p-2"
        onDoubleClick={() => setEditing(true)}
      >
        {editing ? (
          <textarea
            ref={textareaRef}
            defaultValue={label}
            onBlur={(e) => {
              updateNodeField(id, 'label', e.target.value);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditing(false);
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className="nodrag nowheel h-full w-full resize-none bg-transparent text-center text-sm outline-none"
            style={{ color: textColor }}
          />
        ) : (
          <>
            {isArrow ? (
              label ? (
                <span
                  className="pointer-events-none -translate-y-full select-none rounded-full bg-panel/80 px-2 py-0.5 text-[11px] font-medium text-slate-200 shadow-sm backdrop-blur"
                  style={{ color: textColor }}
                >
                  {label}
                </span>
              ) : null
            ) : (
              <span
                className="pointer-events-none select-none whitespace-pre-wrap break-words text-center text-sm leading-snug"
                style={{ color: textColor }}
              >
                {label || <span className="opacity-40">{def.label}</span>}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
