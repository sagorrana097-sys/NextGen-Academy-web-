import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'katex/dist/katex.min.css';
import { setupFastCache } from './utils/speedOptimizer';

// Initialize NextGen Speed & Memory Cache Optimizer
setupFastCache();

// Safe global error handler for mobile browsers
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[NextGen Unhandled Promise Rejection]:', event.reason);
    if (event?.reason?.message?.includes('Failed to fetch dynamically imported module')) {
      const reloadKey = 'nextgen_promise_chunk_reload';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  });
}

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'));
if (!container.id) container.id = 'root';

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
