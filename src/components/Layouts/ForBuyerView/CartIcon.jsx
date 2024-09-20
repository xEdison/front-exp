import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Cambiado el icono aquí
import { FaCartPlus } from "react-icons/fa";

const CartIcon = () => {
  const navigate = useNavigate();

  const handleIconClick = () => {
    // Redirige a la ruta del componente deseado al hacer clic en el ícono
    navigate('/cart');
  };

  return (
    <div
      className="fixed bottom-28 right-4 bg-darkpurple text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-lightpurple z-50"
      onClick={handleIconClick}
    >
      <FaCartPlus size={24} /> {/* Cambiado aquí también */}
    </div>
  );
};

export default CartIcon;
