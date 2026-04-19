import { useCallback } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import { serializeWorkflow } from '../utils/graphUtils';
import type { SimulateResponse } from '../types/workflow';

/**
 * useSimulate — Calls POST /simulate and stores results in Zustand.
 *
 * The hook is intentionally thin: all simulation logic lives in the MSW handler
 * (src/api/simulate.ts). This hook only manages the fetch lifecycle.
 */
export function useSimulate() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setSimulationResult = useWorkflowStore((s) => s.setSimulationResult);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const payload = serializeWorkflow(nodes, edges);

      const response = await fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Simulation failed: HTTP ${response.status}`);
      }

      const result: SimulateResponse = await response.json();
      setSimulationResult(result);
    } catch (err) {
      console.error('[useSimulate]', err);
      setSimulationResult({
        success: false,
        totalSteps: 0,
        executionSteps: [],
        errors: [(err as Error).message ?? 'Unknown simulation error'],
        warnings: [],
      });
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, setIsSimulating, setSimulationResult]);

  return { runSimulation, isSimulating, simulationResult };
}
