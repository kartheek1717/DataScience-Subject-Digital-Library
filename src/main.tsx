import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LabProvider } from './context/LabContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LabProvider>
      <App />
    </LabProvider>
  </StrictMode>,
)
