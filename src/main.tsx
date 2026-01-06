import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CesiumProvider } from './context/Cesium.tsx'

createRoot(document.getElementById('root')!).render(

  <CesiumProvider>
    <App />
  </CesiumProvider>
)
