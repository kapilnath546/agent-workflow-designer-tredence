import type { FC } from 'react';
import type { NodeType } from '../../types/workflow';

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const NODE_TYPES: NodeTypeItem[] = [
  {
    type: 'START_NODE',
    label: 'Start',
    description: 'Workflow entry point',
    color: '#22c55e',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  {
    type: 'TASK_NODE',
    label: 'Task',
    description: 'Assign work to a person',
    color: '#3b82f6',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    ),
  },
  {
    type: 'APPROVAL_NODE',
    label: 'Approval',
    description: 'Human approval gate',
    color: '#f59e0b',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    type: 'AUTOMATED_STEP_NODE',
    label: 'Automated Step',
    description: 'Trigger an automation',
    color: '#a855f7',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#a855f7">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    type: 'END_NODE',
    label: 'End',
    description: 'Workflow exit point',
    color: '#ef4444',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
];

export const NodeSidebar: FC = () => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow-nodetype', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
      <aside
        className="flex flex-col h-full bg-bg-surface animate-slide-in-left shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        style={{
          width: 260,
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Sidebar header */}
        <div
          className="px-5 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--primary)', opacity: 0.15 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-text-primary tracking-tight uppercase">
                Nodes
              </div>
            </div>
          </div>
        </div>

        {/* Node type list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {NODE_TYPES.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all duration-200 border border-border bg-bg-surface shadow-sm hover:shadow-md"
              style={{ borderLeft: `4px solid ${item.color}` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15` }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-text-primary">
                  {item.label}
                </div>
                <div className="text-[11px] text-text-secondary truncate mt-0.5 font-medium">
                  {item.description}
                </div>
              </div>

              {/* Drag hint */}
              <div className="ml-auto flex-shrink-0 text-text-muted opacity-40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="7" r="1.5" />
                  <circle cx="15" cy="7" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="17" r="1.5" />
                  <circle cx="15" cy="17" r="1.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          className="px-4 py-3 flex-shrink-0 text-[11px] font-medium text-text-muted text-center uppercase tracking-wide"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          Drag & Drop to Canvas
        </div>
      </aside>
    );
  };
