import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TimerWrapper from './timer.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TimerWrapper />
  </React.StrictMode>
);

