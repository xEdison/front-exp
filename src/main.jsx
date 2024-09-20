import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { EmpresaProvider } from './Context/contextEmpresa.jsx'
import { AuthProvider } from './Context/contextAuth.jsx'
import { ProductoProvider } from './Context/contextProducto.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <EmpresaProvider>
  <ProductoProvider>
  <AuthProvider>
        <App />
    </AuthProvider>
    </ProductoProvider>
    </EmpresaProvider>
)
