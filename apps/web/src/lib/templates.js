import { nanoid } from 'nanoid';
import { SHAPE_MAP } from '@flowly/shared';

function node(shape, label, x, y, color) {
  const def = SHAPE_MAP[shape];
  return {
    id: `shape-${nanoid(6)}`,
    type: 'shape',
    position: { x, y },
    data: { shape, label, color: color || def.defaultColor },
    style: { width: def.defaultSize.width, height: def.defaultSize.height },
  };
}

function edge(source, target, sourceHandle = 'bottom', targetHandle = 'top') {
  return {
    id: `e-${nanoid(6)}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed', width: 18, height: 18, color: '#94a3b8' },
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  };
}

/** Each template is a factory so ids are fresh every time it's used. */
export const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank canvas',
    description: 'Start from scratch.',
    build: () => ({ nodes: [], edges: [] }),
  },
  {
    id: 'flowchart',
    name: 'Basic flowchart',
    description: 'Start → process → decision → end.',
    build: () => {
      const start = node('terminator', 'Start', 260, 40);
      const step = node('process', 'Do the work', 250, 170);
      const decide = node('decision', 'Looks good?', 265, 300);
      const yes = node('process', 'Ship it', 120, 470);
      const no = node('process', 'Revise', 430, 470);
      const end = node('terminator', 'End', 200, 610);
      return {
        nodes: [start, step, decide, yes, no, end],
        edges: [
          edge(start.id, step.id),
          edge(step.id, decide.id),
          edge(decide.id, yes.id, 'left', 'top'),
          edge(decide.id, no.id, 'right', 'top'),
          edge(yes.id, end.id),
        ],
      };
    },
  },
  {
    id: 'decision-tree',
    name: 'Decision tree',
    description: 'A question that branches three ways.',
    build: () => {
      const q = node('decision', 'Which path?', 300, 60);
      const a = node('process', 'Option A', 80, 260);
      const b = node('process', 'Option B', 320, 260);
      const c = node('process', 'Option C', 560, 260);
      return {
        nodes: [q, a, b, c],
        edges: [
          edge(q.id, a.id, 'left', 'top'),
          edge(q.id, b.id, 'bottom', 'top'),
          edge(q.id, c.id, 'right', 'top'),
        ],
      };
    },
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm board',
    description: 'A grid of sticky notes to riff on.',
    build: () => ({
      nodes: [
        node('note', 'Idea 1', 80, 80),
        node('note', 'Idea 2', 300, 80),
        node('note', 'Idea 3', 520, 80),
        node('note', 'Idea 4', 80, 260),
        node('note', 'Idea 5', 300, 260),
        node('text', 'Brainstorm 💡', 300, 10, '#e2e8f0'),
      ],
      edges: [],
    }),
  },
];
