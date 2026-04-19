import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

async function prepare() {
  const { worker } = await import('./api/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

prepare().then(() => {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
