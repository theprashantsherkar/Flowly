import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useNodeField(
    id,
    'outputName',
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useNodeField(id, 'outputType', data?.outputType || 'Text');

  return (
    <BaseNode
      title="Output"
      icon="⬆️"
      accent="bg-rose-600"
      handles={[{ id: `${id}-value`, type: 'target', position: Position.Left }]}
    >
      <TextField label="Name" value={name} onChange={setName} />
      <SelectField label="Type" value={outputType} onChange={setOutputType} options={['Text', 'Image']} />
    </BaseNode>
  );
};
