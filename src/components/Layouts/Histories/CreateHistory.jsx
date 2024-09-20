import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import BackgroundImage from '../../../assets/BackgroundLogin.jpg'; // Ajusta la ruta según tu estructura de proyecto
import Logo from '../../../assets/Artesanías.png'; // Ajusta la ruta según tu estructura de proyecto
import { FaHome } from 'react-icons/fa';

export const CreateStory = () => {
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    image: ''
  });

  const handleNewStoryChange = (e) => {
    const { name, value } = e.target;
    setNewStory(prevStory => ({
      ...prevStory,
      [name]: value
    }));
  };

  const handleNewStorySubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar el envío del formulario
    console.log('Story Submitted:', newStory);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${BackgroundImage})`, 
      }}
    >
    <NavLink to="/History" className="absolute top-4 left-4">
        <FaHome className="text-darkyellow text-4xl" />
      </NavLink>
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-8 md:mx-16 lg:mx-32">
        <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-6 text-center">Agregar Nueva Historia</h2>
        
        <form onSubmit={handleNewStorySubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="title">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newStory.title}
              onChange={handleNewStoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Título de la Historia"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="content">
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              value={newStory.content}
              onChange={handleNewStoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Contenido de la Historia"
              rows="6"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="image">
              Imagen URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={newStory.image}
              onChange={handleNewStoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="URL de la Imagen"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Agregar Historia
          </button>

          <p className="mt-4 text-center">
            <NavLink to="/History" className="text-darkyellow font-bold hover:underline">
              Regresar a Historias
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};
