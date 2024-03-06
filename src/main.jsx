import React from 'react'
import { Analytics } from "@vercel/analytics/react"
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './Store/store.js'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Provider store={store}>
    <App />
    <Analytics/>
    </Provider>
  </React.StrictMode>,
)
