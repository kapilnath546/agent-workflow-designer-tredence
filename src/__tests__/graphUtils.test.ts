import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData, NodeType } from '../types/workflow';
import {
  detectCycles,
  findOrphanedNodes,
  topologicalSort,
  validateWorkflow,
} from '../utils/graphUtils';

// ── Test helpers ────────────────────────────────────────────────────────────

/**
 * Creates a minimal typed node for testing.
 * Uses type assertion so we don't need to supply all WorkflowNodeData fields in tests.
 */
function makeNode(id: string, nodeType: NodeType): Node<WorkflowNodeData> {
  return {
    id,
    type: nodeType,
    position: { x: 0, y: 0 },
    data: { type: nodeType } as WorkflowNodeData,
  };
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
  };
}

// ── detectCycles ────────────────────────────────────────────────────────────

describe('detectCycles', () => {
  it('returns false for a simple linear graph', () => {
    const nodes = [makeNode('A', 'START_NODE'), makeNode('B', 'TASK_NODE'), makeNode('C', 'END_NODE')];
    const edges = [makeEdge('A', 'B'), makeEdge('B', 'C')];
    expect(detectCycles(nodes, edges)).toBe(false);
  });

  it('returns true for A → B → C → A (cycle)', () => {
    const nodes = [makeNode('A', 'START_NODE'), makeNode('B', 'TASK_NODE'), makeNode('C', 'APPROVAL_NODE')];
    const edges = [makeEdge('A', 'B'), makeEdge('B', 'C'), makeEdge('C', 'A')];
    expect(detectCycles(nodes, edges)).toBe(true);
  });

  it('returns false for a disconnected graph with no cycles', () => {
    const nodes = [makeNode('A', 'START_NODE'), makeNode('B', 'TASK_NODE'), makeNode('C', 'END_NODE')];
    const edges = [makeEdge('A', 'B')]; // C is orphaned but no cycle
    expect(detectCycles(nodes, edges)).toBe(false);
  });

  it('returns true for a self-loop', () => {
    const nodes = [makeNode('A', 'TASK_NODE')];
    const edges = [makeEdge('A', 'A')];
    expect(detectCycles(nodes, edges)).toBe(true);
  });
});

// ── findOrphanedNodes ────────────────────────────────────────────────────────

describe('findOrphanedNodes', () => {
  it('returns empty array when all nodes are reachable from start', () => {
    const nodes = [makeNode('s', 'START_NODE'), makeNode('t', 'TASK_NODE'), makeNode('e', 'END_NODE')];
    const edges = [makeEdge('s', 't'), makeEdge('t', 'e')];
    expect(findOrphanedNodes(nodes, edges)).toEqual([]);
  });

  it('returns the ID of an unreachable node', () => {
    const nodes = [makeNode('s', 'START_NODE'), makeNode('t', 'TASK_NODE'), makeNode('orphan', 'END_NODE')];
    const edges = [makeEdge('s', 't')]; // 'orphan' not reachable
    expect(findOrphanedNodes(nodes, edges)).toContain('orphan');
  });

  it('returns all nodes when there is no start node', () => {
    const nodes = [makeNode('a', 'TASK_NODE'), makeNode('b', 'END_NODE')];
    const edges = [makeEdge('a', 'b')];
    const result = findOrphanedNodes(nodes, edges);
    expect(result).toContain('a');
    expect(result).toContain('b');
  });
});

// ── topologicalSort ──────────────────────────────────────────────────────────

describe('topologicalSort', () => {
  it('returns valid order for a linear graph', () => {
    const nodes = [makeNode('A', 'START_NODE'), makeNode('B', 'TASK_NODE'), makeNode('C', 'END_NODE')];
    const edges = [makeEdge('A', 'B'), makeEdge('B', 'C')];
    const result = topologicalSort(nodes, edges);
    expect(result).not.toBeNull();
    expect(result!.indexOf('A')).toBeLessThan(result!.indexOf('B'));
    expect(result!.indexOf('B')).toBeLessThan(result!.indexOf('C'));
  });

  it('returns null when a cycle exists', () => {
    const nodes = [makeNode('A', 'START_NODE'), makeNode('B', 'TASK_NODE')];
    const edges = [makeEdge('A', 'B'), makeEdge('B', 'A')];
    expect(topologicalSort(nodes, edges)).toBeNull();
  });

  it('handles an empty graph', () => {
    expect(topologicalSort([], [])).toEqual([]);
  });
});

// ── validateWorkflow ─────────────────────────────────────────────────────────

describe('validateWorkflow', () => {
  it('returns no errors for a valid simple workflow', () => {
    const nodes = [makeNode('s', 'START_NODE'), makeNode('e', 'END_NODE')];
    const edges = [makeEdge('s', 'e')];
    expect(validateWorkflow(nodes, edges)).toHaveLength(0);
  });

  it('reports error when no start node is present', () => {
    const nodes = [makeNode('t', 'TASK_NODE'), makeNode('e', 'END_NODE')];
    const edges = [makeEdge('t', 'e')];
    const errors = validateWorkflow(nodes, edges);
    expect(errors.some((e) => e.includes('Start Node'))).toBe(true);
  });

  it('reports error when multiple start nodes are present', () => {
    const nodes = [makeNode('s1', 'START_NODE'), makeNode('s2', 'START_NODE'), makeNode('e', 'END_NODE')];
    const edges = [makeEdge('s1', 'e'), makeEdge('s2', 'e')];
    const errors = validateWorkflow(nodes, edges);
    expect(errors.some((e) => e.includes('one Start Node'))).toBe(true);
  });

  it('reports error when cycle is detected', () => {
    const nodes = [makeNode('s', 'START_NODE'), makeNode('a', 'TASK_NODE'), makeNode('b', 'TASK_NODE')];
    const edges = [makeEdge('s', 'a'), makeEdge('a', 'b'), makeEdge('b', 'a')];
    const errors = validateWorkflow(nodes, edges);
    expect(errors.some((e) => e.toLowerCase().includes('cycle'))).toBe(true);
  });

  it('reports warning when end node is missing', () => {
    const nodes = [makeNode('s', 'START_NODE'), makeNode('t', 'TASK_NODE')];
    const edges = [makeEdge('s', 't')];
    const errors = validateWorkflow(nodes, edges);
    expect(errors.some((e) => e.includes('End Node'))).toBe(true);
  });
});
