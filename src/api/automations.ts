import type { AutomationAction } from '../types/workflow';

/**
 * Static mock automation actions returned by GET /automations.
 * In a real system, these would come from a database of integration actions.
 */
export const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'notify_slack',
    label: 'Notify Slack Channel',
    params: ['channel', 'message'],
  },
  {
    id: 'update_hris',
    label: 'Update HRIS Record',
    params: ['employeeId', 'field', 'value'],
  },
  {
    id: 'create_ticket',
    label: 'Create IT Ticket',
    params: ['summary', 'priority'],
  },
];
