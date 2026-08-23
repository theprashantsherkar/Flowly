import { ShapeSvg } from './nodes/ShapeSvg';

export const DraggableNode = ({ shapeKey, label, color }) => {
  const isLineLike = shapeKey === 'arrow' || shapeKey === 'line';

  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ shape: shapeKey }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      title={label}
      onDragStart={onDragStart}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      data-tour={shapeKey === 'arrow' ? 'arrow-tool' : undefined}
      className={`flex ${isLineLike ? 'w-[104px]' : 'w-[76px]'} cursor-grab select-none flex-col items-center gap-1.5 rounded-lg border border-borderSoft bg-panelLight px-2 py-2 text-slate-200 transition hover:border-accent hover:bg-panel active:cursor-grabbing`}
    >
      <div className={`relative ${isLineLike ? 'h-6 w-16' : 'h-7 w-11'}`}>
        {shapeKey === 'text' ? (
          <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-200">
            T
          </span>
        ) : (
          <ShapeSvg shape={shapeKey} stroke={color} fill={isLineLike ? 'transparent' : `${color}22`} />
        )}
      </div>
      <span className="text-[11px] font-medium leading-none">{label}</span>
    </div>
  );
};
