import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { FaRegUserCircle } from 'react-icons/fa';

export const ProductFav = ({ isAuthenticated, userType }) => {
  const navigate = useNavigate();
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([
    { id: 1, name: 'Producto Favorito 1' },
    { id: 2, name: 'Producto Favorito 2' },
  ]);
  const [popularProducts, setPopularProducts] = useState([
    { id: 1, name: 'Producto Popular 1' },
    { id: 2, name: 'Producto Popular 2' },
  ]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/');
  };

 // Obtiene el rol de usuario desde el localStorage o establece 'anonimo' por defecto
 const userRole = localStorage.getItem('userType') || 'anonimo';

  const handleReportClick = () => {
    if (userType === 'vendedor') {
      navigate('/reporte-ventas');
    } else {
      setShowAccessMessage(true);
      setTimeout(() => setShowAccessMessage(false), 5000);
    }
  };

  const handleRemoveFavorite = (productId) => {
    const updatedFavorites = favoriteProducts.filter((product) => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
  };

  const handleRemovePopular = (productId) => {
    const updatedPopular = popularProducts.filter((product) => product.id !== productId);
    setPopularProducts(updatedPopular);
  };

   // Función para cerrar la sesión y borrar el localStorage
   const handleLogout = () => {
    localStorage.clear(); // Limpia el localStorage
    navigate('/'); // Redirige al login o página inicial
    window.location.reload(); // Recarga la página
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
      {/* Panel de Navegación */}
      <div className="md:w-1/4 lg:w-1/6 bg-cover bg-center p-4 text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <a href="/#" onClick={handleLogoClick} className="mb-6">
          <img src={Logo} alt="Logo" className="h-32 w-32" />
        </a>
        <nav className="flex flex-col items-center space-y-6">
          <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>

          {/* Solo muestra el perfil si el usuario no es anonimo */}
          {userRole !== 'anonimo' && (
            <NavLink to={userRole === 'comprador' ? '/ProfileComprador' : userRole === 'administrador' ? '/ProfileForAdmin' : '/ProfileForEmpleado'} className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">
              Perfil
            </NavLink>
          )}

          {/* Rutas para el rol 'comprador' o 'anonimo' */}
          {(userRole === 'comprador' || userRole === 'anonimo') && (
            <>
               <NavLink to="/ProductFav" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Favoritos</NavLink>
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
            </>
          )}

          {/* Rutas para los roles 'administrador' y 'empleado' */}
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

          {/* Ruta común para todos */}
          <NavLink to="/Help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>

          <button
            className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
            onClick={handleLoginClick}
          >
            Regresar
          </button>
           {/* Botón para cerrar sesión, visible solo si no es 'anonimo' */}
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

      <div className="flex flex-col justify-center items-center md:w-3/4 lg:w-5/6">
        <div className="w-full h-full flex justify-center items-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
          <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
            <h1 className="text-black text-3xl md:text-4xl font-bold mb-8">¡Bienvenido a Productos!</h1>

            <div className="w-full max-w-lg mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-darkyellow mb-4">Productos favoritos</h2>
                {favoriteProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-lg mb-2">
                    <span className="text-lg">{product.name}</span>
                    <button
                      className="text-darkyellow"
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
