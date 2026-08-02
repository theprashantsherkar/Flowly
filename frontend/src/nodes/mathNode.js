import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { SelectField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useNodeField(id, 'operation', data?.operation || 'add');

  return (
    <BaseNode
      title="Math"
      icon="➗"
      accent="bg-amber-600"
      handles={[
        { id: `${id}-a`, type: 'target', position: Position.Left },
        { id: `${id}-b`, type: 'target', position: Position.Left },
        { id: `${id}-result`, type: 'source', position: Position.Right },
      ]}
    >
      <SelectField
        label="Operation"
        value={operation}
        onChange={setOperation}
        options={[
          { value: 'add', label: 'Add (+)' },
          { value: 'subtract', label: 'Subtract (−)' },
          { value: 'multiply', label: 'Multiply (×)' },
          { value: 'divide', label: 'Divide (÷)' },
        ]}
      />
    </BaseNode>
  );
};
