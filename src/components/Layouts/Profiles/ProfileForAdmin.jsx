import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { EditableField } from './EditableField';

export const ProfileForAdmin = () => {
  const [name, setName] = useState('Nombre de Usuario');
  const [email, setEmail] = useState('usuario@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/profiles/administrador/${userId}`);
          if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
          }
          const data = await response.json();
  
          if (data.length > 0) {
            const usuario = data[0];
            setName(usuario.nombre || 'Nombre de Usuario');
            setEmail(usuario.correo_electronico || 'usuario@example.com');
            setPhone(usuario.telefono || '123-456-7890');
          } else {
            console.error('No se encontraron datos de usuario.');
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      };
  
      fetchUserData();
    }
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null); // Limpiar mensaje de éxito antes de guardar

    try {
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/profiles/administrador/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          correo_electronico: email,
          telefono: phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos del perfil');
      }

      const data = await response.json();
      console.log('Perfil actualizado:', data);

      setSuccessMessage('Perfil actualizado con éxito'); // Mostrar el mensaje de éxito

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Hubo un error al actualizar los datos.');
      console.error('Error al actualizar el perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="md:w-1/5 lg:w-1/6 bg-cover bg-center p-4 text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <a href="/#" className="mb-6">
          <img src={Logo} alt="Logo" className="h-32 w-32" />
        </a>
        <nav className="flex flex-col items-center space-y-6">
          <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>
          <NavLink to="/ProfileForAdmin" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Perfil</NavLink>
          <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
          <NavLink to="/MaterialsForAdmin" className="nav-link text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Insumos</NavLink>
            {/* Ruta común para todos */}
            <NavLink to="/Help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>

<button
  className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
  onClick={handleLoginClick}
>
  Regresar
</button>
          <button className="bg-darkpurple text-white px-4 py-2 rounded hover:bg-lightpurple mt-4 text-lg font-bold" onClick={handleLogout}>Cerrar Sesión</button>
        </nav>
      </div>

      <div className="flex flex-col justify-center items-center md:w-4/5 lg:w-5/6">
        <div className="w-full h-screen flex justify-center items-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
            <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
            <h1 className="text-black text-3xl md:text-5xl font-bold mb-8">¡Bienvenido al perfil de administrador!</h1>
            <EditableField label="Nombre:" value={name} onChange={(e) => setName(e.target.value)} />
            <EditableField label="Correo Electrónico:" value={email} onChange={(e) => setEmail(e.target.value)} />
            <EditableField label="Teléfono:" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <button className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-8 text-lg md:text-xl font-bold" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>} {/* Mensaje de éxito */}
          </div>
        </div>
      </div>
    </div>
  );
};
