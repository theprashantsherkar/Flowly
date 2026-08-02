import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { SelectField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy] = useNodeField(id, 'strategy', data?.strategy || 'concat');

  return (
    <BaseNode
      title="Merge"
      icon="🔗"
      accent="bg-violet-600"
      handles={[
        { id: `${id}-a`, type: 'target', position: Position.Left },
        { id: `${id}-b`, type: 'target', position: Position.Left },
        { id: `${id}-c`, type: 'target', position: Position.Left },
        { id: `${id}-output`, type: 'source', position: Position.Right },
      ]}
    >
      <SelectField
        label="Strategy"
        value={strategy}
        onChange={setStrategy}
        options={[
          { value: 'concat', label: 'Concatenate' },
          { value: 'join', label: 'Join' },
          { value: 'zip', label: 'Zip' },
        ]}
      />
    </BaseNode>
  );
};
