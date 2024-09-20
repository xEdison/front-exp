import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { EditableField } from './EditableField';

export const ProfileForEmpleado = () => {
  const [name, setName] = useState('Nombre de Usuario');
  const [email, setEmail] = useState('usuario@example.com');
  const [phone, setPhone] = useState('123-456-7890');

  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/#');
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="md:w-1/5 lg:w-1/6 bg-cover bg-center p-4 text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <a href="/#" onClick={handleLogoClick} className="mb-6">
          <img src={Logo} alt="Logo" className="h-32 w-32" />
        </a>
        <nav className="flex flex-col items-center space-y-6">
        <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>
          <NavLink to="/profile" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Perfil</NavLink>
          <NavLink to="/product" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Producto</NavLink>
          <NavLink to="/help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>
          <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
          <button
            className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
            onClick={handleLoginClick}
          >
            Regresar
          </button>
        </nav>
      </div>
      <div className="flex flex-col justify-center items-center md:w-4/5 lg:w-5/6">
        <div className="w-full h-screen flex justify-center items-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
          <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
            <h1 className="text-black text-3xl md:text-5xl font-bold mb-8">Hola, empleado.</h1>
            <EditableField label="Nombre:" value={name} onChange={(e) => setName(e.target.value)} />
            <EditableField label="Correo:" value={email} onChange={(e) => setEmail(e.target.value)} />
            <EditableField label="Teléfono:" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-8 text-lg md:text-xl font-bold">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};