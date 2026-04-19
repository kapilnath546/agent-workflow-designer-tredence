import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { AutomatedStepNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { findOrphanedNodes } from '../../utils/graphUtils';

const COLOR = '#a855f7';

function AutomatedStepNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AutomatedStepNodeData;
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const orphans = findOrphanedNodes(nodes, edges);
  const isOrphaned = orphans.includes(id);
  const isMissingTitle = !nodeData.title?.trim();

  return (
    <div
      className={`workflow-node ${selected ? 'selected' : ''} ${isOrphaned ? 'orphaned' : ''}`}
      style={{ borderTop: `4px solid ${COLOR}` }}
    >
      {isMissingTitle && (
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white text-[11px] font-bold z-10 shadow-sm"
          title="Missing required title"
        >
          !
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'var(--bg-surface)', border: `2px solid ${COLOR}`, width: 10, height: 10 }}
      />

      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${COLOR}15` }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={COLOR}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: COLOR }}>Automated Step</div>
          <div className="text-sm font-bold text-text-primary truncate" style={{ maxWidth: 148 }}>
            {nodeData.title || 'Untitled'}
          </div>
        </div>
      </div>

      {nodeData.actionId && (
        <div className="px-3 pb-3">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${COLOR}10`, color: COLOR }}>
            {nodeData.actionId.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'var(--bg-surface)', border: `2px solid ${COLOR}`, width: 10, height: 10 }}
      />
    </div>
  );
}

export const AutomatedStepNode = memo(AutomatedStepNodeComponent);
