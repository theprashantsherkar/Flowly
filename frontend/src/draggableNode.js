export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={
        `${type} flex min-w-[92px] cursor-grab select-none flex-col items-center ` +
        'justify-center gap-1 rounded-lg border border-borderSoft bg-panelLight ' +
        'px-3 py-2 text-slate-100 transition hover:border-accent hover:bg-panel active:cursor-grabbing'
      }
      onDragStart={onDragStart}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {icon && <span className="text-lg leading-none">{icon}</span>}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};
