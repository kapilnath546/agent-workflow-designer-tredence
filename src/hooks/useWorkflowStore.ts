import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import type { WorkflowNodeData, SimulateResponse } from '../types/workflow';
import { serializeWorkflow } from '../utils/graphUtils';

type WFNode = Node<WorkflowNodeData>;

interface Snapshot {
  nodes: WFNode[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: WFNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  simulationResult: SimulateResponse | null;
  isSimulating: boolean;

  // History tracking
  past: Snapshot[];
  future: Snapshot[];
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;

  // React Flow change handlers (for built-in drag/connect interactions)
  onNodesChange: (changes: NodeChange<WFNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // Direct setters
  setNodes: (nodes: WFNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  // Node operations
  addNode: (node: WFNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection
  selectNode: (nodeId: string | null) => void;

  // Simulation
  setSimulationResult: (result: SimulateResponse | null) => void;
  setIsSimulating: (val: boolean) => void;

  // Workflow-level operations
  clearWorkflow: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,

  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  past: [],
  future: [],

  // ---------------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------------
  saveSnapshot: () => {
    const { nodes, edges, past } = get();
    // Keep max 50 states to prevent memory bloat
    const newPast = [...past, { nodes, edges }].slice(-50);
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [{ nodes, edges }, ...future],
      selectedNodeId: null, // Clear selection to prevent invalid state
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: newFuture,
      selectedNodeId: null,
    });
  },

  // ---------------------------------------------------------------------------
  // React Flow change handlers
  // ---------------------------------------------------------------------------
  onNodesChange: (changes) => {
    set((state) => {
      // Only track node removals in history from here. Drags are too noisy.
      const isRemoval = changes.some((c) => c.type === 'remove');
      if (isRemoval) {
        state.saveSnapshot();
      }
      return { nodes: applyNodeChanges(changes, state.nodes) };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const isRemoval = changes.some((c) => c.type === 'remove');
      if (isRemoval) {
        state.saveSnapshot();
      }
      return { edges: applyEdgeChanges(changes, state.edges) };
    });
  },

  // ---------------------------------------------------------------------------
  // Direct setters
  // ---------------------------------------------------------------------------
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => {
    get().saveSnapshot();
    set({ edges });
  },

  // ---------------------------------------------------------------------------
  // Node operations
  // ---------------------------------------------------------------------------
  addNode: (node) => {
    get().saveSnapshot();
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNodeData: (nodeId, data) => {
    // We don't save a snapshot on every keystroke. 
    // In a real app, we'd debounce the saveSnapshot call or save on form blur.
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                ...data,
                type: n.data.type,
              } as WorkflowNodeData,
            }
          : n,
      ),
    }));
  },

  deleteNode: (nodeId) => {
    get().saveSnapshot();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  deleteEdge: (edgeId) => {
    get().saveSnapshot();
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    }));
  },

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  // ---------------------------------------------------------------------------
  // Simulation
  // ---------------------------------------------------------------------------
  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (val) => set({ isSimulating: val }),

  // ---------------------------------------------------------------------------
  // Workflow-level operations
  // ---------------------------------------------------------------------------
  clearWorkflow: () => {
    get().saveSnapshot();
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      simulationResult: null,
    });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    const payload = serializeWorkflow(nodes, edges);
    return JSON.stringify(payload, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const parsed = JSON.parse(json) as {
        nodes: Array<{ id: string; type: string; data: WorkflowNodeData }>;
        edges: Array<{ id: string; source: string; target: string }>;
      };

      const nodes: WFNode[] = parsed.nodes.map((n, i) => ({
        id: n.id,
        type: n.type,
        position: { x: 100 + i * 200, y: 100 + (i % 3) * 120 },
        data: n.data,
      }));

      const edges: Edge[] = parsed.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.7 },
      }));

      get().saveSnapshot();
      set({ nodes, edges, selectedNodeId: null, simulationResult: null });
    } catch {
      console.error('[WorkflowStore] Failed to parse imported workflow JSON.');
    }
  },
}));
