import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// TODO(F5.1): importar tokens.css en primer lugar (Fase 5):
import './styles/base.css'
import { App } from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root no encontrado en index.html')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
