import reactDom from 'react-dom/client'
import React from 'react'
import App from './App'

const container = document.getElementById('app')
const root = reactDom.createRoot(container)




root.render(<App />)