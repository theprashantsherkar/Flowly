import { DraggableNode } from './draggableNode';

const nodeTypes = [
  { type: 'customInput', label: 'Input', icon: '⬇️' },
  { type: 'llm', label: 'LLM', icon: '🧠' },
  { type: 'customOutput', label: 'Output', icon: '⬆️' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'math', label: 'Math', icon: '➗' },
  { type: 'filter', label: 'Filter', icon: '🔎' },
  { type: 'conditional', label: 'Condition', icon: '🔀' },
  { type: 'delay', label: 'Delay', icon: '⏱️' },
  { type: 'merge', label: 'Merge', icon: '🔗' },
];

export const PipelineToolbar = () => {
  return (
    <div className="border-b border-borderSoft bg-panel px-6 py-4">
      <h1 className="mb-3 text-lg font-semibold text-slate-100">
        VectorShift <span className="text-accent">Pipeline Builder</span>
      </h1>
      <div className="flex flex-wrap gap-2">
        {nodeTypes.map((node) => (
          <DraggableNode key={node.type} {...node} />
        ))}
      </div>
    </div>
  );
};
