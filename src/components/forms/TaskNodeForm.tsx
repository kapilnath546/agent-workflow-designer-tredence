import type { FC } from 'react';
import type { TaskNodeData } from '../../types/workflow';
import { useNodeForm } from '../../hooks/useNodeForm';

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export const TaskNodeForm: FC<Props> = ({ nodeId, data }) => {
  const { handleChange } = useNodeForm(nodeId);
  const titleError = !data.title?.trim();

  const updateField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = data.customFields.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    handleChange({ customFields: updated });
  };

  const addField = () => {
    handleChange({ customFields: [...data.customFields, { key: '', value: '' }] });
  };

  const removeField = (index: number) => {
    handleChange({ customFields: data.customFields.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="form-label">Task Title <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.title}
          placeholder="e.g. Complete background check"
          onChange={(e) => handleChange({ title: e.target.value })}
        />
        {titleError && <p className="form-error">Title is required</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          className="form-input mt-1"
          value={data.description}
          placeholder="Describe what this task involves..."
          onChange={(e) => handleChange({ description: e.target.value })}
        />
      </div>

      <div>
        <label className="form-label">Assignee</label>
        <input
          className="form-input mt-1"
          type="text"
          value={data.assignee}
          placeholder="e.g. hr-team@company.com"
          onChange={(e) => handleChange({ assignee: e.target.value })}
        />
      </div>

      <div>
        <label className="form-label">Due Date</label>
        <input
          className="form-input mt-1"
          type="date"
          value={data.dueDate}
          onChange={(e) => handleChange({ dueDate: e.target.value })}
        />
      </div>

      <div>
        <label className="form-label">Custom Fields</label>
        <div className="flex flex-col gap-2 mt-1">
          {data.customFields.map((pair, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input
                className="form-input"
                type="text"
                placeholder="Key"
                value={pair.key}
                onChange={(e) => updateField(i, 'key', e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                className="form-input"
                type="text"
                placeholder="Value"
                value={pair.value}
                onChange={(e) => updateField(i, 'value', e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn btn-danger flex-shrink-0 px-2 py-1.5" onClick={() => removeField(i)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost mt-2 text-xs" onClick={addField}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Field
        </button>
      </div>
    </div>
  );
};
