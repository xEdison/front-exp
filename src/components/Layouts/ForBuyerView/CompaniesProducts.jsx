import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar } from 'react-icons/fa';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import ProductoContext from '../../../Context/contextProducto';
import CartIcon from './CartIcon';
import { FaCoffee } from "react-icons/fa";
import { useParams } from 'react-router-dom';



export const CompaniesProducts = () => {
  const { productos, setProductos } = useContext(ProductoContext);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(0);
  const [calificacion, setCalificacion] = useState(0);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [opcionesCategorias, setOpcionesCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [carrito, setCarrito] = useState([]);

  const navigate = useNavigate();
  const { codigoempresa } = useParams();

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      try {
        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/comprador/ver/empresa/${codigoempresa}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!response.ok) throw new Error('Error al obtener productos');
        const resultado = await response.json();
        const datosProductos = resultado.length > 0 ? resultado[0] : [];
  
        setProductos(datosProductos);
        setProductosFiltrados(datosProductos); // Mostrar todos los productos por defecto
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, [setProductos, codigoempresa]);
  
  useEffect(() => {
    const obtenerCategorias = () => {
      const categorias = [
        { value: 'joyeria', label: 'Joyería' },
        { value: 'ropa_y_accesorios', label: 'Ropa y Accesorios' },
        { value: 'ceramica', label: 'Cerámica' },
        { value: 'muebles', label: 'Muebles' },
        { value: 'decoracion', label: 'Decoración' },
        { value: 'arte_textil', label: 'Arte Textil' },
        { value: 'productos_de_madera', label: 'Productos de Madera' },
        { value: 'cosmeticos_y_cuidado_personal', label: 'Cosméticos y Cuidado Personal' },
        { value: 'papeleria_y_libros', label: 'Papelería y Libros' },
        { value: 'articulos_para_el_hogar', label: 'Artículos para el Hogar' },
        { value: 'juguetes_y_juegos', label: 'Juguetes y Juegos' },
        { value: 'instrumentos_musicales', label: 'Instrumentos Musicales' },
        { value: 'productos_ecologicos', label: 'Productos Ecológicos' },
        { value: 'productos_para_mascotas', label: 'Productos para Mascotas' },
        { value: 'otro', label: 'Otro' },
      ];

      setOpcionesCategorias(categorias);
    };

    obtenerCategorias();
  }, []);

  useEffect(() => {
    const filtrarProductos = (terminoBusqueda, categoria, [precioMinimo, precioMaximo], calificacion) => {
      if (productos.length === 0) return;

      console.log('Filtrando con:', { terminoBusqueda, categoria, precioMinimo, precioMaximo, calificacion });

      const productosFiltrados = productos.filter(producto => {
        if (!producto) return false;

        const coincideBusqueda = (producto.nombre && producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())) ||
                                (producto.descripcion && producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()));
        const coincideCategoria = categoria === 'todos' || (producto.categoria && producto.categoria === categoria);

        const precio = parseFloat(producto.precio);
        const coincidePrecio = (precioMinimo === 0 && precioMaximo === 0) ||
                                (precio >= precioMinimo && precio <= precioMaximo);
        const coincideCalificacion = (calificacion === 0 || producto.rating === calificacion);

        console.log('Producto:', producto, 'Coincide con:', { coincideBusqueda, coincideCategoria, coincidePrecio, coincideCalificacion });

        return coincideBusqueda && coincideCategoria && coincidePrecio && coincideCalificacion;
      });

      console.log('Productos filtrados:', productosFiltrados);

      setProductosFiltrados(productosFiltrados);
    };

    filtrarProductos(terminoBusqueda, categoria, [precioMinimo, precioMaximo], calificacion);
  }, [terminoBusqueda, categoria, precioMinimo, precioMaximo, calificacion, productos]);

  useEffect(() => {
    // Cargar carrito desde localStorage al montar el componente
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage cada vez que cambia
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const [notificacionVisible, setNotificacionVisible] = useState(false);
  const [productoNotificado, setProductoNotificado] = useState(null);
  
  useEffect(() => {
    if (notificacionVisible) {
      const timer = setTimeout(() => {
        setNotificacionVisible(false);
      }, 3000); // La notificación desaparecerá después de 3 segundos
      return () => clearTimeout(timer); // Limpia el temporizador si se desmonta el componente
    }
  }, [notificacionVisible]);
  
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((p) => p.idProducto === producto.idProducto);
      if (productoExistente) {
        return prevCarrito.map((p) =>
          p.idProducto === producto.idProducto ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  
    // Mostrar notificación
    setProductoNotificado(producto);
    setNotificacionVisible(true);
  };
  
  const alternarFiltro = () => {
    setFiltroAbierto(!filtroAbierto);
  };

  const manejarCambioBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  const manejarCambioCategoria = (e) => {
    setCategoria(e.target.value);
  };

  const manejarCambioPrecio = () => {
    filtrarProductos(terminoBusqueda, categoria, [precioMinimo, precioMaximo], calificacion);
  };

  const manejarCambioCalificacion = (calificacion) => {
    setCalificacion(calificacion);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(precio);
  };

  const resetearPrecios = () => {
    setPrecioMinimo(0);
    setPrecioMaximo(0);
    filtrarProductos(terminoBusqueda, categoria, [0, 0], calificacion);
  };

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };
  const manejarIrACarrito = () => {
    navigate('/Cart'); // Cambiado a la ruta /Cart
  };
// Función para eliminar un producto del carrito
const eliminarDelCarrito = (idProducto) => {
// Aquí puedes actualizar el estado del carrito para eliminar el producto
// Ejemplo:
setCarrito(prevCarrito => prevCarrito.filter(producto => producto.idProducto !== idProducto));
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <div className={`md:w-1/4 lg:w-1/5 bg-white border rounded-lg overflow-hidden shadow-md p-4 ${filtroAbierto ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filtros</h2>
            <button onClick={alternarFiltro} className="text-darkyellow text-xl">
              {/* Add icon here if needed */}
            </button>
            {notificacionVisible && (
  <div className="fixed bottom-4 right-4 bg-white text-darkyellow py-2 px-4 rounded shadow-lg z-50 border-solid border-3 border-darkyellow flex flex-row"> <FaCoffee className='mr-2' size={24}/>
    {productoNotificado ? `Añadido ${productoNotificado.nombre} al carrito` : 'Producto añadido al carrito'}
  </div>
)}
          </div>
          <div>
            <div className="flex items-center mb-4">
              <label htmlFor="search" className="block text-sm font-bold mb-2"></label>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="search"
                  value={terminoBusqueda}
                  onChange={manejarCambioBusqueda}
                  className="shadow border rounded w-full py-2 px-3 pr-12"
                  placeholder="Buscar productos..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2">
                  <FaSearch className="text-darkpurple" />
                </div>
              </div>
            </div>
            <label htmlFor="category" className="block text-sm font-bold mb-2">Categoría</label>
            <select
              id="category"
              value={categoria}
              onChange={manejarCambioCategoria}
              className="shadow border rounded w-full py-2 px-3 mb-4"
            >
              <option value="todos">Todos</option>
              {opcionesCategorias.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
              ))}
            </select>
            <label className="block text-sm font-bold mb-2">Rango de precios</label>
            <div className="flex mb-4">
              <input
                type="number"
                value={precioMinimo}
                onChange={(e) => setPrecioMinimo(e.target.value)}
                className="shadow border rounded w-1/2 py-2 px-3 mr-2"
                placeholder="Min"
              />
              <input
                type="number"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(e.target.value)}
                className="shadow border rounded w-1/2 py-2 px-3"
                placeholder="Max"
              />
            </div>
            
            <button
              onClick={resetearPrecios}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded w-full"
            >
              Resetear filtros
            </button>
         
          </div>
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4">Artesanías</h2>
          {cargando ? (
            <div className="text-center">Cargando...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productosFiltrados.map(producto => (
                <div
                  key={producto.idProducto}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => abrirModal(producto)}
                >
                  <img
                    src={producto.urlProductoImg ? `https://imagenes224.blob.core.windows.net/imagenes224/${producto.urlProductoImg.split('/').pop()}` : 'path_to_default_image'}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-2xl font-semibold mt-5">{producto.nombre}</h3>
                  <p className="text-gray-600 mt-3 mb-3">{formatearPrecio(producto.precio)}</p>
                  <p className="text-gray-800 mb-3">{producto.descripcion}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarAlCarrito(producto);
                    }}
                    className="bg-darkpurple text-white py-2 px-4 rounded mt-3"
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    
      {/* Modal de Producto */}
      {modalAbierto && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 relative">
            <div className='flex justify-center'>
              <h3 className="text-xl font-bold mb-4">{productoSeleccionado.nombre}</h3>
            </div>
            <img
              src={productoSeleccionado.urlProductoImg ? `https://imagenes224.blob.core.windows.net/imagenes224/${productoSeleccionado.urlProductoImg.split('/').pop()}` : 'path_to_default_image'}
              alt={productoSeleccionado.nombre}
              className="w-full h-64 object-contain mb-4 rounded"
            />
            <p className="text-gray-600 mb-2"><span className='font-bold'>Precio:</span> {formatearPrecio(productoSeleccionado.precio)}</p>
            <p className="text-gray-800 mb-2"><span className='font-bold'>Descripción:</span> {productoSeleccionado.descripcion}</p>
            <p className="text-gray-600 mb-2"><span className='font-bold'>Materiales:</span> {productoSeleccionado.materiales}</p>
            <p className="text-gray-600 mb-2"><span className='font-bold'>Categoría:</span> {productoSeleccionado.categoria}</p>
            <p className="text-gray-600 mb-2"><span className='font-bold'>Cantidad disponible:</span> {productoSeleccionado.cantidad}</p>
            <p className="text-gray-600 mb-2"><span className='font-bold'>Publicado por:</span> {productoSeleccionado.publicadoPor}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => agregarAlCarrito(productoSeleccionado)}
                className="bg-darkpurple text-white py-2 px-4 rounded"
              >
                Agregar al carrito
              </button>
              <button
                onClick={cerrarModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <CartIcon /> {/* Añade el icono flotante */}
      <Footer />
    </div>
  );
};