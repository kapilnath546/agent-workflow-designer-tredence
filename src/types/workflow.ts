/**
 * All TypeScript interfaces and types for the HR Workflow Designer.
 *
 * Note: All node data interfaces include `[key: string]: unknown` index signatures
 * to satisfy @xyflow/react v12's constraint that node data extends Record<string, unknown>.
 */

export type NodeType =
  | 'START_NODE'
  | 'TASK_NODE'
  | 'APPROVAL_NODE'
  | 'AUTOMATED_STEP_NODE'
  | 'END_NODE';

/** A single key-value metadata pair used in Start and Task nodes. */
export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData extends Record<string, unknown> {
  type: 'START_NODE';
  startTitle: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData extends Record<string, unknown> {
  type: 'TASK_NODE';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData extends Record<string, unknown> {
  type: 'APPROVAL_NODE';
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'VP' | 'C-Suite';
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends Record<string, unknown> {
  type: 'AUTOMATED_STEP_NODE';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends Record<string, unknown> {
  type: 'END_NODE';
  endMessage: string;
  summaryFlag: boolean;
}

/** Discriminated union of all possible node data shapes. */
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

/** An automation action returned from GET /automations. */
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

/** Request payload sent to POST /simulate. */
export interface SimulateRequest {
  nodes: Array<{ id: string; type: NodeType; data: WorkflowNodeData }>;
  edges: Array<{ id: string; source: string; target: string }>;
}

/** A single step in the simulated execution trace. */
export interface ExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  title: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

/** Full simulation response from POST /simulate. */
export interface SimulateResponse {
  success: boolean;
  totalSteps: number;
  executionSteps: ExecutionStep[];
  errors: string[];
  warnings: string[];
}
