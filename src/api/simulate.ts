import type {
  SimulateRequest,
  SimulateResponse,
  ExecutionStep,
  NodeType,
  WorkflowNodeData,
} from '../types/workflow';

/**
 * Core simulation logic executed inside the MSW POST /simulate handler.
 *
 * This function is kept as a pure function (no MSW dependencies) so it can
 * theoretically be reused server-side or in tests.
 */
export function runSimulation(request: SimulateRequest): SimulateResponse {
  const { nodes, edges } = request;
  const errors: string[] = [];
  const warnings: string[] = [];
  const executionSteps: ExecutionStep[] = [];

  // ── 1. Structural validation ──────────────────────────────────────────────
  const startNodes = nodes.filter((n) => n.type === 'START_NODE');
  const endNodes = nodes.filter((n) => n.type === 'END_NODE');

  if (startNodes.length === 0) {
    errors.push('No START_NODE found. Workflow must have exactly one start node.');
  } else if (startNodes.length > 1) {
    errors.push('Multiple START_NODEs found. Only one start node is allowed.');
  }

  if (endNodes.length === 0) {
    warnings.push('No END_NODE found. It is recommended to terminate workflows with an End Node.');
  }

  // ── 2. Cycle detection ────────────────────────────────────────────────────
  if (hasCycle(nodes, edges)) {
    errors.push(
      'Cycle detected in workflow graph. Circular dependencies prevent linear execution.',
    );
  }

  // If there are hard errors, skip execution trace (graph is invalid)
  if (errors.length > 0) {
    return {
      success: false,
      totalSteps: 0,
      executionSteps: [],
      errors,
      warnings,
    };
  }

  // ── 3. BFS traversal from START_NODE ─────────────────────────────────────
  const adjList = buildAdj(nodes, edges);
  const startNode = startNodes[0];
  const visited = new Set<string>();
  const queue: string[] = [startNode.id];
  visited.add(startNode.id);
  const traversalOrder: string[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    traversalOrder.push(currentId);

    for (const neighbor of adjList.get(currentId) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // ── 4. Orphan detection ───────────────────────────────────────────────────
  const unreachable = nodes.filter((n) => !visited.has(n.id));
  if (unreachable.length > 0) {
    warnings.push(
      `${unreachable.length} node(s) are not reachable from the Start Node: ${unreachable.map((n) => getTitle(n.data)).join(', ')}`,
    );
  }

  // ── 5. Build execution steps ──────────────────────────────────────────────
  const baseTime = new Date();

  for (let i = 0; i < traversalOrder.length; i++) {
    const nodeId = traversalOrder[i];
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    const title = getTitle(node.data);
    const timestamp = new Date(baseTime.getTime() + i * 1200).toISOString();
    const step = buildExecutionStep(node.id, node.type, node.data, title, timestamp);
    executionSteps.push(step);
  }

  return {
    success: true,
    totalSteps: executionSteps.length,
    executionSteps,
    errors,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildExecutionStep(
  nodeId: string,
  nodeType: NodeType,
  data: WorkflowNodeData,
  title: string,
  timestamp: string,
): ExecutionStep {
  // Missing required title → error
  if (!title || title.trim() === '') {
    return {
      nodeId,
      nodeType,
      title: '(Untitled)',
      status: 'error',
      message: 'Node is missing a required title field.',
      timestamp,
    };
  }

  // Approval with high auto-approve threshold → warning
  if (
    nodeType === 'APPROVAL_NODE' &&
    data.type === 'APPROVAL_NODE' &&
    data.autoApproveThreshold > 80
  ) {
    return {
      nodeId,
      nodeType,
      title,
      status: 'warning',
      message: `Auto-approve threshold is set to ${data.autoApproveThreshold}% — requests may bypass human review.`,
      timestamp,
    };
  }

  // Automated step with no action configured → warning
  if (
    nodeType === 'AUTOMATED_STEP_NODE' &&
    data.type === 'AUTOMATED_STEP_NODE' &&
    !data.actionId
  ) {
    return {
      nodeId,
      nodeType,
      title,
      status: 'warning',
      message: 'No automation action selected for this step.',
      timestamp,
    };
  }

  return {
    nodeId,
    nodeType,
    title,
    status: 'success',
    message: getSuccessMessage(nodeType),
    timestamp,
  };
}

function getSuccessMessage(nodeType: NodeType): string {
  switch (nodeType) {
    case 'START_NODE':
      return 'Workflow initiated successfully.';
    case 'TASK_NODE':
      return 'Task created and assigned.';
    case 'APPROVAL_NODE':
      return 'Approval request dispatched to approver.';
    case 'AUTOMATED_STEP_NODE':
      return 'Automation action triggered.';
    case 'END_NODE':
      return 'Workflow completed.';
  }
}

function getTitle(data: WorkflowNodeData): string {
  switch (data.type) {
    case 'START_NODE':
      return data.startTitle;
    case 'TASK_NODE':
    case 'APPROVAL_NODE':
    case 'AUTOMATED_STEP_NODE':
      return data.title;
    case 'END_NODE':
      return data.endMessage || 'End';
  }
}

function buildAdj(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges'],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const n of nodes) map.set(n.id, []);
  for (const e of edges) {
    const list = map.get(e.source) ?? [];
    list.push(e.target);
    map.set(e.source, list);
  }
  return map;
}

function hasCycle(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges'],
): boolean {
  const adj = buildAdj(nodes, edges);
  const visited = new Set<string>();
  const onStack = new Set<string>();

  function dfs(id: string): boolean {
    visited.add(id);
    onStack.add(id);
    for (const neighbor of adj.get(id) ?? []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (onStack.has(neighbor)) return true;
    }
    onStack.delete(id);
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id) && dfs(n.id)) return true;
  }
  return false;
}
