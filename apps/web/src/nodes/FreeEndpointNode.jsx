import { Handle, Position } from 'reactflow';

/**
 * Invisible anchor used for dangling connectors. The node itself is hidden from
 * the UI, but it still exposes a handle so React Flow can terminate the edge.
 */
export function FreeEndpointNode() {
  return (
    <div className="relative h-4 w-4 opacity-0 pointer-events-none">
      <Handle
        id="free"
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-0 !bg-transparent"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
