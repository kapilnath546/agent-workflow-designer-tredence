import { type FC, useEffect, useState } from 'react';
import type { AutomatedStepNodeData, AutomationAction } from '../../types/workflow';
import { useNodeForm } from '../../hooks/useNodeForm';

interface Props {
  nodeId: string;
  data: AutomatedStepNodeData;
}

export const AutomatedStepNodeForm: FC<Props> = ({ nodeId, data }) => {
  const { handleChange } = useNodeForm(nodeId);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const titleError = !data.title?.trim();

  // Fetch available automations from GET /automations on mount
  useEffect(() => {
    setIsLoading(true);
    fetch('automations')
      .then((r) => r.json())
      .then((actions: AutomationAction[]) => setAutomations(actions))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    // Reset params when action changes
    const resetParams: Record<string, string> = {};
    if (action) {
      for (const param of action.params) {
        resetParams[param] = data.actionParams[param] ?? '';
      }
    }
    handleChange({ actionId, actionParams: resetParams });
  };

  const handleParamChange = (param: string, value: string) => {
    handleChange({
      actionParams: { ...data.actionParams, [param]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="form-label">Step Title <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.title}
          placeholder="e.g. Send Welcome Email"
          onChange={(e) => handleChange({ title: e.target.value })}
        />
        {titleError && <p className="form-error">Title is required</p>}
      </div>

      <div>
        <label className="form-label">Action</label>
        {isLoading ? (
          <div className="text-xs mt-1" style={{ color: '#8892a4' }}>Loading actions…</div>
        ) : (
          <select
            className="form-input mt-1"
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action…</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic parameter inputs based on selected action */}
      {selectedAction ? (
        selectedAction.params.length > 0 && (
          <div>
            <label className="form-label" style={{ color: 'var(--primary)' }}>
              Action Parameters
            </label>
            <div className="flex flex-col gap-2 mt-1">
              {selectedAction.params.map((param) => (
                <div key={param}>
                  <label className="form-label text-xs capitalize">{param}</label>
                  <input
                    className="form-input mt-0.5"
                    type="text"
                    placeholder={`Enter ${param}…`}
                    value={data.actionParams[param] ?? ''}
                    onChange={(e) => handleParamChange(param, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div 
          className="px-3 py-5 mt-2 rounded-xl flex flex-col items-center justify-center text-center transition-colors"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'var(--primary)', opacity: 0.1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-[13px] font-bold text-text-primary tracking-tight">No Action Selected</span>
          <span className="text-[11px] text-text-secondary mt-1 max-w-[180px] leading-relaxed">Choose an action from the dropdown above to configure parameters.</span>
        </div>
      )}
    </div>
  );
};
