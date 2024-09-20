import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import BackgroundImage from '../../../assets/BackgroundLogin.jpg'; 
import { FaHome, FaTimes } from 'react-icons/fa';
import Logo from '../../../assets/Artesanías.png';
import Select from 'react-select'; 
import { useEvents } from '../../../Context/EventsContext';

export const EventsUpdateForm = () => {
  const { id } = useParams(); // Obtén el ID del evento desde la URL
  const [event, setEvent] = useState({
    nombreEvento: '',
    empresasAsistente: [],
    ubicacion: '',
    duracion: '',
    lugar: '',
    descripcion: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');
        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/evento/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        console.log('Evento obtenido:', data);
  
        setEvent(prevEvent => ({
          ...data,
        }));
      } catch (error) {
        console.error('Error al obtener el evento:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmpresas = async () => {
      try {
        const idAdministrador = localStorage.getItem('userId');
        if (!idAdministrador) {
          throw new Error('ID de administrador no encontrado');
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticación no encontrado');
        }
    
        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/empresa/consultarPorAdministrador/${idAdministrador}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token de autenticación inválido o expirado');
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log('Empresas:', data); // Agregado para depuración
    
          // Asegúrate de que estamos extrayendo el array correcto de datos
          const empresasArray = data[0];
          if (Array.isArray(empresasArray)) {
            const options = empresasArray.map((empresa) => ({
              value: empresa.codigoempresa,
              label: empresa.nombre,
            }));
            setEmpresasOptions(options);
          } else {
            throw new Error('Formato de datos inesperado');
          }
        } else {
          const text = await response.text();
          throw new Error('Respuesta no es JSON');
        }
      } catch (error) {
        console.error('Error al obtener empresas:', error.message);
      }
    };

    fetchEvent();
    fetchEmpresas();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en el localStorage');
        return;
      }

      const { nombreEvento, empresasAsistente, ubicacion, duracion, lugar, descripcion } = event;

      const simplifiedEvent = {
        nombreEvento,
        empresasAsistente,
        ubicacion,
        duracion,
        lugar,
        descripcion
      };

      console.log('Datos del evento a enviar:', simplifiedEvent);

      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/evento/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simplifiedEvent),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setNotification('Evento actualizado exitosamente');
      setTimeout(() => navigate('/EventsForAdmin'), 2000);
    } catch (error) {
      console.error('Error al guardar el evento:', error.message);
      setErrors({ ...errors, global: 'Error al actualizar el evento. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setEvent(prevEvent => ({
      ...prevEvent,
      empresasAsistente: selectedValues
    }));
  };

  const handleDescriptionChange = (e) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      descripcion: e.target.value
    }));
    setCharCount(e.target.value.length);
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
        <h1 className="text-2xl font-bold mb-6 text-center">Actualizar Evento</h1>
        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{notification}</span>
          </div>
        )}
        {errors.global && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errors.global}</span>
          </div>
        )}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="nombreEvento">
              Nombre del Evento
            </label>
            <input
              type="text"
              id="nombreEvento"
              name="nombreEvento"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre del Evento"
              value={event?.nombreEvento || ''}
              onChange={handleChange}
            />
            <p className="text-gray-600 text-sm mt-2">Indica el nombre del evento al que asistirá tu empresa</p>
            {errors.nombreEvento && <p className="text-red-500 text-xs italic">{errors.nombreEvento}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="empresasAsistente">
              Empresas Asistentes
            </label>
            <Select
              id="empresasAsistente"
              name="empresasAsistente"
              options={empresasOptions}
              isMulti
              value={empresasOptions.filter(option => event.empresasAsistente.includes(option.value))}
              onChange={handleSelectChange}
            />
            {errors.empresasAsistente && <p className="text-red-500 text-xs italic">{errors.empresasAsistente}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="ubicacion">
              Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ubicación del Evento"
              value={event?.ubicacion || ''}
              onChange={handleChange}
            />
            {errors.ubicacion && <p className="text-red-500 text-xs italic">{errors.ubicacion}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="duracion">
              Duración
            </label>
            <input
              type="text"
              id="duracion"
              name="duracion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Duración del Evento"
              value={event?.duracion || ''}
              onChange={handleChange}
            />
            {errors.duracion && <p className="text-red-500 text-xs italic">{errors.duracion}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="lugar">
              Lugar
            </label>
            <input
              type="text"
              id="lugar"
              name="lugar"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Lugar del Evento"
              value={event?.lugar || ''}
              onChange={handleChange}
            />
            {errors.lugar && <p className="text-red-500 text-xs italic">{errors.lugar}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Descripción del Evento"
              value={event?.descripcion || ''}
              onChange={handleDescriptionChange}
              rows="3"
            />
            <p className="text-gray-600 text-sm mt-2">Caracteres: {charCount}</p>
            {errors.descripcion && <p className="text-red-500 text-xs italic">{errors.descripcion}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-darkyellow hover:bg-darkyellow-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Evento'}
            </button>
           
          </div>
        </form>
      </div>
    </div>
  );
};

