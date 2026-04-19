import type { Node, Edge } from '@xyflow/react';
import type { SimulateRequest, WorkflowNodeData } from '../types/workflow';

// Type alias for our typed nodes — used throughout the app
type WFNode = Node<WorkflowNodeData>;

// ---------------------------------------------------------------------------
// Cycle Detection (DFS-based)
// ---------------------------------------------------------------------------

/**
 * Returns true if the directed graph contains at least one cycle.
 * Uses recursive DFS with a "currently-on-stack" set to detect back edges.
 */
export function detectCycles(nodes: WFNode[], edges: Edge[]): boolean {
  const adjList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const onStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    onStack.add(nodeId);

    for (const neighbor of adjList.get(nodeId) ?? []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (onStack.has(neighbor)) {
        // Back edge found — cycle exists
        return true;
      }
    }

    onStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Orphaned Node Detection
// ---------------------------------------------------------------------------

/**
 * Returns IDs of nodes that are not reachable from the START_NODE via BFS.
 * If there is no start node, all nodes are considered orphaned.
 */
export function findOrphanedNodes(nodes: WFNode[], edges: Edge[]): string[] {
  const startNode = nodes.find((n) => n.type === 'START_NODE');
  if (!startNode) return nodes.map((n) => n.id);

  const adjList = buildAdjacencyList(nodes, edges);
  const reachable = new Set<string>();
  const queue: string[] = [startNode.id];
  reachable.add(startNode.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of adjList.get(current) ?? []) {
      if (!reachable.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return nodes.filter((n) => !reachable.has(n.id)).map((n) => n.id);
}

// ---------------------------------------------------------------------------
// Topological Sort (Kahn's Algorithm — BFS-based)
// ---------------------------------------------------------------------------

/**
 * Returns a topologically-sorted list of node IDs, or null if a cycle exists.
 * Uses Kahn's algorithm (in-degree / BFS approach).
 */
export function topologicalSort(nodes: WFNode[], edges: Edge[]): string[] | null {
  const adjList = buildAdjacencyList(nodes, edges);
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbor of adjList.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  // If not all nodes were processed, a cycle exists
  return sorted.length === nodes.length ? sorted : null;
}

// ---------------------------------------------------------------------------
// Workflow Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes the current nodes and edges into the SimulateRequest format.
 * Filters out nodes with missing type data gracefully.
 */
export function serializeWorkflow(nodes: WFNode[], edges: Edge[]): SimulateRequest {
  return {
    nodes: nodes
      .filter((n) => n.type && n.data)
      .map((n) => ({
        id: n.id,
        type: n.data.type,
        data: n.data,
      })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };
}

// ---------------------------------------------------------------------------
// Workflow Validation
// ---------------------------------------------------------------------------

/**
 * Validates the graph and returns human-readable error strings.
 * These are shown in the CanvasToolbar banner and SandboxPanel.
 */
export function validateWorkflow(nodes: WFNode[], edges: Edge[]): string[] {
  const errors: string[] = [];

  const startNodes = nodes.filter((n) => n.type === 'START_NODE');
  const endNodes = nodes.filter((n) => n.type === 'END_NODE');

  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start Node.');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start Node.');
  }

  if (endNodes.length === 0) {
    errors.push('Workflow should have at least one End Node.');
  }

  if (detectCycles(nodes, edges)) {
    errors.push('Workflow contains a cycle (circular dependency). Remove the back edge.');
  }

  const orphans = findOrphanedNodes(nodes, edges);
  // Start node with no edges isn't "orphaned" in the problematic sense
  const nonStartOrphans = orphans.filter((id) => {
    const node = nodes.find((n) => n.id === id);
    return node?.type !== 'START_NODE';
  });

  if (nonStartOrphans.length > 0) {
    errors.push(
      `${nonStartOrphans.length} node(s) are not reachable from the Start Node (orphaned).`,
    );
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildAdjacencyList(nodes: WFNode[], edges: Edge[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const node of nodes) {
    map.set(node.id, []);
  }
  for (const edge of edges) {
    const neighbors = map.get(edge.source) ?? [];
    neighbors.push(edge.target);
    map.set(edge.source, neighbors);
  }
  return map;
}
