import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './Context/AuthProvider';
import { WindowProvider } from './Context/WindowProvider.jsx'
import { MenuProvider } from './Context/MenuProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WindowProvider>
        <MenuProvider>
          <Router>
            <App />
          </Router>
        </MenuProvider>
      </WindowProvider>
    </AuthProvider>
  </StrictMode>,
)
