import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { EndNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { findOrphanedNodes } from '../../utils/graphUtils';

const COLOR = '#ef4444';

function EndNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as EndNodeData;
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const orphans = findOrphanedNodes(nodes, edges);
  const isOrphaned = orphans.includes(id);

  return (
    <div
      className={`workflow-node ${selected ? 'selected' : ''} ${isOrphaned ? 'orphaned' : ''}`}
      style={{ borderTop: `4px solid ${COLOR}` }}
    >
      {/* END_NODE: no source handle (exit point), only target */}
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: COLOR }}>End</div>
          <div className="text-sm font-bold text-text-primary truncate" style={{ maxWidth: 148 }}>
            {nodeData.endMessage || 'Workflow End'}
          </div>
        </div>
      </div>

      {nodeData.summaryFlag && (
        <div className="px-3 pb-3">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${COLOR}10`, color: COLOR }}>
            Summary report
          </span>
        </div>
      )}
    </div>
  );
}

export const EndNode = memo(EndNodeComponent);
