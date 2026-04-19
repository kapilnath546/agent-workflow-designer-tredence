import type { FC } from 'react';
import type { ApprovalNodeData } from '../../types/workflow';
import { useNodeForm } from '../../hooks/useNodeForm';

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'] as const;

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

export const ApprovalNodeForm: FC<Props> = ({ nodeId, data }) => {
  const { handleChange } = useNodeForm(nodeId);
  const titleError = !data.title?.trim();
  const thresholdWarning = data.autoApproveThreshold > 80;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="form-label">Approval Title <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.title}
          placeholder="e.g. Manager Sign-off"
          onChange={(e) => handleChange({ title: e.target.value })}
        />
        {titleError && <p className="form-error">Title is required</p>}
      </div>

      <div>
        <label className="form-label">Approver Role</label>
        <select
          className="form-input mt-1"
          value={data.approverRole}
          onChange={(e) =>
            handleChange({ approverRole: e.target.value as ApprovalNodeData['approverRole'] })
          }
        >
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">
          Auto-Approve Threshold (%)
          {thresholdWarning && (
            <span className="ml-2 text-xs" style={{ color: '#ef4444' }}>
              ⚠ High risk
            </span>
          )}
        </label>
        <input
          className="form-input mt-1"
          type="number"
          min={0}
          max={100}
          value={data.autoApproveThreshold}
          onChange={(e) => handleChange({ autoApproveThreshold: Number(e.target.value) })}
        />
        {thresholdWarning && (
          <p className="form-error">
            Threshold above 80% may bypass human review entirely.
          </p>
        )}
      </div>
    </div>
  );
};
