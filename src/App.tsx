import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { NodeSidebar } from './components/canvas/NodeSidebar';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeFormPanel } from './components/forms/NodeFormPanel';
import { SandboxPanel } from './components/sandbox/SandboxPanel';
import { useWorkflowStore } from './hooks/useWorkflowStore';

/**
 * App — Top-level layout.
 *
 * Layout: [NodeSidebar | WorkflowCanvas | NodeFormPanel (conditional)]
 *
 * ReactFlowProvider wraps the entire app so that useReactFlow() hooks
 * inside WorkflowCanvas and any child components can access the React Flow context.
 */
function AppContent() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const theme = useWorkflowStore((s) => s.theme);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if the user is typing in an input
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className={theme} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Left: Node palette sidebar */}
      <NodeSidebar />

      {/* Center: React Flow canvas (takes remaining space) */}
      <WorkflowCanvas onOpenSandbox={() => setIsSandboxOpen(true)} />

      {/* Right: Node configuration panel (only when a node is selected) */}
      {selectedNodeId && <NodeFormPanel />}

      {/* Sandbox / simulation slide-over */}
      <SandboxPanel
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
