import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select'; // Importar react-select
import { FaHome } from 'react-icons/fa';
import ProductoContext from '../../../Context/contextProducto'; // Asegúrate de que la ruta sea correcta
import { useEmpresa } from '../../../Context/contextEmpresa'; // Importar el contexto de empresas
import BackgroundImage from '../../../assets/BackgroundLogin.jpg'; 
import Logo from '../../../assets/Artesanías.png';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProducto } = useContext(ProductoContext);
  const { empresas, setEmpresas } = useEmpresa();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
    cantidad: '',
    publicadoPor: '',
    codigoempresa: '',
    idAdministrador: localStorage.getItem('userId') || '',
    materiales: '',
    empresasSeleccionadas: [], // Asegúrate de que este campo esté en el estado
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [fileName, setFileName] = useState('');
  


  const allowedTypes = ['image/jpeg', 'image/png'];

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const idAdministrador = localStorage.getItem('userId'); // Obtén el ID del administrador
        if (idAdministrador) {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token de autenticación no encontrado');
          }

          const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/empresa/consultarPorAdministrador/${idAdministrador}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Token de autenticación inválido o expirado');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
              const empresas = data[0];
              setEmpresas(empresas);
              const options = empresas.map(empresa => ({
                value: empresa.codigoempresa,
                label: empresa.nombre
              }));
              setEmpresasOptions(options);
            } else {
              throw new Error('Formato de datos inesperado');
            }
          } else {
            const text = await response.text();
            throw new Error('Respuesta no es JSON');
          }
        }
      } catch (error) {
        console.error('Error al obtener empresas:', error.message);
      }
    };

    fetchEmpresas();
  }, [setEmpresas]);

  useEffect(() => {
    // Simulando la obtención de categorías
    const fetchCategorias = () => {
      // Aquí debes reemplazar esto con la lógica para obtener las categorías reales
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
      
      setCategoriasOptions(categorias);
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ''); // Actualiza el nombre del archivo
  };

  const handleSelectChange = (selectedOptions, actionMeta) => {
    if (actionMeta.name === 'categoria') {
      setFormData(prevData => ({
        ...prevData,
        categoria: selectedOptions ? selectedOptions.value : ''
      }));
    } else if (actionMeta.name === 'codigoempresa') {
      const empresasSeleccionadas = selectedOptions ? selectedOptions.map(option => option.value) : [];
      const selectedEmpresa = selectedOptions ? selectedOptions[0] : null; // Tomar la primera empresa seleccionada
      const codigoempresa = empresasSeleccionadas.length > 0 ? empresasSeleccionadas[0] : '';
      const publicadoPor = selectedEmpresa ? selectedEmpresa.label : ''; // Obtener el nombre de la empresa seleccionada

      setFormData(prevData => ({
        ...prevData,
        empresasSeleccionadas: empresasSeleccionadas,
        codigoempresa: codigoempresa,
        publicadoPor: publicadoPor // Actualizar el campo publicadoPor
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validaciones
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es obligatoria';
    }
    if (formData.precio < 1000) { // Validación para que el precio no sea menor de 1000
      newErrors.precio = 'El precio no puede ser menor a 1000';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (formData.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser un número positivo mayor a 0';
    }
    if (formData.empresasSeleccionadas.length === 0) {
      newErrors.codigoempresa = 'Debes seleccionar al menos una empresa';
    }
    if (!file) {
      newErrors.file = 'La imagen del producto es obligatoria';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      console.log('Datos enviados:', formData);
      if (file) {
        console.log('Archivo enviado:', file);
      }
      
      setIsSubmitting(true); // Deshabilitar el botón mientras se procesa la solicitud
  
      try {
        await createProducto(formData, file);
        setNotification('Producto creado exitosamente');
        setTimeout(() => {
          setNotification('');
          navigate('/CraftforAdmins');
        }, 2000); // Muestra la notificación durante 2 segundos antes de redirigir
      } catch (error) {
        console.error('Error al crear producto:', error);
        setNotification('Error al crear el producto, intenta de nuevo');
      } finally {
        setIsSubmitting(false); // Rehabilitar el botón después de la solicitud
      }
    } else {
      setNotification('');
    }
  };


  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${BackgroundImage})`, 
      }}
    >
      <NavLink to="/" className="absolute top-4 left-4">
        <FaHome className="text-darkyellow text-4xl" />
      </NavLink>
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-6 md:mx-10 lg:mx-20">
        <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Producto</h1>
        {notification && (
          <div className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4`} role="alert">
            <span className="block sm:inline">{notification}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre del Producto"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="categoria">
              Categoría
            </label>
            <Select
              id="categoria"
              name="categoria"
              options={categoriasOptions}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Seleccionar Categoría"
              value={categoriasOptions.find(option => option.value === formData.categoria)}
              onChange={handleSelectChange}
            />
            {errors.categoria && <p className="text-red-500 text-xs italic">{errors.categoria}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="precio">
              Precio
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Precio del Producto"
              value={formData.precio}
              onChange={handleChange}
            />
            {errors.precio && <p className="text-red-500 text-xs italic">{errors.precio}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Descripción del Producto"
              rows="4"
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <p className="text-red-500 text-xs italic">{errors.descripcion}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="cantidad">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Cantidad en Stock"
              value={formData.cantidad}
              onChange={handleChange}
            />
            {errors.cantidad && <p className="text-red-500 text-xs italic">{errors.cantidad}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="codigoempresa">
              Empresa
            </label>
            <Select
              id="codigoempresa"
              name="codigoempresa"
              options={empresasOptions}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Seleccionar Empresa"
              isMulti
              value={empresasOptions.filter(option => formData.empresasSeleccionadas.includes(option.value))}
              onChange={handleSelectChange}
            />
            {errors.codigoempresa && <p className="text-red-500 text-xs italic">{errors.codigoempresa}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="materiales">
              Materiales
            </label>
            <input
              type="text"
              id="materiales"
              name="materiales"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Materiales del Producto"
              value={formData.materiales}
              onChange={handleChange}
            />
            <p className="text-gray-700 text-sm mt-2">¡Separa los materiales por comas! :)</p>
          </div>
          <div className="mb-4">
  <label className="block text-black text-sm font-bold mb-2" htmlFor="imagen">
    Imagen del Producto
  </label>
  <input
    type="file"
    id="imagen"
    name="imagen"
    accept="image/*"
    onChange={handleFileChange}
  />
  {errors.file && <p className="text-red-500 text-xs italic">{errors.file}</p>}
</div>

          <div className="flex">
          <button
          type="submit"
          className="bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded"
          disabled={isSubmitting} // Deshabilita el botón si isSubmitting es true
        >
          {isSubmitting ? 'Creando...' : 'Crear Producto'}
        </button>
          </div>
        </form>
      </div>
    </div>
  );
};
