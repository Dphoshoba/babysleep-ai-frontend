import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

console.log("🚀 Application starting...");

try {
  const rootElement = document.getElementById('root');
  console.log("📦 Root element found:", rootElement);

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);
  console.log("✅ React root created");

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log("✅ App rendered");
} catch (error) {
  console.error("❌ Error during app initialization:", error);
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #4b5563; margin-bottom: 1rem;">Failed to initialize the application.</p>
        <pre style="
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          text-align: left;
        ">${error instanceof Error ? error.message : String(error)}</pre>
      </div>
    </div>
  `;
}



