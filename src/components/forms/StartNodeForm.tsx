import type { FC } from 'react';
import type { StartNodeData } from '../../types/workflow';
import { useNodeForm } from '../../hooks/useNodeForm';

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export const StartNodeForm: FC<Props> = ({ nodeId, data }) => {
  const { handleChange } = useNodeForm(nodeId);
  const titleError = !data.startTitle?.trim();

  const updateMeta = (index: number, field: 'key' | 'value', value: string) => {
    const updated = data.metadata.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    handleChange({ metadata: updated });
  };

  const addMeta = () => {
    handleChange({ metadata: [...data.metadata, { key: '', value: '' }] });
  };

  const removeMeta = (index: number) => {
    handleChange({ metadata: data.metadata.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Workflow Start Title */}
      <div>
        <label className="form-label">
          Workflow Start Title <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.startTitle}
          placeholder="e.g. Employee Onboarding"
          onChange={(e) => handleChange({ startTitle: e.target.value })}
        />
        {titleError && <p className="form-error">Title is required</p>}
      </div>

      {/* Metadata */}
      <div>
        <label className="form-label">Metadata</label>
        <div className="flex flex-col gap-2 mt-1">
          {data.metadata.map((pair, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input
                className="form-input"
                type="text"
                placeholder="Key"
                value={pair.key}
                onChange={(e) => updateMeta(i, 'key', e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                className="form-input"
                type="text"
                placeholder="Value"
                value={pair.value}
                onChange={(e) => updateMeta(i, 'value', e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-danger flex-shrink-0 px-2 py-1.5"
                onClick={() => removeMeta(i)}
                title="Remove field"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost mt-2 text-xs" onClick={addMeta}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Field
        </button>
      </div>
    </div>
  );
};
