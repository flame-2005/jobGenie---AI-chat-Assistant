// src/extension/popup.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Extension from './Extension';
import '../globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Extension />
  </React.StrictMode>
);