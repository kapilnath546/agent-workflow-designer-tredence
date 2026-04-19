import type { FC } from 'react';
import { useSimulate } from '../../hooks/useSimulate';
import { useValidation } from '../../hooks/useValidation';
import { ExecutionLog } from './ExecutionLog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxPanel: FC<Props> = ({ isOpen, onClose }) => {
  const { runSimulation, isSimulating, simulationResult } = useSimulate();
  const { errors, isValid } = useValidation();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-40 flex flex-col animate-slide-in-right bg-bg-surface shadow-[-8px_0_40px_rgba(0,0,0,0.08)] transition-all duration-300"
        style={{
          width: 520,
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
                Workflow Simulation
              </h2>
              <p className="text-xs font-medium text-text-muted mt-0.5">
                Validate and run your workflow
              </p>
            </div>
          </div>
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-bg rounded-lg transition-colors" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* ── Validation Results ────────────────────────────────────────── */}
          <section>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
              Validation Results
            </h3>

            {errors.length === 0 ? (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: '#22c55e12', border: '1px solid #22c55e30', color: '#22c55e' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Workflow structure is valid
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#ef444412', border: '1px solid #ef444430', color: '#ef4444' }}
                  >
                    <span className="flex-shrink-0 mt-0.5">⚠</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Simulation warnings (from previous run) ───────────────────── */}
          {simulationResult?.warnings && simulationResult.warnings.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-text-muted">
                Simulation Warnings
              </h3>
              <div className="flex flex-col gap-2">
                {simulationResult.warnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#f59e0b12', border: '1px solid #f59e0b30', color: '#f59e0b' }}
                  >
                    <span className="flex-shrink-0">⚠</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Simulation errors (from previous run) ─────────────────────── */}
          {simulationResult?.errors && simulationResult.errors.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-text-muted">
                Simulation Errors
              </h3>
              <div className="flex flex-col gap-2">
                {simulationResult.errors.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#ef444412', border: '1px solid #ef444430', color: '#ef4444' }}
                  >
                    <span className="flex-shrink-0">✕</span>
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Run button ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              id="sandbox-run-btn"
              className="btn btn-primary"
              onClick={runSimulation}
              disabled={!isValid || isSimulating}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isSimulating ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: '2px solid #fff4',
                      borderTopColor: '#fff',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Simulating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run Simulation
                </>
              )}
            </button>

            {simulationResult && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: simulationResult.success ? '#22c55e12' : '#ef444412',
                  color: simulationResult.success ? '#22c55e' : '#ef4444',
                  border: `1px solid ${simulationResult.success ? '#22c55e30' : '#ef444430'}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {simulationResult.success ? '✓' : '✕'} {simulationResult.totalSteps} step{simulationResult.totalSteps !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* ── Execution Log ─────────────────────────────────────────────── */}
          {simulationResult && simulationResult.executionSteps.length > 0 && (
            <section>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3 text-text-muted"
              >
                Execution Log
              </h3>
              <div
                className="rounded-lg p-4"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <ExecutionLog steps={simulationResult.executionSteps} />
              </div>
            </section>
          )}
        </div>
      </aside>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};
