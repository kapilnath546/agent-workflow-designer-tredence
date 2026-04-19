import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW browser worker instance.
 * Exported so main.tsx can await worker.start() before rendering.
 */
export const worker = setupWorker(...handlers);
