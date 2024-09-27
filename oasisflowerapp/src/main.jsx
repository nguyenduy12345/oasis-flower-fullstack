import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18next/i18n.js'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <App />
    </Router>  
)
