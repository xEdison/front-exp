import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';

export const Menu = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userType') || 'anonimo';

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="md:w-1/5 lg:w-1/6 bg-cover bg-center p-4 text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', margin: '0' }}>
        <a href="/" onClick={handleLogoClick} className="mb-6">
          <img src={Logo} alt="Logo" className="h-32 w-32" style={{ margin: '0' }} />
        </a>
        <nav className="flex flex-col items-center space-y-6">
          <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>

          {userRole !== 'anonimo' && (
            <NavLink to={userRole === 'comprador' ? '/ProfileComprador' : userRole === 'administrador' ? '/ProfileForAdmin' : '/ProfileForEmpleado'} className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">
              Perfil
            </NavLink>
          )}

          {(userRole === 'comprador') && (
            <>
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
            </>
          )}

          {userRole === 'anonimo' && (
            <>
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
            </>
          )}

          {(userRole === 'administrador' || userRole === 'empleado') && (
            <>
              <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
              <NavLink 
              to="/MaterialsForAdmin" 
              className="nav-link text-xl md:text-2xl text-white hover:text-darkyellow font-bold" 
              activeClassName="font-bold"
            >
              Insumos
            </NavLink>
            </>
          )}

          <NavLink to="/Help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>

          <button
            className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
            onClick={handleLoginClick}
          >
            Regresar
          </button>

          {userRole !== 'anonimo' && (
            <button
              className="bg-darkpurple text-white px-4 py-2 rounded hover:bg-lightpurple mt-4 text-lg font-bold"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          )}
        </nav>
      </div>
      <div className="flex flex-col justify-center items-center md:w-4/5 lg:w-5/6">
        <div className="w-full h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-80 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
            <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
            <h1 className="text-black text-3xl md:text-4xl font-bold mb-7">¡Bienvenido!</h1>
            <p className="text-darkyellow text-1xl mb-6 font-bold">Gracias por visitar Coffe Art.</p>
            <p className="text-gray-800 text-1xl mb-6">
            Esta plataforma ha sido creada con el objetivo de apoyar a los artesanos colombianos, brindándoles una herramienta para gestionar de manera eficiente sus negocios y potenciar la venta de sus productos.</p>

            <p className="text-gray-800 text-1xl mb-6">En Coffe Art, creemos en el valor de la artesanía y la cultura colombiana, y nos enorgullece ser parte de esta comunidad que trabaja día a día para mostrar su talento al mundo. Te invitamos a explorar nuestra web y a unirte a esta iniciativa que busca impulsar el crecimiento de los artesanos locales.</p>
            
            <p className="text-gray-800 text-lg mt-4">
  <span className="font-bold text-darkyellow">Has ingresado como: </span>
  <span className="font-semibold">{capitalizeFirstLetter(userRole)}</span>
</p>

          </div>
        </div>
      </div>
    </div>
  );
};
