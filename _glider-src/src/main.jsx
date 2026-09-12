import React from 'react';
import { createRoot } from 'react-dom/client';
import GliderCalculator from './GliderCalculator.jsx';
import './styles.css';

const el = document.getElementById('glider-root');
if (el) createRoot(el).render(<GliderCalculator />);
