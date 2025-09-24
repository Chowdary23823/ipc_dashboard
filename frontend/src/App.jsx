import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import Layout from './components/Layout'

function App() {
  

  return (
    
    <Router>
      <Layout>
       <AppRoutes />
       </Layout>
    </Router>
   
  )
}

export default App
