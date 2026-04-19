import type { FC } from 'react';
import { useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useValidation } from '../../hooks/useValidation';

interface Props {
  onOpenSandbox: () => void;
}

export const CanvasToolbar: FC<Props> = ({ onOpenSandbox }) => {
  const theme = useWorkflowStore((s) => s.theme);
  const toggleTheme = useWorkflowStore((s) => s.toggleTheme);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const { isValid } = useValidation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        importWorkflow(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    if (showClearConfirm) {
      clearWorkflow();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 px-3 py-2 rounded-xl animate-fade-in transition-all duration-300"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
    >
      {/* Node / edge count */}
      <div
        className="px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-2"
        style={{ color: 'var(--text-secondary)', background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        {nodes.length} node{nodes.length !== 1 ? 's' : ''} 
        <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
        {edges.length} edge{edges.length !== 1 ? 's' : ''}
      </div>

      <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

      {/* Theme Toggle */}
      <button 
        className="btn btn-ghost px-2 py-1.5 rounded-lg flex items-center justify-center transition-colors"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
            <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

      {/* Import */}
      <button id="toolbar-import" className="btn btn-ghost text-xs" onClick={handleImport}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Import
      </button>

      {/* Export */}
      <button id="toolbar-export" className="btn btn-ghost text-xs" onClick={handleExport}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Export
      </button>

      {/* Clear */}
      <button
        id="toolbar-clear"
        className="btn text-xs"
        onClick={handleClear}
        style={{
          background: showClearConfirm ? '#ef444415' : 'transparent',
          color: showClearConfirm ? '#ef4444' : 'var(--text-secondary)',
          border: `1px solid ${showClearConfirm ? '#ef444430' : 'transparent'}`,
        }}
      >
        {showClearConfirm ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Confirm?
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Clear
          </>
        )}
      </button>

      <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

      {/* Test Workflow */}
      <button
        id="toolbar-simulate"
        className="btn btn-primary text-xs"
        onClick={onOpenSandbox}
        style={{ position: 'relative' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Simulate
        {!isValid && (
          <span
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center shadow-sm"
            style={{ background: '#f59e0b', color: '#000', fontSize: 9, fontWeight: 700 }}
          >
            !
          </span>
        )}
      </button>
    </div>
  );
};
