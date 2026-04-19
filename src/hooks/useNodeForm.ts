import { useCallback, useRef } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import type { WorkflowNodeData } from '../types/workflow';

/**
 * useNodeForm — Controlled form state hook for node configuration panels.
 *
 * Returns a stable `handleChange` that merges partial data updates into the
 * Zustand store with an optional 300ms debounce to avoid excessive re-renders
 * while typing.
 */
export function useNodeForm(nodeId: string) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Immediately update the store (no debounce).
   * Use for selects, checkboxes, and date pickers where instant feedback matters.
   */
  const handleChange = useCallback(
    (data: Partial<WorkflowNodeData>) => {
      updateNodeData(nodeId, data);
    },
    [nodeId, updateNodeData],
  );

  /**
   * Debounced update for text inputs (300ms) to reduce store churn while typing.
   */
  const handleChangeDebounced = useCallback(
    (data: Partial<WorkflowNodeData>) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        updateNodeData(nodeId, data);
      }, 300);
    },
    [nodeId, updateNodeData],
  );

  return { handleChange, handleChangeDebounced };
}
