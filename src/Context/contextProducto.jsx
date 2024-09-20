import React, { createContext, useState, useEffect } from 'react';

const ProductoContext = createContext();

export const ProductoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null); // Estado para un solo producto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserId(user ? user.id : null);
    setLoading(false);
  }, []);

  const fetchProductos = async (url) => {
    if (!userId) {
      setError('Usuario no autenticado');
      return;
    }
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Error al obtener productos');
      const result = await response.json();
      setProductos(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const getProductosByIdAdministrador = () => {
    fetchProductos(`https://checkpoint-9tp4.onrender.com/api/producto/obtenerPorAdministrador/${userId}`);
  };

  const getProductosByCodigoEmpresa = (codigoempresa) => {
    fetchProductos(`https://checkpoint-9tp4.onrender.com/api/producto/obtenerPorEmpresa/${codigoempresa}`);
  };

  const createProducto = async (productData, file) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => formData.append(key, productData[key]));
    if (file) formData.append('urlProductoImg', file);

    try {
      const response = await fetch('https://checkpoint-9tp4.onrender.com/api/producto/nuevoProducto', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}. Detalle: ${errorText}`);
      }
      return await response.json();
    } catch (err) {
      setError(`Error al crear el producto: ${err.message}`);
      throw err;
    }
  };

  const updateProducto = async (idProducto, productoData, file) => {
    if (!userId) {
      setError('Usuario no autenticado');
      return;
    }

    const formData = new FormData();
    Object.keys(productoData).forEach(key => formData.append(key, productoData[key]));
    formData.append('idAdministrador', userId);
    if (file) formData.append('urlProductoImg', file);

    try {
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/producto/actualizarProducto/${idProducto}`, {
        method: 'PUT',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Error al actualizar el producto');
      return await response.json();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProducto = async (idProducto) => {
    try {
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/producto/eliminar/${idProducto}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Error al eliminar el producto');
      await response.json();
      setProductos(prevProductos => prevProductos.filter(p => p.idProducto !== idProducto));
    } catch (err) {
      setError(err.message);
    }
  };

  const getProductoById = async (idProducto) => {
    try {
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/producto/obtenerProducto/${idProducto}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Error al obtener el producto');
      const result = await response.json();
      setProducto(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProductoContext.Provider value={{ productos, producto, setProductos, createProducto, getProducto: getProductoById, getProductosByIdAdministrador, getProductosByCodigoEmpresa, updateProducto, deleteProducto, loading, error }}>
      {children}
    </ProductoContext.Provider>
  );
};

export default ProductoContext;
