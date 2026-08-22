/**
 * The catalogue of canvas shapes. Flowly's canvas is a flowchart/whiteboard
 * builder, so instead of typed pipeline nodes we offer the standard flowchart
 * shapes plus annotation shapes (sticky note, text).
 *
 * All shapes share a single ReactFlow node type ('shape'); the specific shape is
 * stored in node.data.shape. This file is the single source of truth for the
 * palette, default sizes, and default colors.
 */

export type ShapeKey =
  | 'process'
  | 'decision'
  | 'terminator'
  | 'data'
  | 'database'
  | 'document'
  | 'connector'
  | 'preparation'
  | 'arrow'
  | 'note'
  | 'text';

export type ShapeCategory = 'flowchart' | 'annotation';

export interface ShapeDefinition {
  key: ShapeKey;
  label: string;
  description: string;
  category: ShapeCategory;
  defaultSize: { width: number; height: number };
  defaultColor: string; // hex, used for stroke; fill is a translucent tint
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    key: 'process',
    label: 'Process',
    description: 'A step or action (rectangle).',
    category: 'flowchart',
    defaultSize: { width: 168, height: 68 },
    defaultColor: '#2563eb',
  },
  {
    key: 'decision',
    label: 'Decision',
    description: 'A branch / yes-no question (diamond).',
    category: 'flowchart',
    defaultSize: { width: 150, height: 104 },
    defaultColor: '#d97706',
  },
  {
    key: 'terminator',
    label: 'Start / End',
    description: 'Start or end of a flow (rounded).',
    category: 'flowchart',
    defaultSize: { width: 150, height: 60 },
    defaultColor: '#10b981',
  },
  {
    key: 'data',
    label: 'Input / Output',
    description: 'Data in or out (parallelogram).',
    category: 'flowchart',
    defaultSize: { width: 168, height: 68 },
    defaultColor: '#0ea5e9',
  },
  {
    key: 'database',
    label: 'Database',
    description: 'Stored data (cylinder).',
    category: 'flowchart',
    defaultSize: { width: 120, height: 108 },
    defaultColor: '#f59e0b',
  },
  {
    key: 'document',
    label: 'Document',
    description: 'A document or report.',
    category: 'flowchart',
    defaultSize: { width: 150, height: 96 },
    defaultColor: '#14b8a6',
  },
  {
    key: 'preparation',
    label: 'Preparation',
    description: 'Setup step (hexagon).',
    category: 'flowchart',
    defaultSize: { width: 156, height: 84 },
    defaultColor: '#0891b2',
  },
  {
    key: 'connector',
    label: 'Connector',
    description: 'On-page connector (circle).',
    category: 'flowchart',
    defaultSize: { width: 68, height: 68 },
    defaultColor: '#f43f5e',
  },
  {
    key: 'arrow',
    label: 'Arrow',
    description: 'A standalone arrow or line.',
    category: 'annotation',
    defaultSize: { width: 180, height: 24 },
    defaultColor: '#94a3b8',
  },
  {
    key: 'note',
    label: 'Sticky note',
    description: 'A sticky note.',
    category: 'annotation',
    defaultSize: { width: 168, height: 128 },
    defaultColor: '#eab308',
  },
  {
    key: 'text',
    label: 'Text',
    description: 'Plain text label.',
    category: 'annotation',
    defaultSize: { width: 150, height: 44 },
    defaultColor: '#e2e8f0',
  },
];

export const SHAPE_MAP: Record<ShapeKey, ShapeDefinition> = SHAPE_DEFINITIONS.reduce(
  (acc, def) => {
    acc[def.key] = def;
    return acc;
  },
  {} as Record<ShapeKey, ShapeDefinition>,
);

export function isKnownShape(key: string): key is ShapeKey {
  return key in SHAPE_MAP;
}

/** Edge line styles and their SVG dash patterns. */
export const EDGE_STYLES = ['solid', 'dashed', 'dotted'] as const;
export type EdgeStyle = (typeof EDGE_STYLES)[number];

export const EDGE_DASH_ARRAY: Record<EdgeStyle, string | undefined> = {
  solid: undefined,
  dashed: '8 5',
  dotted: '1 6',
};
