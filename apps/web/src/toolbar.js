import { NODE_REGISTRY } from '@flowly/shared';
import { DraggableNode } from './draggableNode';

const nodeTypes = NODE_REGISTRY;

export const PipelineToolbar = () => {
  return (
    <div className="border-b border-borderSoft bg-panel px-6 py-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        Drag a node onto the canvas
      </p>
      <div className="flex flex-wrap gap-2">
        {nodeTypes.map((node) => (
          <DraggableNode key={node.type} {...node} />
        ))}
      </div>
    </div>
  );
};
