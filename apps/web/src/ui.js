import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ConnectionMode } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { SHAPE_MAP } from '@flowly/shared';
import { useStore } from './store';
import { ShapeNode } from './nodes/ShapeNode';

import 'reactflow/dist/style.css';

const gridSize = 16;
const proOptions = { hideAttribution: true };
const nodeTypes = { shape: ShapeNode };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const shape = JSON.parse(raw)?.shape;
      const def = SHAPE_MAP[shape];
      if (!def) return;

      const dropped = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      // Center the shape on the cursor.
      const position = {
        x: dropped.x - def.defaultSize.width / 2,
        y: dropped.y - def.defaultSize.height / 2,
      };

      addNode({
        id: getNodeID('shape'),
        type: 'shape',
        position,
        data: { shape, label: '', color: def.defaultColor },
        style: { width: def.defaultSize.width, height: def.defaultSize.height },
      });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="min-h-0 w-full flex-1 bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        connectionMode={ConnectionMode.Loose}
        connectionLineType="smoothstep"
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        minZoom={0.2}
      >
        <Background color="#233047" gap={gridSize} />
        <Controls className="!border-borderSoft !bg-panel" />
        <MiniMap
          nodeColor={(n) => n.data?.color || '#6366f1'}
          maskColor="rgba(15, 20, 32, 0.6)"
          className="!bg-panel"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
