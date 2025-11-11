import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { AppFlowProvider } from './context/AppFlowContext.tsx'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppFlowProvider>
      <App />
    </AppFlowProvider>
  </StrictMode>,
)
