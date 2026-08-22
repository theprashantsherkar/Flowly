/**
 * Graph analysis utilities.
 *
 * `isDag` is a faithful TypeScript port of the original Python `is_dag`
 * (backend/main.py) — a Kahn's-algorithm topological sort. The extra helpers
 * (`findCycleNodes`, `orphanNodes`, `analyzeGraph`) power Flowly's live
 * validation overlay.
 */

export interface GraphNode {
  id: string;
  type?: string;
  data?: { kind?: string };
}

export interface GraphEdge {
  source: string;
  target: string;
}

/** Edges that reference a node id not present in `nodes` are ignored, matching the original behaviour. */
function buildAdjacency(nodes: GraphNode[], edges: GraphEdge[]) {
  const activeNodes = nodes.filter((n) => n.type !== 'free-endpoint' && n.data?.kind !== 'free-endpoint');
  const nodeIds = new Set(activeNodes.map((n) => n.id));
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const id of nodeIds) {
    adjacency.set(id, []);
    inDegree.set(id, 0);
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    adjacency.get(edge.source)!.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  return { nodeIds, adjacency, inDegree };
}

/** Returns true when the graph is a valid Directed Acyclic Graph. */
export function isDag(nodes: GraphNode[], edges: GraphEdge[]): boolean {
  const { nodeIds, adjacency, inDegree } = buildAdjacency(nodes, edges);

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  let visited = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    visited += 1;
    for (const neighbor of adjacency.get(current) ?? []) {
      const next = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, next);
      if (next === 0) queue.push(neighbor);
    }
  }

  return visited === nodeIds.size;
}

/** The node ids that remain part of a cycle (i.e. never reach in-degree 0). */
export function findCycleNodes(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const { adjacency, inDegree } = buildAdjacency(nodes, edges);
  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of adjacency.get(current) ?? []) {
      const next = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, next);
      if (next === 0) queue.push(neighbor);
    }
  }
  const cyclic: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree > 0) cyclic.push(id);
  }
  return cyclic;
}

/** Node ids that have no connected edges at all. */
export function orphanNodes(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const activeNodes = nodes.filter((n) => n.type !== 'free-endpoint' && n.data?.kind !== 'free-endpoint');
  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }
  return activeNodes.filter((n) => !connected.has(n.id)).map((n) => n.id);
}

export interface GraphAnalysis {
  numNodes: number;
  numEdges: number;
  isDag: boolean;
  cycleNodes: string[];
  orphanNodes: string[];
}

export function analyzeGraph(nodes: GraphNode[], edges: GraphEdge[]): GraphAnalysis {
  return {
    numNodes: nodes.length,
    numEdges: edges.length,
    isDag: isDag(nodes, edges),
    cycleNodes: findCycleNodes(nodes, edges),
    orphanNodes: orphanNodes(nodes, edges),
  };
}
