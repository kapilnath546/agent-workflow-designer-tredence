import { http, HttpResponse } from 'msw';
import { MOCK_AUTOMATIONS } from './automations';
import { runSimulation } from './simulate';
import type { SimulateRequest } from '../types/workflow';

/**
 * MSW v2 request handlers.
 *
 * These intercept fetch() calls in the browser (via the Service Worker)
 * and return mock responses, allowing full frontend development without
 * a real backend.
 */
export const handlers = [
  // ── GET /automations ────────────────────────────────────────────────────
  http.get('/automations', () => {
    return HttpResponse.json(MOCK_AUTOMATIONS);
  }),

  // ── POST /simulate ──────────────────────────────────────────────────────
  http.post('/simulate', async ({ request }) => {
    const body = (await request.json()) as SimulateRequest;
    const result = runSimulation(body);
    return HttpResponse.json(result);
  }),
];
