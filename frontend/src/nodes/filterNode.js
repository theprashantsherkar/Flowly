import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useNodeField(id, 'condition', data?.condition || 'item > 0');

  return (
    <BaseNode
      title="Filter"
      icon="🔎"
      accent="bg-teal-600"
      handles={[
        { id: `${id}-input`, type: 'target', position: Position.Left },
        { id: `${id}-output`, type: 'source', position: Position.Right },
      ]}
    >
      <TextField label="Keep where" value={condition} onChange={setCondition} placeholder="item > 0" />
    </BaseNode>
  );
};
