// src/Context/contextEmpresa.js
import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const EmpresaContext = createContext();

// Crea un hook para usar el contexto
export const useEmpresa = () => {
    return useContext(EmpresaContext);
};

// Crea un proveedor para el contexto
export const EmpresaProvider = ({ children }) => {
    const [empresas, setEmpresas] = useState([]);

    return (
        <EmpresaContext.Provider value={{ empresas, setEmpresas }}>
            {children}
        </EmpresaContext.Provider>
    );
};
