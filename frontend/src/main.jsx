import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupFastCache } from './utils/speedOptimizer';

// Initialize NextGen Speed & Memory Cache Optimizer
setupFastCache();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
