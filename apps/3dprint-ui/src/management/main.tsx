import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/colors_and_type.css';
import '../styles/app.css';
import '../styles/admin.css';
import { AdminApp } from './AdminApp';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
