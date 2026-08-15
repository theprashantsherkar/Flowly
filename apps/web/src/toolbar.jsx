import { SHAPE_DEFINITIONS } from '@flowly/shared';
import { DraggableNode } from './draggableNode';

const flowchart = SHAPE_DEFINITIONS.filter((s) => s.category === 'flowchart');
const annotation = SHAPE_DEFINITIONS.filter((s) => s.category === 'annotation');

function Group({ title, shapes }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {shapes.map((s) => (
          <DraggableNode key={s.key} shapeKey={s.key} label={s.label} color={s.defaultColor} />
        ))}
      </div>
    </div>
  );
}

export const PipelineToolbar = () => {
  return (
    <div className="flex items-start gap-6 border-b border-borderSoft bg-panel px-6 py-3">
      <Group title="Flowchart" shapes={flowchart} />
      <div className="self-stretch border-l border-borderSoft" />
      <Group title="Annotate" shapes={annotation} />
    </div>
  );
};
