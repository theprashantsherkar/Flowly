/**
 * Single source of truth for the typed flow-node catalogue.
 *
 * The web toolbar, the (future) text-to-diagram AI feature, and server-side
 * validation all read from this list so the set of node types can never drift
 * between client and server.
 */

export type FlowNodeType =
  | 'customInput'
  | 'llm'
  | 'customOutput'
  | 'text'
  | 'math'
  | 'filter'
  | 'conditional'
  | 'delay'
  | 'merge';

export interface NodeDefinition {
  type: FlowNodeType;
  label: string;
  icon: string;
  /** Short description used by tooltips and the AI text-to-diagram prompt. */
  description: string;
}

export const NODE_REGISTRY: NodeDefinition[] = [
  { type: 'customInput', label: 'Input', icon: '⬇️', description: 'A pipeline input (text or file).' },
  { type: 'llm', label: 'LLM', icon: '🧠', description: 'A large language model call.' },
  { type: 'customOutput', label: 'Output', icon: '⬆️', description: 'A pipeline output (text or image).' },
  { type: 'text', label: 'Text', icon: '📝', description: 'Text with {{ variable }} inputs.' },
  { type: 'math', label: 'Math', icon: '➗', description: 'An arithmetic operation on two inputs.' },
  { type: 'filter', label: 'Filter', icon: '🔎', description: 'Keeps items matching a condition.' },
  { type: 'conditional', label: 'Condition', icon: '🔀', description: 'Branches on a boolean expression.' },
  { type: 'delay', label: 'Delay', icon: '⏱️', description: 'Waits for a number of seconds.' },
  { type: 'merge', label: 'Merge', icon: '🔗', description: 'Combines multiple inputs into one.' },
];

export const NODE_TYPES: FlowNodeType[] = NODE_REGISTRY.map((n) => n.type);

export function isKnownNodeType(type: string): type is FlowNodeType {
  return NODE_TYPES.includes(type as FlowNodeType);
}
