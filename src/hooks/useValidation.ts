import { useMemo } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import { validateWorkflow } from '../utils/graphUtils';

/**
 * useValidation — Derives real-time validation errors from the current graph.
 *
 * Re-computes whenever nodes or edges change. Errors are pure strings that
 * can be displayed in the toolbar banner or the sandbox panel.
 */
export function useValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const errors = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);
  const isValid = errors.length === 0;

  const startNodes = nodes.filter((n) => n.type === 'START_NODE');
  const hasNoStart = startNodes.length === 0;
  const hasMultipleStarts = startNodes.length > 1;

  return { errors, isValid, hasNoStart, hasMultipleStarts };
}
