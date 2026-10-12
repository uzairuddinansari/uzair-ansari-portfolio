import{ createRoot } from 'react-dom/client' 
import './styles/theme.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import SiteProvider from './context/SiteProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SiteProvider>
      <App />
    </SiteProvider>
  </BrowserRouter>  
)
