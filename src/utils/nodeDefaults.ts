import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  NodeType,
} from '../types/workflow';

/**
 * Returns default data for a newly-created node of the given type.
 * Each factory ensures the shape matches the strict TypeScript interface.
 */
export function getDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'START_NODE':
      return defaultStartNode();
    case 'TASK_NODE':
      return defaultTaskNode();
    case 'APPROVAL_NODE':
      return defaultApprovalNode();
    case 'AUTOMATED_STEP_NODE':
      return defaultAutomatedStepNode();
    case 'END_NODE':
      return defaultEndNode();
  }
}

function defaultStartNode(): StartNodeData {
  return {
    type: 'START_NODE',
    startTitle: 'Start',
    metadata: [],
  };
}

function defaultTaskNode(): TaskNodeData {
  return {
    type: 'TASK_NODE',
    title: 'New Task',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: [],
  };
}

function defaultApprovalNode(): ApprovalNodeData {
  return {
    type: 'APPROVAL_NODE',
    title: 'Approval Required',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  };
}

function defaultAutomatedStepNode(): AutomatedStepNodeData {
  return {
    type: 'AUTOMATED_STEP_NODE',
    title: 'Automated Step',
    actionId: '',
    actionParams: {},
  };
}

function defaultEndNode(): EndNodeData {
  return {
    type: 'END_NODE',
    endMessage: 'Workflow completed.',
    summaryFlag: false,
  };
}

/** Human-readable display labels for node types. */
export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  START_NODE: 'Start',
  TASK_NODE: 'Task',
  APPROVAL_NODE: 'Approval',
  AUTOMATED_STEP_NODE: 'Automated Step',
  END_NODE: 'End',
};

/** Tailwind color classes per node type for consistent theming. */
export const NODE_TYPE_COLORS: Record<NodeType, string> = {
  START_NODE: '#22c55e',
  TASK_NODE: '#3b82f6',
  APPROVAL_NODE: '#f59e0b',
  AUTOMATED_STEP_NODE: '#a855f7',
  END_NODE: '#ef4444',
};
