import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextField } from './NodeFields';
import { useNodeField } from './useNodeField';

export const DelayNode = ({ id, data }) => {
  const [seconds, setSeconds] = useNodeField(id, 'seconds', data?.seconds || '1');

  return (
    <BaseNode
      title="Delay"
      icon="⏱️"
      accent="bg-orange-600"
      handles={[
        { id: `${id}-input`, type: 'target', position: Position.Left },
        { id: `${id}-output`, type: 'source', position: Position.Right },
      ]}
    >
      <TextField label="Wait (seconds)" value={seconds} onChange={setSeconds} placeholder="1" />
    </BaseNode>
  );
};
