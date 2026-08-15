import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ConnectionMode } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { nanoid } from 'nanoid';
import { SHAPE_MAP } from '@flowly/shared';
import { useStore } from './store';
import { ShapeNode } from './nodes/ShapeNode';
import { CursorsLayer } from './components/CursorsLayer';
import { CommentsLayer } from './components/CommentsLayer';

import 'reactflow/dist/style.css';

const gridSize = 16;
const proOptions = { hideAttribution: true };
const nodeTypes = { shape: ShapeNode };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  addComment: state.addComment,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ cursors = [], onCursorMove, commentMode = false, me }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [commentDraft, setCommentDraft] = useState(null);
  const lastCursorAt = useRef(0);
  const { nodes, edges, getNodeID, addNode, addComment, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onPaneClick = useCallback(
    (event) => {
      if (!commentMode || !reactFlowInstance) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const point = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      setCommentDraft(point);
    },
    [commentMode, reactFlowInstance]
  );

  const placeComment = useCallback(
    (text) => {
      if (!commentDraft) return;
      addComment({
        id: `c-${nanoid(6)}`,
        x: commentDraft.x,
        y: commentDraft.y,
        body: text,
        author: me?.name || 'Guest',
        color: me?.color || '#6366f1',
        resolved: false,
        createdAt: Date.now(),
      });
      setCommentDraft(null);
    },
    [commentDraft, addComment, me]
  );

  const onPointerMove = useCallback(
    (event) => {
      if (!onCursorMove || !reactFlowInstance) return;
      const now = performance.now();
      if (now - lastCursorAt.current < 40) return; // throttle ~25fps
      lastCursorAt.current = now;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const point = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      onCursorMove(point);
    },
    [onCursorMove, reactFlowInstance]
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
    <div ref={reactFlowWrapper} className="min-h-0 w-full flex-1 bg-canvas" onPointerMove={onPointerMove}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
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
        <CursorsLayer cursors={cursors} />
        <CommentsLayer
          draft={commentDraft}
          me={me}
          onPlace={placeComment}
          onCancelDraft={() => setCommentDraft(null)}
        />
      </ReactFlow>
    </div>
  );
};
