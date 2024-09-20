import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { Bar } from 'react-chartjs-2';

export const SalesOverview = ({ isAuthenticated, userType }) => {
  const navigate = useNavigate();
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  // Obtiene el rol de usuario desde el localStorage
  const userRole = localStorage.getItem('userType');

  // Datos de ejemplo para las estadísticas de ventas
  const bestRatedProduct = {
    id: 1,
    name: '',
    rating: 0,
    totalSales: 0,
    revenue: 0, // En dólares
  };

  const totalSales = 0;
  const totalRevenue = 0; // En dólares
  const totalOrders = 0;

  const salesData = {
    labels: ['Ventas Totales', 'Ingresos Totales', 'Pedidos Totales'],
    datasets: [
      {
        label: 'Estadísticas de Ventas',
        data: [totalSales, totalRevenue, totalOrders],
        backgroundColor: ['#B89158', '#3B2A38', '#271D25'],
        borderWidth: 0, // Eliminar el borde alrededor de las barras
      },
    ],
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleReportClick = () => {
    if (userType === 'vendedor') {
      navigate('/reporte-ventas');
    } else {
      setShowAccessMessage(true);
      setTimeout(() => setShowAccessMessage(false), 5000);
    }
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
          <NavLink to={userRole === 'comprador' ? '/ProfileComprador' : userRole === 'administrador' ? '/ProfileForAdmin' : '/ProfileForEmpleado'} className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">
            Perfil
          </NavLink>

          {/* Rutas para el rol 'comprador' */}
          {userRole === 'comprador' && (
            <>
              <NavLink to="/ProductFav" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Producto Favorito</NavLink>
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
              <NavLink to="/CraftComprador" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Artesanías</NavLink>
              <NavLink to="/CompaniesComprador" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Compañías</NavLink>
              <NavLink to="/EventsComprador" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Eventos</NavLink>
            </>
          )}

          {/* Rutas para los roles 'administrador' y 'empleado' */}
          {(userRole === 'administrador' || userRole === 'empleado') && (
            <>
              <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
              
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
            <h1 className="text-black text-3xl md:text-4xl font-bold mb-8">Resumen de Ventas</h1>

            <div className="w-full max-w-lg mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-darkyellow mb-4">Producto Más Vendido</h2>
                <div className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-lg mb-2">
                  <span className="text-lg flex justify-center self-center">{bestRatedProduct.name}</span>
                </div>
                <p className="text-gray-700 mb-2">
                  Ventas Totales: <span className="font-bold">{bestRatedProduct.totalSales}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Ingresos Generados: <span className="font-bold">${bestRatedProduct.revenue}</span>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-darkyellow mb-4">Estadísticas Generales</h2>
                <div className="flex flex-col space-y-2 mb-4">
                  <p className="text-gray-700">
                    Ventas Totales: <span className="font-bold">{totalSales}</span>
                  </p>
                  <p className="text-gray-700">
                    Ingresos Totales: <span className="font-bold">${totalRevenue}</span>
                  </p>
                  <p className="text-gray-700">
                    Pedidos Totales: <span className="font-bold">{totalOrders}</span>
                  </p>
                </div>
                <div className="flex justify-center">
                  <Bar data={salesData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <button
              className="bg-darkyellow text-white px-6 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
              onClick={handleReportClick}
            >
              Generar Informe
            </button>

            {showAccessMessage && (
              <div className="mt-4 text-red-600 text-sm">
                No tienes permiso para generar informes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
