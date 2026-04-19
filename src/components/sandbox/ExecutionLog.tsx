import type { FC } from 'react';
import type { ExecutionStep } from '../../types/workflow';

const STATUS_COLORS = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

const STATUS_LABELS = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

const NODE_ICONS: Record<string, React.ReactNode> = {
  START_NODE: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e"><path d="M8 5v14l11-7z" /></svg>
  ),
  TASK_NODE: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  APPROVAL_NODE: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  AUTOMATED_STEP_NODE: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#a855f7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
  ),
  END_NODE: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
};

interface Props {
  steps: ExecutionStep[];
}

export const ExecutionLog: FC<Props> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <div className="text-text-muted" style={{ fontSize: 32 }}>◎</div>
        <p className="text-sm text-text-muted">
          No execution steps yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-5 bottom-5"
        style={{ width: 1, background: 'var(--border)', zIndex: 0 }}
      />

      {steps.map((step, i) => {
        const color = STATUS_COLORS[step.status];
        const delay = i * 0.08;

        return (
          <div
            key={step.nodeId}
            className="flex gap-3 py-3 animate-fade-in"
            style={{ animationDelay: `${delay}s`, position: 'relative', zIndex: 1 }}
          >
            {/* Status dot */}
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-bg-surface"
              style={{
                border: `2px solid ${color}`,
                boxShadow: `0 0 12px ${color}30`,
              }}
            >
              {NODE_ICONS[step.nodeType]}
            </div>

            {/* Step details */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-text-primary">
                  {step.title}
                </span>
                {/* Status badge */}
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  style={{ background: `${color}15`, color }}
                >
                  {STATUS_LABELS[step.status]}
                </span>
              </div>

              <p className="text-[13px] mt-1 text-text-secondary font-medium leading-relaxed">
                {step.message}
              </p>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] font-mono text-text-muted font-medium">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-[11px] text-text-muted font-medium capitalize">
                  · {step.nodeType.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
