import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useNodeField(
    id,
    'inputName',
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useNodeField(id, 'inputType', data?.inputType || 'Text');

  return (
    <BaseNode
      title="Input"
      icon="⬇️"
      accent="bg-emerald-600"
      handles={[{ id: `${id}-value`, type: 'source', position: Position.Right }]}
    >
      <TextField label="Name" value={name} onChange={setName} />
      <SelectField label="Type" value={inputType} onChange={setInputType} options={['Text', 'File']} />
    </BaseNode>
  );
};
