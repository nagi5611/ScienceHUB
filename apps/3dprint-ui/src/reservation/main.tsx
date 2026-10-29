import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/colors_and_type.css';
import '../styles/app.css';
import { ReservationApp } from './ReservationApp';
import { AccessGate } from './AccessGate';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AccessGate>
      <ReservationApp />
    </AccessGate>
  </React.StrictMode>
);
