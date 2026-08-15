import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      title="LLM"
      icon="🧠"
      accent="bg-indigo-600"
      handles={[
        { id: `${id}-system`, type: 'target', position: Position.Left },
        { id: `${id}-prompt`, type: 'target', position: Position.Left },
        { id: `${id}-response`, type: 'source', position: Position.Right },
      ]}
    >
      <p className="text-sm text-slate-300">This is a LLM.</p>
    </BaseNode>
  );
};
