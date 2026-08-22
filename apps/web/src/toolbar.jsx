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
    <div data-tour="build" className="flex items-start justify-between gap-6 border-b border-borderSoft bg-panel px-6 py-3">
      <div className="flex items-start gap-6">
        <Group title="Flowchart" shapes={flowchart} />
        <div className="self-stretch border-l border-borderSoft" />
        <Group title="Annotate" shapes={annotation} />
      </div>
      <div className="hidden max-w-[240px] rounded-lg border border-borderSoft bg-panelLight px-3 py-2 text-[11px] leading-relaxed text-slate-400 lg:block">
        Drag <span className="font-semibold text-slate-200">Arrow</span> for free-ended lines, or start from a
        shape and drop onto empty space to leave a dangling connector.
      </div>
    </div>
  );
};
