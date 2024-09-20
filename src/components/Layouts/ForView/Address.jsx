import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Image from '../../../assets/LogoCoffe.png'; 

export const Address = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-darkpurple flex items-center justify-center relative">
        <NavLink to="/#" className="absolute top-4 left-4">
          <FaHome className="text-darkyellow text-4xl" />
        </NavLink>
        <img src={Image} alt="HeaderMain" className="w-11/12 h-auto max-w-2xl p-4" style={{ imageRendering: 'auto' }} />
      </div>

      <div className="w-full md:w-2/3 bg-gray-200 flex flex-col justify-center p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-darkpurple">
            Dirección
          </h1>
          
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
            Aquí encontrarás la dirección y la información relevante sobre nuestra ubicación.
          </p>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-darkpurple">
            Oficina Principal
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
            Coffee Art S.A.<br />
            Calle Falsa 123, Oficina 456<br />
            Ciudad Imaginaria, 12345<br />
            País Fantasía
          </p>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-darkpurple">
            Horario de Atención
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
            Lunes a Viernes: 9:00 AM - 6:00 PM<br />
            Sábados: 10:00 AM - 2:00 PM<br />
            Domingos: Cerrado
          </p>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-darkpurple">
            Contacto
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Teléfono: +123 456 7890<br />
            Email: contacto@coffeeart.com<br />
            Sitio Web: <a href="" className="text-darkyellow hover:underline">www</a>
          </p>
        </div>
      </div>
    </div>
  );
};
