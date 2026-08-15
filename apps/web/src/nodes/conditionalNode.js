import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const ConditionalNode = ({ id, data }) => {
  const [expression, setExpression] = useNodeField(id, 'expression', data?.expression || 'value === true');

  return (
    <BaseNode
      title="Condition"
      icon="🔀"
      accent="bg-fuchsia-700"
      handles={[
        { id: `${id}-input`, type: 'target', position: Position.Left },
        { id: `${id}-true`, type: 'source', position: Position.Right },
        { id: `${id}-false`, type: 'source', position: Position.Right },
      ]}
    >
      <TextField label="If" value={expression} onChange={setExpression} placeholder="value === true" />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>▸ true</span>
        <span>false ▸</span>
      </div>
    </BaseNode>
  );
};
