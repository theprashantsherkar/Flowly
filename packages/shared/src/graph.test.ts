import { describe, expect, it } from 'vitest';
import { analyzeGraph, findCycleNodes, isDag, orphanNodes } from './graph';

const n = (...ids: string[]) => ids.map((id) => ({ id }));

describe('isDag', () => {
  it('treats an empty graph as a DAG', () => {
    expect(isDag([], [])).toBe(true);
  });

  it('accepts a simple chain', () => {
    expect(isDag(n('a', 'b', 'c'), [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ])).toBe(true);
  });

  it('rejects a cycle', () => {
    expect(isDag(n('a', 'b', 'c'), [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' },
    ])).toBe(false);
  });

  it('ignores edges referencing missing nodes', () => {
    expect(isDag(n('a', 'b'), [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'ghost' },
    ])).toBe(true);
  });
});

describe('findCycleNodes', () => {
  it('returns the nodes trapped in a cycle', () => {
    const cyclic = findCycleNodes(n('a', 'b', 'c', 'd'), [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'b' },
    ]);
    expect(cyclic.sort()).toEqual(['b', 'c']);
  });
});

describe('orphanNodes', () => {
  it('finds nodes with no edges', () => {
    expect(orphanNodes(n('a', 'b', 'lonely'), [{ source: 'a', target: 'b' }])).toEqual(['lonely']);
  });
});

describe('analyzeGraph', () => {
  it('summarises a graph', () => {
    const result = analyzeGraph(n('a', 'b'), [{ source: 'a', target: 'b' }]);
    expect(result).toMatchObject({ numNodes: 2, numEdges: 1, isDag: true, cycleNodes: [], orphanNodes: [] });
  });
});
