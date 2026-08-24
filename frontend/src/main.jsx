import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';
import { setupFastCache } from './utils/speedOptimizer';

// Initialize NextGen Speed & Memory Cache Optimizer
setupFastCache();

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'));
if (!container.id) container.id = 'root';

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
