import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select';
import { FaHome } from 'react-icons/fa';
import BackgroundImage from '../../../assets/BackgroundLogin.jpg'; 
import Logo from '../../../assets/Artesanías.png';

export const MaterialsForm = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    cantidadInsumo: '',
    precioUnitario: '',
    precioPorKilo: '',
    descripcion: '',
    lugarDeVenta: '',
    correoContacto: '',
    TelefonoContacto: '',
    TipoDeVenta: '',
    codigoEmpresa: '',
    idAdministrador: '' // Este se llenará más adelante
  });
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const idAdministrador = localStorage.getItem('userId');
        if (idAdministrador) {
          setFormData(prevData => ({
            ...prevData,
            idAdministrador // Asignamos directamente aquí
          }));

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
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Nombre.trim()) {
      newErrors.Nombre = 'El nombre es obligatorio.';
    }

    if (!formData.cantidadInsumo || formData.cantidadInsumo <= 0) {
      newErrors.cantidadInsumo = 'La cantidad debe ser un número positivo.';
    }

    if (!formData.precioUnitario || formData.precioUnitario <= 0) {
      newErrors.precioUnitario = 'El precio unitario debe ser un número positivo.';
    }

    if (!formData.precioPorKilo || formData.precioPorKilo <= 0) {
      newErrors.precioPorKilo = 'El precio por kilo debe ser un número positivo.';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    }

    if (!formData.lugarDeVenta.trim()) {
      newErrors.lugarDeVenta = 'El lugar de venta es obligatorio.';
    }

    if (!formData.correoContacto.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.correoContacto = 'El correo electrónico no es válido.';
    }

    if (!formData.TelefonoContacto.match(/^\+?[1-9]\d{1,14}$/)) {
      newErrors.TelefonoContacto = 'El número de teléfono no es válido.';
    }

    if (!formData.TipoDeVenta.trim()) {
      newErrors.TipoDeVenta = 'El tipo de venta es obligatorio.';
    }

    if (!formData.codigoEmpresa) {
      newErrors.codigoEmpresa = 'Debe seleccionar una empresa.';
    }

    if (!formData.idAdministrador) {
      newErrors.idAdministrador = 'ID del administrador es obligatorio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption) => {
    const codigoEmpresa = selectedOption ? selectedOption.value : '';
    setFormData(prevData => ({
      ...prevData,
      codigoEmpresa
    }));
  };

  const showNotification = (message, isError = false) => {
    setNotification(message);
    setNotificationType(isError ? 'error' : 'success');
    setTimeout(() => setNotification(''), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Por favor, asegúrate de completar correctamente el formulario.', true);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch('https://checkpoint-9tp4.onrender.com/api/insumo/nuevoInsumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido o expirado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (response.status === 201) {
        setNotification('Insumo creado exitosamente');
        setNotificationType('success');
        setFormData({
          Nombre: '',
          cantidadInsumo: '',
          precioUnitario: '',
          precioPorKilo: '',
          descripcion: '',
          lugarDeVenta: '',
          correoContacto: '',
          TelefonoContacto: '',
          TipoDeVenta: '',
          codigoEmpresa: '',
          idAdministrador: formData.idAdministrador // Asegúrate de que se mantenga el valor
        });
        setTimeout(() => navigate('/MaterialsForAdmin'), 2000);
      } else {
        throw new Error('Error al crear insumo');
      }
    } catch (error) {
      setErrors({ general: error.message });
      showNotification('Por favor, asegúrate de completar correctamente el formulario.', true);
      console.error('Error al enviar los datos:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${BackgroundImage})`, 
      }}
    >
      <NavLink to="/MaterialsForAdmin" className="absolute top-4 left-4">
        <FaHome className="text-darkyellow text-4xl" />
      </NavLink>
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-6 md:mx-10 lg:mx-20">
        <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Insumo</h1>
        
        {notification && (
          <div className={`bg-${notificationType === 'error' ? 'red' : 'green'}-100 border border-${notificationType === 'error' ? 'red' : 'green'}-400 text-${notificationType === 'error' ? 'red' : 'green'}-700 px-4 py-3 rounded relative mb-4`} role="alert">
            <span className="block sm:inline">{notification}</span>
          </div>
        )}
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Campo de Nombre */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="Nombre">
              Nombre
            </label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre del insumo"
            />
            {errors.Nombre && <p className="text-red-500 text-xs italic">{errors.Nombre}</p>}
          </div>

          {/* Selector de Empresa */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="codigoEmpresa">
              Empresa
            </label>
            <Select
              id="codigoEmpresa"
              name="codigoEmpresa"
              options={empresasOptions}
              onChange={handleSelectChange}
              className="basic-single"
              classNamePrefix="select"
            />
            {errors.codigoEmpresa && <p className="text-red-500 text-xs italic">{errors.codigoEmpresa}</p>}
          </div>

          {/* Campo de Cantidad */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="cantidadInsumo">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidadInsumo"
              name="cantidadInsumo"
              value={formData.cantidadInsumo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Cantidad"
            />
            {errors.cantidadInsumo && <p className="text-red-500 text-xs italic">{errors.cantidadInsumo}</p>}
          </div>

          {/* Campo de Precio Unitario */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="precioUnitario">
              Precio Unitario
            </label>
            <input
              type="number"
              id="precioUnitario"
              name="precioUnitario"
              value={formData.precioUnitario}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Precio unitario"
            />
            {errors.precioUnitario && <p className="text-red-500 text-xs italic">{errors.precioUnitario}</p>}
          </div>

          {/* Campo de Precio Por Kilo */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="precioPorKilo">
              Precio Por Kilo
            </label>
            <input
              type="number"
              id="precioPorKilo"
              name="precioPorKilo"
              value={formData.precioPorKilo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Precio por kilo"
            />
            {errors.precioPorKilo && <p className="text-red-500 text-xs italic">{errors.precioPorKilo}</p>}
          </div>

          {/* Campo de Descripción */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Descripción del insumo"
            />
            {errors.descripcion && <p className="text-red-500 text-xs italic">{errors.descripcion}</p>}
          </div>

          {/* Campo de Lugar de Venta */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="lugarDeVenta">
              Lugar de Venta
            </label>
            <input
              type="text"
              id="lugarDeVenta"
              name="lugarDeVenta"
              value={formData.lugarDeVenta}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Lugar de venta"
            />
            {errors.lugarDeVenta && <p className="text-red-500 text-xs italic">{errors.lugarDeVenta}</p>}
          </div>

          {/* Campo de Correo de Contacto */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="correoContacto">
              Correo de Contacto
            </label>
            <input
              type="email"
              id="correoContacto"
              name="correoContacto"
              value={formData.correoContacto}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Correo de contacto"
            />
            {errors.correoContacto && <p className="text-red-500 text-xs italic">{errors.correoContacto}</p>}
          </div>

          {/* Campo de Teléfono de Contacto */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="TelefonoContacto">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              id="TelefonoContacto"
              name="TelefonoContacto"
              value={formData.TelefonoContacto}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Teléfono de contacto"
            />
            {errors.TelefonoContacto && <p className="text-red-500 text-xs italic">{errors.TelefonoContacto}</p>}
          </div>

          {/* Campo de Tipo de Venta */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="TipoDeVenta">
              Tipo de Venta
            </label>
            <input
              type="text"
              id="TipoDeVenta"
              name="TipoDeVenta"
              value={formData.TipoDeVenta}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tipo de venta"
            />
            {errors.TipoDeVenta && <p className="text-red-500 text-xs italic">{errors.TipoDeVenta}</p>}
          </div>
          <button
            type="submit"
            className={` bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Crear Insumo'}
          </button>
        </form>
      </div>
    </div>
  );
};
