import { NODE_REGISTRY } from '@flowly/shared';
import { DraggableNode } from './draggableNode';

const nodeTypes = NODE_REGISTRY;

export const PipelineToolbar = () => {
  return (
    <div className="border-b border-borderSoft bg-panel px-6 py-4">
      <h1 className="mb-3 text-lg font-semibold text-slate-100">
        Flowly <span className="text-accent">Flow Builder</span>
      </h1>
      <div className="flex flex-wrap gap-2">
        {nodeTypes.map((node) => (
          <DraggableNode key={node.type} {...node} />
        ))}
      </div>
    </div>
  );
};
