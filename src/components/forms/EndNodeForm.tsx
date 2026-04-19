import type { FC } from 'react';
import type { EndNodeData } from '../../types/workflow';
import { useNodeForm } from '../../hooks/useNodeForm';

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export const EndNodeForm: FC<Props> = ({ nodeId, data }) => {
  const { handleChange } = useNodeForm(nodeId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="form-label">End Message</label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.endMessage}
          placeholder="e.g. Onboarding workflow completed!"
          onChange={(e) => handleChange({ endMessage: e.target.value })}
        />
      </div>

      <div>
        <label className="form-label">Generate Summary Report</label>
        <div className="flex items-center gap-3 mt-2">
          <button
            role="switch"
            aria-checked={data.summaryFlag}
            onClick={() => handleChange({ summaryFlag: !data.summaryFlag })}
            className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none"
            style={{
              background: data.summaryFlag ? '#6366f1' : '#e5e7eb',
            }}
          >
            <span
              className="pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg transition-transform"
              style={{
                background: '#fff',
                transform: data.summaryFlag ? 'translateX(16px)' : 'translateX(0)',
              }}
            />
          </button>
          <span className="text-sm font-medium" style={{ color: data.summaryFlag ? '#111827' : '#6b7280' }}>
            {data.summaryFlag ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <p className="text-xs mt-2" style={{ color: '#8892a4' }}>
          When enabled, a summary PDF is generated at workflow completion.
        </p>
      </div>
    </div>
  );
};
