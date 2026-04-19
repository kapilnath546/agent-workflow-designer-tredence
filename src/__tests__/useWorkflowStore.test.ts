import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import type { Node } from '@xyflow/react';
import type { WorkflowNodeData } from '../types/workflow';

function makeTaskNode(id: string): Node<WorkflowNodeData> {
  return {
    id,
    type: 'TASK_NODE',
    position: { x: 0, y: 0 },
    data: {
      type: 'TASK_NODE',
      title: `Task ${id}`,
      description: '',
      assignee: '',
      dueDate: '',
      customFields: [],
    },
  };
}

describe('useWorkflowStore', () => {
  beforeEach(() => {
    // Reset store to clean state before each test
    useWorkflowStore.getState().clearWorkflow();
  });

  it('starts with empty nodes and edges', () => {
    const state = useWorkflowStore.getState();
    expect(state.nodes).toHaveLength(0);
    expect(state.edges).toHaveLength(0);
    expect(state.selectedNodeId).toBeNull();
  });

  it('addNode adds a node to the store', () => {
    const node = makeTaskNode('node-1');
    useWorkflowStore.getState().addNode(node);
    expect(useWorkflowStore.getState().nodes).toHaveLength(1);
    expect(useWorkflowStore.getState().nodes[0].id).toBe('node-1');
  });

  it('updateNodeData merges data without changing node type', () => {
    const node = makeTaskNode('node-2');
    useWorkflowStore.getState().addNode(node);
    useWorkflowStore.getState().updateNodeData('node-2', { title: 'Updated Title' } as Partial<WorkflowNodeData>);

    const updated = useWorkflowStore.getState().nodes.find((n) => n.id === 'node-2');
    expect(updated?.data).toMatchObject({ title: 'Updated Title', type: 'TASK_NODE' });
  });

  it('deleteNode removes the node and clears selection', () => {
    const node = makeTaskNode('node-3');
    useWorkflowStore.getState().addNode(node);
    useWorkflowStore.getState().selectNode('node-3');
    useWorkflowStore.getState().deleteNode('node-3');

    expect(useWorkflowStore.getState().nodes).toHaveLength(0);
    expect(useWorkflowStore.getState().selectedNodeId).toBeNull();
  });

  it('clearWorkflow resets all state', () => {
    const node = makeTaskNode('node-4');
    useWorkflowStore.getState().addNode(node);
    useWorkflowStore.getState().selectNode('node-4');
    useWorkflowStore.getState().clearWorkflow();

    const state = useWorkflowStore.getState();
    expect(state.nodes).toHaveLength(0);
    expect(state.edges).toHaveLength(0);
    expect(state.selectedNodeId).toBeNull();
    expect(state.simulationResult).toBeNull();
  });

  it('exportWorkflow returns valid JSON', () => {
    const node = makeTaskNode('node-5');
    useWorkflowStore.getState().addNode(node);

    const json = useWorkflowStore.getState().exportWorkflow();
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty('nodes');
    expect(parsed).toHaveProperty('edges');
    expect(Array.isArray(parsed.nodes)).toBe(true);
  });
});
