// CRITICAL: Import React and ReactDOM FIRST to ensure they load before any React-dependent libraries
// This forces Rollup/Vite to respect dependency order in production builds
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-is' // Explicitly import to ensure it's in react-core chunk

// Import React-dependent libraries explicitly to establish dependency chain
import 'zustand' // State management using createContext
import 'react-i18next' // i18n with React bindings
import '@sentry/react' // Error tracking with React integration

import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './i18n/config' // Initialize i18n

// Initialize Sentry as early as possible for error tracking
import { initializeSentry } from './config/sentry'
initializeSentry()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
