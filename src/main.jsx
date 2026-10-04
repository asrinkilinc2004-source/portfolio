import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// A refresh starts a new introduction; in-app back navigation keeps its position.
window.history.scrollRestoration = 'manual'
if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
  window.history.replaceState(null, '', '/')
  sessionStorage.removeItem('portfolioScrollY')
  sessionStorage.removeItem('splashShown')
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
