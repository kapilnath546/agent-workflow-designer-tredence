import { useCallback, useRef, useState, type FC } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useValidation } from '../../hooks/useValidation';
import { getDefaultNodeData } from '../../utils/nodeDefaults';
import { CanvasToolbar } from './CanvasToolbar';
import { StartNode } from '../nodes/StartNode';
import { TaskNode } from '../nodes/TaskNode';
import { ApprovalNode } from '../nodes/ApprovalNode';
import { AutomatedStepNode } from '../nodes/AutomatedStepNode';
import { EndNode } from '../nodes/EndNode';
import type { NodeType, WorkflowNodeData } from '../../types/workflow';

/**
 * All 5 custom node types registered with React Flow.
 * Keys must match the `type` field used when creating nodes.
 * Adding a 6th node type requires only adding one entry here + a new component.
 */
const nodeTypes = {
  START_NODE: StartNode,
  TASK_NODE: TaskNode,
  APPROVAL_NODE: ApprovalNode,
  AUTOMATED_STEP_NODE: AutomatedStepNode,
  END_NODE: EndNode,
};

interface Props {
  onOpenSandbox: () => void;
}

/**
 * WorkflowCanvas — wraps React Flow with the full canvas setup.
 * Must be rendered inside <ReactFlowProvider> (done in App.tsx).
 */
export const WorkflowCanvas: FC<Props> = ({ onOpenSandbox }) => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const addNode = useWorkflowStore((s) => s.addNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const { hasNoStart, hasMultipleStarts } = useValidation();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [isReady, setIsReady] = useState(false);

  // ── Connect handler ────────────────────────────────────────────────────────
  const onConnect = useCallback(
    (connection: Connection) => {
      // Prevent self-loops
      if (connection.source === connection.target) return;
      const newEdge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.7 },
      };
      setEdges(addEdge(newEdge, edges));
    },
    [edges, setEdges],
  );

  // ── Drop handler ───────────────────────────────────────────────────────────
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow-nodetype') as NodeType;
      if (!nodeType || !reactFlowWrapper.current) return;

      // Convert screen coords to React Flow canvas coords
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: getDefaultNodeData(nodeType),
      };

      addNode(newNode);
      selectNode(newNode.id);
    },
    [screenToFlowPosition, addNode, selectNode],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ── Node click → select ────────────────────────────────────────────────────
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  // ── Canvas click → deselect ────────────────────────────────────────────────
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const theme = useWorkflowStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div ref={reactFlowWrapper} className="relative flex-1 h-full">
      {/* Validation banners — shown at the top of the canvas */}
      {hasNoStart && !hasMultipleStarts && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-1.5 text-xs font-medium animate-fade-in"
          style={{ background: isDark ? '#f59e0b20' : '#f59e0b10', color: '#f59e0b', borderBottom: '1px solid #f59e0b30' }}
        >
          ⚠ Workflow needs a Start Node — drag one from the sidebar
        </div>
      )}
      {hasMultipleStarts && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-1.5 text-xs font-medium animate-fade-in"
          style={{ background: isDark ? '#ef444420' : '#ef444410', color: '#ef4444', borderBottom: '1px solid #ef444430' }}
        >
          ⚠ Only one Start Node is allowed — remove the extra one
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={() => setIsReady(true)}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        style={{ background: 'var(--bg)' }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: isDark ? '#4b5563' : '#9ca3af', strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={40}
          size={1}
          color={isDark ? '#1e293b' : '#f1f5f9'}
        />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            switch (node.type) {
              case 'START_NODE': return '#22c55e';
              case 'TASK_NODE': return '#3b82f6';
              case 'APPROVAL_NODE': return '#f59e0b';
              case 'AUTOMATED_STEP_NODE': return '#a855f7';
              case 'END_NODE': return '#ef4444';
              default: return '#6366f1';
            }
          }}
          maskColor={isDark ? 'rgba(15, 17, 26, 0.7)' : 'rgba(248, 249, 250, 0.7)'}
          style={{ background: isDark ? '#1a1d2e' : '#ffffff', border: '1px solid var(--border)' }}
        />
      </ReactFlow>

      {/* Floating toolbar — rendered on top of the canvas */}
      {isReady && <CanvasToolbar onOpenSandbox={onOpenSandbox} />}
    </div>
  );
};
