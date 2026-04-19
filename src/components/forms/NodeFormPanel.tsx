import type { FC } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';
import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
} from '../../types/workflow';
import { NODE_TYPE_COLORS } from '../../utils/nodeDefaults';

const NODE_TYPE_TITLES: Record<string, string> = {
  START_NODE: 'Start Node',
  TASK_NODE: 'Task Node',
  APPROVAL_NODE: 'Approval Node',
  AUTOMATED_STEP_NODE: 'Automated Step Node',
  END_NODE: 'End Node',
};

export const NodeFormPanel: FC = () => {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const { type: nodeType } = selectedNode;
  const color = nodeType ? NODE_TYPE_COLORS[nodeType as keyof typeof NODE_TYPE_COLORS] : '#6366f1';
  const title = nodeType ? NODE_TYPE_TITLES[nodeType] : 'Node';

  const renderForm = (nodeData: WorkflowNodeData) => {
    switch (nodeData.type) {
      case 'START_NODE':
        return <StartNodeForm nodeId={selectedNode.id} data={nodeData as unknown as StartNodeData} />;
      case 'TASK_NODE':
        return <TaskNodeForm nodeId={selectedNode.id} data={nodeData as unknown as TaskNodeData} />;
      case 'APPROVAL_NODE':
        return <ApprovalNodeForm nodeId={selectedNode.id} data={nodeData as unknown as ApprovalNodeData} />;
      case 'AUTOMATED_STEP_NODE':
        return <AutomatedStepNodeForm nodeId={selectedNode.id} data={nodeData as unknown as AutomatedStepNodeData} />;
      case 'END_NODE':
        return <EndNodeForm nodeId={selectedNode.id} data={nodeData as unknown as EndNodeData} />;
    }
  };

  return (
    <aside
      className="animate-slide-in-right flex flex-col h-full bg-bg-surface shadow-[-4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300"
      style={{
        width: 320,
        borderLeft: '1px solid var(--border)',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: `1px solid ${color}30`, background: `${color}05` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
            style={{ background: color }}
          />
          <div>
            <div className="text-[13px] uppercase tracking-wider" style={{ color: color, fontWeight: 700 }}>
              {title}
            </div>
            <div className="text-[11px] font-medium text-text-muted mt-0.5">
              ID: {selectedNode.id.slice(0, 8)}…
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Delete node button */}
          <button
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
            onClick={() => deleteNode(selectedNode.id)}
            title="Delete node"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
          {/* Close panel button */}
          <button
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg rounded-lg transition-colors"
            onClick={() => selectNode(null)}
            title="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form body — scrollable */}
      <div className="flex-1 overflow-y-auto p-5">
        {renderForm(selectedNode.data)}
      </div>
    </aside>
  );
};
